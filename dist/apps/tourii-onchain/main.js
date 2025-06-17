/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ "./apps/tourii-onchain/src/controller/model/request/user-data-request-dto.ts":
/*!***********************************************************************************!*\
  !*** ./apps/tourii-onchain/src/controller/model/request/user-data-request-dto.ts ***!
  \***********************************************************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.userDataSchema = void 0;
const zod_1 = __importDefault(__webpack_require__(/*! zod */ "zod"));
exports.userDataSchema = zod_1.default.object({
    username: zod_1.default.string(),
    password: zod_1.default.string(),
});


/***/ }),

/***/ "./apps/tourii-onchain/src/controller/passport-metadata.controller.ts":
/*!****************************************************************************!*\
  !*** ./apps/tourii-onchain/src/controller/passport-metadata.controller.ts ***!
  \****************************************************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var PassportMetadataController_1;
var _a, _b;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.PassportMetadataController = void 0;
const common_1 = __webpack_require__(/*! @nestjs/common */ "@nestjs/common");
const swagger_1 = __webpack_require__(/*! @nestjs/swagger */ "@nestjs/swagger");
const throttler_1 = __webpack_require__(/*! @nestjs/throttler */ "@nestjs/throttler");
const passport_metadata_service_1 = __webpack_require__(/*! ../service/passport-metadata.service */ "./apps/tourii-onchain/src/service/passport-metadata.service.ts");
const api_error_responses_decorator_1 = __webpack_require__(/*! ../support/decorators/api-error-responses.decorator */ "./apps/tourii-onchain/src/support/decorators/api-error-responses.decorator.ts");
let PassportMetadataController = PassportMetadataController_1 = class PassportMetadataController {
    constructor(passportMetadataService) {
        this.passportMetadataService = passportMetadataService;
        this.logger = new common_1.Logger(PassportMetadataController_1.name);
    }
    async getMetadata(tokenId) {
        try {
            this.logger.log(`Fetching metadata for passport token ID: ${tokenId}`);
            const metadata = await this.passportMetadataService.getMetadata(tokenId);
            this.logger.log(`Successfully retrieved metadata for passport token ID: ${tokenId}`);
            return metadata;
        }
        catch (error) {
            this.logger.error(`Failed to retrieve metadata for token ID ${tokenId}:`, error);
            if (error instanceof common_1.HttpException) {
                throw error;
            }
            throw new common_1.HttpException(`Failed to retrieve metadata for token ID ${tokenId}`, common_1.HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
};
exports.PassportMetadataController = PassportMetadataController;
__decorate([
    (0, common_1.Get)(':tokenId'),
    (0, swagger_1.ApiOperation)({
        summary: 'Get Digital Passport Metadata',
        description: 'Retrieve dynamic metadata for a Digital Passport NFT by token ID. This endpoint is called by NFT marketplaces and wallets to display passport information.',
    }),
    (0, swagger_1.ApiParam)({
        name: 'tokenId',
        description: 'The token ID of the Digital Passport NFT',
        example: '123',
    }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Digital Passport metadata retrieved successfully',
        schema: {
            type: 'object',
            properties: {
                name: { type: 'string', example: 'Bonjin Digital Passport #123' },
                description: {
                    type: 'string',
                    example: "Tourii Digital Passport for alice. This passport grants access to exclusive travel experiences and tracks your journey through Japan's hidden gems.",
                },
                image: {
                    type: 'string',
                    example: 'https://assets.tourii.com/passport/bonjin/bonjin.png',
                },
                external_url: { type: 'string', example: 'https://tourii.com/passport/123' },
                attributes: {
                    type: 'array',
                    items: {
                        type: 'object',
                        required: ['trait_type', 'value'],
                        properties: {
                            trait_type: { type: 'string', example: 'Passport Type' },
                            value: { type: 'string', example: 'Bonjin' },
                            display_type: { type: 'string', example: 'number' },
                            max_value: { type: 'number', example: 100 },
                        },
                    },
                },
            },
        },
    }),
    (0, swagger_1.ApiResponse)({
        status: 404,
        description: 'Digital Passport not found',
    }),
    (0, api_error_responses_decorator_1.ApiResourceNotFoundResponse)(),
    (0, api_error_responses_decorator_1.ApiInvalidVersionResponse)(),
    __param(0, (0, common_1.Param)('tokenId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", typeof (_b = typeof Promise !== "undefined" && Promise) === "function" ? _b : Object)
], PassportMetadataController.prototype, "getMetadata", null);
exports.PassportMetadataController = PassportMetadataController = PassportMetadataController_1 = __decorate([
    (0, swagger_1.ApiTags)('passport-metadata'),
    (0, common_1.Controller)('api/passport/metadata'),
    (0, common_1.UseGuards)(throttler_1.ThrottlerGuard),
    __metadata("design:paramtypes", [typeof (_a = typeof passport_metadata_service_1.PassportMetadataService !== "undefined" && passport_metadata_service_1.PassportMetadataService) === "function" ? _a : Object])
], PassportMetadataController);


/***/ }),

/***/ "./apps/tourii-onchain/src/controller/tourii-onchain.controller.ts":
/*!*************************************************************************!*\
  !*** ./apps/tourii-onchain/src/controller/tourii-onchain.controller.ts ***!
  \*************************************************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m, _o, _p, _q;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.TouriiOnchainController = void 0;
const tourii_backend_app_error_type_1 = __webpack_require__(/*! @app/core/support/exception/tourii-backend-app-error-type */ "./libs/core/src/support/exception/tourii-backend-app-error-type.ts");
const tourii_backend_app_exception_1 = __webpack_require__(/*! @app/core/support/exception/tourii-backend-app-exception */ "./libs/core/src/support/exception/tourii-backend-app-exception.ts");
const common_1 = __webpack_require__(/*! @nestjs/common */ "@nestjs/common");
const swagger_1 = __webpack_require__(/*! @nestjs/swagger */ "@nestjs/swagger");
const express_1 = __webpack_require__(/*! express */ "express");
const tourii_onchain_service_1 = __webpack_require__(/*! ../service/tourii-onchain.service */ "./apps/tourii-onchain/src/service/tourii-onchain.service.ts");
const user_data_request_dto_1 = __webpack_require__(/*! ./model/request/user-data-request-dto */ "./apps/tourii-onchain/src/controller/model/request/user-data-request-dto.ts");
let TouriiOnchainController = class TouriiOnchainController {
    constructor(touriiOnchainService) {
        this.touriiOnchainService = touriiOnchainService;
    }
    checkHealth() {
        return 'OK';
    }
    async userKeyringAddress(req, res) {
        const token = req.cookies['token'];
        try {
            res.json(await this.touriiOnchainService.userKeyringAddress(token));
        }
        catch (e) {
            common_1.Logger.log(`Error: ${JSON.stringify(e)}`);
            res.status(500).send(new tourii_backend_app_exception_1.TouriiBackendAppException(tourii_backend_app_error_type_1.TouriiBackendAppErrorType.E_TB_001));
        }
    }
    async loginUser(req, res) {
        const data = req.body;
        const result = user_data_request_dto_1.userDataSchema.safeParse(data);
        if (!result.success) {
            res.status(400).send(new tourii_backend_app_exception_1.TouriiBackendAppException(tourii_backend_app_error_type_1.TouriiBackendAppErrorType.E_TB_005));
            return;
        }
        const { username, password } = result.data;
        try {
            const token = await this.touriiOnchainService.loginUser(username, password);
            res.cookie('token', token, {
                httpOnly: true,
                maxAge: 3600000,
            });
            res.send('User logged in successfully');
        }
        catch (e) {
            common_1.Logger.log(`Error: ${JSON.stringify(e)}`);
            res.status(401).send(new tourii_backend_app_exception_1.TouriiBackendAppException(tourii_backend_app_error_type_1.TouriiBackendAppErrorType.E_TB_001));
        }
    }
    async registerUser(req, res) {
        const data = req.body;
        const result = user_data_request_dto_1.userDataSchema.safeParse(data);
        if (!result.success) {
            res.status(400).send(new tourii_backend_app_exception_1.TouriiBackendAppException(tourii_backend_app_error_type_1.TouriiBackendAppErrorType.E_TB_005));
            return;
        }
        const { username, password } = result.data;
        try {
            const token = await this.touriiOnchainService.registerUser(username, password);
            res.cookie('token', token, {
                httpOnly: true,
                maxAge: 3600000,
            });
            res.send('User registered');
        }
        catch (e) {
            common_1.Logger.log(`Error: ${JSON.stringify(e)}`);
            res.status(500).send(new tourii_backend_app_exception_1.TouriiBackendAppException(tourii_backend_app_error_type_1.TouriiBackendAppErrorType.E_TB_001));
        }
    }
    async logoutUser(res) {
        res.clearCookie('token');
        res.send('User logged out');
    }
    async sendGreen(req, res) {
        const token = req.cookies['token'];
        try {
            const response = await this.touriiOnchainService.sendGreen(token);
            res.send(`Response: ${JSON.stringify(response)}`);
        }
        catch (e) {
            res.status(500).send(`Error: ${JSON.stringify(e)}`);
        }
    }
    async sendYellow(req, res) {
        const token = req.cookies['token'];
        try {
            const response = await this.touriiOnchainService.sendYellow(token);
            res.send(`Response: ${JSON.stringify(response)}`);
        }
        catch (e) {
            res.status(500).send(`Error: ${JSON.stringify(e)}`);
        }
    }
    async sendRed(req, res) {
        const token = req.cookies['token'];
        try {
            const response = await this.touriiOnchainService.sendRed(token);
            res.send(`Response: ${JSON.stringify(response)}`);
        }
        catch (e) {
            res.status(500).send(`Error: ${JSON.stringify(e)}`);
        }
    }
    async readState(res) {
        try {
            const response = await this.touriiOnchainService.readState();
            res.send(`Response: ${JSON.stringify(response)}`);
        }
        catch (e) {
            res.status(500).send(`Error: ${JSON.stringify(e)}`);
        }
    }
};
exports.TouriiOnchainController = TouriiOnchainController;
__decorate([
    (0, common_1.Get)('/health-check'),
    (0, swagger_1.ApiTags)('Health Check'),
    (0, swagger_1.ApiOperation)({
        summary: 'Health Check',
    }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.OK,
        description: 'Success',
    }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", String)
], TouriiOnchainController.prototype, "checkHealth", null);
__decorate([
    (0, common_1.Get)('/user-keyring-address'),
    (0, swagger_1.ApiOperation)({
        summary: 'Get user keyring address',
    }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.OK,
        description: 'Success',
    }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.INTERNAL_SERVER_ERROR,
        description: 'Error',
    }),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [typeof (_b = typeof express_1.Request !== "undefined" && express_1.Request) === "function" ? _b : Object, typeof (_c = typeof express_1.Response !== "undefined" && express_1.Response) === "function" ? _c : Object]),
    __metadata("design:returntype", Promise)
], TouriiOnchainController.prototype, "userKeyringAddress", null);
__decorate([
    (0, common_1.Post)('keyring/login'),
    (0, swagger_1.ApiOperation)({
        summary: 'Login user',
    }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.OK,
        description: 'Success',
    }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.BAD_REQUEST,
        description: 'Bad Credentials',
    }),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [typeof (_d = typeof express_1.Request !== "undefined" && express_1.Request) === "function" ? _d : Object, typeof (_e = typeof express_1.Response !== "undefined" && express_1.Response) === "function" ? _e : Object]),
    __metadata("design:returntype", Promise)
], TouriiOnchainController.prototype, "loginUser", null);
__decorate([
    (0, common_1.Post)('keyring/register'),
    (0, swagger_1.ApiOperation)({
        summary: 'Register user',
    }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.OK,
        description: 'Success',
    }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.BAD_REQUEST,
        description: 'Bad Credentials',
    }),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [typeof (_f = typeof express_1.Request !== "undefined" && express_1.Request) === "function" ? _f : Object, typeof (_g = typeof express_1.Response !== "undefined" && express_1.Response) === "function" ? _g : Object]),
    __metadata("design:returntype", Promise)
], TouriiOnchainController.prototype, "registerUser", null);
__decorate([
    (0, common_1.Post)('keyring/logout'),
    __param(0, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [typeof (_h = typeof express_1.Response !== "undefined" && express_1.Response) === "function" ? _h : Object]),
    __metadata("design:returntype", Promise)
], TouriiOnchainController.prototype, "logoutUser", null);
__decorate([
    (0, common_1.Post)('/send-green'),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [typeof (_j = typeof express_1.Request !== "undefined" && express_1.Request) === "function" ? _j : Object, typeof (_k = typeof express_1.Response !== "undefined" && express_1.Response) === "function" ? _k : Object]),
    __metadata("design:returntype", Promise)
], TouriiOnchainController.prototype, "sendGreen", null);
__decorate([
    (0, common_1.Post)('/send-yellow'),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [typeof (_l = typeof express_1.Request !== "undefined" && express_1.Request) === "function" ? _l : Object, typeof (_m = typeof express_1.Response !== "undefined" && express_1.Response) === "function" ? _m : Object]),
    __metadata("design:returntype", Promise)
], TouriiOnchainController.prototype, "sendYellow", null);
__decorate([
    (0, common_1.Post)('/send-red'),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [typeof (_o = typeof express_1.Request !== "undefined" && express_1.Request) === "function" ? _o : Object, typeof (_p = typeof express_1.Response !== "undefined" && express_1.Response) === "function" ? _p : Object]),
    __metadata("design:returntype", Promise)
], TouriiOnchainController.prototype, "sendRed", null);
__decorate([
    (0, common_1.Get)('read-state'),
    __param(0, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [typeof (_q = typeof express_1.Response !== "undefined" && express_1.Response) === "function" ? _q : Object]),
    __metadata("design:returntype", Promise)
], TouriiOnchainController.prototype, "readState", null);
exports.TouriiOnchainController = TouriiOnchainController = __decorate([
    (0, common_1.Controller)(),
    __metadata("design:paramtypes", [typeof (_a = typeof tourii_onchain_service_1.TouriiOnchainService !== "undefined" && tourii_onchain_service_1.TouriiOnchainService) === "function" ? _a : Object])
], TouriiOnchainController);


/***/ }),

/***/ "./apps/tourii-onchain/src/main.ts":
/*!*****************************************!*\
  !*** ./apps/tourii-onchain/src/main.ts ***!
  \*****************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
const core_1 = __webpack_require__(/*! @app/core */ "./libs/core/src/index.ts");
const core_2 = __webpack_require__(/*! @nestjs/core */ "@nestjs/core");
const swagger_1 = __webpack_require__(/*! @nestjs/swagger */ "@nestjs/swagger");
const bodyParser = __importStar(__webpack_require__(/*! body-parser */ "body-parser"));
const compression_1 = __importDefault(__webpack_require__(/*! compression */ "compression"));
const nestjs_zod_1 = __webpack_require__(/*! nestjs-zod */ "nestjs-zod");
const node_fs_1 = __importDefault(__webpack_require__(/*! node:fs */ "node:fs"));
const validation_pipe_1 = __webpack_require__(/*! ./support/pipe/validation.pipe */ "./apps/tourii-onchain/src/support/pipe/validation.pipe.ts");
const tourii_onchain_module_1 = __webpack_require__(/*! ./tourii-onchain.module */ "./apps/tourii-onchain/src/tourii-onchain.module.ts");
async function bootstrap() {
    const app = await core_2.NestFactory.create(tourii_onchain_module_1.TouriiOnchainModule, {
        logger: new core_1.TouriiCoreLoggingService('debug'),
    });
    app.use((0, compression_1.default)());
    app.use(bodyParser.json({ limit: '1mb' }));
    app.use(bodyParser.urlencoded({ limit: '1mb', extended: true }));
    app.enableCors();
    app.useGlobalPipes(new validation_pipe_1.ValidationPipe());
    if ((0, core_1.getEnv)({
        key: 'EXPORT_OPENAPI_JSON',
        defaultValue: 'false',
    }) === 'true') {
        const config = new swagger_1.DocumentBuilder()
            .setTitle('Tourii Onchain API')
            .setDescription('Tourii Onchain API Def')
            .setVersion('1.0.0')
            .addTag('v1.0.0')
            .build();
        (0, nestjs_zod_1.patchNestJsSwagger)();
        const document = swagger_1.SwaggerModule.createDocument(app, config);
        const dir = './etc/openapi/onchain';
        if (!node_fs_1.default.existsSync(dir)) {
            node_fs_1.default.mkdirSync(dir, { recursive: true });
        }
        node_fs_1.default.writeFileSync(`${dir}/openapi.json`, JSON.stringify(document, null, 2));
        swagger_1.SwaggerModule.setup('api/docs', app, document);
    }
    const port = (0, core_1.getEnv)({
        key: 'TOURII_ONCHAIN_PORT',
        defaultValue: '3001',
    });
    await app.listen(port);
    const logger = new core_1.TouriiCoreLoggingService('bootstrap');
    logger.log(`🚀 Tourii Onchain running on port ${port}`);
}
bootstrap();


/***/ }),

/***/ "./apps/tourii-onchain/src/service/passport-metadata.service.ts":
/*!**********************************************************************!*\
  !*** ./apps/tourii-onchain/src/service/passport-metadata.service.ts ***!
  \**********************************************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var PassportMetadataService_1;
var _a;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.PassportMetadataService = void 0;
const passport_metadata_repository_1 = __webpack_require__(/*! @app/core/domain/passport/passport-metadata.repository */ "./libs/core/src/domain/passport/passport-metadata.repository.ts");
const common_1 = __webpack_require__(/*! @nestjs/common */ "@nestjs/common");
const tourii_onchain_app_error_type_1 = __webpack_require__(/*! ../support/exception/tourii-onchain-app-error-type */ "./apps/tourii-onchain/src/support/exception/tourii-onchain-app-error-type.ts");
const tourii_onchain_app_exception_1 = __webpack_require__(/*! ../support/exception/tourii-onchain-app-exception */ "./apps/tourii-onchain/src/support/exception/tourii-onchain-app-exception.ts");
const tourii_onchain_constant_1 = __webpack_require__(/*! ../tourii-onchain.constant */ "./apps/tourii-onchain/src/tourii-onchain.constant.ts");
let PassportMetadataService = PassportMetadataService_1 = class PassportMetadataService {
    constructor(passportMetadataRepository) {
        this.passportMetadataRepository = passportMetadataRepository;
        this.logger = new common_1.Logger(PassportMetadataService_1.name);
    }
    async getMetadata(tokenId) {
        try {
            this.logger.log(`Generating metadata for passport token ID: ${tokenId}`);
            const metadata = await this.passportMetadataRepository.generateMetadata(tokenId);
            this.logger.log(`Successfully generated metadata for passport token ID: ${tokenId}`);
            return metadata;
        }
        catch (error) {
            this.logger.error(`Failed to generate metadata for token ID ${tokenId}:`, error);
            if (error instanceof tourii_onchain_app_exception_1.TouriiOnchainAppException) {
                const apiAppError = error.getResponse();
                if (apiAppError.code === tourii_onchain_app_error_type_1.TouriiOnchainAppErrorType.E_OC_001.code) {
                    throw new common_1.NotFoundException(`Digital Passport with token ID ${tokenId} not found`);
                }
            }
            throw error;
        }
    }
    async updateMetadata(tokenId) {
        try {
            this.logger.log(`Updating metadata for passport token ID: ${tokenId}`);
            const metadataUrl = await this.passportMetadataRepository.updateMetadata(tokenId);
            this.logger.log(`Successfully updated metadata for passport token ID: ${tokenId} at ${metadataUrl}`);
            return metadataUrl;
        }
        catch (error) {
            this.logger.error(`Failed to update metadata for token ID ${tokenId}:`, error);
            throw error;
        }
    }
    getMetadataUrl(tokenId) {
        return this.passportMetadataRepository.getMetadataUrl(tokenId);
    }
};
exports.PassportMetadataService = PassportMetadataService;
exports.PassportMetadataService = PassportMetadataService = PassportMetadataService_1 = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, common_1.Inject)(tourii_onchain_constant_1.TouriiOnchainConstants.PASSPORT_METADATA_REPOSITORY_TOKEN)),
    __metadata("design:paramtypes", [typeof (_a = typeof passport_metadata_repository_1.PassportMetadataRepository !== "undefined" && passport_metadata_repository_1.PassportMetadataRepository) === "function" ? _a : Object])
], PassportMetadataService);


/***/ }),

/***/ "./apps/tourii-onchain/src/service/tourii-onchain.service.ts":
/*!*******************************************************************!*\
  !*** ./apps/tourii-onchain/src/service/tourii-onchain.service.ts ***!
  \*******************************************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var _a, _b, _c;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.TouriiOnchainService = void 0;
const encryption_repository_1 = __webpack_require__(/*! @app/core/domain/auth/encryption.repository */ "./libs/core/src/domain/auth/encryption.repository.ts");
const jwt_repository_1 = __webpack_require__(/*! @app/core/domain/auth/jwt.repository */ "./libs/core/src/domain/auth/jwt.repository.ts");
const sails_calls_repository_1 = __webpack_require__(/*! @app/core/domain/vara/sails/sails-calls-repository */ "./libs/core/src/domain/vara/sails/sails-calls-repository.ts");
const vara_contract_constant_1 = __webpack_require__(/*! @app/core/domain/vara/vara-contract-constant */ "./libs/core/src/domain/vara/vara-contract-constant.ts");
const tourii_backend_app_error_type_1 = __webpack_require__(/*! @app/core/support/exception/tourii-backend-app-error-type */ "./libs/core/src/support/exception/tourii-backend-app-error-type.ts");
const tourii_backend_app_exception_1 = __webpack_require__(/*! @app/core/support/exception/tourii-backend-app-exception */ "./libs/core/src/support/exception/tourii-backend-app-exception.ts");
const common_1 = __webpack_require__(/*! @nestjs/common */ "@nestjs/common");
const tourii_onchain_constant_1 = __webpack_require__(/*! ../tourii-onchain.constant */ "./apps/tourii-onchain/src/tourii-onchain.constant.ts");
let TouriiOnchainService = class TouriiOnchainService {
    constructor(sailsCallsRepository, jwtRepository, encryptionRepository) {
        this.sailsCallsRepository = sailsCallsRepository;
        this.jwtRepository = jwtRepository;
        this.encryptionRepository = encryptionRepository;
    }
    async initSailsCalls() {
        const sailsCalls = await this.sailsCallsRepository.initSailsCalls();
        if (!sailsCalls) {
            throw new tourii_backend_app_exception_1.TouriiBackendAppException(tourii_backend_app_error_type_1.TouriiBackendAppErrorType.E_TB_003);
        }
        return sailsCalls;
    }
    async getUserDataFromToken(token) {
        return this.jwtRepository.dataFromToken(token);
    }
    async encryptString(data) {
        return this.encryptionRepository.encryptString(data);
    }
    async handleVoucherBalance(sailsCalls, userData) {
        try {
            const voucherBalance = await sailsCalls.voucherBalance(userData.keyringVoucherId);
            if (voucherBalance < 1) {
                await sailsCalls.addTokensToVoucher({
                    userAddress: userData.keyringAddress,
                    voucherId: userData.keyringVoucherId,
                    numOfTokens: 1,
                });
            }
        }
        catch (error) {
            common_1.Logger.log(`Error while adding tokens to voucher ${error}`);
            throw new tourii_backend_app_exception_1.TouriiBackendAppException(tourii_backend_app_error_type_1.TouriiBackendAppErrorType.E_TB_008);
        }
    }
    async handleVoucherExpiration(sailsCalls, userData) {
        try {
            const voucherIsExpired = await sailsCalls.voucherIsExpired(userData.keyringAddress, userData.keyringVoucherId);
            if (voucherIsExpired) {
                await sailsCalls.renewVoucherAmountOfBlocks({
                    userAddress: userData.keyringAddress,
                    voucherId: userData.keyringVoucherId,
                    numOfBlocks: vara_contract_constant_1.VOUCHER_EXPIRATION_BLOCKS,
                });
            }
        }
        catch (error) {
            common_1.Logger.log(`Error while renewing voucher: ${JSON.stringify(error)}`);
            throw new tourii_backend_app_exception_1.TouriiBackendAppException(tourii_backend_app_error_type_1.TouriiBackendAppErrorType.E_TB_009);
        }
    }
    async unlockKeyringData(sailsCalls, userData) {
        return sailsCalls.unlockKeyringPair(userData.lockedKeyringData, userData.password);
    }
    async userKeyringAddress(token) {
        const sailsCalls = await this.initSailsCalls();
        const data = await this.getUserDataFromToken(token);
        const hashedUsername = await this.encryptString(data.username);
        const userKeyringAddress = await this.sailsCallsRepository.sailsCallsQuery(sailsCalls, {
            serviceName: 'Keyring',
            methodName: 'KeyringAddressFromUserCodedName',
            callArguments: [hashedUsername],
        });
        return userKeyringAddress;
    }
    async loginUser(username, password) {
        const sailsCalls = await this.initSailsCalls();
        const hashedUsername = await this.encryptString(username);
        const hashedPassword = await this.encryptString(password);
        const userKeyringAddress = await this.sailsCallsRepository.sailsCallsQuery(sailsCalls, {
            serviceName: 'Keyring',
            methodName: 'KeyringAddressFromUserCodedName',
            callArguments: [hashedUsername],
        });
        if (!userKeyringAddress) {
            throw new tourii_backend_app_exception_1.TouriiBackendAppException(tourii_backend_app_error_type_1.TouriiBackendAppErrorType.E_TB_004);
        }
        let lockedKeyringData;
        try {
            lockedKeyringData = sailsCalls.formatContractSignlessData(await this.sailsCallsRepository.sailsCallsQuery(sailsCalls, {
                serviceName: 'Keyring',
                methodName: 'KeyringAccountData',
                callArguments: [userKeyringAddress],
            }), username);
            sailsCalls.unlockKeyringPair(lockedKeyringData, hashedPassword);
        }
        catch (_error) {
            throw new tourii_backend_app_exception_1.TouriiBackendAppException(tourii_backend_app_error_type_1.TouriiBackendAppErrorType.E_TB_005);
        }
        const vouchersId = await sailsCalls.vouchersInContract(userKeyringAddress);
        const token = this.jwtRepository.generateJwtToken({
            username,
            keyringAddress: userKeyringAddress,
            keyringVoucherId: vouchersId[0],
            lockedKeyringData,
            password: hashedPassword,
        }, { expiresIn: '1h' });
        return token;
    }
    async registerUser(username, password) {
        const sailsCalls = await this.initSailsCalls();
        const hashedUsername = await this.encryptString(username);
        const hashedPassword = await this.encryptString(password);
        const userKeyringAddress = await this.sailsCallsRepository.sailsCallsQuery(sailsCalls, {
            serviceName: 'Keyring',
            methodName: 'KeyringAddressFromUserCodedName',
            callArguments: [hashedUsername],
        });
        if (userKeyringAddress) {
            throw new tourii_backend_app_exception_1.TouriiBackendAppException(tourii_backend_app_error_type_1.TouriiBackendAppErrorType.E_TB_006);
        }
        const newKeyringPair = await sailsCalls.createNewKeyringPair(username);
        const lockedSignlessAccount = await sailsCalls.lockkeyringPair(newKeyringPair, hashedPassword);
        const formatedLockedSignlessAccount = sailsCalls.modifyPairToContract(lockedSignlessAccount);
        let keyringVoucherId;
        try {
            keyringVoucherId = await sailsCalls.createVoucher({
                userAddress: this.encryptionRepository.decodeAddress(newKeyringPair.address),
                initialExpiredTimeInBlocks: vara_contract_constant_1.INITIAL_BLOCKS_FOR_VOUCHER,
                initialTokensInVoucher: vara_contract_constant_1.INITIAL_VOUCHER_TOKENS,
                callbacks: {
                    onLoad() {
                        common_1.Logger.log('Issue voucher to signless account...');
                    },
                    onSuccess() {
                        common_1.Logger.log('Voucher created for signless account!');
                    },
                    onError() {
                        common_1.Logger.log('Error while issue voucher to signless');
                    },
                },
            });
        }
        catch (e) {
            common_1.Logger.log('Error while issue a voucher to a singless account!');
            common_1.Logger.log(e);
            throw new tourii_backend_app_exception_1.TouriiBackendAppException(tourii_backend_app_error_type_1.TouriiBackendAppErrorType.E_TB_007);
        }
        await this.sailsCallsRepository.sailsCallsCommand(sailsCalls, {
            signerData: newKeyringPair,
            voucherId: keyringVoucherId,
            serviceName: 'Keyring',
            methodName: 'BindKeyringDataToUserCodedName',
            callArguments: [hashedUsername, formatedLockedSignlessAccount],
        });
        const token = this.jwtRepository.generateJwtToken({
            username,
            keyringAddress: this.encryptionRepository.decodeAddress(newKeyringPair.address),
            keyringVoucherId,
            lockedKeyringData: lockedSignlessAccount,
            password: hashedPassword,
        }, { expiresIn: '1h' });
        return token;
    }
    async sendGreen(token) {
        const sailsCalls = await this.initSailsCalls();
        const userData = await this.getUserDataFromToken(token);
        await this.handleVoucherBalance(sailsCalls, userData);
        await this.handleVoucherExpiration(sailsCalls, userData);
        const unlockKeyringData = await this.unlockKeyringData(sailsCalls, userData);
        const response = await this.sailsCallsRepository.sailsCallsCommand(sailsCalls, {
            signerData: unlockKeyringData,
            voucherId: userData.keyringVoucherId,
            serviceName: 'TrafficLight',
            methodName: 'Green',
            callArguments: [await this.encryptString(userData.username)],
        });
        return response;
    }
    async sendYellow(token) {
        const sailsCalls = await this.initSailsCalls();
        const userData = await this.getUserDataFromToken(token);
        await this.handleVoucherBalance(sailsCalls, userData);
        await this.handleVoucherExpiration(sailsCalls, userData);
        const unlockKeyringData = await this.unlockKeyringData(sailsCalls, userData);
        const response = await this.sailsCallsRepository.sailsCallsCommand(sailsCalls, {
            signerData: unlockKeyringData,
            voucherId: userData.keyringVoucherId,
            serviceName: 'TrafficLight',
            methodName: 'Yellow',
            callArguments: [await this.encryptString(userData.username)],
        });
        return response;
    }
    async sendRed(token) {
        const sailsCalls = await this.initSailsCalls();
        const userData = await this.getUserDataFromToken(token);
        await this.handleVoucherBalance(sailsCalls, userData);
        await this.handleVoucherExpiration(sailsCalls, userData);
        const unlockKeyringData = await this.unlockKeyringData(sailsCalls, userData);
        const response = await this.sailsCallsRepository.sailsCallsCommand(sailsCalls, {
            signerData: unlockKeyringData,
            voucherId: userData.keyringVoucherId,
            serviceName: 'TrafficLight',
            methodName: 'Red',
            callArguments: [await this.encryptString(userData.username)],
        });
        return response;
    }
    async readState() {
        const sailsCalls = await this.initSailsCalls();
        const response = await this.sailsCallsRepository.sailsCallsQuery(sailsCalls, {
            serviceName: 'TrafficLight',
            methodName: 'TrafficLight',
        });
        return response;
    }
};
exports.TouriiOnchainService = TouriiOnchainService;
exports.TouriiOnchainService = TouriiOnchainService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, common_1.Inject)(tourii_onchain_constant_1.TouriiOnchainConstants.SAILS_CALLS_REPOSITORY_TOKEN)),
    __param(1, (0, common_1.Inject)(tourii_onchain_constant_1.TouriiOnchainConstants.JWT_REPOSITORY_TOKEN)),
    __param(2, (0, common_1.Inject)(tourii_onchain_constant_1.TouriiOnchainConstants.ENCRYPTION_REPOSITORY_TOKEN)),
    __metadata("design:paramtypes", [typeof (_a = typeof sails_calls_repository_1.SailsCallsRepository !== "undefined" && sails_calls_repository_1.SailsCallsRepository) === "function" ? _a : Object, typeof (_b = typeof jwt_repository_1.JwtRepository !== "undefined" && jwt_repository_1.JwtRepository) === "function" ? _b : Object, typeof (_c = typeof encryption_repository_1.EncryptionRepository !== "undefined" && encryption_repository_1.EncryptionRepository) === "function" ? _c : Object])
], TouriiOnchainService);


/***/ }),

/***/ "./apps/tourii-onchain/src/support/context/tourii-onchain-context-provider.ts":
/*!************************************************************************************!*\
  !*** ./apps/tourii-onchain/src/support/context/tourii-onchain-context-provider.ts ***!
  \************************************************************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.TouriiOnchainContextProvider = void 0;
const request_id_1 = __webpack_require__(/*! @app/core/support/context/request-id */ "./libs/core/src/support/context/request-id.ts");
const date_utils_1 = __webpack_require__(/*! @app/core/utils/date-utils */ "./libs/core/src/utils/date-utils.ts");
const common_1 = __webpack_require__(/*! @nestjs/common */ "@nestjs/common");
const core_1 = __webpack_require__(/*! @nestjs/core */ "@nestjs/core");
let TouriiOnchainContextProvider = class TouriiOnchainContextProvider {
    constructor(req) {
        this.req = req;
        this.requestId = new request_id_1.RequestId();
        this.systemDateTime = date_utils_1.DateUtils.getJSTDate();
    }
    getSystemDateTimeJST() {
        return this.systemDateTime;
    }
    getRequestId() {
        return this.requestId;
    }
};
exports.TouriiOnchainContextProvider = TouriiOnchainContextProvider;
exports.TouriiOnchainContextProvider = TouriiOnchainContextProvider = __decorate([
    (0, common_1.Injectable)({ scope: common_1.Scope.REQUEST }),
    __param(0, (0, common_1.Inject)(core_1.REQUEST)),
    __metadata("design:paramtypes", [Object])
], TouriiOnchainContextProvider);


/***/ }),

/***/ "./apps/tourii-onchain/src/support/decorators/api-error-responses.decorator.ts":
/*!*************************************************************************************!*\
  !*** ./apps/tourii-onchain/src/support/decorators/api-error-responses.decorator.ts ***!
  \*************************************************************************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.ApiInvalidVersionResponse = exports.ApiInternalServerErrorResponse = exports.ApiResourceNotFoundResponse = void 0;
const common_1 = __webpack_require__(/*! @nestjs/common */ "@nestjs/common");
const swagger_1 = __webpack_require__(/*! @nestjs/swagger */ "@nestjs/swagger");
const tourii_onchain_app_error_type_1 = __webpack_require__(/*! ../exception/tourii-onchain-app-error-type */ "./apps/tourii-onchain/src/support/exception/tourii-onchain-app-error-type.ts");
const createErrorSchema = (errorType) => ({
    type: 'object',
    properties: {
        code: {
            type: 'string',
            example: errorType.code,
        },
        message: {
            type: 'string',
            example: errorType.message,
        },
        type: {
            type: 'string',
            example: errorType.type,
        },
    },
});
const ApiResourceNotFoundResponse = (description = 'Resource Not Found') => (0, common_1.applyDecorators)((0, swagger_1.ApiResponse)({
    status: common_1.HttpStatus.NOT_FOUND,
    description,
    schema: createErrorSchema(tourii_onchain_app_error_type_1.TouriiOnchainAppErrorType.E_OC_001),
}));
exports.ApiResourceNotFoundResponse = ApiResourceNotFoundResponse;
const ApiInternalServerErrorResponse = (description = 'Internal Server Error') => (0, common_1.applyDecorators)((0, swagger_1.ApiResponse)({
    status: common_1.HttpStatus.INTERNAL_SERVER_ERROR,
    description,
    schema: createErrorSchema(tourii_onchain_app_error_type_1.TouriiOnchainAppErrorType.E_OC_002),
}));
exports.ApiInternalServerErrorResponse = ApiInternalServerErrorResponse;
const ApiInvalidVersionResponse = (description = 'Bad Request - Invalid version format') => (0, common_1.applyDecorators)((0, swagger_1.ApiResponse)({
    status: common_1.HttpStatus.BAD_REQUEST,
    description,
    schema: createErrorSchema(tourii_onchain_app_error_type_1.TouriiOnchainAppErrorType.E_OC_004),
}));
exports.ApiInvalidVersionResponse = ApiInvalidVersionResponse;


/***/ }),

