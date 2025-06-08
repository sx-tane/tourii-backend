/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ([
/* 0 */
/***/ (function(module, exports, __webpack_require__) {

/* module decorator */ module = __webpack_require__.nmd(module);

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
const node_fs_1 = __importDefault(__webpack_require__(1));
const core_1 = __webpack_require__(2);
const core_2 = __webpack_require__(67);
const swagger_1 = __webpack_require__(68);
const bodyParser = __importStar(__webpack_require__(69));
const compression_1 = __importDefault(__webpack_require__(70));
const nestjs_zod_1 = __webpack_require__(71);
const tourii_backend_module_1 = __webpack_require__(72);
let app;
async function createApp() {
    if (app) {
        return app;
    }
    app = await core_2.NestFactory.create(tourii_backend_module_1.TouriiBackendModule, {
        logger: new core_1.TouriiCoreLoggingService('debug'),
    });
    app.use((0, compression_1.default)());
    app.use(bodyParser.json({
        limit: '1mb',
    }));
    app.use(bodyParser.urlencoded({
        limit: '1mb',
        extended: true,
    }));
    app.enableCors();
    if ((0, core_1.getEnv)({
        key: 'EXPORT_OPENAPI_JSON',
        defaultValue: 'false',
    }) === 'true') {
        const config = new swagger_1.DocumentBuilder()
            .setTitle('Tourii Backend API')
            .setDescription('Tourii Backend API Def')
            .setVersion('1.0.0')
            .addTag('v1.0.0')
            .build();
        (0, nestjs_zod_1.patchNestJsSwagger)();
        const documentFactory = () => swagger_1.SwaggerModule.createDocument(app, config, {
            autoTagControllers: false,
        });
        if ((0, core_1.getEnv)({ key: 'NODE_ENV', defaultValue: 'dev' }) !== 'production') {
            try {
                node_fs_1.default.writeFileSync('./etc/openapi/openapi.json', JSON.stringify(documentFactory(), null, 2));
            }
            catch (error) {
                console.warn('Could not write OpenAPI JSON file:', error);
            }
        }
        swagger_1.SwaggerModule.setup('api/docs', app, documentFactory);
    }
    await app.init();
    return app;
}
async function bootstrap() {
    const nestApp = await createApp();
    const port = (0, core_1.getEnv)({
        key: 'TOURII_BACKEND_PORT',
        defaultValue: '3000',
    });
    await nestApp.listen(port);
    const logger = new core_1.TouriiCoreLoggingService('bootstrap');
    logger.log(`🚀 Tourii Backend running on port ${port}`);
}
exports["default"] = async (req, res) => {
    const nestApp = await createApp();
    const expressInstance = nestApp.getHttpAdapter().getInstance();
    return expressInstance(req, res);
};
if (__webpack_require__.c[__webpack_require__.s] === module) {
    bootstrap();
}


/***/ }),
/* 1 */
/***/ ((module) => {

module.exports = require("node:fs");

/***/ }),
/* 2 */
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
__exportStar(__webpack_require__(3), exports);
__exportStar(__webpack_require__(5), exports);
__exportStar(__webpack_require__(8), exports);
__exportStar(__webpack_require__(10), exports);
__exportStar(__webpack_require__(15), exports);
__exportStar(__webpack_require__(18), exports);
__exportStar(__webpack_require__(22), exports);
__exportStar(__webpack_require__(28), exports);
__exportStar(__webpack_require__(29), exports);
__exportStar(__webpack_require__(30), exports);
__exportStar(__webpack_require__(32), exports);
__exportStar(__webpack_require__(33), exports);
__exportStar(__webpack_require__(34), exports);
__exportStar(__webpack_require__(35), exports);
__exportStar(__webpack_require__(36), exports);
__exportStar(__webpack_require__(37), exports);
__exportStar(__webpack_require__(38), exports);
__exportStar(__webpack_require__(39), exports);
__exportStar(__webpack_require__(40), exports);
__exportStar(__webpack_require__(41), exports);
__exportStar(__webpack_require__(42), exports);
__exportStar(__webpack_require__(43), exports);
__exportStar(__webpack_require__(44), exports);
__exportStar(__webpack_require__(45), exports);
__exportStar(__webpack_require__(46), exports);
__exportStar(__webpack_require__(47), exports);
__exportStar(__webpack_require__(48), exports);
__exportStar(__webpack_require__(50), exports);
__exportStar(__webpack_require__(51), exports);
__exportStar(__webpack_require__(55), exports);
__exportStar(__webpack_require__(56), exports);
__exportStar(__webpack_require__(58), exports);
__exportStar(__webpack_require__(60), exports);
__exportStar(__webpack_require__(62), exports);
__exportStar(__webpack_require__(64), exports);
__exportStar(__webpack_require__(16), exports);
__exportStar(__webpack_require__(65), exports);
__exportStar(__webpack_require__(20), exports);
__exportStar(__webpack_require__(27), exports);
__exportStar(__webpack_require__(26), exports);
__exportStar(__webpack_require__(6), exports);
__exportStar(__webpack_require__(66), exports);


/***/ }),
/* 3 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.CoreService = void 0;
const common_1 = __webpack_require__(4);
let CoreService = class CoreService {
};
exports.CoreService = CoreService;
exports.CoreService = CoreService = __decorate([
    (0, common_1.Injectable)()
], CoreService);


/***/ }),
/* 4 */
/***/ ((module) => {

module.exports = require("@nestjs/common");

/***/ }),
/* 5 */
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
const tourii_backend_app_exception_1 = __webpack_require__(6);
const cache_manager_1 = __webpack_require__(7);
const common_1 = __webpack_require__(4);
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
    async invalidate(key) {
        try {
            await this.cacheManager.del(key);
            this.logger.log(`Cache invalidated for key: ${key}`);
        }
        catch (error) {
            this.logger.error(`Failed to invalidate cache for key ${key}:`, error);
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
/* 6 */
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.TouriiBackendAppException = exports.ApiAppError = void 0;
const common_1 = __webpack_require__(4);
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
/* 7 */
/***/ ((module) => {

module.exports = require("@nestjs/cache-manager");

/***/ }),
/* 8 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.PrismaService = void 0;
const common_1 = __webpack_require__(4);
const client_1 = __webpack_require__(9);
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
/* 9 */
/***/ ((module) => {

module.exports = require("@prisma/client");

/***/ }),
/* 10 */
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
const axios_1 = __webpack_require__(11);
const common_1 = __webpack_require__(4);
const config_1 = __webpack_require__(12);
const axios_2 = __importDefault(__webpack_require__(13));
const axios_retry_1 = __importDefault(__webpack_require__(14));
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
/* 11 */
/***/ ((module) => {

module.exports = require("@nestjs/axios");

/***/ }),
/* 12 */
/***/ ((module) => {

module.exports = require("@nestjs/config");

/***/ }),
/* 13 */
/***/ ((module) => {

module.exports = require("axios");

/***/ }),
/* 14 */
/***/ ((module) => {

module.exports = require("axios-retry");

/***/ }),
/* 15 */
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
const common_1 = __webpack_require__(4);
const config_1 = __webpack_require__(12);
const context_storage_1 = __webpack_require__(16);
const tourii_core_logging_service_1 = __webpack_require__(18);
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
/* 16 */
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.ContextStorage = void 0;
const node_async_hooks_1 = __webpack_require__(17);
exports.ContextStorage = new node_async_hooks_1.AsyncLocalStorage();


/***/ }),
/* 17 */
/***/ ((module) => {

module.exports = require("node:async_hooks");

/***/ }),
/* 18 */
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
const common_1 = __webpack_require__(4);
const winston = __importStar(__webpack_require__(19));
const context_storage_1 = __webpack_require__(16);
const request_id_1 = __webpack_require__(20);
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
/* 19 */
/***/ ((module) => {

module.exports = require("winston");

/***/ }),
/* 20 */
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.RequestId = void 0;
const uuid_1 = __webpack_require__(21);
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
/* 21 */
/***/ ((module) => {

module.exports = require("uuid");

/***/ }),
/* 22 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.DateUtils = void 0;
const dayjs_1 = __importDefault(__webpack_require__(23));
const timezone_1 = __importDefault(__webpack_require__(24));
const utc_1 = __importDefault(__webpack_require__(25));
const tourii_backend_app_error_type_1 = __webpack_require__(26);
const tourii_backend_app_exception_1 = __webpack_require__(6);
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
/* 23 */
/***/ ((module) => {

module.exports = require("dayjs");

/***/ }),
/* 24 */
/***/ ((module) => {

module.exports = require("dayjs/plugin/timezone");

/***/ }),
/* 25 */
/***/ ((module) => {

module.exports = require("dayjs/plugin/utc");

/***/ }),
/* 26 */
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.TouriiBackendAppErrorType = void 0;
const error_type_1 = __webpack_require__(27);
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
/* 27 */
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
/* 28 */
/***/ ((__unused_webpack_module, exports) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.getEnv = void 0;
const getEnv = ({ key, defaultValue, }) => {
    return process.env[key] || defaultValue || '';
};
exports.getEnv = getEnv;


/***/ }),
/* 29 */
/***/ ((__unused_webpack_module, exports) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));


/***/ }),
/* 30 */
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.ModelRouteEntity = void 0;
const entity_1 = __webpack_require__(31);
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
/* 31 */
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
/* 32 */
/***/ ((__unused_webpack_module, exports) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));


/***/ }),
/* 33 */
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
/* 34 */
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.QuestEntityWithPagination = exports.QuestEntity = void 0;
const entity_1 = __webpack_require__(31);
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
/* 35 */
/***/ ((__unused_webpack_module, exports) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));


/***/ }),
/* 36 */
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
    get questId() {
        return this.props.questId;
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
exports.Task = Task;


/***/ }),
/* 37 */
/***/ ((__unused_webpack_module, exports) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.StoryChapter = void 0;
class StoryChapter {
    constructor(props) {
        this.props = props;
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
/* 38 */
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.StoryEntity = void 0;
const entity_1 = __webpack_require__(31);
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
/* 39 */
/***/ ((__unused_webpack_module, exports) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));


/***/ }),
/* 40 */
/***/ ((__unused_webpack_module, exports) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));


/***/ }),
/* 41 */
/***/ ((__unused_webpack_module, exports) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.isGeoInfoListUndefined = void 0;
const isGeoInfoListUndefined = (geoInfoList) => {
    return !geoInfoList || geoInfoList.length === 0;
};
exports.isGeoInfoListUndefined = isGeoInfoListUndefined;


/***/ }),
/* 42 */
/***/ ((__unused_webpack_module, exports) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));


/***/ }),
/* 43 */
/***/ ((__unused_webpack_module, exports) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.isWeatherResultUndefined = void 0;
const isWeatherResultUndefined = (weatherResult) => {
    return !weatherResult || weatherResult.length === 0;
};
exports.isWeatherResultUndefined = isWeatherResultUndefined;


/***/ }),
/* 44 */
/***/ ((__unused_webpack_module, exports) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));


/***/ }),
/* 45 */
/***/ ((__unused_webpack_module, exports) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));


/***/ }),
/* 46 */
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.UserEntity = void 0;
const entity_1 = __webpack_require__(31);
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
}
exports.UserEntity = UserEntity;


/***/ }),
/* 47 */
/***/ ((__unused_webpack_module, exports) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));


/***/ }),
/* 48 */
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
const caching_service_1 = __webpack_require__(5);
const tourii_backend_http_service_1 = __webpack_require__(10);
const tourii_backend_app_error_type_1 = __webpack_require__(26);
const tourii_backend_app_exception_1 = __webpack_require__(6);
const common_1 = __webpack_require__(4);
const config_1 = __webpack_require__(12);
const rxjs_1 = __webpack_require__(49);
const GEO_DATA_RAW_CACHE_KEY_PREFIX = 'geo_data_raw';
const CACHE_TTL_SECONDS = 3600 * 24;
let GeoInfoRepositoryApi = class GeoInfoRepositoryApi {
    constructor(touriiHttpService, configService, cachingService) {
        this.touriiHttpService = touriiHttpService;
        this.configService = configService;
        this.cachingService = cachingService;
    }
    async fetchSingleGeoInfoWithCache(name, apiKey) {
        const cacheKey = `${GEO_DATA_RAW_CACHE_KEY_PREFIX}:${encodeURIComponent(name)}`;
        const fetchDataFn = async () => {
            var _a, _b, _c, _d;
            const encodedName = encodeURIComponent(name);
            const apiUrl = `https://maps.googleapis.com/maps/api/geocode/json?address=${encodedName}&key=${apiKey}`;
            try {
                const response = await (0, rxjs_1.firstValueFrom)(this.touriiHttpService.getTouriiBackendHttpService.get(apiUrl, {}));
                if (response.status === 200 && ((_b = (_a = response.data) === null || _a === void 0 ? void 0 : _a.results) === null || _b === void 0 ? void 0 : _b.length) > 0) {
                    const firstResult = response.data.results[0];
                    const location = (_c = firstResult.geometry) === null || _c === void 0 ? void 0 : _c.location;
                    const formattedAddress = firstResult.formatted_address;
                    if ((location === null || location === void 0 ? void 0 : location.lat) && (location === null || location === void 0 ? void 0 : location.lng) && formattedAddress) {
                        return {
                            latitude: location.lat,
                            longitude: location.lng,
                            formattedAddress: formattedAddress,
                        };
                    }
                    common_1.Logger.warn(`Missing location or formattedAddress in Google Geocoding API response for ${name}: ${JSON.stringify(firstResult)}`);
                    throw new tourii_backend_app_exception_1.TouriiBackendAppException(tourii_backend_app_error_type_1.TouriiBackendAppErrorType.E_GEO_004);
                }
                const googleApiStatus = (_d = response.data) === null || _d === void 0 ? void 0 : _d.status;
                if (googleApiStatus === 'ZERO_RESULTS') {
                    common_1.Logger.warn(`Google Geocoding API returned ZERO_RESULTS for: ${name}`);
                    throw new tourii_backend_app_exception_1.TouriiBackendAppException(tourii_backend_app_error_type_1.TouriiBackendAppErrorType.E_GEO_001);
                }
                if (googleApiStatus === 'REQUEST_DENIED') {
                    common_1.Logger.error(`Google Geocoding API request denied for ${name}. Check API key and permissions. Data: ${JSON.stringify(response.data)}`);
                    throw new tourii_backend_app_exception_1.TouriiBackendAppException(tourii_backend_app_error_type_1.TouriiBackendAppErrorType.E_GEO_002);
                }
                if (googleApiStatus === 'OVER_QUERY_LIMIT') {
                    common_1.Logger.error(`Google Geocoding API OVER_QUERY_LIMIT for ${name}. Data: ${JSON.stringify(response.data)}`);
                    throw new tourii_backend_app_exception_1.TouriiBackendAppException(tourii_backend_app_error_type_1.TouriiBackendAppErrorType.E_GEO_003);
                }
                common_1.Logger.warn(`Unexpected response from Google Geocoding API for ${name}: Status ${response.status}, Google Status: ${googleApiStatus}, Data: ${JSON.stringify(response.data)}`);
                throw new tourii_backend_app_exception_1.TouriiBackendAppException(tourii_backend_app_error_type_1.TouriiBackendAppErrorType.E_GEO_004);
            }
            catch (error) {
                common_1.Logger.error(`Failed to fetch geocoding info for ${name}: ${error instanceof Error ? error.message : String(error)}`, error instanceof Error ? error.stack : undefined);
                if (error instanceof tourii_backend_app_exception_1.TouriiBackendAppException) {
                    throw error;
                }
                throw new tourii_backend_app_exception_1.TouriiBackendAppException(tourii_backend_app_error_type_1.TouriiBackendAppErrorType.E_GEO_004);
            }
        };
        try {
            const cachedData = await this.cachingService.getOrSet(cacheKey, fetchDataFn, CACHE_TTL_SECONDS);
            if (cachedData === null) {
                common_1.Logger.error(`Geo data for ${name} resolved to null from cache/fetch function, which was not expected.`);
                throw new tourii_backend_app_exception_1.TouriiBackendAppException(tourii_backend_app_error_type_1.TouriiBackendAppErrorType.E_GEO_004);
            }
            return cachedData;
        }
        catch (error) {
            common_1.Logger.error(`CachingService or fetchDataFn failed for geo data for ${name}: ${error instanceof Error ? error.message : String(error)}`, error instanceof Error ? error.stack : undefined);
            if (error instanceof tourii_backend_app_exception_1.TouriiBackendAppException) {
                throw error;
            }
            throw new tourii_backend_app_exception_1.TouriiBackendAppException(tourii_backend_app_error_type_1.TouriiBackendAppErrorType.E_TB_000);
        }
    }
    async getGeoLocationInfoByTouristSpotNameList(touristSpotNameList) {
        const apiKey = this.configService.get('GOOGLE_MAPS_API_KEY');
        if (!apiKey) {
            common_1.Logger.error('GOOGLE_MAPS_API_KEY is not configured.');
            throw new tourii_backend_app_exception_1.TouriiBackendAppException(tourii_backend_app_error_type_1.TouriiBackendAppErrorType.E_GEO_005);
        }
        try {
            const geoInfoPromises = touristSpotNameList.map(async (name) => {
                const rawData = await this.fetchSingleGeoInfoWithCache(name, apiKey);
                return Object.assign(Object.assign({}, rawData), { touristSpotName: name });
            });
            return await Promise.all(geoInfoPromises);
        }
        catch (error) {
            common_1.Logger.error(`One or more geo fetches failed for tourist spot list: ${error instanceof Error ? error.message : String(error)}`, error instanceof Error ? error.stack : undefined);
            if (error instanceof tourii_backend_app_exception_1.TouriiBackendAppException) {
                throw error;
            }
            throw new tourii_backend_app_exception_1.TouriiBackendAppException(tourii_backend_app_error_type_1.TouriiBackendAppErrorType.E_GEO_004);
        }
    }
    async getRegionInfoByRegionName(regionName) {
        const apiKey = this.configService.get('GOOGLE_MAPS_API_KEY');
        if (!apiKey) {
            common_1.Logger.error('GOOGLE_MAPS_API_KEY is not configured.');
            throw new tourii_backend_app_exception_1.TouriiBackendAppException(tourii_backend_app_error_type_1.TouriiBackendAppErrorType.E_GEO_005);
        }
        const rawData = await this.fetchSingleGeoInfoWithCache(regionName, apiKey);
        return Object.assign(Object.assign({}, rawData), { touristSpotName: regionName });
    }
};
exports.GeoInfoRepositoryApi = GeoInfoRepositoryApi;
exports.GeoInfoRepositoryApi = GeoInfoRepositoryApi = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [typeof (_a = typeof tourii_backend_http_service_1.TouriiBackendHttpService !== "undefined" && tourii_backend_http_service_1.TouriiBackendHttpService) === "function" ? _a : Object, typeof (_b = typeof config_1.ConfigService !== "undefined" && config_1.ConfigService) === "function" ? _b : Object, typeof (_c = typeof caching_service_1.CachingService !== "undefined" && caching_service_1.CachingService) === "function" ? _c : Object])
], GeoInfoRepositoryApi);


/***/ }),
/* 49 */
/***/ ((module) => {

module.exports = require("rxjs");

/***/ }),
/* 50 */
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
const caching_service_1 = __webpack_require__(5);
const tourii_backend_http_service_1 = __webpack_require__(10);
const tourii_backend_app_error_type_1 = __webpack_require__(26);
const tourii_backend_app_exception_1 = __webpack_require__(6);
const common_1 = __webpack_require__(4);
const config_1 = __webpack_require__(12);
const rxjs_1 = __webpack_require__(49);
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
/* 51 */
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
const crypto = __importStar(__webpack_require__(52));
const common_1 = __webpack_require__(4);
const config_1 = __webpack_require__(12);
const api_1 = __webpack_require__(53);
const util_1 = __webpack_require__(54);
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
/* 52 */
/***/ ((module) => {

module.exports = require("node:crypto");

/***/ }),
/* 53 */
/***/ ((module) => {

module.exports = require("@polkadot/api");

/***/ }),
/* 54 */
/***/ ((module) => {

module.exports = require("@polkadot/util");

/***/ }),
/* 55 */
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
const node_crypto_1 = __webpack_require__(52);
const common_1 = __webpack_require__(4);
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
/* 56 */
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
const caching_service_1 = __webpack_require__(5);
const prisma_service_1 = __webpack_require__(8);
const tourii_backend_app_error_type_1 = __webpack_require__(26);
const tourii_backend_app_exception_1 = __webpack_require__(6);
const common_1 = __webpack_require__(4);
const model_route_mapper_1 = __webpack_require__(57);
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
        this.logger.debug(`Invalidating cache for new model route: ${createdModelRouteEntity.modelRouteId}`);
        if (createdModelRouteEntity.modelRouteId) {
            await this.cachingService.invalidate(`${_MODEL_ROUTE_RAW_CACHE_KEY_PREFIX}:${createdModelRouteEntity.modelRouteId}`);
        }
        await this.cachingService.invalidate(_MODEL_ROUTES_ALL_LIST_CACHE_KEY);
        return createdModelRouteEntity;
    }
    async createTouristSpot(touristSpot, modelRouteId) {
        const createdTouristSpotData = await this.prisma.tourist_spot.create({
            data: model_route_mapper_1.ModelRouteMapper.touristSpotOnlyEntityToPrismaInput(touristSpot, modelRouteId),
        });
        const createdTouristSpotEntity = model_route_mapper_1.ModelRouteMapper.touristSpotToEntity([
            createdTouristSpotData,
        ])[0];
        this.logger.debug(`Invalidating cache for model route ${modelRouteId} due to new tourist spot.`);
        await this.cachingService.invalidate(`${_MODEL_ROUTE_RAW_CACHE_KEY_PREFIX}:${modelRouteId}`);
        await this.cachingService.invalidate(_MODEL_ROUTES_ALL_LIST_CACHE_KEY);
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
        await this.cachingService.invalidate(`${_MODEL_ROUTE_RAW_CACHE_KEY_PREFIX}:${modelRoute.modelRouteId}`);
        await this.cachingService.invalidate(_MODEL_ROUTES_ALL_LIST_CACHE_KEY);
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
        await this.cachingService.invalidate(`${_MODEL_ROUTE_RAW_CACHE_KEY_PREFIX}:${updated.model_route_id}`);
        await this.cachingService.invalidate(_MODEL_ROUTES_ALL_LIST_CACHE_KEY);
        return model_route_mapper_1.ModelRouteMapper.touristSpotToEntity([updated])[0];
    }
    async getModelRouteByModelRouteId(modelRouteId) {
        const cacheKey = `${_MODEL_ROUTE_RAW_CACHE_KEY_PREFIX}:${modelRouteId}`;
        const fetchDataFn = async () => {
            this.logger.debug(`getModelRouteByModelRouteId: Cache miss for ${cacheKey}, fetching raw data from DB.`);
            const modelRoutePrisma = await this.prisma.model_route.findUnique({
                where: { model_route_id: modelRouteId },
                include: {
                    tourist_spot: true,
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
                    tourist_spot: true,
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
};
exports.ModelRouteRepositoryDb = ModelRouteRepositoryDb;
exports.ModelRouteRepositoryDb = ModelRouteRepositoryDb = ModelRouteRepositoryDb_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [typeof (_a = typeof prisma_service_1.PrismaService !== "undefined" && prisma_service_1.PrismaService) === "function" ? _a : Object, typeof (_b = typeof caching_service_1.CachingService !== "undefined" && caching_service_1.CachingService) === "function" ? _b : Object])
], ModelRouteRepositoryDb);


/***/ }),
/* 57 */
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.ModelRouteMapper = void 0;
const model_route_entity_1 = __webpack_require__(30);
const tourist_spot_1 = __webpack_require__(33);
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
        var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k;
        return {
            story_id: (_a = modelRouteEntity.storyId) !== null && _a !== void 0 ? _a : '',
            route_name: (_b = modelRouteEntity.routeName) !== null && _b !== void 0 ? _b : '',
            region: (_c = modelRouteEntity.region) !== null && _c !== void 0 ? _c : '',
            region_desc: (_d = modelRouteEntity.regionDesc) !== null && _d !== void 0 ? _d : null,
            region_latitude: (_e = modelRouteEntity.regionLatitude) !== null && _e !== void 0 ? _e : 0,
            region_longitude: (_f = modelRouteEntity.regionLongitude) !== null && _f !== void 0 ? _f : 0,
            region_background_media: (_g = modelRouteEntity.regionBackgroundMedia) !== null && _g !== void 0 ? _g : null,
            recommendation: (_h = modelRouteEntity.recommendation) !== null && _h !== void 0 ? _h : [],
            del_flag: (_j = modelRouteEntity.delFlag) !== null && _j !== void 0 ? _j : false,
            upd_user_id: modelRouteEntity.updUserId,
            upd_date_time: modelRouteEntity.updDateTime,
            request_id: (_k = modelRouteEntity.requestId) !== null && _k !== void 0 ? _k : null,
        };
    }
    static touristSpotEntityToPrismaUpdateInput(touristSpotEntity) {
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
            upd_user_id: touristSpotEntity.updUserId,
            upd_date_time: touristSpotEntity.updDateTime,
            request_id: (_m = touristSpotEntity.requestId) !== null && _m !== void 0 ? _m : null,
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
/* 58 */
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
const quest_entity_1 = __webpack_require__(34);
const caching_service_1 = __webpack_require__(5);
const prisma_service_1 = __webpack_require__(8);
const tourii_backend_app_error_type_1 = __webpack_require__(26);
const tourii_backend_app_exception_1 = __webpack_require__(6);
const common_1 = __webpack_require__(4);
const quest_mapper_1 = __webpack_require__(59);
const CACHE_TTL_SECONDS = 3600;
let QuestRepositoryDb = QuestRepositoryDb_1 = class QuestRepositoryDb {
    constructor(prisma, cachingService) {
        this.prisma = prisma;
        this.cachingService = cachingService;
        this.logger = new common_1.Logger(QuestRepositoryDb_1.name);
    }
    async fetchQuestsWithPagination(page, limit, isPremium, isUnlocked, questType) {
        const cacheKey = `quests:${page}:${limit}:${isPremium !== null && isPremium !== void 0 ? isPremium : 'null'}:${isUnlocked !== null && isUnlocked !== void 0 ? isUnlocked : 'null'}:${questType !== null && questType !== void 0 ? questType : 'null'}`;
        const fetchDatafn = async () => {
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
        const cachedData = await this.cachingService.getOrSet(cacheKey, fetchDatafn, CACHE_TTL_SECONDS);
        if (!cachedData) {
            this.logger.warn(`No quests found for key: ${cacheKey}`);
            return quest_entity_1.QuestEntityWithPagination.default();
        }
        const questsEntities = cachedData.quests.map((quest) => quest_mapper_1.QuestMapper.prismaModelToQuestEntity(quest));
        const result = new quest_entity_1.QuestEntityWithPagination(questsEntities, cachedData.total, page, limit);
        return result;
    }
    async fetchQuestById(questId) {
        const questDb = (await this.prisma.quest.findUnique({
            where: { quest_id: questId },
            include: {
                quest_task: true,
                tourist_spot: true,
            },
        }));
        if (!questDb) {
            throw new tourii_backend_app_exception_1.TouriiBackendAppException(tourii_backend_app_error_type_1.TouriiBackendAppErrorType.E_TB_023);
        }
        return quest_mapper_1.QuestMapper.prismaModelToQuestEntity(questDb);
    }
    async createQuest(quest) {
        const created = (await this.prisma.quest.create({
            data: quest_mapper_1.QuestMapper.questEntityToPrismaInput(quest),
            include: { quest_task: true, tourist_spot: true },
        }));
        await this.cachingService.invalidate('quests:*');
        return quest_mapper_1.QuestMapper.prismaModelToQuestEntity(created);
    }
    async createQuestTask(task) {
        const created = await this.prisma.quest_task.create({
            data: quest_mapper_1.QuestMapper.taskEntityToPrismaInput(task),
        });
        await this.cachingService.invalidate('quests:*');
        return quest_mapper_1.QuestMapper.prismaTaskModelToTaskEntity(created);
    }
    async updateQuest(quest) {
        const updated = (await this.prisma.quest.update({
            where: { quest_id: quest.questId },
            data: quest_mapper_1.QuestMapper.questEntityToPrismaUpdateInput(quest),
            include: { quest_task: true, tourist_spot: true },
        }));
        await this.cachingService.invalidate('quests:*');
        return quest_mapper_1.QuestMapper.prismaModelToQuestEntity(updated);
    }
    async updateQuestTask(task) {
        const updated = await this.prisma.quest_task.update({
            where: { quest_task_id: task.taskId },
            data: quest_mapper_1.QuestMapper.taskEntityToPrismaUpdateInput(task),
        });
        return quest_mapper_1.QuestMapper.prismaTaskModelToTaskEntity(updated);
    }
};
exports.QuestRepositoryDb = QuestRepositoryDb;
exports.QuestRepositoryDb = QuestRepositoryDb = QuestRepositoryDb_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [typeof (_a = typeof prisma_service_1.PrismaService !== "undefined" && prisma_service_1.PrismaService) === "function" ? _a : Object, typeof (_b = typeof caching_service_1.CachingService !== "undefined" && caching_service_1.CachingService) === "function" ? _b : Object])
], QuestRepositoryDb);


