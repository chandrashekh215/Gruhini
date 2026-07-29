import { Request, Response, NextFunction } from 'express';
import { prisma, serializeData } from '../lib/prisma.js';
import { AppError } from '../middlewares/error.middleware.js';

export async function viewPending(req: Request, res: Response, next: NextFunction) {
  try {
    const products = await prisma.product.findMany({
      where: { status: 'PENDING' },
    });

    const dtoList = products.map((p) => ({
      id: p.id,
      name: p.name,
      price: p.price,
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
      sellerId: p.sellerId,
      image: p.image,
    }));

    return res.json(serializeData(dtoList));
  } catch (error) {
    next(error);
  }
}

export async function acceptItem(req: Request, res: Response, next: NextFunction) {
  try {
    const { selectedProducts } = req.body;

    if (!selectedProducts || !Array.isArray(selectedProducts)) {
      throw new AppError('Could not Process the request', 400);
    }

    await prisma.product.updateMany({
      where: { id: { in: selectedProducts.map((id: number) => Number(id)) } },
      data: { status: 'APPROVED', verified: true },
    });

    return res.send('APPROVED YOUR PRODUCT');
  } catch (error) {
    next(error);
  }
}

export async function rejectItem(req: Request, res: Response, next: NextFunction) {
  try {
    const { selectedProducts, message } = req.body;

    if (!selectedProducts || !Array.isArray(selectedProducts)) {
      throw new AppError('No products selected', 400);
    }

    await prisma.product.updateMany({
      where: { id: { in: selectedProducts.map((id: number) => Number(id)) } },
      data: { status: 'REJECTED', message },
    });

    return res.send(`PRODUCT REJECTED BECAUSE OF ${message || 'Admin rejection'}`);
  } catch (error) {
    next(error);
  }
}

export async function viewAllProducts(req: Request, res: Response, next: NextFunction) {
  try {
    const products = await prisma.product.findMany();

    const dtoList = products.map((p) => ({
      id: p.id,
      name: p.name,
      price: p.price,
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
      sellerId: p.sellerId,
      image: p.image,
    }));

    return res.json(serializeData(dtoList));
  } catch (error) {
    next(error);
  }
}

export async function viewAllSellers(req: Request, res: Response, next: NextFunction) {
  try {
    const sellers = await prisma.seller.findMany({
      include: { user: true, address: true },
    });

    const dtoList = sellers.map((s) => ({
      id: s.id,
      name: s.user?.name || '',
      contact: s.contactNo,
      address: s.address
        ? {
            id: s.address.id,
            addressLine: s.address.addressLine,
            pincode: s.address.pincode,
            state: s.address.state,
            city: s.address.city,
          }
        : null,
      businessName: s.businessName,
      image: s.user?.profileImageUrl || '',
      Description: s.description || '',
    }));

    return res.json(serializeData(dtoList));
  } catch (error) {
    next(error);
  }
}

export async function deleteProducts(req: Request, res: Response, next: NextFunction) {
  try {
    const { selectedProducts } = req.body;

    if (!selectedProducts || !Array.isArray(selectedProducts)) {
      throw new AppError('NO PRODUCTS SELECTED', 400);
    }

    await prisma.product.deleteMany({
      where: { id: { in: selectedProducts.map((id: number) => Number(id)) } },
    });

    return res.send('SUCCESSFULLY DELETED THE SELECTED PRODUCTS');
  } catch (error) {
    next(error);
  }
}

export async function deleteSeller(req: Request, res: Response, next: NextFunction) {
  try {
    const id = Number(req.params.id);

    await prisma.seller.delete({
      where: { id },
    });

    return res.send('SUCCESSFULLY DELETED THE SELLER');
  } catch (error) {
    next(error);
  }
}

export async function viewSellerAdminDetails(req: Request, res: Response, next: NextFunction) {
  try {
    const id = Number(req.params.id);

    const s = await prisma.seller.findUnique({
      where: { id },
      include: {
        user: true,
        orders: true,
      },
    });

    if (!s) {
      throw new AppError('Seller not found', 404);
    }

    const totalOrders = s.orders.length;
    const deliveredOrders = s.orders.filter((o) => o.orderStatus === 'DELIVERED').length;
    const pendingOrders = s.orders.filter((o) => o.orderStatus === 'PENDING').length;
    const totalRevenue = s.orders
      .filter((o) => o.orderStatus === 'DELIVERED')
      .reduce((sum, o) => sum + o.orderValue, 0);

    const dto = {
      sellerId: s.id,
      sellerName: s.user?.name || '',
      businessName: s.businessName,
      contact: s.contactNo,
      image: s.user?.profileImageUrl || '',
      totalOrders,
      deliveredOrders,
      pendingOrders,
      totalRevenue,
      isApproved: s.isApproved,
    };

    return res.json(serializeData(dto));
  } catch (error) {
    next(error);
  }
}

export async function viewOrdersSummary(req: Request, res: Response, next: NextFunction) {
  try {
    const { orderStatus } = req.query;

    const sellers = await prisma.seller.findMany({
      include: {
        user: true,
        orders: {
          where: orderStatus ? { orderStatus: orderStatus as string } : {},
        },
      },
    });

    const summaries = sellers.map((s) => ({
      sellerId: s.id,
      businessName: s.businessName,
      sellerName: s.user?.name || '',
      totalOrders: s.orders.length,
    }));

    return res.json(serializeData(summaries));
  } catch (error) {
    next(error);
  }
}

export async function viewOrdersBySeller(req: Request, res: Response, next: NextFunction) {
  try {
    const id = Number(req.params.id);
    const { Status } = req.query;

    const orders = await prisma.order.findMany({
      where: {
        sellerId: id,
        ...(Status ? { orderStatus: Status as string } : {}),
      },
      include: {
        user: true,
        deliveryAddress: true,
        orderItemList: {
          include: { product: true },
        },
      },
    });

    const responses = orders.map((order) => ({
      id: order.id,
      placedAt: order.placedAt,
      orderValue: order.orderValue,
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
            id: order.deliveryAddress.id,
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
        priceAtOrderTime: oi.priceAtOrderTime,
      })),
    }));

    return res.json(serializeData(responses));
  } catch (error) {
    next(error);
  }
}

export async function approveSeller(req: Request, res: Response, next: NextFunction) {
  try {
    const { selectedProducts } = req.body;

    if (selectedProducts && Array.isArray(selectedProducts)) {
      await prisma.seller.updateMany({
        where: { id: { in: selectedProducts.map((id: number) => Number(id)) } },
        data: { isApproved: true },
      });
    }

    return res.send('APPROVED SELLER');
  } catch (error) {
    next(error);
  }
}

export async function viewPendingSellers(req: Request, res: Response, next: NextFunction) {
  try {
    const pendingSellers = await prisma.seller.findMany({
      where: { isApproved: false },
      include: { user: true, address: true },
    });

    const dtoList = pendingSellers.map((s) => ({
      id: s.id,
      name: s.user?.name || '',
      contact: s.contactNo,
      address: s.address
        ? {
            id: s.address.id,
            addressLine: s.address.addressLine,
            pincode: s.address.pincode,
            state: s.address.state,
            city: s.address.city,
          }
        : null,
      businessName: s.businessName,
      image: s.user?.profileImageUrl || '',
      Description: s.description || '',
    }));

    return res.json(serializeData(dtoList));
  } catch (error) {
    next(error);
  }
}
