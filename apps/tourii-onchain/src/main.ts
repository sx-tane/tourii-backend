import { NestFactory } from "@nestjs/core";
import { TouriiOnchainModule } from "./tourii-onchain.module";

async function bootstrap() {
	const app = await NestFactory.create(TouriiOnchainModule);
	await app.listen(process.env.port ?? 3001);
}
bootstrap();