/***/ }),
/* 59 */
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.QuestMapper = void 0;
const quest_entity_1 = __webpack_require__(34);
const task_1 = __webpack_require__(36);
const model_route_mapper_1 = __webpack_require__(57);
class QuestMapper {
    static prismaModelToQuestEntity(prismaModel) {
        var _a, _b, _c, _d, _e, _f;
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
            tasks: (_f = (_e = prismaModel.quest_task) === null || _e === void 0 ? void 0 : _e.map((task) => {
                var _a;
                return new task_1.Task({
                    taskId: task.quest_task_id,
                    questId: task.quest_id,
                    taskTheme: task.task_theme,
                    taskType: task.task_type,
                    taskName: task.task_name,
                    taskDesc: task.task_desc,
                    isUnlocked: task.is_unlocked,
                    requiredAction: task.required_action,
                    groupActivityMembers: task.group_activity_members,
                    selectOptions: task.select_options,
                    antiCheatRules: task.anti_cheat_rules,
                    magatamaPointAwarded: task.magatama_point_awarded,
                    totalMagatamaPointAwarded: task.total_magatama_point_awarded,
                    delFlag: task.del_flag,
                    insUserId: task.ins_user_id,
                    insDateTime: task.ins_date_time,
                    updUserId: task.upd_user_id,
                    updDateTime: task.upd_date_time,
                    requestId: (_a = task.request_id) !== null && _a !== void 0 ? _a : undefined,
                });
            })) !== null && _f !== void 0 ? _f : [],
            touristSpot: prismaModel.tourist_spot
                ? model_route_mapper_1.ModelRouteMapper.prismaModelToTouristSpotEntity(prismaModel.tourist_spot)
                : undefined,
        }, prismaModel.quest_id);
    }
    static prismaTaskModelToTaskEntity(prismaModel) {
        var _a;
        return new task_1.Task({
            taskId: prismaModel.quest_task_id,
            questId: prismaModel.quest_id,
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
            totalMagatamaPointAwarded: prismaModel.total_magatama_point_awarded,
            delFlag: prismaModel.del_flag,
            insUserId: prismaModel.ins_user_id,
            insDateTime: prismaModel.ins_date_time,
            updUserId: prismaModel.upd_user_id,
            updDateTime: prismaModel.upd_date_time,
            requestId: (_a = prismaModel.request_id) !== null && _a !== void 0 ? _a : undefined,
        });
    }
    static questEntityToPrismaInput(questEntity) {
        var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m, _o;
        return {
            tourist_spot_id: (_b = (_a = questEntity.touristSpot) === null || _a === void 0 ? void 0 : _a.touristSpotId) !== null && _b !== void 0 ? _b : '',
            quest_name: (_c = questEntity.questName) !== null && _c !== void 0 ? _c : '',
            quest_desc: (_d = questEntity.questDesc) !== null && _d !== void 0 ? _d : '',
            quest_image: (_e = questEntity.questImage) !== null && _e !== void 0 ? _e : null,
            quest_type: (_f = questEntity.questType) !== null && _f !== void 0 ? _f : undefined,
            is_unlocked: (_g = questEntity.isUnlocked) !== null && _g !== void 0 ? _g : false,
            is_premium: (_h = questEntity.isPremium) !== null && _h !== void 0 ? _h : false,
            total_magatama_point_awarded: (_j = questEntity.totalMagatamaPointAwarded) !== null && _j !== void 0 ? _j : 0,
            reward_type: (_k = questEntity.rewardType) !== null && _k !== void 0 ? _k : undefined,
            del_flag: (_l = questEntity.delFlag) !== null && _l !== void 0 ? _l : false,
            ins_user_id: questEntity.insUserId,
            ins_date_time: questEntity.insDateTime,
            upd_user_id: questEntity.updUserId,
            upd_date_time: questEntity.updDateTime,
            request_id: (_m = questEntity.requestId) !== null && _m !== void 0 ? _m : null,
            quest_task: {
                create: (_o = questEntity.tasks) === null || _o === void 0 ? void 0 : _o.map((task) => QuestMapper.taskEntityToPrismaInput(task)),
            },
        };
    }
    static taskEntityToPrismaInput(task) {
        var _a, _b, _c;
        return {
            quest_id: task.questId,
            task_theme: task.taskTheme,
            task_type: task.taskType,
            task_name: task.taskName,
            task_desc: task.taskDesc,
            is_unlocked: task.isUnlocked,
            required_action: task.requiredAction,
            group_activity_members: (_a = task.groupActivityMembers) !== null && _a !== void 0 ? _a : [],
            select_options: (_b = task.selectOptions) !== null && _b !== void 0 ? _b : [],
            anti_cheat_rules: task.antiCheatRules,
            magatama_point_awarded: task.magatamaPointAwarded,
            total_magatama_point_awarded: task.totalMagatamaPointAwarded,
            del_flag: task.delFlag,
            ins_user_id: task.insUserId,
            ins_date_time: task.insDateTime,
            upd_user_id: task.updUserId,
            upd_date_time: task.updDateTime,
            request_id: (_c = task.requestId) !== null && _c !== void 0 ? _c : null,
        };
    }
    static questEntityToPrismaUpdateInput(questEntity) {
        var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l;
        return {
            tourist_spot_id: (_b = (_a = questEntity.touristSpot) === null || _a === void 0 ? void 0 : _a.touristSpotId) !== null && _b !== void 0 ? _b : undefined,
            quest_name: (_c = questEntity.questName) !== null && _c !== void 0 ? _c : '',
            quest_desc: (_d = questEntity.questDesc) !== null && _d !== void 0 ? _d : '',
            quest_image: (_e = questEntity.questImage) !== null && _e !== void 0 ? _e : null,
            quest_type: (_f = questEntity.questType) !== null && _f !== void 0 ? _f : undefined,
            is_unlocked: (_g = questEntity.isUnlocked) !== null && _g !== void 0 ? _g : false,
            is_premium: (_h = questEntity.isPremium) !== null && _h !== void 0 ? _h : false,
            total_magatama_point_awarded: (_j = questEntity.totalMagatamaPointAwarded) !== null && _j !== void 0 ? _j : 0,
            reward_type: (_k = questEntity.rewardType) !== null && _k !== void 0 ? _k : undefined,
            del_flag: (_l = questEntity.delFlag) !== null && _l !== void 0 ? _l : false,
            upd_user_id: questEntity.updUserId,
            upd_date_time: questEntity.updDateTime,
        };
    }
    static taskEntityToPrismaUpdateInput(task) {
        var _a, _b;
        return {
            quest_id: task.questId,
            task_theme: task.taskTheme,
            task_type: task.taskType,
            task_name: task.taskName,
            task_desc: task.taskDesc,
            is_unlocked: task.isUnlocked,
            required_action: task.requiredAction,
            group_activity_members: (_a = task.groupActivityMembers) !== null && _a !== void 0 ? _a : [],
            select_options: (_b = task.selectOptions) !== null && _b !== void 0 ? _b : [],
            anti_cheat_rules: task.antiCheatRules,
            magatama_point_awarded: task.magatamaPointAwarded,
            total_magatama_point_awarded: task.totalMagatamaPointAwarded,
            del_flag: task.delFlag,
            upd_user_id: task.updUserId,
            upd_date_time: task.updDateTime,
        };
    }
}
exports.QuestMapper = QuestMapper;


/***/ }),
/* 60 */
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
const caching_service_1 = __webpack_require__(5);
const prisma_service_1 = __webpack_require__(8);
const context_storage_1 = __webpack_require__(16);
const tourii_backend_app_error_type_1 = __webpack_require__(26);
const tourii_backend_app_exception_1 = __webpack_require__(6);
const common_1 = __webpack_require__(4);
const story_mapper_1 = __webpack_require__(61);
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
        await this.cachingService.invalidate(ALL_STORIES_CACHE_KEY);
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
        await this.cachingService.invalidate(ALL_STORIES_CACHE_KEY);
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
};
exports.StoryRepositoryDb = StoryRepositoryDb;
exports.StoryRepositoryDb = StoryRepositoryDb = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [typeof (_a = typeof prisma_service_1.PrismaService !== "undefined" && prisma_service_1.PrismaService) === "function" ? _a : Object, typeof (_b = typeof caching_service_1.CachingService !== "undefined" && caching_service_1.CachingService) === "function" ? _b : Object])
], StoryRepositoryDb);


/***/ }),
/* 61 */
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.StoryMapper = void 0;
const chapter_story_1 = __webpack_require__(37);
const story_entity_1 = __webpack_require__(38);
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
/* 62 */
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
const prisma_service_1 = __webpack_require__(8);
const common_1 = __webpack_require__(4);
const user_mapper_1 = __webpack_require__(63);
let UserRepositoryDb = class UserRepositoryDb {
    constructor(prisma) {
        this.prisma = prisma;
    }
    async createUser(user) {
        const createdUser = await this.prisma.user.create({
            data: user_mapper_1.UserMapper.userEntityToPrismaInput(user),
        });
        return user_mapper_1.UserMapper.prismaModelToUserEntity(createdUser);
    }
    async getUserInfoByUserId(userId) {
        const user = await this.prisma.user.findFirst({
            where: {
                user_id: userId,
            },
        });
        return user ? user_mapper_1.UserMapper.prismaModelToUserEntity(user) : undefined;
    }
    async getUserByUsername(username) {
        const user = await this.prisma.user.findFirst({
            where: {
                username,
            },
        });
        return user ? user_mapper_1.UserMapper.prismaModelToUserEntity(user) : undefined;
    }
    async getUserByPassportWallet(walletAddress) {
        const user = await this.prisma.user.findFirst({
            where: {
                passport_wallet_address: walletAddress,
            },
        });
        return user ? user_mapper_1.UserMapper.prismaModelToUserEntity(user) : undefined;
    }
    async getUserByDiscordId(discordId) {
        const user = await this.prisma.user.findFirst({
            where: {
                discord_id: discordId,
            },
        });
        return user ? user_mapper_1.UserMapper.prismaModelToUserEntity(user) : undefined;
    }
    async getUserByGoogleEmail(googleEmail) {
        const user = await this.prisma.user.findFirst({
            where: {
                google_email: googleEmail,
            },
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
/* 63 */
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.UserMapper = void 0;
const user_entity_1 = __webpack_require__(46);
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
        }, prismaModel.user_id);
    }
}
exports.UserMapper = UserMapper;


/***/ }),
/* 64 */
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
const prisma_service_1 = __webpack_require__(8);
const context_storage_1 = __webpack_require__(16);
const tourii_backend_app_error_type_1 = __webpack_require__(26);
const tourii_backend_app_exception_1 = __webpack_require__(6);
const common_1 = __webpack_require__(4);
const client_1 = __webpack_require__(9);
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
};
exports.UserStoryLogRepositoryDb = UserStoryLogRepositoryDb;
exports.UserStoryLogRepositoryDb = UserStoryLogRepositoryDb = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [typeof (_a = typeof prisma_service_1.PrismaService !== "undefined" && prisma_service_1.PrismaService) === "function" ? _a : Object])
], UserStoryLogRepositoryDb);


/***/ }),
/* 65 */
/***/ ((__unused_webpack_module, exports) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));


/***/ }),
/* 66 */
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.TransformDate = void 0;
const date_utils_1 = __webpack_require__(22);
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
/* 67 */
/***/ ((module) => {

module.exports = require("@nestjs/core");

/***/ }),
/* 68 */
/***/ ((module) => {

module.exports = require("@nestjs/swagger");

/***/ }),
/* 69 */
/***/ ((module) => {

module.exports = require("body-parser");

/***/ }),
/* 70 */
/***/ ((module) => {

module.exports = require("compression");

/***/ }),
/* 71 */
/***/ ((module) => {

module.exports = require("nestjs-zod");

/***/ }),
/* 72 */
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
exports.TouriiBackendModule = void 0;
const geo_info_repository_api_1 = __webpack_require__(48);
const weather_info_repository_api_1 = __webpack_require__(50);
const location_info_repository_api_1 = __webpack_require__(73);
const encryption_repository_auth_1 = __webpack_require__(51);
const digital_passport_repository_fake_1 = __webpack_require__(55);
const model_route_repository_db_1 = __webpack_require__(56);
const quest_repository_db_1 = __webpack_require__(58);
const story_repository_db_1 = __webpack_require__(60);
const user_repository_db_1 = __webpack_require__(62);
const user_story_log_repository_db_1 = __webpack_require__(64);
const group_quest_repository_db_1 = __webpack_require__(74);
const caching_service_1 = __webpack_require__(5);
const prisma_service_1 = __webpack_require__(8);
const tourii_backend_http_service_1 = __webpack_require__(10);
const tourii_backend_logging_service_1 = __webpack_require__(15);
const env_utils_1 = __webpack_require__(28);
const axios_1 = __webpack_require__(11);
const cache_manager_1 = __webpack_require__(7);
const common_1 = __webpack_require__(4);
const config_1 = __webpack_require__(12);
const core_1 = __webpack_require__(67);
const throttler_1 = __webpack_require__(75);
const cache_manager_redis_store_1 = __webpack_require__(76);
const nestjs_zod_1 = __webpack_require__(71);
const test_controller_1 = __webpack_require__(77);
const tourii_backend_controller_1 = __webpack_require__(78);
const tourii_backend_service_1 = __webpack_require__(79);
const tourii_backend_context_provider_1 = __webpack_require__(128);
const security_middleware_1 = __webpack_require__(129);
const tourii_backend_api_middleware_1 = __webpack_require__(133);
const tourii_backend_constant_1 = __webpack_require__(86);
const group_quest_gateway_1 = __webpack_require__(83);
let TouriiBackendModule = class TouriiBackendModule {
    constructor(refHost) {
        this.refHost = refHost;
    }
    configure(consumer) {
        consumer
            .apply(security_middleware_1.SecurityMiddleware)
            .forRoutes('*')
            .apply(tourii_backend_api_middleware_1.TouriiBackendApiMiddleware)
            .forRoutes('*');
    }
};
exports.TouriiBackendModule = TouriiBackendModule;
exports.TouriiBackendModule = TouriiBackendModule = __decorate([
    (0, common_1.Module)({
        imports: [
            axios_1.HttpModule,
            config_1.ConfigModule.forRoot({
                isGlobal: true,
                envFilePath: `.env.${(0, env_utils_1.getEnv)({ key: 'NODE_ENV', defaultValue: '' })}`,
            }),
            throttler_1.ThrottlerModule.forRootAsync({
                imports: [config_1.ConfigModule],
                inject: [config_1.ConfigService],
                useFactory: (config) => {
                    var _a, _b;
                    return ({
                        throttlers: [
                            {
                                ttl: (_a = config.get('THROTTLE_TTL')) !== null && _a !== void 0 ? _a : 1000,
                                limit: (_b = config.get('THROTTLE_LIMIT')) !== null && _b !== void 0 ? _b : 3,
                            },
                        ],
                        storage: new throttler_1.ThrottlerStorageService(),
                    });
                },
            }),
            cache_manager_1.CacheModule.registerAsync({
                imports: [config_1.ConfigModule],
                inject: [config_1.ConfigService],
                useFactory: async (configService) => ({
                    store: cache_manager_redis_store_1.redisStore,
                    host: configService.get('REDIS_HOST', 'localhost'),
                    port: configService.get('REDIS_PORT', 6379),
                    ttl: configService.get('CACHE_TTL', 3600),
                }),
                isGlobal: true,
            }),
        ],
        controllers: [tourii_backend_controller_1.TouriiBackendController, test_controller_1.TestController],
        providers: [
            common_1.Logger,
            config_1.ConfigService,
            prisma_service_1.PrismaService,
            tourii_backend_logging_service_1.TouriiBackendLoggingService,
            tourii_backend_service_1.TouriiBackendService,
            tourii_backend_http_service_1.TouriiBackendHttpService,
            group_quest_gateway_1.GroupQuestGateway,
            {
                provide: tourii_backend_constant_1.TouriiBackendConstants.USER_STORY_LOG_REPOSITORY_TOKEN,
                useClass: user_story_log_repository_db_1.UserStoryLogRepositoryDb,
            },
            {
                provide: tourii_backend_constant_1.TouriiBackendConstants.GROUP_QUEST_REPOSITORY_TOKEN,
                useClass: group_quest_repository_db_1.GroupQuestRepositoryDb,
            },
            core_1.HttpAdapterHost,
            caching_service_1.CachingService,
            {
                provide: tourii_backend_constant_1.TouriiBackendConstants.CONTEXT_PROVIDER_TOKEN,
                useClass: tourii_backend_context_provider_1.TouriiBackendContextProvider,
            },
            {
                provide: tourii_backend_constant_1.TouriiBackendConstants.DIGITAL_PASSPORT_REPOSITORY_TOKEN,
                useClass: digital_passport_repository_fake_1.DigitalPassportRepositoryFake,
            },
            {
                provide: tourii_backend_constant_1.TouriiBackendConstants.USER_REPOSITORY_TOKEN,
                useClass: user_repository_db_1.UserRepositoryDb,
            },
            {
                provide: tourii_backend_constant_1.TouriiBackendConstants.STORY_REPOSITORY_TOKEN,
                useClass: story_repository_db_1.StoryRepositoryDb,
            },
            {
                provide: tourii_backend_constant_1.TouriiBackendConstants.MODEL_ROUTE_REPOSITORY_TOKEN,
                useClass: model_route_repository_db_1.ModelRouteRepositoryDb,
            },
            {
                provide: tourii_backend_constant_1.TouriiBackendConstants.QUEST_REPOSITORY_TOKEN,
                useClass: quest_repository_db_1.QuestRepositoryDb,
            },
            {
                provide: tourii_backend_constant_1.TouriiBackendConstants.GEO_INFO_REPOSITORY_TOKEN,
                useClass: geo_info_repository_api_1.GeoInfoRepositoryApi,
            },
            {
                provide: tourii_backend_constant_1.TouriiBackendConstants.WEATHER_INFO_REPOSITORY_TOKEN,
                useClass: weather_info_repository_api_1.WeatherInfoRepositoryApi,
            },
            {
                provide: tourii_backend_constant_1.TouriiBackendConstants.LOCATION_INFO_REPOSITORY_TOKEN,
                useClass: location_info_repository_api_1.LocationInfoRepositoryApi,
            },
            {
                provide: tourii_backend_constant_1.TouriiBackendConstants.ENCRYPTION_REPOSITORY_TOKEN,
                useClass: encryption_repository_auth_1.EncryptionRepositoryAuth,
            },
            {
                provide: core_1.APP_PIPE,
                useClass: nestjs_zod_1.ZodValidationPipe,
            },
            {
                provide: core_1.APP_GUARD,
                useClass: throttler_1.ThrottlerGuard,
            },
        ],
    }),
    __metadata("design:paramtypes", [typeof (_a = typeof core_1.HttpAdapterHost !== "undefined" && core_1.HttpAdapterHost) === "function" ? _a : Object])
], TouriiBackendModule);


/***/ }),
/* 73 */
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
exports.LocationInfoRepositoryApi = void 0;
const caching_service_1 = __webpack_require__(5);
const tourii_backend_http_service_1 = __webpack_require__(10);
const tourii_backend_app_error_type_1 = __webpack_require__(26);
const tourii_backend_app_exception_1 = __webpack_require__(6);
const common_1 = __webpack_require__(4);
const config_1 = __webpack_require__(12);
const rxjs_1 = __webpack_require__(49);
const LOCATION_CACHE_PREFIX = 'location_info';
const CACHE_TTL_SECONDS = 86400;
let LocationInfoRepositoryApi = class LocationInfoRepositoryApi {
    constructor(httpService, configService, cachingService) {
        this.httpService = httpService;
        this.configService = configService;
        this.cachingService = cachingService;
    }
    async getLocationInfo(query) {
        var _a;
        const apiKey = (_a = this.configService.get('GOOGLE_PLACES_API_KEY')) !== null && _a !== void 0 ? _a : this.configService.get('GOOGLE_MAPS_API_KEY');
        if (!apiKey) {
            common_1.Logger.error('GOOGLE_PLACES_API_KEY is not configured.');
            throw new tourii_backend_app_exception_1.TouriiBackendAppException(tourii_backend_app_error_type_1.TouriiBackendAppErrorType.E_GEO_005);
        }
        const cacheKey = `${LOCATION_CACHE_PREFIX}:${encodeURIComponent(query)}`;
        const fetchFn = async () => {
            var _a, _b, _c, _d, _e, _f;
            try {
                const findUrl = `https://maps.googleapis.com/maps/api/place/findplacefromtext/json?input=${encodeURIComponent(query)}` +
                    `&inputtype=textquery&fields=place_id&key=${apiKey}`;
                const findRes = await (0, rxjs_1.firstValueFrom)(this.httpService.getTouriiBackendHttpService.get(findUrl));
                const placeId = (_c = (_b = (_a = findRes.data) === null || _a === void 0 ? void 0 : _a.candidates) === null || _b === void 0 ? void 0 : _b[0]) === null || _c === void 0 ? void 0 : _c.place_id;
                if (!placeId) {
                    throw new tourii_backend_app_exception_1.TouriiBackendAppException(tourii_backend_app_error_type_1.TouriiBackendAppErrorType.E_GEO_001);
                }
                const fields = [
                    'name',
                    'formatted_address',
                    'international_phone_number',
                    'website',
                    'rating',
                    'url',
                    'opening_hours',
                ].join(',');
                const detailUrl = `https://maps.googleapis.com/maps/api/place/details/json?place_id=${placeId}` +
                    `&fields=${fields}&key=${apiKey}`;
                const detailRes = await (0, rxjs_1.firstValueFrom)(this.httpService.getTouriiBackendHttpService.get(detailUrl));
                const result = (_d = detailRes.data) === null || _d === void 0 ? void 0 : _d.result;
                if (!result) {
                    throw new tourii_backend_app_exception_1.TouriiBackendAppException(tourii_backend_app_error_type_1.TouriiBackendAppErrorType.E_GEO_001);
                }
                return {
                    name: (_e = result.name) !== null && _e !== void 0 ? _e : query,
                    formattedAddress: result.formatted_address,
                    phoneNumber: result.international_phone_number,
                    website: result.website,
                    rating: result.rating,
                    googleMapsUrl: result.url,
                    openingHours: (_f = result.opening_hours) === null || _f === void 0 ? void 0 : _f.weekday_text,
                };
            }
            catch (error) {
                if (error instanceof tourii_backend_app_exception_1.TouriiBackendAppException) {
                    throw error;
                }
                common_1.Logger.error(`Failed to fetch location info for ${query}`, error);
                throw new tourii_backend_app_exception_1.TouriiBackendAppException(tourii_backend_app_error_type_1.TouriiBackendAppErrorType.E_GEO_004);
            }
        };
        const data = await this.cachingService.getOrSet(cacheKey, fetchFn, CACHE_TTL_SECONDS);
        if (!data) {
            throw new tourii_backend_app_exception_1.TouriiBackendAppException(tourii_backend_app_error_type_1.TouriiBackendAppErrorType.E_GEO_004);
        }
        return data;
    }
};
exports.LocationInfoRepositoryApi = LocationInfoRepositoryApi;
exports.LocationInfoRepositoryApi = LocationInfoRepositoryApi = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [typeof (_a = typeof tourii_backend_http_service_1.TouriiBackendHttpService !== "undefined" && tourii_backend_http_service_1.TouriiBackendHttpService) === "function" ? _a : Object, typeof (_b = typeof config_1.ConfigService !== "undefined" && config_1.ConfigService) === "function" ? _b : Object, typeof (_c = typeof caching_service_1.CachingService !== "undefined" && caching_service_1.CachingService) === "function" ? _c : Object])
], LocationInfoRepositoryApi);


/***/ }),
/* 74 */
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
exports.GroupQuestRepositoryDb = void 0;
const prisma_service_1 = __webpack_require__(8);
const common_1 = __webpack_require__(4);
let GroupQuestRepositoryDb = class GroupQuestRepositoryDb {
    constructor(prisma) {
        this.prisma = prisma;
    }
    async getGroupMembers(questId) {
        var _a, _b;
        const log = await this.prisma.user_quest_log.findFirst({
            where: { quest_id: questId },
            select: { group_activity_members: true },
        });
        if (!log) {
            return { groupId: questId, leaderUserId: '', members: [] };
        }
        const membersData = log.group_activity_members;
        const memberIds = membersData.map((m) => m.user_id);
        const users = await this.prisma.user.findMany({
            where: { user_id: { in: memberIds } },
            select: { user_id: true, username: true },
        });
        const members = memberIds.map((id) => {
            var _a, _b;
            const user = users.find((u) => u.user_id === id);
            const member = membersData.find((m) => m.user_id === id);
            return {
                userId: id,
                username: (_a = user === null || user === void 0 ? void 0 : user.username) !== null && _a !== void 0 ? _a : '',
                role: (_b = member === null || member === void 0 ? void 0 : member.role) !== null && _b !== void 0 ? _b : null,
            };
        });
        const leader = membersData.find((m) => m.role === 'leader');
        return {
            groupId: questId,
            leaderUserId: (_b = (_a = leader === null || leader === void 0 ? void 0 : leader.user_id) !== null && _a !== void 0 ? _a : memberIds[0]) !== null && _b !== void 0 ? _b : '',
            members,
        };
    }
    async updateMembersStatus(questId, memberIds, status) {
        if (memberIds.length === 0)
            return;
        await this.prisma.user_quest_log.updateMany({
            where: { quest_id: questId, user_id: { in: memberIds } },
            data: { status },
        });
    }
};
exports.GroupQuestRepositoryDb = GroupQuestRepositoryDb;
exports.GroupQuestRepositoryDb = GroupQuestRepositoryDb = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [typeof (_a = typeof prisma_service_1.PrismaService !== "undefined" && prisma_service_1.PrismaService) === "function" ? _a : Object])
], GroupQuestRepositoryDb);


/***/ }),
/* 75 */
/***/ ((module) => {

module.exports = require("@nestjs/throttler");

/***/ }),
/* 76 */
/***/ ((module) => {

module.exports = require("cache-manager-redis-store");

/***/ }),
/* 77 */
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
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.TestController = void 0;
const tourii_backend_app_error_type_1 = __webpack_require__(26);
const common_1 = __webpack_require__(4);
const swagger_1 = __webpack_require__(68);
const throttler_1 = __webpack_require__(75);
let TestController = class TestController {
    testHeaders() {
        return {
            message: 'Check response headers',
        };
    }
    testRateLimit() {
        return {
            message: 'Rate limit test endpoint',
        };
    }
    testApiKey() {
        return {
            message: 'API key is valid',
        };
    }
    testVersion() {
        return {
            message: 'API version is supported',
        };
    }
};
exports.TestController = TestController;
__decorate([
    (0, common_1.Get)('headers'),
    (0, throttler_1.SkipThrottle)(),
    (0, swagger_1.ApiOperation)({
        summary: 'Test Security Headers',
        description: 'Tests the security headers set by SecurityMiddleware. Returns all configured security headers in the response.',
    }),
    (0, swagger_1.ApiHeader)({
        name: 'x-api-key',
        description: 'API key for authentication',
        required: true,
    }),
    (0, swagger_1.ApiHeader)({
        name: 'accept-version',
        description: 'API version (e.g., 1.0.0)',
        required: true,
    }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Security headers test successful',
        schema: {
            type: 'object',
            properties: {
                message: {
                    type: 'string',
                    example: 'Check response headers',
                },
            },
        },
    }),
    (0, swagger_1.ApiResponse)({
        status: 401,
        description: 'Unauthorized - Invalid or missing API key',
        schema: {
            type: 'object',
            properties: {
                code: {
                    type: 'string',
                    example: tourii_backend_app_error_type_1.TouriiBackendAppErrorType.E_TB_010.code,
                },
                message: {
                    type: 'string',
                    example: tourii_backend_app_error_type_1.TouriiBackendAppErrorType.E_TB_010.message,
                },
                type: {
                    type: 'string',
                    example: tourii_backend_app_error_type_1.TouriiBackendAppErrorType.E_TB_010.type,
                },
            },
        },
    }),
    (0, swagger_1.ApiResponse)({
        status: 400,
        description: 'Bad Request - Invalid version format',
        schema: {
            type: 'object',
            properties: {
                code: {
                    type: 'string',
                    example: tourii_backend_app_error_type_1.TouriiBackendAppErrorType.E_TB_021.code,
                },
                message: {
                    type: 'string',
                    example: tourii_backend_app_error_type_1.TouriiBackendAppErrorType.E_TB_021.message,
                },
                type: {
                    type: 'string',
                    example: tourii_backend_app_error_type_1.TouriiBackendAppErrorType.E_TB_021.type,
                },
            },
        },
    }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], TestController.prototype, "testHeaders", null);
__decorate([
    (0, common_1.Get)('rate-limit'),
    (0, throttler_1.Throttle)({
        default: {
            ttl: 1000,
            limit: 3,
        },
    }),
    (0, swagger_1.ApiOperation)({
        summary: 'Test Rate Limiting',
        description: 'Tests the rate limiting middleware. Limited to 3 requests per second.',
    }),
    (0, swagger_1.ApiHeader)({
        name: 'x-api-key',
        description: 'API key for authentication',
        required: true,
    }),
    (0, swagger_1.ApiHeader)({
        name: 'accept-version',
        description: 'API version (e.g., 1.0.0)',
        required: true,
    }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Rate limit test successful',
        schema: {
            type: 'object',
            properties: {
                message: {
                    type: 'string',
                    example: 'Rate limit test endpoint',
                },
            },
        },
        headers: {
            'X-RateLimit-Limit': {
                description: 'Maximum number of requests allowed',
                schema: {
                    type: 'number',
                },
                example: 3,
            },
            'X-RateLimit-Remaining': {
                description: 'Number of requests remaining',
                schema: {
                    type: 'number',
                },
                example: 2,
            },
            'X-RateLimit-Reset': {
                description: 'Time until rate limit resets (in seconds)',
                schema: {
                    type: 'number',
                },
                example: 1,
            },
        },
    }),
    (0, swagger_1.ApiResponse)({
        status: 429,
        description: 'Too Many Requests',
        schema: {
            type: 'object',
            properties: {
                message: {
                    type: 'string',
                    example: 'ThrottlerException: Too Many Requests',
                },
            },
        },
    }),
    (0, swagger_1.ApiResponse)({
        status: 401,
        description: 'Unauthorized - Invalid or missing API key',
        schema: {
            type: 'object',
            properties: {
                code: {
                    type: 'string',
                    example: tourii_backend_app_error_type_1.TouriiBackendAppErrorType.E_TB_010.code,
                },
                message: {
                    type: 'string',
                    example: tourii_backend_app_error_type_1.TouriiBackendAppErrorType.E_TB_010.message,
                },
                type: {
                    type: 'string',
                    example: tourii_backend_app_error_type_1.TouriiBackendAppErrorType.E_TB_010.type,
                },
            },
        },
    }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], TestController.prototype, "testRateLimit", null);
