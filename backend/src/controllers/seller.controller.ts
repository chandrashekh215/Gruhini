import { Request, Response, NextFunction } from 'express';
import { prisma, serializeData } from '../lib/prisma.js';
import { AppError } from '../middlewares/error.middleware.js';
import { uploadImageToCloudinary } from '../utils/cloudinary.js';
import bcrypt from 'bcryptjs';

export async function addProduct(req: Request, res: Response, next: NextFunction) {
  try {
    const userId = req.user!.id;
    const seller = await prisma.seller.findUnique({
      where: { userId: BigInt(userId) },
    });

    if (!seller) {
      throw new AppError('Seller profile not found for this account', 400);
    }

    const dataJson = req.body.data ? (typeof req.body.data === 'string' ? JSON.parse(req.body.data) : req.body.data) : req.body;
    const file = req.file;

    let imageUrl = 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=500&auto=format&fit=crop&q=60';
    if (file) {
      imageUrl = await uploadImageToCloudinary(file.buffer);
    }

    const product = await prisma.product.create({
      data: {
        name: dataJson.name,
        price: dataJson.price,
        category: dataJson.category || dataJson.categories || 'THALI',
        subcategory: dataJson.subcategory || '',
        description: dataJson.description || '',
        stock: Number(dataJson.stock || 10),
        discount: Number(dataJson.discount || 0),
        deliveryTime: dataJson.deliveryTime || '30-45 mins',
        image: imageUrl,
        sellerId: seller.id,
        status: 'PENDING',
      },
    });

    return res.json(
      serializeData({
        success: true,
        message: 'Seller registered successfully',
        product_id: Number(product.id),
      })
    );
  } catch (error) {
    next(error);
  }
}

export async function getSellerProducts(req: Request, res: Response, next: NextFunction) {
  try {
    const userId = req.user!.id;
    const { productStatus } = req.query;

    const seller = await prisma.seller.findUnique({
      where: { userId: BigInt(userId) },
    });

    if (!seller) {
      return res.json([]);
    }

    const products = await prisma.product.findMany({
      where: {
        sellerId: seller.id,
        ...(productStatus ? { status: productStatus as any } : {}),
      },
    });

    const dtoList = products.map((p) => ({
      id: Number(p.id),
      name: p.name,
      price: Number(p.price),
      categories: p.category,
      subcategory: p.subcategory || '',
      description: p.description || '',
      stock: p.stock,
      status: p.status,
      rating: p.rating || 4.5,
      discount: p.discount || 0,
      verified: p.verified,
      message: p.message || '',
      deliveryTime: p.deliveryTime,
      badge: p.badge || '',
      sellerId: Number(p.sellerId),
      image: p.image,
    }));

    return res.json(serializeData(dtoList));
  } catch (error) {
    next(error);
  }
}

export async function deleteProduct(req: Request, res: Response, next: NextFunction) {
  try {
    const id = Number(req.query.id || req.params.id);

    await prisma.product.delete({
      where: { id: BigInt(id) },
    });

    return res.json({
      message: 'product deleted successfully',
      success: true,
    });
  } catch (error) {
    next(error);
  }
}

export async function updateProduct(req: Request, res: Response, next: NextFunction) {
  try {
    const { id, name, price, stock, description, deliveryTime, discount, category } = req.body;

    await prisma.product.update({
      where: { id: BigInt(id) },
      data: {
        ...(name ? { name } : {}),
        ...(price !== undefined ? { price } : {}),
        ...(stock !== undefined ? { stock: Number(stock) } : {}),
        ...(description ? { description } : {}),
        ...(deliveryTime ? { deliveryTime } : {}),
        ...(discount !== undefined ? { discount: Number(discount) } : {}),
        ...(category ? { category } : {}),
      },
    });

    return res.send('PRODUCT UPDATED SUCCESSFULLY');
  } catch (error) {
    next(error);
  }
}

export async function acceptOrder(req: Request, res: Response, next: NextFunction) {
  try {
    const orderIds: number[] = req.body;

    await prisma.order.updateMany({
      where: {
        id: { in: orderIds.map((id) => BigInt(id)) },
      },
      data: { orderStatus: 'ACCEPTED' },
    });

    return res.send('ORDER ACCEPTED');
  } catch (error) {
    next(error);
  }
}