/***/ "./apps/tourii-onchain/src/support/exception/tourii-onchain-app-error-type.ts":
/*!************************************************************************************!*\
  !*** ./apps/tourii-onchain/src/support/exception/tourii-onchain-app-error-type.ts ***!
  \************************************************************************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.TouriiOnchainAppErrorType = void 0;
const error_type_1 = __webpack_require__(/*! @app/core/support/exception/error-type */ "./libs/core/src/support/exception/error-type.ts");
exports.TouriiOnchainAppErrorType = {
    E_OC_001: {
        code: 'E_OC_001',
        message: 'Resource not found',
        type: error_type_1.ErrorType.NOT_FOUND,
    },
    E_OC_002: {
        code: 'E_OC_002',
        message: 'Internal Server Error',
        type: error_type_1.ErrorType.INTERNAL_SERVER_ERROR,
    },
    E_OC_003: {
        code: 'E_OC_003',
        message: 'Version header is missing',
        type: error_type_1.ErrorType.BAD_REQUEST,
    },
    E_OC_004: {
        code: 'E_OC_004',
        message: 'Version format is invalid',
        type: error_type_1.ErrorType.BAD_REQUEST,
    },
    E_OC_005: {
        code: 'E_OC_005',
        message: 'Version is deprecated',
        type: error_type_1.ErrorType.BAD_REQUEST,
    },
};


/***/ }),

/***/ "./apps/tourii-onchain/src/support/exception/tourii-onchain-app-exception.ts":
/*!***********************************************************************************!*\
  !*** ./apps/tourii-onchain/src/support/exception/tourii-onchain-app-exception.ts ***!
  \***********************************************************************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.TouriiOnchainAppException = void 0;
const tourii_backend_app_exception_1 = __webpack_require__(/*! @app/core/support/exception/tourii-backend-app-exception */ "./libs/core/src/support/exception/tourii-backend-app-exception.ts");
const common_1 = __webpack_require__(/*! @nestjs/common */ "@nestjs/common");
class TouriiOnchainAppException extends common_1.HttpException {
    constructor(error, metadata) {
        super(new tourii_backend_app_exception_1.ApiAppError(error.code, error.message, error.type, metadata), common_1.HttpStatus.OK);
    }
}
exports.TouriiOnchainAppException = TouriiOnchainAppException;


/***/ }),

/***/ "./apps/tourii-onchain/src/support/interceptors/error.interceptor.ts":
/*!***************************************************************************!*\
  !*** ./apps/tourii-onchain/src/support/interceptors/error.interceptor.ts ***!
  \***************************************************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.ErrorInterceptor = void 0;
const tourii_backend_app_exception_1 = __webpack_require__(/*! @app/core/support/exception/tourii-backend-app-exception */ "./libs/core/src/support/exception/tourii-backend-app-exception.ts");
const common_1 = __webpack_require__(/*! @nestjs/common */ "@nestjs/common");
const rxjs_1 = __webpack_require__(/*! rxjs */ "rxjs");
const operators_1 = __webpack_require__(/*! rxjs/operators */ "rxjs/operators");
const tourii_onchain_app_error_type_1 = __webpack_require__(/*! ../exception/tourii-onchain-app-error-type */ "./apps/tourii-onchain/src/support/exception/tourii-onchain-app-error-type.ts");
const tourii_onchain_app_exception_1 = __webpack_require__(/*! ../exception/tourii-onchain-app-exception */ "./apps/tourii-onchain/src/support/exception/tourii-onchain-app-exception.ts");
let ErrorInterceptor = class ErrorInterceptor {
    intercept(_context, next) {
        return next.handle().pipe((0, operators_1.catchError)((error) => {
            var _a, _b;
            const defaultError = tourii_onchain_app_error_type_1.TouriiOnchainAppErrorType.E_OC_002;
            const metadata = {};
            if (((_a = error.response) === null || _a === void 0 ? void 0 : _a.statusCode) === 410 || ((_b = error.metadata) === null || _b === void 0 ? void 0 : _b.statusCode) === 410) {
                metadata.statusCode = 410;
            }
            let errorResponse;
            if (error instanceof tourii_onchain_app_exception_1.TouriiOnchainAppException) {
                const response = error.getResponse();
                if (response instanceof tourii_backend_app_exception_1.ApiAppError) {
                    errorResponse = new tourii_backend_app_exception_1.ApiAppError(response.code, response.message, response.type, Object.assign(Object.assign({}, response.metadata), metadata));
                }
                else {
                    errorResponse = new tourii_backend_app_exception_1.ApiAppError(defaultError.code, defaultError.message, defaultError.type, metadata);
                }
            }
            else if (error instanceof common_1.HttpException) {
                errorResponse = new tourii_backend_app_exception_1.ApiAppError(defaultError.code, error.message || defaultError.message, defaultError.type, metadata);
            }
            else {
                errorResponse = new tourii_backend_app_exception_1.ApiAppError(defaultError.code, defaultError.message, defaultError.type, metadata);
            }
            return (0, rxjs_1.throwError)(() => errorResponse);
        }));
    }
};
exports.ErrorInterceptor = ErrorInterceptor;
exports.ErrorInterceptor = ErrorInterceptor = __decorate([
    (0, common_1.Injectable)()
], ErrorInterceptor);


/***/ }),

/***/ "./apps/tourii-onchain/src/support/middleware/security.middleware.ts":
/*!***************************************************************************!*\
  !*** ./apps/tourii-onchain/src/support/middleware/security.middleware.ts ***!
  \***************************************************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var _a;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.SecurityMiddleware = void 0;
const common_1 = __webpack_require__(/*! @nestjs/common */ "@nestjs/common");
const config_1 = __webpack_require__(/*! @nestjs/config */ "@nestjs/config");
const cors_1 = __importDefault(__webpack_require__(/*! cors */ "cors"));
const helmet_1 = __importDefault(__webpack_require__(/*! helmet */ "helmet"));
let SecurityMiddleware = class SecurityMiddleware {
    constructor(configService) {
        this.configService = configService;
    }
    use(req, res, next) {
        var _a;
        try {
            const apiKey = req.header('x-api-key');
            const validApiKeys = ((_a = this.configService.get('API_KEYS')) === null || _a === void 0 ? void 0 : _a.split(',')) || [];
            if (!apiKey || !validApiKeys.includes(apiKey)) {
                throw new common_1.UnauthorizedException('Invalid or missing API key');
            }
            (0, helmet_1.default)()(req, res, () => {
                const allowedOrigin = this.configService.get('CORS_ORIGIN', 'https://*.tourii.xyz');
                const corsOptions = {
                    origin: allowedOrigin,
                    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
                    allowedHeaders: ['Content-Type', 'Authorization', 'x-api-key'],
                    credentials: true,
                };
                (0, cors_1.default)(corsOptions)(req, res, next);
            });
        }
        catch (error) {
            next(error);
        }
    }
};
exports.SecurityMiddleware = SecurityMiddleware;
exports.SecurityMiddleware = SecurityMiddleware = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [typeof (_a = typeof config_1.ConfigService !== "undefined" && config_1.ConfigService) === "function" ? _a : Object])
], SecurityMiddleware);


/***/ }),

/***/ "./apps/tourii-onchain/src/support/middleware/version.middleware.ts":
/*!**************************************************************************!*\
  !*** ./apps/tourii-onchain/src/support/middleware/version.middleware.ts ***!
  \**************************************************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var _a;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.VersionMiddleware = void 0;
const common_1 = __webpack_require__(/*! @nestjs/common */ "@nestjs/common");
const config_1 = __webpack_require__(/*! @nestjs/config */ "@nestjs/config");
const semver_1 = __importDefault(__webpack_require__(/*! semver */ "semver"));
const tourii_onchain_app_error_type_1 = __webpack_require__(/*! ../exception/tourii-onchain-app-error-type */ "./apps/tourii-onchain/src/support/exception/tourii-onchain-app-error-type.ts");
const tourii_onchain_app_exception_1 = __webpack_require__(/*! ../exception/tourii-onchain-app-exception */ "./apps/tourii-onchain/src/support/exception/tourii-onchain-app-exception.ts");
let VersionMiddleware = class VersionMiddleware {
    constructor(configService) {
        this.configService = configService;
    }
    use(req, _res, next) {
        const version = req.header('accept-version');
        const currentVersion = this.configService.get('API_VERSION', '1.0.0');
        if (!version) {
            throw new tourii_onchain_app_exception_1.TouriiOnchainAppException(tourii_onchain_app_error_type_1.TouriiOnchainAppErrorType.E_OC_003);
        }
        if (!semver_1.default.valid(version)) {
            throw new tourii_onchain_app_exception_1.TouriiOnchainAppException(tourii_onchain_app_error_type_1.TouriiOnchainAppErrorType.E_OC_004);
        }
        if (semver_1.default.lt(version, currentVersion)) {
            throw new tourii_onchain_app_exception_1.TouriiOnchainAppException(tourii_onchain_app_error_type_1.TouriiOnchainAppErrorType.E_OC_005);
        }
        next();
    }
};
exports.VersionMiddleware = VersionMiddleware;
exports.VersionMiddleware = VersionMiddleware = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [typeof (_a = typeof config_1.ConfigService !== "undefined" && config_1.ConfigService) === "function" ? _a : Object])
], VersionMiddleware);


/***/ }),

/***/ "./apps/tourii-onchain/src/support/pipe/validation.pipe.ts":
/*!*****************************************************************!*\
  !*** ./apps/tourii-onchain/src/support/pipe/validation.pipe.ts ***!
  \*****************************************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.ValidationPipe = void 0;
const common_1 = __webpack_require__(/*! @nestjs/common */ "@nestjs/common");
const class_transformer_1 = __webpack_require__(/*! class-transformer */ "class-transformer");
const class_validator_1 = __webpack_require__(/*! class-validator */ "class-validator");
let ValidationPipe = class ValidationPipe {
    async transform(value, { metatype }) {
        if (!metatype || !this.toValidate(metatype)) {
            return value;
        }
        const object = (0, class_transformer_1.plainToClass)(metatype, value);
        const errors = await (0, class_validator_1.validate)(object, {
            whitelist: true,
            forbidNonWhitelisted: true,
            forbidUnknownValues: true,
        });
        if (errors.length > 0) {
            const messages = errors.map((error) => ({
                property: error.property,
                constraints: error.constraints,
            }));
            throw new common_1.BadRequestException({
                message: 'Validation failed',
                errors: messages,
            });
        }
        return object;
    }
    toValidate(metatype) {
        const types = [String, Boolean, Number, Array, Object];
        return !types.includes(metatype);
    }
};
exports.ValidationPipe = ValidationPipe;
exports.ValidationPipe = ValidationPipe = __decorate([
    (0, common_1.Injectable)()
], ValidationPipe);


/***/ }),

/***/ "./apps/tourii-onchain/src/support/tourii-onchain-api-middleware.ts":
/*!**************************************************************************!*\
  !*** ./apps/tourii-onchain/src/support/tourii-onchain-api-middleware.ts ***!
  \**************************************************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var _a;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.TouriiOnchainApiMiddleware = void 0;
const context_storage_1 = __webpack_require__(/*! @app/core/support/context/context-storage */ "./libs/core/src/support/context/context-storage.ts");
const common_1 = __webpack_require__(/*! @nestjs/common */ "@nestjs/common");
const tourii_onchain_context_provider_1 = __webpack_require__(/*! ./context/tourii-onchain-context-provider */ "./apps/tourii-onchain/src/support/context/tourii-onchain-context-provider.ts");
let TouriiOnchainApiMiddleware = class TouriiOnchainApiMiddleware {
    constructor(logger) {
        this.logger = logger;
        this.sensitiveHeaders = ['x-api-key', 'authorization', 'cookie'];
    }
    use(req, _res, next) {
        this.context = new tourii_onchain_context_provider_1.TouriiOnchainContextProvider(req);
        const sanitizedHeaders = this.sanitizeHeaders(req.headers);
        const additionalInfo = Object.assign(Object.assign(Object.assign({ Headers: sanitizedHeaders }, (req.params &&
            Object.keys(req.params).length > 0 && {
            Params: req.params,
        })), (req.body &&
            Object.keys(req.body).length > 0 && {
            Body: req.body,
        })), (req.query &&
            Object.keys(req.query).length > 0 && {
            Query: req.query,
        }));
        if (req.headers['user-agent'] !== 'ELB-HealthChecker/2.0') {
            this.logger.log(JSON.stringify(additionalInfo), this.context.getRequestId());
        }
        context_storage_1.ContextStorage.run(this.context, () => {
            next();
        });
    }
    sanitizeHeaders(headers) {
        const sanitized = Object.assign({}, headers);
        this.sensitiveHeaders.forEach((header) => {
            if (sanitized[header]) {
                sanitized[header] = '**REDACTED**';
            }
        });
        return sanitized;
    }
};
exports.TouriiOnchainApiMiddleware = TouriiOnchainApiMiddleware;
exports.TouriiOnchainApiMiddleware = TouriiOnchainApiMiddleware = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [typeof (_a = typeof common_1.Logger !== "undefined" && common_1.Logger) === "function" ? _a : Object])
], TouriiOnchainApiMiddleware);


/***/ }),

/***/ "./apps/tourii-onchain/src/tourii-onchain.constant.ts":
/*!************************************************************!*\
  !*** ./apps/tourii-onchain/src/tourii-onchain.constant.ts ***!
  \************************************************************/
/***/ ((__unused_webpack_module, exports) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.TouriiOnchainConstants = void 0;
var TouriiOnchainConstants;
(function (TouriiOnchainConstants) {
    TouriiOnchainConstants["SAILS_CALLS_REPOSITORY_TOKEN"] = "SAILS_CALLS_REPOSITORY_TOKEN";
    TouriiOnchainConstants["JWT_REPOSITORY_TOKEN"] = "JWT_REPOSITORY_TOKEN";
    TouriiOnchainConstants["ENCRYPTION_REPOSITORY_TOKEN"] = "ENCRYPTION_REPOSITORY_TOKEN";
    TouriiOnchainConstants["PASSPORT_METADATA_REPOSITORY_TOKEN"] = "PASSPORT_METADATA_REPOSITORY_TOKEN";
    TouriiOnchainConstants["CONTEXT_PROVIDER_TOKEN"] = "CONTEXT_PROVIDER_TOKEN";
    TouriiOnchainConstants["USER_REPOSITORY_TOKEN"] = "USER_REPOSITORY_TOKEN";
    TouriiOnchainConstants["R2_STORAGE_REPOSITORY_TOKEN"] = "R2_STORAGE_REPOSITORY_TOKEN";
})(TouriiOnchainConstants || (exports.TouriiOnchainConstants = TouriiOnchainConstants = {}));


/***/ }),

/***/ "./apps/tourii-onchain/src/tourii-onchain.module.ts":
/*!**********************************************************!*\
  !*** ./apps/tourii-onchain/src/tourii-onchain.module.ts ***!
  \**********************************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var _a;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.TouriiOnchainModule = void 0;
const core_1 = __webpack_require__(/*! @app/core */ "./libs/core/src/index.ts");
const sails_calls_repository_api_1 = __webpack_require__(/*! @app/core/infrastructure/api/sails-calls-repository-api */ "./libs/core/src/infrastructure/api/sails-calls-repository-api.ts");
const encryption_repository_auth_1 = __webpack_require__(/*! @app/core/infrastructure/authentication/encryption-repository-auth */ "./libs/core/src/infrastructure/authentication/encryption-repository-auth.ts");
const jwt_repository_auth_1 = __webpack_require__(/*! @app/core/infrastructure/authentication/jwt-repository-auth */ "./libs/core/src/infrastructure/authentication/jwt-repository-auth.ts");
const passport_metadata_repository_impl_1 = __webpack_require__(/*! @app/core/infrastructure/passport/passport-metadata.repository-impl */ "./libs/core/src/infrastructure/passport/passport-metadata.repository-impl.ts");
const r2_storage_repository_s3_1 = __webpack_require__(/*! @app/core/infrastructure/storage/r2-storage.repository-s3 */ "./libs/core/src/infrastructure/storage/r2-storage.repository-s3.ts");
const prisma_service_1 = __webpack_require__(/*! @app/core/provider/prisma.service */ "./libs/core/src/provider/prisma.service.ts");
const tourii_backend_logging_service_1 = __webpack_require__(/*! @app/core/provider/tourii-backend-logging-service */ "./libs/core/src/provider/tourii-backend-logging-service.ts");
const env_utils_1 = __webpack_require__(/*! @app/core/utils/env-utils */ "./libs/core/src/utils/env-utils.ts");
const axios_1 = __webpack_require__(/*! @nestjs/axios */ "@nestjs/axios");
const common_1 = __webpack_require__(/*! @nestjs/common */ "@nestjs/common");
const config_1 = __webpack_require__(/*! @nestjs/config */ "@nestjs/config");
const core_2 = __webpack_require__(/*! @nestjs/core */ "@nestjs/core");
const throttler_1 = __webpack_require__(/*! @nestjs/throttler */ "@nestjs/throttler");
const passport_metadata_controller_1 = __webpack_require__(/*! ./controller/passport-metadata.controller */ "./apps/tourii-onchain/src/controller/passport-metadata.controller.ts");
const tourii_onchain_controller_1 = __webpack_require__(/*! ./controller/tourii-onchain.controller */ "./apps/tourii-onchain/src/controller/tourii-onchain.controller.ts");
const passport_metadata_service_1 = __webpack_require__(/*! ./service/passport-metadata.service */ "./apps/tourii-onchain/src/service/passport-metadata.service.ts");
const tourii_onchain_service_1 = __webpack_require__(/*! ./service/tourii-onchain.service */ "./apps/tourii-onchain/src/service/tourii-onchain.service.ts");
const tourii_onchain_context_provider_1 = __webpack_require__(/*! ./support/context/tourii-onchain-context-provider */ "./apps/tourii-onchain/src/support/context/tourii-onchain-context-provider.ts");
const error_interceptor_1 = __webpack_require__(/*! ./support/interceptors/error.interceptor */ "./apps/tourii-onchain/src/support/interceptors/error.interceptor.ts");
const security_middleware_1 = __webpack_require__(/*! ./support/middleware/security.middleware */ "./apps/tourii-onchain/src/support/middleware/security.middleware.ts");
const version_middleware_1 = __webpack_require__(/*! ./support/middleware/version.middleware */ "./apps/tourii-onchain/src/support/middleware/version.middleware.ts");
const tourii_onchain_api_middleware_1 = __webpack_require__(/*! ./support/tourii-onchain-api-middleware */ "./apps/tourii-onchain/src/support/tourii-onchain-api-middleware.ts");
const tourii_onchain_constant_1 = __webpack_require__(/*! ./tourii-onchain.constant */ "./apps/tourii-onchain/src/tourii-onchain.constant.ts");
let TouriiOnchainModule = class TouriiOnchainModule {
    constructor(refHost) {
        this.refHost = refHost;
    }
    configure(consumer) {
        consumer
            .apply(security_middleware_1.SecurityMiddleware, version_middleware_1.VersionMiddleware)
            .forRoutes('*')
            .apply(tourii_onchain_api_middleware_1.TouriiOnchainApiMiddleware)
            .forRoutes('*');
    }
};
exports.TouriiOnchainModule = TouriiOnchainModule;
exports.TouriiOnchainModule = TouriiOnchainModule = __decorate([
    (0, common_1.Module)({
        imports: [
            axios_1.HttpModule,
            config_1.ConfigModule.forRoot({
                envFilePath: `.env.${(0, env_utils_1.getEnv)({ key: 'NODE_ENV', defaultValue: '' })}`,
            }),
            throttler_1.ThrottlerModule.forRoot([
                {
                    ttl: 60000,
                    limit: 10,
                },
            ]),
        ],
        controllers: [tourii_onchain_controller_1.TouriiOnchainController, passport_metadata_controller_1.PassportMetadataController],
        providers: [
            common_1.Logger,
            tourii_backend_logging_service_1.TouriiBackendLoggingService,
            tourii_onchain_service_1.TouriiOnchainService,
            passport_metadata_service_1.PassportMetadataService,
            core_2.HttpAdapterHost,
            prisma_service_1.PrismaService,
            {
                provide: tourii_onchain_constant_1.TouriiOnchainConstants.CONTEXT_PROVIDER_TOKEN,
                useClass: tourii_onchain_context_provider_1.TouriiOnchainContextProvider,
            },
            {
                provide: tourii_onchain_constant_1.TouriiOnchainConstants.SAILS_CALLS_REPOSITORY_TOKEN,
                useClass: sails_calls_repository_api_1.SailsCallsRepositoryApi,
            },
            {
                provide: tourii_onchain_constant_1.TouriiOnchainConstants.ENCRYPTION_REPOSITORY_TOKEN,
                useClass: encryption_repository_auth_1.EncryptionRepositoryAuth,
            },
            {
                provide: tourii_onchain_constant_1.TouriiOnchainConstants.JWT_REPOSITORY_TOKEN,
                useClass: jwt_repository_auth_1.JwtRepositoryAuth,
            },
            {
                provide: tourii_onchain_constant_1.TouriiOnchainConstants.USER_REPOSITORY_TOKEN,
                useClass: core_1.UserRepositoryDb,
            },
            {
                provide: tourii_onchain_constant_1.TouriiOnchainConstants.R2_STORAGE_REPOSITORY_TOKEN,
                useClass: r2_storage_repository_s3_1.R2StorageRepositoryS3,
            },
            {
                provide: tourii_onchain_constant_1.TouriiOnchainConstants.PASSPORT_METADATA_REPOSITORY_TOKEN,
                useClass: passport_metadata_repository_impl_1.PassportMetadataRepositoryImpl,
            },
            {
                provide: core_2.APP_INTERCEPTOR,
                useClass: error_interceptor_1.ErrorInterceptor,
            },
            {
                provide: core_2.APP_GUARD,
                useClass: throttler_1.ThrottlerGuard,
            },
        ],
    }),
    __metadata("design:paramtypes", [typeof (_a = typeof core_2.HttpAdapterHost !== "undefined" && core_2.HttpAdapterHost) === "function" ? _a : Object])
], TouriiOnchainModule);


/***/ }),

/***/ "./libs/core/src/core.service.ts":
/*!***************************************!*\
  !*** ./libs/core/src/core.service.ts ***!
  \***************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.CoreService = void 0;
const common_1 = __webpack_require__(/*! @nestjs/common */ "@nestjs/common");
let CoreService = class CoreService {
};
exports.CoreService = CoreService;
exports.CoreService = CoreService = __decorate([
    (0, common_1.Injectable)()
], CoreService);


/***/ }),

/***/ "./libs/core/src/domain/auth/encryption.repository.ts":
/*!************************************************************!*\
  !*** ./libs/core/src/domain/auth/encryption.repository.ts ***!
  \************************************************************/
/***/ ((__unused_webpack_module, exports) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));


/***/ }),

/***/ "./libs/core/src/domain/auth/jwt.repository.ts":
/*!*****************************************************!*\
  !*** ./libs/core/src/domain/auth/jwt.repository.ts ***!
  \*****************************************************/
/***/ ((__unused_webpack_module, exports) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));


/***/ }),

/***/ "./libs/core/src/domain/entity.ts":
/*!****************************************!*\
  !*** ./libs/core/src/domain/entity.ts ***!
  \****************************************/
/***/ ((__unused_webpack_module, exports) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.Entity = void 0;
class Entity {
    constructor(props, id) {
        this.props = props;
        this._id = id;
    }
    get id() {
        return this._id;
    }
}
exports.Entity = Entity;


/***/ }),

/***/ "./libs/core/src/domain/feed/moment-type.ts":
/*!**************************************************!*\
  !*** ./libs/core/src/domain/feed/moment-type.ts ***!
  \**************************************************/
/***/ ((__unused_webpack_module, exports) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.MomentType = void 0;
var MomentType;
(function (MomentType) {
    MomentType["TRAVEL"] = "TRAVEL";
    MomentType["QUEST"] = "QUEST";
    MomentType["STORY"] = "STORY";
    MomentType["ITEM"] = "ITEM";
    MomentType["INVITE"] = "INVITE";
})(MomentType || (exports.MomentType = MomentType = {}));


/***/ }),

/***/ "./libs/core/src/domain/feed/moment.entity.ts":
/*!****************************************************!*\
  !*** ./libs/core/src/domain/feed/moment.entity.ts ***!
  \****************************************************/
/***/ ((__unused_webpack_module, exports) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.MomentEntity = void 0;
class MomentEntity {
    constructor(props) {
        this.props = props;
    }
    get id() {
        return this.props.id;
    }
    get userId() {
        return this.props.userId;
    }
    get username() {
        return this.props.username;
    }
    get imageUrl() {
        return this.props.imageUrl;
    }
    get description() {
        return this.props.description;
    }
    get rewardText() {
        return this.props.rewardText;
    }
    get totalItems() {
        return this.props.totalItems;
    }
    get insDateTime() {
        return this.props.insDateTime;
    }
    get momentType() {
        return this.props.momentType;
    }
    static fromViewData(data) {
        const momentType = data.momentType;
        const baseProps = {
            id: data.id,
            userId: data.userId,
            username: data.username || undefined,
            imageUrl: data.imageUrl || undefined,
            description: data.description || undefined,
            rewardText: data.rewardText || undefined,
            insDateTime: data.insDateTime,
            momentType,
            totalItems: data.totalItems,
        };
        switch (momentType) {
            case 'TRAVEL':
                return new MomentEntity(Object.assign(Object.assign({}, baseProps), { description: baseProps.description || 'Visited a location' }));
            case 'QUEST':
                return new MomentEntity(Object.assign(Object.assign({}, baseProps), { description: baseProps.description || 'Completed a quest' }));
            case 'STORY':
                return new MomentEntity(Object.assign(Object.assign({}, baseProps), { description: baseProps.description || 'Story completed', rewardText: baseProps.rewardText || 'Story completed' }));
            case 'ITEM':
                return new MomentEntity(Object.assign(Object.assign({}, baseProps), { description: baseProps.description || 'Claimed item', rewardText: baseProps.rewardText || 'Claimed item' }));
            case 'INVITE':
                return new MomentEntity(Object.assign(Object.assign({}, baseProps), { imageUrl: undefined, description: 'Invited a friend', rewardText: baseProps.rewardText || 'Earned points for inviting' }));
            default:
                return new MomentEntity(baseProps);
        }
    }
}
exports.MomentEntity = MomentEntity;


/***/ }),

/***/ "./libs/core/src/domain/feed/moment.repository.ts":
/*!********************************************************!*\
  !*** ./libs/core/src/domain/feed/moment.repository.ts ***!
  \********************************************************/
/***/ ((__unused_webpack_module, exports) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));


/***/ }),

/***/ "./libs/core/src/domain/game/model-route/model-route.entity.ts":
/*!*********************************************************************!*\
  !*** ./libs/core/src/domain/game/model-route/model-route.entity.ts ***!
  \*********************************************************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.ModelRouteEntity = void 0;
const entity_1 = __webpack_require__(/*! ../../entity */ "./libs/core/src/domain/entity.ts");
class ModelRouteEntity extends entity_1.Entity {
    constructor(props, id) {
        super(props, id);
    }
    get modelRouteId() {
        return this.id;
    }
    get storyId() {
        return this.props.storyId;
    }
    get routeName() {
        return this.props.routeName;
    }
    get recommendation() {
        return this.props.recommendation;
    }
    get region() {
        return this.props.region;
    }
    get regionDesc() {
        return this.props.regionDesc;
    }
    get regionLatitude() {
        return this.props.regionLatitude;
    }
    get regionLongitude() {
        return this.props.regionLongitude;
    }
    get regionBackgroundMedia() {
        return this.props.regionBackgroundMedia;
    }
    get touristSpotList() {
        return this.props.touristSpotList;
    }
    get delFlag() {
        return this.props.delFlag;
    }
    get insUserId() {
        return this.props.insUserId;
    }
    get insDateTime() {
        return this.props.insDateTime;
    }
    get updUserId() {
        return this.props.updUserId;
    }
    get updDateTime() {
        return this.props.updDateTime;
    }
    get requestId() {
        return this.props.requestId;
    }
    getValidChapterSpotPairs() {
        if (!this.props.touristSpotList) {
            return [];
        }
        return this.props.touristSpotList
            .filter((spot) => spot.storyChapterId && spot.touristSpotId)
            .map((spot) => ({
            storyChapterId: spot.storyChapterId,
            touristSpotId: spot.touristSpotId,
        }));
    }
}
exports.ModelRouteEntity = ModelRouteEntity;


/***/ }),

/***/ "./libs/core/src/domain/game/model-route/model-route.repository.ts":
/*!*************************************************************************!*\
  !*** ./libs/core/src/domain/game/model-route/model-route.repository.ts ***!
  \*************************************************************************/
/***/ ((__unused_webpack_module, exports) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));


/***/ }),

/***/ "./libs/core/src/domain/game/model-route/tourist-spot.ts":
/*!***************************************************************!*\
  !*** ./libs/core/src/domain/game/model-route/tourist-spot.ts ***!
  \***************************************************************/
/***/ ((__unused_webpack_module, exports) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.TouristSpot = void 0;
class TouristSpot {
    constructor(props) {
        this.props = props;
    }
    get storyChapterId() {
        return this.props.storyChapterId;
    }
    get touristSpotId() {
        return this.props.touristSpotId;
    }
    get touristSpotName() {
        return this.props.touristSpotName;
    }
    get touristSpotDesc() {
        return this.props.touristSpotDesc;
    }
    get latitude() {
        return this.props.latitude;
    }
    get longitude() {
        return this.props.longitude;
    }
    get bestVisitTime() {
        return this.props.bestVisitTime;
    }
    get address() {
        return this.props.address;
    }
    get storyChapterLink() {
        return this.props.storyChapterLink;
    }
    get touristSpotHashtag() {
        return this.props.touristSpotHashtag;
    }
    get imageSet() {
        return this.props.imageSet;
    }
    get delFlag() {
        return this.props.delFlag;
    }
    get insUserId() {
        return this.props.insUserId;
    }
    get insDateTime() {
        return this.props.insDateTime;
    }
    get updUserId() {
        return this.props.updUserId;
    }
    get updDateTime() {
        return this.props.updDateTime;
    }
    get requestId() {
        return this.props.requestId;
    }
}
exports.TouristSpot = TouristSpot;


/***/ }),

/***/ "./libs/core/src/domain/game/quest/quest.entity.ts":
/*!*********************************************************!*\
  !*** ./libs/core/src/domain/game/quest/quest.entity.ts ***!
  \*********************************************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.QuestEntityWithPagination = exports.QuestEntity = void 0;
const entity_1 = __webpack_require__(/*! ../../entity */ "./libs/core/src/domain/entity.ts");
class QuestEntity extends entity_1.Entity {
    constructor(props, id) {
        super(props, id);
    }
    get questId() {
        return this.id;
    }
    get questName() {
        return this.props.questName;
    }
    get questDesc() {
        return this.props.questDesc;
    }
    get questType() {
        return this.props.questType;
    }
    get questImage() {
        return this.props.questImage;
    }
    get isUnlocked() {
        return this.props.isUnlocked;
    }
    get isPremium() {
        return this.props.isPremium;
    }
    get totalMagatamaPointAwarded() {
        return this.props.totalMagatamaPointAwarded;
    }
    get rewardType() {
        return this.props.rewardType;
    }
    get delFlag() {
        return this.props.delFlag;
    }
    get insUserId() {
        return this.props.insUserId;
    }
    get insDateTime() {
        return this.props.insDateTime;
    }
    get updUserId() {
        return this.props.updUserId;
    }
    get updDateTime() {
        return this.props.updDateTime;
    }
    get requestId() {
        return this.props.requestId;
    }
    get tasks() {
        return this.props.tasks;
    }
    get touristSpot() {
        return this.props.touristSpot;
    }
    get completedTasks() {
        return this.props.completedTasks;
    }
}
exports.QuestEntity = QuestEntity;
class QuestEntityWithPagination {
    constructor(quests, totalQuests, currentPage, limit) {
        this.quests = quests;
        this.pagination = {
            currentPage: currentPage,
            totalPages: Math.ceil(totalQuests / limit),
            totalQuests: totalQuests,
        };
    }
    static default() {
        return new QuestEntityWithPagination([], 0, 0, 0);
    }
}
exports.QuestEntityWithPagination = QuestEntityWithPagination;


/***/ }),

/***/ "./libs/core/src/domain/game/quest/quest.repository.ts":
/*!*************************************************************!*\
  !*** ./libs/core/src/domain/game/quest/quest.repository.ts ***!
  \*************************************************************/
/***/ ((__unused_webpack_module, exports) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));


/***/ }),

/***/ "./libs/core/src/domain/game/quest/task.ts":
/*!*************************************************!*\
  !*** ./libs/core/src/domain/game/quest/task.ts ***!
  \*************************************************/
/***/ ((__unused_webpack_module, exports) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.Task = void 0;
class Task {
    constructor(props) {
        this.props = props;
    }
    get taskId() {
        return this.props.taskId;
    }
    get taskTheme() {
        return this.props.taskTheme;
    }
    get taskType() {
        return this.props.taskType;
    }
    get taskName() {
        return this.props.taskName;
    }
    get taskDesc() {
        return this.props.taskDesc;
    }
    get isUnlocked() {
        return this.props.isUnlocked;
    }
    get requiredAction() {
        return this.props.requiredAction;
    }
    get groupActivityMembers() {
        return this.props.groupActivityMembers;
    }
    get selectOptions() {
        return this.props.selectOptions;
    }
    get antiCheatRules() {
        return this.props.antiCheatRules;
    }
    get magatamaPointAwarded() {
        return this.props.magatamaPointAwarded;
    }
    get rewardEarned() {
        return this.props.rewardEarned;
    }
    get delFlag() {
        return this.props.delFlag;
    }
    get insUserId() {
        return this.props.insUserId;
    }
    get insDateTime() {
        return this.props.insDateTime;
    }
    get updUserId() {
        return this.props.updUserId;
    }
    get updDateTime() {
        return this.props.updDateTime;
    }
    get requestId() {
        return this.props.requestId;
    }
    get isCompleted() {
        return this.props.isCompleted;
    }
}
exports.Task = Task;


/***/ }),

/***/ "./libs/core/src/domain/game/quest/user-task-log.repository.ts":
/*!*********************************************************************!*\
  !*** ./libs/core/src/domain/game/quest/user-task-log.repository.ts ***!
  \*********************************************************************/
/***/ ((__unused_webpack_module, exports) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));


/***/ }),

/***/ "./libs/core/src/domain/game/story/chapter-story.ts":
/*!**********************************************************!*\
  !*** ./libs/core/src/domain/game/story/chapter-story.ts ***!
  \**********************************************************/
/***/ ((__unused_webpack_module, exports) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.StoryChapter = void 0;
class StoryChapter {
    constructor(props) {
        this.props = props;
    }
    get storyId() {
        return this.props.storyId;
    }
    get storyChapterId() {
        return this.props.storyChapterId;
    }
    get sagaName() {
        return this.props.sagaName;
    }
    get touristSpotId() {
        return this.props.touristSpotId;
    }
    get chapterNumber() {
        return this.props.chapterNumber;
    }
    get chapterTitle() {
        return this.props.chapterTitle;
    }
    get chapterDesc() {
        return this.props.chapterDesc;
    }
    get chapterImage() {
        return this.props.chapterImage;
    }
    get characterNameList() {
        return this.props.characterNameList;
    }
    get realWorldImage() {
        return this.props.realWorldImage;
    }
    get chapterVideoUrl() {
        return this.props.chapterVideoUrl;
    }
    get chapterVideoMobileUrl() {
        return this.props.chapterVideoMobileUrl;
    }
    get chapterPdfUrl() {
        return this.props.chapterPdfUrl;
    }
    get isUnlocked() {
        return this.props.isUnlocked;
    }
    get delFlag() {
        return this.props.delFlag;
    }
    get insUserId() {
        return this.props.insUserId;
    }
    get insDateTime() {
        return this.props.insDateTime;
    }
    get updUserId() {
        return this.props.updUserId;
    }
    get updDateTime() {
        return this.props.updDateTime;
    }
    get requestId() {
        return this.props.requestId;
    }
}
exports.StoryChapter = StoryChapter;


/***/ }),

/***/ "./libs/core/src/domain/game/story/story.entity.ts":
/*!*********************************************************!*\
  !*** ./libs/core/src/domain/game/story/story.entity.ts ***!
  \*********************************************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.StoryEntity = void 0;
const entity_1 = __webpack_require__(/*! ../../entity */ "./libs/core/src/domain/entity.ts");
class StoryEntity extends entity_1.Entity {
    constructor(props, id) {
        super(props, id);
    }
    get storyId() {
        return this.id;
    }
    get sagaName() {
        return this.props.sagaName;
    }
    get sagaDesc() {
        return this.props.sagaDesc;
    }
    get backgroundMedia() {
        return this.props.backgroundMedia;
    }
    get mapImage() {
        return this.props.mapImage;
    }
    get location() {
        return this.props.location;
    }
    get order() {
        return this.props.order;
    }
    get isPrologue() {
        return this.props.isPrologue;
    }
    get isSelected() {
        return this.props.isSelected;
    }
    get chapterList() {
        return this.props.chapterList;
    }
    get delFlag() {
        return this.props.delFlag;
    }
    get insUserId() {
        return this.props.insUserId;
    }
    get insDateTime() {
        return this.props.insDateTime;
    }
    get updUserId() {
        return this.props.updUserId;
    }
    get updDateTime() {
        return this.props.updDateTime;
    }
    get requestId() {
        return this.props.requestId;
    }
}
exports.StoryEntity = StoryEntity;