__decorate([
    (0, common_1.Get)('api-key'),
    (0, throttler_1.SkipThrottle)(),
    (0, swagger_1.ApiOperation)({
        summary: 'Test API Key Validation',
        description: 'Tests the API key validation middleware.',
    }),
    (0, swagger_1.ApiHeader)({
        name: 'x-api-key',
        description: 'API key for authentication',
        required: true,
    }),
    (0, swagger_1.ApiHeader)({
        name: 'accept-version',
        description: 'API version (e.g., 1.0.0)',
        required: true,
    }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'API key validation successful',
        schema: {
            type: 'object',
            properties: {
                message: {
                    type: 'string',
                    example: 'API key is valid',
                },
            },
        },
    }),
    (0, swagger_1.ApiResponse)({
        status: 401,
        description: 'Unauthorized - Missing API key',
        schema: {
            type: 'object',
            properties: {
                code: {
                    type: 'string',
                    example: tourii_backend_app_error_type_1.TouriiBackendAppErrorType.E_TB_010.code,
                },
                message: {
                    type: 'string',
                    example: tourii_backend_app_error_type_1.TouriiBackendAppErrorType.E_TB_010.message,
                },
                type: {
                    type: 'string',
                    example: tourii_backend_app_error_type_1.TouriiBackendAppErrorType.E_TB_010.type,
                },
            },
        },
    }),
    (0, swagger_1.ApiResponse)({
        status: 401,
        description: 'Unauthorized - Invalid API key',
        schema: {
            type: 'object',
            properties: {
                code: {
                    type: 'string',
                    example: tourii_backend_app_error_type_1.TouriiBackendAppErrorType.E_TB_011.code,
                },
                message: {
                    type: 'string',
                    example: tourii_backend_app_error_type_1.TouriiBackendAppErrorType.E_TB_011.message,
                },
                type: {
                    type: 'string',
                    example: tourii_backend_app_error_type_1.TouriiBackendAppErrorType.E_TB_011.type,
                },
            },
        },
    }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], TestController.prototype, "testApiKey", null);
__decorate([
    (0, common_1.Get)('version'),
    (0, throttler_1.SkipThrottle)(),
    (0, swagger_1.ApiOperation)({
        summary: 'Test Version Validation',
        description: 'Tests the API version validation middleware.',
    }),
    (0, swagger_1.ApiHeader)({
        name: 'x-api-key',
        description: 'API key for authentication',
        required: true,
    }),
    (0, swagger_1.ApiHeader)({
        name: 'accept-version',
        description: 'API version (e.g., 1.0.0)',
        required: true,
    }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Version validation successful',
        schema: {
            type: 'object',
            properties: {
                message: {
                    type: 'string',
                    example: 'API version is supported',
                },
            },
        },
    }),
    (0, swagger_1.ApiResponse)({
        status: 400,
        description: 'Bad Request - Missing version header',
        schema: {
            type: 'object',
            properties: {
                code: {
                    type: 'string',
                    example: tourii_backend_app_error_type_1.TouriiBackendAppErrorType.E_TB_020.code,
                },
                message: {
                    type: 'string',
                    example: tourii_backend_app_error_type_1.TouriiBackendAppErrorType.E_TB_020.message,
                },
                type: {
                    type: 'string',
                    example: tourii_backend_app_error_type_1.TouriiBackendAppErrorType.E_TB_020.type,
                },
            },
        },
    }),
    (0, swagger_1.ApiResponse)({
        status: 400,
        description: 'Bad Request - Invalid version format',
        schema: {
            type: 'object',
            properties: {
                code: {
                    type: 'string',
                    example: tourii_backend_app_error_type_1.TouriiBackendAppErrorType.E_TB_021.code,
                },
                message: {
                    type: 'string',
                    example: tourii_backend_app_error_type_1.TouriiBackendAppErrorType.E_TB_021.message,
                },
                type: {
                    type: 'string',
                    example: tourii_backend_app_error_type_1.TouriiBackendAppErrorType.E_TB_021.type,
                },
            },
        },
    }),
    (0, swagger_1.ApiResponse)({
        status: 400,
        description: 'Bad Request - Unsupported version',
        schema: {
            type: 'object',
            properties: {
                code: {
                    type: 'string',
                    example: tourii_backend_app_error_type_1.TouriiBackendAppErrorType.E_TB_022.code,
                },
                message: {
                    type: 'string',
                    example: tourii_backend_app_error_type_1.TouriiBackendAppErrorType.E_TB_022.message,
                },
                type: {
                    type: 'string',
                    example: tourii_backend_app_error_type_1.TouriiBackendAppErrorType.E_TB_022.type,
                },
            },
        },
    }),
    (0, swagger_1.ApiResponse)({
        status: 401,
        description: 'Unauthorized - Invalid or missing API key',
        schema: {
            type: 'object',
            properties: {
                code: {
                    type: 'string',
                    example: tourii_backend_app_error_type_1.TouriiBackendAppErrorType.E_TB_010.code,
                },
                message: {
                    type: 'string',
                    example: tourii_backend_app_error_type_1.TouriiBackendAppErrorType.E_TB_010.message,
                },
                type: {
                    type: 'string',
                    example: tourii_backend_app_error_type_1.TouriiBackendAppErrorType.E_TB_010.type,
                },
            },
        },
    }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], TestController.prototype, "testVersion", null);
exports.TestController = TestController = __decorate([
    (0, swagger_1.ApiTags)('Security Tests'),
    (0, common_1.Controller)('test')
], TestController);


