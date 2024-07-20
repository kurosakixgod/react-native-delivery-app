import {
	Injectable,
	NotFoundException,
	UnauthorizedException
} from "@nestjs/common";
import { PrismaService } from "src/prisma.service";
import { AuthDto } from "./dto/auth.dto";
import { faker } from "@faker-js/faker";
import { hash, verify } from "argon2";
import { JwtService } from "@nestjs/jwt";
import { User } from "@prisma/client";

@Injectable()
export class AuthService {
	constructor(
		private prisma: PrismaService,
		private jwt: JwtService
	) {}

	async login(dto: AuthDto) {
		const user = await this.validateUser(dto);
		const tokens = await this.issueToken(user.id);

		return { user: this.returnUserFields(user), ...tokens };
	}

	async getNewTokens(refreshToken: string) {
		const result = await this.jwt.verifyAsync(refreshToken);

		if (!result)
			throw new UnauthorizedException("Invalid refresh tok111en");

		const user = await this.prisma.user.findUnique({
			where: {
				id: result.id
			}
		});

		const tokens = await this.issueToken(user.id);
		return { user: this.returnUserFields(user), ...tokens };
	}

	async register(dto: AuthDto) {
		const user = await this.prisma.user.findUnique({
			where: {
				email: dto.email
			}
		});

		if (user) throw new UnauthorizedException("User already exists");

		const newUser = await this.prisma.user.create({
			data: {
				email: dto.email,
				password: await hash(dto.password),
				name: faker.person.firstName(),
				avatarPath: faker.image.avatar(),
				phone: faker.phone.number()
			}
		});

		const tokens = await this.issueToken(newUser.id);

		return { user: this.returnUserFields(newUser), ...tokens };
	}

	private async issueToken(userId: string) {
		const data = { id: userId };

		const accessToken = await this.jwt.sign(data, { expiresIn: "15m" });
		const refreshToken = await this.jwt.sign(data, { expiresIn: "30d" });

		return { accessToken, refreshToken };
	}

	private returnUserFields(user: User) {
		return {
			id: user.id,
			email: user.email
		};
	}

	private async validateUser(dto: AuthDto) {
		const user = await this.prisma.user.findUnique({
			where: {
				email: dto.email
			}
		});

		if (!user) throw new NotFoundException("User not found");

		const isValid = await verify(user.password, dto.password);

		if (!isValid) throw new UnauthorizedException("Invalid password");

		return user;
	}
}