/***/ }),

/***/ "./libs/core/src/domain/game/story/story.repository.ts":
/*!*************************************************************!*\
  !*** ./libs/core/src/domain/game/story/story.repository.ts ***!
  \*************************************************************/
/***/ ((__unused_webpack_module, exports) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));


/***/ }),

/***/ "./libs/core/src/domain/game/story/user-story-log.repository.ts":
/*!**********************************************************************!*\
  !*** ./libs/core/src/domain/game/story/user-story-log.repository.ts ***!
  \**********************************************************************/
/***/ ((__unused_webpack_module, exports) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));


/***/ }),

/***/ "./libs/core/src/domain/geo/geo-info.repository.ts":
/*!*********************************************************!*\
  !*** ./libs/core/src/domain/geo/geo-info.repository.ts ***!
  \*********************************************************/
/***/ ((__unused_webpack_module, exports) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));


/***/ }),

/***/ "./libs/core/src/domain/geo/geo-info.ts":
/*!**********************************************!*\
  !*** ./libs/core/src/domain/geo/geo-info.ts ***!
  \**********************************************/
/***/ ((__unused_webpack_module, exports) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.isGeoInfoListUndefined = void 0;
const isGeoInfoListUndefined = (geoInfoList) => {
    return !geoInfoList || geoInfoList.length === 0;
};
exports.isGeoInfoListUndefined = isGeoInfoListUndefined;


/***/ }),

/***/ "./libs/core/src/domain/geo/weather-info.repository.ts":
/*!*************************************************************!*\
  !*** ./libs/core/src/domain/geo/weather-info.repository.ts ***!
  \*************************************************************/
/***/ ((__unused_webpack_module, exports) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));


/***/ }),

/***/ "./libs/core/src/domain/geo/weather-info.ts":
/*!**************************************************!*\
  !*** ./libs/core/src/domain/geo/weather-info.ts ***!
  \**************************************************/
/***/ ((__unused_webpack_module, exports) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.isWeatherResultUndefined = void 0;
const isWeatherResultUndefined = (weatherResult) => {
    return !weatherResult || weatherResult.length === 0;
};
exports.isWeatherResultUndefined = isWeatherResultUndefined;


/***/ }),

/***/ "./libs/core/src/domain/passport/digital-passport-metadata.ts":
/*!********************************************************************!*\
  !*** ./libs/core/src/domain/passport/digital-passport-metadata.ts ***!
  \********************************************************************/
/***/ ((__unused_webpack_module, exports) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.DigitalPassportMetadataBuilder = void 0;
class DigitalPassportMetadataBuilder {
    static build(input) {
        const passportTypeName = this.getPassportTypeName(input.passportType);
        const levelName = this.getLevelName(input.level);
        return {
            name: `${passportTypeName} Digital Passport #${input.tokenId}`,
            description: `Tourii Digital Passport for ${input.username}. This passport grants access to exclusive travel experiences and tracks your journey through Japan's hidden gems.`,
            image: this.generateImageUrl(input.passportType, input.level),
            external_url: `https://tourii.com/passport/${input.tokenId}`,
            attributes: [
                {
                    trait_type: 'Passport Type',
                    value: passportTypeName,
                },
                {
                    trait_type: 'Level',
                    value: levelName,
                },
                {
                    trait_type: 'Username',
                    value: input.username,
                },
                {
                    trait_type: 'Quests Completed',
                    value: input.totalQuestCompleted,
                    display_type: 'number',
                },
                {
                    trait_type: 'Travel Distance',
                    value: Math.floor(input.totalTravelDistance),
                    display_type: 'number',
                },
                {
                    trait_type: 'Magatama Points',
                    value: input.magatamaPoints,
                    display_type: 'number',
                },
                {
                    trait_type: 'Premium Status',
                    value: input.isPremium ? 'Premium' : 'Standard',
                },
                {
                    trait_type: 'Registration Date',
                    value: Math.floor(input.registeredAt.getTime() / 1000),
                    display_type: 'date',
                },
                ...(input.prayerBead !== undefined && input.prayerBead > 0 ? [{
                        trait_type: 'Prayer Beads',
                        value: input.prayerBead,
                        display_type: 'number',
                    }] : []),
                ...(input.sword !== undefined && input.sword > 0 ? [{
                        trait_type: 'Swords',
                        value: input.sword,
                        display_type: 'number',
                    }] : []),
                ...(input.orgeMask !== undefined && input.orgeMask > 0 ? [{
                        trait_type: 'Orge Masks',
                        value: input.orgeMask,
                        display_type: 'number',
                    }] : []),
            ],
        };
    }
    static getPassportTypeName(type) {
        const typeNames = {
            BONJIN: 'Bonjin',
            AMATSUKAMI: 'Amatsukami',
            KUNITSUKAMI: 'Kunitsukami',
            YOKAI: 'Yokai',
        };
        return typeNames[type] || 'Unknown';
    }
    static getLevelName(level) {
        const levelNames = {
            BONJIN: 'Bonjin',
            E_CLASS_AMATSUKAMI: 'E-Class Amatsukami',
            E_CLASS_KUNITSUKAMI: 'E-Class Kunitsukami',
            E_CLASS_YOKAI: 'E-Class Yokai',
            D_CLASS_AMATSUKAMI: 'D-Class Amatsukami',
            D_CLASS_KUNITSUKAMI: 'D-Class Kunitsukami',
            D_CLASS_YOKAI: 'D-Class Yokai',
            C_CLASS_AMATSUKAMI: 'C-Class Amatsukami',
            C_CLASS_KUNITSUKAMI: 'C-Class Kunitsukami',
            C_CLASS_YOKAI: 'C-Class Yokai',
            B_CLASS_AMATSUKAMI: 'B-Class Amatsukami',
            B_CLASS_KUNITSUKAMI: 'B-Class Kunitsukami',
            B_CLASS_YOKAI: 'B-Class Yokai',
            A_CLASS_AMATSUKAMI: 'A-Class Amatsukami',
            A_CLASS_KUNITSUKAMI: 'A-Class Kunitsukami',
            A_CLASS_YOKAI: 'A-Class Yokai',
            S_CLASS_AMATSUKAMI: 'S-Class Amatsukami',
            S_CLASS_KUNITSUKAMI: 'S-Class Kunitsukami',
            S_CLASS_YOKAI: 'S-Class Yokai',
        };
        return levelNames[level] || 'Unknown';
    }
    static generateImageUrl(passportType, level) {
        const baseUrl = 'https://assets.tourii.com/passport';
        const typeSlug = passportType.toLowerCase();
        const levelSlug = level.toLowerCase().replace(/_/g, '-');
        return `${baseUrl}/${typeSlug}/${levelSlug}.png`;
    }
}
exports.DigitalPassportMetadataBuilder = DigitalPassportMetadataBuilder;


/***/ }),

/***/ "./libs/core/src/domain/passport/digital-passport.repository.ts":
/*!**********************************************************************!*\
  !*** ./libs/core/src/domain/passport/digital-passport.repository.ts ***!
  \**********************************************************************/
/***/ ((__unused_webpack_module, exports) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));


/***/ }),

/***/ "./libs/core/src/domain/passport/passport-metadata.repository.ts":
/*!***********************************************************************!*\
  !*** ./libs/core/src/domain/passport/passport-metadata.repository.ts ***!
  \***********************************************************************/
/***/ ((__unused_webpack_module, exports) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));


/***/ }),

/***/ "./libs/core/src/domain/storage/r2-storage.repository.ts":
/*!***************************************************************!*\
  !*** ./libs/core/src/domain/storage/r2-storage.repository.ts ***!
  \***************************************************************/
/***/ ((__unused_webpack_module, exports) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));


/***/ }),

/***/ "./libs/core/src/domain/user/discord-activity-log.ts":
/*!***********************************************************!*\
  !*** ./libs/core/src/domain/user/discord-activity-log.ts ***!
  \***********************************************************/
/***/ ((__unused_webpack_module, exports) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.DiscordActivityLog = void 0;
class DiscordActivityLog {
    constructor(props) {
        this.props = props;
    }
    get discordActivityLogId() {
        return this.props.discordActivityLogId;
    }
    get userId() {
        return this.props.userId;
    }
    get activityType() {
        return this.props.activityType;
    }
    get activityDetails() {
        return this.props.activityDetails;
    }
    get magatamaPointAwarded() {
        return this.props.magatamaPointAwarded;
    }
    get delFlag() {
        return this.props.delFlag;
    }
    get insUserId() {
        return this.props.insUserId;
    }
    get insDateTime() {
        return this.props.insDateTime;
    }
    get updUserId() {
        return this.props.updUserId;
    }
    get updDateTime() {
        return this.props.updDateTime;
    }
    get requestId() {
        return this.props.requestId;
    }
}
exports.DiscordActivityLog = DiscordActivityLog;


/***/ }),

/***/ "./libs/core/src/domain/user/discord-rewarded-roles.ts":
/*!*************************************************************!*\
  !*** ./libs/core/src/domain/user/discord-rewarded-roles.ts ***!
  \*************************************************************/
/***/ ((__unused_webpack_module, exports) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.DiscordRewardedRoles = void 0;
class DiscordRewardedRoles {
    constructor(props) {
        this.props = props;
    }
    get discordRewardedRolesId() {
        return this.props.discordRewardedRolesId;
    }
    get userId() {
        return this.props.userId;
    }
    get roleId() {
        return this.props.roleId;
    }
    get magatamaPointAwarded() {
        return this.props.magatamaPointAwarded;
    }
    get delFlag() {
        return this.props.delFlag;
    }
    get insUserId() {
        return this.props.insUserId;
    }
    get insDateTime() {
        return this.props.insDateTime;
    }
    get updUserId() {
        return this.props.updUserId;
    }
    get updDateTime() {
        return this.props.updDateTime;
    }
    get requestId() {
        return this.props.requestId;
    }
}
exports.DiscordRewardedRoles = DiscordRewardedRoles;


/***/ }),

/***/ "./libs/core/src/domain/user/discord-user-roles.ts":
/*!*********************************************************!*\
  !*** ./libs/core/src/domain/user/discord-user-roles.ts ***!
  \*********************************************************/
/***/ ((__unused_webpack_module, exports) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.DiscordUserRoles = void 0;
class DiscordUserRoles {
    constructor(props) {
        this.props = props;
    }
    get discordUserRolesId() {
        return this.props.discordUserRolesId;
    }
    get userId() {
        return this.props.userId;
    }
    get roleId() {
        return this.props.roleId;
    }
    get delFlag() {
        return this.props.delFlag;
    }
    get insUserId() {
        return this.props.insUserId;
    }
    get insDateTime() {
        return this.props.insDateTime;
    }
    get updUserId() {
        return this.props.updUserId;
    }
    get updDateTime() {
        return this.props.updDateTime;
    }
    get requestId() {
        return this.props.requestId;
    }
}
exports.DiscordUserRoles = DiscordUserRoles;


/***/ }),

/***/ "./libs/core/src/domain/user/user-achievement.ts":
/*!*******************************************************!*\
  !*** ./libs/core/src/domain/user/user-achievement.ts ***!
  \*******************************************************/
/***/ ((__unused_webpack_module, exports) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.UserAchievement = void 0;
class UserAchievement {
    constructor(props) {
        this.props = props;
    }
    get userAchievementId() {
        return this.props.userAchievementId;
    }
    get userId() {
        return this.props.userId;
    }
    get achievementName() {
        return this.props.achievementName;
    }
    get achievementDesc() {
        return this.props.achievementDesc;
    }
    get iconUrl() {
        return this.props.iconUrl;
    }
    get achievementType() {
        return this.props.achievementType;
    }
    get magatamaPointAwarded() {
        return this.props.magatamaPointAwarded;
    }
    get delFlag() {
        return this.props.delFlag;
    }
    get insUserId() {
        return this.props.insUserId;
    }
    get insDateTime() {
        return this.props.insDateTime;
    }
    get updUserId() {
        return this.props.updUserId;
    }
    get updDateTime() {
        return this.props.updDateTime;
    }
    get requestId() {
        return this.props.requestId;
    }
}
exports.UserAchievement = UserAchievement;


/***/ }),

/***/ "./libs/core/src/domain/user/user-info.ts":
/*!************************************************!*\
  !*** ./libs/core/src/domain/user/user-info.ts ***!
  \************************************************/
/***/ ((__unused_webpack_module, exports) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.UserInfo = void 0;
class UserInfo {
    constructor(props) {
        this.props = props;
    }
    get userId() {
        return this.props.userId;
    }
    get digitalPassportAddress() {
        return this.props.digitalPassportAddress;
    }
    get logNftAddress() {
        return this.props.logNftAddress;
    }
    get passportTokenId() {
        return this.props.passportTokenId;
    }
    get userDigitalPassportType() {
        return this.props.userDigitalPassportType;
    }
    get level() {
        return this.props.level;
    }
    get discountRate() {
        return this.props.discountRate;
    }
    get magatamaPoints() {
        return this.props.magatamaPoints;
    }
    get magatamaBags() {
        return this.props.magatamaBags;
    }
    get totalQuestCompleted() {
        return this.props.totalQuestCompleted;
    }
    get totalTravelDistance() {
        return this.props.totalTravelDistance;
    }
    get isPremium() {
        return this.props.isPremium;
    }
    get prayerBead() {
        return this.props.prayerBead;
    }
    get sword() {
        return this.props.sword;
    }
    get orgeMask() {
        return this.props.orgeMask;
    }
    get delFlag() {
        return this.props.delFlag;
    }
    get insUserId() {
        return this.props.insUserId;
    }
    get insDateTime() {
        return this.props.insDateTime;
    }
    get updUserId() {
        return this.props.updUserId;
    }
    get updDateTime() {
        return this.props.updDateTime;
    }
    get requestId() {
        return this.props.requestId;
    }
}
exports.UserInfo = UserInfo;


/***/ }),

/***/ "./libs/core/src/domain/user/user-invite-log.ts":
/*!******************************************************!*\
  !*** ./libs/core/src/domain/user/user-invite-log.ts ***!
  \******************************************************/
/***/ ((__unused_webpack_module, exports) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.UserInviteLog = void 0;
class UserInviteLog {
    constructor(props) {
        this.props = props;
    }
    get inviteLogId() {
        return this.props.inviteLogId;
    }
    get userId() {
        return this.props.userId;
    }
    get inviteeDiscordId() {
        return this.props.inviteeDiscordId;
    }
    get inviteeUserId() {
        return this.props.inviteeUserId;
    }
    get magatamaPointAwarded() {
        return this.props.magatamaPointAwarded;
    }
    get delFlag() {
        return this.props.delFlag;
    }
    get insUserId() {
        return this.props.insUserId;
    }
    get insDateTime() {
        return this.props.insDateTime;
    }
    get updUserId() {
        return this.props.updUserId;
    }
    get updDateTime() {
        return this.props.updDateTime;
    }
    get requestId() {
        return this.props.requestId;
    }
}
exports.UserInviteLog = UserInviteLog;


/***/ }),

/***/ "./libs/core/src/domain/user/user-item-claim-log.ts":
/*!**********************************************************!*\
  !*** ./libs/core/src/domain/user/user-item-claim-log.ts ***!
  \**********************************************************/
/***/ ((__unused_webpack_module, exports) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.UserItemClaimLog = void 0;
class UserItemClaimLog {
    constructor(props) {
        this.props = props;
    }
    get userItemClaimLogId() {
        return this.props.userItemClaimLogId;
    }
    get userId() {
        return this.props.userId;
    }
    get onchainItemId() {
        return this.props.onchainItemId;
    }
    get offchainItemName() {
        return this.props.offchainItemName;
    }
    get itemAmount() {
        return this.props.itemAmount;
    }
    get itemDetails() {
        return this.props.itemDetails;
    }
    get type() {
        return this.props.type;
    }
    get claimedAt() {
        return this.props.claimedAt;
    }
    get status() {
        return this.props.status;
    }
    get errorMsg() {
        return this.props.errorMsg;
    }
    get delFlag() {
        return this.props.delFlag;
    }
    get insUserId() {
        return this.props.insUserId;
    }
    get insDateTime() {
        return this.props.insDateTime;
    }
    get updUserId() {
        return this.props.updUserId;
    }
    get updDateTime() {
        return this.props.updDateTime;
    }
    get requestId() {
        return this.props.requestId;
    }
}
exports.UserItemClaimLog = UserItemClaimLog;


/***/ }),

/***/ "./libs/core/src/domain/user/user-onchain-item.ts":
/*!********************************************************!*\
  !*** ./libs/core/src/domain/user/user-onchain-item.ts ***!
  \********************************************************/
/***/ ((__unused_webpack_module, exports) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.UserOnchainItem = void 0;
class UserOnchainItem {
    constructor(props) {
        this.props = props;
    }
    get userOnchainItemId() {
        return this.props.userOnchainItemId;
    }
    get userId() {
        return this.props.userId;
    }
    get itemType() {
        return this.props.itemType;
    }
    get itemTxnHash() {
        return this.props.itemTxnHash;
    }
    get blockchainType() {
        return this.props.blockchainType;
    }
    get mintedAt() {
        return this.props.mintedAt;
    }
    get onchainItemId() {
        return this.props.onchainItemId;
    }
    get status() {
        return this.props.status;
    }
    get delFlag() {
        return this.props.delFlag;
    }
    get insUserId() {
        return this.props.insUserId;
    }
    get insDateTime() {
        return this.props.insDateTime;
    }
    get updUserId() {
        return this.props.updUserId;
    }
    get updDateTime() {
        return this.props.updDateTime;
    }
    get requestId() {
        return this.props.requestId;
    }
}
exports.UserOnchainItem = UserOnchainItem;


/***/ }),

/***/ "./libs/core/src/domain/user/user-story-log.ts":
/*!*****************************************************!*\
  !*** ./libs/core/src/domain/user/user-story-log.ts ***!
  \*****************************************************/
/***/ ((__unused_webpack_module, exports) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.UserStoryLog = void 0;
class UserStoryLog {
    constructor(props) {
        this.props = props;
    }
    get userStoryLogId() {
        return this.props.userStoryLogId;
    }
    get userId() {
        return this.props.userId;
    }
    get storyChapterId() {
        return this.props.storyChapterId;
    }
    get status() {
        return this.props.status;
    }
    get unlockedAt() {
        return this.props.unlockedAt;
    }
    get finishedAt() {
        return this.props.finishedAt;
    }
    get delFlag() {
        return this.props.delFlag;
    }
    get insUserId() {
        return this.props.insUserId;
    }
    get insDateTime() {
        return this.props.insDateTime;
    }
    get updUserId() {
        return this.props.updUserId;
    }
    get updDateTime() {
        return this.props.updDateTime;
    }
    get requestId() {
        return this.props.requestId;
    }
}
exports.UserStoryLog = UserStoryLog;


/***/ }),

/***/ "./libs/core/src/domain/user/user-task-log.ts":
/*!****************************************************!*\
  !*** ./libs/core/src/domain/user/user-task-log.ts ***!
  \****************************************************/
/***/ ((__unused_webpack_module, exports) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.UserTaskLog = void 0;
class UserTaskLog {
    constructor(props) {
        this.props = props;
    }
    get userTaskLogId() {
        return this.props.userTaskLogId;
    }
    get userId() {
        return this.props.userId;
    }
    get questId() {
        return this.props.questId;
    }
    get taskId() {
        return this.props.taskId;
    }
    get status() {
        return this.props.status;
    }
    get action() {
        return this.props.action;
    }
    get userResponse() {
        return this.props.userResponse;
    }
    get groupActivityMembers() {
        return this.props.groupActivityMembers;
    }
    get submissionData() {
        return this.props.submissionData;
    }
    get failedReason() {
        return this.props.failedReason;
    }
    get completedAt() {
        return this.props.completedAt;
    }
    get claimedAt() {
        return this.props.claimedAt;
    }
    get totalMagatamaPointAwarded() {
        return this.props.totalMagatamaPointAwarded;
    }
    get delFlag() {
        return this.props.delFlag;
    }
    get insUserId() {
        return this.props.insUserId;
    }
    get insDateTime() {
        return this.props.insDateTime;
    }
    get updUserId() {
        return this.props.updUserId;
    }
    get updDateTime() {
        return this.props.updDateTime;
    }
    get requestId() {
        return this.props.requestId;
    }
}
exports.UserTaskLog = UserTaskLog;


/***/ }),

/***/ "./libs/core/src/domain/user/user-travel-log.ts":
/*!******************************************************!*\
  !*** ./libs/core/src/domain/user/user-travel-log.ts ***!
  \******************************************************/
/***/ ((__unused_webpack_module, exports) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.UserTravelLog = void 0;
class UserTravelLog {
    constructor(props) {
        this.props = props;
    }
    get userTravelLogId() {
        return this.props.userTravelLogId;
    }
    get userId() {
        return this.props.userId;
    }
    get questId() {
        return this.props.questId;
    }
    get taskId() {
        return this.props.taskId;
    }
    get touristSpotId() {
        return this.props.touristSpotId;
    }
    get userLongitude() {
        return this.props.userLongitude;
    }
    get userLatitude() {
        return this.props.userLatitude;
    }
    get travelDistanceFromTarget() {
        return this.props.travelDistanceFromTarget;
    }
    get travelDistance() {
        return this.props.travelDistance;
    }
    get qrCodeValue() {
        return this.props.qrCodeValue;
    }
    get checkInMethod() {
        return this.props.checkInMethod;
    }
    get detectedFraud() {
        return this.props.detectedFraud;
    }
    get fraudReason() {
        return this.props.fraudReason;
    }
    get delFlag() {
        return this.props.delFlag;
    }
    get insUserId() {
        return this.props.insUserId;
    }
    get insDateTime() {
        return this.props.insDateTime;
    }
    get updUserId() {
        return this.props.updUserId;
    }
    get updDateTime() {
        return this.props.updDateTime;
    }
    get requestId() {
        return this.props.requestId;
    }
}
exports.UserTravelLog = UserTravelLog;


/***/ }),

/***/ "./libs/core/src/domain/user/user.entity.ts":
/*!**************************************************!*\
  !*** ./libs/core/src/domain/user/user.entity.ts ***!
  \**************************************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.UserEntity = void 0;
const entity_1 = __webpack_require__(/*! ../entity */ "./libs/core/src/domain/entity.ts");
class UserEntity extends entity_1.Entity {
    constructor(props, id) {
        super(props, id);
    }
    get userId() {
        return this.id;
    }
    get username() {
        return this.props.username;
    }
    get discordId() {
        return this.props.discordId;
    }
    get discordUsername() {
        return this.props.discordUsername;
    }
    get twitterId() {
        return this.props.twitterId;
    }
    get twitterUsername() {
        return this.props.twitterUsername;
    }
    get googleEmail() {
        return this.props.googleEmail;
    }
    get email() {
        return this.props.email;
    }
    get password() {
        return this.props.password;
    }
    get refreshToken() {
        return this.props.refreshToken;
    }
    get encryptedPrivateKey() {
        return this.props.encryptedPrivateKey;
    }
    get passportWalletAddress() {
        return this.props.passportWalletAddress;
    }
    get perksWalletAddress() {
        return this.props.perksWalletAddress;
    }
    get latestIpAddress() {
        return this.props.latestIpAddress;
    }
    get isPremium() {
        return this.props.isPremium;
    }
    get totalQuestCompleted() {
        return this.props.totalQuestCompleted;
    }
    get totalTravelDistance() {
        return this.props.totalTravelDistance;
    }
    get role() {
        return this.props.role;
    }
    get registeredAt() {
        return this.props.registeredAt;
    }
    get discordJoinedAt() {
        return this.props.discordJoinedAt;
    }
    get isBanned() {
        return this.props.isBanned;
    }
    get delFlag() {
        return this.props.delFlag;
    }
    get insUserId() {
        return this.props.insUserId;
    }
    get insDateTime() {
        return this.props.insDateTime;
    }
    get updUserId() {
        return this.props.updUserId;
    }
    get updDateTime() {
        return this.props.updDateTime;
    }
    get requestId() {
        return this.props.requestId;
    }
    get userInfo() {
        return this.props.userInfo;
    }
    get userAchievements() {
        return this.props.userAchievements;
    }
    get userOnchainItems() {
        return this.props.userOnchainItems;
    }
    get userItemClaimLogs() {
        return this.props.userItemClaimLogs;
    }
    get userStoryLogs() {
        return this.props.userStoryLogs;
    }
    get userTaskLogs() {
        return this.props.userTaskLogs;
    }
    get userTravelLogs() {
        return this.props.userTravelLogs;
    }
    get discordActivityLogs() {
        return this.props.discordActivityLogs;
    }
    get discordUserRoles() {
        return this.props.discordUserRoles;
    }
    get discordRewardedRoles() {
        return this.props.discordRewardedRoles;
    }
    get userInviteLogs() {
        return this.props.userInviteLogs;
    }
}
exports.UserEntity = UserEntity;


/***/ }),

/***/ "./libs/core/src/domain/user/user.repository.ts":
/*!******************************************************!*\
  !*** ./libs/core/src/domain/user/user.repository.ts ***!
  \******************************************************/
/***/ ((__unused_webpack_module, exports) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));


/***/ }),

/***/ "./libs/core/src/domain/vara/sails/sails-calls-repository.ts":
/*!*******************************************************************!*\
  !*** ./libs/core/src/domain/vara/sails/sails-calls-repository.ts ***!
  \*******************************************************************/
/***/ ((__unused_webpack_module, exports) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));


/***/ }),

/***/ "./libs/core/src/domain/vara/vara-contract-constant.ts":
/*!*************************************************************!*\
  !*** ./libs/core/src/domain/vara/vara-contract-constant.ts ***!
  \*************************************************************/
/***/ ((__unused_webpack_module, exports) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.IDL = exports.CONTRACT_ID = exports.SPONSOR_MNEMONIC = exports.SPONSOR_NAME = exports.NETWORK = exports.VOUCHER_EXPIRATION_BLOCKS = exports.INITIAL_VOUCHER_TOKENS = exports.INITIAL_BLOCKS_FOR_VOUCHER = void 0;
exports.INITIAL_BLOCKS_FOR_VOUCHER = 1200;
exports.INITIAL_VOUCHER_TOKENS = 2;
exports.VOUCHER_EXPIRATION_BLOCKS = 1200;
exports.NETWORK = 'wss://testnet.vara.network';
exports.SPONSOR_NAME = 'admindavid';
exports.SPONSOR_MNEMONIC = 'strong orchard plastic arena pyramid lobster lonely rich stomach label clog rubber';
exports.CONTRACT_ID = '0x17cf40e9dfde5ede9fd4c7314a25a63cb989751f8e3e3dd0d29c01baf31c6da6';
exports.IDL = `
    type KeyringData = struct {
      address: str,
      encoded: str,
    };

    type KeyringEvent = enum {
      KeyringAccountSet,
      Error: KeyringError,
    };

    type KeyringError = enum {
      KeyringAddressAlreadyEsists,
      UserAddressAlreadyExists,
      UserCodedNameAlreadyExists,
      UserDoesNotHasKeyringAccount,
      KeyringAccountAlreadyExists,
      SessionHasInvalidCredentials,
      UserAndKeyringAddressAreTheSame,
    };

    type KeyringQueryEvent = enum {
      LastWhoCall: actor_id,
      SignlessAccountAddress: opt actor_id,
      SignlessAccountData: opt KeyringData,
    };

    type TrafficLightEvent = enum {
      Green,
      Yellow,
      Red,
      KeyringError: KeyringError,
    };

    type IoTrafficLightState = struct {
      current_light: str,
      all_users: vec struct { actor_id, str },
    };

    constructor {
      New : ();
    };

    service Keyring {
      BindKeyringDataToUserAddress : (user_address: actor_id, keyring_data: KeyringData) -> KeyringEvent;
      BindKeyringDataToUserCodedName : (user_coded_name: str, keyring_data: KeyringData) -> KeyringEvent;
      query KeyringAccountData : (keyring_address: actor_id) -> KeyringQueryEvent;
      query KeyringAddressFromUserAddress : (user_address: actor_id) -> KeyringQueryEvent;
      query KeyringAddressFromUserCodedName : (user_coded_name: str) -> KeyringQueryEvent;
    };

    service TrafficLight {
      Green : (user_coded_name: str) -> TrafficLightEvent;
      Red : (user_coded_name: str) -> TrafficLightEvent;
      Yellow : (user_coded_name: str) -> TrafficLightEvent;
      query TrafficLight : () -> IoTrafficLightState;
    };
`;


/***/ }),

/***/ "./libs/core/src/index.ts":
/*!********************************!*\
  !*** ./libs/core/src/index.ts ***!
  \********************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __exportStar = (this && this.__exportStar) || function(m, exports) {
    for (var p in m) if (p !== "default" && !Object.prototype.hasOwnProperty.call(exports, p)) __createBinding(exports, m, p);
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
__exportStar(__webpack_require__(/*! ./core.service */ "./libs/core/src/core.service.ts"), exports);
__exportStar(__webpack_require__(/*! ./provider/caching.service */ "./libs/core/src/provider/caching.service.ts"), exports);
__exportStar(__webpack_require__(/*! ./provider/prisma.service */ "./libs/core/src/provider/prisma.service.ts"), exports);
__exportStar(__webpack_require__(/*! ./provider/tourii-backend-http-service */ "./libs/core/src/provider/tourii-backend-http-service.ts"), exports);
__exportStar(__webpack_require__(/*! ./provider/tourii-backend-logging-service */ "./libs/core/src/provider/tourii-backend-logging-service.ts"), exports);
__exportStar(__webpack_require__(/*! ./provider/tourii-core-logging-service */ "./libs/core/src/provider/tourii-core-logging-service.ts"), exports);
__exportStar(__webpack_require__(/*! ./utils/date-utils */ "./libs/core/src/utils/date-utils.ts"), exports);
__exportStar(__webpack_require__(/*! ./utils/env-utils */ "./libs/core/src/utils/env-utils.ts"), exports);
__exportStar(__webpack_require__(/*! ./domain/auth/encryption.repository */ "./libs/core/src/domain/auth/encryption.repository.ts"), exports);
__exportStar(__webpack_require__(/*! ./domain/game/model-route/model-route.entity */ "./libs/core/src/domain/game/model-route/model-route.entity.ts"), exports);
__exportStar(__webpack_require__(/*! ./domain/game/model-route/model-route.repository */ "./libs/core/src/domain/game/model-route/model-route.repository.ts"), exports);
__exportStar(__webpack_require__(/*! ./domain/game/model-route/tourist-spot */ "./libs/core/src/domain/game/model-route/tourist-spot.ts"), exports);
__exportStar(__webpack_require__(/*! ./domain/game/quest/quest.entity */ "./libs/core/src/domain/game/quest/quest.entity.ts"), exports);
__exportStar(__webpack_require__(/*! ./domain/game/quest/quest.repository */ "./libs/core/src/domain/game/quest/quest.repository.ts"), exports);
__exportStar(__webpack_require__(/*! ./domain/game/quest/task */ "./libs/core/src/domain/game/quest/task.ts"), exports);
__exportStar(__webpack_require__(/*! ./domain/game/story/chapter-story */ "./libs/core/src/domain/game/story/chapter-story.ts"), exports);
__exportStar(__webpack_require__(/*! ./domain/game/story/story.entity */ "./libs/core/src/domain/game/story/story.entity.ts"), exports);
__exportStar(__webpack_require__(/*! ./domain/game/story/story.repository */ "./libs/core/src/domain/game/story/story.repository.ts"), exports);
__exportStar(__webpack_require__(/*! ./domain/game/story/user-story-log.repository */ "./libs/core/src/domain/game/story/user-story-log.repository.ts"), exports);
__exportStar(__webpack_require__(/*! ./domain/geo/geo-info */ "./libs/core/src/domain/geo/geo-info.ts"), exports);
__exportStar(__webpack_require__(/*! ./domain/geo/geo-info.repository */ "./libs/core/src/domain/geo/geo-info.repository.ts"), exports);
__exportStar(__webpack_require__(/*! ./domain/geo/weather-info */ "./libs/core/src/domain/geo/weather-info.ts"), exports);
__exportStar(__webpack_require__(/*! ./domain/geo/weather-info.repository */ "./libs/core/src/domain/geo/weather-info.repository.ts"), exports);
__exportStar(__webpack_require__(/*! ./domain/passport/digital-passport.repository */ "./libs/core/src/domain/passport/digital-passport.repository.ts"), exports);
__exportStar(__webpack_require__(/*! ./domain/user/user.entity */ "./libs/core/src/domain/user/user.entity.ts"), exports);
__exportStar(__webpack_require__(/*! ./domain/user/user.repository */ "./libs/core/src/domain/user/user.repository.ts"), exports);
__exportStar(__webpack_require__(/*! ./domain/feed/moment.entity */ "./libs/core/src/domain/feed/moment.entity.ts"), exports);
__exportStar(__webpack_require__(/*! ./domain/feed/moment-type */ "./libs/core/src/domain/feed/moment-type.ts"), exports);
__exportStar(__webpack_require__(/*! ./domain/feed/moment.repository */ "./libs/core/src/domain/feed/moment.repository.ts"), exports);
__exportStar(__webpack_require__(/*! ./infrastructure/api/geo-info-repository-api */ "./libs/core/src/infrastructure/api/geo-info-repository-api.ts"), exports);
__exportStar(__webpack_require__(/*! ./infrastructure/api/weather-info.repository-api */ "./libs/core/src/infrastructure/api/weather-info.repository-api.ts"), exports);
__exportStar(__webpack_require__(/*! ./infrastructure/authentication/encryption-repository-auth */ "./libs/core/src/infrastructure/authentication/encryption-repository-auth.ts"), exports);
__exportStar(__webpack_require__(/*! ./infrastructure/blockchain/digital-passport.repository.fake */ "./libs/core/src/infrastructure/blockchain/digital-passport.repository.fake.ts"), exports);
__exportStar(__webpack_require__(/*! ./infrastructure/datasource/model-route-repository-db */ "./libs/core/src/infrastructure/datasource/model-route-repository-db.ts"), exports);
__exportStar(__webpack_require__(/*! ./infrastructure/datasource/quest-repository-db */ "./libs/core/src/infrastructure/datasource/quest-repository-db.ts"), exports);
__exportStar(__webpack_require__(/*! ./infrastructure/datasource/story-repository-db */ "./libs/core/src/infrastructure/datasource/story-repository-db.ts"), exports);
__exportStar(__webpack_require__(/*! ./infrastructure/datasource/user-repository-db */ "./libs/core/src/infrastructure/datasource/user-repository-db.ts"), exports);
__exportStar(__webpack_require__(/*! ./infrastructure/datasource/user-story-log.repository-db */ "./libs/core/src/infrastructure/datasource/user-story-log.repository-db.ts"), exports);
__exportStar(__webpack_require__(/*! ./infrastructure/datasource/moment.repository-db */ "./libs/core/src/infrastructure/datasource/moment.repository-db.ts"), exports);
__exportStar(__webpack_require__(/*! ./support/context/context-storage */ "./libs/core/src/support/context/context-storage.ts"), exports);
__exportStar(__webpack_require__(/*! ./support/context/context.provider */ "./libs/core/src/support/context/context.provider.ts"), exports);
__exportStar(__webpack_require__(/*! ./support/context/request-id */ "./libs/core/src/support/context/request-id.ts"), exports);
__exportStar(__webpack_require__(/*! ./support/exception/error-type */ "./libs/core/src/support/exception/error-type.ts"), exports);
__exportStar(__webpack_require__(/*! ./support/exception/tourii-backend-app-error-type */ "./libs/core/src/support/exception/tourii-backend-app-error-type.ts"), exports);
__exportStar(__webpack_require__(/*! ./support/exception/tourii-backend-app-exception */ "./libs/core/src/support/exception/tourii-backend-app-exception.ts"), exports);
__exportStar(__webpack_require__(/*! ./support/transformer/date-transformer */ "./libs/core/src/support/transformer/date-transformer.ts"), exports);
__exportStar(__webpack_require__(/*! ./domain/storage/r2-storage.repository */ "./libs/core/src/domain/storage/r2-storage.repository.ts"), exports);
__exportStar(__webpack_require__(/*! ./domain/game/quest/user-task-log.repository */ "./libs/core/src/domain/game/quest/user-task-log.repository.ts"), exports);
__exportStar(__webpack_require__(/*! ./infrastructure/storage/r2-storage.repository-s3 */ "./libs/core/src/infrastructure/storage/r2-storage.repository-s3.ts"), exports);
__exportStar(__webpack_require__(/*! ./infrastructure/datasource/user-task-log.repository-db */ "./libs/core/src/infrastructure/datasource/user-task-log.repository-db.ts"), exports);


/***/ }),