/***/ }),
/* 78 */
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
var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m, _o, _p, _q, _r, _s, _t, _u, _v, _w, _x, _y, _z, _0, _1, _2, _3, _4, _5, _6, _7, _8, _9, _10, _11, _12, _13, _14, _15, _16, _17, _18, _19, _20;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.TouriiBackendController = void 0;
const user_entity_1 = __webpack_require__(46);
const common_1 = __webpack_require__(4);
const swagger_1 = __webpack_require__(68);
const client_1 = __webpack_require__(9);
const nestjs_zod_1 = __webpack_require__(71);
const tourii_backend_service_1 = __webpack_require__(79);
const api_error_responses_decorator_1 = __webpack_require__(98);
const auth_signup_request_model_1 = __webpack_require__(99);
const chapter_story_create_request_model_1 = __webpack_require__(101);
const login_request_model_1 = __webpack_require__(102);
const model_route_create_request_model_1 = __webpack_require__(103);
const quest_create_request_model_1 = __webpack_require__(105);
const quest_task_create_request_model_1 = __webpack_require__(106);
const story_create_request_model_1 = __webpack_require__(107);
const tourist_spot_create_request_model_1 = __webpack_require__(104);
const location_query_request_model_1 = __webpack_require__(108);
const quest_fetch_request_model_1 = __webpack_require__(109);
const chapter_progress_request_model_1 = __webpack_require__(110);
const chapter_story_update_request_model_1 = __webpack_require__(111);
const model_route_update_request_model_1 = __webpack_require__(112);
const quest_task_update_request_model_1 = __webpack_require__(113);
const quest_update_request_model_1 = __webpack_require__(114);
const story_update_request_model_1 = __webpack_require__(115);
const tourist_spot_update_request_model_1 = __webpack_require__(116);
const start_group_quest_request_model_1 = __webpack_require__(117);
const auth_signup_response_model_1 = __webpack_require__(118);
const chapter_story_response_model_1 = __webpack_require__(119);
const group_members_response_model_1 = __webpack_require__(121);
const model_route_response_model_1 = __webpack_require__(122);
const quest_list_response_model_1 = __webpack_require__(124);
const quest_response_model_1 = __webpack_require__(125);
const start_group_quest_response_model_1 = __webpack_require__(126);
const story_response_model_1 = __webpack_require__(127);
const tourist_spot_response_model_1 = __webpack_require__(123);
let TouriiBackendController = class TouriiBackendController {
    constructor(touriiBackendService) {
        this.touriiBackendService = touriiBackendService;
    }
    checkHealth() {
        return 'OK';
    }
    async createStory(saga) {
        return await this.touriiBackendService.createStory(saga);
    }
    async createStoryChapter(storyId, chapter) {
        return await this.touriiBackendService.createStoryChapter(storyId, chapter);
    }
    async updateStory(saga) {
        return await this.touriiBackendService.updateStory(saga);
    }
    async updateStoryChapter(chapter) {
        return await this.touriiBackendService.updateStoryChapter(chapter);
    }
    async getSagas() {
        return await this.touriiBackendService.getStories();
    }
    async getStoryChaptersByStoryId(storyId) {
        return await this.touriiBackendService.getStoryChapters(storyId);
    }
    async markChapterProgress(chapterId, body) {
        await this.touriiBackendService.trackChapterProgress(body.userId, chapterId, body.status);
        return { success: true };
    }
    async createModelRoute(modelRoute) {
        return await this.touriiBackendService.createModelRoute(modelRoute);
    }
    async createTouristSpot(modelRouteId, touristSpot) {
        return await this.touriiBackendService.createTouristSpot(touristSpot, modelRouteId);
    }
    async updateModelRoute(modelRoute) {
        return await this.touriiBackendService.updateModelRoute(modelRoute);
    }
    async updateTouristSpot(touristSpot) {
        return await this.touriiBackendService.updateTouristSpot(touristSpot);
    }
    createUser(user) {
        return this.touriiBackendService.createUser(user);
    }
    login(login) {
        return this.touriiBackendService.loginUser(login);
    }
    async signup(dto, req) {
        var _a;
        return this.touriiBackendService.signupUser(dto.email, dto.socialProvider, dto.socialId, (_a = req.ip) !== null && _a !== void 0 ? _a : '');
    }
    async getUserByUserId(_userId) {
        return undefined;
    }
    async getQuestList(query) {
        const { page, limit, isPremium, isUnlocked, questType } = query;
        return await this.touriiBackendService.fetchQuestsWithPagination(Number(page), Number(limit), isPremium === undefined ? undefined : Boolean(isPremium), isUnlocked === undefined ? undefined : Boolean(isUnlocked), questType);
    }
    async getQuestById(questId) {
        return await this.touriiBackendService.getQuestById(questId);
    }
    async createQuest(quest) {
        return await this.touriiBackendService.createQuest(quest);
    }
    async createQuestTask(questId, task) {
        return await this.touriiBackendService.createQuestTask(questId, task);
    }
    async updateQuest(quest) {
        return await this.touriiBackendService.updateQuest(quest);
    }
    async updateQuestTask(task) {
        return await this.touriiBackendService.updateQuestTask(task);
    }
    async getGroupMembers(questId) {
        return this.touriiBackendService.getGroupMembers(questId);
    }
    async startGroupQuest(questId, body) {
        return this.touriiBackendService.startGroupQuest(questId, body.userId);
    }
    async getRoutes() {
        return this.touriiBackendService.getModelRoutes();
    }
    async getRouteById(id) {
        return this.touriiBackendService.getModelRouteById(id);
    }
    async getLocationInfo(queryParams) {
        return this.touriiBackendService.getLocationInfo(queryParams.query);
    }
};
exports.TouriiBackendController = TouriiBackendController;
__decorate([
    (0, common_1.Get)('/health-check'),
    (0, swagger_1.ApiTags)('Health Check'),
    (0, swagger_1.ApiOperation)({
        summary: 'Health Check',
        description: 'Check if the API is running and accessible.',
    }),
    (0, swagger_1.ApiHeader)({
        name: 'x-api-key',
        description: 'API key for authentication',
        required: true,
    }),
    (0, swagger_1.ApiHeader)({
        name: 'accept-version',
        description: 'API version (e.g., 1.0.0)',
        required: true,
    }),
    (0, swagger_1.ApiResponse)({
        status: 201,
        description: 'API is healthy',
        schema: {
            type: 'string',
            example: 'OK',
        },
    }),
    (0, swagger_1.ApiUnauthorizedResponse)(),
    (0, api_error_responses_decorator_1.ApiInvalidVersionResponse)(),
    (0, api_error_responses_decorator_1.ApiDefaultBadRequestResponse)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", String)
], TouriiBackendController.prototype, "checkHealth", null);
__decorate([
    (0, common_1.Post)('/stories/create-saga'),
    (0, swagger_1.ApiTags)('Stories'),
    (0, swagger_1.ApiOperation)({
        summary: 'Create Story Saga',
        description: 'Create a new story saga with optional chapters.',
    }),
    (0, swagger_1.ApiHeader)({
        name: 'x-api-key',
        description: 'API key for authentication',
        required: true,
    }),
    (0, swagger_1.ApiHeader)({
        name: 'accept-version',
        description: 'API version (e.g., 1.0.0)',
        required: true,
    }),
    (0, swagger_1.ApiBody)({
        description: 'Story Saga creation request',
        type: story_create_request_model_1.StoryCreateRequestDto,
        schema: (0, nestjs_zod_1.zodToOpenAPI)(story_create_request_model_1.StoryCreateRequestSchema),
    }),
    (0, swagger_1.ApiResponse)({
        status: 201,
        description: 'Successfully created story saga',
        type: story_response_model_1.StoryResponseDto,
        schema: (0, nestjs_zod_1.zodToOpenAPI)(story_response_model_1.StoryResponseSchema),
    }),
    (0, swagger_1.ApiUnauthorizedResponse)(),
    (0, api_error_responses_decorator_1.ApiInvalidVersionResponse)(),
    (0, api_error_responses_decorator_1.ApiDefaultBadRequestResponse)(),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [typeof (_b = typeof story_create_request_model_1.StoryCreateRequestDto !== "undefined" && story_create_request_model_1.StoryCreateRequestDto) === "function" ? _b : Object]),
    __metadata("design:returntype", typeof (_c = typeof Promise !== "undefined" && Promise) === "function" ? _c : Object)
], TouriiBackendController.prototype, "createStory", null);
__decorate([
    (0, common_1.Post)('/stories/create-chapter/:storyId'),
    (0, swagger_1.ApiTags)('Stories'),
    (0, swagger_1.ApiOperation)({
        summary: 'Create Story Chapter',
        description: 'Create a new story chapter.',
    }),
    (0, swagger_1.ApiHeader)({
        name: 'x-api-key',
        description: 'API key for authentication',
        required: true,
    }),
    (0, swagger_1.ApiHeader)({
        name: 'accept-version',
        description: 'API version (e.g., 1.0.0)',
        required: true,
    }),
    (0, swagger_1.ApiBody)({
        description: 'Story Chapter creation request',
        type: chapter_story_create_request_model_1.StoryChapterCreateRequestDto,
        schema: (0, nestjs_zod_1.zodToOpenAPI)(chapter_story_create_request_model_1.StoryChapterCreateRequestSchema),
    }),
    (0, swagger_1.ApiResponse)({
        status: 201,
        description: 'Successfully created story chapter',
        type: chapter_story_response_model_1.StoryChapterResponseDto,
        schema: (0, nestjs_zod_1.zodToOpenAPI)(chapter_story_response_model_1.StoryChapterResponseSchema),
    }),
    (0, swagger_1.ApiUnauthorizedResponse)(),
    (0, api_error_responses_decorator_1.ApiInvalidVersionResponse)(),
    (0, api_error_responses_decorator_1.ApiDefaultBadRequestResponse)(),
    __param(0, (0, common_1.Param)('storyId')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, typeof (_d = typeof chapter_story_create_request_model_1.StoryChapterCreateRequestDto !== "undefined" && chapter_story_create_request_model_1.StoryChapterCreateRequestDto) === "function" ? _d : Object]),
    __metadata("design:returntype", typeof (_e = typeof Promise !== "undefined" && Promise) === "function" ? _e : Object)
], TouriiBackendController.prototype, "createStoryChapter", null);
__decorate([
    (0, common_1.Post)('/stories/update-saga'),
    (0, swagger_1.ApiTags)('Stories'),
    (0, swagger_1.ApiOperation)({
        summary: 'Update Story Saga',
        description: 'Update an existing story saga.',
    }),
    (0, swagger_1.ApiHeader)({
        name: 'x-api-key',
        description: 'API key for authentication',
        required: true,
    }),
    (0, swagger_1.ApiHeader)({
        name: 'accept-version',
        description: 'API version (e.g., 1.0.0)',
        required: true,
    }),
    (0, swagger_1.ApiBody)({
        description: 'Story Saga update request',
        schema: (0, nestjs_zod_1.zodToOpenAPI)(story_update_request_model_1.StoryUpdateRequestSchema),
    }),
    (0, swagger_1.ApiResponse)({
        status: 201,
        description: 'Successfully updated story saga',
        type: story_response_model_1.StoryResponseDto,
        schema: (0, nestjs_zod_1.zodToOpenAPI)(story_response_model_1.StoryResponseSchema),
    }),
    (0, swagger_1.ApiUnauthorizedResponse)(),
    (0, api_error_responses_decorator_1.ApiInvalidVersionResponse)(),
    (0, api_error_responses_decorator_1.ApiDefaultBadRequestResponse)(),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [typeof (_f = typeof story_update_request_model_1.StoryUpdateRequestDto !== "undefined" && story_update_request_model_1.StoryUpdateRequestDto) === "function" ? _f : Object]),
    __metadata("design:returntype", typeof (_g = typeof Promise !== "undefined" && Promise) === "function" ? _g : Object)
], TouriiBackendController.prototype, "updateStory", null);
__decorate([
    (0, common_1.Post)('/stories/update-chapter'),
    (0, swagger_1.ApiTags)('Stories'),
    (0, swagger_1.ApiOperation)({
        summary: 'Update Story Chapter',
        description: 'Update an existing story chapter.',
    }),
    (0, swagger_1.ApiHeader)({
        name: 'x-api-key',
        description: 'API key for authentication',
        required: true,
    }),
    (0, swagger_1.ApiHeader)({
        name: 'accept-version',
        description: 'API version (e.g., 1.0.0)',
        required: true,
    }),
    (0, swagger_1.ApiBody)({
        description: 'Story Chapter update request',
        schema: (0, nestjs_zod_1.zodToOpenAPI)(chapter_story_update_request_model_1.StoryChapterUpdateRequestSchema),
    }),
    (0, swagger_1.ApiResponse)({
        status: 201,
        description: 'Successfully updated story chapter',
        type: chapter_story_response_model_1.StoryChapterResponseDto,
        schema: (0, nestjs_zod_1.zodToOpenAPI)(chapter_story_response_model_1.StoryChapterResponseSchema),
    }),
    (0, swagger_1.ApiUnauthorizedResponse)(),
    (0, api_error_responses_decorator_1.ApiInvalidVersionResponse)(),
    (0, api_error_responses_decorator_1.ApiDefaultBadRequestResponse)(),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [typeof (_h = typeof chapter_story_update_request_model_1.StoryChapterUpdateRequestDto !== "undefined" && chapter_story_update_request_model_1.StoryChapterUpdateRequestDto) === "function" ? _h : Object]),
    __metadata("design:returntype", typeof (_j = typeof Promise !== "undefined" && Promise) === "function" ? _j : Object)
], TouriiBackendController.prototype, "updateStoryChapter", null);
__decorate([
    (0, common_1.Get)('/stories/sagas'),
    (0, swagger_1.ApiTags)('Stories'),
    (0, swagger_1.ApiOperation)({
        summary: 'Get All Story Sagas',
        description: 'Retrieve all available story sagas.',
    }),
    (0, swagger_1.ApiHeader)({
        name: 'x-api-key',
        description: 'API key for authentication',
        required: true,
    }),
    (0, swagger_1.ApiHeader)({
        name: 'accept-version',
        description: 'API version (e.g., 1.0.0)',
        required: true,
    }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.OK,
        description: 'Successfully retrieved all sagas',
        type: story_response_model_1.StoryResponseDto,
        isArray: true,
        schema: {
            type: 'array',
            items: (0, nestjs_zod_1.zodToOpenAPI)(story_response_model_1.StoryResponseSchema),
        },
    }),
    (0, swagger_1.ApiUnauthorizedResponse)(),
    (0, api_error_responses_decorator_1.ApiInvalidVersionResponse)(),
    (0, api_error_responses_decorator_1.ApiDefaultBadRequestResponse)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", typeof (_k = typeof Promise !== "undefined" && Promise) === "function" ? _k : Object)
], TouriiBackendController.prototype, "getSagas", null);
__decorate([
    (0, common_1.Get)('/stories/sagas/:storyId/chapters'),
    (0, swagger_1.ApiTags)('Stories'),
    (0, swagger_1.ApiOperation)({
        summary: 'Get Story Chapters',
        description: 'Retrieve all chapters for a specific story.',
    }),
    (0, swagger_1.ApiHeader)({
        name: 'x-api-key',
        description: 'API key for authentication',
        required: true,
    }),
    (0, swagger_1.ApiHeader)({
        name: 'accept-version',
        description: 'API version (e.g., 1.0.0)',
        required: true,
    }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.OK,
        description: 'Successfully retrieved all chapters for a specific story.',
        schema: (0, nestjs_zod_1.zodToOpenAPI)(chapter_story_response_model_1.StoryChapterResponseSchema),
    }),
    (0, swagger_1.ApiUnauthorizedResponse)(),
    (0, api_error_responses_decorator_1.ApiInvalidVersionResponse)(),
    (0, api_error_responses_decorator_1.ApiDefaultBadRequestResponse)(),
    __param(0, (0, common_1.Param)('storyId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", typeof (_l = typeof Promise !== "undefined" && Promise) === "function" ? _l : Object)
], TouriiBackendController.prototype, "getStoryChaptersByStoryId", null);
__decorate([
    (0, common_1.Post)('/stories/chapters/:chapterId/progress'),
    (0, swagger_1.ApiTags)('Stories'),
    (0, swagger_1.ApiOperation)({
        summary: 'Save chapter reading progress',
        description: 'Track user reading progress for a story chapter',
    }),
    (0, swagger_1.ApiHeader)({ name: 'x-api-key', description: 'API key for authentication', required: true }),
    (0, swagger_1.ApiHeader)({ name: 'accept-version', description: 'API version (e.g., 1.0.0)', required: true }),
    (0, swagger_1.ApiBody)({
        description: 'Progress request',
        schema: (0, nestjs_zod_1.zodToOpenAPI)(chapter_progress_request_model_1.ChapterProgressRequestSchema),
    }),
    (0, swagger_1.ApiResponse)({ status: common_1.HttpStatus.CREATED, description: 'Progress recorded' }),
    (0, swagger_1.ApiUnauthorizedResponse)(),
    (0, api_error_responses_decorator_1.ApiInvalidVersionResponse)(),
    (0, api_error_responses_decorator_1.ApiDefaultBadRequestResponse)(),
    __param(0, (0, common_1.Param)('chapterId')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, typeof (_m = typeof chapter_progress_request_model_1.ChapterProgressRequestDto !== "undefined" && chapter_progress_request_model_1.ChapterProgressRequestDto) === "function" ? _m : Object]),
    __metadata("design:returntype", typeof (_o = typeof Promise !== "undefined" && Promise) === "function" ? _o : Object)
], TouriiBackendController.prototype, "markChapterProgress", null);
__decorate([
    (0, common_1.Post)('/routes/create-model-route'),
    (0, swagger_1.ApiTags)('Routes'),
    (0, swagger_1.ApiOperation)({
        summary: 'Create Model Route',
        description: 'Create a new model route.',
    }),
    (0, swagger_1.ApiHeader)({
        name: 'x-api-key',
        description: 'API key for authentication',
        required: true,
    }),
    (0, swagger_1.ApiHeader)({
        name: 'accept-version',
        description: 'API version (e.g., 1.0.0)',
        required: true,
    }),
    (0, swagger_1.ApiBody)({
        description: 'Model Route creation request',
        schema: (0, nestjs_zod_1.zodToOpenAPI)(model_route_create_request_model_1.ModelRouteCreateRequestSchema),
    }),
    (0, swagger_1.ApiResponse)({
        status: 201,
        description: 'Successfully created model route',
        type: model_route_response_model_1.ModelRouteResponseDto,
        schema: (0, nestjs_zod_1.zodToOpenAPI)(model_route_response_model_1.ModelRouteResponseSchema),
    }),
    (0, swagger_1.ApiUnauthorizedResponse)(),
    (0, api_error_responses_decorator_1.ApiInvalidVersionResponse)(),
    (0, api_error_responses_decorator_1.ApiDefaultBadRequestResponse)(),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [typeof (_p = typeof model_route_create_request_model_1.ModelRouteCreateRequestDto !== "undefined" && model_route_create_request_model_1.ModelRouteCreateRequestDto) === "function" ? _p : Object]),
    __metadata("design:returntype", typeof (_q = typeof Promise !== "undefined" && Promise) === "function" ? _q : Object)
], TouriiBackendController.prototype, "createModelRoute", null);
__decorate([
    (0, common_1.Post)('/routes/create-tourist-spot/:modelRouteId'),
    (0, swagger_1.ApiTags)('Routes'),
    (0, swagger_1.ApiOperation)({
        summary: 'Create Tourist Spot',
        description: 'Create a new tourist spot.',
    }),
    (0, swagger_1.ApiHeader)({
        name: 'x-api-key',
        description: 'API key for authentication',
        required: true,
    }),
    (0, swagger_1.ApiHeader)({
        name: 'accept-version',
        description: 'API version (e.g., 1.0.0)',
        required: true,
    }),
    (0, swagger_1.ApiBody)({
        description: 'Tourist Spot creation request',
        schema: (0, nestjs_zod_1.zodToOpenAPI)(tourist_spot_create_request_model_1.TouristSpotCreateRequestSchema),
    }),
    (0, swagger_1.ApiResponse)({
        status: 201,
        description: 'Successfully created tourist spot',
        type: tourist_spot_response_model_1.TouristSpotResponseDto,
        schema: (0, nestjs_zod_1.zodToOpenAPI)(tourist_spot_response_model_1.TouristSpotResponseSchema),
    }),
    (0, swagger_1.ApiUnauthorizedResponse)(),
    (0, api_error_responses_decorator_1.ApiInvalidVersionResponse)(),
    (0, api_error_responses_decorator_1.ApiDefaultBadRequestResponse)(),
    __param(0, (0, common_1.Param)('modelRouteId')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, typeof (_r = typeof tourist_spot_create_request_model_1.TouristSpotCreateRequestDto !== "undefined" && tourist_spot_create_request_model_1.TouristSpotCreateRequestDto) === "function" ? _r : Object]),
    __metadata("design:returntype", typeof (_s = typeof Promise !== "undefined" && Promise) === "function" ? _s : Object)
], TouriiBackendController.prototype, "createTouristSpot", null);
__decorate([
    (0, common_1.Post)('/routes/update-model-route'),
    (0, swagger_1.ApiTags)('Routes'),
    (0, swagger_1.ApiOperation)({ summary: 'Update Model Route', description: 'Update an existing model route.' }),
    (0, swagger_1.ApiHeader)({ name: 'x-api-key', description: 'API key for authentication', required: true }),
    (0, swagger_1.ApiHeader)({ name: 'accept-version', description: 'API version (e.g., 1.0.0)', required: true }),
    (0, swagger_1.ApiBody)({
        description: 'Model Route update request',
        schema: (0, nestjs_zod_1.zodToOpenAPI)(model_route_update_request_model_1.ModelRouteUpdateRequestSchema),
    }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.CREATED,
        description: 'Successfully updated model route',
        type: model_route_response_model_1.ModelRouteResponseDto,
        schema: (0, nestjs_zod_1.zodToOpenAPI)(model_route_response_model_1.ModelRouteResponseSchema),
    }),
    (0, swagger_1.ApiUnauthorizedResponse)(),
    (0, api_error_responses_decorator_1.ApiInvalidVersionResponse)(),
    (0, api_error_responses_decorator_1.ApiDefaultBadRequestResponse)(),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [typeof (_t = typeof model_route_update_request_model_1.ModelRouteUpdateRequestDto !== "undefined" && model_route_update_request_model_1.ModelRouteUpdateRequestDto) === "function" ? _t : Object]),
    __metadata("design:returntype", typeof (_u = typeof Promise !== "undefined" && Promise) === "function" ? _u : Object)
], TouriiBackendController.prototype, "updateModelRoute", null);
__decorate([
    (0, common_1.Post)('/routes/update-tourist-spot'),
    (0, swagger_1.ApiTags)('Routes'),
    (0, swagger_1.ApiOperation)({
        summary: 'Update Tourist Spot',
        description: 'Update an existing tourist spot.',
    }),
    (0, swagger_1.ApiHeader)({ name: 'x-api-key', description: 'API key for authentication', required: true }),
    (0, swagger_1.ApiHeader)({ name: 'accept-version', description: 'API version (e.g., 1.0.0)', required: true }),
    (0, swagger_1.ApiBody)({
        description: 'Tourist Spot update request',
        schema: (0, nestjs_zod_1.zodToOpenAPI)(tourist_spot_update_request_model_1.TouristSpotUpdateRequestSchema),
    }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.CREATED,
        description: 'Successfully updated tourist spot',
        type: tourist_spot_response_model_1.TouristSpotResponseDto,
        schema: (0, nestjs_zod_1.zodToOpenAPI)(tourist_spot_response_model_1.TouristSpotResponseSchema),
    }),
    (0, swagger_1.ApiUnauthorizedResponse)(),
    (0, api_error_responses_decorator_1.ApiInvalidVersionResponse)(),
    (0, api_error_responses_decorator_1.ApiDefaultBadRequestResponse)(),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [typeof (_v = typeof tourist_spot_update_request_model_1.TouristSpotUpdateRequestDto !== "undefined" && tourist_spot_update_request_model_1.TouristSpotUpdateRequestDto) === "function" ? _v : Object]),
    __metadata("design:returntype", typeof (_w = typeof Promise !== "undefined" && Promise) === "function" ? _w : Object)
], TouriiBackendController.prototype, "updateTouristSpot", null);
__decorate([
    (0, common_1.Post)('/user'),
    (0, swagger_1.ApiTags)('User'),
    (0, swagger_1.ApiOperation)({
        summary: 'Create User',
        description: 'Create a new user in the system.',
    }),
    (0, swagger_1.ApiHeader)({
        name: 'x-api-key',
        description: 'API key for authentication',
        required: true,
    }),
    (0, swagger_1.ApiHeader)({
        name: 'accept-version',
        description: 'API version (e.g., 1.0.0)',
        required: true,
    }),
    (0, swagger_1.ApiBody)({
        description: 'User creation request',
        type: user_entity_1.UserEntity,
    }),
    (0, swagger_1.ApiResponse)({
        status: 201,
        description: 'User created successfully',
        type: user_entity_1.UserEntity,
    }),
    (0, api_error_responses_decorator_1.ApiUserExistsResponse)(),
    (0, swagger_1.ApiUnauthorizedResponse)(),
    (0, api_error_responses_decorator_1.ApiInvalidVersionResponse)(),
    (0, api_error_responses_decorator_1.ApiDefaultBadRequestResponse)(),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [typeof (_x = typeof user_entity_1.UserEntity !== "undefined" && user_entity_1.UserEntity) === "function" ? _x : Object]),
    __metadata("design:returntype", typeof (_y = typeof Promise !== "undefined" && Promise) === "function" ? _y : Object)
], TouriiBackendController.prototype, "createUser", null);
__decorate([
    (0, common_1.Post)('/login'),
    (0, swagger_1.ApiTags)('Auth'),
    (0, swagger_1.ApiOperation)({
        summary: 'User Login',
        description: 'Login using username or other identifiers with optional wallet/social checks.',
    }),
    (0, swagger_1.ApiHeader)({
        name: 'x-api-key',
        description: 'API key for authentication',
        required: true,
    }),
    (0, swagger_1.ApiHeader)({
        name: 'accept-version',
        description: 'API version (e.g., 1.0.0)',
        required: true,
    }),
    (0, swagger_1.ApiBody)({ description: 'Login request', type: login_request_model_1.LoginRequestDto }),
    (0, swagger_1.ApiResponse)({ status: 201, description: 'Login successful', type: user_entity_1.UserEntity }),
    (0, api_error_responses_decorator_1.ApiUserNotFoundResponse)(),
    (0, swagger_1.ApiUnauthorizedResponse)(),
    (0, api_error_responses_decorator_1.ApiInvalidVersionResponse)(),
    (0, api_error_responses_decorator_1.ApiDefaultBadRequestResponse)(),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [typeof (_z = typeof login_request_model_1.LoginRequestDto !== "undefined" && login_request_model_1.LoginRequestDto) === "function" ? _z : Object]),
    __metadata("design:returntype", typeof (_0 = typeof Promise !== "undefined" && Promise) === "function" ? _0 : Object)
], TouriiBackendController.prototype, "login", null);
__decorate([
    (0, common_1.Post)('/auth/signup'),
    (0, swagger_1.ApiTags)('Auth'),
    (0, swagger_1.ApiOperation)({ summary: 'User signup with wallet' }),
    (0, swagger_1.ApiBody)({
        description: 'Signup info',
        type: auth_signup_request_model_1.AuthSignupRequestDto,
        schema: (0, nestjs_zod_1.zodToOpenAPI)(auth_signup_request_model_1.AuthSignupRequestSchema),
    }),
    (0, swagger_1.ApiResponse)({
        status: 201,
        description: 'Signup success',
        type: auth_signup_response_model_1.AuthSignupResponseDto,
        schema: (0, nestjs_zod_1.zodToOpenAPI)(auth_signup_response_model_1.AuthSignupResponseSchema),
    }),
    (0, api_error_responses_decorator_1.ApiDefaultBadRequestResponse)(),
    (0, swagger_1.ApiUnauthorizedResponse)(),
    (0, api_error_responses_decorator_1.ApiInvalidVersionResponse)(),
    (0, api_error_responses_decorator_1.ApiUserExistsResponse)(),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [typeof (_1 = typeof auth_signup_request_model_1.AuthSignupRequestDto !== "undefined" && auth_signup_request_model_1.AuthSignupRequestDto) === "function" ? _1 : Object, Object]),
    __metadata("design:returntype", typeof (_2 = typeof Promise !== "undefined" && Promise) === "function" ? _2 : Object)
], TouriiBackendController.prototype, "signup", null);
__decorate([
    (0, common_1.Get)('/:userId/user'),
    (0, swagger_1.ApiTags)('User'),
    (0, swagger_1.ApiOperation)({
        summary: 'Get User by ID',
        description: 'Retrieve user information by their user ID.',
    }),
    (0, swagger_1.ApiHeader)({
        name: 'x-api-key',
        description: 'API key for authentication',
        required: true,
    }),
    (0, swagger_1.ApiHeader)({
        name: 'accept-version',
        description: 'API version (e.g., 1.0.0)',
        required: true,
    }),
    (0, swagger_1.ApiResponse)({
        status: 201,
        description: 'User found successfully',
        type: user_entity_1.UserEntity,
    }),
    (0, api_error_responses_decorator_1.ApiUserNotFoundResponse)(),
    (0, swagger_1.ApiUnauthorizedResponse)(),
    (0, api_error_responses_decorator_1.ApiInvalidVersionResponse)(),
    (0, api_error_responses_decorator_1.ApiDefaultBadRequestResponse)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", typeof (_3 = typeof Promise !== "undefined" && Promise) === "function" ? _3 : Object)
], TouriiBackendController.prototype, "getUserByUserId", null);
__decorate([
    (0, common_1.Get)('/quests'),
    (0, swagger_1.ApiTags)('Quest'),
    (0, swagger_1.ApiOperation)({
        summary: 'Get quest with pagination',
        description: 'Get quest with pagination',
    }),
    (0, swagger_1.ApiHeader)({
        name: 'x-api-key',
        description: 'API key for authentication',
        required: true,
    }),
    (0, swagger_1.ApiHeader)({
        name: 'accept-version',
        description: 'API version (e.g., 1.0.0)',
        required: true,
    }),
    (0, swagger_1.ApiQuery)({
        name: 'page',
        required: false,
        type: Number,
        description: 'Page number for pagination (default: 1)',
    }),
    (0, swagger_1.ApiQuery)({
        name: 'limit',
        required: false,
        type: Number,
        description: 'Number of quests per page (default: 20, max: 100)',
    }),
    (0, swagger_1.ApiQuery)({
        name: 'isPremium',
        required: false,
        type: Boolean,
        description: 'Filter by premium status',
    }),
    (0, swagger_1.ApiQuery)({
        name: 'isUnlocked',
        required: false,
        type: Boolean,
        description: 'Filter by unlocked status',
    }),
    (0, swagger_1.ApiQuery)({
        name: 'questType',
        required: false,
        enum: client_1.QuestType,
        description: 'Filter by quest type',
    }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.OK,
        description: 'Fetch quests successfully',
        type: quest_list_response_model_1.QuestListResponseDto,
        schema: (0, nestjs_zod_1.zodToOpenAPI)(quest_list_response_model_1.QuestListResponseSchema),
    }),
    (0, swagger_1.ApiUnauthorizedResponse)(),
    (0, api_error_responses_decorator_1.ApiInvalidVersionResponse)(),
    (0, api_error_responses_decorator_1.ApiDefaultBadRequestResponse)(),
    __param(0, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [typeof (_4 = typeof quest_fetch_request_model_1.QuestListQueryDto !== "undefined" && quest_fetch_request_model_1.QuestListQueryDto) === "function" ? _4 : Object]),
    __metadata("design:returntype", typeof (_5 = typeof Promise !== "undefined" && Promise) === "function" ? _5 : Object)
], TouriiBackendController.prototype, "getQuestList", null);
__decorate([
    (0, common_1.Get)('/quests/:questId'),
    (0, swagger_1.ApiTags)('Quest'),
    (0, swagger_1.ApiOperation)({
        summary: 'Get quest by ID',
        description: 'Get quest by ID',
    }),
    (0, swagger_1.ApiHeader)({
        name: 'x-api-key',
        description: 'API key for authentication',
        required: true,
    }),
    (0, swagger_1.ApiHeader)({
        name: 'accept-version',
        description: 'API version (e.g., 1.0.0)',
        required: true,
    }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.OK,
        description: 'Quest found successfully',
        type: quest_response_model_1.QuestResponseDto,
        schema: (0, nestjs_zod_1.zodToOpenAPI)(quest_response_model_1.QuestResponseSchema),
    }),
    (0, swagger_1.ApiUnauthorizedResponse)(),
    (0, api_error_responses_decorator_1.ApiInvalidVersionResponse)(),
    (0, api_error_responses_decorator_1.ApiDefaultBadRequestResponse)(),
    __param(0, (0, common_1.Param)('questId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", typeof (_6 = typeof Promise !== "undefined" && Promise) === "function" ? _6 : Object)
], TouriiBackendController.prototype, "getQuestById", null);
__decorate([
    (0, common_1.Post)('/quests/create-quest'),
    (0, swagger_1.ApiTags)('Quest'),
    (0, swagger_1.ApiOperation)({ summary: 'Create Quest', description: 'Create a new quest.' }),
    (0, swagger_1.ApiHeader)({ name: 'x-api-key', description: 'API key for authentication', required: true }),
    (0, swagger_1.ApiHeader)({ name: 'accept-version', description: 'API version (e.g., 1.0.0)', required: true }),
    (0, swagger_1.ApiBody)({
        description: 'Quest create request',
        schema: (0, nestjs_zod_1.zodToOpenAPI)(quest_create_request_model_1.QuestCreateRequestSchema),
    }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.CREATED,
        description: 'Successfully created quest',
        type: quest_response_model_1.QuestResponseDto,
        schema: (0, nestjs_zod_1.zodToOpenAPI)(quest_response_model_1.QuestResponseSchema),
    }),
    (0, swagger_1.ApiUnauthorizedResponse)(),
    (0, api_error_responses_decorator_1.ApiInvalidVersionResponse)(),
    (0, api_error_responses_decorator_1.ApiDefaultBadRequestResponse)(),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [typeof (_7 = typeof quest_create_request_model_1.QuestCreateRequestDto !== "undefined" && quest_create_request_model_1.QuestCreateRequestDto) === "function" ? _7 : Object]),
    __metadata("design:returntype", typeof (_8 = typeof Promise !== "undefined" && Promise) === "function" ? _8 : Object)
], TouriiBackendController.prototype, "createQuest", null);
__decorate([
    (0, common_1.Post)('/quests/create-task/:questId'),
    (0, swagger_1.ApiTags)('Quest'),
    (0, swagger_1.ApiOperation)({ summary: 'Create Quest Task', description: 'Create a new quest task.' }),
    (0, swagger_1.ApiHeader)({ name: 'x-api-key', description: 'API key for authentication', required: true }),
    (0, swagger_1.ApiHeader)({ name: 'accept-version', description: 'API version (e.g., 1.0.0)', required: true }),
    (0, swagger_1.ApiBody)({
        description: 'Quest task create request',
        schema: (0, nestjs_zod_1.zodToOpenAPI)(quest_task_create_request_model_1.QuestTaskCreateRequestSchema),
    }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.CREATED,
        description: 'Successfully created quest task',
        type: quest_response_model_1.TaskResponseDto,
        schema: (0, nestjs_zod_1.zodToOpenAPI)(quest_response_model_1.TaskResponseSchema),
    }),
    (0, swagger_1.ApiUnauthorizedResponse)(),
    (0, api_error_responses_decorator_1.ApiInvalidVersionResponse)(),
    (0, api_error_responses_decorator_1.ApiDefaultBadRequestResponse)(),
    __param(0, (0, common_1.Param)('questId')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, typeof (_9 = typeof quest_task_create_request_model_1.QuestTaskCreateRequestDto !== "undefined" && quest_task_create_request_model_1.QuestTaskCreateRequestDto) === "function" ? _9 : Object]),
    __metadata("design:returntype", typeof (_10 = typeof Promise !== "undefined" && Promise) === "function" ? _10 : Object)
], TouriiBackendController.prototype, "createQuestTask", null);
__decorate([
    (0, common_1.Post)('/quests/update-quest'),
    (0, swagger_1.ApiTags)('Quest'),
    (0, swagger_1.ApiOperation)({ summary: 'Update Quest', description: 'Update an existing quest.' }),
    (0, swagger_1.ApiHeader)({ name: 'x-api-key', description: 'API key for authentication', required: true }),
    (0, swagger_1.ApiHeader)({ name: 'accept-version', description: 'API version (e.g., 1.0.0)', required: true }),
    (0, swagger_1.ApiBody)({
        description: 'Quest update request',
        schema: (0, nestjs_zod_1.zodToOpenAPI)(quest_update_request_model_1.QuestUpdateRequestSchema),
    }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.CREATED,
        description: 'Successfully updated quest',
        type: quest_response_model_1.QuestResponseDto,
        schema: (0, nestjs_zod_1.zodToOpenAPI)(quest_response_model_1.QuestResponseSchema),
    }),
    (0, swagger_1.ApiUnauthorizedResponse)(),
    (0, api_error_responses_decorator_1.ApiInvalidVersionResponse)(),
    (0, api_error_responses_decorator_1.ApiDefaultBadRequestResponse)(),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [typeof (_11 = typeof quest_update_request_model_1.QuestUpdateRequestDto !== "undefined" && quest_update_request_model_1.QuestUpdateRequestDto) === "function" ? _11 : Object]),
    __metadata("design:returntype", typeof (_12 = typeof Promise !== "undefined" && Promise) === "function" ? _12 : Object)
], TouriiBackendController.prototype, "updateQuest", null);
__decorate([
    (0, common_1.Post)('/quests/update-task'),
    (0, swagger_1.ApiTags)('Quest'),
    (0, swagger_1.ApiOperation)({ summary: 'Update Quest Task', description: 'Update an existing quest task.' }),
    (0, swagger_1.ApiHeader)({ name: 'x-api-key', description: 'API key for authentication', required: true }),
    (0, swagger_1.ApiHeader)({ name: 'accept-version', description: 'API version (e.g., 1.0.0)', required: true }),
    (0, swagger_1.ApiBody)({
        description: 'Quest task update request',
        schema: (0, nestjs_zod_1.zodToOpenAPI)(quest_task_update_request_model_1.QuestTaskUpdateRequestSchema),
    }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.CREATED,
        description: 'Successfully updated quest task',
        type: quest_response_model_1.TaskResponseDto,
        schema: (0, nestjs_zod_1.zodToOpenAPI)(quest_response_model_1.TaskResponseSchema),
    }),
    (0, swagger_1.ApiUnauthorizedResponse)(),
    (0, api_error_responses_decorator_1.ApiInvalidVersionResponse)(),
    (0, api_error_responses_decorator_1.ApiDefaultBadRequestResponse)(),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [typeof (_13 = typeof quest_task_update_request_model_1.QuestTaskUpdateRequestDto !== "undefined" && quest_task_update_request_model_1.QuestTaskUpdateRequestDto) === "function" ? _13 : Object]),
    __metadata("design:returntype", typeof (_14 = typeof Promise !== "undefined" && Promise) === "function" ? _14 : Object)
], TouriiBackendController.prototype, "updateQuestTask", null);
__decorate([
    (0, common_1.Get)('/quests/:questId/group/members'),
    (0, swagger_1.ApiTags)('Group Quest'),
    (0, swagger_1.ApiOperation)({
        summary: 'Get Group Members',
        description: 'Return current members of the group quest.',
    }),
    (0, swagger_1.ApiHeader)({ name: 'x-api-key', description: 'API key for authentication', required: true }),
    (0, swagger_1.ApiHeader)({ name: 'accept-version', description: 'API version (e.g., 1.0.0)', required: true }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.OK,
        description: 'Member list',
        type: group_members_response_model_1.GroupMembersResponseDto,
        schema: (0, nestjs_zod_1.zodToOpenAPI)(group_members_response_model_1.GroupMembersResponseSchema),
    }),
    (0, swagger_1.ApiUnauthorizedResponse)(),
    (0, api_error_responses_decorator_1.ApiInvalidVersionResponse)(),
    (0, api_error_responses_decorator_1.ApiDefaultBadRequestResponse)(),
    __param(0, (0, common_1.Param)('questId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", typeof (_15 = typeof Promise !== "undefined" && Promise) === "function" ? _15 : Object)
], TouriiBackendController.prototype, "getGroupMembers", null);
__decorate([
    (0, common_1.Post)('/quests/:questId/group/start'),
    (0, swagger_1.ApiTags)('Group Quest'),
    (0, swagger_1.ApiOperation)({
        summary: 'Start Group Quest',
        description: 'Leader starts the quest for all members.',
    }),
    (0, swagger_1.ApiHeader)({ name: 'x-api-key', description: 'API key for authentication', required: true }),
    (0, swagger_1.ApiHeader)({ name: 'accept-version', description: 'API version (e.g., 1.0.0)', required: true }),
    (0, swagger_1.ApiBody)({
        description: 'Start group quest request',
        schema: (0, nestjs_zod_1.zodToOpenAPI)(start_group_quest_request_model_1.StartGroupQuestRequestSchema),
    }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.OK,
        description: 'Group quest started',
        type: start_group_quest_response_model_1.StartGroupQuestResponseDto,
        schema: (0, nestjs_zod_1.zodToOpenAPI)(start_group_quest_response_model_1.StartGroupQuestResponseSchema),
    }),
    (0, swagger_1.ApiUnauthorizedResponse)(),
    (0, api_error_responses_decorator_1.ApiInvalidVersionResponse)(),
    (0, api_error_responses_decorator_1.ApiDefaultBadRequestResponse)(),
    __param(0, (0, common_1.Param)('questId')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, typeof (_16 = typeof start_group_quest_request_model_1.StartGroupQuestRequestDto !== "undefined" && start_group_quest_request_model_1.StartGroupQuestRequestDto) === "function" ? _16 : Object]),
    __metadata("design:returntype", typeof (_17 = typeof Promise !== "undefined" && Promise) === "function" ? _17 : Object)
], TouriiBackendController.prototype, "startGroupQuest", null);
__decorate([
    (0, common_1.Get)('/routes'),
    (0, swagger_1.ApiTags)('Routes'),
    (0, swagger_1.ApiOperation)({
        summary: 'Get All Model Routes',
        description: 'Retrieve a list of all available model routes with their details.',
    }),
    (0, swagger_1.ApiHeader)({
        name: 'x-api-key',
        description: 'API key for authentication',
        required: true,
    }),
    (0, swagger_1.ApiHeader)({
        name: 'accept-version',
        description: 'API version (e.g., 1.0.0)',
        required: true,
    }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.OK,
        description: 'Successfully retrieved all model routes',
        type: [model_route_response_model_1.ModelRouteResponseDto],
        schema: {
            type: 'array',
            items: (0, nestjs_zod_1.zodToOpenAPI)(model_route_response_model_1.ModelRouteResponseSchema),
        },
    }),
    (0, swagger_1.ApiUnauthorizedResponse)(),
    (0, api_error_responses_decorator_1.ApiInvalidVersionResponse)(),
    (0, api_error_responses_decorator_1.ApiDefaultBadRequestResponse)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", typeof (_18 = typeof Promise !== "undefined" && Promise) === "function" ? _18 : Object)
], TouriiBackendController.prototype, "getRoutes", null);
__decorate([
    (0, common_1.Get)('/routes/:id'),
    (0, swagger_1.ApiTags)('Routes'),
    (0, swagger_1.ApiOperation)({
        summary: 'Get Model Route by ID',
        description: 'Retrieve a specific model route by its ID, including tourist spots and weather data.',
    }),
    (0, swagger_1.ApiHeader)({
        name: 'x-api-key',
        description: 'API key for authentication',
        required: true,
    }),
    (0, swagger_1.ApiHeader)({
        name: 'accept-version',
        description: 'API version (e.g., 1.0.0)',
        required: true,
    }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.OK,
        description: 'Successfully retrieved the model route',
        type: model_route_response_model_1.ModelRouteResponseDto,
        schema: (0, nestjs_zod_1.zodToOpenAPI)(model_route_response_model_1.ModelRouteResponseSchema),
    }),
    (0, swagger_1.ApiUnauthorizedResponse)(),
    (0, api_error_responses_decorator_1.ApiInvalidVersionResponse)(),
    (0, api_error_responses_decorator_1.ApiDefaultBadRequestResponse)(),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", typeof (_19 = typeof Promise !== "undefined" && Promise) === "function" ? _19 : Object)
], TouriiBackendController.prototype, "getRouteById", null);
__decorate([
    (0, common_1.Get)('/location-info'),
    (0, swagger_1.ApiTags)('Location'),
    (0, swagger_1.ApiOperation)({
        summary: 'Get Location Info',
        description: 'Retrieve basic location details using Google Places.',
    }),
    (0, swagger_1.ApiHeader)({ name: 'x-api-key', description: 'API key for authentication', required: true }),
    (0, swagger_1.ApiHeader)({ name: 'accept-version', description: 'API version (e.g., 1.0.0)', required: true }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.OK,
        description: 'Successfully retrieved location info',
        schema: {
            type: 'object',
            properties: {
                name: { type: 'string' },
                formattedAddress: { type: 'string' },
            },
        },
    }),
    (0, swagger_1.ApiUnauthorizedResponse)(),
    (0, api_error_responses_decorator_1.ApiInvalidVersionResponse)(),
    (0, api_error_responses_decorator_1.ApiDefaultBadRequestResponse)(),
    __param(0, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [typeof (_20 = typeof location_query_request_model_1.LocationQueryDto !== "undefined" && location_query_request_model_1.LocationQueryDto) === "function" ? _20 : Object]),
    __metadata("design:returntype", Promise)
], TouriiBackendController.prototype, "getLocationInfo", null);
exports.TouriiBackendController = TouriiBackendController = __decorate([
    (0, common_1.Controller)(),
    (0, swagger_1.ApiExtraModels)(story_create_request_model_1.StoryCreateRequestDto, chapter_story_create_request_model_1.StoryChapterCreateRequestDto, model_route_create_request_model_1.ModelRouteCreateRequestDto, tourist_spot_create_request_model_1.TouristSpotCreateRequestDto, story_update_request_model_1.StoryUpdateRequestDto, chapter_story_update_request_model_1.StoryChapterUpdateRequestDto, model_route_update_request_model_1.ModelRouteUpdateRequestDto, tourist_spot_update_request_model_1.TouristSpotUpdateRequestDto, story_response_model_1.StoryResponseDto, chapter_story_response_model_1.StoryChapterResponseDto, model_route_response_model_1.ModelRouteResponseDto, tourist_spot_response_model_1.TouristSpotResponseDto, user_entity_1.UserEntity, quest_list_response_model_1.QuestListResponseDto, quest_response_model_1.QuestResponseDto, quest_response_model_1.TaskResponseDto, quest_create_request_model_1.QuestCreateRequestDto, quest_task_create_request_model_1.QuestTaskCreateRequestDto, quest_update_request_model_1.QuestUpdateRequestDto, quest_task_update_request_model_1.QuestTaskUpdateRequestDto, login_request_model_1.LoginRequestDto, auth_signup_request_model_1.AuthSignupRequestDto, auth_signup_response_model_1.AuthSignupResponseDto, group_members_response_model_1.GroupMembersResponseDto, start_group_quest_request_model_1.StartGroupQuestRequestDto, start_group_quest_response_model_1.StartGroupQuestResponseDto, location_query_request_model_1.LocationQueryDto),
    __metadata("design:paramtypes", [typeof (_a = typeof tourii_backend_service_1.TouriiBackendService !== "undefined" && tourii_backend_service_1.TouriiBackendService) === "function" ? _a : Object])
], TouriiBackendController);


