import { Prisma } from "@prisma/client";
import { returnCategoryObject } from "src/category/return-category.object";

export const returnProductObject: Prisma.ProductSelect = {
	id: true,
	name: true,
	slug: true,
	price: true,
	image: true,
	createdAt: true,
	category: { select: returnCategoryObject }
};
