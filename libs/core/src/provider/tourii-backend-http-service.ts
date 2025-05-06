import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import axios, { type AxiosInstance, type AxiosResponse } from 'axios';

@Injectable()
export class TouriiBackendHttpService {
    private httpService: HttpService;
    private axiosInstance: AxiosInstance;

    constructor() {
        this.init();
    }

    /**
     * httpService初期化処理
     */
    init() {
        this.axiosInstance = axios.create();
        this.httpService = new HttpService(this.axiosInstance);
        this.httpService.axiosRef.interceptors.response.use(async (response: AxiosResponse) => {
            return response;
        });
    }

    /**
     * httpService
     */
    get getTouriiBackendHttpService() {
        return this.httpService;
    }
}
