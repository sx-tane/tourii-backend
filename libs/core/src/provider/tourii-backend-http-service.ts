import { HttpService } from '@nestjs/axios';
import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import axios, {
    type AxiosError,
    type AxiosInstance,
    type AxiosRequestConfig,
    type AxiosResponse,
} from 'axios';
import axiosRetry from 'axios-retry';

@Injectable()
export class TouriiBackendHttpService {
    private httpService: HttpService;
    private axiosInstance: AxiosInstance;
    private readonly logger = new Logger(TouriiBackendHttpService.name);

    constructor(private readonly configService: ConfigService) {
        this.init();
    }

    /**
     * httpService初期化処理
     */
    init() {
        this.axiosInstance = axios.create({
            timeout: this.configService.get<number>('HTTP_DEFAULT_TIMEOUT', 10000),
        });

        axiosRetry(this.axiosInstance, {
            retries: this.configService.get<number>('HTTP_DEFAULT_RETRIES', 2),
            retryDelay: (retryCount: number, error: AxiosError) => {
                this.logger.log(
                    `Request to ${error.config?.url} failed. Attempt #${retryCount}. Retrying in ${retryCount * 1000}ms...`,
                    `Error: ${error.code || error.message}`,
                );
                return retryCount * 1000;
            },
            retryCondition: (error: AxiosError) => {
                return (
                    axiosRetry.isNetworkError(error) ||
                    axiosRetry.isRetryableError(error) ||
                    error.code === 'ECONNABORTED' ||
                    (error.response?.status !== undefined &&
                        error.response.status >= 500 &&
                        error.response.status <= 599)
                );
            },
            onRetry: (retryCount: number, error: AxiosError, requestConfig: AxiosRequestConfig) => {
                this.logger.warn(
                    `Retrying request: ${requestConfig.method?.toUpperCase()} ${requestConfig.url} - Attempt #${retryCount}. Last error: ${error.code || error.message}`,
                );
            },
        });

        this.httpService = new HttpService(this.axiosInstance);

        this.axiosInstance.interceptors.response.use(
            (response: AxiosResponse) => {
                return response;
            },
            (error: AxiosError) => {
                if (axios.isAxiosError(error)) {
                    this.logger.error(
                        `HTTP Request Failed (after retries if applicable): ${error.config?.method?.toUpperCase()} ${error.config?.url}`,
                        `Error: ${error.message}, Status: ${error.response?.status}, Response: ${JSON.stringify(error.response?.data)}`,
                        error.stack,
                    );
                } else {
                    this.logger.error(
                        `Non-Axios HTTP Error encountered: ${(error as Error).message}`,
                        (error as Error).stack,
                    );
                }
                return Promise.reject(error);
            },
        );
    }

    /**
     * httpService
     */
    get getTouriiBackendHttpService() {
        return this.httpService;
    }
}
