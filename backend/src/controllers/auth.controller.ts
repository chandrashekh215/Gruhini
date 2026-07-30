import { Request, Response, NextFunction } from 'express';
import { prisma, serializeData } from '../lib/prisma.js';
import { comparePassword, generateJwtToken, hashPassword } from '../utils/auth.js';
import { AppError } from '../middlewares/error.middleware.js';

export async function login(req: Request, res: Response, next: NextFunction) {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      throw new AppError('Email and password are required', 400);
    }

    const user = await prisma.users.findUnique({
      where: { email },
    });

    if (!user) {
      throw new AppError('Invalid email or password', 400);
    }

    const isMatch = await comparePassword(password, user.password);
    if (!isMatch) {
      throw new AppError('Invalid email or password', 400);
    }

    const roles = user.role.map((r) => r.toString());
    const token = generateJwtToken(Number(user.id), user.email, roles);

    return res.json({ token });
  } catch (error) {
    next(error);
  }
}

export async function registerUser(req: Request, res: Response, next: NextFunction) {
  try {
    const { name, email, contact, password, addressDto } = req.body;

    if (!name || !email || !password) {
      throw new AppError('Name, email, and password are required', 400);
    }

    const existingUser = await prisma.users.findUnique({ where: { email } });
    if (existingUser) {
      throw new AppError('User already registered with this email', 400);
    }

    const hashedPassword = await hashPassword(password);

    const user = await prisma.users.create({
      data: {
        name,
        email,
        contact,
        password: hashedPassword,
        role: ['ROLE_USER'],
        cart: {
          create: {},
        },
        addresses: addressDto
          ? {
              create: {
                addressLine: addressDto.addressLine,
                pincode: addressDto.pincode,
                state: addressDto.state,
                city: addressDto.city,
              },
            }
          : undefined,
      },
    });

    return res.json({
      success: true,
      message: 'User registered successfully',
      User: user.name,
    });
  } catch (error) {
    next(error);
  }
}

export async function registerSeller(req: Request, res: Response, next: NextFunction) {
  try {
    const { name, email, phone, businessName, categories, description, addressDto } = req.body;

    let user = await prisma.users.findUnique({ where: { email } });

    if (!user) {
      const defaultPass = await hashPassword('seller@123456');
      user = await prisma.users.create({
        data: {
          name,
          email,
          contact: phone,
          password: defaultPass,
          role: ['ROLE_USER', 'ROLE_SELLER'],
          cart: { create: {} },
        },
      });
    } else {
      if (!user.role.includes('ROLE_SELLER')) {
        await prisma.users.update({
          where: { id: user.id },
          data: {
            role: [...user.role, 'ROLE_SELLER'],
          },
        });
      }
    }

    const existingSeller = await prisma.seller.findUnique({ where: { userId: user.id } });
    if (existingSeller) {
      throw new AppError('Seller profile already exists for this account', 400);
    }

    const createdAddress = addressDto
      ? await prisma.address.create({
          data: {
            addressLine: addressDto.addressLine,
            pincode: addressDto.pincode,
            state: addressDto.state,
            city: addressDto.city,
            userId: user.id,
          },
        })
      : null;

    const seller = await prisma.seller.create({
      data: {
        businessName: businessName || `${name}'s Kitchen`,
        contactNo: phone || user.contact || '',
        userId: user.id,
        addressId: createdAddress ? createdAddress.id : undefined,
        categories: categories || ['THALI'],
        description,
        isApproved: false,
      },
    });

    return res.json({
      success: true,
      message: 'Login successful as a seller',
      seller: {
        name,
        businessName: seller.businessName,
      },
    });
  } catch (error) {
    next(error);
  }
}

export async function getHome(req: Request, res: Response) {
  if (req.user) {
    return res.json({
      authenticated: true,
      user: {
        id: String(req.user.id),
        name: req.user.email,
        email: req.user.email,
        type: 'customer',
      },
      message: 'Welcome to Gruhani!',
    });
  }

  return res.json({
    authenticated: false,
    message: 'Please login to continue',
  });
}

export async function logout(req: Request, res: Response) {
  return res.json('Logged out successfully');
}

export async function deleteUser(req: Request, res: Response, next: NextFunction) {
  try {
    const id = Number(req.params.id);
    const user = await prisma.users.findUnique({ where: { id: BigInt(id) } });

    if (!user) {
      throw new AppError('Check if you are registered before deleting account', 409);
    }

    await prisma.users.delete({ where: { id: BigInt(id) } });
    return res.json('Successfully Deleted User Account');
  } catch (error) {
    next(error);
  }
}
