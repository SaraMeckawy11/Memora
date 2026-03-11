const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  // 1. Create Default Template
  const template = await prisma.template.upsert({
    where: { name: 'Default Template' },
    update: {},
    create: {
      name: 'Default Template',
      description: 'Standard 20x20cm Photobook Template',
      config: JSON.stringify({
        dimensions: { width: 20, height: 20, unit: 'cm' },
        maxPages: 50,
        minPages: 20,
      }),
      isActive: true,
    },
  });
  console.log('Created/Updated Template:', template.name);

  // 2. Create Welcome Discount Code
  const discount = await prisma.discountCode.upsert({
    where: { code: 'WELCOME10' },
    update: {},
    create: {
      code: 'WELCOME10',
      type: 'percentage',
      value: 10, // 10% off
      minOrderAmount: 0,
      maxDiscountAmount: 500,
      isActive: true,
      usageLimit: 1000,
    },
  });
  console.log('Created/Updated Discount Code:', discount.code);

  // 3. Create Free Shipping Code
  const shipping = await prisma.discountCode.upsert({
    where: { code: 'FREESHIP' },
    update: {},
    create: {
      code: 'FREESHIP',
      type: 'fixed',
      value: 50, // 50 EGP off (assuming shipping cost)
      minOrderAmount: 300,
      isActive: true,
    },
  });
  console.log('Created/Updated Discount Code:', shipping.code);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
