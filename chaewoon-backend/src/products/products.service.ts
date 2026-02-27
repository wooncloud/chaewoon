import { Injectable, NotFoundException } from "@nestjs/common";
import { Prisma } from "@prisma/client";
import { PrismaService } from "../prisma/prisma.service";
import { CreateProductDto, UpdateProductDto } from "./products.dto";

@Injectable()
export class ProductsService {
  constructor(private prisma: PrismaService) {}

  async findAll(query: {
    search?: string;
    sold?: string;
    published?: string;
    featured?: string;
  }) {
    const where: Prisma.ProductWhereInput = {};

    if (query.search) {
      const q = query.search;
      where.OR = [
        { name: { contains: q, mode: "insensitive" } },
        { tags: { hasSome: [q] } },
      ];
    }

    if (query.sold === "true") where.sold = true;
    else if (query.sold === "false") where.sold = false;

    if (query.published === "true") where.published = true;
    else if (query.published === "false") where.published = false;

    if (query.featured === "true") where.featured = true;

    return this.prisma.product.findMany({
      where,
      orderBy: { createdAt: "desc" },
    });
  }

  async findOne(id: string) {
    const product = await this.prisma.product.findUnique({ where: { id } });
    if (!product) throw new NotFoundException("작품을 찾을 수 없습니다.");
    return product;
  }

  async create(dto: CreateProductDto) {
    return this.prisma.product.create({
      data: {
        name: dto.name,
        description: dto.description,
        price: dto.price,
        thumbnail: dto.thumbnail ?? "",
        bodyImages: dto.bodyImages ?? [],
        tags: dto.tags ?? [],
        featured: dto.featured ?? false,
        published: dto.published ?? false,
      },
    });
  }

  async update(id: string, dto: UpdateProductDto) {
    await this.findOne(id);
    return this.prisma.product.update({
      where: { id },
      data: dto,
    });
  }

  async remove(id: string) {
    await this.findOne(id);
    return this.prisma.product.delete({ where: { id } });
  }

  async markAsSold(id: string) {
    await this.findOne(id);
    return this.prisma.product.update({
      where: { id },
      data: { sold: true },
    });
  }

  async togglePublished(id: string) {
    const product = await this.findOne(id);
    return this.prisma.product.update({
      where: { id },
      data: { published: !product.published },
    });
  }

  async toggleFeatured(id: string) {
    const product = await this.findOne(id);
    return this.prisma.product.update({
      where: { id },
      data: { featured: !product.featured },
    });
  }
}
