import { TouriiBackendAppErrorType } from '@app/core/support/exception/tourii-backend-app-error-type';
import { TouriiBackendAppException } from '@app/core/support/exception/tourii-backend-app-exception';
import { Controller, Get, HttpStatus, Logger, Post, Req, Res, Param } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { Request, Response } from 'express';
import { TouriiOnchainService } from '../service/tourii-onchain.service';
import { userDataSchema } from './model/request/user-data-request-dto';

@Controller()
export class TouriiOnchainController {
    constructor(private readonly touriiOnchainService: TouriiOnchainService) {}

    @Get('/health-check')
    @ApiTags('Health Check')
    @ApiOperation({
        summary: 'Health Check',
    })
    @ApiResponse({
        status: HttpStatus.OK,
        description: 'Success',
    })
    checkHealth(): string {
        return 'OK';
    }

    @Get('keyring/address')
    @ApiOperation({
        summary: 'Get user keyring address',
    })
    @ApiResponse({
        status: HttpStatus.OK,
        description: 'Success',
    })
    @ApiResponse({
        status: HttpStatus.INTERNAL_SERVER_ERROR,
        description: 'Error',
    })
    async userKeyringAddress(@Req() req: Request, @Res() res: Response) {
        // biome-ignore lint/complexity/useLiteralKeys: <explanation>
        const token = req.cookies.token;

        try {
            res.json(await this.touriiOnchainService.userKeyringAddress(token));
        } catch (e) {
            Logger.log(`Error: ${JSON.stringify(e)}`);
            res.status(500).send(new TouriiBackendAppException(TouriiBackendAppErrorType.E_TB_001));
        }
    }

    @Post('keyring/login')
    @ApiOperation({
        summary: 'Login user',
    })
    @ApiResponse({
        status: HttpStatus.OK,
        description: 'Success',
    })
    @ApiResponse({
        status: HttpStatus.BAD_REQUEST,
        description: 'Bad Credentials',
    })
    async loginUser(@Req() req: Request, @Res() res: Response) {
        const data = req.body;
        const result = userDataSchema.safeParse(data);

        if (!result.success) {
            res.status(400).send(new TouriiBackendAppException(TouriiBackendAppErrorType.E_TB_005));
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
        } catch (e) {
            Logger.log(`Error: ${JSON.stringify(e)}`);
            res.status(401).send(new TouriiBackendAppException(TouriiBackendAppErrorType.E_TB_001));
        }
    }

    @Post('keyring/register')
    @ApiOperation({
        summary: 'Register user',
    })
    @ApiResponse({
        status: HttpStatus.OK,
        description: 'Success',
    })
    @ApiResponse({
        status: HttpStatus.BAD_REQUEST,
        description: 'Bad Credentials',
    })
    async registerUser(@Req() req: Request, @Res() res: Response) {
        const data = req.body;
        const result = userDataSchema.safeParse(data);

        if (!result.success) {
            res.status(400).send(new TouriiBackendAppException(TouriiBackendAppErrorType.E_TB_005));
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
        } catch (e) {
            Logger.log(`Error: ${JSON.stringify(e)}`);
            res.status(500).send(new TouriiBackendAppException(TouriiBackendAppErrorType.E_TB_001));
        }
    }

    @Post('keyring/logout')
    async logoutUser(@Res() res: Response) {
        res.clearCookie('token');
        res.send('User logged out');
    }

    @Post('send-green')
    async sendGreen(@Req() req: Request, @Res() res: Response) {
        // biome-ignore lint/complexity/useLiteralKeys: <explanation>
        const token = req.cookies.token;

        try {
            const response = await this.touriiOnchainService.sendGreen(token);
            res.send(`Response: ${JSON.stringify(response)}`);
        } catch (e) {
            res.status(500).send(`Error: ${JSON.stringify(e)}`);
        }
    }

    @Post('send-yellow')
    async sendYellow(@Req() req: Request, @Res() res: Response) {
        // biome-ignore lint/complexity/useLiteralKeys: <explanation>
        const token = req.cookies.token;

        try {
            const response = await this.touriiOnchainService.sendYellow(token);
            res.send(`Response: ${JSON.stringify(response)}`);
        } catch (e) {
            res.status(500).send(`Error: ${JSON.stringify(e)}`);
        }
    }

    @Post('send-red')
    async sendRed(@Req() req: Request, @Res() res: Response) {
        // biome-ignore lint/complexity/useLiteralKeys: <explanation>
        const token = req.cookies.token;

        try {
            const response = await this.touriiOnchainService.sendRed(token);
            res.send(`Response: ${JSON.stringify(response)}`);
        } catch (e) {
            res.status(500).send(`Error: ${JSON.stringify(e)}`);
        }
    }

    @Get('read-state')
    async readState(@Res() res: Response) {
        try {
            const response = await this.touriiOnchainService.readState();
            res.send(`Response: ${JSON.stringify(response)}`);
        } catch (e) {
            res.status(500).send(`Error: ${JSON.stringify(e)}`);
        }
    }

    @Get('web3/passport/:passportTokenId/linked-children')
    async linkedChildren(@Param('passportTokenId') passportTokenId: string) {
        return this.touriiOnchainService.getLinkedChildren(passportTokenId);
    }
}