export async function rejectOrder(req: Request, res: Response, next: NextFunction) {
  try {
    const orderIds: number[] = req.body;

    await prisma.order.updateMany({
      where: {
        id: { in: orderIds.map((id) => BigInt(id)) },
      },
      data: { orderStatus: 'REJECTED' },
    });

    return res.send('ORDER REJECTED');
  } catch (error) {
    next(error);
  }
}

export async function viewSellerOrders(req: Request, res: Response, next: NextFunction) {
  try {
    const userId = req.user!.id;
    const { orderStatus } = req.query;

    const seller = await prisma.seller.findUnique({
      where: { userId: BigInt(userId) },
    });

    if (!seller) {
      return res.json({ success: true, 'User details': [] });
    }

    const orders = await prisma.order.findMany({
      where: {
        sellerId: seller.id,
        ...(orderStatus ? { orderStatus: orderStatus as any } : {}),
      },
      include: {
        user: true,
        deliveryAddress: true,
        orderItemList: {
          include: {
            product: true,
          },
        },
      },
      orderBy: { placedAt: 'desc' },
    });

    const responses = orders.map((order) => ({
      id: Number(order.id),
      placedAt: order.placedAt,
      orderValue: Number(order.orderValue),
      message: order.message,
      userDetails: {
        name: order.user.name,
        email: order.user.email,
        contact: order.user.contact || '',
      },
      orderStatus: order.orderStatus,
      deliveryTime: order.deliveryTime,
      deliveryAddress: order.deliveryAddress
        ? {
            id: Number(order.deliveryAddress.id),
            addressLine: order.deliveryAddress.addressLine,
            pincode: order.deliveryAddress.pincode,
            state: order.deliveryAddress.state,
            city: order.deliveryAddress.city,
          }
        : null,
      orderItems: order.orderItemList.map((oi) => ({
        productName: oi.product.name,
        productImage: oi.product.image,
        quantity: oi.quantity,
        priceAtOrderTime: Number(oi.priceAtOrderTime),
      })),
    }));

    return res.json(
      serializeData({
        success: true,
        'User details': responses,
      })
    );
  } catch (error) {
    next(error);
  }
}

export async function verifyOtp(req: Request, res: Response, next: NextFunction) {
  try {
    const orderId = Number(req.query.orderId);
    const otp = req.query.otp as string;

    const order = await prisma.order.findUnique({
      where: { id: BigInt(orderId) },
    });

    if (!order || !order.hashedOtp) {
      return res.send('OTP NOT VERIFIED ENTER CORRET ONE');
    }

    const isMatch = await bcrypt.compare(otp, order.hashedOtp);
    if (isMatch) {
      await prisma.order.update({
        where: { id: BigInt(orderId) },
        data: {
          otpVerified: true,
          orderStatus: 'DELIVERED',
        },
      });
      return res.send('OTP Verified');
    }

    return res.send('OTP NOT VERIFIED ENTER CORRET ONE');
  } catch (error) {
    next(error);
  }
}

export async function updateSellerProfile(req: Request, res: Response, next: NextFunction) {
  try {
    const userId = req.user!.id;
    const { businessName, phone, description } = req.body;

    await prisma.seller.update({
      where: { userId: BigInt(userId) },
      data: {
        ...(businessName ? { businessName } : {}),
        ...(phone ? { contactNo: phone } : {}),
        ...(description ? { description } : {}),
      },
    });

    return res.send('UPDATED PROFILE SUCCESFULLY');
  } catch (error) {
    next(error);
  }
}

export async function getSellerProfile(req: Request, res: Response, next: NextFunction) {
  try {
    const userId = req.user!.id;

    const s = await prisma.seller.findUnique({
      where: { userId: BigInt(userId) },
      include: {
        user: true,
        address: true,
      },
    });

    if (!s) {
      throw new AppError('Seller profile not found', 404);
    }

    const dto = {
      id: Number(s.id),
      name: s.user?.name || '',
      contact: s.contactNo,
      address: s.address
        ? {
            id: Number(s.address.id),
            addressLine: s.address.addressLine,
            pincode: s.address.pincode,
            state: s.address.state,
            city: s.address.city,
          }
        : null,
      businessName: s.businessName,
      image: s.user?.profileImageUrl || '',
      Description: s.description || '',
    };

    return res.json(serializeData(dto));
  } catch (error) {
    next(error);
  }
}
