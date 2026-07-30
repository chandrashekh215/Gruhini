import { Request, Response, NextFunction } from 'express';
import { prisma, serializeData } from '../lib/prisma.js';
import { uploadImageToCloudinary } from '../utils/cloudinary.js';

export async function viewProfile(req: Request, res: Response, next: NextFunction) {
  try {
    const userId = req.user!.id;

    const user = await prisma.users.findUnique({
      where: { id: BigInt(userId) },
      include: { addresses: true },
    });

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const dto = {
      id: Number(user.id),
      name: user.name,
      email: user.email,
      contact: user.contact || '',
      profileImageUrl: user.profileImageUrl || '',
      addresses: user.addresses.map((a) => ({
        id: Number(a.id),
        addressLine: a.addressLine,
        pincode: a.pincode,
        state: a.state,
        city: a.city,
      })),
    };

    return res.json(serializeData(dto));
  } catch (error) {
    next(error);
  }
}

export async function updateProfile(req: Request, res: Response, next: NextFunction) {
  try {
    const userId = req.user!.id;
    const { name, contact } = req.body;

    await prisma.users.update({
      where: { id: BigInt(userId) },
      data: {
        ...(name ? { name } : {}),
        ...(contact ? { contact } : {}),
      },
    });

    return res.send('UPDATED PROFILE SUCCESSFULLY');
  } catch (error) {
    next(error);
  }
}

export async function addAddress(req: Request, res: Response, next: NextFunction) {
  try {
    const userId = req.user!.id;
    const { addressLine, pincode, state, city } = req.body;

    await prisma.address.create({
      data: {
        userId: BigInt(userId),
        addressLine,
        pincode,
        state,
        city,
      },
    });

    return res.send('ADDED ADDRESS SUCCESSFULLY');
  } catch (error) {
    next(error);
  }
}

export async function uploadProfilePicture(req: Request, res: Response, next: NextFunction) {
  try {
    const userId = req.user!.id;
    const file = req.file;

    let imageUrl = 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=300&auto=format&fit=crop&q=60';
    if (file) {
      imageUrl = await uploadImageToCloudinary(file.buffer);
    }

    await prisma.users.update({
      where: { id: BigInt(userId) },
      data: { profileImageUrl: imageUrl },
    });

    return res.send('Profile picture changed successfully');
  } catch (error) {
    next(error);
  }
}