/***/ "./libs/core/src/infrastructure/api/geo-info-repository-api.ts":
/*!*********************************************************************!*\
  !*** ./libs/core/src/infrastructure/api/geo-info-repository-api.ts ***!
  \*********************************************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var _a, _b, _c;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.GeoInfoRepositoryApi = void 0;
const caching_service_1 = __webpack_require__(/*! @app/core/provider/caching.service */ "./libs/core/src/provider/caching.service.ts");
const tourii_backend_http_service_1 = __webpack_require__(/*! @app/core/provider/tourii-backend-http-service */ "./libs/core/src/provider/tourii-backend-http-service.ts");
const tourii_backend_app_error_type_1 = __webpack_require__(/*! @app/core/support/exception/tourii-backend-app-error-type */ "./libs/core/src/support/exception/tourii-backend-app-error-type.ts");
const tourii_backend_app_exception_1 = __webpack_require__(/*! @app/core/support/exception/tourii-backend-app-exception */ "./libs/core/src/support/exception/tourii-backend-app-exception.ts");
const common_1 = __webpack_require__(/*! @nestjs/common */ "@nestjs/common");
const config_1 = __webpack_require__(/*! @nestjs/config */ "@nestjs/config");
const rxjs_1 = __webpack_require__(/*! rxjs */ "rxjs");
const GEO_INFO_CACHE_PREFIX = 'geo_info';
const CACHE_TTL_SECONDS = 3600 * 24;
let GeoInfoRepositoryApi = class GeoInfoRepositoryApi {
    constructor(touriiHttpService, configService, cachingService) {
        this.touriiHttpService = touriiHttpService;
        this.configService = configService;
        this.cachingService = cachingService;
    }
    async fetchSingleGeoInfo(name, address) {
        const cacheKey = `${GEO_INFO_CACHE_PREFIX}:${encodeURIComponent(name)}:${address ? encodeURIComponent(address) : ''}`;
        const fetchDataFn = async () => {
            var _a, _b, _c, _d;
            const apiKey = this.configService.get('GOOGLE_MAPS_API_KEY');
            if (!apiKey) {
                common_1.Logger.error('GOOGLE_MAPS_API_KEY is not configured.');
                throw new tourii_backend_app_exception_1.TouriiBackendAppException(tourii_backend_app_error_type_1.TouriiBackendAppErrorType.E_GEO_005);
            }
            const searchQuery = address ? `${name} ${address}` : name;
            const encodedQuery = encodeURIComponent(searchQuery);
            const apiUrl = `https://maps.googleapis.com/maps/api/geocode/json?address=${encodedQuery}&key=${apiKey}`;
            try {
                const response = await (0, rxjs_1.firstValueFrom)(this.touriiHttpService.getTouriiBackendHttpService.get(apiUrl));
                if (response.status === 200 && ((_b = (_a = response.data) === null || _a === void 0 ? void 0 : _a.results) === null || _b === void 0 ? void 0 : _b.length) > 0) {
                    const firstResult = response.data.results[0];
                    const location = (_c = firstResult.geometry) === null || _c === void 0 ? void 0 : _c.location;
                    const formattedAddress = firstResult.formatted_address;
                    if ((location === null || location === void 0 ? void 0 : location.lat) && (location === null || location === void 0 ? void 0 : location.lng) && formattedAddress) {
                        common_1.Logger.debug(`Found coordinates for "${name}"${address ? ` with address "${address}"` : ''}: ${location.lat}, ${location.lng}`);
                        return {
                            touristSpotName: name,
                            latitude: location.lat,
                            longitude: location.lng,
                            formattedAddress: formattedAddress,
                        };
                    }
                }
                const googleApiStatus = (_d = response.data) === null || _d === void 0 ? void 0 : _d.status;
                if (googleApiStatus === 'ZERO_RESULTS') {
                    common_1.Logger.warn(`Google Geocoding API returned ZERO_RESULTS for: "${searchQuery}"`);
                    throw new tourii_backend_app_exception_1.TouriiBackendAppException(tourii_backend_app_error_type_1.TouriiBackendAppErrorType.E_GEO_001);
                }
                if (googleApiStatus === 'REQUEST_DENIED') {
                    common_1.Logger.error(`Google Geocoding API request denied for "${searchQuery}"`);
                    throw new tourii_backend_app_exception_1.TouriiBackendAppException(tourii_backend_app_error_type_1.TouriiBackendAppErrorType.E_GEO_002);
                }
                if (googleApiStatus === 'OVER_QUERY_LIMIT') {
                    common_1.Logger.error(`Google Geocoding API OVER_QUERY_LIMIT for "${searchQuery}"`);
                    throw new tourii_backend_app_exception_1.TouriiBackendAppException(tourii_backend_app_error_type_1.TouriiBackendAppErrorType.E_GEO_003);
                }
                common_1.Logger.warn(`Unexpected response from Google Geocoding API for "${searchQuery}"`);
                throw new tourii_backend_app_exception_1.TouriiBackendAppException(tourii_backend_app_error_type_1.TouriiBackendAppErrorType.E_GEO_004);
            }
            catch (error) {
                common_1.Logger.error(`Failed to fetch geocoding info for "${searchQuery}": ${error}`);
                if (error instanceof tourii_backend_app_exception_1.TouriiBackendAppException) {
                    throw error;
                }
                throw new tourii_backend_app_exception_1.TouriiBackendAppException(tourii_backend_app_error_type_1.TouriiBackendAppErrorType.E_GEO_004);
            }
        };
        try {
            const cachedData = await this.cachingService.getOrSet(cacheKey, fetchDataFn, CACHE_TTL_SECONDS);
            if (!cachedData) {
                common_1.Logger.error(`Geo data for "${name}" resolved to null from cache/fetch function`);
                throw new tourii_backend_app_exception_1.TouriiBackendAppException(tourii_backend_app_error_type_1.TouriiBackendAppErrorType.E_GEO_004);
            }
            return cachedData;
        }
        catch (error) {
            common_1.Logger.error(`Failed to fetch geo info for "${name}": ${error}`);
            if (error instanceof tourii_backend_app_exception_1.TouriiBackendAppException) {
                throw error;
            }
            throw new tourii_backend_app_exception_1.TouriiBackendAppException(tourii_backend_app_error_type_1.TouriiBackendAppErrorType.E_GEO_004);
        }
    }
    async getGeoLocationInfoByTouristSpotNameList(touristSpotNameList, addressList) {
        try {
            const geoInfoPromises = touristSpotNameList.map(async (name, index) => {
                const address = addressList === null || addressList === void 0 ? void 0 : addressList[index];
                return await this.fetchSingleGeoInfo(name, address);
            });
            return await Promise.all(geoInfoPromises);
        }
        catch (error) {
            common_1.Logger.error(`One or more geo fetches failed for tourist spot list: ${error}`);
            if (error instanceof tourii_backend_app_exception_1.TouriiBackendAppException) {
                throw error;
            }
            throw new tourii_backend_app_exception_1.TouriiBackendAppException(tourii_backend_app_error_type_1.TouriiBackendAppErrorType.E_GEO_004);
        }
    }
    async getRegionInfoByRegionName(regionName, address) {
        return await this.fetchSingleGeoInfo(regionName, address);
    }
};
exports.GeoInfoRepositoryApi = GeoInfoRepositoryApi;
exports.GeoInfoRepositoryApi = GeoInfoRepositoryApi = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [typeof (_a = typeof tourii_backend_http_service_1.TouriiBackendHttpService !== "undefined" && tourii_backend_http_service_1.TouriiBackendHttpService) === "function" ? _a : Object, typeof (_b = typeof config_1.ConfigService !== "undefined" && config_1.ConfigService) === "function" ? _b : Object, typeof (_c = typeof caching_service_1.CachingService !== "undefined" && caching_service_1.CachingService) === "function" ? _c : Object])
], GeoInfoRepositoryApi);


/***/ }),

/***/ "./libs/core/src/infrastructure/api/sails-calls-repository-api.ts":
/*!************************************************************************!*\
  !*** ./libs/core/src/infrastructure/api/sails-calls-repository-api.ts ***!
  \************************************************************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.SailsCallsRepositoryApi = void 0;
const vara_contract_constant_1 = __webpack_require__(/*! @app/core/domain/vara/vara-contract-constant */ "./libs/core/src/domain/vara/vara-contract-constant.ts");
const sailscalls_1 = __webpack_require__(/*! sailscalls */ "sailscalls");
class SailsCallsRepositoryApi {
    async initSailsCalls() {
        return await sailscalls_1.SailsCalls.new({
            network: vara_contract_constant_1.NETWORK,
            voucherSignerData: {
                sponsorMnemonic: vara_contract_constant_1.SPONSOR_MNEMONIC,
                sponsorName: vara_contract_constant_1.SPONSOR_NAME,
            },
            newContractsData: [
                {
                    contractName: 'traffic_light',
                    address: vara_contract_constant_1.CONTRACT_ID,
                    idl: vara_contract_constant_1.IDL,
                },
            ],
        });
    }
    async sailsCallsQuery(sailsCalls, sailsQueryOptions) {
        return await sailsCalls.query({
            serviceName: sailsQueryOptions.serviceName,
            methodName: sailsQueryOptions.methodName,
            callArguments: sailsQueryOptions.callArguments,
        });
    }
    async sailsCallsCommand(sailsCalls, sailsCommandOptionsRequestDto) {
        return await sailsCalls.command({
            signerData: sailsCommandOptionsRequestDto.signerData,
            voucherId: sailsCommandOptionsRequestDto.voucherId,
            serviceName: sailsCommandOptionsRequestDto.serviceName,
            methodName: sailsCommandOptionsRequestDto.methodName,
            callArguments: sailsCommandOptionsRequestDto.callArguments,
        });
    }
}
exports.SailsCallsRepositoryApi = SailsCallsRepositoryApi;


/***/ }),

/***/ "./libs/core/src/infrastructure/api/weather-info.repository-api.ts":
/*!*************************************************************************!*\
  !*** ./libs/core/src/infrastructure/api/weather-info.repository-api.ts ***!
  \*************************************************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var WeatherInfoRepositoryApi_1;
var _a, _b, _c;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.WeatherInfoRepositoryApi = void 0;
const caching_service_1 = __webpack_require__(/*! @app/core/provider/caching.service */ "./libs/core/src/provider/caching.service.ts");
const tourii_backend_http_service_1 = __webpack_require__(/*! @app/core/provider/tourii-backend-http-service */ "./libs/core/src/provider/tourii-backend-http-service.ts");
const tourii_backend_app_error_type_1 = __webpack_require__(/*! @app/core/support/exception/tourii-backend-app-error-type */ "./libs/core/src/support/exception/tourii-backend-app-error-type.ts");
const tourii_backend_app_exception_1 = __webpack_require__(/*! @app/core/support/exception/tourii-backend-app-exception */ "./libs/core/src/support/exception/tourii-backend-app-exception.ts");
const common_1 = __webpack_require__(/*! @nestjs/common */ "@nestjs/common");
const config_1 = __webpack_require__(/*! @nestjs/config */ "@nestjs/config");
const rxjs_1 = __webpack_require__(/*! rxjs */ "rxjs");
const WEATHER_DATA_RAW_CACHE_KEY_PREFIX = 'weather_data_raw';
const DEFAULT_CACHE_TTL_SECONDS = 900;
const MAX_RETRIES = 3;
const RETRY_DELAY_MS = 1000;
const MAX_CONCURRENT_REQUESTS = 5;
let WeatherInfoRepositoryApi = WeatherInfoRepositoryApi_1 = class WeatherInfoRepositoryApi {
    constructor(touriiHttpService, configService, cachingService) {
        this.touriiHttpService = touriiHttpService;
        this.configService = configService;
        this.cachingService = cachingService;
        this.logger = new common_1.Logger(WeatherInfoRepositoryApi_1.name);
        this.semaphore = new Map();
    }
    async delay(ms) {
        return new Promise((resolve) => setTimeout(resolve, ms));
    }
    async fetchSingleWeatherInfoWithCache(geoInfo, apiKey) {
        const { latitude, longitude, touristSpotName } = geoInfo;
        const cacheKey = `${WEATHER_DATA_RAW_CACHE_KEY_PREFIX}:${latitude.toFixed(6)}_${longitude.toFixed(6)}`;
        if (this.semaphore.has(cacheKey)) {
            this.logger.debug(`Reusing ongoing request for ${touristSpotName} (${cacheKey})`);
            return this.semaphore.get(cacheKey);
        }
        const fetchDataFn = async () => {
            var _a, _b, _c, _d, _e, _f, _g, _h;
            const apiUrl = `https://api.openweathermap.org/data/2.5/forecast?lat=${latitude}&lon=${longitude}&appid=${apiKey}&units=metric`;
            let lastError = null;
            for (let attempt = 1; attempt <= MAX_RETRIES; attempt++) {
                try {
                    this.logger.debug(`Weather API attempt ${attempt}/${MAX_RETRIES} for ${touristSpotName}`);
                    if (attempt > 1) {
                        await this.delay(RETRY_DELAY_MS * attempt);
                    }
                    const response = await (0, rxjs_1.firstValueFrom)(this.touriiHttpService.getTouriiBackendHttpService.get(apiUrl, {
                        timeout: this.configService.get('WEATHER_API_TIMEOUT', 10000),
                    }));
                    if (((_a = response.data) === null || _a === void 0 ? void 0 : _a.cod) && String(response.data.cod) !== '200') {
                        const apiCode = String(response.data.cod);
                        const apiMessage = response.data.message || 'Unknown OpenWeatherMap API error';
                        this.logger.warn(`OpenWeatherMap API error for ${touristSpotName} (${latitude}, ${longitude}): Code ${apiCode}, Message: ${apiMessage}`);
                        if (apiCode === '401') {
                            throw new tourii_backend_app_exception_1.TouriiBackendAppException(tourii_backend_app_error_type_1.TouriiBackendAppErrorType.E_WEATHER_002);
                        }
                        if (apiCode === '404') {
                            throw new tourii_backend_app_exception_1.TouriiBackendAppException(tourii_backend_app_error_type_1.TouriiBackendAppErrorType.E_WEATHER_001);
                        }
                        if (apiCode === '429') {
                            if (attempt < MAX_RETRIES) {
                                this.logger.warn(`Rate limit hit for ${touristSpotName}, retrying in ${RETRY_DELAY_MS * attempt}ms`);
                                continue;
                            }
                            throw new tourii_backend_app_exception_1.TouriiBackendAppException(tourii_backend_app_error_type_1.TouriiBackendAppErrorType.E_WEATHER_003);
                        }
                        throw new tourii_backend_app_exception_1.TouriiBackendAppException(tourii_backend_app_error_type_1.TouriiBackendAppErrorType.E_WEATHER_004);
                    }
                    if (response.status === 200 && ((_c = (_b = response.data) === null || _b === void 0 ? void 0 : _b.list) === null || _c === void 0 ? void 0 : _c.length) > 0) {
                        const firstForecast = response.data.list[0];
                        const weather = (_d = firstForecast.weather) === null || _d === void 0 ? void 0 : _d[0];
                        const main = firstForecast.main;
                        if (weather && main) {
                            const weatherInfo = {
                                touristSpotName: touristSpotName,
                                temperatureCelsius: main.temp,
                                weatherName: weather.main,
                                weatherDesc: weather.description,
                            };
                            this.logger.debug(`Successfully fetched weather for ${touristSpotName}: ${weather.main}, ${main.temp}°C`);
                            return weatherInfo;
                        }
                        this.logger.warn(`Missing weather or main data in OpenWeather response for ${touristSpotName} (${latitude}, ${longitude}): ${JSON.stringify(firstForecast)}`);
                        if (attempt < MAX_RETRIES)
                            continue;
                        throw new tourii_backend_app_exception_1.TouriiBackendAppException(tourii_backend_app_error_type_1.TouriiBackendAppErrorType.E_WEATHER_004);
                    }
                    this.logger.warn(`Unexpected OpenWeather API response structure for ${touristSpotName} (${latitude}, ${longitude}): Status ${response.status}, Data: ${JSON.stringify(response.data)}`);
                    if (attempt < MAX_RETRIES)
                        continue;
                    throw new tourii_backend_app_exception_1.TouriiBackendAppException(tourii_backend_app_error_type_1.TouriiBackendAppErrorType.E_WEATHER_004);
                }
                catch (error) {
                    lastError = error instanceof Error ? error : new Error(String(error));
                    if (error instanceof tourii_backend_app_exception_1.TouriiBackendAppException) {
                        const errorResponse = error.getResponse();
                        if (errorResponse.code === 'E_WEATHER_001' ||
                            errorResponse.code === 'E_WEATHER_002') {
                            throw error;
                        }
                        if (attempt < MAX_RETRIES) {
                            this.logger.warn(`Weather API error for ${touristSpotName}, attempt ${attempt}/${MAX_RETRIES}: ${errorResponse.message}`);
                            continue;
                        }
                        throw error;
                    }
                    const axiosError = error;
                    if (((_e = axiosError.response) === null || _e === void 0 ? void 0 : _e.status) === 401 ||
                        ((_f = axiosError.response) === null || _f === void 0 ? void 0 : _f.status) === 403) {
                        throw new tourii_backend_app_exception_1.TouriiBackendAppException(tourii_backend_app_error_type_1.TouriiBackendAppErrorType.E_WEATHER_002);
                    }
                    if (((_g = axiosError.response) === null || _g === void 0 ? void 0 : _g.status) === 404) {
                        throw new tourii_backend_app_exception_1.TouriiBackendAppException(tourii_backend_app_error_type_1.TouriiBackendAppErrorType.E_WEATHER_001);
                    }
                    if (((_h = axiosError.response) === null || _h === void 0 ? void 0 : _h.status) === 429) {
                        if (attempt < MAX_RETRIES) {
                            this.logger.warn(`Rate limit (HTTP 429) for ${touristSpotName}, retrying in ${RETRY_DELAY_MS * attempt}ms`);
                            continue;
                        }
                        throw new tourii_backend_app_exception_1.TouriiBackendAppException(tourii_backend_app_error_type_1.TouriiBackendAppErrorType.E_WEATHER_003);
                    }
                    if (attempt < MAX_RETRIES) {
                        this.logger.warn(`Network error for ${touristSpotName}, attempt ${attempt}/${MAX_RETRIES}: ${lastError.message}`);
                    }
                    else {
                        break;
                    }
                }
            }
            this.logger.error(`Failed fetching weather for ${touristSpotName} (${latitude}, ${longitude}) after ${MAX_RETRIES} attempts: ${lastError === null || lastError === void 0 ? void 0 : lastError.message}`, lastError === null || lastError === void 0 ? void 0 : lastError.stack);
            throw new tourii_backend_app_exception_1.TouriiBackendAppException(tourii_backend_app_error_type_1.TouriiBackendAppErrorType.E_WEATHER_004);
        };
        const requestPromise = (async () => {
            try {
                const cacheTtl = this.configService.get('WEATHER_CACHE_TTL_SECONDS', DEFAULT_CACHE_TTL_SECONDS);
                const cachedData = await this.cachingService.getOrSet(cacheKey, fetchDataFn, cacheTtl);
                if (cachedData === null) {
                    this.logger.error(`Weather data for ${touristSpotName} resolved to null from cache/fetch, not expected.`);
                    throw new tourii_backend_app_exception_1.TouriiBackendAppException(tourii_backend_app_error_type_1.TouriiBackendAppErrorType.E_WEATHER_004);
                }
                return cachedData;
            }
            catch (error) {
                this.logger.error(`CachingService or fetchDataFn failed for weather data for ${touristSpotName} (${latitude}, ${longitude}): ${error instanceof Error ? error.message : String(error)}`);
                if (error instanceof tourii_backend_app_exception_1.TouriiBackendAppException) {
                    throw error;
                }
                throw new tourii_backend_app_exception_1.TouriiBackendAppException(tourii_backend_app_error_type_1.TouriiBackendAppErrorType.E_TB_000);
            }
            finally {
                this.semaphore.delete(cacheKey);
            }
        })();
        this.semaphore.set(cacheKey, requestPromise);
        return requestPromise;
    }
    async getCurrentWeatherByGeoInfoList(geoInfoList) {
        const apiKey = this.configService.get('OPEN_WEATHER_API_KEY');
        if (!apiKey) {
            this.logger.error('OPEN_WEATHER_API_KEY is not configured.');
            throw new tourii_backend_app_exception_1.TouriiBackendAppException(tourii_backend_app_error_type_1.TouriiBackendAppErrorType.E_WEATHER_005);
        }
        this.logger.debug(`Fetching weather for ${geoInfoList.length} locations`);
        const results = [];
        const batchSize = MAX_CONCURRENT_REQUESTS;
        for (let i = 0; i < geoInfoList.length; i += batchSize) {
            const batch = geoInfoList.slice(i, i + batchSize);
            this.logger.debug(`Processing weather batch ${Math.floor(i / batchSize) + 1}/${Math.ceil(geoInfoList.length / batchSize)} (${batch.length} locations)`);
            try {
                const batchPromises = batch.map((geoInfo) => this.fetchSingleWeatherInfoWithCache(geoInfo, apiKey));
                const batchResults = await Promise.allSettled(batchPromises);
                for (let j = 0; j < batchResults.length; j++) {
                    const result = batchResults[j];
                    const geoInfo = batch[j];
                    if (result.status === 'fulfilled') {
                        results.push(result.value);
                        this.logger.debug(`Weather fetched successfully for ${geoInfo.touristSpotName}`);
                    }
                    else {
                        this.logger.error(`Weather fetch failed for ${geoInfo.touristSpotName}: ${result.reason instanceof Error ? result.reason.message : String(result.reason)}`);
                        if (result.reason instanceof tourii_backend_app_exception_1.TouriiBackendAppException) {
                            throw result.reason;
                        }
                        throw new tourii_backend_app_exception_1.TouriiBackendAppException(tourii_backend_app_error_type_1.TouriiBackendAppErrorType.E_WEATHER_004);
                    }
                }
                if (i + batchSize < geoInfoList.length) {
                    await this.delay(200);
                }
            }
            catch (error) {
                this.logger.error(`Batch weather fetch failed: ${error instanceof Error ? error.message : String(error)}`, error instanceof Error ? error.stack : undefined);
                if (error instanceof tourii_backend_app_exception_1.TouriiBackendAppException) {
                    throw error;
                }
                throw new tourii_backend_app_exception_1.TouriiBackendAppException(tourii_backend_app_error_type_1.TouriiBackendAppErrorType.E_WEATHER_004);
            }
        }
        this.logger.debug(`Successfully fetched weather for ${results.length}/${geoInfoList.length} locations`);
        return results;
    }
};
exports.WeatherInfoRepositoryApi = WeatherInfoRepositoryApi;
exports.WeatherInfoRepositoryApi = WeatherInfoRepositoryApi = WeatherInfoRepositoryApi_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [typeof (_a = typeof tourii_backend_http_service_1.TouriiBackendHttpService !== "undefined" && tourii_backend_http_service_1.TouriiBackendHttpService) === "function" ? _a : Object, typeof (_b = typeof config_1.ConfigService !== "undefined" && config_1.ConfigService) === "function" ? _b : Object, typeof (_c = typeof caching_service_1.CachingService !== "undefined" && caching_service_1.CachingService) === "function" ? _c : Object])
], WeatherInfoRepositoryApi);


/***/ }),

/***/ "./libs/core/src/infrastructure/authentication/encryption-repository-auth.ts":
/*!***********************************************************************************!*\
  !*** ./libs/core/src/infrastructure/authentication/encryption-repository-auth.ts ***!
  \***********************************************************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var _a;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.EncryptionRepositoryAuth = void 0;
const crypto = __importStar(__webpack_require__(/*! node:crypto */ "node:crypto"));
const common_1 = __webpack_require__(/*! @nestjs/common */ "@nestjs/common");
const config_1 = __webpack_require__(/*! @nestjs/config */ "@nestjs/config");
const api_1 = __webpack_require__(/*! @polkadot/api */ "@polkadot/api");
const util_1 = __webpack_require__(/*! @polkadot/util */ "@polkadot/util");
let EncryptionRepositoryAuth = class EncryptionRepositoryAuth {
    constructor(configService) {
        this.configService = configService;
        const key = this.configService.get('ENCRYPTION_KEY') || 'defaultSecretKey';
        this.secretKey = crypto.createHash('sha256').update(key).digest();
    }
    encryptString(text) {
        const algorithm = 'aes-256-ctr';
        const iv = crypto.randomBytes(16);
        const cipher = crypto.createCipheriv(algorithm, this.secretKey, iv);
        const encrypted = Buffer.concat([cipher.update(text, 'utf8'), cipher.final()]);
        return `${iv.toString('hex')}:${encrypted.toString('hex')}`;
    }
    decryptString(text) {
        const algorithm = 'aes-256-ctr';
        const [ivHex, contentHex] = text.split(':');
        const iv = Buffer.from(ivHex, 'hex');
        const encryptedText = Buffer.from(contentHex, 'hex');
        const decipher = crypto.createDecipheriv(algorithm, this.secretKey, iv);
        const decrypted = Buffer.concat([decipher.update(encryptedText), decipher.final()]);
        return decrypted.toString('utf8');
    }
    decodeAddress(publicKey) {
        return (0, util_1.u8aToHex)(new api_1.Keyring().decodeAddress(publicKey));
    }
};
exports.EncryptionRepositoryAuth = EncryptionRepositoryAuth;
exports.EncryptionRepositoryAuth = EncryptionRepositoryAuth = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [typeof (_a = typeof config_1.ConfigService !== "undefined" && config_1.ConfigService) === "function" ? _a : Object])
], EncryptionRepositoryAuth);


/***/ }),

/***/ "./libs/core/src/infrastructure/authentication/jwt-repository-auth.ts":
/*!****************************************************************************!*\
  !*** ./libs/core/src/infrastructure/authentication/jwt-repository-auth.ts ***!
  \****************************************************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var _a;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.JwtRepositoryAuth = void 0;
const common_1 = __webpack_require__(/*! @nestjs/common */ "@nestjs/common");
const config_1 = __webpack_require__(/*! @nestjs/config */ "@nestjs/config");
const jwt = __importStar(__webpack_require__(/*! jsonwebtoken */ "jsonwebtoken"));
const tourii_backend_app_error_type_1 = __webpack_require__(/*! ../../support/exception/tourii-backend-app-error-type */ "./libs/core/src/support/exception/tourii-backend-app-error-type.ts");
const tourii_backend_app_exception_1 = __webpack_require__(/*! ../../support/exception/tourii-backend-app-exception */ "./libs/core/src/support/exception/tourii-backend-app-exception.ts");
let JwtRepositoryAuth = class JwtRepositoryAuth {
    constructor(configService) {
        this.configService = configService;
        this.secretKey = this.configService.get('JWT_SECRET') || 'defaultSecretKey';
    }
    generateJwtToken(payload, options) {
        return jwt.sign(payload, this.secretKey, options);
    }
    dataFromToken(token) {
        try {
            return jwt.verify(token, this.secretKey);
        }
        catch (_error) {
            throw new tourii_backend_app_exception_1.TouriiBackendAppException(tourii_backend_app_error_type_1.TouriiBackendAppErrorType.E_TB_002);
        }
    }
};
exports.JwtRepositoryAuth = JwtRepositoryAuth;
exports.JwtRepositoryAuth = JwtRepositoryAuth = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [typeof (_a = typeof config_1.ConfigService !== "undefined" && config_1.ConfigService) === "function" ? _a : Object])
], JwtRepositoryAuth);


/***/ }),

/***/ "./libs/core/src/infrastructure/blockchain/digital-passport.repository.fake.ts":
/*!*************************************************************************************!*\
  !*** ./libs/core/src/infrastructure/blockchain/digital-passport.repository.fake.ts ***!
  \*************************************************************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var DigitalPassportRepositoryFake_1;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.DigitalPassportRepositoryFake = void 0;
const node_crypto_1 = __webpack_require__(/*! node:crypto */ "node:crypto");
const common_1 = __webpack_require__(/*! @nestjs/common */ "@nestjs/common");
let DigitalPassportRepositoryFake = DigitalPassportRepositoryFake_1 = class DigitalPassportRepositoryFake {
    constructor() {
        this.logger = new common_1.Logger(DigitalPassportRepositoryFake_1.name);
    }
    async mint(to) {
        const tokenId = (0, node_crypto_1.randomUUID)();
        const txHash = (0, node_crypto_1.randomUUID)();
        this.logger.log(`Minted digital passport to ${to} token ${tokenId}`);
        return { tokenId, txHash };
    }
};
exports.DigitalPassportRepositoryFake = DigitalPassportRepositoryFake;
exports.DigitalPassportRepositoryFake = DigitalPassportRepositoryFake = DigitalPassportRepositoryFake_1 = __decorate([
    (0, common_1.Injectable)()
], DigitalPassportRepositoryFake);


/***/ }),

/***/ "./libs/core/src/infrastructure/datasource/model-route-repository-db.ts":
/*!******************************************************************************!*\
  !*** ./libs/core/src/infrastructure/datasource/model-route-repository-db.ts ***!
  \******************************************************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var ModelRouteRepositoryDb_1;
var _a, _b;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.ModelRouteRepositoryDb = void 0;
const caching_service_1 = __webpack_require__(/*! @app/core/provider/caching.service */ "./libs/core/src/provider/caching.service.ts");
const prisma_service_1 = __webpack_require__(/*! @app/core/provider/prisma.service */ "./libs/core/src/provider/prisma.service.ts");
const tourii_backend_app_error_type_1 = __webpack_require__(/*! @app/core/support/exception/tourii-backend-app-error-type */ "./libs/core/src/support/exception/tourii-backend-app-error-type.ts");
const tourii_backend_app_exception_1 = __webpack_require__(/*! @app/core/support/exception/tourii-backend-app-exception */ "./libs/core/src/support/exception/tourii-backend-app-exception.ts");
const common_1 = __webpack_require__(/*! @nestjs/common */ "@nestjs/common");
const model_route_mapper_1 = __webpack_require__(/*! ../mapper/model-route-mapper */ "./libs/core/src/infrastructure/mapper/model-route-mapper.ts");
const _MODEL_ROUTE_RAW_CACHE_KEY_PREFIX = 'model_route_raw';
const _MODEL_ROUTES_ALL_LIST_CACHE_KEY = 'model_routes_all_list';
const DEFAULT_CACHE_TTL_SECONDS = 3600;
let ModelRouteRepositoryDb = ModelRouteRepositoryDb_1 = class ModelRouteRepositoryDb {
    constructor(prisma, cachingService) {
        this.prisma = prisma;
        this.cachingService = cachingService;
        this.logger = new common_1.Logger(ModelRouteRepositoryDb_1.name);
    }
    async createModelRoute(modelRoute) {
        const createdModelRouteData = await this.prisma.model_route.create({
            data: model_route_mapper_1.ModelRouteMapper.modelRouteEntityToPrismaInput(modelRoute),
            include: {
                tourist_spot: true,
            },
        });
        const createdModelRouteEntity = model_route_mapper_1.ModelRouteMapper.prismaModelToModelRouteEntity(createdModelRouteData);
        this.logger.debug(`Clearing cache for new model route: ${createdModelRouteEntity.modelRouteId}`);
        await this.cachingService.clearAll();
        return createdModelRouteEntity;
    }
    async createTouristSpot(touristSpot, modelRouteId) {
        const createdTouristSpotData = await this.prisma.tourist_spot.create({
            data: model_route_mapper_1.ModelRouteMapper.touristSpotOnlyEntityToPrismaInput(touristSpot, modelRouteId),
        });
        const createdTouristSpotEntity = model_route_mapper_1.ModelRouteMapper.touristSpotToEntity([
            createdTouristSpotData,
        ])[0];
        this.logger.debug(`Clearing cache for model route ${modelRouteId} due to new tourist spot.`);
        await this.cachingService.clearAll();
        return createdTouristSpotEntity;
    }
    async updateModelRoute(modelRoute) {
        if (!modelRoute.modelRouteId) {
            throw new tourii_backend_app_exception_1.TouriiBackendAppException(tourii_backend_app_error_type_1.TouriiBackendAppErrorType.E_TB_027);
        }
        const updated = await this.prisma.model_route.update({
            where: { model_route_id: modelRoute.modelRouteId },
            data: model_route_mapper_1.ModelRouteMapper.modelRouteEntityToPrismaUpdateInput(modelRoute),
            include: { tourist_spot: true },
        });
        await this.cachingService.clearAll();
        return model_route_mapper_1.ModelRouteMapper.prismaModelToModelRouteEntity(updated);
    }
    async updateTouristSpot(touristSpot) {
        if (!touristSpot.touristSpotId) {
            throw new tourii_backend_app_exception_1.TouriiBackendAppException(tourii_backend_app_error_type_1.TouriiBackendAppErrorType.E_TB_027);
        }
        const updated = await this.prisma.tourist_spot.update({
            where: { tourist_spot_id: touristSpot.touristSpotId },
            data: model_route_mapper_1.ModelRouteMapper.touristSpotEntityToPrismaUpdateInput(touristSpot),
        });
        await this.cachingService.clearAll();
        return model_route_mapper_1.ModelRouteMapper.touristSpotToEntity([updated])[0];
    }
    async getTouristSpotsByStoryChapterId(storyChapterId) {
        const cacheKey = `tourist_spots_by_chapter:${storyChapterId}`;
        const fetchDataFn = async () => {
            const spots = await this.prisma.tourist_spot.findMany({
                where: { story_chapter_id: storyChapterId },
            });
            return spots;
        };
        const spotPrisma = await this.cachingService.getOrSet(cacheKey, fetchDataFn, DEFAULT_CACHE_TTL_SECONDS);
        if (!spotPrisma || spotPrisma.length === 0) {
            return [];
        }
        return model_route_mapper_1.ModelRouteMapper.touristSpotToEntity(spotPrisma);
    }
    async getModelRouteByModelRouteId(modelRouteId) {
        const cacheKey = `${_MODEL_ROUTE_RAW_CACHE_KEY_PREFIX}:${modelRouteId}`;
        const fetchDataFn = async () => {
            this.logger.debug(`getModelRouteByModelRouteId: Cache miss for ${cacheKey}, fetching raw data from DB.`);
            const modelRoutePrisma = await this.prisma.model_route.findUnique({
                where: { model_route_id: modelRouteId },
                include: {
                    tourist_spot: {
                        orderBy: {
                            ins_date_time: 'asc',
                        },
                    },
                },
            });
            if (!modelRoutePrisma) {
                this.logger.debug(`getModelRouteByModelRouteId: Raw route ${modelRouteId} not found in DB.`);
                return null;
            }
            this.logger.debug(`getModelRouteByModelRouteId: Raw route ${modelRouteId} found in DB.`);
            return modelRoutePrisma;
        };
        const rawModelRoute = await this.cachingService.getOrSet(cacheKey, fetchDataFn, DEFAULT_CACHE_TTL_SECONDS);
        if (!rawModelRoute) {
            this.logger.warn(`getModelRouteByModelRouteId: Raw route ${modelRouteId} not found in cache or DB fetch.`);
            throw new tourii_backend_app_exception_1.TouriiBackendAppException(tourii_backend_app_error_type_1.TouriiBackendAppErrorType.E_TB_027);
        }
        this.logger.debug(`getModelRouteByModelRouteId: Mapping raw route ${modelRouteId} to entity.`);
        return model_route_mapper_1.ModelRouteMapper.prismaModelToModelRouteEntity(rawModelRoute);
    }
    async getModelRoutes() {
        const cacheKey = _MODEL_ROUTES_ALL_LIST_CACHE_KEY;
        const fetchDataFn = async () => {
            this.logger.debug(`getModelRoutes: Cache miss for ${cacheKey}, fetching all raw routes from DB.`);
            const modelRoutesPrisma = await this.prisma.model_route.findMany({
                include: {
                    tourist_spot: {
                        orderBy: {
                            ins_date_time: 'asc',
                        },
                    },
                },
                orderBy: {
                    ins_date_time: 'asc',
                },
            });
            this.logger.debug(`getModelRoutes: Found ${modelRoutesPrisma.length} raw routes in DB.`);
            return modelRoutesPrisma;
        };
        const rawModelRoutes = await this.cachingService.getOrSet(cacheKey, fetchDataFn, DEFAULT_CACHE_TTL_SECONDS);
        if (rawModelRoutes === null) {
            this.logger.warn(`getModelRoutes: Fetching all raw model routes returned null from cache/DB fetch for key ${cacheKey}. Returning empty array.`);
            return [];
        }
        this.logger.debug(`getModelRoutes: Mapping ${rawModelRoutes.length} raw routes to entities.`);
        return rawModelRoutes.map((rawRoute) => model_route_mapper_1.ModelRouteMapper.prismaModelToModelRouteEntity(rawRoute));
    }
    async deleteModelRoute(modelRouteId) {
        await this.prisma.$transaction([
            this.prisma.tourist_spot.deleteMany({ where: { model_route_id: modelRouteId } }),
            this.prisma.model_route.delete({ where: { model_route_id: modelRouteId } }),
        ]);
        await this.cachingService.clearAll();
        return true;
    }
    async deleteTouristSpot(touristSpotId) {
        await this.prisma.tourist_spot.delete({
            where: { tourist_spot_id: touristSpotId },
        });
        await this.cachingService.clearAll();
        return true;
    }
};
exports.ModelRouteRepositoryDb = ModelRouteRepositoryDb;
exports.ModelRouteRepositoryDb = ModelRouteRepositoryDb = ModelRouteRepositoryDb_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [typeof (_a = typeof prisma_service_1.PrismaService !== "undefined" && prisma_service_1.PrismaService) === "function" ? _a : Object, typeof (_b = typeof caching_service_1.CachingService !== "undefined" && caching_service_1.CachingService) === "function" ? _b : Object])
], ModelRouteRepositoryDb);


