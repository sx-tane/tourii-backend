// biome-ignore lint/style/useImportType: <explanation>
import { Injectable, NestMiddleware } from '@nestjs/common';
// biome-ignore lint/style/useImportType: <explanation>
import { ConfigService } from '@nestjs/config';
// biome-ignore lint/style/useImportType: <explanation>
import { Request, Response, NextFunction } from 'express';
import helmet from 'helmet';
import cors from 'cors';
import semver from 'semver';
import { TouriiBackendAppErrorType } from '@app/core/support/exception/tourii-backend-app-error-type';
import { TouriiBackendAppException } from '@app/core/support/exception/tourii-backend-app-exception';

/**
 * SecurityMiddleware handles all security-related configurations:
 * 1. Security Headers (using Helmet)
 * 2. CORS (Cross-Origin Resource Sharing)
 * 3. Additional security headers
 */
@Injectable()
export class SecurityMiddleware implements NestMiddleware {
  constructor(private readonly configService: ConfigService) {}

  use(req: Request, res: Response, next: NextFunction) {
    try {
      // 1. API Key Validation
      const apiKey = req.header('x-api-key');
      const validApiKeys =
        this.configService.get<string>('API_KEYS')?.split(',') || [];

      if (!apiKey) {
        throw new TouriiBackendAppException(TouriiBackendAppErrorType.E_TB_010);
      }

      if (!validApiKeys.includes(apiKey)) {
        throw new TouriiBackendAppException(TouriiBackendAppErrorType.E_TB_011);
      }

      // Store API key validation status
      (req as any).apiKeyValid = true;

      // 2. Version Validation
      const version = req.header('accept-version');
      const currentVersion = this.configService.get<string>(
        'API_VERSION',
        '1.0.0',
      );

      if (!version) {
        throw new TouriiBackendAppException(TouriiBackendAppErrorType.E_TB_020);
      }

      if (!semver.valid(version)) {
        throw new TouriiBackendAppException(TouriiBackendAppErrorType.E_TB_021);
      }

      if (semver.lt(version, currentVersion)) {
        throw new TouriiBackendAppException(TouriiBackendAppErrorType.E_TB_022);
      }

      // Step 1: Apply Helmet security headers first
      // Helmet is like a security guard that adds many protective headers
      helmet({
        // Content Security Policy (CSP) - Controls what resources can be loaded
        contentSecurityPolicy: {
          directives: {
            defaultSrc: ["'self'"], // By default, only load resources from our own domain
            scriptSrc: ["'self'", "'unsafe-inline'"], // Allow scripts from our domain and inline scripts
            styleSrc: ["'self'", "'unsafe-inline'"], // Allow styles from our domain and inline styles
            imgSrc: ["'self'", 'data:', 'https:'], // Allow images from our domain, data URLs, and any HTTPS
            baseUri: ["'self'"], // Restrict base tag to our domain
            fontSrc: ["'self'", 'https:', 'data:'], // Allow fonts from our domain, HTTPS, and data URLs
            formAction: ["'self'"], // Forms can only submit to our domain
            frameAncestors: ["'self'"], // Only we can embed our pages in frames
            objectSrc: ["'none'"], // Don't allow plugins (Flash, Java, etc)
            scriptSrcAttr: ["'none'"], // Don't allow inline script attributes
            upgradeInsecureRequests: [], // Upgrade HTTP to HTTPS
          },
        },
        // Cross-Origin Settings
        crossOriginEmbedderPolicy: true, // Require CORS for embedded resources
        crossOriginOpenerPolicy: { policy: 'same-origin' }, // Isolate our window from others
        crossOriginResourcePolicy: { policy: 'same-site' }, // Resources only from same site

        // Additional Security Settings
        dnsPrefetchControl: { allow: false }, // Disable DNS prefetching
        frameguard: { action: 'deny' }, // Prevent clickjacking attacks
        hidePoweredBy: true, // Hide technology stack info
        hsts: {
          maxAge: 31536000, // Force HTTPS for 1 year
          includeSubDomains: true, // Include subdomains
          preload: true, // Allow preloading HSTS
        },
        ieNoOpen: true, // Prevent IE from executing downloads
        noSniff: true, // Prevent MIME type sniffing
        originAgentCluster: true, // Improve browser isolation
        permittedCrossDomainPolicies: { permittedPolicies: 'none' }, // No cross-domain policies
        referrerPolicy: { policy: 'strict-origin-when-cross-origin' }, // Control referrer info
        xssFilter: true, // Enable XSS protection
      })(req, res, () => {
        // Step 2: After Helmet, handle CORS
        const allowedOrigin = this.configService.get(
          'CORS_ORIGIN',
          'https://*.tourii.xyz', // Default: allow all tourii.xyz subdomains
        );
        const origin = req.headers.origin;

        // CORS Configuration
        const corsMiddleware = cors({
          origin: (origin, callback) => {
            if (!origin) {
              callback(null, false); // No origin = no CORS needed
              return;
            }

            // Convert wildcard domain to regex pattern
            // Example: https://*.tourii.xyz becomes https://(.+\.)?tourii\.xyz
            const pattern = allowedOrigin.replace('*.', '(.+\\.)?');
            const regex = new RegExp(`^${pattern.replace(/\./g, '\\.')}$`);

            if (regex.test(origin)) {
              callback(null, origin); // Origin allowed - send CORS headers
            } else {
              // Origin not allowed - send error
              callback(new Error('Not allowed by CORS'));
            }
          },
          // Allowed HTTP Methods
          methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
          // Allowed Request Headers
          allowedHeaders: [
            'Content-Type',
            'Authorization',
            'x-api-key',
            'accept-version',
          ],
          credentials: true, // Allow cookies and credentials
          maxAge: 86400, // Cache CORS response for 24 hours
          // Headers that clients can see
          exposedHeaders: [
            'X-RateLimit-Limit',
            'X-RateLimit-Remaining',
            'X-RateLimit-Reset',
          ],
        });

        // Step 3: Handle preflight requests (OPTIONS)
        if (req.method === 'OPTIONS') {
          corsMiddleware(req, res, () => {
            res.status(204).end(); // Successful preflight = 204 No Content
          });
          return;
        }

        // Step 4: For normal requests, apply CORS and continue
        corsMiddleware(req, res, () => {
          // Step 5: Add our own security headers
          res.setHeader('X-Content-Type-Options', 'nosniff'); // Prevent MIME type sniffing
          res.setHeader('X-Frame-Options', 'DENY'); // Prevent clickjacking
          res.setHeader('X-XSS-Protection', '1; mode=block'); // Old XSS protection
          res.setHeader('X-Permitted-Cross-Domain-Policies', 'none'); // No cross-domain policies
          next(); // Continue to next middleware
        });
      });
    } catch (error) {
      next(error);
    }
  }
}
