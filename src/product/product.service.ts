import { Injectable } from "@nestjs/common";
import { PrismaService } from "src/prisma.service";
import { returnProductObject } from "./return-product.object";
import { ProductDto } from "./dto/product.dto";
import { generateSlug } from "src/utils/generate-slug";
import { CategoryService } from "src/category/category.service";

@Injectable()
export class ProductService {
	constructor(
		private prisma: PrismaService,
		private categoryService: CategoryService
	) {}

	async getAll(searchTerm?: string) {
		if (searchTerm) return await this.search(searchTerm);

		return await this.prisma.product.findMany({
			select: returnProductObject,
			orderBy: {
				createdAt: "desc"
			}
		});
	}

	async search(searchTerm: string) {
		return await this.prisma.product.findMany({
			where: {
				OR: [
					{
						name: {
							contains: searchTerm,
							mode: "insensitive"
						}
					},
					{
						description: {
							contains: searchTerm,
							mode: "insensitive"
						}
					}
				]
			},
			select: returnProductObject
		});
	}

	async getByCategory(categorySlug: string) {
		const products = await this.prisma.product.findMany({
			where: {
				category: {
					slug: categorySlug
				}
			},
			select: returnProductObject
		});

		if (!products) throw new Error("Products not found");

		return products;
	}

	async getBySlug(slug: string) {
		const product = await this.prisma.product.findUnique({
			where: {
				slug
			},
			select: returnProductObject
		});

		if (!product) throw new Error("Product not found");

		return product;
	}

	async create() {
		return await this.prisma.product.create({
			data: {
				name: "",
				slug: "",
				image: "",
				price: 0,
				description: ""
			}
		});
	}

	async update(id: string, dto: ProductDto) {
		const { name, image, price, description, categoryId } = dto;

		await this.categoryService.getById(categoryId);

		return await this.prisma.product.update({
			where: {
				id
			},
			data: {
				name,
				slug: generateSlug(name),
				image,
				description,
				price,
				category: {
					connect: {
						id: categoryId
					}
				}
			}
		});
	}

	async delete(id: string) {
		return await this.prisma.product.delete({
			where: {
				id
			}
		});
	}
}
