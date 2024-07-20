import { Injectable, NotFoundException } from "@nestjs/common";
import { PrismaService } from "src/prisma.service";
import { returnUserObject } from "./return-user.object";
import { returnProductObject } from "src/product/return-product.object";
import { Prisma } from "@prisma/client";

@Injectable()
export class UserService {
	constructor(private prisma: PrismaService) {}

	async getById(id: string, selectObject: Prisma.UserSelect = {}) {
		const user = await this.prisma.user.findUnique({
			where: {
				id
			},

			select: {
				...returnUserObject,
				favorites: {
					select: {
						...returnProductObject
					}
				},
				...selectObject
			}
		});

		if (!user) throw new Error("User not found");

		return user;
	}

	async toggleFavorite(userId: string, productId: string) {
		const user = await this.getById(userId);

		if (!user) throw new NotFoundException("User not found");

		const isExists = user.favorites.some(
			(favorite) => favorite.id === productId
		);

		await this.prisma.user.update({
			where: {
				id: userId
			},
			data: {
				favorites: {
					[isExists ? "disconnect" : "connect"]: {
						id: productId
					}
				}
			}
		});

		return { message: "success" };
	}
}
