import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Param,
  Body,
  Query,
} from "@nestjs/common";
import { ProductsService } from "./products.service";
import { CreateProductDto, UpdateProductDto } from "./products.dto";

@Controller("products")
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @Get()
  findAll(
    @Query("search") search?: string,
    @Query("sold") sold?: string,
    @Query("published") published?: string,
    @Query("featured") featured?: string,
  ) {
    return this.productsService.findAll({ search, sold, published, featured });
  }

  @Get(":id")
  findOne(@Param("id") id: string) {
    return this.productsService.findOne(id);
  }

  @Post()
  create(@Body() dto: CreateProductDto) {
    return this.productsService.create(dto);
  }

  @Patch(":id")
  update(@Param("id") id: string, @Body() dto: UpdateProductDto) {
    return this.productsService.update(id, dto);
  }

  @Delete(":id")
  remove(@Param("id") id: string) {
    return this.productsService.remove(id);
  }

  @Patch(":id/sold")
  markAsSold(@Param("id") id: string) {
    return this.productsService.markAsSold(id);
  }

  @Patch(":id/toggle-published")
  togglePublished(@Param("id") id: string) {
    return this.productsService.togglePublished(id);
  }

  @Patch(":id/toggle-featured")
  toggleFeatured(@Param("id") id: string) {
    return this.productsService.toggleFeatured(id);
  }
}
