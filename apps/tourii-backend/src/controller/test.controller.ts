import { Controller, Get } from "@nestjs/common";
import { SkipThrottle, Throttle } from "@nestjs/throttler";

/**
 * TestController provides endpoints to test various security features:
 * 1. Security Headers
 * 2. Rate Limiting
 *
 * This controller helps verify that our security configurations are working correctly.
 */
@Controller("test")
export class TestController {
	/**
	 * Test endpoint for security headers
	 * - No rate limiting (using @SkipThrottle)
	 * - Returns all security headers set by SecurityMiddleware
	 */
	@Get("headers")
	@SkipThrottle() // This endpoint won't have rate limiting
	testHeaders() {
		return { message: "Check response headers" };
	}

	/**
	 * Test endpoint for rate limiting
	 * - Limited to 3 requests per second
	 * - After 3 requests, returns 429 Too Many Requests
	 * - Includes rate limit headers in response:
	 *   - X-RateLimit-Limit: max requests allowed
	 *   - X-RateLimit-Remaining: requests remaining
	 *   - X-RateLimit-Reset: time until limit resets
	 */
	@Get("rate-limit")
	@Throttle({ default: { ttl: 1000, limit: 3 } }) // 3 requests per 1000ms (1 second)
	testRateLimit() {
		return { message: "Rate limit test endpoint" };
	}
}
