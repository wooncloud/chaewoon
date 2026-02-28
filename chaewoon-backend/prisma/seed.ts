import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  // Clear existing data
  await prisma.orderItem.deleteMany();
  await prisma.order.deleteMany();
  await prisma.product.deleteMany();
  await prisma.coupon.deleteMany();

  // Products
  const products = await Promise.all([
    prisma.product.create({
      data: {
        name: "자개 나비 키링",
        description:
          "나비 한 쌍이 자개 위에서 날아오르는 모습을 담았습니다. 빛의 각도에 따라 날개의 무지개빛이 달라지는, 세상에 단 하나뿐인 작품입니다.",
        price: 38000,
        tags: ["나비", "선물추천"],
        sold: true,
        featured: false,
        published: true,
        createdAt: new Date("2025-01-15"),
      },
    }),
    prisma.product.create({
      data: {
        name: "자개 벚꽃 키링",
        description:
          "흩날리는 벚꽃잎을 자개로 한 잎 한 잎 세공한 키링입니다. 봄의 설렘을 가방에 달아보세요. 은은한 분홍빛이 감도는 영롱한 작품.",
        price: 42000,
        tags: ["벚꽃", "봄"],
        sold: true,
        featured: false,
        published: true,
        createdAt: new Date("2025-02-01"),
      },
    }),
    prisma.product.create({
      data: {
        name: "자개 달빛 키링",
        description:
          "초승달과 별을 자개로 표현한 몽환적인 키링입니다. 어두운 곳에서 자개 특유의 은은한 빛이 더욱 돋보입니다. 밤하늘을 품은 작품.",
        price: 45000,
        tags: ["달", "별", "선물추천"],
        sold: false,
        featured: true,
        published: true,
        createdAt: new Date("2025-03-10"),
      },
    }),
    prisma.product.create({
      data: {
        name: "자개 학 키링",
        description:
          "우아하게 날아오르는 학의 모습을 자개로 세밀하게 표현했습니다. 한국 전통미의 정수를 담은 격조 높은 키링. 장수와 행운의 의미를 함께 선물하세요.",
        price: 48000,
        tags: ["학", "전통", "프리미엄"],
        sold: false,
        featured: true,
        published: true,
        createdAt: new Date("2025-04-05"),
      },
    }),
    prisma.product.create({
      data: {
        name: "자개 매화 키링",
        description:
          "겨울을 이기고 피어나는 매화를 자개로 담았습니다. 꽃잎 하나하나에 정성을 담아 세공한 작품. 가방에 봄의 기운을 더해줍니다.",
        price: 40000,
        tags: ["매화", "꽃"],
        sold: false,
        featured: true,
        published: true,
        createdAt: new Date("2025-05-01"),
      },
    }),
    prisma.product.create({
      data: {
        name: "자개 파도 키링",
        description:
          "일렁이는 파도의 움직임을 자개의 곡선으로 표현한 키링입니다. 청록빛 자개가 바다의 깊은 색을 닮았습니다. 바다를 좋아하는 분께 추천.",
        price: 43000,
        tags: ["파도", "바다"],
        sold: false,
        featured: false,
        published: true,
        createdAt: new Date("2025-06-15"),
      },
    }),
    prisma.product.create({
      data: {
        name: "자개 용 키링",
        description:
          "힘차게 승천하는 용의 모습을 자개로 조각한 프리미엄 키링입니다. 정교한 비늘 표현이 일품이며, 빛에 따라 금빛과 청빛이 교차합니다.",
        price: 55000,
        tags: ["용", "프리미엄"],
        sold: false,
        featured: true,
        published: true,
        createdAt: new Date("2025-07-01"),
      },
    }),
    prisma.product.create({
      data: {
        name: "자개 연꽃 키링",
        description:
          "고요한 수면 위에 피어난 연꽃을 자개로 표현한 키링입니다. 순수와 평화의 상징을 일상에 담아보세요. 자개의 영롱함이 극대화된 작품.",
        price: 44000,
        tags: ["연꽃", "선물추천"],
        sold: false,
        featured: false,
        published: false,
        createdAt: new Date("2025-08-01"),
      },
    }),
  ]);

  // Coupons
  await Promise.all([
    prisma.coupon.create({
      data: {
        code: "WELCOME10",
        description: "신규 고객 10% 할인",
        discountType: "PERCENT",
        discountValue: 10,
        minOrderAmount: 30000,
        maxDiscountAmount: 10000,
        validFrom: new Date("2025-01-01"),
        validUntil: new Date("2025-12-31"),
        isActive: true,
      },
    }),
    prisma.coupon.create({
      data: {
        code: "CHAEWOON5000",
        description: "채운 5,000원 할인",
        discountType: "FIXED",
        discountValue: 5000,
        minOrderAmount: 35000,
        validFrom: new Date("2025-01-01"),
        validUntil: new Date("2025-12-31"),
        isActive: true,
      },
    }),
    prisma.coupon.create({
      data: {
        code: "PREMIUM20",
        description: "프리미엄 20% 할인",
        discountType: "PERCENT",
        discountValue: 20,
        minOrderAmount: 50000,
        maxDiscountAmount: 15000,
        validFrom: new Date("2025-06-01"),
        validUntil: new Date("2025-12-31"),
        isActive: false,
      },
    }),
  ]);

  // Orders (referencing created products)
  const addresses = [
    { name: "김채운", phone: "010-1234-5678", zipCode: "06134", address: "서울특별시 강남구 테헤란로 123", detail: "4층 401호" },
    { name: "이진주", phone: "010-9876-5432", zipCode: "04527", address: "서울특별시 중구 을지로 45", detail: "2층" },
    { name: "박서현", phone: "010-5555-1234", zipCode: "48058", address: "부산광역시 해운대구 해운대로 100", detail: "" },
    { name: "최민수", phone: "010-3333-7777", zipCode: "34014", address: "대전광역시 유성구 대학로 99", detail: "연구동 302호" },
    { name: "정하늘", phone: "010-8888-2222", zipCode: "61452", address: "광주광역시 동구 충장로 55", detail: "3층" },
    { name: "한소율", phone: "010-1111-9999", zipCode: "13590", address: "경기도 성남시 분당구 판교로 200", detail: "아파트 1502동 803호" },
    { name: "윤지아", phone: "010-4444-6666", zipCode: "21999", address: "인천광역시 남동구 인하로 50", detail: "" },
    { name: "송예린", phone: "010-7777-3333", zipCode: "63197", address: "제주특별자치도 제주시 연동 123", detail: "2층 사무실" },
  ];

  const orderData: Array<{
    productIdx: number;
    subtotal: number;
    couponDiscount: number;
    total: number;
    couponCode?: string;
    status: "PENDING" | "CONFIRMED" | "SHIPPING" | "DELIVERED" | "CANCELLED";
    date: string;
    addrIdx: number;
    paymentKey?: string;
    paymentMethod?: string;
    paidAt?: string;
  }> = [
    { productIdx: 0, subtotal: 38000, couponDiscount: 0, total: 38000, status: "DELIVERED", date: "2025-01-20", addrIdx: 0, paymentKey: "test_pk_delivered_1", paymentMethod: "카드", paidAt: "2025-01-20T10:00:00Z" },
    { productIdx: 1, subtotal: 42000, couponDiscount: 0, total: 42000, status: "DELIVERED", date: "2025-02-05", addrIdx: 1, paymentKey: "test_pk_delivered_2", paymentMethod: "카드", paidAt: "2025-02-05T14:30:00Z" },
    { productIdx: 2, subtotal: 45000, couponDiscount: 4500, total: 40500, couponCode: "WELCOME10", status: "DELIVERED", date: "2025-03-14", addrIdx: 2, paymentKey: "test_pk_delivered_3", paymentMethod: "계좌이체", paidAt: "2025-03-14T09:15:00Z" },
    { productIdx: 3, subtotal: 48000, couponDiscount: 0, total: 48000, status: "SHIPPING", date: "2025-04-10", addrIdx: 3, paymentKey: "test_pk_shipping_1", paymentMethod: "카드", paidAt: "2025-04-10T16:00:00Z" },
    { productIdx: 4, subtotal: 40000, couponDiscount: 5000, total: 35000, couponCode: "CHAEWOON5000", status: "CONFIRMED", date: "2025-05-20", addrIdx: 4, paymentKey: "test_pk_confirmed_1", paymentMethod: "카드", paidAt: "2025-05-20T11:45:00Z" },
    { productIdx: 5, subtotal: 43000, couponDiscount: 0, total: 43000, status: "PENDING", date: "2025-06-25", addrIdx: 5 },
    { productIdx: 6, subtotal: 55000, couponDiscount: 0, total: 55000, status: "PENDING", date: "2025-07-05", addrIdx: 6 },
    { productIdx: 2, subtotal: 45000, couponDiscount: 0, total: 45000, status: "CANCELLED", date: "2025-07-15", addrIdx: 7 },
  ];

  for (const od of orderData) {
    const addr = addresses[od.addrIdx];
    await prisma.order.create({
      data: {
        subtotal: od.subtotal,
        couponDiscount: od.couponDiscount,
        total: od.total,
        couponCode: od.couponCode,
        status: od.status,
        shippingName: addr.name,
        shippingPhone: addr.phone,
        shippingZipCode: addr.zipCode,
        shippingAddress: addr.address,
        shippingDetail: addr.detail,
        createdAt: new Date(od.date),
        paymentKey: od.paymentKey ?? null,
        paymentMethod: od.paymentMethod ?? null,
        paidAt: od.paidAt ? new Date(od.paidAt) : null,
        items: {
          create: {
            productId: products[od.productIdx].id,
            quantity: 1,
          },
        },
      },
    });
  }

  console.log("Seed completed successfully!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