/***/ }),

/***/ "./libs/core/src/infrastructure/datasource/moment.repository-db.ts":
/*!*************************************************************************!*\
  !*** ./libs/core/src/infrastructure/datasource/moment.repository-db.ts ***!
  \*************************************************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var _a, _b;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.MomentRepositoryDb = void 0;
const caching_service_1 = __webpack_require__(/*! @app/core/provider/caching.service */ "./libs/core/src/provider/caching.service.ts");
const prisma_service_1 = __webpack_require__(/*! @app/core/provider/prisma.service */ "./libs/core/src/provider/prisma.service.ts");
const common_1 = __webpack_require__(/*! @nestjs/common */ "@nestjs/common");
const moment_mapper_1 = __webpack_require__(/*! ../mapper/moment.mapper */ "./libs/core/src/infrastructure/mapper/moment.mapper.ts");
const MOMENTS_CACHE_KEY_PREFIX = 'moments';
const CACHE_TTL_SECONDS = 300;
let MomentRepositoryDb = class MomentRepositoryDb {
    constructor(prisma, cachingService) {
        this.prisma = prisma;
        this.cachingService = cachingService;
    }
    async getLatest(limit, offset, momentType) {
        const cacheKey = `${MOMENTS_CACHE_KEY_PREFIX}:${limit}:${offset}:${momentType || 'all'}`;
        const fetchDataFn = async () => {
            const whereClause = momentType ? { moment_type: momentType } : {};
            const [data, totalItems] = await Promise.all([
                this.prisma.moment_view.findMany({
                    take: limit,
                    skip: offset,
                    orderBy: { ins_date_time: 'desc' },
                    where: whereClause,
                }),
                this.prisma.moment_view.count({
                    where: whereClause,
                }),
            ]);
            const plainData = data.map((moment) => ({
                id: moment.id,
                user_id: moment.user_id,
                username: moment.username,
                image_url: moment.image_url,
                description: moment.description,
                reward_text: moment.reward_text,
                ins_date_time: moment.ins_date_time,
                moment_type: moment.moment_type,
            }));
            return { data: plainData, totalItems };
        };
        const cachedResult = await this.cachingService.getOrSet(cacheKey, fetchDataFn, CACHE_TTL_SECONDS);
        if (!cachedResult) {
            return [];
        }
        return cachedResult.data.map((moment) => moment_mapper_1.MomentMapper.prismaModelToMomentEntity(moment, cachedResult.totalItems));
    }
};
exports.MomentRepositoryDb = MomentRepositoryDb;
exports.MomentRepositoryDb = MomentRepositoryDb = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [typeof (_a = typeof prisma_service_1.PrismaService !== "undefined" && prisma_service_1.PrismaService) === "function" ? _a : Object, typeof (_b = typeof caching_service_1.CachingService !== "undefined" && caching_service_1.CachingService) === "function" ? _b : Object])
], MomentRepositoryDb);


/***/ }),

/***/ "./libs/core/src/infrastructure/datasource/quest-repository-db.ts":
/*!************************************************************************!*\
  !*** ./libs/core/src/infrastructure/datasource/quest-repository-db.ts ***!
  \************************************************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var QuestRepositoryDb_1;
var _a, _b;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.QuestRepositoryDb = void 0;
const quest_entity_1 = __webpack_require__(/*! @app/core/domain/game/quest/quest.entity */ "./libs/core/src/domain/game/quest/quest.entity.ts");
const caching_service_1 = __webpack_require__(/*! @app/core/provider/caching.service */ "./libs/core/src/provider/caching.service.ts");
const prisma_service_1 = __webpack_require__(/*! @app/core/provider/prisma.service */ "./libs/core/src/provider/prisma.service.ts");
const tourii_backend_app_error_type_1 = __webpack_require__(/*! @app/core/support/exception/tourii-backend-app-error-type */ "./libs/core/src/support/exception/tourii-backend-app-error-type.ts");
const tourii_backend_app_exception_1 = __webpack_require__(/*! @app/core/support/exception/tourii-backend-app-exception */ "./libs/core/src/support/exception/tourii-backend-app-exception.ts");
const common_1 = __webpack_require__(/*! @nestjs/common */ "@nestjs/common");
const client_1 = __webpack_require__(/*! @prisma/client */ "@prisma/client");
const quest_mapper_1 = __webpack_require__(/*! ../mapper/quest.mapper */ "./libs/core/src/infrastructure/mapper/quest.mapper.ts");
const CACHE_TTL_SECONDS = 3600;
let QuestRepositoryDb = QuestRepositoryDb_1 = class QuestRepositoryDb {
    constructor(prisma, cachingService) {
        this.prisma = prisma;
        this.cachingService = cachingService;
        this.logger = new common_1.Logger(QuestRepositoryDb_1.name);
    }
    async fetchQuestsWithPagination(page, limit, isPremium, isUnlocked, questType, userId) {
        var _a;
        const questCacheKey = `quests:${page}:${limit}:${isPremium !== null && isPremium !== void 0 ? isPremium : 'null'}:${isUnlocked !== null && isUnlocked !== void 0 ? isUnlocked : 'null'}:${questType !== null && questType !== void 0 ? questType : 'null'}`;
        const fetchQuestsDatafn = async () => {
            const queryFilter = {
                where: Object.assign(Object.assign(Object.assign({}, (isUnlocked !== undefined && { is_unlocked: isUnlocked })), (isPremium !== undefined && { is_premium: isPremium })), (questType !== undefined && { quest_type: questType })),
                skip: (page - 1) * limit,
                take: limit,
                orderBy: {
                    ins_date_time: 'desc',
                },
                include: {
                    quest_task: true,
                    tourist_spot: true,
                },
            };
            const [questDb, total] = await Promise.all([
                this.prisma.quest.findMany(queryFilter),
                this.prisma.quest.count({ where: queryFilter.where }),
            ]);
            return { quests: questDb, total };
        };
        const cachedData = await this.cachingService.getOrSet(questCacheKey, fetchQuestsDatafn, CACHE_TTL_SECONDS);
        if (!cachedData) {
            this.logger.warn(`No quests found for key: ${questCacheKey}`);
            return quest_entity_1.QuestEntityWithPagination.default();
        }
        const userCompletedTasksCacheKey = `user-completed-tasks:${userId}`;
        const fetchUserCompletedTasksDatafn = async (userId) => {
            return this.prisma.user_task_log.findMany({
                select: { quest_id: true, task_id: true },
                where: { user_id: userId, status: client_1.TaskStatus.COMPLETED },
            });
        };
        const userCompletedTasks = userId
            ? ((_a = (await this.cachingService.getOrSet(userCompletedTasksCacheKey, () => fetchUserCompletedTasksDatafn(userId), CACHE_TTL_SECONDS))) !== null && _a !== void 0 ? _a : [])
            : [];
        const completedTaskMap = new Map();
        userCompletedTasks.forEach((log) => {
            var _a;
            if (!completedTaskMap.has(log.quest_id)) {
                completedTaskMap.set(log.quest_id, new Set());
            }
            (_a = completedTaskMap.get(log.quest_id)) === null || _a === void 0 ? void 0 : _a.add(log.task_id);
        });
        const questsEntities = cachedData.quests.map((quest) => {
            return quest_mapper_1.QuestMapper.prismaModelToQuestEntityWithUserCompletedTasks(quest, userCompletedTasks.map((log) => log.task_id));
        });
        const result = new quest_entity_1.QuestEntityWithPagination(questsEntities, cachedData.total, page, limit);
        return result;
    }
    async fetchQuestById(questId, userId) {
        var _a;
        const questCacheKey = `quest:${questId}`;
        const fetchQuestDataFn = async () => {
            return await this.prisma.quest.findUnique({
                where: { quest_id: questId },
                include: {
                    quest_task: true,
                    tourist_spot: true,
                },
            });
        };
        const questDb = await this.cachingService.getOrSet(questCacheKey, fetchQuestDataFn, CACHE_TTL_SECONDS);
        if (!questDb) {
            throw new tourii_backend_app_exception_1.TouriiBackendAppException(tourii_backend_app_error_type_1.TouriiBackendAppErrorType.E_TB_023);
        }
        const userCompletedTasksCacheKey = `user-completed-tasks:${userId}:${questId}`;
        const fetchUserCompletedTasksDataFn = async (userId) => {
            return this.prisma.user_task_log
                .findMany({
                where: {
                    user_id: userId,
                    quest_id: questId,
                    status: client_1.TaskStatus.COMPLETED,
                },
                select: { task_id: true },
            })
                .then((logs) => logs.map((log) => log.task_id));
        };
        const completedTasksForQuest = userId
            ? ((_a = (await this.cachingService.getOrSet(userCompletedTasksCacheKey, () => fetchUserCompletedTasksDataFn(userId), CACHE_TTL_SECONDS))) !== null && _a !== void 0 ? _a : [])
            : [];
        return quest_mapper_1.QuestMapper.prismaModelToQuestEntityWithUserCompletedTasks(questDb, completedTasksForQuest);
    }
    async fetchQuestsByTouristSpotId(touristSpotId, userId) {
        var _a;
        const questsByCacheKey = `quests-by-tourist-spot:${touristSpotId}`;
        const fetchQuestsByTouristSpotDataFn = async () => {
            return this.prisma.quest.findMany({
                where: { tourist_spot_id: touristSpotId },
                include: { quest_task: true, tourist_spot: true },
                orderBy: { ins_date_time: 'desc' },
            });
        };
        const questsDb = await this.cachingService.getOrSet(questsByCacheKey, fetchQuestsByTouristSpotDataFn, CACHE_TTL_SECONDS);
        if (!questsDb || questsDb.length === 0)
            return [];
        const userCompletedTasksBySpotCacheKey = `user-completed-tasks-by-spot:${userId}:${touristSpotId}`;
        const fetchUserCompletedTasksBySpotDataFn = async (userId) => {
            const logs = await this.prisma.user_task_log.findMany({
                select: { quest_id: true, task_id: true },
                where: {
                    user_id: userId,
                    quest_id: { in: questsDb.map((q) => q.quest_id) },
                    status: client_1.TaskStatus.COMPLETED,
                },
            });
            return logs.map((log) => ({
                quest_id: log.quest_id,
                task_id: log.task_id,
            }));
        };
        const completedTasks = userId
            ? ((_a = (await this.cachingService.getOrSet(userCompletedTasksBySpotCacheKey, () => fetchUserCompletedTasksBySpotDataFn(userId), CACHE_TTL_SECONDS))) !== null && _a !== void 0 ? _a : [])
            : [];
        const completedTasksByQuest = completedTasks.reduce((acc, { quest_id, task_id }) => {
            if (!acc[quest_id]) {
                acc[quest_id] = [];
            }
            acc[quest_id].push(task_id);
            return acc;
        }, {});
        return questsDb.map((quest) => {
            var _a;
            return quest_mapper_1.QuestMapper.prismaModelToQuestEntityWithUserCompletedTasks(quest, (_a = completedTasksByQuest[quest.quest_id]) !== null && _a !== void 0 ? _a : []);
        });
    }
    async createQuest(quest) {
        const created = await this.prisma.quest.create({
            data: quest_mapper_1.QuestMapper.questEntityToPrismaInput(quest),
            include: { quest_task: true, tourist_spot: true },
        });
        await this.cachingService.clearAll();
        return quest_mapper_1.QuestMapper.prismaModelToQuestEntity(created);
    }
    async createQuestTask(task, questId) {
        const created = await this.prisma.quest_task.create({
            data: Object.assign(Object.assign({}, quest_mapper_1.QuestMapper.taskToPrismaInput(task)), { quest: {
                    connect: {
                        quest_id: questId,
                    },
                } }),
        });
        await this.cachingService.clearAll();
        return quest_mapper_1.QuestMapper.prismaTaskModelToTask(created);
    }
    async updateQuest(quest) {
        const updated = await this.prisma.quest.update({
            where: { quest_id: quest.questId },
            data: quest_mapper_1.QuestMapper.questEntityToPrismaUpdateInput(quest),
            include: { quest_task: true, tourist_spot: true },
        });
        await this.cachingService.clearAll();
        return quest_mapper_1.QuestMapper.prismaModelToQuestEntity(updated);
    }
    async updateQuestTask(task) {
        const updated = await this.prisma.quest_task.update({
            where: { quest_task_id: task.taskId },
            data: quest_mapper_1.QuestMapper.taskEntityToPrismaUpdateInput(task),
        });
        await this.cachingService.clearAll();
        return quest_mapper_1.QuestMapper.prismaTaskModelToTask(updated);
    }
    async deleteQuest(questId) {
        await this.prisma.$transaction([
            this.prisma.quest_task.deleteMany({ where: { quest_id: questId } }),
            this.prisma.quest.delete({ where: { quest_id: questId } }),
        ]);
        await this.cachingService.clearAll();
        return true;
    }
    async deleteQuestTask(taskId) {
        await this.prisma.quest_task.delete({ where: { quest_task_id: taskId } });
        await this.cachingService.clearAll();
        return true;
    }
    async isQuestCompleted(questId, userId) {
        const [tasks, completedLogs] = await Promise.all([
            this.prisma.quest_task.findMany({
                where: { quest_id: questId },
                select: { quest_task_id: true },
            }),
            this.prisma.user_task_log.findMany({
                where: { quest_id: questId, user_id: userId, status: client_1.TaskStatus.COMPLETED },
                select: { task_id: true },
            }),
        ]);
        const completedSet = new Set(completedLogs.map((l) => l.task_id));
        return tasks.every((t) => completedSet.has(t.quest_task_id));
    }
    async getMostPopularQuest() {
        const topQuests = await this.prisma.user_task_log.groupBy({
            by: ['quest_id'],
            where: {
                status: client_1.TaskStatus.COMPLETED,
            },
            _count: {
                quest_id: true,
            },
            orderBy: {
                _count: {
                    quest_id: 'desc',
                },
            },
            take: 1,
        });
        if (topQuests.length === 0) {
            return null;
        }
        const mostPopularQuestId = topQuests[0].quest_id;
        const questDb = await this.prisma.quest.findUnique({
            where: { quest_id: mostPopularQuestId },
            include: { quest_task: true, tourist_spot: true },
        });
        const cachedQuest = await this.cachingService.getOrSet(`quest:${mostPopularQuestId}`, () => Promise.resolve(questDb), CACHE_TTL_SECONDS);
        if (!cachedQuest) {
            throw new tourii_backend_app_exception_1.TouriiBackendAppException(tourii_backend_app_error_type_1.TouriiBackendAppErrorType.E_TB_023);
        }
        return quest_mapper_1.QuestMapper.prismaModelToQuestEntity(cachedQuest);
    }
};
exports.QuestRepositoryDb = QuestRepositoryDb;
exports.QuestRepositoryDb = QuestRepositoryDb = QuestRepositoryDb_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [typeof (_a = typeof prisma_service_1.PrismaService !== "undefined" && prisma_service_1.PrismaService) === "function" ? _a : Object, typeof (_b = typeof caching_service_1.CachingService !== "undefined" && caching_service_1.CachingService) === "function" ? _b : Object])
], QuestRepositoryDb);


/***/ }),

/***/ "./libs/core/src/infrastructure/datasource/story-repository-db.ts":
/*!************************************************************************!*\
  !*** ./libs/core/src/infrastructure/datasource/story-repository-db.ts ***!
  \************************************************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var _a, _b;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.StoryRepositoryDb = void 0;
const caching_service_1 = __webpack_require__(/*! @app/core/provider/caching.service */ "./libs/core/src/provider/caching.service.ts");
const prisma_service_1 = __webpack_require__(/*! @app/core/provider/prisma.service */ "./libs/core/src/provider/prisma.service.ts");
const context_storage_1 = __webpack_require__(/*! @app/core/support/context/context-storage */ "./libs/core/src/support/context/context-storage.ts");
const tourii_backend_app_error_type_1 = __webpack_require__(/*! @app/core/support/exception/tourii-backend-app-error-type */ "./libs/core/src/support/exception/tourii-backend-app-error-type.ts");
const tourii_backend_app_exception_1 = __webpack_require__(/*! @app/core/support/exception/tourii-backend-app-exception */ "./libs/core/src/support/exception/tourii-backend-app-exception.ts");
const common_1 = __webpack_require__(/*! @nestjs/common */ "@nestjs/common");
const story_mapper_1 = __webpack_require__(/*! ../mapper/story.mapper */ "./libs/core/src/infrastructure/mapper/story.mapper.ts");
const ALL_STORIES_CACHE_KEY = 'stories:all';
const STORY_CHAPTER_RAW_CACHE_KEY_PREFIX = 'story_chapter_raw';
const CACHE_TTL_SECONDS = 3600;
let StoryRepositoryDb = class StoryRepositoryDb {
    constructor(prisma, cachingService) {
        this.prisma = prisma;
        this.cachingService = cachingService;
    }
    async createStory(story) {
        const createdStoryDb = await this.prisma.story.create({
            data: story_mapper_1.StoryMapper.storyEntityToPrismaInput(story),
            include: {
                story_chapter: true,
            },
        });
        await this.cachingService.clearAll();
        return story_mapper_1.StoryMapper.prismaModelToStoryEntity(createdStoryDb);
    }
    async createStoryChapter(storyId, chapter) {
        const createdChapterDb = await this.prisma.story_chapter.create({
            data: story_mapper_1.StoryMapper.storyChapterOnlyEntityToPrismaInput(storyId, chapter),
            include: {
                story: {
                    select: {
                        saga_name: true,
                    },
                },
            },
        });
        return story_mapper_1.StoryMapper.storyChapterToEntity([createdChapterDb], createdChapterDb.story.saga_name)[0];
    }
    async updateStory(story) {
        if (!story.storyId) {
            throw new tourii_backend_app_exception_1.TouriiBackendAppException(tourii_backend_app_error_type_1.TouriiBackendAppErrorType.E_TB_023);
        }
        const updated = await this.prisma.story.update({
            where: { story_id: story.storyId },
            data: story_mapper_1.StoryMapper.storyEntityToPrismaUpdateInput(story),
            include: { story_chapter: true },
        });
        await this.cachingService.clearAll();
        return story_mapper_1.StoryMapper.prismaModelToStoryEntity(updated);
    }
    async updateStoryChapter(chapter) {
        if (!chapter.storyChapterId) {
            throw new tourii_backend_app_exception_1.TouriiBackendAppException(tourii_backend_app_error_type_1.TouriiBackendAppErrorType.E_TB_023);
        }
        const updated = await this.prisma.story_chapter.update({
            where: { story_chapter_id: chapter.storyChapterId },
            data: story_mapper_1.StoryMapper.storyChapterEntityToPrismaUpdateInput(chapter),
            include: {
                story: { select: { saga_name: true, story_id: true } },
            },
        });
        const cacheKey = `${STORY_CHAPTER_RAW_CACHE_KEY_PREFIX}:${updated.story.story_id}`;
        await this.cachingService.invalidate(cacheKey);
        return story_mapper_1.StoryMapper.storyChapterToEntity([updated], updated.story.saga_name)[0];
    }
    async getStories() {
        const fetchDataFn = async () => {
            return this.prisma.story.findMany({
                include: {
                    story_chapter: true,
                },
            });
        };
        const storiesDb = await this.cachingService.getOrSet(ALL_STORIES_CACHE_KEY, fetchDataFn, CACHE_TTL_SECONDS);
        if (!storiesDb) {
            return undefined;
        }
        const storiesEntities = storiesDb.map((story) => story_mapper_1.StoryMapper.prismaModelToStoryEntity(story));
        return storiesEntities;
    }
    async getStoryById(storyId) {
        const storyDb = await this.prisma.story.findUnique({
            where: {
                story_id: storyId,
            },
            include: {
                story_chapter: true,
            },
        });
        if (!storyDb) {
            throw new tourii_backend_app_exception_1.TouriiBackendAppException(tourii_backend_app_error_type_1.TouriiBackendAppErrorType.E_TB_023);
        }
        return story_mapper_1.StoryMapper.prismaModelToStoryEntity(storyDb);
    }
    async updateTouristSpotIdListInStoryChapter(pairs) {
        try {
            await this.prisma.$transaction(pairs.map((pair) => {
                var _a;
                return this.prisma.story_chapter.update({
                    where: {
                        story_chapter_id: pair.storyChapterId,
                    },
                    data: {
                        tourist_spot_id: pair.touristSpotId,
                        upd_date_time: (_a = context_storage_1.ContextStorage.getStore()) === null || _a === void 0 ? void 0 : _a.getSystemDateTimeJST(),
                    },
                });
            }));
            return true;
        }
        catch (error) {
            common_1.Logger.error(`Failed to update tourist spots for chapters: ${error instanceof Error ? error.message : String(error)}`, error instanceof Error ? error.stack : undefined);
            return false;
        }
    }
    async getStoryChaptersByStoryId(storyId) {
        const cacheKey = `${STORY_CHAPTER_RAW_CACHE_KEY_PREFIX}:${storyId}`;
        const fetchRawChaptersFn = async () => {
            const chapters = await this.prisma.story_chapter.findMany({
                where: {
                    story_id: storyId,
                },
                orderBy: {
                    chapter_number: 'asc',
                },
            });
            return chapters.length > 0 ? chapters : [];
        };
        const storyChaptersDb = await this.cachingService.getOrSet(cacheKey, fetchRawChaptersFn, CACHE_TTL_SECONDS);
        if (!storyChaptersDb || storyChaptersDb.length === 0) {
            return [];
        }
        const story = await this.prisma.story.findUnique({
            where: {
                story_id: storyId,
            },
            select: {
                saga_name: true,
            },
        });
        if (!story) {
            return [];
        }
        const sagaName = story.saga_name;
        const storyChapterInstances = story_mapper_1.StoryMapper.storyChapterToEntity(storyChaptersDb, sagaName);
        return storyChapterInstances;
    }
    async deleteStory(storyId) {
        await this.prisma.$transaction([
            this.prisma.story_chapter.deleteMany({ where: { story_id: storyId } }),
            this.prisma.story.delete({ where: { story_id: storyId } }),
        ]);
        await this.cachingService.clearAll();
        return true;
    }
    async deleteStoryChapter(chapterId) {
        await this.prisma.story_chapter.delete({
            where: { story_chapter_id: chapterId },
        });
        await this.cachingService.clearAll();
        return true;
    }
    async getLatestStoryChapter() {
        const chapterDb = await this.prisma.story_chapter.findFirst({
            where: { ins_date_time: { not: undefined } },
            orderBy: { ins_date_time: 'desc' },
            include: { story: { select: { saga_name: true, story_id: true } } },
        });
        if (!chapterDb) {
            return null;
        }
        const cachedChapter = await this.cachingService.getOrSet(`story_chapter:${chapterDb.story_chapter_id}`, () => Promise.resolve(chapterDb), CACHE_TTL_SECONDS);
        if (!cachedChapter) {
            return null;
        }
        return {
            chapter: story_mapper_1.StoryMapper.storyChapterToEntity([cachedChapter], chapterDb.story.saga_name)[0],
            storyId: chapterDb.story.story_id,
        };
    }
};
exports.StoryRepositoryDb = StoryRepositoryDb;
exports.StoryRepositoryDb = StoryRepositoryDb = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [typeof (_a = typeof prisma_service_1.PrismaService !== "undefined" && prisma_service_1.PrismaService) === "function" ? _a : Object, typeof (_b = typeof caching_service_1.CachingService !== "undefined" && caching_service_1.CachingService) === "function" ? _b : Object])
], StoryRepositoryDb);


/***/ }),

/***/ "./libs/core/src/infrastructure/datasource/user-repository-db.ts":
/*!***********************************************************************!*\
  !*** ./libs/core/src/infrastructure/datasource/user-repository-db.ts ***!
  \***********************************************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var _a;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.UserRepositoryDb = void 0;
const prisma_service_1 = __webpack_require__(/*! @app/core/provider/prisma.service */ "./libs/core/src/provider/prisma.service.ts");
const common_1 = __webpack_require__(/*! @nestjs/common */ "@nestjs/common");
const user_mapper_1 = __webpack_require__(/*! ../mapper/user.mapper */ "./libs/core/src/infrastructure/mapper/user.mapper.ts");
let UserRepositoryDb = class UserRepositoryDb {
    constructor(prisma) {
        this.prisma = prisma;
        this.userInclude = {
            user_info: true,
            user_achievements: true,
            user_onchain_item: true,
            user_item_claim_log: true,
            user_story_log: true,
            user_task_log: true,
            user_travel_log: true,
            discord_activity_log: true,
            discord_user_roles: true,
            discord_rewarded_roles: true,
            user_invite_log: true,
        };
    }
    async createUser(user) {
        const createdUser = await this.prisma.user.create({
            data: user_mapper_1.UserMapper.userEntityToPrismaInput(user),
            include: this.userInclude,
        });
        return user_mapper_1.UserMapper.prismaModelToUserEntity(createdUser);
    }
    async getUserInfoByUserId(userId) {
        const user = await this.prisma.user.findFirst({
            where: {
                user_id: userId,
            },
            include: this.userInclude,
        });
        return user ? user_mapper_1.UserMapper.prismaModelToUserEntity(user) : undefined;
    }
    async getUserByUsername(username) {
        const user = await this.prisma.user.findFirst({
            where: {
                username,
            },
            include: this.userInclude,
        });
        return user ? user_mapper_1.UserMapper.prismaModelToUserEntity(user) : undefined;
    }
    async getUserByPassportWallet(walletAddress) {
        const user = await this.prisma.user.findFirst({
            where: {
                passport_wallet_address: walletAddress,
            },
            include: this.userInclude,
        });
        return user ? user_mapper_1.UserMapper.prismaModelToUserEntity(user) : undefined;
    }
    async getUserByDiscordId(discordId) {
        const user = await this.prisma.user.findFirst({
            where: {
                discord_id: discordId,
            },
            include: this.userInclude,
        });
        return user ? user_mapper_1.UserMapper.prismaModelToUserEntity(user) : undefined;
    }
    async getUserByGoogleEmail(googleEmail) {
        const user = await this.prisma.user.findFirst({
            where: {
                google_email: googleEmail,
            },
            include: this.userInclude,
        });
        return user ? user_mapper_1.UserMapper.prismaModelToUserEntity(user) : undefined;
    }
    async findByPassportTokenId(tokenId) {
        const user = await this.prisma.user.findFirst({
            where: {
                user_info: {
                    passport_token_id: tokenId,
                },
            },
            include: this.userInclude,
        });
        return user ? user_mapper_1.UserMapper.prismaModelToUserEntity(user) : undefined;
    }
};
exports.UserRepositoryDb = UserRepositoryDb;
exports.UserRepositoryDb = UserRepositoryDb = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [typeof (_a = typeof prisma_service_1.PrismaService !== "undefined" && prisma_service_1.PrismaService) === "function" ? _a : Object])
], UserRepositoryDb);


/***/ }),

/***/ "./libs/core/src/infrastructure/datasource/user-story-log.repository-db.ts":
/*!*********************************************************************************!*\
  !*** ./libs/core/src/infrastructure/datasource/user-story-log.repository-db.ts ***!
  \*********************************************************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var _a;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.UserStoryLogRepositoryDb = void 0;
const prisma_service_1 = __webpack_require__(/*! @app/core/provider/prisma.service */ "./libs/core/src/provider/prisma.service.ts");
const context_storage_1 = __webpack_require__(/*! @app/core/support/context/context-storage */ "./libs/core/src/support/context/context-storage.ts");
const tourii_backend_app_error_type_1 = __webpack_require__(/*! @app/core/support/exception/tourii-backend-app-error-type */ "./libs/core/src/support/exception/tourii-backend-app-error-type.ts");
const tourii_backend_app_exception_1 = __webpack_require__(/*! @app/core/support/exception/tourii-backend-app-exception */ "./libs/core/src/support/exception/tourii-backend-app-exception.ts");
const common_1 = __webpack_require__(/*! @nestjs/common */ "@nestjs/common");
const client_1 = __webpack_require__(/*! @prisma/client */ "@prisma/client");
let UserStoryLogRepositoryDb = class UserStoryLogRepositoryDb {
    constructor(prisma) {
        this.prisma = prisma;
    }
    async trackProgress(userId, chapterId, status) {
        var _a, _b, _c, _d;
        const now = (_b = (_a = context_storage_1.ContextStorage.getStore()) === null || _a === void 0 ? void 0 : _a.getSystemDateTimeJST()) !== null && _b !== void 0 ? _b : new Date();
        const chapter = await this.prisma.story_chapter.findUnique({
            where: { story_chapter_id: chapterId },
            select: { story_id: true, story_chapter_id: true },
        });
        if (!chapter) {
            throw new tourii_backend_app_exception_1.TouriiBackendAppException(tourii_backend_app_error_type_1.TouriiBackendAppErrorType.E_TB_023);
        }
        const existing = await this.prisma.user_story_log.findFirst({
            where: { user_id: userId, story_chapter_id: chapter.story_chapter_id },
        });
        if (existing) {
            await this.prisma.user_story_log.update({
                where: { user_story_log_id: existing.user_story_log_id },
                data: Object.assign(Object.assign(Object.assign({ status }, (status === client_1.StoryStatus.IN_PROGRESS && !existing.unlocked_at
                    ? { unlocked_at: now }
                    : {})), (status === client_1.StoryStatus.COMPLETED ? { finished_at: now } : {})), { upd_date_time: now }),
            });
        }
        else {
            await this.prisma.user_story_log.create({
                data: {
                    user_id: userId,
                    story_chapter_id: chapter.story_chapter_id,
                    status,
                    unlocked_at: now,
                    finished_at: status === client_1.StoryStatus.COMPLETED ? now : null,
                    request_id: (_d = (_c = context_storage_1.ContextStorage.getStore()) === null || _c === void 0 ? void 0 : _c.getRequestId()) === null || _d === void 0 ? void 0 : _d.value,
                    ins_user_id: userId,
                    ins_date_time: now,
                    upd_user_id: userId,
                    upd_date_time: now,
                },
            });
        }
    }
    async completeStoryWithQuestUnlocking(userId, chapterId) {
        var _a, _b;
        const now = (_b = (_a = context_storage_1.ContextStorage.getStore()) === null || _a === void 0 ? void 0 : _a.getSystemDateTimeJST()) !== null && _b !== void 0 ? _b : new Date();
        return await this.prisma.$transaction(async (prisma) => {
            var _a, _b;
            const chapter = await prisma.story_chapter.findUnique({
                where: { story_chapter_id: chapterId },
                select: {
                    story_chapter_id: true,
                    story_id: true,
                    chapter_title: true,
                    tourist_spot_id: true,
                },
            });
            if (!chapter) {
                throw new tourii_backend_app_exception_1.TouriiBackendAppException(tourii_backend_app_error_type_1.TouriiBackendAppErrorType.E_TB_023);
            }
            const existing = await prisma.user_story_log.findFirst({
                where: { user_id: userId, story_chapter_id: chapterId },
            });
            if ((existing === null || existing === void 0 ? void 0 : existing.status) === client_1.StoryStatus.COMPLETED) {
                throw new tourii_backend_app_exception_1.TouriiBackendAppException(tourii_backend_app_error_type_1.TouriiBackendAppErrorType.E_TB_029);
            }
            const achievementsUnlocked = [];
            const userStoryCount = await prisma.user_story_log.count({
                where: {
                    user_id: userId,
                    status: client_1.StoryStatus.COMPLETED,
                },
            });
            if (existing) {
                await prisma.user_story_log.update({
                    where: { user_story_log_id: existing.user_story_log_id },
                    data: {
                        status: client_1.StoryStatus.COMPLETED,
                        finished_at: now,
                        upd_date_time: now,
                        upd_user_id: userId,
                    },
                });
            }
            else {
                await prisma.user_story_log.create({
                    data: {
                        user_id: userId,
                        story_chapter_id: chapterId,
                        status: client_1.StoryStatus.COMPLETED,
                        unlocked_at: now,
                        finished_at: now,
                        request_id: (_b = (_a = context_storage_1.ContextStorage.getStore()) === null || _a === void 0 ? void 0 : _a.getRequestId()) === null || _b === void 0 ? void 0 : _b.value,
                        ins_user_id: userId,
                        ins_date_time: now,
                        upd_user_id: userId,
                        upd_date_time: now,
                    },
                });
            }
            const STORY_COMPLETION_REWARD = 10;
            await prisma.user_info.update({
                where: { user_id: userId },
                data: {
                    magatama_points: {
                        increment: STORY_COMPLETION_REWARD,
                    },
                    upd_date_time: now,
                    upd_user_id: userId,
                },
            });
            const unlockedQuests = [];
            if (chapter.tourist_spot_id) {
                const touristSpot = await prisma.tourist_spot.findUnique({
                    where: { tourist_spot_id: chapter.tourist_spot_id },
                    select: { tourist_spot_name: true },
                });
                const questsToUnlock = await prisma.quest.findMany({
                    where: {
                        tourist_spot_id: chapter.tourist_spot_id,
                        del_flag: false,
                        is_unlocked: false,
                        is_premium: false,
                    },
                    select: {
                        quest_id: true,
                        quest_name: true,
                        quest_desc: true,
                        quest_image: true,
                        total_magatama_point_awarded: true,
                        is_premium: true,
                    },
                });
                if (questsToUnlock.length > 0) {
                    const questIds = questsToUnlock.map((q) => q.quest_id);
                    await prisma.quest.updateMany({
                        where: {
                            quest_id: { in: questIds },
                        },
                        data: {
                            is_unlocked: true,
                            upd_date_time: now,
                            upd_user_id: userId,
                        },
                    });
                    unlockedQuests.push(...questsToUnlock.map((quest) => ({
                        questId: quest.quest_id,
                        questName: quest.quest_name,
                        questDesc: quest.quest_desc,
                        questImage: quest.quest_image,
                        touristSpotName: (touristSpot === null || touristSpot === void 0 ? void 0 : touristSpot.tourist_spot_name) || 'Unknown Location',
                        totalMagatamaPointAwarded: quest.total_magatama_point_awarded,
                        isPremium: quest.is_premium,
                    })));
                }
            }
            let additionalRewards = 0;
            if (userStoryCount === 0) {
                achievementsUnlocked.push('First Story Completed');
                additionalRewards += 25;
            }
            else if (userStoryCount === 4) {
                achievementsUnlocked.push('Story Explorer');
                additionalRewards += 50;
            }
            else if (userStoryCount === 9) {
                achievementsUnlocked.push('Story Master');
                additionalRewards += 100;
            }
            if (additionalRewards > 0) {
                await prisma.user_info.update({
                    where: { user_id: userId },
                    data: {
                        magatama_points: {
                            increment: additionalRewards,
                        },
                        upd_date_time: now,
                        upd_user_id: userId,
                    },
                });
            }
            return {
                chapter: {
                    storyChapterId: chapter.story_chapter_id,
                    chapterTitle: chapter.chapter_title,
                    status: client_1.StoryStatus.COMPLETED,
                    completedAt: now,
                },
                unlockedQuests,
                rewards: {
                    magatamaPointsEarned: STORY_COMPLETION_REWARD + additionalRewards,
                    achievementsUnlocked,
                },
            };
        });
    }
    async startStoryReading(userId, chapterId) {
        var _a, _b, _c, _d;
        const now = (_b = (_a = context_storage_1.ContextStorage.getStore()) === null || _a === void 0 ? void 0 : _a.getSystemDateTimeJST()) !== null && _b !== void 0 ? _b : new Date();
        const chapter = await this.prisma.story_chapter.findUnique({
            where: { story_chapter_id: chapterId },
            select: { story_id: true, story_chapter_id: true },
        });
        if (!chapter) {
            throw new tourii_backend_app_exception_1.TouriiBackendAppException(tourii_backend_app_error_type_1.TouriiBackendAppErrorType.E_TB_023);
        }
        const existing = await this.prisma.user_story_log.findFirst({
            where: { user_id: userId, story_chapter_id: chapterId },
        });
        if (existing) {
            if (existing.status === client_1.StoryStatus.UNREAD) {
                await this.prisma.user_story_log.update({
                    where: { user_story_log_id: existing.user_story_log_id },
                    data: {
                        status: client_1.StoryStatus.IN_PROGRESS,
                        unlocked_at: now,
                        upd_date_time: now,
                        upd_user_id: userId,
                    },
                });
            }
        }
        else {
            await this.prisma.user_story_log.create({
                data: {
                    user_id: userId,
                    story_chapter_id: chapterId,
                    status: client_1.StoryStatus.IN_PROGRESS,
                    unlocked_at: now,
                    finished_at: null,
                    request_id: (_d = (_c = context_storage_1.ContextStorage.getStore()) === null || _c === void 0 ? void 0 : _c.getRequestId()) === null || _d === void 0 ? void 0 : _d.value,
                    ins_user_id: userId,
                    ins_date_time: now,
                    upd_user_id: userId,
                    upd_date_time: now,
                },
            });
        }
    }
    async getStoryProgress(userId, chapterId) {
        const log = await this.prisma.user_story_log.findFirst({
            where: { user_id: userId, story_chapter_id: chapterId },
            select: {
                status: true,
                unlocked_at: true,
                finished_at: true,
            },
        });
        if (!log)
            return null;
        return {
            status: log.status,
            unlockedAt: log.unlocked_at,
            finishedAt: log.finished_at,
        };
    }
};
exports.UserStoryLogRepositoryDb = UserStoryLogRepositoryDb;
exports.UserStoryLogRepositoryDb = UserStoryLogRepositoryDb = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [typeof (_a = typeof prisma_service_1.PrismaService !== "undefined" && prisma_service_1.PrismaService) === "function" ? _a : Object])
], UserStoryLogRepositoryDb);