/***/ }),
/* 79 */
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
var _a, _b, _c, _d, _e, _f, _g, _h, _j;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.TouriiBackendService = void 0;
const model_route_repository_1 = __webpack_require__(32);
const group_quest_repository_1 = __webpack_require__(80);
const quest_repository_1 = __webpack_require__(35);
const user_story_log_repository_1 = __webpack_require__(40);
const geo_info_repository_1 = __webpack_require__(42);
const location_info_repository_1 = __webpack_require__(81);
const weather_info_repository_1 = __webpack_require__(44);
const digital_passport_repository_1 = __webpack_require__(45);
const tourii_backend_app_error_type_1 = __webpack_require__(26);
const tourii_backend_app_exception_1 = __webpack_require__(6);
const common_1 = __webpack_require__(4);
const client_1 = __webpack_require__(9);
const ethers_1 = __webpack_require__(82);
const group_quest_gateway_1 = __webpack_require__(83);
const tourii_backend_constant_1 = __webpack_require__(86);
const model_route_create_request_builder_1 = __webpack_require__(87);
const model_route_result_builder_1 = __webpack_require__(88);
const model_route_update_request_builder_1 = __webpack_require__(89);
const quest_create_request_builder_1 = __webpack_require__(90);
const quest_result_builder_1 = __webpack_require__(91);
const quest_update_request_builder_1 = __webpack_require__(92);
const story_create_request_builder_1 = __webpack_require__(93);
const story_result_builder_1 = __webpack_require__(94);
const story_update_request_builder_1 = __webpack_require__(95);
const tourist_spot_update_request_builder_1 = __webpack_require__(96);
const user_create_builder_1 = __webpack_require__(97);
let TouriiBackendService = class TouriiBackendService {
    constructor(userRepository, storyRepository, modelRouteRepository, geoInfoRepository, weatherInfoRepository, locationInfoRepository, questRepository, encryptionRepository, userStoryLogRepository, passportRepository, groupQuestRepository, groupQuestGateway) {
        this.userRepository = userRepository;
        this.storyRepository = storyRepository;
        this.modelRouteRepository = modelRouteRepository;
        this.geoInfoRepository = geoInfoRepository;
        this.weatherInfoRepository = weatherInfoRepository;
        this.locationInfoRepository = locationInfoRepository;
        this.questRepository = questRepository;
        this.encryptionRepository = encryptionRepository;
        this.userStoryLogRepository = userStoryLogRepository;
        this.passportRepository = passportRepository;
        this.groupQuestRepository = groupQuestRepository;
        this.groupQuestGateway = groupQuestGateway;
    }
    async createStory(saga) {
        const storySaga = await this.storyRepository.createStory(story_create_request_builder_1.StoryCreateRequestBuilder.dtoToStory(saga, 'admin'));
        return story_result_builder_1.StoryResultBuilder.storyToDto(storySaga);
    }
    async createStoryChapter(storyId, chapter) {
        const storyChapter = await this.storyRepository.createStoryChapter(storyId, story_create_request_builder_1.StoryCreateRequestBuilder.dtoToStoryChapter(chapter, 'admin'));
        return story_result_builder_1.StoryResultBuilder.storyChapterToDto(storyChapter, storyId);
    }
    async getStories() {
        const storySaga = await this.storyRepository.getStories();
        if (!storySaga) {
            throw new tourii_backend_app_exception_1.TouriiBackendAppException(tourii_backend_app_error_type_1.TouriiBackendAppErrorType.E_TB_023);
        }
        return storySaga.map((story) => story_result_builder_1.StoryResultBuilder.storyToDto(story));
    }
    async getStoryChapters(storyId) {
        const storyChapter = await this.storyRepository.getStoryChaptersByStoryId(storyId);
        if (!storyChapter) {
            throw new tourii_backend_app_exception_1.TouriiBackendAppException(tourii_backend_app_error_type_1.TouriiBackendAppErrorType.E_TB_023);
        }
        return storyChapter.map((storyChapter) => story_result_builder_1.StoryResultBuilder.storyChapterToDto(storyChapter, storyId));
    }
    async updateStory(saga) {
        const updated = await this.storyRepository.updateStory(story_update_request_builder_1.StoryUpdateRequestBuilder.dtoToStory(saga));
        return story_result_builder_1.StoryResultBuilder.storyToDto(updated);
    }
    async updateStoryChapter(chapter) {
        var _a;
        const updated = await this.storyRepository.updateStoryChapter(story_update_request_builder_1.StoryUpdateRequestBuilder.dtoToStoryChapter(chapter));
        return story_result_builder_1.StoryResultBuilder.storyChapterToDto(updated, (_a = updated.sagaName) !== null && _a !== void 0 ? _a : '');
    }
    async createModelRoute(modelRoute) {
        let standardizedRegionName = modelRoute.region;
        try {
            const regionLocationInfo = await this.locationInfoRepository.getLocationInfo(modelRoute.region);
            standardizedRegionName = regionLocationInfo.name;
            common_1.Logger.log(`Using standardized region name: "${standardizedRegionName}" instead of "${modelRoute.region}"`);
        }
        catch (error) {
            common_1.Logger.warn(`Failed to get standardized region name for "${modelRoute.region}": ${error}`);
        }
        const standardizedTouristSpots = await Promise.all(modelRoute.touristSpotList.map(async (spot) => {
            let standardizedSpotName = spot.touristSpotName;
            try {
                const spotLocationInfo = await this.locationInfoRepository.getLocationInfo(spot.touristSpotName);
                standardizedSpotName = spotLocationInfo.name;
                common_1.Logger.log(`Using standardized spot name: "${standardizedSpotName}" instead of "${spot.touristSpotName}"`);
            }
            catch (error) {
                common_1.Logger.warn(`Failed to get standardized name for spot "${spot.touristSpotName}": ${error}`);
            }
            return Object.assign(Object.assign({}, spot), { touristSpotName: standardizedSpotName });
        }));
        const modifiedModelRoute = Object.assign(Object.assign({}, modelRoute), { region: standardizedRegionName, touristSpotList: standardizedTouristSpots });
        const storyEntity = await this.storyRepository.getStoryById(modelRoute.storyId);
        const touristSpotGeoInfoList = await this.geoInfoRepository.getGeoLocationInfoByTouristSpotNameList(standardizedTouristSpots.map((spot) => spot.touristSpotName));
        const regionInfo = await this.geoInfoRepository.getRegionInfoByRegionName(standardizedRegionName);
        const modelRouteEntity = await this.modelRouteRepository.createModelRoute(model_route_create_request_builder_1.ModelRouteCreateRequestBuilder.dtoToModelRoute(modifiedModelRoute, storyEntity, touristSpotGeoInfoList, regionInfo, 'admin'));
        const [currentTouristSpotWeatherList, currentRegionWeather] = await Promise.all([
            this.weatherInfoRepository.getCurrentWeatherByGeoInfoList(touristSpotGeoInfoList),
            this.weatherInfoRepository.getCurrentWeatherByGeoInfoList([regionInfo]),
        ]);
        const currentRegionWeatherInfo = currentRegionWeather[0];
        const modelRouteResponseDto = model_route_result_builder_1.ModelRouteResultBuilder.modelRouteToDto(modelRouteEntity, currentTouristSpotWeatherList, currentRegionWeatherInfo);
        const pairsToUpdate = modelRouteEntity.getValidChapterSpotPairs();
        if (pairsToUpdate.length > 0) {
            await this.updateStoryChaptersWithTouristSpotIds(pairsToUpdate);
        }
        return modelRouteResponseDto;
    }
    async createTouristSpot(touristSpotDto, modelRouteId) {
        let standardizedSpotName = touristSpotDto.touristSpotName;
        try {
            const locationInfo = await this.locationInfoRepository.getLocationInfo(touristSpotDto.touristSpotName);
            standardizedSpotName = locationInfo.name;
            common_1.Logger.log(`Using standardized name: "${standardizedSpotName}" instead of "${touristSpotDto.touristSpotName}"`);
        }
        catch (error) {
            common_1.Logger.warn(`Failed to get standardized name for "${touristSpotDto.touristSpotName}": ${error}`);
        }
        const modelRouteEntity = await this.modelRouteRepository.getModelRouteByModelRouteId(modelRouteId);
        if (!modelRouteEntity.storyId) {
            throw new tourii_backend_app_exception_1.TouriiBackendAppException(tourii_backend_app_error_type_1.TouriiBackendAppErrorType.E_TB_023);
        }
        const storyEntity = await this.storyRepository.getStoryById(modelRouteEntity.storyId);
        const [touristSpotGeoInfo] = await this.geoInfoRepository.getGeoLocationInfoByTouristSpotNameList([
            standardizedSpotName,
        ]);
        const modifiedDto = Object.assign(Object.assign({}, touristSpotDto), { touristSpotName: standardizedSpotName });
        const touristSpotEntityInstance = model_route_create_request_builder_1.ModelRouteCreateRequestBuilder.dtoToTouristSpot([modifiedDto], [touristSpotGeoInfo], storyEntity, 'admin')[0];
        const createdTouristSpotEntity = await this.modelRouteRepository.createTouristSpot(touristSpotEntityInstance, modelRouteId);
        const [currentTouristSpotWeatherInfo] = await this.weatherInfoRepository.getCurrentWeatherByGeoInfoList([
            touristSpotGeoInfo,
        ]);
        const touristSpotResponseDto = model_route_result_builder_1.ModelRouteResultBuilder.touristSpotToDto(createdTouristSpotEntity, [
            currentTouristSpotWeatherInfo,
        ]);
        if (createdTouristSpotEntity.touristSpotId && createdTouristSpotEntity.storyChapterId) {
            await this.updateStoryChaptersWithTouristSpotIds([
                {
                    storyChapterId: createdTouristSpotEntity.storyChapterId,
                    touristSpotId: createdTouristSpotEntity.touristSpotId,
                },
            ]);
        }
        return touristSpotResponseDto;
    }
    async fetchQuestsWithPagination(page, limit, isPremium, isUnlocked, questType) {
        const quests = await this.questRepository.fetchQuestsWithPagination(page, limit, isPremium, isUnlocked, questType);
        return quest_result_builder_1.QuestResultBuilder.questWithPaginationToDto(quests);
    }
    async getQuestById(questId) {
        const quest = await this.questRepository.fetchQuestById(questId);
        return quest_result_builder_1.QuestResultBuilder.questToDto(quest);
    }
    async createQuest(dto) {
        const questEntity = quest_create_request_builder_1.QuestCreateRequestBuilder.dtoToQuest(dto, 'admin');
        const created = await this.questRepository.createQuest(questEntity);
        return quest_result_builder_1.QuestResultBuilder.questToDto(created);
    }
    async createQuestTask(questId, dto) {
        const taskEntity = quest_create_request_builder_1.QuestCreateRequestBuilder.dtoToQuestTask(dto, questId, 'admin');
        const created = await this.questRepository.createQuestTask(taskEntity);
        return quest_result_builder_1.QuestResultBuilder.taskToDto(created);
    }
    async updateQuest(quest) {
        const current = await this.questRepository.fetchQuestById(quest.questId);
        const questEntity = quest_update_request_builder_1.QuestUpdateRequestBuilder.dtoToQuest(quest, current);
        const updated = await this.questRepository.updateQuest(questEntity);
        if (quest.taskList && quest.taskList.length > 0 && current.tasks) {
            const taskMap = new Map(current.tasks.map((t) => [t.taskId, t]));
            await Promise.all(quest.taskList.map((taskDto) => {
                const baseTask = taskMap.get(taskDto.taskId);
                return baseTask
                    ? this.questRepository.updateQuestTask(quest_update_request_builder_1.QuestUpdateRequestBuilder.dtoToQuestTask(taskDto, baseTask))
                    : Promise.resolve();
            }));
        }
        return quest_result_builder_1.QuestResultBuilder.questToDto(updated);
    }
    async updateQuestTask(task) {
        var _a;
        const current = await this.questRepository.fetchQuestById(task.questId);
        const baseTask = (_a = current.tasks) === null || _a === void 0 ? void 0 : _a.find((t) => t.taskId === task.taskId);
        if (!baseTask) {
            throw new tourii_backend_app_exception_1.TouriiBackendAppException(tourii_backend_app_error_type_1.TouriiBackendAppErrorType.E_TB_023);
        }
        const taskEntity = quest_update_request_builder_1.QuestUpdateRequestBuilder.dtoToQuestTask(task, baseTask);
        const updated = await this.questRepository.updateQuestTask(taskEntity);
        return quest_result_builder_1.QuestResultBuilder.taskToDto(updated);
    }
    async updateModelRoute(modelRoute) {
        let standardizedRegionName = modelRoute.region;
        if (modelRoute.region) {
            try {
                const regionLocationInfo = await this.locationInfoRepository.getLocationInfo(modelRoute.region);
                standardizedRegionName = regionLocationInfo.name;
                common_1.Logger.log(`Using standardized region name: "${standardizedRegionName}" instead of "${modelRoute.region}"`);
            }
            catch (error) {
                common_1.Logger.warn(`Failed to get standardized region name for "${modelRoute.region}": ${error}`);
            }
        }
        let standardizedTouristSpots = modelRoute.touristSpotList;
        if (modelRoute.touristSpotList && modelRoute.touristSpotList.length > 0) {
            standardizedTouristSpots = await Promise.all(modelRoute.touristSpotList.map(async (spot) => {
                let standardizedSpotName = spot.touristSpotName;
                if (spot.touristSpotName) {
                    try {
                        const spotLocationInfo = await this.locationInfoRepository.getLocationInfo(spot.touristSpotName);
                        standardizedSpotName = spotLocationInfo.name;
                        common_1.Logger.log(`Using standardized spot name: "${standardizedSpotName}" instead of "${spot.touristSpotName}"`);
                    }
                    catch (error) {
                        common_1.Logger.warn(`Failed to get standardized name for spot "${spot.touristSpotName}": ${error}`);
                    }
                }
                return Object.assign(Object.assign({}, spot), { touristSpotName: standardizedSpotName });
            }));
        }
        const modifiedModelRoute = Object.assign(Object.assign({}, modelRoute), { region: standardizedRegionName, touristSpotList: standardizedTouristSpots });
        const updated = await this.modelRouteRepository.updateModelRoute(model_route_update_request_builder_1.ModelRouteUpdateRequestBuilder.dtoToModelRoute(modifiedModelRoute));
        if (!updated.modelRouteId) {
            throw new tourii_backend_app_exception_1.TouriiBackendAppException(tourii_backend_app_error_type_1.TouriiBackendAppErrorType.E_TB_027);
        }
        return this.getModelRouteById(updated.modelRouteId);
    }
    async updateTouristSpot(touristSpot) {
        let standardizedTouristSpot = touristSpot;
        if (touristSpot.touristSpotName) {
            let standardizedSpotName = touristSpot.touristSpotName;
            try {
                const locationInfo = await this.locationInfoRepository.getLocationInfo(touristSpot.touristSpotName);
                standardizedSpotName = locationInfo.name;
                common_1.Logger.log(`Using standardized name: "${standardizedSpotName}" instead of "${touristSpot.touristSpotName}"`);
            }
            catch (error) {
                common_1.Logger.warn(`Failed to get standardized name for "${touristSpot.touristSpotName}": ${error}`);
            }
            standardizedTouristSpot = Object.assign(Object.assign({}, touristSpot), { touristSpotName: standardizedSpotName });
        }
        const updated = await this.modelRouteRepository.updateTouristSpot(tourist_spot_update_request_builder_1.TouristSpotUpdateRequestBuilder.dtoToTouristSpot(standardizedTouristSpot));
        if (updated.touristSpotId && updated.storyChapterId) {
            await this.updateStoryChaptersWithTouristSpotIds([
                {
                    storyChapterId: updated.storyChapterId,
                    touristSpotId: updated.touristSpotId,
                },
            ]);
        }
        if (!updated.touristSpotName || updated.touristSpotName.trim() === '') {
            throw new tourii_backend_app_exception_1.TouriiBackendAppException(tourii_backend_app_error_type_1.TouriiBackendAppErrorType.E_TB_001);
        }
        let geoInfo;
        try {
            const geoInfoList = await this.geoInfoRepository.getGeoLocationInfoByTouristSpotNameList([
                updated.touristSpotName,
            ]);
            if (!geoInfoList || geoInfoList.length === 0) {
                throw new tourii_backend_app_exception_1.TouriiBackendAppException(tourii_backend_app_error_type_1.TouriiBackendAppErrorType.E_TB_025);
            }
            geoInfo = geoInfoList[0];
        }
        catch (error) {
            if (error instanceof tourii_backend_app_exception_1.TouriiBackendAppException)
                throw error;
            throw new tourii_backend_app_exception_1.TouriiBackendAppException(tourii_backend_app_error_type_1.TouriiBackendAppErrorType.E_GEO_004);
        }
        let weatherInfo;
        try {
            const weatherInfoList = await this.weatherInfoRepository.getCurrentWeatherByGeoInfoList([geoInfo]);
            if (!weatherInfoList || weatherInfoList.length === 0) {
                throw new tourii_backend_app_exception_1.TouriiBackendAppException(tourii_backend_app_error_type_1.TouriiBackendAppErrorType.E_TB_026);
            }
            weatherInfo = weatherInfoList[0];
        }
        catch (error) {
            if (error instanceof tourii_backend_app_exception_1.TouriiBackendAppException)
                throw error;
            throw new tourii_backend_app_exception_1.TouriiBackendAppException(tourii_backend_app_error_type_1.TouriiBackendAppErrorType.E_WEATHER_004);
        }
        return model_route_result_builder_1.ModelRouteResultBuilder.touristSpotToDto(updated, [weatherInfo]);
    }
    async signupUser(email, socialProvider, socialId, ipAddress) {
        var _a;
        const wallet = ethers_1.ethers.Wallet.createRandom();
        const encryptedPrivateKey = this.encryptionRepository.encryptString(wallet.privateKey);
        const userEntity = user_create_builder_1.UserCreateBuilder.fromSignup(email, socialProvider, socialId, wallet.address, encryptedPrivateKey, ipAddress);
        try {
            await this.passportRepository.mint(wallet.address);
        }
        catch (error) {
            common_1.Logger.warn(`Passport mint failed: ${error}`, 'TouriiBackendService');
        }
        const created = await this.userRepository.createUser(userEntity);
        return {
            userId: (_a = created.userId) !== null && _a !== void 0 ? _a : '',
            walletAddress: wallet.address,
        };
    }
    async getModelRoutes() {
        var _a, _b;
        const modelRouteEntities = await this.modelRouteRepository.getModelRoutes();
        if (!modelRouteEntities || modelRouteEntities.length === 0) {
            return [];
        }
        const allSpotNames = new Set();
        const allRegionNames = new Set();
        for (const entity of modelRouteEntities) {
            if (entity.region) {
                allRegionNames.add(entity.region);
            }
            (_a = entity.touristSpotList) === null || _a === void 0 ? void 0 : _a.forEach((spot) => {
                if (spot.touristSpotName) {
                    allSpotNames.add(spot.touristSpotName);
                }
            });
        }
        const uniqueSpotNames = Array.from(allSpotNames);
        const uniqueRegionNames = Array.from(allRegionNames);
        let spotGeoInfos = [];
        let regionGeoInfos = [];
        try {
            if (uniqueSpotNames.length > 0) {
                spotGeoInfos =
                    await this.geoInfoRepository.getGeoLocationInfoByTouristSpotNameList(uniqueSpotNames);
                if (spotGeoInfos.length !== uniqueSpotNames.length) {
                    throw new tourii_backend_app_exception_1.TouriiBackendAppException(tourii_backend_app_error_type_1.TouriiBackendAppErrorType.E_TB_025);
                }
            }
            if (uniqueRegionNames.length > 0) {
                regionGeoInfos = await Promise.all(uniqueRegionNames.map(async (name) => {
                    const regionGeo = await this.geoInfoRepository.getRegionInfoByRegionName(name);
                    if (!regionGeo)
                        throw new tourii_backend_app_exception_1.TouriiBackendAppException(tourii_backend_app_error_type_1.TouriiBackendAppErrorType.E_TB_025);
                    return regionGeo;
                }));
            }
        }
        catch (error) {
            if (error instanceof tourii_backend_app_exception_1.TouriiBackendAppException)
                throw error;
            throw new tourii_backend_app_exception_1.TouriiBackendAppException(tourii_backend_app_error_type_1.TouriiBackendAppErrorType.E_GEO_004);
        }
        const spotGeoInfoMap = new Map(spotGeoInfos.map((geo) => [geo.touristSpotName, geo]));
        const regionGeoInfoMap = new Map(regionGeoInfos.map((geo) => [geo.touristSpotName, geo]));
        const allGeoInfosForWeatherFetch = [...spotGeoInfos, ...regionGeoInfos].filter((geo) => !!geo);
        const weatherInfoMap = new Map();
        try {
            if (allGeoInfosForWeatherFetch.length > 0) {
                const fetchedWeatherInfos = await this.weatherInfoRepository.getCurrentWeatherByGeoInfoList(allGeoInfosForWeatherFetch);
                if (fetchedWeatherInfos.length !== allGeoInfosForWeatherFetch.length) {
                    common_1.Logger.error(`Weather not found for tourist spot: ${allGeoInfosForWeatherFetch.length} ${fetchedWeatherInfos.length}`, 'TouriiBackendService');
                    throw new tourii_backend_app_exception_1.TouriiBackendAppException(tourii_backend_app_error_type_1.TouriiBackendAppErrorType.E_TB_026);
                }
                fetchedWeatherInfos.forEach((weather) => {
                    if (weather.touristSpotName) {
                        weatherInfoMap.set(weather.touristSpotName, weather);
                    }
                    else {
                        throw new tourii_backend_app_exception_1.TouriiBackendAppException(tourii_backend_app_error_type_1.TouriiBackendAppErrorType.E_TB_001);
                    }
                });
            }
        }
        catch (error) {
            if (error instanceof tourii_backend_app_exception_1.TouriiBackendAppException)
                throw error;
            throw new tourii_backend_app_exception_1.TouriiBackendAppException(tourii_backend_app_error_type_1.TouriiBackendAppErrorType.E_WEATHER_004);
        }
        const responseDtos = [];
        for (const entity of modelRouteEntities) {
            if (!entity.modelRouteId || !entity.region || !entity.touristSpotList) {
                throw new tourii_backend_app_exception_1.TouriiBackendAppException(tourii_backend_app_error_type_1.TouriiBackendAppErrorType.E_TB_027);
            }
            const currentTouristSpotGeoInfos = [];
            (_b = entity.touristSpotList) === null || _b === void 0 ? void 0 : _b.forEach((spot) => {
                if (spot.touristSpotName) {
                    const geo = spotGeoInfoMap.get(spot.touristSpotName);
                    if (geo) {
                        currentTouristSpotGeoInfos.push(geo);
                    }
                    else {
                        throw new tourii_backend_app_exception_1.TouriiBackendAppException(tourii_backend_app_error_type_1.TouriiBackendAppErrorType.E_TB_025);
                    }
                }
                else {
                    throw new tourii_backend_app_exception_1.TouriiBackendAppException(tourii_backend_app_error_type_1.TouriiBackendAppErrorType.E_TB_001);
                }
            });
            const currentRegionGeoInfo = regionGeoInfoMap.get(entity.region);
            if (!currentRegionGeoInfo) {
                throw new tourii_backend_app_exception_1.TouriiBackendAppException(tourii_backend_app_error_type_1.TouriiBackendAppErrorType.E_TB_025);
            }
            const currentTouristSpotWeatherList = [];
            currentTouristSpotGeoInfos.forEach((geo) => {
                const weather = weatherInfoMap.get(geo.touristSpotName);
                if (weather) {
                    currentTouristSpotWeatherList.push(weather);
                }
                else {
                    common_1.Logger.error(`Weather not found for tourist spot: ${geo.touristSpotName} ${geo.touristSpotName}`, 'TouriiBackendService');
                    throw new tourii_backend_app_exception_1.TouriiBackendAppException(tourii_backend_app_error_type_1.TouriiBackendAppErrorType.E_TB_026);
                }
            });
            let currentRegionWeatherInfo;
            if (currentRegionGeoInfo) {
                common_1.Logger.debug(`Looking for weather for region: "${currentRegionGeoInfo.touristSpotName}"`);
                common_1.Logger.debug(`Available weather keys: ${Array.from(weatherInfoMap.keys()).join(', ')}`);
                currentRegionWeatherInfo = weatherInfoMap.get(currentRegionGeoInfo.touristSpotName);
                if (!currentRegionWeatherInfo) {
                    const regionNameLower = currentRegionGeoInfo.touristSpotName.toLowerCase();
                    for (const [key, weather] of weatherInfoMap.entries()) {
                        if (key.toLowerCase() === regionNameLower) {
                            currentRegionWeatherInfo = weather;
                            common_1.Logger.debug(`Found weather using case-insensitive match: "${key}" for region "${currentRegionGeoInfo.touristSpotName}"`);
                            break;
                        }
                    }
                }
                if (!currentRegionWeatherInfo) {
                    const regionNameLower = currentRegionGeoInfo.touristSpotName.toLowerCase();
                    for (const [key, weather] of weatherInfoMap.entries()) {
                        const keyLower = key.toLowerCase();
                        if (keyLower.includes(regionNameLower) ||
                            regionNameLower.includes(keyLower)) {
                            currentRegionWeatherInfo = weather;
                            common_1.Logger.debug(`Found weather using partial match: "${key}" for region "${currentRegionGeoInfo.touristSpotName}"`);
                            break;
                        }
                    }
                }
            }
            if (!currentRegionWeatherInfo) {
                common_1.Logger.error(`Weather not found for region: "${currentRegionGeoInfo.touristSpotName}". Available keys: [${Array.from(weatherInfoMap.keys()).join(', ')}]`, 'TouriiBackendService');
                throw new tourii_backend_app_exception_1.TouriiBackendAppException(tourii_backend_app_error_type_1.TouriiBackendAppErrorType.E_TB_026);
            }
            responseDtos.push(model_route_result_builder_1.ModelRouteResultBuilder.modelRouteToDto(entity, currentTouristSpotWeatherList, currentRegionWeatherInfo));
        }
        return responseDtos;
    }
    async getModelRouteById(modelRouteId) {
        const modelRouteEntity = await this.modelRouteRepository.getModelRouteByModelRouteId(modelRouteId);
        if (!modelRouteEntity.region || !modelRouteEntity.touristSpotList) {
            throw new tourii_backend_app_exception_1.TouriiBackendAppException(tourii_backend_app_error_type_1.TouriiBackendAppErrorType.E_TB_027);
        }
        const spotNames = modelRouteEntity.touristSpotList
            .map((spot) => spot.touristSpotName)
            .filter((name) => typeof name === 'string');
        if (spotNames.length !== modelRouteEntity.touristSpotList.length) {
            throw new tourii_backend_app_exception_1.TouriiBackendAppException(tourii_backend_app_error_type_1.TouriiBackendAppErrorType.E_TB_001);
        }
        const [touristSpotGeoInfoList, regionGeoInfo] = await Promise.all([
            this.geoInfoRepository
                .getGeoLocationInfoByTouristSpotNameList(spotNames)
                .then((geos) => {
                if (geos.length !== spotNames.length)
                    throw new tourii_backend_app_exception_1.TouriiBackendAppException(tourii_backend_app_error_type_1.TouriiBackendAppErrorType.E_TB_025);
                return geos;
            }),
            this.geoInfoRepository
                .getRegionInfoByRegionName(modelRouteEntity.region)
                .then((geo) => {
                if (!geo)
                    throw new tourii_backend_app_exception_1.TouriiBackendAppException(tourii_backend_app_error_type_1.TouriiBackendAppErrorType.E_TB_025);
                return geo;
            }),
        ]).catch((error) => {
            if (error instanceof tourii_backend_app_exception_1.TouriiBackendAppException)
                throw error;
            throw new tourii_backend_app_exception_1.TouriiBackendAppException(tourii_backend_app_error_type_1.TouriiBackendAppErrorType.E_GEO_004);
        });
        const allGeoInfosForWeather = [...touristSpotGeoInfoList, regionGeoInfo];
        const weatherInfos = await this.weatherInfoRepository
            .getCurrentWeatherByGeoInfoList(allGeoInfosForWeather)
            .catch((error) => {
            if (error instanceof tourii_backend_app_exception_1.TouriiBackendAppException)
                throw error;
            throw new tourii_backend_app_exception_1.TouriiBackendAppException(tourii_backend_app_error_type_1.TouriiBackendAppErrorType.E_WEATHER_004);
        });
        if (weatherInfos.length !== allGeoInfosForWeather.length) {
            throw new tourii_backend_app_exception_1.TouriiBackendAppException(tourii_backend_app_error_type_1.TouriiBackendAppErrorType.E_TB_026);
        }
        const currentTouristSpotWeatherList = weatherInfos.slice(0, touristSpotGeoInfoList.length);
        const currentRegionWeatherInfo = weatherInfos[touristSpotGeoInfoList.length];
        return model_route_result_builder_1.ModelRouteResultBuilder.modelRouteToDto(modelRouteEntity, currentTouristSpotWeatherList, currentRegionWeatherInfo);
    }
    async createUser(user) {
        return this.userRepository.createUser(user);
    }
    async loginUser(login) {
        let user;
        if (login.username) {
            user = await this.userRepository.getUserByUsername(login.username);
        }
        if (!user && login.passportWalletAddress) {
            user = await this.userRepository.getUserByPassportWallet(login.passportWalletAddress);
        }
        if (!user && login.discordId) {
            user = await this.userRepository.getUserByDiscordId(login.discordId);
        }
        if (!user && login.googleEmail) {
            user = await this.userRepository.getUserByGoogleEmail(login.googleEmail);
        }
        if (!user) {
            throw new tourii_backend_app_exception_1.TouriiBackendAppException(tourii_backend_app_error_type_1.TouriiBackendAppErrorType.E_TB_004);
        }
        if (user.password !== login.password) {
            throw new tourii_backend_app_exception_1.TouriiBackendAppException(tourii_backend_app_error_type_1.TouriiBackendAppErrorType.E_TB_005);
        }
        if ((login.passportWalletAddress &&
            user.passportWalletAddress !== login.passportWalletAddress) ||
            (login.discordId && user.discordId !== login.discordId) ||
            (login.googleEmail && user.googleEmail !== login.googleEmail)) {
            throw new tourii_backend_app_exception_1.TouriiBackendAppException(tourii_backend_app_error_type_1.TouriiBackendAppErrorType.E_TB_005);
        }
        return user;
    }
    async getGroupMembers(questId) {
        return this.groupQuestRepository.getGroupMembers(questId);
    }
    async startGroupQuest(questId, leaderId) {
        if (!leaderId || typeof leaderId !== 'string' || leaderId.trim() === '') {
            throw new tourii_backend_app_exception_1.TouriiBackendAppException(tourii_backend_app_error_type_1.TouriiBackendAppErrorType.E_TB_001);
        }
        const group = await this.getGroupMembers(questId);
        if (!group.leaderUserId || group.leaderUserId.trim() === '') {
            throw new tourii_backend_app_exception_1.TouriiBackendAppException(tourii_backend_app_error_type_1.TouriiBackendAppErrorType.E_TB_004);
        }
        if (group.leaderUserId !== leaderId) {
            common_1.Logger.warn(`Unauthorized quest start attempt. Quest: ${questId}, Leader: ${group.leaderUserId}, Attempted by: ${leaderId}`, 'TouriiBackendService');
            throw new common_1.ForbiddenException('Only leader can start the quest');
        }
        if (group.members.length > 0) {
            await this.groupQuestRepository.updateMembersStatus(questId, group.members.map((m) => m.userId), client_1.QuestStatus.ONGOING);
        }
        this.groupQuestGateway.broadcastQuestStarted(questId);
        return { message: 'Group quest started!' };
    }
    async getLocationInfo(query) {
        return this.locationInfoRepository.getLocationInfo(query);
    }
    async trackChapterProgress(userId, chapterId, status) {
        await this.userStoryLogRepository.trackProgress(userId, chapterId, status);
    }
    async updateStoryChaptersWithTouristSpotIds(pairs) {
        if (!pairs || pairs.length === 0) {
            return;
        }
        const isUpdated = await this.storyRepository.updateTouristSpotIdListInStoryChapter(pairs);
        if (!isUpdated) {
            throw new tourii_backend_app_exception_1.TouriiBackendAppException(tourii_backend_app_error_type_1.TouriiBackendAppErrorType.E_TB_024);
        }
    }
};
exports.TouriiBackendService = TouriiBackendService;
exports.TouriiBackendService = TouriiBackendService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, common_1.Inject)(tourii_backend_constant_1.TouriiBackendConstants.USER_REPOSITORY_TOKEN)),
    __param(1, (0, common_1.Inject)(tourii_backend_constant_1.TouriiBackendConstants.STORY_REPOSITORY_TOKEN)),
    __param(2, (0, common_1.Inject)(tourii_backend_constant_1.TouriiBackendConstants.MODEL_ROUTE_REPOSITORY_TOKEN)),
    __param(3, (0, common_1.Inject)(tourii_backend_constant_1.TouriiBackendConstants.GEO_INFO_REPOSITORY_TOKEN)),
    __param(4, (0, common_1.Inject)(tourii_backend_constant_1.TouriiBackendConstants.WEATHER_INFO_REPOSITORY_TOKEN)),
    __param(5, (0, common_1.Inject)(tourii_backend_constant_1.TouriiBackendConstants.LOCATION_INFO_REPOSITORY_TOKEN)),
    __param(6, (0, common_1.Inject)(tourii_backend_constant_1.TouriiBackendConstants.QUEST_REPOSITORY_TOKEN)),
    __param(7, (0, common_1.Inject)(tourii_backend_constant_1.TouriiBackendConstants.ENCRYPTION_REPOSITORY_TOKEN)),
    __param(8, (0, common_1.Inject)(tourii_backend_constant_1.TouriiBackendConstants.USER_STORY_LOG_REPOSITORY_TOKEN)),
    __param(9, (0, common_1.Inject)(tourii_backend_constant_1.TouriiBackendConstants.DIGITAL_PASSPORT_REPOSITORY_TOKEN)),
    __param(10, (0, common_1.Inject)(tourii_backend_constant_1.TouriiBackendConstants.GROUP_QUEST_REPOSITORY_TOKEN)),
    __metadata("design:paramtypes", [Object, Object, typeof (_a = typeof model_route_repository_1.ModelRouteRepository !== "undefined" && model_route_repository_1.ModelRouteRepository) === "function" ? _a : Object, typeof (_b = typeof geo_info_repository_1.GeoInfoRepository !== "undefined" && geo_info_repository_1.GeoInfoRepository) === "function" ? _b : Object, typeof (_c = typeof weather_info_repository_1.WeatherInfoRepository !== "undefined" && weather_info_repository_1.WeatherInfoRepository) === "function" ? _c : Object, typeof (_d = typeof location_info_repository_1.LocationInfoRepository !== "undefined" && location_info_repository_1.LocationInfoRepository) === "function" ? _d : Object, typeof (_e = typeof quest_repository_1.QuestRepository !== "undefined" && quest_repository_1.QuestRepository) === "function" ? _e : Object, Object, typeof (_f = typeof user_story_log_repository_1.UserStoryLogRepository !== "undefined" && user_story_log_repository_1.UserStoryLogRepository) === "function" ? _f : Object, typeof (_g = typeof digital_passport_repository_1.DigitalPassportRepository !== "undefined" && digital_passport_repository_1.DigitalPassportRepository) === "function" ? _g : Object, typeof (_h = typeof group_quest_repository_1.GroupQuestRepository !== "undefined" && group_quest_repository_1.GroupQuestRepository) === "function" ? _h : Object, typeof (_j = typeof group_quest_gateway_1.GroupQuestGateway !== "undefined" && group_quest_gateway_1.GroupQuestGateway) === "function" ? _j : Object])
], TouriiBackendService);


