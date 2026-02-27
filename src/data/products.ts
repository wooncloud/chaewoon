import { Product } from "@/types";

export const products: Product[] = [
  {
    id: "prod-001",
    name: "자개 나비 브로치",
    description:
      "전통 자개 공예 기법으로 정성스레 제작한 나비 브로치입니다. 빛의 각도에 따라 영롱한 무지개빛이 피어나며, 어떤 옷에도 우아한 포인트를 더합니다.",
    price: 89000,
    images: ["/images/brooch-butterfly.jpg"],
    category: "accessory",
    tags: ["브로치", "나비", "선물추천"],
    stock: 15,
    featured: true,
    createdAt: "2025-01-15",
  },
  {
    id: "prod-002",
    name: "자개 연꽃 손거울",
    description:
      "연꽃 문양을 자개로 정밀하게 세공한 고급 손거울입니다. 휴대하기 좋은 사이즈에 자개 특유의 은은한 광택이 소장 가치를 높입니다.",
    price: 65000,
    images: ["/images/mirror-lotus.jpg"],
    category: "accessory",
    tags: ["손거울", "연꽃", "선물추천"],
    stock: 20,
    featured: true,
    createdAt: "2025-02-01",
  },
  {
    id: "prod-003",
    name: "자개 학 보석함",
    description:
      "학 문양이 아름답게 새겨진 자개 보석함입니다. 정교한 자개 세공과 옻칠의 조화가 돋보이며, 소중한 보석을 품격 있게 보관할 수 있습니다.",
    price: 280000,
    images: ["/images/box-crane.jpg"],
    category: "homeware",
    tags: ["보석함", "학", "프리미엄"],
    stock: 5,
    featured: true,
    createdAt: "2025-02-10",
  },
  {
    id: "prod-004",
    name: "자개 매화 명함지갑",
    description:
      "매화 문양의 자개 세공이 돋보이는 프리미엄 명함지갑입니다. 비즈니스 미팅에서 품격을 더하는 특별한 소품으로, 한국의 미를 담았습니다.",
    price: 120000,
    images: ["/images/wallet-plum.jpg"],
    category: "stationery",
    tags: ["명함지갑", "매화", "비즈니스"],
    stock: 12,
    featured: false,
    createdAt: "2025-03-01",
  },
  {
    id: "prod-005",
    name: "자개 달빛 귀걸이",
    description:
      "초승달 모양의 자개 귀걸이입니다. 빛을 받으면 은은한 무지개빛이 감돌며, 가벼운 무게감으로 편안한 착용감을 제공합니다. 925 실버 소재를 사용했습니다.",
    price: 58000,
    images: ["/images/earring-moon.jpg"],
    category: "accessory",
    tags: ["귀걸이", "달빛", "실버"],
    stock: 25,
    featured: true,
    createdAt: "2025-03-15",
  },
  {
    id: "prod-006",
    name: "자개 산수화 액자",
    description:
      "전통 산수화를 자개로 표현한 예술 액자입니다. 자연의 풍경이 자개의 영롱한 빛으로 되살아나며, 인테리어에 고급스러운 분위기를 연출합니다.",
    price: 450000,
    images: ["/images/frame-landscape.jpg"],
    category: "art",
    tags: ["액자", "산수화", "인테리어"],
    stock: 3,
    featured: false,
    createdAt: "2025-04-01",
  },
  {
    id: "prod-007",
    name: "자개 벚꽃 코스터 세트",
    description:
      "벚꽃 문양의 자개 코스터 4개 세트입니다. 옻칠 위에 자개를 세심하게 배치하여 실용성과 아름다움을 모두 갖추었습니다. 격조 있는 티타임을 완성합니다.",
    price: 95000,
    images: ["/images/coaster-cherry.jpg"],
    category: "homeware",
    tags: ["코스터", "벚꽃", "세트"],
    stock: 10,
    featured: false,
    createdAt: "2025-04-15",
  },
  {
    id: "prod-008",
    name: "자개 용 만년필",
    description:
      "용 문양을 자개로 세공한 프리미엄 만년필입니다. 독일산 닙과 한국 전통 자개의 만남. 필기감과 소장 가치 모두 뛰어난 작품입니다.",
    price: 350000,
    images: ["/images/pen-dragon.jpg"],
    category: "stationery",
    tags: ["만년필", "용", "프리미엄"],
    stock: 7,
    featured: true,
    createdAt: "2025-05-01",
  },
];

export function getProductById(id: string): Product | undefined {
  return products.find((p) => p.id === id);
}

export function getFeaturedProducts(): Product[] {
  return products.filter((p) => p.featured);
}

export function getProductsByCategory(category: string): Product[] {
  return products.filter((p) => p.category === category);
}
