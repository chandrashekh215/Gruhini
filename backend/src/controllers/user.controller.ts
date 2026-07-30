import { Request, Response, NextFunction } from 'express';
import { prisma, serializeData } from '../lib/prisma.js';
import { AppError } from '../middlewares/error.middleware.js';
import { sendForgotPasswordOtp } from '../utils/mailer.js';
import { hashPassword } from '../utils/auth.js';

export async function exploreProducts(req: Request, res: Response, next: NextFunction) {
  try {
    const products = await prisma.product.findMany({
      where: { status: 'APPROVED' },
      include: {
        seller: {
          include: {
            user: true,
          },
        },
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

export async function viewSingleProduct(req: Request, res: Response, next: NextFunction) {
  try {
    const id = Number(req.params.id);
    const p = await prisma.product.findUnique({
      where: { id: BigInt(id) },
    });

    if (!p) {
      throw new AppError('Product Not Found', 409);
    }

    const dto = {
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
    };

    return res.json(serializeData(dto));
  } catch (error) {
    next(error);
  }
}

export async function getAllSellers(req: Request, res: Response, next: NextFunction) {
  try {
    const sellers = await prisma.seller.findMany({
      where: { isApproved: true },
      include: {
        user: true,
      },
    });

    const summaryList = sellers.map((s) => ({
      id: Number(s.id),
      businessName: s.businessName,
      profileImageUrl: s.user?.profileImageUrl || 'https://images.unsplash.com/photo-1556910103-1c02745aae4d?w=200&auto=format&fit=crop&q=60',
      rating: s.rating || 4.8,
    }));

    return res.json(serializeData(summaryList));
  } catch (error) {
    next(error);
  }
}

export async function getSellerDetails(req: Request, res: Response, next: NextFunction) {
  try {
    const id = Number(req.params.id);
    const s = await prisma.seller.findUnique({
      where: { id: BigInt(id) },
      include: {
        user: true,
        address: true,
      },
    });

    if (!s) {
      throw new AppError('Seller not found', 404);
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

export async function forgotPassword(req: Request, res: Response, next: NextFunction) {
  try {
    const email = req.query.email as string;

    if (!email) {
      throw new AppError('Email parameter is required', 400);
    }

    const user = await prisma.users.findUnique({ where: { email } });
    if (!user) {
      throw new AppError('User not found with this email', 409);
    }

    const otp = String(Math.floor(100000 + Math.random() * 900000));
    const expiryTime = new Date(Date.now() + 10 * 60 * 1000);

    await prisma.passwordResetOtp.create({
      data: {
        userId: user.id,
        otp,
        expiryTime,
      },
    });

    await sendForgotPasswordOtp(email, user.name, otp);

    return res.json('OTP SENT TO YOUR MAIL KINDLY VERIFY AND RESET PASSWORD');
  } catch (error) {
    next(error);
  }
}

export async function verifyOtpForgotPassword(req: Request, res: Response, next: NextFunction) {
  try {
    const { email, otp, newPassword } = req.body;

    const user = await prisma.users.findUnique({ where: { email } });
    if (!user) {
      throw new AppError('User not found', 409);
    }

    const validOtp = await prisma.passwordResetOtp.findFirst({
      where: {
        userId: user.id,
        otp,
        used: false,
        expiryTime: { gte: new Date() },
      },
      orderBy: { id: 'desc' },
    });

    if (!validOtp) {
      throw new AppError('Invalid or expired OTP', 400);
    }

    const hashedPassword = await hashPassword(newPassword);

    await prisma.$transaction([
      prisma.users.update({
        where: { id: user.id },
        data: { password: hashedPassword },
      }),
      prisma.passwordResetOtp.update({
        where: { id: validOtp.id },
        data: { used: true },
      }),
    ]);

    return res.json('New Password is Set Successfully');
  } catch (error) {
    next(error);
  }
}

export async function saveFcmToken(req: Request, res: Response, next: NextFunction) {
  try {
    const userId = Number(req.query.userId);
    const { fcmToken } = req.body;

    await prisma.users.update({
      where: { id: BigInt(userId) },
      data: { fcmToken },
    });

    return res.json('FCM token saved successfully');
  } catch (error) {
    next(error);
  }
}

export async function clearCache(req: Request, res: Response) {
  return res.send('Cache cleared');
}