/***/ }),
/* 80 */
/***/ ((__unused_webpack_module, exports) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));


/***/ }),
/* 81 */
/***/ ((__unused_webpack_module, exports) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));


/***/ }),
/* 82 */
/***/ ((module) => {

module.exports = require("ethers");

/***/ }),
/* 83 */
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
exports.GroupQuestGateway = void 0;
const env_utils_1 = __webpack_require__(28);
const websockets_1 = __webpack_require__(84);
const socket_io_1 = __webpack_require__(85);
let GroupQuestGateway = class GroupQuestGateway {
    handleJoin(socket, data) {
        if (!(data === null || data === void 0 ? void 0 : data.questId) || typeof data.questId !== 'string') {
            socket.emit('error', { message: 'Invalid quest ID' });
            return;
        }
        socket.join(`group_${data.questId}`);
        socket.emit('joinedGroup', { questId: data.questId });
    }
    handleReady(socket, data) {
        if (!(data === null || data === void 0 ? void 0 : data.questId) ||
            !(data === null || data === void 0 ? void 0 : data.userId) ||
            typeof data.questId !== 'string' ||
            typeof data.userId !== 'string') {
            socket.emit('error', { message: 'Invalid quest ID or user ID' });
            return;
        }
        this.server.to(`group_${data.questId}`).emit('memberReady', { userId: data.userId });
    }
    broadcastQuestStarted(questId) {
        if (!questId || typeof questId !== 'string') {
            return;
        }
        this.server.to(`group_${questId}`).emit('questStarted');
    }
};
exports.GroupQuestGateway = GroupQuestGateway;
__decorate([
    (0, websockets_1.WebSocketServer)(),
    __metadata("design:type", typeof (_a = typeof socket_io_1.Server !== "undefined" && socket_io_1.Server) === "function" ? _a : Object)
], GroupQuestGateway.prototype, "server", void 0);
__decorate([
    (0, websockets_1.SubscribeMessage)('joinGroup'),
    __param(0, (0, websockets_1.ConnectedSocket)()),
    __param(1, (0, websockets_1.MessageBody)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [typeof (_b = typeof socket_io_1.Socket !== "undefined" && socket_io_1.Socket) === "function" ? _b : Object, Object]),
    __metadata("design:returntype", void 0)
], GroupQuestGateway.prototype, "handleJoin", null);
__decorate([
    (0, websockets_1.SubscribeMessage)('ready'),
    __param(0, (0, websockets_1.ConnectedSocket)()),
    __param(1, (0, websockets_1.MessageBody)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [typeof (_c = typeof socket_io_1.Socket !== "undefined" && socket_io_1.Socket) === "function" ? _c : Object, Object]),
    __metadata("design:returntype", void 0)
], GroupQuestGateway.prototype, "handleReady", null);
exports.GroupQuestGateway = GroupQuestGateway = __decorate([
    (0, websockets_1.WebSocketGateway)({
        namespace: '/group-quest',
        cors: {
            origin: (0, env_utils_1.getEnv)({ key: 'NODE_ENV', defaultValue: 'dev' }) === 'production'
                ? ['https://tourii.xyz', 'https://*.tourii.xyz']
                : '*',
            credentials: true,
        },
    })
], GroupQuestGateway);


/***/ }),
/* 84 */
/***/ ((module) => {

module.exports = require("@nestjs/websockets");

/***/ }),
/* 85 */
/***/ ((module) => {

module.exports = require("socket.io");

/***/ }),
/* 86 */
/***/ ((__unused_webpack_module, exports) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.TouriiBackendConstants = void 0;
var TouriiBackendConstants;
(function (TouriiBackendConstants) {
    TouriiBackendConstants["USER_REPOSITORY_TOKEN"] = "USER_REPOSITORY_TOKEN";
    TouriiBackendConstants["CONTEXT_PROVIDER_TOKEN"] = "CONTEXT_PROVIDER_TOKEN";
    TouriiBackendConstants["STORY_REPOSITORY_TOKEN"] = "STORY_REPOSITORY_TOKEN";
    TouriiBackendConstants["QUEST_REPOSITORY_TOKEN"] = "QUEST_REPOSITORY_TOKEN";
    TouriiBackendConstants["MODEL_ROUTE_REPOSITORY_TOKEN"] = "MODEL_ROUTE_REPOSITORY_TOKEN";
    TouriiBackendConstants["GEO_INFO_REPOSITORY_TOKEN"] = "GEO_INFO_REPOSITORY_TOKEN";
    TouriiBackendConstants["WEATHER_INFO_REPOSITORY_TOKEN"] = "WEATHER_INFO_REPOSITORY_TOKEN";
    TouriiBackendConstants["LOCATION_INFO_REPOSITORY_TOKEN"] = "LOCATION_INFO_REPOSITORY_TOKEN";
    TouriiBackendConstants["ENCRYPTION_REPOSITORY_TOKEN"] = "ENCRYPTION_REPOSITORY_TOKEN";
    TouriiBackendConstants["DIGITAL_PASSPORT_REPOSITORY_TOKEN"] = "DIGITAL_PASSPORT_REPOSITORY_TOKEN";
    TouriiBackendConstants["USER_STORY_LOG_REPOSITORY_TOKEN"] = "USER_STORY_LOG_REPOSITORY_TOKEN";
    TouriiBackendConstants["GROUP_QUEST_REPOSITORY_TOKEN"] = "GROUP_QUEST_REPOSITORY_TOKEN";
})(TouriiBackendConstants || (exports.TouriiBackendConstants = TouriiBackendConstants = {}));


/***/ }),
/* 87 */
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.ModelRouteCreateRequestBuilder = void 0;
const model_route_entity_1 = __webpack_require__(30);
const tourist_spot_1 = __webpack_require__(33);
const context_storage_1 = __webpack_require__(16);
const common_1 = __webpack_require__(4);
class ModelRouteCreateRequestBuilder {
    static dtoToTouristSpot(dto, geoInfoList, storyEntity, insUserId) {
        const geoInfoMap = new Map();
        geoInfoList.forEach((info) => {
            if (info.touristSpotName) {
                geoInfoMap.set(info.touristSpotName, info);
            }
        });
        return dto.map((spotDto) => {
            var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k;
            const matchingGeoInfo = geoInfoMap.get(spotDto.touristSpotName);
            const storyChapterLink = `/v2/touriiverse/${storyEntity.id}/chapters/${spotDto.storyChapterId}`;
            if (!matchingGeoInfo) {
                common_1.Logger.warn(`Could not find matching GeoInfo for tourist spot: ${spotDto.touristSpotName}`);
                return new tourist_spot_1.TouristSpot({
                    storyChapterId: spotDto.storyChapterId,
                    touristSpotName: spotDto.touristSpotName,
                    touristSpotDesc: spotDto.touristSpotDesc,
                    bestVisitTime: spotDto.bestVisitTime,
                    touristSpotHashtag: spotDto.touristSpotHashtag,
                    imageSet: (_a = spotDto.imageSet) !== null && _a !== void 0 ? _a : undefined,
                    storyChapterLink: storyChapterLink,
                    updUserId: insUserId,
                    updDateTime: (_c = (_b = context_storage_1.ContextStorage.getStore()) === null || _b === void 0 ? void 0 : _b.getSystemDateTimeJST()) !== null && _c !== void 0 ? _c : new Date(),
                });
            }
            return new tourist_spot_1.TouristSpot({
                storyChapterId: spotDto.storyChapterId,
                touristSpotName: spotDto.touristSpotName,
                touristSpotDesc: spotDto.touristSpotDesc,
                latitude: matchingGeoInfo.latitude,
                longitude: matchingGeoInfo.longitude,
                address: matchingGeoInfo.formattedAddress,
                storyChapterLink: storyChapterLink,
                bestVisitTime: spotDto.bestVisitTime,
                touristSpotHashtag: spotDto.touristSpotHashtag,
                imageSet: (_d = spotDto.imageSet) !== null && _d !== void 0 ? _d : undefined,
                delFlag: false,
                insUserId: insUserId,
                insDateTime: (_f = (_e = context_storage_1.ContextStorage.getStore()) === null || _e === void 0 ? void 0 : _e.getSystemDateTimeJST()) !== null && _f !== void 0 ? _f : new Date(),
                updUserId: insUserId,
                updDateTime: (_h = (_g = context_storage_1.ContextStorage.getStore()) === null || _g === void 0 ? void 0 : _g.getSystemDateTimeJST()) !== null && _h !== void 0 ? _h : new Date(),
                requestId: (_k = (_j = context_storage_1.ContextStorage.getStore()) === null || _j === void 0 ? void 0 : _j.getRequestId()) === null || _k === void 0 ? void 0 : _k.value,
            });
        });
    }
    static dtoToModelRoute(dto, storyEntity, touristSpotGeoInfoList, regionInfo, insUserId) {
        var _a, _b, _c, _d, _e, _f;
        return new model_route_entity_1.ModelRouteEntity({
            storyId: storyEntity.id,
            routeName: dto.routeName,
            region: dto.region,
            regionDesc: dto.regionDesc,
            regionLatitude: regionInfo.latitude,
            regionLongitude: regionInfo.longitude,
            regionBackgroundMedia: dto.regionBackgroundMedia,
            recommendation: dto.recommendation,
            touristSpotList: dto.touristSpotList
                ? ModelRouteCreateRequestBuilder.dtoToTouristSpot(dto.touristSpotList, touristSpotGeoInfoList, storyEntity, insUserId)
                : [],
            delFlag: false,
            insUserId: insUserId,
            insDateTime: (_b = (_a = context_storage_1.ContextStorage.getStore()) === null || _a === void 0 ? void 0 : _a.getSystemDateTimeJST()) !== null && _b !== void 0 ? _b : new Date(),
            updUserId: insUserId,
            updDateTime: (_d = (_c = context_storage_1.ContextStorage.getStore()) === null || _c === void 0 ? void 0 : _c.getSystemDateTimeJST()) !== null && _d !== void 0 ? _d : new Date(),
            requestId: (_f = (_e = context_storage_1.ContextStorage.getStore()) === null || _e === void 0 ? void 0 : _e.getRequestId()) === null || _f === void 0 ? void 0 : _f.value,
        }, undefined);
    }
}
exports.ModelRouteCreateRequestBuilder = ModelRouteCreateRequestBuilder;


/***/ }),
/* 88 */
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.ModelRouteResultBuilder = void 0;
const date_transformer_1 = __webpack_require__(66);
class ModelRouteResultBuilder {
    static touristSpotToDto(touristSpot, currentTouristSpotWeatherList) {
        var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m, _o, _p, _q, _r, _s, _t;
        const weatherInfo = currentTouristSpotWeatherList.find((weather) => weather.touristSpotName === touristSpot.touristSpotName);
        return {
            touristSpotId: (_a = touristSpot.touristSpotId) !== null && _a !== void 0 ? _a : '',
            storyChapterId: (_b = touristSpot.storyChapterId) !== null && _b !== void 0 ? _b : '',
            touristSpotName: (_c = touristSpot.touristSpotName) !== null && _c !== void 0 ? _c : '',
            touristSpotDesc: (_d = touristSpot.touristSpotDesc) !== null && _d !== void 0 ? _d : '',
            touristSpotLatitude: (_e = touristSpot.latitude) !== null && _e !== void 0 ? _e : 0,
            touristSpotLongitude: (_f = touristSpot.longitude) !== null && _f !== void 0 ? _f : 0,
            bestVisitTime: (_g = touristSpot.bestVisitTime) !== null && _g !== void 0 ? _g : '',
            address: (_h = touristSpot.address) !== null && _h !== void 0 ? _h : '',
            storyChapterLink: (_j = touristSpot.storyChapterLink) !== null && _j !== void 0 ? _j : '',
            touristSpotHashtag: (_k = touristSpot.touristSpotHashtag) !== null && _k !== void 0 ? _k : [],
            imageSet: (_l = touristSpot.imageSet) !== null && _l !== void 0 ? _l : { main: '', small: [] },
            weatherInfo: {
                temperatureCelsius: (_m = weatherInfo === null || weatherInfo === void 0 ? void 0 : weatherInfo.temperatureCelsius) !== null && _m !== void 0 ? _m : 0,
                weatherName: (_o = weatherInfo === null || weatherInfo === void 0 ? void 0 : weatherInfo.weatherName) !== null && _o !== void 0 ? _o : '',
                weatherDesc: (_p = weatherInfo === null || weatherInfo === void 0 ? void 0 : weatherInfo.weatherDesc) !== null && _p !== void 0 ? _p : '',
            },
            delFlag: (_q = touristSpot.delFlag) !== null && _q !== void 0 ? _q : false,
            insUserId: (_r = touristSpot.insUserId) !== null && _r !== void 0 ? _r : '',
            insDateTime: (_s = date_transformer_1.TransformDate.transformDateToYYYYMMDDHHmm(touristSpot.insDateTime)) !== null && _s !== void 0 ? _s : '',
            updUserId: touristSpot.updUserId,
            updDateTime: (_t = date_transformer_1.TransformDate.transformDateToYYYYMMDDHHmm(touristSpot.updDateTime)) !== null && _t !== void 0 ? _t : '',
        };
    }
    static modelRouteToDto(modelRoute, currentTouristSpotWeatherList, currentRegionWeatherInfo) {
        var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m, _o, _p, _q, _r, _s, _t, _u;
        return {
            modelRouteId: (_a = modelRoute.modelRouteId) !== null && _a !== void 0 ? _a : '',
            storyId: (_b = modelRoute.storyId) !== null && _b !== void 0 ? _b : '',
            routeName: (_c = modelRoute.routeName) !== null && _c !== void 0 ? _c : '',
            region: (_d = modelRoute.region) !== null && _d !== void 0 ? _d : '',
            regionDesc: (_e = modelRoute.regionDesc) !== null && _e !== void 0 ? _e : '',
            regionLatitude: (_f = modelRoute.regionLatitude) !== null && _f !== void 0 ? _f : 0,
            regionLongitude: (_g = modelRoute.regionLongitude) !== null && _g !== void 0 ? _g : 0,
            regionBackgroundMedia: (_h = modelRoute.regionBackgroundMedia) !== null && _h !== void 0 ? _h : '',
            recommendation: (_j = modelRoute.recommendation) !== null && _j !== void 0 ? _j : [],
            touristSpotList: (_l = (_k = modelRoute.touristSpotList) === null || _k === void 0 ? void 0 : _k.map((touristSpot) => ModelRouteResultBuilder.touristSpotToDto(touristSpot, currentTouristSpotWeatherList))) !== null && _l !== void 0 ? _l : [],
            regionWeatherInfo: {
                regionName: (_m = modelRoute.region) !== null && _m !== void 0 ? _m : '',
                temperatureCelsius: (_o = currentRegionWeatherInfo.temperatureCelsius) !== null && _o !== void 0 ? _o : 0,
                weatherName: (_p = currentRegionWeatherInfo.weatherName) !== null && _p !== void 0 ? _p : '',
                weatherDesc: (_q = currentRegionWeatherInfo.weatherDesc) !== null && _q !== void 0 ? _q : '',
            },
            delFlag: (_r = modelRoute.delFlag) !== null && _r !== void 0 ? _r : false,
            insUserId: (_s = modelRoute.insUserId) !== null && _s !== void 0 ? _s : '',
            insDateTime: (_t = date_transformer_1.TransformDate.transformDateToYYYYMMDDHHmm(modelRoute.insDateTime)) !== null && _t !== void 0 ? _t : '',
            updUserId: modelRoute.updUserId,
            updDateTime: (_u = date_transformer_1.TransformDate.transformDateToYYYYMMDDHHmm(modelRoute.updDateTime)) !== null && _u !== void 0 ? _u : '',
        };
    }
}
exports.ModelRouteResultBuilder = ModelRouteResultBuilder;


/***/ }),
/* 89 */
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.ModelRouteUpdateRequestBuilder = void 0;
const model_route_entity_1 = __webpack_require__(30);
const context_storage_1 = __webpack_require__(16);
class ModelRouteUpdateRequestBuilder {
    static dtoToModelRoute(dto) {
        var _a, _b;
        return new model_route_entity_1.ModelRouteEntity({
            storyId: dto.storyId,
            routeName: dto.routeName,
            region: dto.region,
            regionDesc: dto.regionDesc,
            regionBackgroundMedia: dto.regionBackgroundMedia,
            recommendation: dto.recommendation,
            delFlag: dto.delFlag,
            updUserId: dto.updUserId,
            updDateTime: (_b = (_a = context_storage_1.ContextStorage.getStore()) === null || _a === void 0 ? void 0 : _a.getSystemDateTimeJST()) !== null && _b !== void 0 ? _b : new Date(),
        }, dto.modelRouteId);
    }
}
exports.ModelRouteUpdateRequestBuilder = ModelRouteUpdateRequestBuilder;


/***/ }),
/* 90 */
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.QuestCreateRequestBuilder = void 0;
const quest_entity_1 = __webpack_require__(34);
const task_1 = __webpack_require__(36);
const tourist_spot_1 = __webpack_require__(33);
const context_storage_1 = __webpack_require__(16);
class QuestCreateRequestBuilder {
    static dtoToQuest(dto, insUserId) {
        var _a, _b, _c, _d, _e, _f, _g, _h;
        return new quest_entity_1.QuestEntity({
            questName: dto.questName,
            questDesc: dto.questDesc,
            questType: dto.questType,
            questImage: dto.questImage,
            isUnlocked: dto.isUnlocked,
            isPremium: dto.isPremium,
            totalMagatamaPointAwarded: dto.totalMagatamaPointAwarded,
            rewardType: dto.rewardType,
            delFlag: dto.delFlag,
            insUserId: insUserId,
            insDateTime: (_b = (_a = context_storage_1.ContextStorage.getStore()) === null || _a === void 0 ? void 0 : _a.getSystemDateTimeJST()) !== null && _b !== void 0 ? _b : new Date(),
            updUserId: insUserId,
            updDateTime: (_d = (_c = context_storage_1.ContextStorage.getStore()) === null || _c === void 0 ? void 0 : _c.getSystemDateTimeJST()) !== null && _d !== void 0 ? _d : new Date(),
            requestId: (_f = (_e = context_storage_1.ContextStorage.getStore()) === null || _e === void 0 ? void 0 : _e.getRequestId()) === null || _f === void 0 ? void 0 : _f.value,
            touristSpot: new tourist_spot_1.TouristSpot({
                touristSpotId: dto.touristSpotId,
                updUserId: insUserId,
                updDateTime: (_h = (_g = context_storage_1.ContextStorage.getStore()) === null || _g === void 0 ? void 0 : _g.getSystemDateTimeJST()) !== null && _h !== void 0 ? _h : new Date(),
            }),
            tasks: [],
        }, undefined);
    }
    static dtoToQuestTask(dto, questId, insUserId) {
        var _a, _b, _c, _d, _e, _f;
        return new task_1.Task({
            taskId: '',
            questId: questId,
            taskTheme: dto.taskTheme,
            taskType: dto.taskType,
            taskName: dto.taskName,
            taskDesc: dto.taskDesc,
            isUnlocked: dto.isUnlocked,
            requiredAction: dto.requiredAction,
            groupActivityMembers: dto.groupActivityMembers,
            selectOptions: dto.selectOptions,
            antiCheatRules: dto.antiCheatRules,
            magatamaPointAwarded: dto.magatamaPointAwarded,
            totalMagatamaPointAwarded: dto.totalMagatamaPointAwarded,
            delFlag: dto.delFlag,
            insUserId: insUserId,
            insDateTime: (_b = (_a = context_storage_1.ContextStorage.getStore()) === null || _a === void 0 ? void 0 : _a.getSystemDateTimeJST()) !== null && _b !== void 0 ? _b : new Date(),
            updUserId: insUserId,
            updDateTime: (_d = (_c = context_storage_1.ContextStorage.getStore()) === null || _c === void 0 ? void 0 : _c.getSystemDateTimeJST()) !== null && _d !== void 0 ? _d : new Date(),
            requestId: (_f = (_e = context_storage_1.ContextStorage.getStore()) === null || _e === void 0 ? void 0 : _e.getRequestId()) === null || _f === void 0 ? void 0 : _f.value,
        });
    }
}
exports.QuestCreateRequestBuilder = QuestCreateRequestBuilder;


/***/ }),
/* 91 */
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.QuestResultBuilder = void 0;
const date_transformer_1 = __webpack_require__(66);
const client_1 = __webpack_require__(9);
class QuestResultBuilder {
    static questWithPaginationToDto(questWithPagination) {
        const quest = questWithPagination.quests;
        const pagination = questWithPagination.pagination;
        return {
            quests: quest.map((quest) => {
                var _a, _b, _c, _d, _e, _f, _g, _h, _j;
                return ({
                    questId: (_a = quest.questId) !== null && _a !== void 0 ? _a : '',
                    questName: (_b = quest.questName) !== null && _b !== void 0 ? _b : '',
                    questDesc: (_c = quest.questDesc) !== null && _c !== void 0 ? _c : '',
                    questImage: (_d = quest.questImage) !== null && _d !== void 0 ? _d : '',
                    questType: (_e = quest.questType) !== null && _e !== void 0 ? _e : client_1.QuestType.UNKNOWN,
                    isUnlocked: (_f = quest.isUnlocked) !== null && _f !== void 0 ? _f : false,
                    isPremium: (_g = quest.isPremium) !== null && _g !== void 0 ? _g : false,
                    totalMagatamaPointAwarded: (_h = quest.totalMagatamaPointAwarded) !== null && _h !== void 0 ? _h : 0,
                    tasks: (_j = quest.tasks) === null || _j === void 0 ? void 0 : _j.map((task) => QuestResultBuilder.taskToDto(task)),
                    touristSpot: quest.touristSpot
                        ? QuestResultBuilder.touristSpotToDto(quest.touristSpot)
                        : undefined,
                });
            }),
            pagination: {
                currentPage: pagination.currentPage,
                totalPages: pagination.totalPages,
                totalQuests: pagination.totalQuests,
            },
        };
    }
    static questToDto(quest) {
        var _a, _b, _c, _d, _e, _f, _g, _h, _j;
        return {
            questId: (_a = quest.questId) !== null && _a !== void 0 ? _a : '',
            questName: (_b = quest.questName) !== null && _b !== void 0 ? _b : '',
            questDesc: (_c = quest.questDesc) !== null && _c !== void 0 ? _c : '',
            questImage: (_d = quest.questImage) !== null && _d !== void 0 ? _d : '',
            questType: (_e = quest.questType) !== null && _e !== void 0 ? _e : client_1.QuestType.UNKNOWN,
            isUnlocked: (_f = quest.isUnlocked) !== null && _f !== void 0 ? _f : false,
            isPremium: (_g = quest.isPremium) !== null && _g !== void 0 ? _g : false,
            totalMagatamaPointAwarded: (_h = quest.totalMagatamaPointAwarded) !== null && _h !== void 0 ? _h : 0,
            tasks: (_j = quest.tasks) === null || _j === void 0 ? void 0 : _j.map((task) => QuestResultBuilder.taskToDto(task)),
            touristSpot: quest.touristSpot
                ? QuestResultBuilder.touristSpotToDto(quest.touristSpot)
                : undefined,
        };
    }
    static taskToDto(task) {
        var _a;
        return {
            taskId: (_a = task.taskId) !== null && _a !== void 0 ? _a : '',
            questId: task.questId,
            taskTheme: task.taskTheme,
            taskType: task.taskType,
            taskName: task.taskName,
            taskDesc: task.taskDesc,
            isUnlocked: task.isUnlocked,
            requiredAction: task.requiredAction,
            groupActivityMembers: task.groupActivityMembers,
            selectOptions: task.selectOptions,
            antiCheatRules: task.antiCheatRules,
            magatamaPointAwarded: task.magatamaPointAwarded,
            totalMagatamaPointAwarded: task.totalMagatamaPointAwarded,
        };
    }
    static touristSpotToDto(touristSpot) {
        var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m, _o, _p, _q;
        return {
            touristSpotId: (_a = touristSpot.touristSpotId) !== null && _a !== void 0 ? _a : '',
            storyChapterId: (_b = touristSpot.storyChapterId) !== null && _b !== void 0 ? _b : '',
            touristSpotName: (_c = touristSpot.touristSpotName) !== null && _c !== void 0 ? _c : '',
            touristSpotDesc: (_d = touristSpot.touristSpotDesc) !== null && _d !== void 0 ? _d : '',
            touristSpotLatitude: (_e = touristSpot.latitude) !== null && _e !== void 0 ? _e : 0,
            touristSpotLongitude: (_f = touristSpot.longitude) !== null && _f !== void 0 ? _f : 0,
            bestVisitTime: (_g = touristSpot.bestVisitTime) !== null && _g !== void 0 ? _g : '',
            address: (_h = touristSpot.address) !== null && _h !== void 0 ? _h : '',
            storyChapterLink: (_j = touristSpot.storyChapterLink) !== null && _j !== void 0 ? _j : '',
            touristSpotHashtag: (_k = touristSpot.touristSpotHashtag) !== null && _k !== void 0 ? _k : [],
            imageSet: (_l = touristSpot.imageSet) !== null && _l !== void 0 ? _l : { main: '', small: [] },
            weatherInfo: undefined,
            delFlag: (_m = touristSpot.delFlag) !== null && _m !== void 0 ? _m : false,
            insUserId: (_o = touristSpot.insUserId) !== null && _o !== void 0 ? _o : '',
            insDateTime: (_p = date_transformer_1.TransformDate.transformDateToYYYYMMDDHHmm(touristSpot.insDateTime)) !== null && _p !== void 0 ? _p : '',
            updUserId: touristSpot.updUserId,
            updDateTime: (_q = date_transformer_1.TransformDate.transformDateToYYYYMMDDHHmm(touristSpot.updDateTime)) !== null && _q !== void 0 ? _q : '',
        };
    }
}
exports.QuestResultBuilder = QuestResultBuilder;


/***/ }),
/* 92 */
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.QuestUpdateRequestBuilder = void 0;
const quest_entity_1 = __webpack_require__(34);
const task_1 = __webpack_require__(36);
const context_storage_1 = __webpack_require__(16);
class QuestUpdateRequestBuilder {
    static dtoToQuest(dto, base) {
        var _a, _b;
        return new quest_entity_1.QuestEntity({
            questName: dto.questName,
            questDesc: dto.questDesc,
            questType: dto.questType,
            questImage: dto.questImage,
            isUnlocked: dto.isUnlocked,
            isPremium: dto.isPremium,
            totalMagatamaPointAwarded: dto.totalMagatamaPointAwarded,
            rewardType: dto.rewardType,
            delFlag: dto.delFlag,
            insUserId: base.insUserId,
            insDateTime: base.insDateTime,
            updUserId: dto.updUserId,
            updDateTime: (_b = (_a = context_storage_1.ContextStorage.getStore()) === null || _a === void 0 ? void 0 : _a.getSystemDateTimeJST()) !== null && _b !== void 0 ? _b : new Date(),
            requestId: base.requestId,
            tasks: base.tasks,
            touristSpot: base.touristSpot,
        }, dto.questId);
    }
    static dtoToQuestTask(dto, base) {
        var _a, _b;
        return new task_1.Task({
            taskId: dto.taskId,
            questId: dto.questId,
            taskTheme: dto.taskTheme,
            taskType: dto.taskType,
            taskName: dto.taskName,
            taskDesc: dto.taskDesc,
            isUnlocked: dto.isUnlocked,
            requiredAction: dto.requiredAction,
            groupActivityMembers: dto.groupActivityMembers,
            selectOptions: dto.selectOptions,
            antiCheatRules: dto.antiCheatRules,
            magatamaPointAwarded: dto.magatamaPointAwarded,
            totalMagatamaPointAwarded: dto.totalMagatamaPointAwarded,
            delFlag: dto.delFlag,
            insUserId: base.insUserId,
            insDateTime: base.insDateTime,
            updUserId: dto.updUserId,
            updDateTime: (_b = (_a = context_storage_1.ContextStorage.getStore()) === null || _a === void 0 ? void 0 : _a.getSystemDateTimeJST()) !== null && _b !== void 0 ? _b : new Date(),
            requestId: base.requestId,
        });
    }
}
exports.QuestUpdateRequestBuilder = QuestUpdateRequestBuilder;