/***/ }),

/***/ "./libs/core/src/infrastructure/datasource/user-task-log.repository-db.ts":
/*!********************************************************************************!*\
  !*** ./libs/core/src/infrastructure/datasource/user-task-log.repository-db.ts ***!
  \********************************************************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var _a;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.UserTaskLogRepositoryDb = void 0;
const user_mapper_1 = __webpack_require__(/*! @app/core/infrastructure/mapper/user.mapper */ "./libs/core/src/infrastructure/mapper/user.mapper.ts");
const prisma_service_1 = __webpack_require__(/*! @app/core/provider/prisma.service */ "./libs/core/src/provider/prisma.service.ts");
const tourii_backend_app_error_type_1 = __webpack_require__(/*! @app/core/support/exception/tourii-backend-app-error-type */ "./libs/core/src/support/exception/tourii-backend-app-error-type.ts");
const tourii_backend_app_exception_1 = __webpack_require__(/*! @app/core/support/exception/tourii-backend-app-exception */ "./libs/core/src/support/exception/tourii-backend-app-exception.ts");
const common_1 = __webpack_require__(/*! @nestjs/common */ "@nestjs/common");
let UserTaskLogRepositoryDb = class UserTaskLogRepositoryDb {
    constructor(prisma) {
        this.prisma = prisma;
    }
    async completePhotoTask(userId, taskId, proofUrl) {
        const task = await this.prisma.quest_task.findUnique({
            where: { quest_task_id: taskId },
            select: { quest_id: true },
        });
        if (!task) {
            throw new tourii_backend_app_exception_1.TouriiBackendAppException(tourii_backend_app_error_type_1.TouriiBackendAppErrorType.E_TB_028);
        }
        const taskLogData = user_mapper_1.UserMapper.createUserTaskLogForPhotoUpload(userId, task.quest_id, taskId, proofUrl);
        await this.prisma.user_task_log.upsert(Object.assign({ where: {
                user_id_quest_id_task_id: {
                    user_id: userId,
                    quest_id: task.quest_id,
                    task_id: taskId,
                },
            } }, taskLogData));
    }
    async completeSocialTask(userId, taskId, proofUrl) {
        const task = await this.prisma.quest_task.findUnique({
            where: { quest_task_id: taskId },
            select: { quest_id: true },
        });
        if (!task) {
            throw new tourii_backend_app_exception_1.TouriiBackendAppException(tourii_backend_app_error_type_1.TouriiBackendAppErrorType.E_TB_028);
        }
        const taskLogData = user_mapper_1.UserMapper.createUserTaskLogForSocialShare(userId, task.quest_id, taskId, proofUrl);
        await this.prisma.user_task_log.upsert(Object.assign({ where: {
                user_id_quest_id_task_id: {
                    user_id: userId,
                    quest_id: task.quest_id,
                    task_id: taskId,
                },
            } }, taskLogData));
    }
};
exports.UserTaskLogRepositoryDb = UserTaskLogRepositoryDb;
exports.UserTaskLogRepositoryDb = UserTaskLogRepositoryDb = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [typeof (_a = typeof prisma_service_1.PrismaService !== "undefined" && prisma_service_1.PrismaService) === "function" ? _a : Object])
], UserTaskLogRepositoryDb);


/***/ }),

/***/ "./libs/core/src/infrastructure/mapper/model-route-mapper.ts":
/*!*******************************************************************!*\
  !*** ./libs/core/src/infrastructure/mapper/model-route-mapper.ts ***!
  \*******************************************************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.ModelRouteMapper = void 0;
const model_route_entity_1 = __webpack_require__(/*! @app/core/domain/game/model-route/model-route.entity */ "./libs/core/src/domain/game/model-route/model-route.entity.ts");
const tourist_spot_1 = __webpack_require__(/*! @app/core/domain/game/model-route/tourist-spot */ "./libs/core/src/domain/game/model-route/tourist-spot.ts");
class ModelRouteMapper {
    static prismaModelToTouristSpotEntity(prismaModel) {
        var _a, _b, _c, _d, _e, _f;
        return new tourist_spot_1.TouristSpot({
            touristSpotId: prismaModel.tourist_spot_id,
            storyChapterId: prismaModel.story_chapter_id,
            touristSpotName: prismaModel.tourist_spot_name,
            touristSpotDesc: prismaModel.tourist_spot_desc,
            latitude: prismaModel.latitude,
            longitude: prismaModel.longitude,
            bestVisitTime: (_a = prismaModel.best_visit_time) !== null && _a !== void 0 ? _a : undefined,
            address: (_b = prismaModel.address) !== null && _b !== void 0 ? _b : undefined,
            storyChapterLink: (_c = prismaModel.story_chapter_link) !== null && _c !== void 0 ? _c : undefined,
            touristSpotHashtag: prismaModel.tourist_spot_hashtag,
            imageSet: typeof prismaModel.image_set === 'object' &&
                prismaModel.image_set !== null &&
                'main' in prismaModel.image_set &&
                'small' in prismaModel.image_set &&
                typeof prismaModel.image_set.main === 'string' &&
                Array.isArray(prismaModel.image_set.small) &&
                prismaModel.image_set.small.every((item) => typeof item === 'string')
                ? prismaModel.image_set
                : undefined,
            delFlag: (_d = prismaModel.del_flag) !== null && _d !== void 0 ? _d : false,
            insUserId: (_e = prismaModel.ins_user_id) !== null && _e !== void 0 ? _e : '',
            insDateTime: prismaModel.ins_date_time,
            updUserId: prismaModel.upd_user_id,
            updDateTime: prismaModel.upd_date_time,
            requestId: (_f = prismaModel.request_id) !== null && _f !== void 0 ? _f : undefined,
        });
    }
    static touristSpotEntityToPrismaInput(touristSpotEntity) {
        var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m;
        return {
            story_chapter_id: (_a = touristSpotEntity.storyChapterId) !== null && _a !== void 0 ? _a : '',
            tourist_spot_name: (_b = touristSpotEntity.touristSpotName) !== null && _b !== void 0 ? _b : '',
            tourist_spot_desc: (_c = touristSpotEntity.touristSpotDesc) !== null && _c !== void 0 ? _c : '',
            latitude: (_d = touristSpotEntity.latitude) !== null && _d !== void 0 ? _d : 0,
            longitude: (_e = touristSpotEntity.longitude) !== null && _e !== void 0 ? _e : 0,
            best_visit_time: (_f = touristSpotEntity.bestVisitTime) !== null && _f !== void 0 ? _f : null,
            address: (_g = touristSpotEntity.address) !== null && _g !== void 0 ? _g : null,
            story_chapter_link: (_h = touristSpotEntity.storyChapterLink) !== null && _h !== void 0 ? _h : null,
            tourist_spot_hashtag: (_j = touristSpotEntity.touristSpotHashtag) !== null && _j !== void 0 ? _j : [],
            image_set: (_k = touristSpotEntity.imageSet) !== null && _k !== void 0 ? _k : undefined,
            del_flag: (_l = touristSpotEntity.delFlag) !== null && _l !== void 0 ? _l : false,
            ins_user_id: (_m = touristSpotEntity.insUserId) !== null && _m !== void 0 ? _m : '',
            ins_date_time: touristSpotEntity.insDateTime,
            upd_user_id: touristSpotEntity.updUserId,
            upd_date_time: touristSpotEntity.updDateTime,
            request_id: touristSpotEntity.requestId,
        };
    }
    static touristSpotOnlyEntityToPrismaInput(touristSpotEntity, modelRouteId) {
        var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m;
        return {
            model_route_id: modelRouteId,
            story_chapter_id: (_a = touristSpotEntity.storyChapterId) !== null && _a !== void 0 ? _a : '',
            tourist_spot_name: (_b = touristSpotEntity.touristSpotName) !== null && _b !== void 0 ? _b : '',
            tourist_spot_desc: (_c = touristSpotEntity.touristSpotDesc) !== null && _c !== void 0 ? _c : '',
            latitude: (_d = touristSpotEntity.latitude) !== null && _d !== void 0 ? _d : 0,
            longitude: (_e = touristSpotEntity.longitude) !== null && _e !== void 0 ? _e : 0,
            best_visit_time: (_f = touristSpotEntity.bestVisitTime) !== null && _f !== void 0 ? _f : null,
            address: (_g = touristSpotEntity.address) !== null && _g !== void 0 ? _g : null,
            story_chapter_link: (_h = touristSpotEntity.storyChapterLink) !== null && _h !== void 0 ? _h : null,
            tourist_spot_hashtag: (_j = touristSpotEntity.touristSpotHashtag) !== null && _j !== void 0 ? _j : [],
            image_set: (_k = touristSpotEntity.imageSet) !== null && _k !== void 0 ? _k : undefined,
            del_flag: (_l = touristSpotEntity.delFlag) !== null && _l !== void 0 ? _l : false,
            ins_user_id: (_m = touristSpotEntity.insUserId) !== null && _m !== void 0 ? _m : '',
            ins_date_time: touristSpotEntity.insDateTime,
            upd_user_id: touristSpotEntity.updUserId,
            upd_date_time: touristSpotEntity.updDateTime,
            request_id: touristSpotEntity.requestId,
        };
    }
    static touristSpotToEntity(prismaModel) {
        return prismaModel.map((touristSpot) => ModelRouteMapper.prismaModelToTouristSpotEntity(touristSpot));
    }
    static modelRouteEntityToPrismaInput(modelRouteEntity) {
        var _a, _b, _c, _d, _e, _f, _g, _h, _j;
        return {
            story_id: (_a = modelRouteEntity.storyId) !== null && _a !== void 0 ? _a : '',
            route_name: (_b = modelRouteEntity.routeName) !== null && _b !== void 0 ? _b : '',
            region: (_c = modelRouteEntity.region) !== null && _c !== void 0 ? _c : '',
            region_desc: modelRouteEntity.regionDesc,
            region_latitude: (_d = modelRouteEntity.regionLatitude) !== null && _d !== void 0 ? _d : 0,
            region_longitude: (_e = modelRouteEntity.regionLongitude) !== null && _e !== void 0 ? _e : 0,
            region_background_media: modelRouteEntity.regionBackgroundMedia,
            recommendation: (_f = modelRouteEntity.recommendation) !== null && _f !== void 0 ? _f : [],
            del_flag: (_g = modelRouteEntity.delFlag) !== null && _g !== void 0 ? _g : false,
            ins_user_id: (_h = modelRouteEntity.insUserId) !== null && _h !== void 0 ? _h : '',
            ins_date_time: modelRouteEntity.insDateTime,
            upd_user_id: modelRouteEntity.updUserId,
            upd_date_time: modelRouteEntity.updDateTime,
            request_id: modelRouteEntity.requestId,
            tourist_spot: {
                create: (_j = modelRouteEntity.touristSpotList) === null || _j === void 0 ? void 0 : _j.map((touristSpot) => ModelRouteMapper.touristSpotEntityToPrismaInput(touristSpot)),
            },
        };
    }
    static modelRouteEntityToPrismaUpdateInput(modelRouteEntity) {
        return {
            story_id: modelRouteEntity.storyId,
            route_name: modelRouteEntity.routeName,
            region: modelRouteEntity.region,
            region_desc: modelRouteEntity.regionDesc,
            region_latitude: modelRouteEntity.regionLatitude,
            region_longitude: modelRouteEntity.regionLongitude,
            region_background_media: modelRouteEntity.regionBackgroundMedia,
            recommendation: modelRouteEntity.recommendation,
            del_flag: modelRouteEntity.delFlag,
            upd_user_id: modelRouteEntity.updUserId,
            upd_date_time: modelRouteEntity.updDateTime,
            request_id: modelRouteEntity.requestId,
        };
    }
    static touristSpotEntityToPrismaUpdateInput(touristSpotEntity) {
        return {
            story_chapter_id: touristSpotEntity.storyChapterId,
            tourist_spot_name: touristSpotEntity.touristSpotName,
            tourist_spot_desc: touristSpotEntity.touristSpotDesc,
            latitude: touristSpotEntity.latitude,
            longitude: touristSpotEntity.longitude,
            best_visit_time: touristSpotEntity.bestVisitTime,
            address: touristSpotEntity.address,
            story_chapter_link: touristSpotEntity.storyChapterLink,
            tourist_spot_hashtag: touristSpotEntity.touristSpotHashtag,
            image_set: touristSpotEntity.imageSet,
            del_flag: touristSpotEntity.delFlag,
            upd_user_id: touristSpotEntity.updUserId,
            upd_date_time: touristSpotEntity.updDateTime,
            request_id: touristSpotEntity.requestId,
        };
    }
    static prismaModelToModelRouteEntity(prismaModel) {
        var _a, _b, _c, _d, _e;
        return new model_route_entity_1.ModelRouteEntity({
            storyId: prismaModel.story_id,
            routeName: prismaModel.route_name,
            region: prismaModel.region,
            regionDesc: (_a = prismaModel.region_desc) !== null && _a !== void 0 ? _a : undefined,
            regionLatitude: prismaModel.region_latitude,
            regionLongitude: prismaModel.region_longitude,
            regionBackgroundMedia: (_b = prismaModel.region_background_media) !== null && _b !== void 0 ? _b : undefined,
            recommendation: Array.isArray(prismaModel.recommendation) &&
                prismaModel.recommendation.every((item) => typeof item === 'string')
                ? prismaModel.recommendation
                : [],
            delFlag: (_c = prismaModel.del_flag) !== null && _c !== void 0 ? _c : false,
            insUserId: (_d = prismaModel.ins_user_id) !== null && _d !== void 0 ? _d : '',
            insDateTime: prismaModel.ins_date_time,
            updUserId: prismaModel.upd_user_id,
            updDateTime: prismaModel.upd_date_time,
            requestId: (_e = prismaModel.request_id) !== null && _e !== void 0 ? _e : undefined,
            touristSpotList: prismaModel.tourist_spot.map((touristSpot) => ModelRouteMapper.prismaModelToTouristSpotEntity(touristSpot)),
        }, prismaModel.model_route_id);
    }
}
exports.ModelRouteMapper = ModelRouteMapper;


/***/ }),

/***/ "./libs/core/src/infrastructure/mapper/moment.mapper.ts":
/*!**************************************************************!*\
  !*** ./libs/core/src/infrastructure/mapper/moment.mapper.ts ***!
  \**************************************************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.MomentMapper = void 0;
const moment_entity_1 = __webpack_require__(/*! ../../domain/feed/moment.entity */ "./libs/core/src/domain/feed/moment.entity.ts");
class MomentMapper {
    static prismaModelToMomentEntity(model, totalItems) {
        return moment_entity_1.MomentEntity.fromViewData({
            id: model.id,
            userId: model.user_id,
            username: model.username,
            imageUrl: model.image_url,
            description: model.description,
            rewardText: model.reward_text,
            insDateTime: model.ins_date_time,
            momentType: model.moment_type,
            totalItems,
        });
    }
}
exports.MomentMapper = MomentMapper;


/***/ }),

/***/ "./libs/core/src/infrastructure/mapper/quest.mapper.ts":
/*!*************************************************************!*\
  !*** ./libs/core/src/infrastructure/mapper/quest.mapper.ts ***!
  \*************************************************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.QuestMapper = void 0;
const quest_entity_1 = __webpack_require__(/*! @app/core/domain/game/quest/quest.entity */ "./libs/core/src/domain/game/quest/quest.entity.ts");
const task_1 = __webpack_require__(/*! @app/core/domain/game/quest/task */ "./libs/core/src/domain/game/quest/task.ts");
const model_route_mapper_1 = __webpack_require__(/*! ./model-route-mapper */ "./libs/core/src/infrastructure/mapper/model-route-mapper.ts");
class QuestMapper {
    static prismaModelToQuestEntity(prismaModel) {
        var _a, _b, _c, _d, _e;
        return new quest_entity_1.QuestEntity({
            questName: prismaModel.quest_name,
            questDesc: prismaModel.quest_desc,
            questType: prismaModel.quest_type,
            questImage: (_a = prismaModel.quest_image) !== null && _a !== void 0 ? _a : undefined,
            isUnlocked: prismaModel.is_unlocked,
            isPremium: prismaModel.is_premium,
            totalMagatamaPointAwarded: (_b = prismaModel.total_magatama_point_awarded) !== null && _b !== void 0 ? _b : 0,
            rewardType: prismaModel.reward_type,
            delFlag: (_c = prismaModel.del_flag) !== null && _c !== void 0 ? _c : false,
            insUserId: prismaModel.ins_user_id,
            insDateTime: prismaModel.ins_date_time,
            updUserId: prismaModel.upd_user_id,
            updDateTime: prismaModel.upd_date_time,
            requestId: (_d = prismaModel.request_id) !== null && _d !== void 0 ? _d : undefined,
            tasks: (_e = prismaModel.quest_task) === null || _e === void 0 ? void 0 : _e.map((task) => QuestMapper.prismaTaskModelToTask(task)),
            touristSpot: prismaModel.tourist_spot
                ? model_route_mapper_1.ModelRouteMapper.prismaModelToTouristSpotEntity(prismaModel.tourist_spot)
                : undefined,
        }, prismaModel.quest_id);
    }
    static prismaModelToQuestEntityWithUserCompletedTasks(prismaModel, completedTasks) {
        var _a, _b, _c, _d, _e;
        const completedTaskIdSet = new Set(completedTasks);
        return new quest_entity_1.QuestEntity({
            questName: prismaModel.quest_name,
            questDesc: prismaModel.quest_desc,
            questType: prismaModel.quest_type,
            questImage: (_a = prismaModel.quest_image) !== null && _a !== void 0 ? _a : undefined,
            isUnlocked: prismaModel.is_unlocked,
            isPremium: prismaModel.is_premium,
            totalMagatamaPointAwarded: (_b = prismaModel.total_magatama_point_awarded) !== null && _b !== void 0 ? _b : 0,
            rewardType: prismaModel.reward_type,
            delFlag: (_c = prismaModel.del_flag) !== null && _c !== void 0 ? _c : false,
            insUserId: prismaModel.ins_user_id,
            insDateTime: prismaModel.ins_date_time,
            updUserId: prismaModel.upd_user_id,
            updDateTime: prismaModel.upd_date_time,
            requestId: (_d = prismaModel.request_id) !== null && _d !== void 0 ? _d : undefined,
            tasks: (_e = prismaModel.quest_task) === null || _e === void 0 ? void 0 : _e.map((task) => QuestMapper.prismaTaskModelToTask(task, completedTaskIdSet.has(task.quest_task_id))),
            touristSpot: prismaModel.tourist_spot
                ? model_route_mapper_1.ModelRouteMapper.prismaModelToTouristSpotEntity(prismaModel.tourist_spot)
                : undefined,
            completedTasks: completedTasks,
        }, prismaModel.quest_id);
    }
    static prismaTaskModelToTask(prismaModel, isCompleted = false) {
        var _a, _b;
        return new task_1.Task({
            taskId: prismaModel.quest_task_id,
            taskTheme: prismaModel.task_theme,
            taskType: prismaModel.task_type,
            taskName: prismaModel.task_name,
            taskDesc: prismaModel.task_desc,
            isUnlocked: prismaModel.is_unlocked,
            requiredAction: prismaModel.required_action,
            groupActivityMembers: prismaModel.group_activity_members,
            selectOptions: prismaModel.select_options,
            antiCheatRules: prismaModel.anti_cheat_rules,
            magatamaPointAwarded: prismaModel.magatama_point_awarded,
            rewardEarned: (_a = prismaModel.reward_earned) !== null && _a !== void 0 ? _a : undefined,
            delFlag: prismaModel.del_flag,
            insUserId: prismaModel.ins_user_id,
            insDateTime: prismaModel.ins_date_time,
            updUserId: prismaModel.upd_user_id,
            updDateTime: prismaModel.upd_date_time,
            requestId: (_b = prismaModel.request_id) !== null && _b !== void 0 ? _b : undefined,
            isCompleted,
        });
    }
    static questEntityToPrismaInput(questEntity) {
        var _a, _b, _c, _d, _e, _f;
        return {
            tourist_spot_id: (_b = (_a = questEntity.touristSpot) === null || _a === void 0 ? void 0 : _a.touristSpotId) !== null && _b !== void 0 ? _b : '',
            quest_name: (_c = questEntity.questName) !== null && _c !== void 0 ? _c : '',
            quest_desc: (_d = questEntity.questDesc) !== null && _d !== void 0 ? _d : '',
            quest_image: questEntity.questImage,
            quest_type: questEntity.questType,
            is_unlocked: questEntity.isUnlocked,
            is_premium: questEntity.isPremium,
            total_magatama_point_awarded: (_e = questEntity.totalMagatamaPointAwarded) !== null && _e !== void 0 ? _e : 0,
            reward_type: questEntity.rewardType,
            del_flag: questEntity.delFlag,
            ins_user_id: questEntity.insUserId,
            ins_date_time: questEntity.insDateTime,
            upd_user_id: questEntity.updUserId,
            upd_date_time: questEntity.updDateTime,
            request_id: questEntity.requestId,
            quest_task: {
                create: (_f = questEntity.tasks) === null || _f === void 0 ? void 0 : _f.map((task) => QuestMapper.taskToPrismaInput(task)),
            },
        };
    }
    static taskToPrismaInput(task) {
        var _a;
        return {
            task_theme: task.taskTheme,
            task_type: task.taskType,
            task_name: task.taskName,
            task_desc: task.taskDesc,
            is_unlocked: task.isUnlocked,
            required_action: task.requiredAction,
            group_activity_members: task.groupActivityMembers,
            select_options: task.selectOptions,
            anti_cheat_rules: task.antiCheatRules,
            magatama_point_awarded: task.magatamaPointAwarded,
            reward_earned: task.rewardEarned,
            del_flag: task.delFlag,
            ins_user_id: task.insUserId,
            ins_date_time: task.insDateTime,
            upd_user_id: task.updUserId,
            upd_date_time: task.updDateTime,
            request_id: (_a = task.requestId) !== null && _a !== void 0 ? _a : null,
        };
    }
    static questEntityToPrismaUpdateInput(questEntity) {
        var _a;
        return {
            tourist_spot_id: (_a = questEntity.touristSpot) === null || _a === void 0 ? void 0 : _a.touristSpotId,
            quest_name: questEntity.questName,
            quest_desc: questEntity.questDesc,
            quest_image: questEntity.questImage,
            quest_type: questEntity.questType,
            is_unlocked: questEntity.isUnlocked,
            is_premium: questEntity.isPremium,
            total_magatama_point_awarded: questEntity.totalMagatamaPointAwarded,
            reward_type: questEntity.rewardType,
            del_flag: questEntity.delFlag,
            upd_user_id: questEntity.updUserId,
            upd_date_time: questEntity.updDateTime,
        };
    }
    static taskEntityToPrismaUpdateInput(task) {
        return {
            quest_task_id: task.taskId,
            task_theme: task.taskTheme,
            task_type: task.taskType,
            task_name: task.taskName,
            task_desc: task.taskDesc,
            is_unlocked: task.isUnlocked,
            required_action: task.requiredAction,
            group_activity_members: task.groupActivityMembers,
            select_options: task.selectOptions,
            anti_cheat_rules: task.antiCheatRules,
            magatama_point_awarded: task.magatamaPointAwarded,
            reward_earned: task.rewardEarned,
            del_flag: task.delFlag,
            upd_user_id: task.updUserId,
            upd_date_time: task.updDateTime,
        };
    }
}
exports.QuestMapper = QuestMapper;


/***/ }),

/***/ "./libs/core/src/infrastructure/mapper/story.mapper.ts":
/*!*************************************************************!*\
  !*** ./libs/core/src/infrastructure/mapper/story.mapper.ts ***!
  \*************************************************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.StoryMapper = void 0;
const chapter_story_1 = __webpack_require__(/*! @app/core/domain/game/story/chapter-story */ "./libs/core/src/domain/game/story/chapter-story.ts");
const story_entity_1 = __webpack_require__(/*! @app/core/domain/game/story/story.entity */ "./libs/core/src/domain/game/story/story.entity.ts");
class StoryMapper {
    static storyChapterOnlyEntityToPrismaInput(storyId, storyChapterEntity) {
        var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l;
        return {
            story_id: storyId,
            tourist_spot_id: (_a = storyChapterEntity.touristSpotId) !== null && _a !== void 0 ? _a : '',
            chapter_number: (_b = storyChapterEntity.chapterNumber) !== null && _b !== void 0 ? _b : '',
            chapter_title: (_c = storyChapterEntity.chapterTitle) !== null && _c !== void 0 ? _c : '',
            chapter_desc: (_d = storyChapterEntity.chapterDesc) !== null && _d !== void 0 ? _d : '',
            chapter_image: (_e = storyChapterEntity.chapterImage) !== null && _e !== void 0 ? _e : '',
            character_name_list: (_f = storyChapterEntity.characterNameList) !== null && _f !== void 0 ? _f : [],
            real_world_image: (_g = storyChapterEntity.realWorldImage) !== null && _g !== void 0 ? _g : '',
            chapter_video_url: (_h = storyChapterEntity.chapterVideoUrl) !== null && _h !== void 0 ? _h : '',
            chapter_video_mobile_url: (_j = storyChapterEntity.chapterVideoMobileUrl) !== null && _j !== void 0 ? _j : '',
            chapter_pdf_url: (_k = storyChapterEntity.chapterPdfUrl) !== null && _k !== void 0 ? _k : '',
            is_unlocked: (_l = storyChapterEntity.isUnlocked) !== null && _l !== void 0 ? _l : false,
            del_flag: storyChapterEntity.delFlag,
            ins_user_id: storyChapterEntity.insUserId,
            ins_date_time: storyChapterEntity.insDateTime,
            upd_user_id: storyChapterEntity.updUserId,
            upd_date_time: storyChapterEntity.updDateTime,
            request_id: storyChapterEntity.requestId,
        };
    }
    static storyChapterEntityToPrismaInput(storyChapterEntity) {
        var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m;
        return {
            tourist_spot_id: (_a = storyChapterEntity.touristSpotId) !== null && _a !== void 0 ? _a : '',
            chapter_number: (_b = storyChapterEntity.chapterNumber) !== null && _b !== void 0 ? _b : '',
            chapter_title: (_c = storyChapterEntity.chapterTitle) !== null && _c !== void 0 ? _c : '',
            chapter_desc: (_d = storyChapterEntity.chapterDesc) !== null && _d !== void 0 ? _d : '',
            chapter_image: (_e = storyChapterEntity.chapterImage) !== null && _e !== void 0 ? _e : '',
            character_name_list: (_f = storyChapterEntity.characterNameList) !== null && _f !== void 0 ? _f : [],
            real_world_image: (_g = storyChapterEntity.realWorldImage) !== null && _g !== void 0 ? _g : '',
            chapter_video_url: (_h = storyChapterEntity.chapterVideoUrl) !== null && _h !== void 0 ? _h : '',
            chapter_video_mobile_url: (_j = storyChapterEntity.chapterVideoMobileUrl) !== null && _j !== void 0 ? _j : '',
            chapter_pdf_url: (_k = storyChapterEntity.chapterPdfUrl) !== null && _k !== void 0 ? _k : '',
            is_unlocked: (_l = storyChapterEntity.isUnlocked) !== null && _l !== void 0 ? _l : false,
            del_flag: storyChapterEntity.delFlag,
            ins_user_id: storyChapterEntity.insUserId,
            ins_date_time: storyChapterEntity.insDateTime,
            upd_user_id: storyChapterEntity.updUserId,
            upd_date_time: storyChapterEntity.updDateTime,
            request_id: (_m = storyChapterEntity.requestId) !== null && _m !== void 0 ? _m : null,
        };
    }
    static storyEntityToPrismaInput(storyEntity) {
        var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l;
        return {
            story_id: storyEntity.storyId,
            saga_name: (_a = storyEntity.sagaName) !== null && _a !== void 0 ? _a : '',
            saga_desc: (_b = storyEntity.sagaDesc) !== null && _b !== void 0 ? _b : '',
            background_media: (_c = storyEntity.backgroundMedia) !== null && _c !== void 0 ? _c : null,
            map_image: (_d = storyEntity.mapImage) !== null && _d !== void 0 ? _d : null,
            location: (_e = storyEntity.location) !== null && _e !== void 0 ? _e : null,
            order: (_f = storyEntity.order) !== null && _f !== void 0 ? _f : 0,
            is_prologue: (_g = storyEntity.isPrologue) !== null && _g !== void 0 ? _g : false,
            is_selected: (_h = storyEntity.isSelected) !== null && _h !== void 0 ? _h : false,
            del_flag: (_j = storyEntity.delFlag) !== null && _j !== void 0 ? _j : false,
            ins_user_id: storyEntity.insUserId,
            ins_date_time: storyEntity.insDateTime,
            upd_user_id: storyEntity.updUserId,
            upd_date_time: storyEntity.updDateTime,
            request_id: (_k = storyEntity.requestId) !== null && _k !== void 0 ? _k : null,
            story_chapter: {
                create: (_l = storyEntity.chapterList) === null || _l === void 0 ? void 0 : _l.map((chapter) => StoryMapper.storyChapterEntityToPrismaInput(chapter)),
            },
        };
    }
    static storyEntityToPrismaUpdateInput(storyEntity) {
        var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k;
        return {
            saga_name: (_a = storyEntity.sagaName) !== null && _a !== void 0 ? _a : '',
            saga_desc: (_b = storyEntity.sagaDesc) !== null && _b !== void 0 ? _b : '',
            background_media: (_c = storyEntity.backgroundMedia) !== null && _c !== void 0 ? _c : null,
            map_image: (_d = storyEntity.mapImage) !== null && _d !== void 0 ? _d : null,
            location: (_e = storyEntity.location) !== null && _e !== void 0 ? _e : null,
            order: (_f = storyEntity.order) !== null && _f !== void 0 ? _f : 0,
            is_prologue: (_g = storyEntity.isPrologue) !== null && _g !== void 0 ? _g : false,
            is_selected: (_h = storyEntity.isSelected) !== null && _h !== void 0 ? _h : false,
            del_flag: (_j = storyEntity.delFlag) !== null && _j !== void 0 ? _j : false,
            upd_user_id: storyEntity.updUserId,
            upd_date_time: storyEntity.updDateTime,
            request_id: (_k = storyEntity.requestId) !== null && _k !== void 0 ? _k : null,
        };
    }
    static storyChapterEntityToPrismaUpdateInput(storyChapterEntity) {
        var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m, _o;
        return {
            tourist_spot_id: (_a = storyChapterEntity.touristSpotId) !== null && _a !== void 0 ? _a : '',
            chapter_number: (_b = storyChapterEntity.chapterNumber) !== null && _b !== void 0 ? _b : '',
            chapter_title: (_c = storyChapterEntity.chapterTitle) !== null && _c !== void 0 ? _c : '',
            chapter_desc: (_d = storyChapterEntity.chapterDesc) !== null && _d !== void 0 ? _d : '',
            chapter_image: (_e = storyChapterEntity.chapterImage) !== null && _e !== void 0 ? _e : '',
            character_name_list: (_f = storyChapterEntity.characterNameList) !== null && _f !== void 0 ? _f : [],
            real_world_image: (_g = storyChapterEntity.realWorldImage) !== null && _g !== void 0 ? _g : '',
            chapter_video_url: (_h = storyChapterEntity.chapterVideoUrl) !== null && _h !== void 0 ? _h : '',
            chapter_video_mobile_url: (_j = storyChapterEntity.chapterVideoMobileUrl) !== null && _j !== void 0 ? _j : '',
            chapter_pdf_url: (_k = storyChapterEntity.chapterPdfUrl) !== null && _k !== void 0 ? _k : '',
            is_unlocked: (_l = storyChapterEntity.isUnlocked) !== null && _l !== void 0 ? _l : false,
            del_flag: (_m = storyChapterEntity.delFlag) !== null && _m !== void 0 ? _m : false,
            upd_user_id: storyChapterEntity.updUserId,
            upd_date_time: storyChapterEntity.updDateTime,
            request_id: (_o = storyChapterEntity.requestId) !== null && _o !== void 0 ? _o : null,
        };
    }
    static prismaModelToStoryEntity(prismaModel) {
        var _a, _b, _c, _d, _e, _f, _g, _h;
        return new story_entity_1.StoryEntity({
            sagaName: prismaModel.saga_name,
            sagaDesc: prismaModel.saga_desc,
            backgroundMedia: (_a = prismaModel.background_media) !== null && _a !== void 0 ? _a : undefined,
            mapImage: (_b = prismaModel.map_image) !== null && _b !== void 0 ? _b : undefined,
            location: (_c = prismaModel.location) !== null && _c !== void 0 ? _c : undefined,
            order: prismaModel.order,
            isPrologue: (_d = prismaModel.is_prologue) !== null && _d !== void 0 ? _d : false,
            isSelected: (_e = prismaModel.is_selected) !== null && _e !== void 0 ? _e : false,
            delFlag: (_f = prismaModel.del_flag) !== null && _f !== void 0 ? _f : false,
            insUserId: prismaModel.ins_user_id,
            insDateTime: prismaModel.ins_date_time,
            updUserId: prismaModel.upd_user_id,
            updDateTime: prismaModel.upd_date_time,
            requestId: (_g = prismaModel.request_id) !== null && _g !== void 0 ? _g : undefined,
            chapterList: ((_h = prismaModel.story_chapter) === null || _h === void 0 ? void 0 : _h.length)
                ? StoryMapper.storyChapterToEntity(prismaModel.story_chapter, prismaModel.saga_name)
                : undefined,
        }, prismaModel.story_id);
    }
}
exports.StoryMapper = StoryMapper;
StoryMapper.storyChapterToEntity = (prismaModel, sagaName) => {
    return prismaModel.map((chapter) => {
        var _a, _b, _c;
        return new chapter_story_1.StoryChapter({
            sagaName: sagaName,
            storyChapterId: chapter.story_chapter_id,
            touristSpotId: chapter.tourist_spot_id,
            chapterNumber: chapter.chapter_number,
            chapterTitle: chapter.chapter_title,
            chapterDesc: chapter.chapter_desc,
            chapterImage: chapter.chapter_image,
            characterNameList: chapter.character_name_list,
            realWorldImage: chapter.real_world_image,
            chapterVideoUrl: chapter.chapter_video_url,
            chapterVideoMobileUrl: chapter.chapter_video_mobile_url,
            chapterPdfUrl: chapter.chapter_pdf_url,
            isUnlocked: (_a = chapter.is_unlocked) !== null && _a !== void 0 ? _a : false,
            delFlag: (_b = chapter.del_flag) !== null && _b !== void 0 ? _b : false,
            insUserId: chapter.ins_user_id,
            insDateTime: chapter.ins_date_time,
            updUserId: chapter.upd_user_id,
            updDateTime: chapter.upd_date_time,
            requestId: (_c = chapter.request_id) !== null && _c !== void 0 ? _c : undefined,
        });
    });
};


/***/ }),

