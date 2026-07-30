import { PrismaClient, Role, Category } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  const hashedPassword = await bcrypt.hash('password123', 10);

  // 1. Create Customer
  await prisma.users.upsert({
    where: { email: 'customer@gruhini.com' },
    update: {},
    create: {
      name: 'Anand Shukla',
      email: 'customer@gruhini.com',
      contact: '9876543210',
      password: hashedPassword,
      role: [Role.ROLE_USER],
      cart: { create: {} },
      addresses: {
        create: {
          addressLine: '123 River View Colony, Sethani Ghat',
          pincode: '461001',
          city: 'Narmadapuram',
          state: 'Madhya Pradesh',
        },
      },
    },
  });

  // 2. Create Home Chef Seller
  const sellerUser = await prisma.users.upsert({
    where: { email: 'sunita@gruhini.com' },
    update: {},
    create: {
      name: 'Sunita Sharma',
      email: 'sunita@gruhini.com',
      contact: '9988776655',
      password: hashedPassword,
      role: [Role.ROLE_USER, Role.ROLE_SELLER],
      profileImageUrl: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=300&auto=format&fit=crop&q=80',
      cart: { create: {} },
      seller: {
        create: {
          businessName: "Sunita's Royal Kitchen",
          contactNo: '9988776655',
          isApproved: true,
          categories: [Category.THALI, Category.SWEETS, Category.SNACKS],
          rating: 4.9,
          description: 'Specializing in Malvi Thalis, homemade Suji Cakes, and Pure Desi Ghee Halwa',
        },
      },
    },
    include: { seller: true },
  });

  if (sellerUser.seller) {
    const sellerId = sellerUser.seller.id;

    // Seed Products
    await prisma.product.createMany({
      data: [
        {
          name: 'Special Royal Malwa Thali',
          description: 'Fresh 4 Phulkas, Bafla, Daal Fry, Paneer Butter Masala, Rice, Salad & Gulab Jamun',
          price: 180,
          category: Category.THALI,
          subcategory: 'North Indian',
          stock: 25,
          status: 'APPROVED',
          verified: true,
          rating: 4.9,
          deliveryTime: '30-40 mins',
          image: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=600&auto=format&fit=crop&q=80',
          sellerId: sellerId,
        },
        {
          name: 'Semolina Suji Cake (Eggless)',
          description: 'Freshly baked homemade Suji Cake made with Desi Ghee, cardamom, and roasted dry fruits',
          price: 220,
          category: Category.SWEETS,
          subcategory: 'Cakes',
          stock: 15,
          status: 'APPROVED',
          verified: true,
          rating: 4.8,
          deliveryTime: '25-35 mins',
          image: 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=600&auto=format&fit=crop&q=80',
          sellerId: sellerId,
        },
        {
          name: 'Desi Ghee Moong Dal Halwa',
          description: 'Rich, slow-cooked Moong Dal Halwa made with pure A2 cow ghee and saffron',
          price: 160,
          category: Category.SWEETS,
          subcategory: 'Halwa',
          stock: 30,
          status: 'APPROVED',
          verified: true,
          rating: 5.0,
          deliveryTime: '20-30 mins',
          image: 'https://images.unsplash.com/photo-1589301760014-d929f3979dbc?w=600&auto=format&fit=crop&q=80',
          sellerId: sellerId,
        },
        {
          name: 'Crispy Evening Poha Jalebi Combo',
          description: 'Indori style Poha topped with Sev, Jeeravan, served with hot crispy Jalebi',
          price: 90,
          category: Category.SNACKS,
          subcategory: 'Breakfast',
          stock: 40,
          status: 'APPROVED',
          verified: true,
          rating: 4.7,
          deliveryTime: '20-25 mins',
          image: 'https://images.unsplash.com/photo-1601050690597-df0568f70950?w=600&auto=format&fit=crop&q=80',
          sellerId: sellerId,
        },
      ],
    });
  }

  console.log('✅ PostgreSQL database seeded successfully!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
