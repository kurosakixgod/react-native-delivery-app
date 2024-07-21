import {
	Body,
	Controller,
	Delete,
	Get,
	HttpCode,
	Param,
	Post,
	Put,
	Query,
	UsePipes,
	ValidationPipe
} from "@nestjs/common";
import { ProductService } from "./product.service";
import { ProductDto } from "./dto/product.dto";
import { Auth } from "src/auth/decorators/auth.decorator";

@Controller("product")
export class ProductController {
	constructor(private readonly productService: ProductService) {}

	@UsePipes(new ValidationPipe())
	@Get()
	async getAll(@Query("searchTerm") searchTerm?: string) {
		return await this.productService.getAll(searchTerm);
	}

	@Get("by-slug/:slug")
	async getBySlug(@Param("slug") slug: string) {
		return await this.productService.getBySlug(slug);
	}

	@Get("by-category/:categorySlug")
	async getByCategory(@Param("categorySlug") categorySlug: string) {
		return await this.productService.getByCategory(categorySlug);
	}

	@UsePipes(new ValidationPipe())
	@HttpCode(200)
	@Post()
	@Auth()
	async createProduct() {
		return await this.productService.create();
	}

	@UsePipes(new ValidationPipe())
	@HttpCode(200)
	@Put(":id")
	@Auth()
	async updateProduct(@Param("id") id: string, @Body() dto: ProductDto) {
		return await this.productService.update(id, dto);
	}

	@HttpCode(200)
	@Delete(":id")
	@Auth()
	async deleteProduct(@Param("id") id: string) {
		return await this.productService.delete(id);
	}
}