/***/ "./libs/core/src/infrastructure/mapper/user.mapper.ts":
/*!************************************************************!*\
  !*** ./libs/core/src/infrastructure/mapper/user.mapper.ts ***!
  \************************************************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.UserMapper = void 0;
const discord_activity_log_1 = __webpack_require__(/*! @app/core/domain/user/discord-activity-log */ "./libs/core/src/domain/user/discord-activity-log.ts");
const discord_rewarded_roles_1 = __webpack_require__(/*! @app/core/domain/user/discord-rewarded-roles */ "./libs/core/src/domain/user/discord-rewarded-roles.ts");
const discord_user_roles_1 = __webpack_require__(/*! @app/core/domain/user/discord-user-roles */ "./libs/core/src/domain/user/discord-user-roles.ts");
const user_achievement_1 = __webpack_require__(/*! @app/core/domain/user/user-achievement */ "./libs/core/src/domain/user/user-achievement.ts");
const user_info_1 = __webpack_require__(/*! @app/core/domain/user/user-info */ "./libs/core/src/domain/user/user-info.ts");
const user_invite_log_1 = __webpack_require__(/*! @app/core/domain/user/user-invite-log */ "./libs/core/src/domain/user/user-invite-log.ts");
const user_item_claim_log_1 = __webpack_require__(/*! @app/core/domain/user/user-item-claim-log */ "./libs/core/src/domain/user/user-item-claim-log.ts");
const user_onchain_item_1 = __webpack_require__(/*! @app/core/domain/user/user-onchain-item */ "./libs/core/src/domain/user/user-onchain-item.ts");
const user_story_log_1 = __webpack_require__(/*! @app/core/domain/user/user-story-log */ "./libs/core/src/domain/user/user-story-log.ts");
const user_task_log_1 = __webpack_require__(/*! @app/core/domain/user/user-task-log */ "./libs/core/src/domain/user/user-task-log.ts");
const user_travel_log_1 = __webpack_require__(/*! @app/core/domain/user/user-travel-log */ "./libs/core/src/domain/user/user-travel-log.ts");
const user_entity_1 = __webpack_require__(/*! @app/core/domain/user/user.entity */ "./libs/core/src/domain/user/user.entity.ts");
const context_storage_1 = __webpack_require__(/*! @app/core/support/context/context-storage */ "./libs/core/src/support/context/context-storage.ts");
const client_1 = __webpack_require__(/*! @prisma/client */ "@prisma/client");
class UserMapper {
    static userEntityToPrismaInput(userEntity) {
        var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l;
        return {
            username: userEntity.username,
            discord_id: (_a = userEntity.discordId) !== null && _a !== void 0 ? _a : null,
            discord_username: (_b = userEntity.discordUsername) !== null && _b !== void 0 ? _b : null,
            twitter_id: (_c = userEntity.twitterId) !== null && _c !== void 0 ? _c : null,
            twitter_username: (_d = userEntity.twitterUsername) !== null && _d !== void 0 ? _d : null,
            google_email: (_e = userEntity.googleEmail) !== null && _e !== void 0 ? _e : null,
            email: (_f = userEntity.email) !== null && _f !== void 0 ? _f : null,
            password: userEntity.password,
            refresh_token: (_g = userEntity.refreshToken) !== null && _g !== void 0 ? _g : null,
            encrypted_private_key: (_h = userEntity.encryptedPrivateKey) !== null && _h !== void 0 ? _h : null,
            passport_wallet_address: (_j = userEntity.passportWalletAddress) !== null && _j !== void 0 ? _j : null,
            perks_wallet_address: userEntity.perksWalletAddress,
            latest_ip_address: (_k = userEntity.latestIpAddress) !== null && _k !== void 0 ? _k : null,
            is_premium: userEntity.isPremium,
            total_quest_completed: userEntity.totalQuestCompleted,
            total_travel_distance: userEntity.totalTravelDistance,
            role: userEntity.role,
            registered_at: userEntity.registeredAt,
            discord_joined_at: userEntity.discordJoinedAt,
            is_banned: userEntity.isBanned,
            del_flag: userEntity.delFlag,
            ins_user_id: userEntity.insUserId,
            ins_date_time: userEntity.insDateTime,
            upd_user_id: userEntity.updUserId,
            upd_date_time: userEntity.updDateTime,
            request_id: (_l = userEntity.requestId) !== null && _l !== void 0 ? _l : null,
        };
    }
    static prismaModelToUserEntity(prismaModel) {
        var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k;
        return new user_entity_1.UserEntity({
            username: prismaModel.username,
            discordId: (_a = prismaModel.discord_id) !== null && _a !== void 0 ? _a : undefined,
            discordUsername: (_b = prismaModel.discord_username) !== null && _b !== void 0 ? _b : undefined,
            twitterId: (_c = prismaModel.twitter_id) !== null && _c !== void 0 ? _c : undefined,
            twitterUsername: (_d = prismaModel.twitter_username) !== null && _d !== void 0 ? _d : undefined,
            googleEmail: (_e = prismaModel.google_email) !== null && _e !== void 0 ? _e : undefined,
            email: (_f = prismaModel.email) !== null && _f !== void 0 ? _f : undefined,
            password: prismaModel.password,
            encryptedPrivateKey: (_g = prismaModel.encrypted_private_key) !== null && _g !== void 0 ? _g : undefined,
            passportWalletAddress: (_h = prismaModel.passport_wallet_address) !== null && _h !== void 0 ? _h : undefined,
            perksWalletAddress: prismaModel.perks_wallet_address,
            latestIpAddress: (_j = prismaModel.latest_ip_address) !== null && _j !== void 0 ? _j : undefined,
            isPremium: prismaModel.is_premium,
            totalQuestCompleted: prismaModel.total_quest_completed,
            totalTravelDistance: prismaModel.total_travel_distance,
            role: prismaModel.role,
            registeredAt: prismaModel.registered_at,
            discordJoinedAt: prismaModel.discord_joined_at,
            isBanned: prismaModel.is_banned,
            delFlag: prismaModel.del_flag,
            insUserId: prismaModel.ins_user_id,
            insDateTime: prismaModel.ins_date_time,
            updUserId: prismaModel.upd_user_id,
            updDateTime: prismaModel.upd_date_time,
            requestId: (_k = prismaModel.request_id) !== null && _k !== void 0 ? _k : undefined,
            userInfo: prismaModel.user_info
                ? UserMapper.prismaModelToUserInfoEntity(prismaModel.user_info)
                : undefined,
            userAchievements: prismaModel.user_achievements
                ? prismaModel.user_achievements.map((achievement) => UserMapper.prismaModelToUserAchievementEntity(achievement))
                : undefined,
            userOnchainItems: prismaModel.user_onchain_item
                ? prismaModel.user_onchain_item.map((item) => UserMapper.prismaModelToUserOnchainItemEntity(item))
                : undefined,
            userItemClaimLogs: prismaModel.user_item_claim_log
                ? prismaModel.user_item_claim_log.map((log) => UserMapper.prismaModelToUserItemClaimLogEntity(log))
                : undefined,
            userStoryLogs: prismaModel.user_story_log
                ? prismaModel.user_story_log.map((log) => UserMapper.prismaModelToUserStoryLogEntity(log))
                : undefined,
            userTaskLogs: prismaModel.user_task_log
                ? prismaModel.user_task_log.map((log) => UserMapper.prismaModelToUserTaskLogEntity(log))
                : undefined,
            userTravelLogs: prismaModel.user_travel_log
                ? prismaModel.user_travel_log.map((log) => UserMapper.prismaModelToUserTravelLogEntity(log))
                : undefined,
            discordActivityLogs: prismaModel.discord_activity_log
                ? prismaModel.discord_activity_log.map((log) => UserMapper.prismaModelToDiscordActivityLogEntity(log))
                : undefined,
            discordUserRoles: prismaModel.discord_user_roles
                ? prismaModel.discord_user_roles.map((role) => UserMapper.prismaModelToDiscordUserRolesEntity(role))
                : undefined,
            discordRewardedRoles: prismaModel.discord_rewarded_roles
                ? prismaModel.discord_rewarded_roles.map((role) => UserMapper.prismaModelToDiscordRewardedRolesEntity(role))
                : undefined,
            userInviteLogs: prismaModel.user_invite_log
                ? prismaModel.user_invite_log.map((log) => UserMapper.prismaModelToUserInviteLogEntity(log))
                : undefined,
        }, prismaModel.user_id);
    }
    static prismaModelToUserInfoEntity(prismaUserInfo) {
        var _a, _b, _c, _d, _e, _f, _g, _h;
        return new user_info_1.UserInfo({
            userId: prismaUserInfo.user_id,
            digitalPassportAddress: prismaUserInfo.digital_passport_address,
            logNftAddress: prismaUserInfo.log_nft_address,
            userDigitalPassportType: (_a = prismaUserInfo.user_digital_passport_type) !== null && _a !== void 0 ? _a : undefined,
            level: (_b = prismaUserInfo.level) !== null && _b !== void 0 ? _b : undefined,
            discountRate: (_c = prismaUserInfo.discount_rate) !== null && _c !== void 0 ? _c : undefined,
            magatamaPoints: prismaUserInfo.magatama_points,
            magatamaBags: (_d = prismaUserInfo.magatama_bags) !== null && _d !== void 0 ? _d : undefined,
            totalQuestCompleted: prismaUserInfo.total_quest_completed,
            totalTravelDistance: prismaUserInfo.total_travel_distance,
            isPremium: prismaUserInfo.is_premium,
            prayerBead: (_e = prismaUserInfo.prayer_bead) !== null && _e !== void 0 ? _e : undefined,
            sword: (_f = prismaUserInfo.sword) !== null && _f !== void 0 ? _f : undefined,
            orgeMask: (_g = prismaUserInfo.orge_mask) !== null && _g !== void 0 ? _g : undefined,
            delFlag: prismaUserInfo.del_flag,
            insUserId: prismaUserInfo.ins_user_id,
            insDateTime: prismaUserInfo.ins_date_time,
            updUserId: prismaUserInfo.upd_user_id,
            updDateTime: prismaUserInfo.upd_date_time,
            requestId: (_h = prismaUserInfo.request_id) !== null && _h !== void 0 ? _h : undefined,
        });
    }
    static prismaModelToUserAchievementEntity(prismaAchievement) {
        var _a, _b, _c;
        return new user_achievement_1.UserAchievement({
            userAchievementId: prismaAchievement.user_achievement_id,
            userId: prismaAchievement.user_id,
            achievementName: prismaAchievement.achievement_name,
            achievementDesc: (_a = prismaAchievement.achievement_desc) !== null && _a !== void 0 ? _a : undefined,
            iconUrl: (_b = prismaAchievement.icon_url) !== null && _b !== void 0 ? _b : undefined,
            achievementType: prismaAchievement.achievement_type,
            magatamaPointAwarded: prismaAchievement.magatama_point_awarded,
            delFlag: prismaAchievement.del_flag,
            insUserId: prismaAchievement.ins_user_id,
            insDateTime: prismaAchievement.ins_date_time,
            updUserId: prismaAchievement.upd_user_id,
            updDateTime: prismaAchievement.upd_date_time,
            requestId: (_c = prismaAchievement.request_id) !== null && _c !== void 0 ? _c : undefined,
        });
    }
    static prismaModelToUserOnchainItemEntity(prismaItem) {
        var _a, _b, _c, _d;
        return new user_onchain_item_1.UserOnchainItem({
            userOnchainItemId: prismaItem.user_onchain_item_id,
            userId: (_a = prismaItem.user_id) !== null && _a !== void 0 ? _a : undefined,
            itemType: prismaItem.item_type,
            itemTxnHash: prismaItem.item_txn_hash,
            blockchainType: prismaItem.blockchain_type,
            mintedAt: (_b = prismaItem.minted_at) !== null && _b !== void 0 ? _b : undefined,
            onchainItemId: (_c = prismaItem.onchain_item_id) !== null && _c !== void 0 ? _c : undefined,
            status: prismaItem.status,
            delFlag: prismaItem.del_flag,
            insUserId: prismaItem.ins_user_id,
            insDateTime: prismaItem.ins_date_time,
            updUserId: prismaItem.upd_user_id,
            updDateTime: prismaItem.upd_date_time,
            requestId: (_d = prismaItem.request_id) !== null && _d !== void 0 ? _d : undefined,
        });
    }
    static prismaModelToUserItemClaimLogEntity(prismaLog) {
        var _a, _b, _c, _d, _e, _f;
        return new user_item_claim_log_1.UserItemClaimLog({
            userItemClaimLogId: prismaLog.user_item_claim_log_id,
            userId: prismaLog.user_id,
            onchainItemId: (_a = prismaLog.onchain_item_id) !== null && _a !== void 0 ? _a : undefined,
            offchainItemName: (_b = prismaLog.offchain_item_name) !== null && _b !== void 0 ? _b : undefined,
            itemAmount: prismaLog.item_amount,
            itemDetails: (_c = prismaLog.item_details) !== null && _c !== void 0 ? _c : undefined,
            type: prismaLog.type,
            claimedAt: (_d = prismaLog.claimed_at) !== null && _d !== void 0 ? _d : undefined,
            status: prismaLog.status,
            errorMsg: (_e = prismaLog.error_msg) !== null && _e !== void 0 ? _e : undefined,
            delFlag: prismaLog.del_flag,
            insUserId: prismaLog.ins_user_id,
            insDateTime: prismaLog.ins_date_time,
            updUserId: prismaLog.upd_user_id,
            updDateTime: prismaLog.upd_date_time,
            requestId: (_f = prismaLog.request_id) !== null && _f !== void 0 ? _f : undefined,
        });
    }
    static prismaModelToUserStoryLogEntity(prismaLog) {
        var _a, _b, _c;
        return new user_story_log_1.UserStoryLog({
            userStoryLogId: prismaLog.user_story_log_id,
            userId: prismaLog.user_id,
            storyChapterId: prismaLog.story_chapter_id,
            status: prismaLog.status,
            unlockedAt: (_a = prismaLog.unlocked_at) !== null && _a !== void 0 ? _a : undefined,
            finishedAt: (_b = prismaLog.finished_at) !== null && _b !== void 0 ? _b : undefined,
            delFlag: prismaLog.del_flag,
            insUserId: prismaLog.ins_user_id,
            insDateTime: prismaLog.ins_date_time,
            updUserId: prismaLog.upd_user_id,
            updDateTime: prismaLog.upd_date_time,
            requestId: (_c = prismaLog.request_id) !== null && _c !== void 0 ? _c : undefined,
        });
    }
    static prismaModelToUserTaskLogEntity(prismaLog) {
        var _a, _b, _c, _d, _e, _f;
        return new user_task_log_1.UserTaskLog({
            userTaskLogId: prismaLog.user_task_log_id,
            userId: prismaLog.user_id,
            questId: prismaLog.quest_id,
            taskId: prismaLog.task_id,
            status: prismaLog.status,
            action: prismaLog.action,
            userResponse: (_a = prismaLog.user_response) !== null && _a !== void 0 ? _a : undefined,
            groupActivityMembers: prismaLog.group_activity_members,
            submissionData: (_b = prismaLog.submission_data) !== null && _b !== void 0 ? _b : undefined,
            failedReason: (_c = prismaLog.failed_reason) !== null && _c !== void 0 ? _c : undefined,
            completedAt: (_d = prismaLog.completed_at) !== null && _d !== void 0 ? _d : undefined,
            claimedAt: (_e = prismaLog.claimed_at) !== null && _e !== void 0 ? _e : undefined,
            totalMagatamaPointAwarded: prismaLog.total_magatama_point_awarded,
            delFlag: prismaLog.del_flag,
            insUserId: prismaLog.ins_user_id,
            insDateTime: prismaLog.ins_date_time,
            updUserId: prismaLog.upd_user_id,
            updDateTime: prismaLog.upd_date_time,
            requestId: (_f = prismaLog.request_id) !== null && _f !== void 0 ? _f : undefined,
        });
    }
    static prismaModelToUserTravelLogEntity(prismaLog) {
        var _a, _b, _c, _d, _e, _f;
        return new user_travel_log_1.UserTravelLog({
            userTravelLogId: prismaLog.user_travel_log_id,
            userId: prismaLog.user_id,
            questId: prismaLog.quest_id,
            taskId: prismaLog.task_id,
            touristSpotId: prismaLog.tourist_spot_id,
            userLongitude: prismaLog.user_longitude,
            userLatitude: prismaLog.user_latitude,
            travelDistanceFromTarget: (_a = prismaLog.travel_distance_from_target) !== null && _a !== void 0 ? _a : undefined,
            travelDistance: prismaLog.travel_distance,
            qrCodeValue: (_b = prismaLog.qr_code_value) !== null && _b !== void 0 ? _b : undefined,
            checkInMethod: (_c = prismaLog.check_in_method) !== null && _c !== void 0 ? _c : undefined,
            detectedFraud: (_d = prismaLog.detected_fraud) !== null && _d !== void 0 ? _d : undefined,
            fraudReason: (_e = prismaLog.fraud_reason) !== null && _e !== void 0 ? _e : undefined,
            delFlag: prismaLog.del_flag,
            insUserId: prismaLog.ins_user_id,
            insDateTime: prismaLog.ins_date_time,
            updUserId: prismaLog.upd_user_id,
            updDateTime: prismaLog.upd_date_time,
            requestId: (_f = prismaLog.request_id) !== null && _f !== void 0 ? _f : undefined,
        });
    }
    static prismaModelToDiscordActivityLogEntity(prismaLog) {
        var _a, _b;
        return new discord_activity_log_1.DiscordActivityLog({
            discordActivityLogId: prismaLog.discord_activity_log_id,
            userId: prismaLog.user_id,
            activityType: prismaLog.activity_type,
            activityDetails: (_a = prismaLog.activity_details) !== null && _a !== void 0 ? _a : undefined,
            magatamaPointAwarded: prismaLog.magatama_point_awarded,
            delFlag: prismaLog.del_flag,
            insUserId: prismaLog.ins_user_id,
            insDateTime: prismaLog.ins_date_time,
            updUserId: prismaLog.upd_user_id,
            updDateTime: prismaLog.upd_date_time,
            requestId: (_b = prismaLog.request_id) !== null && _b !== void 0 ? _b : undefined,
        });
    }
    static prismaModelToDiscordUserRolesEntity(prismaRole) {
        var _a;
        return new discord_user_roles_1.DiscordUserRoles({
            discordUserRolesId: prismaRole.discord_user_roles_id,
            userId: prismaRole.user_id,
            roleId: prismaRole.role_id,
            delFlag: prismaRole.del_flag,
            insUserId: prismaRole.ins_user_id,
            insDateTime: prismaRole.ins_date_time,
            updUserId: prismaRole.upd_user_id,
            updDateTime: prismaRole.upd_date_time,
            requestId: (_a = prismaRole.request_id) !== null && _a !== void 0 ? _a : undefined,
        });
    }
    static prismaModelToDiscordRewardedRolesEntity(prismaRole) {
        var _a;
        return new discord_rewarded_roles_1.DiscordRewardedRoles({
            discordRewardedRolesId: prismaRole.discord_rewarded_roles_id,
            userId: prismaRole.user_id,
            roleId: prismaRole.role_id,
            magatamaPointAwarded: prismaRole.magatama_point_awarded,
            delFlag: prismaRole.del_flag,
            insUserId: prismaRole.ins_user_id,
            insDateTime: prismaRole.ins_date_time,
            updUserId: prismaRole.upd_user_id,
            updDateTime: prismaRole.upd_date_time,
            requestId: (_a = prismaRole.request_id) !== null && _a !== void 0 ? _a : undefined,
        });
    }
    static prismaModelToUserInviteLogEntity(prismaLog) {
        var _a, _b, _c;
        return new user_invite_log_1.UserInviteLog({
            inviteLogId: prismaLog.invite_log_id,
            userId: prismaLog.user_id,
            inviteeDiscordId: (_a = prismaLog.invitee_discord_id) !== null && _a !== void 0 ? _a : undefined,
            inviteeUserId: (_b = prismaLog.invitee_user_id) !== null && _b !== void 0 ? _b : undefined,
            magatamaPointAwarded: prismaLog.magatama_point_awarded,
            delFlag: prismaLog.del_flag,
            insUserId: prismaLog.ins_user_id,
            insDateTime: prismaLog.ins_date_time,
            updUserId: prismaLog.upd_user_id,
            updDateTime: prismaLog.upd_date_time,
            requestId: (_c = prismaLog.request_id) !== null && _c !== void 0 ? _c : undefined,
        });
    }
    static createUserTaskLogForPhotoUpload(userId, questId, taskId, proofUrl) {
        var _a, _b, _c, _d, _e;
        const now = (_b = (_a = context_storage_1.ContextStorage.getStore()) === null || _a === void 0 ? void 0 : _a.getSystemDateTimeJST()) !== null && _b !== void 0 ? _b : new Date();
        return {
            create: {
                user_id: userId,
                quest_id: questId,
                task_id: taskId,
                status: client_1.TaskStatus.COMPLETED,
                action: client_1.TaskType.PHOTO_UPLOAD,
                group_activity_members: [],
                submission_data: { image_url: proofUrl },
                completed_at: now,
                claimed_at: now,
                total_magatama_point_awarded: 0,
                ins_user_id: userId,
                ins_date_time: now,
                upd_user_id: userId,
                upd_date_time: now,
                request_id: (_e = (_d = (_c = context_storage_1.ContextStorage.getStore()) === null || _c === void 0 ? void 0 : _c.getRequestId()) === null || _d === void 0 ? void 0 : _d.value) !== null && _e !== void 0 ? _e : null,
            },
            update: {
                status: client_1.TaskStatus.COMPLETED,
                submission_data: { image_url: proofUrl },
                completed_at: now,
                upd_user_id: userId,
                upd_date_time: now,
            },
        };
    }
    static createUserTaskLogForSocialShare(userId, questId, taskId, proofUrl) {
        var _a, _b, _c, _d, _e;
        const now = (_b = (_a = context_storage_1.ContextStorage.getStore()) === null || _a === void 0 ? void 0 : _a.getSystemDateTimeJST()) !== null && _b !== void 0 ? _b : new Date();
        return {
            create: {
                user_id: userId,
                quest_id: questId,
                task_id: taskId,
                status: client_1.TaskStatus.COMPLETED,
                action: client_1.TaskType.SHARE_SOCIAL,
                group_activity_members: [],
                submission_data: { social_url: proofUrl },
                completed_at: now,
                claimed_at: now,
                total_magatama_point_awarded: 0,
                ins_user_id: userId,
                ins_date_time: now,
                upd_user_id: userId,
                upd_date_time: now,
                request_id: (_e = (_d = (_c = context_storage_1.ContextStorage.getStore()) === null || _c === void 0 ? void 0 : _c.getRequestId()) === null || _d === void 0 ? void 0 : _d.value) !== null && _e !== void 0 ? _e : null,
            },
            update: {
                status: client_1.TaskStatus.COMPLETED,
                submission_data: { social_url: proofUrl },
                completed_at: now,
                upd_user_id: userId,
                upd_date_time: now,
            },
        };
    }
}
exports.UserMapper = UserMapper;


/***/ }),

/***/ "./libs/core/src/infrastructure/passport/passport-metadata.repository-impl.ts":
/*!************************************************************************************!*\
  !*** ./libs/core/src/infrastructure/passport/passport-metadata.repository-impl.ts ***!
  \************************************************************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var PassportMetadataRepositoryImpl_1;
var _a, _b, _c;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.PassportMetadataRepositoryImpl = void 0;
const digital_passport_metadata_1 = __webpack_require__(/*! @app/core/domain/passport/digital-passport-metadata */ "./libs/core/src/domain/passport/digital-passport-metadata.ts");
const r2_storage_repository_1 = __webpack_require__(/*! @app/core/domain/storage/r2-storage.repository */ "./libs/core/src/domain/storage/r2-storage.repository.ts");
const user_repository_1 = __webpack_require__(/*! @app/core/domain/user/user.repository */ "./libs/core/src/domain/user/user.repository.ts");
const tourii_backend_app_error_type_1 = __webpack_require__(/*! @app/core/support/exception/tourii-backend-app-error-type */ "./libs/core/src/support/exception/tourii-backend-app-error-type.ts");
const tourii_backend_app_exception_1 = __webpack_require__(/*! @app/core/support/exception/tourii-backend-app-exception */ "./libs/core/src/support/exception/tourii-backend-app-exception.ts");
const common_1 = __webpack_require__(/*! @nestjs/common */ "@nestjs/common");
const config_1 = __webpack_require__(/*! @nestjs/config */ "@nestjs/config");
const tourii_onchain_constant_1 = __webpack_require__(/*! apps/tourii-onchain/src/tourii-onchain.constant */ "./apps/tourii-onchain/src/tourii-onchain.constant.ts");
let PassportMetadataRepositoryImpl = PassportMetadataRepositoryImpl_1 = class PassportMetadataRepositoryImpl {
    constructor(r2Storage, userRepository, config) {
        this.r2Storage = r2Storage;
        this.userRepository = userRepository;
        this.config = config;
        this.logger = new common_1.Logger(PassportMetadataRepositoryImpl_1.name);
    }
    async generateMetadata(tokenId) {
        try {
            const user = await this.userRepository.findByPassportTokenId(tokenId);
            if (!user || !user.userInfo) {
                throw new tourii_backend_app_exception_1.TouriiBackendAppException(tourii_backend_app_error_type_1.TouriiBackendAppErrorType.E_TB_004);
            }
            const userInfo = user.userInfo;
            const metadataInput = {
                tokenId,
                ownerAddress: user.passportWalletAddress || '',
                username: user.username,
                passportType: userInfo.userDigitalPassportType || 'BONJIN',
                level: userInfo.level || 'BONJIN',
                totalQuestCompleted: userInfo.totalQuestCompleted,
                totalTravelDistance: userInfo.totalTravelDistance,
                magatamaPoints: userInfo.magatamaPoints,
                isPremium: userInfo.isPremium,
                registeredAt: user.registeredAt,
                prayerBead: userInfo.prayerBead,
                sword: userInfo.sword,
                orgeMask: userInfo.orgeMask,
            };
            const metadata = digital_passport_metadata_1.DigitalPassportMetadataBuilder.build(metadataInput);
            this.logger.log(`Generated metadata for passport token ID ${tokenId}`);
            return metadata;
        }
        catch (error) {
            this.logger.error(`Failed to generate metadata for token ID ${tokenId}:`, error);
            throw error;
        }
    }
    async updateMetadata(tokenId) {
        try {
            const metadata = await this.generateMetadata(tokenId);
            const key = `metadata/${tokenId}.json`;
            const metadataUrl = await this.r2Storage.uploadMetadata(metadata, key);
            this.logger.log(`Updated metadata for passport token ID ${tokenId}: ${metadataUrl}`);
            return metadataUrl;
        }
        catch (error) {
            this.logger.error(`Failed to update metadata for token ID ${tokenId}:`, error);
            throw error;
        }
    }
    getMetadataUrl(tokenId) {
        const key = `metadata/${tokenId}.json`;
        return this.r2Storage.generatePublicUrl(key);
    }
};
exports.PassportMetadataRepositoryImpl = PassportMetadataRepositoryImpl;
exports.PassportMetadataRepositoryImpl = PassportMetadataRepositoryImpl = PassportMetadataRepositoryImpl_1 = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, common_1.Inject)(tourii_onchain_constant_1.TouriiOnchainConstants.R2_STORAGE_REPOSITORY_TOKEN)),
    __param(1, (0, common_1.Inject)(tourii_onchain_constant_1.TouriiOnchainConstants.USER_REPOSITORY_TOKEN)),
    __metadata("design:paramtypes", [typeof (_a = typeof r2_storage_repository_1.R2StorageRepository !== "undefined" && r2_storage_repository_1.R2StorageRepository) === "function" ? _a : Object, typeof (_b = typeof user_repository_1.UserRepository !== "undefined" && user_repository_1.UserRepository) === "function" ? _b : Object, typeof (_c = typeof config_1.ConfigService !== "undefined" && config_1.ConfigService) === "function" ? _c : Object])
], PassportMetadataRepositoryImpl);


/***/ }),

/***/ "./libs/core/src/infrastructure/storage/r2-storage.repository-s3.ts":
/*!**************************************************************************!*\
  !*** ./libs/core/src/infrastructure/storage/r2-storage.repository-s3.ts ***!
  \**************************************************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var R2StorageRepositoryS3_1;
var _a;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.R2StorageRepositoryS3 = void 0;
const client_s3_1 = __webpack_require__(/*! @aws-sdk/client-s3 */ "@aws-sdk/client-s3");
const common_1 = __webpack_require__(/*! @nestjs/common */ "@nestjs/common");
const config_1 = __webpack_require__(/*! @nestjs/config */ "@nestjs/config");
let R2StorageRepositoryS3 = R2StorageRepositoryS3_1 = class R2StorageRepositoryS3 {
    constructor(config) {
        this.config = config;
        this.logger = new common_1.Logger(R2StorageRepositoryS3_1.name);
        this.initializeR2Client();
    }
    initializeR2Client() {
        const r2AccountId = this.config.get('R2_ACCOUNT_ID');
        const endpoint = r2AccountId
            ? `https://${r2AccountId}.r2.cloudflarestorage.com`
            : undefined;
        if (!endpoint) {
            throw new Error('R2 endpoint not configured. Set R2_ENDPOINT or R2_ACCOUNT_ID environment variable');
        }
        this.s3Client = new client_s3_1.S3Client({
            endpoint: endpoint,
            region: this.config.get('AWS_REGION') || 'auto',
            credentials: {
                accessKeyId: this.config.get('AWS_ACCESS_KEY_ID') ||
                    this.config.get('R2_ACCESS_KEY_ID') ||
                    '',
                secretAccessKey: this.config.get('AWS_SECRET_ACCESS_KEY') ||
                    this.config.get('R2_SECRET_ACCESS_KEY') ||
                    '',
            },
            forcePathStyle: true,
        });
        this.logger.log(`R2 client initialized successfully with endpoint: ${endpoint}`);
    }
    async uploadProofImage(file, key, contentType) {
        try {
            const bucket = this.config.get('R2_BUCKET');
            if (!bucket) {
                throw new Error('R2_BUCKET environment variable is not set');
            }
            const command = new client_s3_1.PutObjectCommand({
                Bucket: bucket,
                Key: key,
                Body: file,
                ContentType: contentType,
                ACL: 'public-read',
            });
            await this.s3Client.send(command);
            const publicUrl = this.generatePublicUrl(key);
            this.logger.log(`File uploaded successfully to R2: ${publicUrl}`);
            return publicUrl;
        }
        catch (error) {
            this.logger.error(`Failed to upload file to R2: ${error instanceof Error ? error.message : String(error)}`, error instanceof Error ? error.stack : undefined);
            throw new Error(`R2 upload failed: ${error instanceof Error ? error.message : String(error)}`);
        }
    }
    async uploadMetadata(metadata, key) {
        try {
            const bucket = this.config.get('R2_BUCKET');
            if (!bucket) {
                throw new Error('R2_BUCKET environment variable is not set');
            }
            const metadataJson = JSON.stringify(metadata, null, 2);
            const buffer = Buffer.from(metadataJson, 'utf-8');
            const command = new client_s3_1.PutObjectCommand({
                Bucket: bucket,
                Key: key,
                Body: buffer,
                ContentType: 'application/json',
                ACL: 'public-read',
                CacheControl: 'max-age=3600',
            });
            await this.s3Client.send(command);
            const publicUrl = this.generatePublicUrl(key);
            this.logger.log(`Metadata uploaded successfully to R2: ${publicUrl}`);
            return publicUrl;
        }
        catch (error) {
            this.logger.error(`Failed to upload metadata to R2: ${error instanceof Error ? error.message : String(error)}`, error instanceof Error ? error.stack : undefined);
            throw new Error(`R2 metadata upload failed: ${error instanceof Error ? error.message : String(error)}`);
        }
    }
    generatePublicUrl(key) {
        var _a;
        const customDomain = (_a = this.config.get('R2_PUBLIC_DOMAIN')) === null || _a === void 0 ? void 0 : _a.replace(/\/$/, '');
        if (customDomain) {
            return `https://${customDomain}/${key}`;
        }
        throw new Error('R2 public domain not configured. Set R2_PUBLIC_DOMAIN, or both R2_ACCOUNT_ID and R2_BUCKET environment variables');
    }
};
exports.R2StorageRepositoryS3 = R2StorageRepositoryS3;
exports.R2StorageRepositoryS3 = R2StorageRepositoryS3 = R2StorageRepositoryS3_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [typeof (_a = typeof config_1.ConfigService !== "undefined" && config_1.ConfigService) === "function" ? _a : Object])
], R2StorageRepositoryS3);


/***/ }),

/***/ "./libs/core/src/provider/caching.service.ts":
/*!***************************************************!*\
  !*** ./libs/core/src/provider/caching.service.ts ***!
  \***************************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var CachingService_1;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.CachingService = void 0;
const tourii_backend_app_exception_1 = __webpack_require__(/*! @app/core/support/exception/tourii-backend-app-exception */ "./libs/core/src/support/exception/tourii-backend-app-exception.ts");
const cache_manager_1 = __webpack_require__(/*! @nestjs/cache-manager */ "@nestjs/cache-manager");
const common_1 = __webpack_require__(/*! @nestjs/common */ "@nestjs/common");
let CachingService = CachingService_1 = class CachingService {
    constructor(cacheManager) {
        this.cacheManager = cacheManager;
        this.logger = new common_1.Logger(CachingService_1.name);
        this.ongoingFetches = new Map();
    }
    async getOrSet(key, fetchDataFn, ttlSeconds) {
        try {
            const cachedDataString = await this.cacheManager.get(key);
            if (cachedDataString) {
                this.logger.log(`Cache hit for key: ${key}. Using cached data.`);
                try {
                    return JSON.parse(cachedDataString);
                }
                catch (parseError) {
                    this.logger.error(`Failed to parse cached data for key ${key}:`, parseError);
                }
            }
            this.logger.log(`Cache miss for key: ${key}. Checking for ongoing fetches.`);
            if (this.ongoingFetches.has(key)) {
                this.logger.log(`Ongoing fetch for key: ${key}. Awaiting existing promise.`);
                return this.ongoingFetches.get(key);
            }
            this.logger.log(`No ongoing fetch for key: ${key}. Initiating fresh data fetch.`);
            const fetchPromise = (async () => {
                try {
                    const freshData = await fetchDataFn();
                    if (freshData !== null && freshData !== undefined) {
                        try {
                            await this.cacheManager.set(key, JSON.stringify(freshData), ttlSeconds);
                            this.logger.log(`Stored fresh data in cache with key: ${key}, TTL: ${ttlSeconds}s`);
                        }
                        catch (storeError) {
                            this.logger.error(`Failed to store data in cache for key ${key}:`, storeError);
                        }
                    }
                    return freshData;
                }
                catch (fetchError) {
                    this.logger.error(`Error fetching data for key ${key} in ongoing fetch:`, fetchError);
                    if (fetchError instanceof tourii_backend_app_exception_1.TouriiBackendAppException) {
                        throw fetchError;
                    }
                    return null;
                }
                finally {
                    this.ongoingFetches.delete(key);
                    this.logger.log(`Removed ongoing fetch entry for key: ${key}`);
                }
            })();
            this.ongoingFetches.set(key, fetchPromise);
            return fetchPromise;
        }
        catch (error) {
            this.logger.error(`Error in getOrSet for key ${key}:`, error);
            return null;
        }
    }
    async invalidate(keyOrPattern) {
        try {
            if (keyOrPattern.endsWith('*')) {
                await this.invalidatePattern(keyOrPattern);
            }
            else {
                await this.cacheManager.del(keyOrPattern);
                this.logger.log(`Cache invalidated for key: ${keyOrPattern}`);
            }
        }
        catch (error) {
            this.logger.error(`Failed to invalidate cache for key/pattern ${keyOrPattern}:`, error);
        }
    }
    async invalidatePattern(pattern) {
        try {
            this.logger.warn(`Wildcard cache invalidation for pattern: ${pattern}. This is not fully supported by cache-manager. Consider implementing Redis SCAN.`);
            this.logger.log(`Cache pattern invalidation attempted for: ${pattern}`);
        }
        catch (error) {
            this.logger.error(`Failed to invalidate cache pattern ${pattern}:`, error);
        }
    }
    async clearAll() {
        try {
            const store = this.cacheManager.store;
            if (store && typeof store.reset === 'function') {
                await store.reset();
            }
            else {
                this.logger.warn('Cache store reset not available - implement manual clearing if needed');
            }
            this.logger.log('All cache entries cleared');
        }
        catch (error) {
            this.logger.error('Failed to clear all cache entries:', error);
        }
    }
};
exports.CachingService = CachingService;
exports.CachingService = CachingService = CachingService_1 = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, common_1.Inject)(cache_manager_1.CACHE_MANAGER)),
    __metadata("design:paramtypes", [Object])
], CachingService);


/***/ }),

