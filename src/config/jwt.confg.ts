import { JwtModuleOptions } from "@nestjs/jwt";
import { ConfigService } from "@nestjs/config";

export const jwtConfig = async (
	configService: ConfigService
): Promise<JwtModuleOptions> => ({
	secret: configService.get("JWT_SECRET"),
	signOptions: {
		expiresIn: configService.get("JWT_EXPIRES_IN")
	}
});