/***/ }),
/* 93 */
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.StoryCreateRequestBuilder = void 0;
const chapter_story_1 = __webpack_require__(37);
const story_entity_1 = __webpack_require__(38);
const context_storage_1 = __webpack_require__(16);
class StoryCreateRequestBuilder {
    static dtoToStoryChapter(dto, insUserId) {
        var _a, _b, _c, _d, _e, _f;
        return new chapter_story_1.StoryChapter({
            touristSpotId: dto.touristSpotId,
            chapterNumber: dto.chapterNumber,
            chapterTitle: dto.chapterTitle,
            chapterDesc: dto.chapterDesc,
            chapterImage: dto.chapterImage,
            characterNameList: dto.characterNameList,
            realWorldImage: dto.realWorldImage,
            chapterVideoUrl: dto.chapterVideoUrl,
            chapterVideoMobileUrl: dto.chapterVideoMobileUrl,
            chapterPdfUrl: dto.chapterPdfUrl,
            isUnlocked: dto.isUnlocked,
            delFlag: false,
            insUserId: insUserId,
            insDateTime: (_b = (_a = context_storage_1.ContextStorage.getStore()) === null || _a === void 0 ? void 0 : _a.getSystemDateTimeJST()) !== null && _b !== void 0 ? _b : new Date(),
            updUserId: insUserId,
            updDateTime: (_d = (_c = context_storage_1.ContextStorage.getStore()) === null || _c === void 0 ? void 0 : _c.getSystemDateTimeJST()) !== null && _d !== void 0 ? _d : new Date(),
            requestId: (_f = (_e = context_storage_1.ContextStorage.getStore()) === null || _e === void 0 ? void 0 : _e.getRequestId()) === null || _f === void 0 ? void 0 : _f.value,
        });
    }
    static dtoToStory(dto, insUserId) {
        var _a, _b, _c, _d, _e, _f, _g;
        const processedChapterList = (_a = dto.chapterList) === null || _a === void 0 ? void 0 : _a.map((chapterDto) => StoryCreateRequestBuilder.dtoToStoryChapter(chapterDto, insUserId));
        return new story_entity_1.StoryEntity({
            sagaName: dto.sagaName,
            sagaDesc: dto.sagaDesc,
            backgroundMedia: dto.backgroundMedia,
            mapImage: dto.mapImage,
            location: dto.location,
            order: dto.order,
            isPrologue: dto.isPrologue,
            isSelected: dto.isSelected,
            chapterList: processedChapterList,
            delFlag: false,
            insUserId: insUserId,
            insDateTime: (_c = (_b = context_storage_1.ContextStorage.getStore()) === null || _b === void 0 ? void 0 : _b.getSystemDateTimeJST()) !== null && _c !== void 0 ? _c : new Date(),
            updUserId: insUserId,
            updDateTime: (_e = (_d = context_storage_1.ContextStorage.getStore()) === null || _d === void 0 ? void 0 : _d.getSystemDateTimeJST()) !== null && _e !== void 0 ? _e : new Date(),
            requestId: (_g = (_f = context_storage_1.ContextStorage.getStore()) === null || _f === void 0 ? void 0 : _f.getRequestId()) === null || _g === void 0 ? void 0 : _g.value,
        }, undefined);
    }
}
exports.StoryCreateRequestBuilder = StoryCreateRequestBuilder;


/***/ }),
/* 94 */
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.StoryResultBuilder = void 0;
const date_transformer_1 = __webpack_require__(66);
class StoryResultBuilder {
    static storyChapterToDto(storyChapter, storyId) {
        var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m, _o, _p, _q, _r, _s;
        return {
            storyId: storyId,
            sagaName: (_a = storyChapter.sagaName) !== null && _a !== void 0 ? _a : '',
            storyChapterId: (_b = storyChapter.storyChapterId) !== null && _b !== void 0 ? _b : '',
            touristSpotId: (_c = storyChapter.touristSpotId) !== null && _c !== void 0 ? _c : '',
            chapterNumber: (_d = storyChapter.chapterNumber) !== null && _d !== void 0 ? _d : '',
            chapterTitle: (_e = storyChapter.chapterTitle) !== null && _e !== void 0 ? _e : '',
            chapterDesc: (_f = storyChapter.chapterDesc) !== null && _f !== void 0 ? _f : '',
            chapterImage: (_g = storyChapter.chapterImage) !== null && _g !== void 0 ? _g : '',
            characterNameList: (_h = storyChapter.characterNameList) !== null && _h !== void 0 ? _h : [],
            realWorldImage: (_j = storyChapter.realWorldImage) !== null && _j !== void 0 ? _j : '',
            chapterVideoUrl: (_k = storyChapter.chapterVideoUrl) !== null && _k !== void 0 ? _k : '',
            chapterVideoMobileUrl: (_l = storyChapter.chapterVideoMobileUrl) !== null && _l !== void 0 ? _l : '',
            chapterPdfUrl: (_m = storyChapter.chapterPdfUrl) !== null && _m !== void 0 ? _m : '',
            isUnlocked: (_o = storyChapter.isUnlocked) !== null && _o !== void 0 ? _o : false,
            delFlag: (_p = storyChapter.delFlag) !== null && _p !== void 0 ? _p : false,
            insUserId: (_q = storyChapter.insUserId) !== null && _q !== void 0 ? _q : '',
            insDateTime: (_r = date_transformer_1.TransformDate.transformDateToYYYYMMDDHHmm(storyChapter.insDateTime)) !== null && _r !== void 0 ? _r : '',
            updUserId: storyChapter.updUserId,
            updDateTime: (_s = date_transformer_1.TransformDate.transformDateToYYYYMMDDHHmm(storyChapter.updDateTime)) !== null && _s !== void 0 ? _s : '',
        };
    }
    static storyToDto(story) {
        var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m, _o, _p, _q;
        return {
            storyId: (_a = story.storyId) !== null && _a !== void 0 ? _a : '',
            sagaName: (_b = story.sagaName) !== null && _b !== void 0 ? _b : '',
            sagaDesc: (_c = story.sagaDesc) !== null && _c !== void 0 ? _c : '',
            backgroundMedia: (_d = story.backgroundMedia) !== null && _d !== void 0 ? _d : '',
            mapImage: (_e = story.mapImage) !== null && _e !== void 0 ? _e : '',
            location: (_f = story.location) !== null && _f !== void 0 ? _f : '',
            order: (_g = story.order) !== null && _g !== void 0 ? _g : 0,
            isPrologue: (_h = story.isPrologue) !== null && _h !== void 0 ? _h : false,
            isSelected: (_j = story.isSelected) !== null && _j !== void 0 ? _j : false,
            chapterList: (_l = (_k = story.chapterList) === null || _k === void 0 ? void 0 : _k.map((chapter) => { var _a; return StoryResultBuilder.storyChapterToDto(chapter, (_a = story.storyId) !== null && _a !== void 0 ? _a : ''); })) !== null && _l !== void 0 ? _l : undefined,
            delFlag: (_m = story.delFlag) !== null && _m !== void 0 ? _m : false,
            insUserId: (_o = story.insUserId) !== null && _o !== void 0 ? _o : '',
            insDateTime: (_p = date_transformer_1.TransformDate.transformDateToYYYYMMDDHHmm(story.insDateTime)) !== null && _p !== void 0 ? _p : '',
            updUserId: story.updUserId,
            updDateTime: (_q = date_transformer_1.TransformDate.transformDateToYYYYMMDDHHmm(story.updDateTime)) !== null && _q !== void 0 ? _q : '',
        };
    }
}
exports.StoryResultBuilder = StoryResultBuilder;


/***/ }),
/* 95 */
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.StoryUpdateRequestBuilder = void 0;
const chapter_story_1 = __webpack_require__(37);
const story_entity_1 = __webpack_require__(38);
const context_storage_1 = __webpack_require__(16);
class StoryUpdateRequestBuilder {
    static dtoToStory(dto) {
        var _a, _b;
        return new story_entity_1.StoryEntity({
            sagaName: dto.sagaName,
            sagaDesc: dto.sagaDesc,
            backgroundMedia: dto.backgroundMedia,
            mapImage: dto.mapImage,
            location: dto.location,
            order: dto.order,
            isPrologue: dto.isPrologue,
            isSelected: dto.isSelected,
            delFlag: dto.delFlag,
            updUserId: dto.updUserId,
            updDateTime: (_b = (_a = context_storage_1.ContextStorage.getStore()) === null || _a === void 0 ? void 0 : _a.getSystemDateTimeJST()) !== null && _b !== void 0 ? _b : new Date(),
        }, dto.sagaId);
    }
    static dtoToStoryChapter(dto) {
        var _a, _b;
        return new chapter_story_1.StoryChapter({
            storyChapterId: dto.storyChapterId,
            touristSpotId: dto.touristSpotId,
            chapterNumber: dto.chapterNumber,
            chapterTitle: dto.chapterTitle,
            chapterDesc: dto.chapterDesc,
            chapterImage: dto.chapterImage,
            characterNameList: dto.characterNameList,
            realWorldImage: dto.realWorldImage,
            chapterVideoUrl: dto.chapterVideoUrl,
            chapterVideoMobileUrl: dto.chapterVideoMobileUrl,
            chapterPdfUrl: dto.chapterPdfUrl,
            isUnlocked: dto.isUnlocked,
            delFlag: dto.delFlag,
            updUserId: dto.updUserId,
            updDateTime: (_b = (_a = context_storage_1.ContextStorage.getStore()) === null || _a === void 0 ? void 0 : _a.getSystemDateTimeJST()) !== null && _b !== void 0 ? _b : new Date(),
        });
    }
}
exports.StoryUpdateRequestBuilder = StoryUpdateRequestBuilder;


/***/ }),
/* 96 */
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.TouristSpotUpdateRequestBuilder = void 0;
const tourist_spot_1 = __webpack_require__(33);
const context_storage_1 = __webpack_require__(16);
class TouristSpotUpdateRequestBuilder {
    static dtoToTouristSpot(dto) {
        var _a, _b, _c;
        return new tourist_spot_1.TouristSpot({
            storyChapterId: dto.storyChapterId,
            touristSpotId: dto.touristSpotId,
            touristSpotName: dto.touristSpotName,
            touristSpotDesc: dto.touristSpotDesc,
            bestVisitTime: dto.bestVisitTime,
            touristSpotHashtag: dto.touristSpotHashtag,
            imageSet: (_a = dto.imageSet) !== null && _a !== void 0 ? _a : undefined,
            delFlag: dto.delFlag,
            updUserId: dto.updUserId,
            updDateTime: (_c = (_b = context_storage_1.ContextStorage.getStore()) === null || _b === void 0 ? void 0 : _b.getSystemDateTimeJST()) !== null && _c !== void 0 ? _c : new Date(),
        });
    }
}
exports.TouristSpotUpdateRequestBuilder = TouristSpotUpdateRequestBuilder;


/***/ }),
/* 97 */
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.UserCreateBuilder = void 0;
const user_entity_1 = __webpack_require__(46);
const context_storage_1 = __webpack_require__(16);
class UserCreateBuilder {
    static fromSignup(email, socialProvider, socialId, walletAddress, encryptedPrivateKey, ipAddress) {
        var _a, _b, _c, _d;
        const now = (_b = (_a = context_storage_1.ContextStorage.getStore()) === null || _a === void 0 ? void 0 : _a.getSystemDateTimeJST()) !== null && _b !== void 0 ? _b : new Date();
        return new user_entity_1.UserEntity({
            username: email.split('@')[0],
            googleEmail: socialProvider === 'google' ? email : undefined,
            email: socialProvider === 'email' ? email : undefined,
            discordId: socialProvider === 'discord' ? socialId : undefined,
            password: '',
            encryptedPrivateKey,
            latestIpAddress: ipAddress,
            passportWalletAddress: walletAddress,
            perksWalletAddress: walletAddress,
            isPremium: false,
            totalQuestCompleted: 0,
            totalTravelDistance: 0,
            role: 'USER',
            registeredAt: now,
            discordJoinedAt: now,
            isBanned: false,
            delFlag: false,
            insUserId: 'system',
            insDateTime: now,
            updUserId: 'system',
            updDateTime: now,
            requestId: (_d = (_c = context_storage_1.ContextStorage.getStore()) === null || _c === void 0 ? void 0 : _c.getRequestId()) === null || _d === void 0 ? void 0 : _d.value,
        }, undefined);
    }
}
exports.UserCreateBuilder = UserCreateBuilder;


/***/ }),
/* 98 */
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.ApiUserNotFoundResponse = exports.ApiUserExistsResponse = exports.ApiInvalidVersionResponse = exports.ApiDefaultBadRequestResponse = exports.ApiUnauthorizedResponse = void 0;
const tourii_backend_app_error_type_1 = __webpack_require__(26);
const common_1 = __webpack_require__(4);
const swagger_1 = __webpack_require__(68);
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
const ApiUnauthorizedResponse = (description = 'Unauthorized - Invalid or missing API key') => (0, common_1.applyDecorators)((0, swagger_1.ApiResponse)({
    status: common_1.HttpStatus.UNAUTHORIZED,
    description,
    schema: createErrorSchema(tourii_backend_app_error_type_1.TouriiBackendAppErrorType.E_TB_010),
}));
exports.ApiUnauthorizedResponse = ApiUnauthorizedResponse;
const ApiDefaultBadRequestResponse = (description = 'Bad Request - Invalid request body or version') => (0, common_1.applyDecorators)((0, swagger_1.ApiResponse)({
    status: common_1.HttpStatus.BAD_REQUEST,
    description,
    schema: createErrorSchema(tourii_backend_app_error_type_1.TouriiBackendAppErrorType.E_TB_001),
}));
exports.ApiDefaultBadRequestResponse = ApiDefaultBadRequestResponse;
const ApiInvalidVersionResponse = (description = 'Bad Request - Invalid version format') => (0, common_1.applyDecorators)((0, swagger_1.ApiResponse)({
    status: common_1.HttpStatus.BAD_REQUEST,
    description,
    schema: createErrorSchema(tourii_backend_app_error_type_1.TouriiBackendAppErrorType.E_TB_021),
}));
exports.ApiInvalidVersionResponse = ApiInvalidVersionResponse;
const ApiUserExistsResponse = (description = 'Bad Request - User already exists') => (0, common_1.applyDecorators)((0, swagger_1.ApiResponse)({
    status: common_1.HttpStatus.BAD_REQUEST,
    description,
    schema: createErrorSchema(tourii_backend_app_error_type_1.TouriiBackendAppErrorType.E_TB_006),
}));
exports.ApiUserExistsResponse = ApiUserExistsResponse;
const ApiUserNotFoundResponse = (description = 'User not found') => (0, common_1.applyDecorators)((0, swagger_1.ApiResponse)({
    status: common_1.HttpStatus.NOT_FOUND,
    description,
    schema: createErrorSchema(tourii_backend_app_error_type_1.TouriiBackendAppErrorType.E_TB_004),
}));
exports.ApiUserNotFoundResponse = ApiUserNotFoundResponse;


/***/ }),
/* 99 */
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.AuthSignupRequestDto = exports.AuthSignupRequestSchema = void 0;
const nestjs_zod_1 = __webpack_require__(71);
const zod_1 = __webpack_require__(100);
exports.AuthSignupRequestSchema = zod_1.z.object({
    email: zod_1.z.string().email(),
    socialProvider: zod_1.z.string(),
    socialId: zod_1.z.string(),
});
class AuthSignupRequestDto extends (0, nestjs_zod_1.createZodDto)(exports.AuthSignupRequestSchema) {
}
exports.AuthSignupRequestDto = AuthSignupRequestDto;


/***/ }),
/* 100 */
/***/ ((module) => {

module.exports = require("zod");

/***/ }),
/* 101 */
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.StoryChapterCreateRequestDto = exports.StoryChapterCreateRequestSchema = void 0;
const nestjs_zod_1 = __webpack_require__(71);
const zod_1 = __webpack_require__(100);
exports.StoryChapterCreateRequestSchema = zod_1.z.object({
    touristSpotId: zod_1.z.string().describe('Unique identifier for the tourist spot'),
    chapterNumber: zod_1.z
        .string()
        .describe("Chapter number or position (e.g., 'Prologue', 'Chapter 1')"),
    chapterTitle: zod_1.z.string().describe('Title of the story chapter'),
    chapterDesc: zod_1.z.string().describe('Detailed description or content of the story'),
    chapterImage: zod_1.z.string().describe('URL to the fictional chapter image'),
    characterNameList: zod_1.z
        .array(zod_1.z.string())
        .describe('List of character names involved in the chapter'),
    realWorldImage: zod_1.z.string().describe('URL to the real-world location image'),
    chapterVideoUrl: zod_1.z.string().describe('URL to the chapter video for desktop viewing'),
    chapterVideoMobileUrl: zod_1.z.string().describe('URL to the chapter video optimized for mobile'),
    chapterPdfUrl: zod_1.z.string().describe('URL to the downloadable PDF version'),
    isUnlocked: zod_1.z
        .boolean()
        .describe('Whether the chapter is available to users without prerequisites'),
});
class StoryChapterCreateRequestDto extends (0, nestjs_zod_1.createZodDto)(exports.StoryChapterCreateRequestSchema) {
}
exports.StoryChapterCreateRequestDto = StoryChapterCreateRequestDto;


/***/ }),
/* 102 */
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.LoginRequestDto = exports.LoginRequestSchema = void 0;
const nestjs_zod_1 = __webpack_require__(71);
const zod_1 = __webpack_require__(100);
exports.LoginRequestSchema = zod_1.z.object({
    username: zod_1.z.string().optional().describe('Username for login'),
    password: zod_1.z.string().describe('User password'),
    passportWalletAddress: zod_1.z.string().optional().describe('Passport wallet address to validate'),
    discordId: zod_1.z.string().optional().describe('Discord user ID'),
    googleEmail: zod_1.z.string().optional().describe('Google email address'),
});
class LoginRequestDto extends (0, nestjs_zod_1.createZodDto)(exports.LoginRequestSchema) {
}
exports.LoginRequestDto = LoginRequestDto;


/***/ }),
/* 103 */
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.ModelRouteCreateOnlyRequestDto = exports.ModelRouteCreateRequestDto = exports.ModelRouteCreateOnlyRequestSchema = exports.ModelRouteCreateRequestSchema = void 0;
const nestjs_zod_1 = __webpack_require__(71);
const zod_1 = __webpack_require__(100);
const tourist_spot_create_request_model_1 = __webpack_require__(104);
exports.ModelRouteCreateRequestSchema = zod_1.z.object({
    storyId: zod_1.z.string().describe('Unique identifier for the story'),
    routeName: zod_1.z.string().describe('Name of the model route'),
    region: zod_1.z.string().describe('Region of the model route'),
    regionDesc: zod_1.z.string().describe('Description of the region'),
    regionBackgroundMedia: zod_1.z.string().describe('Background media of the region'),
    recommendation: zod_1.z.array(zod_1.z.string()).describe('Recommendation of the model route'),
    touristSpotList: zod_1.z
        .array(tourist_spot_create_request_model_1.TouristSpotCreateRequestSchema)
        .describe('List of tourist spots in the model route'),
});
exports.ModelRouteCreateOnlyRequestSchema = zod_1.z.object({
    storyId: zod_1.z.string().describe('Unique identifier for the story'),
    routeName: zod_1.z.string().describe('Name of the model route'),
    region: zod_1.z.string().describe('Region of the model route'),
    recommendation: zod_1.z.array(zod_1.z.string()).describe('Recommendation of the model route'),
});
class ModelRouteCreateRequestDto extends (0, nestjs_zod_1.createZodDto)(exports.ModelRouteCreateRequestSchema) {
}
exports.ModelRouteCreateRequestDto = ModelRouteCreateRequestDto;
class ModelRouteCreateOnlyRequestDto extends (0, nestjs_zod_1.createZodDto)(exports.ModelRouteCreateOnlyRequestSchema) {
}
exports.ModelRouteCreateOnlyRequestDto = ModelRouteCreateOnlyRequestDto;


/***/ }),
/* 104 */
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.TouristSpotCreateRequestDto = exports.TouristSpotCreateRequestSchema = exports.ImageSetSchema = void 0;
const nestjs_zod_1 = __webpack_require__(71);
const zod_1 = __webpack_require__(100);
exports.ImageSetSchema = zod_1.z.object({
    main: zod_1.z.string().describe('Main image of the tourist spot'),
    small: zod_1.z.array(zod_1.z.string()).describe('Small images of the tourist spot'),
});
exports.TouristSpotCreateRequestSchema = zod_1.z.object({
    storyChapterId: zod_1.z.string().describe('Unique identifier for the story chapter'),
    touristSpotName: zod_1.z.string().describe('Name of the tourist spot'),
    touristSpotDesc: zod_1.z.string().describe('Description of the tourist spot'),
    bestVisitTime: zod_1.z.string().describe('Best visit time of the tourist spot'),
    touristSpotHashtag: zod_1.z.array(zod_1.z.string()).describe('Hashtags associated with this location'),
    imageSet: exports.ImageSetSchema.optional().describe('Image set for the tourist spot'),
});
class TouristSpotCreateRequestDto extends (0, nestjs_zod_1.createZodDto)(exports.TouristSpotCreateRequestSchema) {
}
exports.TouristSpotCreateRequestDto = TouristSpotCreateRequestDto;


/***/ }),
/* 105 */
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.QuestCreateRequestDto = exports.QuestCreateRequestSchema = void 0;
const client_1 = __webpack_require__(9);
const nestjs_zod_1 = __webpack_require__(71);
const zod_1 = __webpack_require__(100);
exports.QuestCreateRequestSchema = zod_1.z.object({
    touristSpotId: zod_1.z.string().describe('Unique identifier for the tourist spot'),
    questName: zod_1.z.string().describe('Name of the quest'),
    questDesc: zod_1.z.string().describe('Description of the quest'),
    questImage: zod_1.z.string().optional().describe('URL to the quest image'),
    questType: zod_1.z.nativeEnum(client_1.QuestType).describe('Quest type'),
    isUnlocked: zod_1.z.boolean().describe('Whether quest is unlocked'),
    isPremium: zod_1.z.boolean().describe('Whether quest is premium'),
    totalMagatamaPointAwarded: zod_1.z.number().describe('Total Magatama points awarded'),
    rewardType: zod_1.z.nativeEnum(client_1.RewardType).describe('Reward type'),
    delFlag: zod_1.z.boolean().describe('Flag to indicate if the quest is deleted'),
});
class QuestCreateRequestDto extends (0, nestjs_zod_1.createZodDto)(exports.QuestCreateRequestSchema) {
}
exports.QuestCreateRequestDto = QuestCreateRequestDto;


/***/ }),
/* 106 */
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.QuestTaskCreateRequestDto = exports.QuestTaskCreateRequestSchema = void 0;
const client_1 = __webpack_require__(9);
const nestjs_zod_1 = __webpack_require__(71);
const zod_1 = __webpack_require__(100);
exports.QuestTaskCreateRequestSchema = zod_1.z.object({
    taskTheme: zod_1.z.nativeEnum(client_1.TaskTheme).describe('Theme of the task'),
    taskType: zod_1.z.nativeEnum(client_1.TaskType).describe('Type of the task'),
    taskName: zod_1.z.string().describe('Name of the task'),
    taskDesc: zod_1.z.string().describe('Description of the task'),
    isUnlocked: zod_1.z.boolean().describe('Whether task is unlocked'),
    requiredAction: zod_1.z.string().describe('Action required to complete the task'),
    groupActivityMembers: zod_1.z.array(zod_1.z.any()).optional().describe('Members for group activities'),
    selectOptions: zod_1.z.array(zod_1.z.any()).optional().describe('Options for selection tasks'),
    antiCheatRules: zod_1.z.any().describe('Rules to prevent cheating'),
    magatamaPointAwarded: zod_1.z.number().describe('Magatama points awarded for this task'),
    totalMagatamaPointAwarded: zod_1.z.number().describe('Total Magatama points awarded'),
    delFlag: zod_1.z.boolean().describe('Flag to indicate if the task is deleted'),
});
class QuestTaskCreateRequestDto extends (0, nestjs_zod_1.createZodDto)(exports.QuestTaskCreateRequestSchema) {
}
exports.QuestTaskCreateRequestDto = QuestTaskCreateRequestDto;


/***/ }),
/* 107 */
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.StoryCreateOnlyRequestDto = exports.StoryCreateRequestDto = exports.StoryCreateOnlyRequestSchema = exports.StoryCreateRequestSchema = void 0;
const nestjs_zod_1 = __webpack_require__(71);
const zod_1 = __webpack_require__(100);
const chapter_story_create_request_model_1 = __webpack_require__(101);
exports.StoryCreateRequestSchema = zod_1.z.object({
    sagaName: zod_1.z.string().describe("Name of the story saga (e.g., 'Prologue', 'Bungo Ono')"),
    sagaDesc: zod_1.z.string().describe("Detailed description of the saga's narrative"),
    backgroundMedia: zod_1.z.string().describe("URL to the saga's cover media (image or video)"),
    mapImage: zod_1.z.string().optional().describe('URL to the map image for the saga'),
    location: zod_1.z.string().optional().describe("Real-world location of the saga (e.g., 'Tokyo')"),
    order: zod_1.z.number().describe('Display order in the saga list'),
    isPrologue: zod_1.z.boolean().describe('Whether the saga is a prologue'),
    isSelected: zod_1.z.boolean().describe('Whether the saga is selected by default'),
    chapterList: zod_1.z
        .array(chapter_story_create_request_model_1.StoryChapterCreateRequestSchema)
        .optional()
        .describe('List of chapters in the saga'),
});
exports.StoryCreateOnlyRequestSchema = zod_1.z.object({
    sagaName: zod_1.z.string().describe("Name of the story saga (e.g., 'Prologue', 'Bungo Ono')"),
    sagaDesc: zod_1.z.string().describe("Detailed description of the saga's narrative"),
    backgroundMedia: zod_1.z.string().describe("URL to the saga's cover media (image or video)"),
    mapImage: zod_1.z.string().optional().describe('URL to the map image for the saga'),
    location: zod_1.z.string().optional().describe("Real-world location of the saga (e.g., 'Tokyo')"),
    order: zod_1.z.number().describe('Display order in the saga list'),
    isPrologue: zod_1.z.boolean().describe('Whether the saga is a prologue'),
    isSelected: zod_1.z.boolean().describe('Whether the saga is selected by default'),
});
class StoryCreateRequestDto extends (0, nestjs_zod_1.createZodDto)(exports.StoryCreateRequestSchema) {
}
exports.StoryCreateRequestDto = StoryCreateRequestDto;
class StoryCreateOnlyRequestDto extends (0, nestjs_zod_1.createZodDto)(exports.StoryCreateOnlyRequestSchema) {
}
exports.StoryCreateOnlyRequestDto = StoryCreateOnlyRequestDto;


/***/ }),
/* 108 */
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.LocationQueryDto = exports.LocationQueryRequestSchema = void 0;
const nestjs_zod_1 = __webpack_require__(71);
const zod_1 = __webpack_require__(100);
exports.LocationQueryRequestSchema = zod_1.z.object({
    query: zod_1.z.string().min(1).describe('Place name or search query'),
});
class LocationQueryDto extends (0, nestjs_zod_1.createZodDto)(exports.LocationQueryRequestSchema) {
}
exports.LocationQueryDto = LocationQueryDto;


/***/ }),
/* 109 */
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.QuestListQueryDto = exports.QuestFetchRequestSchema = void 0;
const client_1 = __webpack_require__(9);
const nestjs_zod_1 = __webpack_require__(71);
const zod_1 = __webpack_require__(100);
exports.QuestFetchRequestSchema = zod_1.z.object({
    questType: zod_1.z.nativeEnum(client_1.QuestType).optional().describe('Quest type filter'),
    page: zod_1.z.number().default(1).describe('Page number for pagination'),
    limit: zod_1.z.number().max(100).default(20).describe('Number of quests per page'),
    isPremium: zod_1.z.boolean().optional().describe('Whether the quest is premium'),
    isUnlocked: zod_1.z.boolean().optional().describe('Whether the quest is unlocked'),
});
class QuestListQueryDto extends (0, nestjs_zod_1.createZodDto)(exports.QuestFetchRequestSchema) {
}
exports.QuestListQueryDto = QuestListQueryDto;


/***/ }),
/* 110 */
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.ChapterProgressRequestDto = exports.ChapterProgressRequestSchema = void 0;
const client_1 = __webpack_require__(9);
const nestjs_zod_1 = __webpack_require__(71);
const zod_1 = __webpack_require__(100);
exports.ChapterProgressRequestSchema = zod_1.z.object({
    userId: zod_1.z.string().describe('ID of the user reading the chapter'),
    status: zod_1.z.nativeEnum(client_1.StoryStatus).describe('Current story status'),
});
class ChapterProgressRequestDto extends (0, nestjs_zod_1.createZodDto)(exports.ChapterProgressRequestSchema) {
}
exports.ChapterProgressRequestDto = ChapterProgressRequestDto;


