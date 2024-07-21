import {
	Body,
	Controller,
	Delete,
	Get,
	HttpCode,
	Param,
	Post,
	Put,
	UsePipes,
	ValidationPipe
} from "@nestjs/common";
import { CategoryService } from "./category.service";
import { CategoryDto } from "./dto/category.dto";
import { Auth } from "src/auth/decorators/auth.decorator";

@Controller("category")
export class CategoryController {
	constructor(private readonly categoryService: CategoryService) {}

	@Get()
	async getAll() {
		return this.categoryService.getAll();
	}

	@Get("by-id/:id")
	async getById(@Param("id") id: string) {
		return this.categoryService.getById(id);
	}

	@Get("by-slug/:slug")
	async getBySlug(@Param("slug") slug: string) {
		return this.categoryService.getBySlug(slug);
	}
	@HttpCode(200)
	@Post()
	@Auth()
	async createCategory() {
		return this.categoryService.create();
	}

	@UsePipes(new ValidationPipe())
	@HttpCode(200)
	@Put(":id")
	@Auth()
	async updateCategory(@Param("id") id: string, @Body() dto: CategoryDto) {
		return this.categoryService.update(id, dto);
	}

	@HttpCode(200)
	@Delete(":id")
	@Auth()
	async deleteCategory(@Param("id") id: string) {
		return this.categoryService.delete(id);
	}
}
