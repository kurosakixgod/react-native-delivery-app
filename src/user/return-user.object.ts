import { Prisma } from "@prisma/client";

export const returnUserObject: Prisma.UserSelect = {
	id: true,
	name: true,
	email: true,
	avatarPath: true,
	phone: true,
	password: false
};