/***/ }),
/* 111 */
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.StoryChapterUpdateRequestDto = exports.StoryChapterUpdateRequestSchema = void 0;
const nestjs_zod_1 = __webpack_require__(71);
const zod_1 = __webpack_require__(100);
const chapter_story_create_request_model_1 = __webpack_require__(101);
exports.StoryChapterUpdateRequestSchema = chapter_story_create_request_model_1.StoryChapterCreateRequestSchema.extend({
    storyChapterId: zod_1.z.string().describe('Unique identifier for the story chapter'),
    delFlag: zod_1.z.boolean().describe('Flag to indicate if the story chapter is deleted'),
    updUserId: zod_1.z.string().describe('Unique identifier for the user who updated the story chapter'),
});
class StoryChapterUpdateRequestDto extends (0, nestjs_zod_1.createZodDto)(exports.StoryChapterUpdateRequestSchema) {
}
exports.StoryChapterUpdateRequestDto = StoryChapterUpdateRequestDto;


/***/ }),
/* 112 */
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.ModelRouteUpdateRequestDto = exports.ModelRouteUpdateOnlyRequestSchema = exports.ModelRouteUpdateRequestSchema = void 0;
const nestjs_zod_1 = __webpack_require__(71);
const zod_1 = __webpack_require__(100);
const model_route_create_request_model_1 = __webpack_require__(103);
const model_route_create_request_model_2 = __webpack_require__(103);
exports.ModelRouteUpdateRequestSchema = model_route_create_request_model_1.ModelRouteCreateRequestSchema.extend({
    modelRouteId: zod_1.z.string().describe('Unique identifier for the model route'),
    delFlag: zod_1.z.boolean().describe('Flag to indicate if the model route is deleted'),
    updUserId: zod_1.z.string().describe('Unique identifier for the user who updated the model route'),
});
exports.ModelRouteUpdateOnlyRequestSchema = model_route_create_request_model_2.ModelRouteCreateOnlyRequestSchema.extend({
    modelRouteId: zod_1.z.string().describe('Unique identifier for the model route'),
    delFlag: zod_1.z.boolean().describe('Flag to indicate if the model route is deleted'),
    updUserId: zod_1.z.string().describe('Unique identifier for the user who updated the model route'),
});
class ModelRouteUpdateRequestDto extends (0, nestjs_zod_1.createZodDto)(exports.ModelRouteUpdateRequestSchema) {
}
exports.ModelRouteUpdateRequestDto = ModelRouteUpdateRequestDto;


/***/ }),
/* 113 */
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.QuestTaskUpdateRequestDto = exports.QuestTaskUpdateRequestSchema = void 0;
const client_1 = __webpack_require__(9);
const nestjs_zod_1 = __webpack_require__(71);
const zod_1 = __webpack_require__(100);
exports.QuestTaskUpdateRequestSchema = zod_1.z.object({
    taskId: zod_1.z.string().describe('Unique identifier for the task'),
    questId: zod_1.z.string().describe('ID of the parent quest'),
    taskTheme: zod_1.z.nativeEnum(client_1.TaskTheme).describe('Theme of the task'),
    taskType: zod_1.z.nativeEnum(client_1.TaskType).describe('Type of the task'),
    taskName: zod_1.z.string().describe('Name of the task'),
    taskDesc: zod_1.z.string().describe('Description of the task'),
    isUnlocked: zod_1.z.boolean().describe('Whether task is unlocked'),
    requiredAction: zod_1.z.string().describe('Action required to complete the task'),
    groupActivityMembers: zod_1.z.array(zod_1.z.any()).optional().describe('Members for group activities'),
    selectOptions: zod_1.z.array(zod_1.z.any()).optional().describe('Options for selection tasks'),
    antiCheatRules: zod_1.z.any().describe('Rules to prevent cheating'),
    magatamaPointAwarded: zod_1.z.number().describe('Magatama points awarded for this task'),
    totalMagatamaPointAwarded: zod_1.z.number().describe('Total Magatama points awarded'),
    delFlag: zod_1.z.boolean().describe('Flag to indicate if the task is deleted'),
    updUserId: zod_1.z.string().describe('Unique identifier for the user who updated the task'),
});
class QuestTaskUpdateRequestDto extends (0, nestjs_zod_1.createZodDto)(exports.QuestTaskUpdateRequestSchema) {
}
exports.QuestTaskUpdateRequestDto = QuestTaskUpdateRequestDto;


/***/ }),
/* 114 */
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.QuestUpdateRequestDto = exports.QuestUpdateRequestSchema = void 0;
const client_1 = __webpack_require__(9);
const nestjs_zod_1 = __webpack_require__(71);
const zod_1 = __webpack_require__(100);
const quest_task_update_request_model_1 = __webpack_require__(113);
exports.QuestUpdateRequestSchema = zod_1.z.object({
    questId: zod_1.z.string().describe('Unique identifier for the quest'),
    touristSpotId: zod_1.z.string().describe('Unique identifier for the tourist spot'),
    questName: zod_1.z.string().describe('Name of the quest'),
    questDesc: zod_1.z.string().describe('Description of the quest'),
    questImage: zod_1.z.string().optional().describe('URL to the quest image'),
    questType: zod_1.z.nativeEnum(client_1.QuestType).describe('Quest type'),
    isUnlocked: zod_1.z.boolean().describe('Whether quest is unlocked'),
    isPremium: zod_1.z.boolean().describe('Whether quest is premium'),
    totalMagatamaPointAwarded: zod_1.z.number().describe('Total Magatama points awarded'),
    rewardType: zod_1.z.nativeEnum(client_1.RewardType).describe('Reward type'),
    delFlag: zod_1.z.boolean().describe('Flag to indicate if the quest is deleted'),
    updUserId: zod_1.z.string().describe('Unique identifier for the user who updated the quest'),
    taskList: zod_1.z
        .array(quest_task_update_request_model_1.QuestTaskUpdateRequestSchema)
        .optional()
        .describe('List of tasks for the quest'),
});
class QuestUpdateRequestDto extends (0, nestjs_zod_1.createZodDto)(exports.QuestUpdateRequestSchema) {
}
exports.QuestUpdateRequestDto = QuestUpdateRequestDto;


/***/ }),
/* 115 */
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.StoryUpdateOnlyRequestDto = exports.StoryUpdateRequestDto = exports.StoryUpdateOnlyRequestSchema = exports.StoryUpdateRequestSchema = void 0;
const nestjs_zod_1 = __webpack_require__(71);
const zod_1 = __webpack_require__(100);
const story_create_request_model_1 = __webpack_require__(107);
exports.StoryUpdateRequestSchema = story_create_request_model_1.StoryCreateRequestSchema.extend({
    sagaId: zod_1.z.string().describe('Unique identifier for the story saga'),
    delFlag: zod_1.z.boolean().describe('Flag to indicate if the story saga is deleted'),
    updUserId: zod_1.z.string().describe('Unique identifier for the user who updated the story saga'),
});
exports.StoryUpdateOnlyRequestSchema = story_create_request_model_1.StoryCreateOnlyRequestSchema.extend({
    sagaId: zod_1.z.string().describe('Unique identifier for the story saga'),
    delFlag: zod_1.z.boolean().describe('Flag to indicate if the story saga is deleted'),
    updUserId: zod_1.z.string().describe('Unique identifier for the user who updated the story saga'),
});
class StoryUpdateRequestDto extends (0, nestjs_zod_1.createZodDto)(exports.StoryUpdateRequestSchema) {
}
exports.StoryUpdateRequestDto = StoryUpdateRequestDto;
class StoryUpdateOnlyRequestDto extends (0, nestjs_zod_1.createZodDto)(exports.StoryUpdateOnlyRequestSchema) {
}
exports.StoryUpdateOnlyRequestDto = StoryUpdateOnlyRequestDto;


/***/ }),
/* 116 */
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.TouristSpotUpdateRequestDto = exports.TouristSpotUpdateRequestSchema = void 0;
const nestjs_zod_1 = __webpack_require__(71);
const zod_1 = __webpack_require__(100);
const tourist_spot_create_request_model_1 = __webpack_require__(104);
exports.TouristSpotUpdateRequestSchema = tourist_spot_create_request_model_1.TouristSpotCreateRequestSchema.extend({
    touristSpotId: zod_1.z.string().describe('Unique identifier for the tourist spot'),
    delFlag: zod_1.z.boolean().describe('Flag to indicate if the tourist spot is deleted'),
    updUserId: zod_1.z.string().describe('Unique identifier for the user who updated the tourist spot'),
});
class TouristSpotUpdateRequestDto extends (0, nestjs_zod_1.createZodDto)(exports.TouristSpotUpdateRequestSchema) {
}
exports.TouristSpotUpdateRequestDto = TouristSpotUpdateRequestDto;


/***/ }),
/* 117 */
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.StartGroupQuestRequestDto = exports.StartGroupQuestRequestSchema = void 0;
const nestjs_zod_1 = __webpack_require__(71);
const zod_1 = __webpack_require__(100);
exports.StartGroupQuestRequestSchema = zod_1.z.object({
    userId: zod_1.z.string().describe('User ID of the quest leader starting the quest'),
});
class StartGroupQuestRequestDto extends (0, nestjs_zod_1.createZodDto)(exports.StartGroupQuestRequestSchema) {
}
exports.StartGroupQuestRequestDto = StartGroupQuestRequestDto;


/***/ }),
/* 118 */
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.AuthSignupResponseDto = exports.AuthSignupResponseSchema = void 0;
const nestjs_zod_1 = __webpack_require__(71);
const zod_1 = __webpack_require__(100);
exports.AuthSignupResponseSchema = zod_1.z.object({
    userId: zod_1.z.string(),
    walletAddress: zod_1.z.string(),
});
class AuthSignupResponseDto extends (0, nestjs_zod_1.createZodDto)(exports.AuthSignupResponseSchema) {
}
exports.AuthSignupResponseDto = AuthSignupResponseDto;


/***/ }),
/* 119 */
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.StoryChapterResponseDto = exports.StoryChapterResponseSchema = void 0;
const nestjs_zod_1 = __webpack_require__(71);
const zod_1 = __webpack_require__(100);
const metadata_fields_response_model_1 = __webpack_require__(120);
exports.StoryChapterResponseSchema = zod_1.z.object(Object.assign({ storyId: zod_1.z.string().describe('Unique identifier for the story'), touristSpotId: zod_1.z.string().describe('Unique identifier for the tourist spot'), storyChapterId: zod_1.z.string().describe('Unique identifier for the story chapter'), sagaName: zod_1.z.string().describe('Name of the saga'), chapterNumber: zod_1.z.string().describe('Chapter number or position'), chapterTitle: zod_1.z.string().describe('Title of the chapter'), chapterDesc: zod_1.z.string().describe('Detailed description of the chapter'), chapterImage: zod_1.z.string().describe('URL to the fictional chapter image'), characterNameList: zod_1.z
        .array(zod_1.z.string())
        .describe('List of character names involved in the chapter'), realWorldImage: zod_1.z.string().describe('URL to the real-world location image'), chapterVideoUrl: zod_1.z.string().describe('URL to the chapter video for desktop viewing'), chapterVideoMobileUrl: zod_1.z.string().describe('URL to the chapter video optimized for mobile'), chapterPdfUrl: zod_1.z.string().describe('URL to the downloadable PDF version'), isUnlocked: zod_1.z
        .boolean()
        .describe('Whether the chapter is available to users without prerequisites') }, metadata_fields_response_model_1.MetadataFieldsSchema));
class StoryChapterResponseDto extends (0, nestjs_zod_1.createZodDto)(exports.StoryChapterResponseSchema) {
}
exports.StoryChapterResponseDto = StoryChapterResponseDto;


/***/ }),
/* 120 */
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.MetadataFieldsSchema = void 0;
const zod_1 = __webpack_require__(100);
exports.MetadataFieldsSchema = {
    delFlag: zod_1.z.boolean().optional().describe('Flag to indicate if the record is deleted'),
    insUserId: zod_1.z.string().optional().describe('ID of user who created this record'),
    insDateTime: zod_1.z.string().optional().describe('Timestamp of record creation'),
    updUserId: zod_1.z.string().optional().describe('ID of user who last updated this record'),
    updDateTime: zod_1.z.string().optional().describe('Timestamp of last record update'),
};


/***/ }),
/* 121 */
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.GroupMembersResponseDto = exports.GroupMembersResponseSchema = exports.GroupMemberSchema = void 0;
const nestjs_zod_1 = __webpack_require__(71);
const zod_1 = __webpack_require__(100);
exports.GroupMemberSchema = zod_1.z.object({
    userId: zod_1.z.string().describe('User ID of the member'),
    username: zod_1.z.string().describe('Username of the member'),
});
exports.GroupMembersResponseSchema = zod_1.z.object({
    groupId: zod_1.z.string().describe('Unique identifier for the group'),
    leaderUserId: zod_1.z.string().describe('User ID of the group leader'),
    members: zod_1.z.array(exports.GroupMemberSchema).describe('List of group members'),
});
class GroupMembersResponseDto extends (0, nestjs_zod_1.createZodDto)(exports.GroupMembersResponseSchema) {
}
exports.GroupMembersResponseDto = GroupMembersResponseDto;


/***/ }),
/* 122 */
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.ModelRouteResponseDto = exports.ModelRouteResponseSchema = void 0;
const nestjs_zod_1 = __webpack_require__(71);
const zod_1 = __webpack_require__(100);
const metadata_fields_response_model_1 = __webpack_require__(120);
const tourist_spot_response_model_1 = __webpack_require__(123);
exports.ModelRouteResponseSchema = zod_1.z.object(Object.assign({ modelRouteId: zod_1.z.string().describe('Unique identifier for the model route'), storyId: zod_1.z.string().describe('Unique identifier for the story'), routeName: zod_1.z.string().describe('Name of the model route'), region: zod_1.z.string().describe('Region of the model route'), regionDesc: zod_1.z.string().describe('Description of the region'), recommendation: zod_1.z.array(zod_1.z.string()).describe('Recommendation of the model route'), regionLatitude: zod_1.z.number().describe('Latitude of the region'), regionLongitude: zod_1.z.number().describe('Longitude of the region'), regionBackgroundMedia: zod_1.z.string().describe("URL to the region's cover media"), touristSpotList: zod_1.z
        .array(tourist_spot_response_model_1.TouristSpotResponseSchema)
        .describe('List of tourist spots in the model route'), regionWeatherInfo: tourist_spot_response_model_1.WeatherInfoSchema.describe('Current weather info for the region').extend({
        regionName: zod_1.z.string().describe('Name of the region'),
    }) }, metadata_fields_response_model_1.MetadataFieldsSchema));
class ModelRouteResponseDto extends (0, nestjs_zod_1.createZodDto)(exports.ModelRouteResponseSchema) {
}
exports.ModelRouteResponseDto = ModelRouteResponseDto;


/***/ }),
/* 123 */
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.TouristSpotResponseDto = exports.TouristSpotResponseSchema = exports.WeatherInfoSchema = void 0;
const nestjs_zod_1 = __webpack_require__(71);
const zod_1 = __webpack_require__(100);
const tourist_spot_create_request_model_1 = __webpack_require__(104);
const metadata_fields_response_model_1 = __webpack_require__(120);
exports.WeatherInfoSchema = zod_1.z.object({
    temperatureCelsius: zod_1.z.number().describe('Temperature of the weather'),
    weatherName: zod_1.z.string().describe('Name of the weather'),
    weatherDesc: zod_1.z.string().describe('Description of the weather'),
});
exports.TouristSpotResponseSchema = zod_1.z.object(Object.assign({ touristSpotId: zod_1.z.string().describe('Unique identifier for the tourist spot'), storyChapterId: zod_1.z.string().describe('Unique identifier for the story chapter'), touristSpotName: zod_1.z.string().describe('Name of the tourist spot'), touristSpotDesc: zod_1.z.string().describe('Description of the tourist spot'), bestVisitTime: zod_1.z.string().describe('Best visit time of the tourist spot'), address: zod_1.z.string().describe('Address of the tourist spot'), touristSpotLatitude: zod_1.z.number().describe('Latitude of the tourist spot'), touristSpotLongitude: zod_1.z.number().describe('Longitude of the tourist spot'), touristSpotHashtag: zod_1.z.array(zod_1.z.string()).describe('Hashtags associated with this location'), storyChapterLink: zod_1.z.string().optional().describe('Link to the related story chapter'), imageSet: tourist_spot_create_request_model_1.ImageSetSchema.optional().describe('Image set for the tourist spot'), weatherInfo: exports.WeatherInfoSchema.optional().describe('Weather info for the tourist spot') }, metadata_fields_response_model_1.MetadataFieldsSchema));
class TouristSpotResponseDto extends (0, nestjs_zod_1.createZodDto)(exports.TouristSpotResponseSchema) {
}
exports.TouristSpotResponseDto = TouristSpotResponseDto;


/***/ }),
/* 124 */
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.QuestListResponseDto = exports.QuestListResponseSchema = void 0;
const nestjs_zod_1 = __webpack_require__(71);
const zod_1 = __webpack_require__(100);
const quest_response_model_1 = __webpack_require__(125);
exports.QuestListResponseSchema = zod_1.z.object({
    quests: zod_1.z.array(quest_response_model_1.QuestResponseSchema),
    pagination: zod_1.z.object({
        currentPage: zod_1.z.number(),
        totalPages: zod_1.z.number(),
        totalQuests: zod_1.z.number(),
    }),
});
class QuestListResponseDto extends (0, nestjs_zod_1.createZodDto)(exports.QuestListResponseSchema) {
}
exports.QuestListResponseDto = QuestListResponseDto;


/***/ }),
/* 125 */
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.QuestResponseDto = exports.TaskResponseDto = exports.QuestResponseSchema = exports.TaskResponseSchema = void 0;
const client_1 = __webpack_require__(9);
const nestjs_zod_1 = __webpack_require__(71);
const zod_1 = __webpack_require__(100);
const tourist_spot_response_model_1 = __webpack_require__(123);
exports.TaskResponseSchema = zod_1.z.object({
    taskId: zod_1.z.string().describe('Unique identifier for the task'),
    questId: zod_1.z.string().describe('ID of the parent quest'),
    taskTheme: zod_1.z.nativeEnum(client_1.TaskTheme).describe('Theme of the task'),
    taskType: zod_1.z.nativeEnum(client_1.TaskType).describe('Type of the task'),
    taskName: zod_1.z.string().describe('Name of the task'),
    taskDesc: zod_1.z.string().describe('Description of the task'),
    isUnlocked: zod_1.z.boolean().describe('Whether task is unlocked'),
    requiredAction: zod_1.z.string().describe('Action required to complete the task'),
    groupActivityMembers: zod_1.z.array(zod_1.z.any()).optional().describe('Members for group activities'),
    selectOptions: zod_1.z.array(zod_1.z.any()).optional().describe('Options for selection tasks'),
    antiCheatRules: zod_1.z.any().describe('Rules to prevent cheating'),
    magatamaPointAwarded: zod_1.z.number().describe('Magatama points awarded for this task'),
    totalMagatamaPointAwarded: zod_1.z.number().describe('Total Magatama points awarded'),
});
exports.QuestResponseSchema = zod_1.z.object({
    questId: zod_1.z.string().describe('Unique identifier for the quest'),
    questName: zod_1.z.string().describe('Name of the quest'),
    questDesc: zod_1.z.string().describe('Description of the quest'),
    questImage: zod_1.z.string().optional().describe('URL to the quest image'),
    questType: zod_1.z.nativeEnum(client_1.QuestType).describe('Quest type'),
    isUnlocked: zod_1.z.boolean().describe('Whether quest is unlocked'),
    isPremium: zod_1.z.boolean().describe('Whether quest is premium'),
    totalMagatamaPointAwarded: zod_1.z.number().describe('Total Magatama points awarded'),
    tasks: zod_1.z.array(exports.TaskResponseSchema).optional().describe('Tasks associated with this quest'),
    touristSpot: tourist_spot_response_model_1.TouristSpotResponseSchema.optional().describe('Tourist spot associated with this quest'),
});
class TaskResponseDto extends (0, nestjs_zod_1.createZodDto)(exports.TaskResponseSchema) {
}
exports.TaskResponseDto = TaskResponseDto;
class QuestResponseDto extends (0, nestjs_zod_1.createZodDto)(exports.QuestResponseSchema) {
}
exports.QuestResponseDto = QuestResponseDto;


/***/ }),
/* 126 */
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.StartGroupQuestResponseDto = exports.StartGroupQuestResponseSchema = void 0;
const nestjs_zod_1 = __webpack_require__(71);
const zod_1 = __webpack_require__(100);
exports.StartGroupQuestResponseSchema = zod_1.z.object({
    message: zod_1.z.string().describe('Result message for starting the quest'),
});
class StartGroupQuestResponseDto extends (0, nestjs_zod_1.createZodDto)(exports.StartGroupQuestResponseSchema) {
}
exports.StartGroupQuestResponseDto = StartGroupQuestResponseDto;


/***/ }),
/* 127 */
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.StoryResponseDto = exports.StoryResponseSchema = void 0;
const nestjs_zod_1 = __webpack_require__(71);
const zod_1 = __webpack_require__(100);
const chapter_story_response_model_1 = __webpack_require__(119);
const metadata_fields_response_model_1 = __webpack_require__(120);
exports.StoryResponseSchema = zod_1.z.object(Object.assign({ storyId: zod_1.z.string().describe('Unique identifier for the story saga'), sagaName: zod_1.z.string().describe('Name of the story saga'), sagaDesc: zod_1.z.string().describe("Detailed description of the saga's narrative"), backgroundMedia: zod_1.z.string().describe("URL to the saga's cover media (image or video)"), mapImage: zod_1.z.string().describe('URL to the map image for the saga'), location: zod_1.z.string().describe('Real-world location of the saga'), order: zod_1.z.number().describe('Display order in the saga list'), isPrologue: zod_1.z.boolean().describe('Whether the saga is a prologue'), isSelected: zod_1.z.boolean().describe('Whether the saga is selected by default'), chapterList: zod_1.z
        .array(chapter_story_response_model_1.StoryChapterResponseSchema)
        .optional()
        .describe('List of stories in the saga') }, metadata_fields_response_model_1.MetadataFieldsSchema));
class StoryResponseDto extends (0, nestjs_zod_1.createZodDto)(exports.StoryResponseSchema) {
}
exports.StoryResponseDto = StoryResponseDto;


/***/ }),
/* 128 */
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
exports.TouriiBackendContextProvider = void 0;
const request_id_1 = __webpack_require__(20);
const date_utils_1 = __webpack_require__(22);
const common_1 = __webpack_require__(4);
const core_1 = __webpack_require__(67);
let TouriiBackendContextProvider = class TouriiBackendContextProvider {
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
exports.TouriiBackendContextProvider = TouriiBackendContextProvider;
exports.TouriiBackendContextProvider = TouriiBackendContextProvider = __decorate([
    (0, common_1.Injectable)({ scope: common_1.Scope.REQUEST }),
    __param(0, (0, common_1.Inject)(core_1.REQUEST)),
    __metadata("design:paramtypes", [Object])
], TouriiBackendContextProvider);


/***/ }),
/* 129 */
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
const tourii_backend_app_error_type_1 = __webpack_require__(26);
const tourii_backend_app_exception_1 = __webpack_require__(6);
const common_1 = __webpack_require__(4);
const config_1 = __webpack_require__(12);
const cors_1 = __importDefault(__webpack_require__(130));
const helmet_1 = __importDefault(__webpack_require__(131));
const semver_1 = __importDefault(__webpack_require__(132));
let SecurityMiddleware = class SecurityMiddleware {
    constructor(configService) {
        this.configService = configService;
    }
    use(req, res, next) {
        var _a;
        try {
            const apiKey = req.header('x-api-key');
            const validApiKeys = ((_a = this.configService.get('API_KEYS')) === null || _a === void 0 ? void 0 : _a.split(',')) || [];
            if (!apiKey) {
                throw new tourii_backend_app_exception_1.TouriiBackendAppException(tourii_backend_app_error_type_1.TouriiBackendAppErrorType.E_TB_010);
            }
            if (!validApiKeys.includes(apiKey)) {
                throw new tourii_backend_app_exception_1.TouriiBackendAppException(tourii_backend_app_error_type_1.TouriiBackendAppErrorType.E_TB_011);
            }
            req.apiKeyValid = true;
            const version = req.header('accept-version');
            const currentVersion = this.configService.get('API_VERSION', '1.0.0');
            if (!version) {
                throw new tourii_backend_app_exception_1.TouriiBackendAppException(tourii_backend_app_error_type_1.TouriiBackendAppErrorType.E_TB_020);
            }
            if (!semver_1.default.valid(version)) {
                throw new tourii_backend_app_exception_1.TouriiBackendAppException(tourii_backend_app_error_type_1.TouriiBackendAppErrorType.E_TB_021);
            }
            if (semver_1.default.lt(version, currentVersion)) {
                throw new tourii_backend_app_exception_1.TouriiBackendAppException(tourii_backend_app_error_type_1.TouriiBackendAppErrorType.E_TB_022);
            }
            (0, helmet_1.default)({
                contentSecurityPolicy: {
                    directives: {
                        defaultSrc: ["'self'"],
                        scriptSrc: ["'self'", "'unsafe-inline'"],
                        styleSrc: ["'self'", "'unsafe-inline'"],
                        imgSrc: ["'self'", 'data:', 'https:'],
                        baseUri: ["'self'"],
                        fontSrc: ["'self'", 'https:', 'data:'],
                        formAction: ["'self'"],
                        frameAncestors: ["'self'"],
                        objectSrc: ["'none'"],
                        scriptSrcAttr: ["'none'"],
                        upgradeInsecureRequests: [],
                    },
                },
                crossOriginEmbedderPolicy: true,
                crossOriginOpenerPolicy: {
                    policy: 'same-origin',
                },
                crossOriginResourcePolicy: {
                    policy: 'same-site',
                },
                dnsPrefetchControl: {
                    allow: false,
                },
                frameguard: {
                    action: 'deny',
                },
                hidePoweredBy: true,
                hsts: {
                    maxAge: 31536000,
                    includeSubDomains: true,
                    preload: true,
                },
                ieNoOpen: true,
                noSniff: true,
                originAgentCluster: true,
                permittedCrossDomainPolicies: {
                    permittedPolicies: 'none',
                },
                referrerPolicy: {
                    policy: 'strict-origin-when-cross-origin',
                },
                xssFilter: true,
            })(req, res, () => {
                const allowedOrigin = this.configService.get('CORS_ORIGIN', 'https://*.tourii.xyz');
                const _origin = req.headers.origin;
                const corsMiddleware = (0, cors_1.default)({
                    origin: (origin, callback) => {
                        if (!origin) {
                            callback(null, false);
                            return;
                        }
                        const pattern = allowedOrigin.replace('*.', '(.+\\.)?');
                        const regex = new RegExp(`^${pattern.replace(/\./g, '\\.')}$`);
                        if (regex.test(origin)) {
                            callback(null, origin);
                        }
                        else {
                            callback(new Error('Not allowed by CORS'));
                        }
                    },
                    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
                    allowedHeaders: [
                        'Content-Type',
                        'Authorization',
                        'x-api-key',
                        'accept-version',
                    ],
                    credentials: true,
                    maxAge: 86400,
                    exposedHeaders: [
                        'X-RateLimit-Limit',
                        'X-RateLimit-Remaining',
                        'X-RateLimit-Reset',
                    ],
                });
                if (req.method === 'OPTIONS') {
                    corsMiddleware(req, res, () => {
                        res.status(204).end();
                    });
                    return;
                }
                corsMiddleware(req, res, () => {
                    res.setHeader('X-Content-Type-Options', 'nosniff');
                    res.setHeader('X-Frame-Options', 'DENY');
                    res.setHeader('X-XSS-Protection', '1; mode=block');
                    res.setHeader('X-Permitted-Cross-Domain-Policies', 'none');
                    next();
                });
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
/* 130 */
/***/ ((module) => {

module.exports = require("cors");

/***/ }),
/* 131 */
/***/ ((module) => {

module.exports = require("helmet");

/***/ }),
/* 132 */
/***/ ((module) => {

module.exports = require("semver");

/***/ }),
/* 133 */
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
exports.TouriiBackendApiMiddleware = void 0;
const context_storage_1 = __webpack_require__(16);
const common_1 = __webpack_require__(4);
const tourii_backend_context_provider_1 = __webpack_require__(128);
let TouriiBackendApiMiddleware = class TouriiBackendApiMiddleware {
    constructor(logger) {
        this.logger = logger;
        this.sensitiveHeaders = [
            'x-api-key',
            'api-key',
            'apikey',
            'authorization',
            'accept-version',
            'cookie',
        ];
    }
    use(req, _res, next) {
        this.context = new tourii_backend_context_provider_1.TouriiBackendContextProvider(req);
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
exports.TouriiBackendApiMiddleware = TouriiBackendApiMiddleware;
exports.TouriiBackendApiMiddleware = TouriiBackendApiMiddleware = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [typeof (_a = typeof common_1.Logger !== "undefined" && common_1.Logger) === "function" ? _a : Object])
], TouriiBackendApiMiddleware);


/***/ })
/******/ 	]);
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
/******/ 			id: moduleId,
/******/ 			loaded: false,
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = __webpack_module_cache__;
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/node module decorator */
/******/ 	(() => {
/******/ 		__webpack_require__.nmd = (module) => {
/******/ 			module.paths = [];
/******/ 			if (!module.children) module.children = [];
/******/ 			return module;
/******/ 		};
/******/ 	})();
/******/ 	
/************************************************************************/
/******/ 	
/******/ 	// module cache are used so entry inlining is disabled
/******/ 	// startup
/******/ 	// Load entry module and return exports
/******/ 	var __webpack_exports__ = __webpack_require__(__webpack_require__.s = 0);
/******/ 	module.exports = __webpack_exports__;
/******/ 	
/******/ })()
;