import { Request, Response, NextFunction } from 'express';
import { prisma, serializeData } from '../lib/prisma.js';
import { AppError } from '../middlewares/error.middleware.js';
import { sendOtpEmailHtml, sendSellerOrderUpdateEmail } from '../utils/mailer.js';
import bcrypt from 'bcryptjs';

export async function placeOrder(req: Request, res: Response, next: NextFunction) {
  try {
    const userId = req.user!.id;
    const { addressId } = req.body;

    const user = await prisma.users.findUnique({
      where: { id: userId },
      include: {
        cart: {
          include: {
            cartItems: {
              include: {
                product: {
                  include: {
                    seller: {
                      include: {
                        user: true,
                      },
                    },
                  },
                },
              },
            },
          },
        },
      },
    });

    if (!user || !user.cart || user.cart.cartItems.length === 0) {
      throw new AppError('Cart cannot be empty', 400);
    }

    const cartItems = user.cart.cartItems;
    const firstSeller = cartItems[0].product.seller;

    // Check stock
    for (const item of cartItems) {
      if (item.quantity > item.product.stock) {
        throw new AppError(`No stock available for: ${item.product.name}`, 409, 'INSUFFICIENT_STOCK');
      }
    }

    // Deduct stock
    for (const item of cartItems) {
      await prisma.product.update({
        where: { id: item.product.id },
        data: { stock: item.product.stock - item.quantity },
      });
    }

    const totalValue = cartItems.reduce(
      (sum, item) => sum + item.priceAtAddTime * item.quantity,
      0
    );

    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const hashedOtp = await bcrypt.hash(otp, 10);
    const expiration = new Date(Date.now() + 5 * 24 * 60 * 60 * 1000);

    const address = addressId
      ? await prisma.address.findUnique({ where: { id: Number(addressId) } })
      : null;

    const order = await prisma.order.create({
      data: {
        userId,
        sellerId: firstSeller.id,
        orderStatus: 'PENDING',
        deliveryTime: '3-4 Days',
        orderValue: totalValue,
        placedAt: new Date(),
        message: 'Order placed Successfully',
        hashedOtp,
        expiration,
        otpVerified: false,
        addressId: address ? address.id : undefined,
        orderItemList: {
          create: cartItems.map((ci) => ({
            productId: ci.productId,
            quantity: ci.quantity,
            priceAtOrderTime: ci.priceAtAddTime,
          })),
        },
      },
      include: {
        orderItemList: {
          include: {
            product: true,
          },
        },
      },
    });

    // Send emails
    let emailSent = false;
    try {
      emailSent = await sendOtpEmailHtml(user.email, otp, String(order.id));
    } catch (e) {
      console.error('Customer email failed:', e);
    }

    try {
      if (firstSeller.user?.email) {
        await sendSellerOrderUpdateEmail(
          firstSeller.user.email,
          firstSeller.user.name,
          String(order.id),
          'PLACED'
        );
      }
    } catch (e) {
      console.error('Seller email failed:', e);
    }

    // Clear user's cart items
    await prisma.cartItem.deleteMany({
      where: { cartId: user.cart.id },
    });

    const responseDto = {
      id: order.id,
      placedAt: order.placedAt,
      orderValue: order.orderValue,
      message: order.message,
      sellerDetails: {
        id: firstSeller.id,
        name: firstSeller.user?.name || '',
        contact: firstSeller.contactNo,
        businessName: firstSeller.businessName,
        address: address
          ? {
              id: address.id,
              addressLine: address.addressLine,
              pincode: address.pincode,
              state: address.state,
              city: address.city,
            }
          : null,
      },
      orderStatus: order.orderStatus,
      deliveryTime: order.deliveryTime,
      deliveryAddress: address
        ? {
            id: address.id,
            addressLine: address.addressLine,
            pincode: address.pincode,
            state: address.state,
            city: address.city,
          }
        : null,
      orderItems: order.orderItemList.map((oi) => ({
        productName: oi.product.name,
        productImage: oi.product.image,
        quantity: oi.quantity,
        priceAtOrderTime: oi.priceAtOrderTime,
      })),
      emailSent,
    };

    return res.json(serializeData(responseDto));
  } catch (error) {
    next(error);
  }
}

export async function cancelOrder(req: Request, res: Response, next: NextFunction) {
  try {
    const id = Number(req.params.id);

    const order = await prisma.order.findUnique({
      where: { id },
      include: { orderItemList: true },
    });

    if (!order) {
      throw new AppError('Order not found', 404);
    }

    // Restore stock
    for (const item of order.orderItemList) {
      await prisma.product.update({
        where: { id: item.productId },
        data: { stock: { increment: item.quantity } },
      });
    }

    await prisma.order.update({
      where: { id },
      data: { orderStatus: 'CANCELLED' },
    });

    return res.json({
      success: true,
      OrderId: id,
      OrderStatus: 'CANCELLED',
    });
  } catch (error) {
    next(error);
  }
}

export async function viewUserOrders(req: Request, res: Response, next: NextFunction) {
  try {
    const userId = req.user!.id;
    const { orderStatus } = req.query;

    const orders = await prisma.order.findMany({
      where: {
        userId,
        ...(orderStatus ? { orderStatus: orderStatus as any } : {}),
      },
      include: {
        seller: {
          include: {
            user: true,
          },
        },
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
      id: order.id,
      placedAt: order.placedAt,
      orderValue: order.orderValue,
      message: order.message,
      sellerDetails: {
        id: order.seller.id,
        name: order.seller.user?.name || '',
        contact: order.seller.contactNo,
        businessName: order.seller.businessName,
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

    return res.json(
      serializeData({
        success: true,
        'Seller-Details': responses,
      })
    );
  } catch (error) {
    next(error);
  }
}

export async function resendOtp(req: Request, res: Response, next: NextFunction) {
  try {
    const orderId = Number(req.params.orderId);

    const order = await prisma.order.findUnique({
      where: { id: orderId },
      include: { user: true },
    });

    if (!order) {
      throw new AppError('Order not found', 404);
    }

    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const hashedOtp = await bcrypt.hash(otp, 10);

    await prisma.order.update({
      where: { id: orderId },
      data: { hashedOtp },
    });

    await sendOtpEmailHtml(order.user.email, otp, String(order.id));

    return res.send('OTP resent to your email!');
  } catch (error) {
    next(error);
  }
}

export async function submitFeedback(req: Request, res: Response, next: NextFunction) {
  try {
    const userId = req.user!.id;
    const { orderId, rating, review } = req.body;

    const order = await prisma.order.findUnique({
      where: { id: Number(orderId) },
    });

    if (!order) {
      throw new AppError('Order not found', 404);
    }

    await prisma.feedback.create({
      data: {
        orderId: Number(orderId),
        userId,
        sellerId: order.sellerId,
        rating: Number(rating),
        comment: review,
      },
    });

    return res.send('Feedback submitted successfully');
  } catch (error) {
    next(error);
  }
}
