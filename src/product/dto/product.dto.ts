import { IsNumber, IsString } from "class-validator";

export class ProductDto {
	@IsString()
	name: string;

	@IsString()
	image: string;

	@IsString()
	description: string;

	@IsNumber()
	price: number;

	@IsString()
	categoryId: string;
}
