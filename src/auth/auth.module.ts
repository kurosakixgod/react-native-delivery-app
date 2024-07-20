import { Module } from "@nestjs/common";
import { AuthService } from "./auth.service";
import { AuthController } from "./auth.controller";
import { PrismaService } from "src/prisma.service";
import { ConfigModule } from "@nestjs/config";
import { JwtModule } from "@nestjs/jwt";
import { ConfigService } from "@nestjs/config";
import { jwtConfig } from "src/config/jwt.confg";

@Module({
	controllers: [AuthController],
	providers: [AuthService, PrismaService],
	imports: [
		ConfigModule,
		JwtModule.registerAsync({
			imports: [ConfigModule],
			inject: [ConfigService],
			useFactory: jwtConfig
		})
	]
})
export class AuthModule {}