/***/ "./libs/core/src/provider/prisma.service.ts":
/*!**************************************************!*\
  !*** ./libs/core/src/provider/prisma.service.ts ***!
  \**************************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.PrismaService = void 0;
const common_1 = __webpack_require__(/*! @nestjs/common */ "@nestjs/common");
const client_1 = __webpack_require__(/*! @prisma/client */ "@prisma/client");
let PrismaService = class PrismaService extends client_1.PrismaClient {
    async onModuleInit() {
        await this.$connect();
    }
};
exports.PrismaService = PrismaService;
exports.PrismaService = PrismaService = __decorate([
    (0, common_1.Injectable)()
], PrismaService);


/***/ }),

/***/ "./libs/core/src/provider/tourii-backend-http-service.ts":
/*!***************************************************************!*\
  !*** ./libs/core/src/provider/tourii-backend-http-service.ts ***!
  \***************************************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var TouriiBackendHttpService_1;
var _a;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.TouriiBackendHttpService = void 0;
const axios_1 = __webpack_require__(/*! @nestjs/axios */ "@nestjs/axios");
const common_1 = __webpack_require__(/*! @nestjs/common */ "@nestjs/common");
const config_1 = __webpack_require__(/*! @nestjs/config */ "@nestjs/config");
const axios_2 = __importDefault(__webpack_require__(/*! axios */ "axios"));
const axios_retry_1 = __importDefault(__webpack_require__(/*! axios-retry */ "axios-retry"));
let TouriiBackendHttpService = TouriiBackendHttpService_1 = class TouriiBackendHttpService {
    constructor(configService) {
        this.configService = configService;
        this.logger = new common_1.Logger(TouriiBackendHttpService_1.name);
        this.init();
    }
    init() {
        this.axiosInstance = axios_2.default.create({
            timeout: this.configService.get('HTTP_DEFAULT_TIMEOUT', 10000),
        });
        (0, axios_retry_1.default)(this.axiosInstance, {
            retries: this.configService.get('HTTP_DEFAULT_RETRIES', 2),
            retryDelay: (retryCount, error) => {
                var _a;
                this.logger.log(`Request to ${(_a = error.config) === null || _a === void 0 ? void 0 : _a.url} failed. Attempt #${retryCount}. Retrying in ${retryCount * 1000}ms...`, `Error: ${error.code || error.message}`);
                return retryCount * 1000;
            },
            retryCondition: (error) => {
                var _a;
                return (axios_retry_1.default.isNetworkError(error) ||
                    axios_retry_1.default.isRetryableError(error) ||
                    error.code === 'ECONNABORTED' ||
                    (((_a = error.response) === null || _a === void 0 ? void 0 : _a.status) !== undefined &&
                        error.response.status >= 500 &&
                        error.response.status <= 599));
            },
            onRetry: (retryCount, error, requestConfig) => {
                var _a;
                this.logger.warn(`Retrying request: ${(_a = requestConfig.method) === null || _a === void 0 ? void 0 : _a.toUpperCase()} ${requestConfig.url} - Attempt #${retryCount}. Last error: ${error.code || error.message}`);
            },
        });
        this.httpService = new axios_1.HttpService(this.axiosInstance);
        this.axiosInstance.interceptors.response.use((response) => {
            return response;
        }, (error) => {
            var _a, _b, _c, _d, _e;
            if (axios_2.default.isAxiosError(error)) {
                this.logger.error(`HTTP Request Failed (after retries if applicable): ${(_b = (_a = error.config) === null || _a === void 0 ? void 0 : _a.method) === null || _b === void 0 ? void 0 : _b.toUpperCase()} ${(_c = error.config) === null || _c === void 0 ? void 0 : _c.url}`, `Error: ${error.message}, Status: ${(_d = error.response) === null || _d === void 0 ? void 0 : _d.status}, Response: ${JSON.stringify((_e = error.response) === null || _e === void 0 ? void 0 : _e.data)}`, error.stack);
            }
            else {
                this.logger.error(`Non-Axios HTTP Error encountered: ${error.message}`, error.stack);
            }
            return Promise.reject(error);
        });
    }
    get getTouriiBackendHttpService() {
        return this.httpService;
    }
};
exports.TouriiBackendHttpService = TouriiBackendHttpService;
exports.TouriiBackendHttpService = TouriiBackendHttpService = TouriiBackendHttpService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [typeof (_a = typeof config_1.ConfigService !== "undefined" && config_1.ConfigService) === "function" ? _a : Object])
], TouriiBackendHttpService);


/***/ }),

/***/ "./libs/core/src/provider/tourii-backend-logging-service.ts":
/*!******************************************************************!*\
  !*** ./libs/core/src/provider/tourii-backend-logging-service.ts ***!
  \******************************************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var _a;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.TouriiBackendLoggingService = void 0;
const common_1 = __webpack_require__(/*! @nestjs/common */ "@nestjs/common");
const config_1 = __webpack_require__(/*! @nestjs/config */ "@nestjs/config");
const context_storage_1 = __webpack_require__(/*! ../support/context/context-storage */ "./libs/core/src/support/context/context-storage.ts");
const tourii_core_logging_service_1 = __webpack_require__(/*! ./tourii-core-logging-service */ "./libs/core/src/provider/tourii-core-logging-service.ts");
let TouriiBackendLoggingService = class TouriiBackendLoggingService extends tourii_core_logging_service_1.TouriiCoreLoggingService {
    constructor(configService) {
        const logLevel = configService.get('LOGGING_LEVEL');
        super(logLevel ? logLevel : 'info');
        this.configService = configService;
    }
    TouriiBackendLog(message) {
        var _a, _b;
        this.logger.log({
            level: 'data',
            type: 'TouriiBackendLog',
            requestId: (_b = (_a = context_storage_1.ContextStorage.getStore()) === null || _a === void 0 ? void 0 : _a.getRequestId()) === null || _b === void 0 ? void 0 : _b.value,
            message,
        });
    }
};
exports.TouriiBackendLoggingService = TouriiBackendLoggingService;
exports.TouriiBackendLoggingService = TouriiBackendLoggingService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [typeof (_a = typeof config_1.ConfigService !== "undefined" && config_1.ConfigService) === "function" ? _a : Object])
], TouriiBackendLoggingService);


/***/ }),

/***/ "./libs/core/src/provider/tourii-core-logging-service.ts":
/*!***************************************************************!*\
  !*** ./libs/core/src/provider/tourii-core-logging-service.ts ***!
  \***************************************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.TouriiCoreLoggingService = void 0;
const common_1 = __webpack_require__(/*! @nestjs/common */ "@nestjs/common");
const winston = __importStar(__webpack_require__(/*! winston */ "winston"));
const context_storage_1 = __webpack_require__(/*! ../support/context/context-storage */ "./libs/core/src/support/context/context-storage.ts");
const request_id_1 = __webpack_require__(/*! ../support/context/request-id */ "./libs/core/src/support/context/request-id.ts");
let TouriiCoreLoggingService = class TouriiCoreLoggingService {
    constructor(logLevel) {
        this.logLevel = logLevel;
        const customLevels = {
            data: -1,
            error: 0,
            warn: 1,
            http: 1.5,
            info: 2,
            verbose: 3,
            debug: 4,
            silly: 5,
        };
        const logger = winston.createLogger({
            levels: customLevels,
            format: winston.format.combine(winston.format.timestamp({
                format: 'YYYY/MM/DD HH:mm:ss.SSS',
            }), winston.format.errors({
                stack: true,
            }), winston.format.colorize({
                colors: {
                    data: 'cyan',
                    error: 'red',
                    warn: 'yellow',
                    http: 'blue',
                    info: 'green',
                    debug: 'grey',
                    verbose: 'white',
                },
                all: true,
            }), winston.format.printf(({ level, message, timestamp, type, requestId }) => `${timestamp} ${level} [${type ? type : 'Nest'}] [${requestId ? requestId : ''}] ${message}`)),
            transports: [
                new winston.transports.Console({
                    level: this.logLevel,
                }),
            ],
        });
        this.logger = logger;
    }
    log(message, ...optionalParams) {
        var _a, _b;
        if (optionalParams.length === 1 && optionalParams[0] instanceof request_id_1.RequestId) {
            this.requestLog(message, optionalParams[0]);
        }
        else {
            const additionalInfo = optionalParams.length > 0 ? JSON.stringify(optionalParams[0]) : undefined;
            this.logger.log({
                level: 'info',
                requestId: (_b = (_a = context_storage_1.ContextStorage.getStore()) === null || _a === void 0 ? void 0 : _a.getRequestId()) === null || _b === void 0 ? void 0 : _b.value,
                message: additionalInfo ? `${message}:${additionalInfo}` : `${message}`,
            });
        }
    }
    requestLog(message, requestId) {
        this.logger.log({
            level: 'http',
            type: 'RequestLog',
            requestId: `${requestId.value}`,
            message,
        });
    }
    error(message, trace) {
        var _a, _b;
        this.logger.log({
            level: 'error',
            requestId: (_b = (_a = context_storage_1.ContextStorage.getStore()) === null || _a === void 0 ? void 0 : _a.getRequestId()) === null || _b === void 0 ? void 0 : _b.value,
            message: JSON.stringify({
                errorMessage: message,
                stackTrace: trace,
            }),
        });
    }
    warn(message) {
        var _a, _b;
        this.logger.log({
            level: 'warn',
            requestId: (_b = (_a = context_storage_1.ContextStorage.getStore()) === null || _a === void 0 ? void 0 : _a.getRequestId()) === null || _b === void 0 ? void 0 : _b.value,
            message,
        });
    }
    debug(message) {
        var _a, _b;
        this.logger.log({
            level: 'debug',
            requestId: (_b = (_a = context_storage_1.ContextStorage.getStore()) === null || _a === void 0 ? void 0 : _a.getRequestId()) === null || _b === void 0 ? void 0 : _b.value,
            message,
        });
    }
    verbose(message) {
        var _a, _b;
        this.logger.log({
            level: 'verbose',
            requestId: (_b = (_a = context_storage_1.ContextStorage.getStore()) === null || _a === void 0 ? void 0 : _a.getRequestId()) === null || _b === void 0 ? void 0 : _b.value,
            message,
        });
    }
};
exports.TouriiCoreLoggingService = TouriiCoreLoggingService;
exports.TouriiCoreLoggingService = TouriiCoreLoggingService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [String])
], TouriiCoreLoggingService);


/***/ }),

/***/ "./libs/core/src/support/context/context-storage.ts":
/*!**********************************************************!*\
  !*** ./libs/core/src/support/context/context-storage.ts ***!
  \**********************************************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.ContextStorage = void 0;
const node_async_hooks_1 = __webpack_require__(/*! node:async_hooks */ "node:async_hooks");
exports.ContextStorage = new node_async_hooks_1.AsyncLocalStorage();


/***/ }),

/***/ "./libs/core/src/support/context/context.provider.ts":
/*!***********************************************************!*\
  !*** ./libs/core/src/support/context/context.provider.ts ***!
  \***********************************************************/
/***/ ((__unused_webpack_module, exports) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));


/***/ }),

/***/ "./libs/core/src/support/context/request-id.ts":
/*!*****************************************************!*\
  !*** ./libs/core/src/support/context/request-id.ts ***!
  \*****************************************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.RequestId = void 0;
const uuid_1 = __webpack_require__(/*! uuid */ "uuid");
class RequestId {
    constructor(value) {
        if (value) {
            this._value = value;
        }
        else {
            this._value = (0, uuid_1.v4)();
        }
    }
    get value() {
        return this._value;
    }
}
exports.RequestId = RequestId;


/***/ }),

/***/ "./libs/core/src/support/exception/error-type.ts":
/*!*******************************************************!*\
  !*** ./libs/core/src/support/exception/error-type.ts ***!
  \*******************************************************/
/***/ ((__unused_webpack_module, exports) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.ErrorType = void 0;
exports.ErrorType = {
    BAD_REQUEST: 'BAD_REQUEST',
    NOT_FOUND: 'NOT_FOUND',
    INTERNAL_SERVER_ERROR: 'INTERNAL_SERVER_ERROR',
    UNAUTHORIZED: 'UNAUTHORIZED',
};


/***/ }),

/***/ "./libs/core/src/support/exception/tourii-backend-app-error-type.ts":
/*!**************************************************************************!*\
  !*** ./libs/core/src/support/exception/tourii-backend-app-error-type.ts ***!
  \**************************************************************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.TouriiBackendAppErrorType = void 0;
const error_type_1 = __webpack_require__(/*! ./error-type */ "./libs/core/src/support/exception/error-type.ts");
exports.TouriiBackendAppErrorType = {
    E_TB_000: {
        code: 'E_TB_000',
        message: 'Internal Server Error',
        type: error_type_1.ErrorType.INTERNAL_SERVER_ERROR,
    },
    E_TB_001: {
        code: 'E_TB_001',
        message: 'Bad Request',
        type: error_type_1.ErrorType.BAD_REQUEST,
    },
    E_TB_002: {
        code: 'E_TB_002',
        message: 'Unauthorized',
        type: error_type_1.ErrorType.UNAUTHORIZED,
    },
    E_TB_003: {
        code: 'E_TB_003',
        message: 'SailsCalls is not ready',
        type: error_type_1.ErrorType.INTERNAL_SERVER_ERROR,
    },
    E_TB_004: {
        code: 'E_TB_004',
        message: 'User is not registered',
        type: error_type_1.ErrorType.UNAUTHORIZED,
    },
    E_TB_005: {
        code: 'E_TB_005',
        message: 'Bad Credentials',
        type: error_type_1.ErrorType.BAD_REQUEST,
    },
    E_TB_006: {
        code: 'E_TB_006',
        message: 'User already exists',
        type: error_type_1.ErrorType.BAD_REQUEST,
    },
    E_TB_007: {
        code: 'E_TB_007',
        message: 'Error while issue a voucher to a signless account',
        type: error_type_1.ErrorType.BAD_REQUEST,
    },
    E_TB_008: {
        code: 'E_TB_008',
        message: 'Error while adding tokens to voucher',
        type: error_type_1.ErrorType.BAD_REQUEST,
    },
    E_TB_009: {
        code: 'E_TB_009',
        message: 'Error while renewing voucher',
        type: error_type_1.ErrorType.BAD_REQUEST,
    },
    E_TB_010: {
        code: 'E_TB_010',
        message: 'API key is required',
        type: error_type_1.ErrorType.UNAUTHORIZED,
    },
    E_TB_011: {
        code: 'E_TB_011',
        message: 'Invalid API key',
        type: error_type_1.ErrorType.UNAUTHORIZED,
    },
    E_TB_020: {
        code: 'E_TB_020',
        message: 'Version header is required',
        type: error_type_1.ErrorType.BAD_REQUEST,
    },
    E_TB_021: {
        code: 'E_TB_021',
        message: 'Invalid version format',
        type: error_type_1.ErrorType.BAD_REQUEST,
    },
    E_TB_022: {
        code: 'E_TB_022',
        message: 'This API version is no longer supported',
        type: error_type_1.ErrorType.BAD_REQUEST,
    },
    E_TB_023: {
        code: 'E_TB_023',
        message: 'Story not found',
        type: error_type_1.ErrorType.NOT_FOUND,
    },
    E_TB_024: {
        code: 'E_TB_024',
        message: 'Story chapter update failed',
        type: error_type_1.ErrorType.BAD_REQUEST,
    },
    E_TB_025: {
        code: 'E_TB_025',
        message: 'Geo info not found',
        type: error_type_1.ErrorType.NOT_FOUND,
    },
    E_TB_026: {
        code: 'E_TB_026',
        message: 'Current weather not found',
        type: error_type_1.ErrorType.NOT_FOUND,
    },
    E_TB_027: {
        code: 'E_TB_027',
        message: 'Model route not found',
        type: error_type_1.ErrorType.NOT_FOUND,
    },
    E_TB_028: {
        code: 'E_TB_028',
        message: 'Quest task not found',
        type: error_type_1.ErrorType.NOT_FOUND,
    },
    E_TB_029: {
        code: 'E_TB_029',
        message: 'Story chapter already completed',
        type: error_type_1.ErrorType.BAD_REQUEST,
    },
    E_GEO_001: {
        code: 'E_GEO_001',
        message: 'Geocoding: Address not found (ZERO_RESULTS).',
        type: error_type_1.ErrorType.NOT_FOUND,
    },
    E_GEO_002: {
        code: 'E_GEO_002',
        message: 'Geocoding: API key invalid or request denied by provider.',
        type: error_type_1.ErrorType.UNAUTHORIZED,
    },
    E_GEO_003: {
        code: 'E_GEO_003',
        message: 'Geocoding: API provider rate limit exceeded.',
        type: error_type_1.ErrorType.BAD_REQUEST,
    },
    E_GEO_004: {
        code: 'E_GEO_004',
        message: 'Geocoding: External API error during geocoding request.',
        type: error_type_1.ErrorType.INTERNAL_SERVER_ERROR,
    },
    E_GEO_005: {
        code: 'E_GEO_005',
        message: 'Geocoding: GOOGLE_MAPS_API_KEY not configured in server environment.',
        type: error_type_1.ErrorType.INTERNAL_SERVER_ERROR,
    },
    E_WEATHER_001: {
        code: 'E_WEATHER_001',
        message: 'Weather API: Location not found or no data available.',
        type: error_type_1.ErrorType.NOT_FOUND,
    },
    E_WEATHER_002: {
        code: 'E_WEATHER_002',
        message: 'Weather API: API key invalid or request denied by provider.',
        type: error_type_1.ErrorType.UNAUTHORIZED,
    },
    E_WEATHER_003: {
        code: 'E_WEATHER_003',
        message: 'Weather API: API provider rate limit exceeded.',
        type: error_type_1.ErrorType.BAD_REQUEST,
    },
    E_WEATHER_004: {
        code: 'E_WEATHER_004',
        message: 'Weather API: External API error during weather data request.',
        type: error_type_1.ErrorType.INTERNAL_SERVER_ERROR,
    },
    E_WEATHER_005: {
        code: 'E_WEATHER_005',
        message: 'Weather API: WEATHER_API_KEY not configured in server environment.',
        type: error_type_1.ErrorType.INTERNAL_SERVER_ERROR,
    },
};


/***/ }),

/***/ "./libs/core/src/support/exception/tourii-backend-app-exception.ts":
/*!*************************************************************************!*\
  !*** ./libs/core/src/support/exception/tourii-backend-app-exception.ts ***!
  \*************************************************************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.TouriiBackendAppException = exports.ApiAppError = void 0;
const common_1 = __webpack_require__(/*! @nestjs/common */ "@nestjs/common");
class ApiAppError {
    constructor(code, message, type, metadata = {}) {
        this.code = code;
        this.message = message;
        this.code = code;
        this.message = message;
        this.type = type;
        this.metadata = metadata;
    }
}
exports.ApiAppError = ApiAppError;
class TouriiBackendAppException extends common_1.HttpException {
    constructor(error, metadata) {
        super(new ApiAppError(error.code, error.message, error.type, metadata), common_1.HttpStatus.OK);
    }
}
exports.TouriiBackendAppException = TouriiBackendAppException;


/***/ }),

/***/ "./libs/core/src/support/transformer/date-transformer.ts":
/*!***************************************************************!*\
  !*** ./libs/core/src/support/transformer/date-transformer.ts ***!
  \***************************************************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.TransformDate = void 0;
const date_utils_1 = __webpack_require__(/*! @app/core/utils/date-utils */ "./libs/core/src/utils/date-utils.ts");
exports.TransformDate = {
    transformYYYYMMDDToDate({ value }) {
        return value === undefined
            ? undefined
            : value === null
                ? null
                : date_utils_1.DateUtils.fromYYYYMMDD(value);
    },
    transformYYYYMMDDHHmmToDate({ value }) {
        return value === undefined
            ? undefined
            : value === null
                ? null
                : date_utils_1.DateUtils.fromYYYYMMDDHHmm(value);
    },
    transformYYYYMMDDHHmmssToDate({ value }) {
        return value === undefined
            ? undefined
            : value === null
                ? null
                : date_utils_1.DateUtils.fromYYYYMMDDHHmmss(value);
    },
    transformDateToYYYYMMDD(value) {
        return value !== undefined ? date_utils_1.DateUtils.formatToYYYYMMDD(value) : undefined;
    },
    transformDateToYYYYMMDDHHmm(value) {
        return value !== undefined ? date_utils_1.DateUtils.formatToYYYYMMDDHHmm(value) : undefined;
    },
    transformDateToYYYYMMDDHHmmss(value) {
        return value !== undefined ? date_utils_1.DateUtils.formatToYYYYMMDDHHmmss(value) : undefined;
    },
    transformDateToYYYYMMDDDate(value) {
        return value !== undefined ? date_utils_1.DateUtils.formatToYYYYMMDDDate(value) : undefined;
    },
    transformDateToHHmm(value) {
        return value !== undefined ? date_utils_1.DateUtils.formatToHHmm(value) : undefined;
    },
};


/***/ }),

/***/ "./libs/core/src/utils/date-utils.ts":
/*!*******************************************!*\
  !*** ./libs/core/src/utils/date-utils.ts ***!
  \*******************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.DateUtils = void 0;
const dayjs_1 = __importDefault(__webpack_require__(/*! dayjs */ "dayjs"));
const timezone_1 = __importDefault(__webpack_require__(/*! dayjs/plugin/timezone */ "dayjs/plugin/timezone"));
const utc_1 = __importDefault(__webpack_require__(/*! dayjs/plugin/utc */ "dayjs/plugin/utc"));
const tourii_backend_app_error_type_1 = __webpack_require__(/*! ../support/exception/tourii-backend-app-error-type */ "./libs/core/src/support/exception/tourii-backend-app-error-type.ts");
const tourii_backend_app_exception_1 = __webpack_require__(/*! ../support/exception/tourii-backend-app-exception */ "./libs/core/src/support/exception/tourii-backend-app-exception.ts");
const ASIA_TOKYO_TIMEZONE = 'Asia/Tokyo';
dayjs_1.default.extend(utc_1.default);
dayjs_1.default.extend(timezone_1.default);
dayjs_1.default.tz.setDefault(ASIA_TOKYO_TIMEZONE);
dayjs_1.default.locale('ja', {
    weekdays: ['日', '月', '火', '水', '木', '金', '土'],
});
exports.DateUtils = {
    getJSTDate() {
        return exports.DateUtils.fromYYYYMMDDHHmm(dayjs_1.default.utc().tz(ASIA_TOKYO_TIMEZONE).format('YYYYMMDD HH:mm'));
    },
    getJSTDateTimeSeconds() {
        return exports.DateUtils.fromYYYYMMDDHHmmss(dayjs_1.default.utc().tz(ASIA_TOKYO_TIMEZONE).format('YYYYMMDD HH:mm:ss'));
    },
    formatToYYYYMMDDDate(date) {
        const yyyymmddString = dayjs_1.default.utc(date).format('YYYYMMDD');
        return new Date(dayjs_1.default.utc(yyyymmddString, 'YYYYMMDD').toDate());
    },
    formatToYYYYMMDDHHmmssDate(date) {
        const yyyymmddhhmmssString = dayjs_1.default.utc(date).format('YYYYMMDD HH:mm:ss');
        return new Date(dayjs_1.default.utc(yyyymmddhhmmssString, 'YYYYMMDD HH:mm:ss').toDate());
    },
    formatToYYMM(date) {
        if (date === undefined) {
            throw new tourii_backend_app_exception_1.TouriiBackendAppException(tourii_backend_app_error_type_1.TouriiBackendAppErrorType.E_TB_000);
        }
        return dayjs_1.default.utc(date).format('YYMM');
    },
    formatToYYYYMMDD(date) {
        return dayjs_1.default.utc(date).format('YYYYMMDD');
    },
    formatToYYYYMMDDddd(date) {
        if (date === undefined) {
            throw new tourii_backend_app_exception_1.TouriiBackendAppException(tourii_backend_app_error_type_1.TouriiBackendAppErrorType.E_TB_000);
        }
        return dayjs_1.default.utc(date).format('YYYY/MM/DD（ddd）');
    },
    formatToYYYYMMDDWithSlash(date) {
        if (date === undefined) {
            throw new tourii_backend_app_exception_1.TouriiBackendAppException(tourii_backend_app_error_type_1.TouriiBackendAppErrorType.E_TB_000);
        }
        return dayjs_1.default.utc(date).format('YYYY/MM/DD');
    },
    formatToYYYYMMDDHHmmss(date) {
        return dayjs_1.default.utc(date).format('YYYYMMDD HH:mm:ss');
    },
    formatToYYYYMMDDHHmmssSlash(date) {
        return dayjs_1.default.utc(date).tz(ASIA_TOKYO_TIMEZONE).format('YYYY/MM/DD HH:mm:ss');
    },
    formatToYYYYMMDDHHmm(date) {
        return dayjs_1.default.utc(date).format('YYYYMMDD HH:mm');
    },
    formatToHHmm(date) {
        return dayjs_1.default.utc(date).format('HH:mm');
    },
    formatToHHmmss(date) {
        return dayjs_1.default.utc(date).format('HHmmss');
    },
    formatToHHmmssWithColon(date) {
        return dayjs_1.default.utc(date).format('HH:mm:ss');
    },
    stringFormatToHHmm(timeString) {
        if (timeString === undefined) {
            throw new tourii_backend_app_exception_1.TouriiBackendAppException(tourii_backend_app_error_type_1.TouriiBackendAppErrorType.E_TB_000);
        }
        if (timeString.includes(':')) {
            return timeString;
        }
        return `${timeString.slice(0, 2)}:${timeString.slice(2)}`;
    },
    fromYYYYMMDD(dateString) {
        return dayjs_1.default.utc(dateString, 'YYYYMMDD').toDate();
    },
    fromYYYYMMDDHHmm(dateString) {
        return dayjs_1.default.utc(dateString, 'YYYYMMDD HH:mm').toDate();
    },
    fromYYYYMMDDHHmmss(dateString) {
        return dayjs_1.default.utc(dateString, 'YYYYMMDD HH:mm:ss').toDate();
    },
    fromYYYYMMDDHHmmNoHyphen(dateString, timeString) {
        return dayjs_1.default.utc(`${dateString} ${timeString}`, 'YYYYMMDD HH:mm').toDate();
    },
    fromTimestamp(timestamp) {
        return dayjs_1.default.utc(timestamp).toDate();
    },
    getDaysLeft(useDateFrom) {
        const currentDate = (0, dayjs_1.default)(exports.DateUtils.formatToYYYYMMDD(exports.DateUtils.getJSTDate()), 'YYYYMMDD');
        const useDate = (0, dayjs_1.default)(exports.DateUtils.formatToYYYYMMDD(useDateFrom), 'YYYYMMDD');
        return useDate.diff(currentDate, 'day');
    },
    addOrSubtractDaysMonthsYears(date, days, months, years) {
        const newDate = new Date(date);
        newDate.setDate(newDate.getDate() + days);
        newDate.setMonth(newDate.getMonth() + (months !== null && months !== void 0 ? months : 0));
        newDate.setFullYear(newDate.getFullYear() + (years !== null && years !== void 0 ? years : 0));
        newDate.setUTCHours(0, 0, 0, 0);
        return newDate;
    },
    isValidDate(value) {
        const YYYYMMDD_REGEX = /^\d{8}$/;
        if (!YYYYMMDD_REGEX.test(value)) {
            return {
                success: false,
                message: 'Invalid date format, expected YYYYMMDD',
            };
        }
        const date = (0, dayjs_1.default)(value, 'YYYYMMDD', true);
        const isValid = date.isValid() && date.format('YYYYMMDD') === value;
        if (!isValid) {
            return {
                success: false,
                message: 'Invalid date(like 20259999), expected valid date',
            };
        }
        return {
            success: true,
            message: 'valid date',
        };
    },
    isValidDateTime(value) {
        const DATETIME_REGEX = /^\d{4}\d{2}\d{2} \d{2}:\d{2}$/;
        if (!DATETIME_REGEX.test(value)) {
            return {
                success: false,
                message: 'Invalid datetime format, expected YYYYMMDD HH:mm',
            };
        }
        const [datePart, timePart] = value.split(' ');
        const isDateValid = exports.DateUtils.isValidDate(datePart).success;
        const [hour, minute] = timePart.split(':').map(Number);
        if (!isDateValid || hour < 0 || hour > 23 || minute < 0 || minute > 59) {
            return {
                success: false,
                message: 'Invalid datetime(like 20259999 99:99), expected valid date',
            };
        }
        return {
            success: true,
            message: 'valid datetime',
        };
    },
    isValidDateTimeWithSeconds(value) {
        const DATETIME_WITH_SECONDS_REGEX = /^\d{4}\d{2}\d{2} \d{2}:\d{2}:\d{2}$/;
        if (!DATETIME_WITH_SECONDS_REGEX.test(value)) {
            return {
                success: false,
                message: 'Invalid datetime format, expected YYYYMMDD HH:mm:ss',
            };
        }
        const dateTimeWithoutSeconds = value.slice(0, -3);
        const baseValidation = exports.DateUtils.isValidDateTime(dateTimeWithoutSeconds);
        if (!baseValidation.success) {
            return baseValidation;
        }
        const seconds = Number(value.slice(-2));
        if (seconds < 0 || seconds > 59) {
            return {
                success: false,
                message: 'Invalid seconds, expected value between 00 and 59',
            };
        }
        return {
            success: true,
            message: 'valid datetime with seconds',
        };
    },
    startOf(date, unit) {
        return dayjs_1.default.utc(date).startOf(unit).toDate();
    },
    endOf(date, unit) {
        return dayjs_1.default.utc(date).endOf(unit).toDate();
    },
};


/***/ }),

/***/ "./libs/core/src/utils/env-utils.ts":
/*!******************************************!*\
  !*** ./libs/core/src/utils/env-utils.ts ***!
  \******************************************/
/***/ ((__unused_webpack_module, exports) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.getEnv = void 0;
const getEnv = ({ key, defaultValue, }) => {
    return process.env[key] || defaultValue || '';
};
exports.getEnv = getEnv;


/***/ }),

/***/ "@aws-sdk/client-s3":
/*!*************************************!*\
  !*** external "@aws-sdk/client-s3" ***!
  \*************************************/
/***/ ((module) => {

module.exports = require("@aws-sdk/client-s3");

/***/ }),

/***/ "@nestjs/axios":
/*!********************************!*\
  !*** external "@nestjs/axios" ***!
  \********************************/
/***/ ((module) => {

module.exports = require("@nestjs/axios");

/***/ }),

/***/ "@nestjs/cache-manager":
/*!****************************************!*\
  !*** external "@nestjs/cache-manager" ***!
  \****************************************/
/***/ ((module) => {

module.exports = require("@nestjs/cache-manager");

/***/ }),

/***/ "@nestjs/common":
/*!*********************************!*\
  !*** external "@nestjs/common" ***!
  \*********************************/
/***/ ((module) => {

module.exports = require("@nestjs/common");

/***/ }),

/***/ "@nestjs/config":
/*!*********************************!*\
  !*** external "@nestjs/config" ***!
  \*********************************/
/***/ ((module) => {

module.exports = require("@nestjs/config");

/***/ }),

/***/ "@nestjs/core":
/*!*******************************!*\
  !*** external "@nestjs/core" ***!
  \*******************************/
/***/ ((module) => {

module.exports = require("@nestjs/core");

/***/ }),

/***/ "@nestjs/swagger":
/*!**********************************!*\
  !*** external "@nestjs/swagger" ***!
  \**********************************/
/***/ ((module) => {

module.exports = require("@nestjs/swagger");

/***/ }),

/***/ "@nestjs/throttler":
/*!************************************!*\
  !*** external "@nestjs/throttler" ***!
  \************************************/
/***/ ((module) => {

module.exports = require("@nestjs/throttler");

/***/ }),

/***/ "@polkadot/api":
/*!********************************!*\
  !*** external "@polkadot/api" ***!
  \********************************/
/***/ ((module) => {

module.exports = require("@polkadot/api");

/***/ }),

/***/ "@polkadot/util":
/*!*********************************!*\
  !*** external "@polkadot/util" ***!
  \*********************************/
/***/ ((module) => {

module.exports = require("@polkadot/util");

/***/ }),

/***/ "@prisma/client":
/*!*********************************!*\
  !*** external "@prisma/client" ***!
  \*********************************/
/***/ ((module) => {

module.exports = require("@prisma/client");

/***/ }),

/***/ "axios":
/*!************************!*\
  !*** external "axios" ***!
  \************************/
/***/ ((module) => {

module.exports = require("axios");

/***/ }),

/***/ "axios-retry":
/*!******************************!*\
  !*** external "axios-retry" ***!
  \******************************/
/***/ ((module) => {

module.exports = require("axios-retry");

/***/ }),

/***/ "body-parser":
/*!******************************!*\
  !*** external "body-parser" ***!
  \******************************/
/***/ ((module) => {

module.exports = require("body-parser");

/***/ }),

/***/ "class-transformer":
/*!************************************!*\
  !*** external "class-transformer" ***!
  \************************************/
/***/ ((module) => {

module.exports = require("class-transformer");

/***/ }),

/***/ "class-validator":
/*!**********************************!*\
  !*** external "class-validator" ***!
  \**********************************/
/***/ ((module) => {

module.exports = require("class-validator");

/***/ }),

/***/ "compression":
/*!******************************!*\
  !*** external "compression" ***!
  \******************************/
/***/ ((module) => {

module.exports = require("compression");

/***/ }),

/***/ "cors":
/*!***********************!*\
  !*** external "cors" ***!
  \***********************/
/***/ ((module) => {

module.exports = require("cors");

/***/ }),

/***/ "dayjs":
/*!************************!*\
  !*** external "dayjs" ***!
  \************************/
/***/ ((module) => {

module.exports = require("dayjs");

/***/ }),

/***/ "dayjs/plugin/timezone":
/*!****************************************!*\
  !*** external "dayjs/plugin/timezone" ***!
  \****************************************/
/***/ ((module) => {

module.exports = require("dayjs/plugin/timezone");

/***/ }),

/***/ "dayjs/plugin/utc":
/*!***********************************!*\
  !*** external "dayjs/plugin/utc" ***!
  \***********************************/
/***/ ((module) => {

module.exports = require("dayjs/plugin/utc");

/***/ }),

/***/ "express":
/*!**************************!*\
  !*** external "express" ***!
  \**************************/
/***/ ((module) => {

module.exports = require("express");

/***/ }),

/***/ "helmet":
/*!*************************!*\
  !*** external "helmet" ***!
  \*************************/
/***/ ((module) => {

module.exports = require("helmet");

/***/ }),

/***/ "jsonwebtoken":
/*!*******************************!*\
  !*** external "jsonwebtoken" ***!
  \*******************************/
/***/ ((module) => {

module.exports = require("jsonwebtoken");

/***/ }),

/***/ "nestjs-zod":
/*!*****************************!*\
  !*** external "nestjs-zod" ***!
  \*****************************/
/***/ ((module) => {

module.exports = require("nestjs-zod");

/***/ }),

/***/ "node:async_hooks":
/*!***********************************!*\
  !*** external "node:async_hooks" ***!
  \***********************************/
/***/ ((module) => {

module.exports = require("node:async_hooks");

/***/ }),

/***/ "node:crypto":
/*!******************************!*\
  !*** external "node:crypto" ***!
  \******************************/
/***/ ((module) => {

module.exports = require("node:crypto");

/***/ }),

/***/ "node:fs":
/*!**************************!*\
  !*** external "node:fs" ***!
  \**************************/
/***/ ((module) => {

module.exports = require("node:fs");

/***/ }),

/***/ "rxjs":
/*!***********************!*\
  !*** external "rxjs" ***!
  \***********************/
/***/ ((module) => {

module.exports = require("rxjs");

/***/ }),

/***/ "rxjs/operators":
/*!*********************************!*\
  !*** external "rxjs/operators" ***!
  \*********************************/
/***/ ((module) => {

module.exports = require("rxjs/operators");

/***/ }),

/***/ "sailscalls":
/*!*****************************!*\
  !*** external "sailscalls" ***!
  \*****************************/
/***/ ((module) => {

module.exports = require("sailscalls");

/***/ }),

/***/ "semver":
/*!*************************!*\
  !*** external "semver" ***!
  \*************************/
/***/ ((module) => {

module.exports = require("semver");

/***/ }),

/***/ "uuid":
/*!***********************!*\
  !*** external "uuid" ***!
  \***********************/
/***/ ((module) => {

module.exports = require("uuid");

/***/ }),

/***/ "winston":
/*!**************************!*\
  !*** external "winston" ***!
  \**************************/
/***/ ((module) => {

module.exports = require("winston");

/***/ }),

/***/ "zod":
/*!**********************!*\
  !*** external "zod" ***!
  \**********************/
/***/ ((module) => {

module.exports = require("zod");

/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
/******/ 	
/******/ 	// startup
/******/ 	// Load entry module and return exports
/******/ 	// This entry module is referenced by other modules so it can't be inlined
/******/ 	var __webpack_exports__ = __webpack_require__("./apps/tourii-onchain/src/main.ts");
/******/ 	
/******/ })()
;