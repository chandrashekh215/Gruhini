import { Request, Response, NextFunction } from 'express';
import { prisma, serializeData } from '../lib/prisma.js';
import { AppError } from '../middlewares/error.middleware.js';

export async function addToCart(req: Request, res: Response, next: NextFunction) {
  try {
    const userId = req.user!.id;
    const { productid, quantity } = req.body;

    if (!productid || quantity < 1) {
      throw new AppError('Invalid product ID or quantity', 400);
    }

    const product = await prisma.product.findUnique({
      where: { id: BigInt(productid) },
    });

    if (!product) {
      throw new AppError('Product Not Found', 409);
    }

    let cart = await prisma.cart.findUnique({
      where: { userId: BigInt(userId) },
    });

    if (!cart) {
      cart = await prisma.cart.create({
        data: { userId: BigInt(userId) },
      });
    }

    const existingItem = await prisma.cartItem.findFirst({
      where: {
        cartId: cart.id,
        productId: BigInt(productid),
      },
    });

    if (existingItem) {
      await prisma.cartItem.update({
        where: { id: existingItem.id },
        data: { quantity: existingItem.quantity + quantity },
      });
    } else {
      await prisma.cartItem.create({
        data: {
          cartId: cart.id,
          productId: BigInt(productid),
          quantity: quantity,
          priceAtAddTime: product.price,
        },
      });
    }

    return res.send('Product added to cart successfully');
  } catch (error) {
    next(error);
  }
}

export async function getCart(req: Request, res: Response, next: NextFunction) {
  try {
    const userId = req.user!.id;

    const cart = await prisma.cart.findUnique({
      where: { userId: BigInt(userId) },
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
    });

    if (!cart) {
      return res.json([]);
    }

    const items = cart.cartItems
      .filter((ci) => ci.product != null)
      .map((ci) => ({
        productid: Number(ci.product.id),
        productname: ci.product.name,
        chefname: ci.product.seller?.user?.name || 'Gruhani Home Chef',
        price: Number(ci.priceAtAddTime),
        image: ci.product.image,
        quantity: ci.quantity,
      }));

    return res.json(serializeData(items));
  } catch (error) {
    next(error);
  }
}

export async function removeFromCart(req: Request, res: Response, next: NextFunction) {
  try {
    const userId = req.user!.id;
    const productId = Number(req.params.id);

    const cart = await prisma.cart.findUnique({
      where: { userId: BigInt(userId) },
    });

    if (!cart) {
      throw new AppError('Cart not found', 400);
    }

    const deleted = await prisma.cartItem.deleteMany({
      where: {
        cartId: cart.id,
        productId: BigInt(productId),
      },
    });

    if (deleted.count === 0) {
      throw new AppError('Cart item not found', 400);
    }

    return res.send('Product Deleted Successfully');
  } catch (error) {
    next(error);
  }
}
