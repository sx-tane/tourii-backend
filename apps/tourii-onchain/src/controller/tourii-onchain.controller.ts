import { Controller, Get, Post, Req, Res } from '@nestjs/common';
import { Request, Response } from 'express';
import { TouriiOnchainService } from '../service/tourii-onchain.service';
import { userDataSchema } from './model/request/user-data-request-dto';

@Controller()
export class TouriiOnchainController {
  constructor(private readonly touriiOnchainService: TouriiOnchainService) {}

  @Get()
  getHello(): string {
    return 'Hello, Sails!';
  }

  @Get('keyring/address')
  async userKeyringAddress(@Req() req: Request, @Res() res: Response) {
    const token = req.cookies.token;

    try {
      const userKeyringAddress =
        await this.touriiOnchainService.userKeyringAddress(token);
      res.json({ userKeyringAddress });
    } catch (e) {
      res.status(500).send(`Error: ${JSON.stringify(e)}`);
    }
  }

  @Post('keyring/login')
  async loginUser(@Req() req: Request, @Res() res: Response) {
    const data = req.body;
    const result = userDataSchema.safeParse(data);

    if (!result.success) {
      const response = {
        message: 'bad parameters',
        expected: '{ username: string, password: string }',
      };

      res.status(400).send(response);
      return;
    }

    const { username, password } = result.data;

    try {
      const token = await this.touriiOnchainService.loginUser(
        username,
        password,
      );
      res.cookie('token', token, { httpOnly: true, maxAge: 3600000 });
      res.send('User logged in successfully');
    } catch (e) {
      res.status(401).send(`Error: ${JSON.stringify(e)}`);
    }
  }

  @Post('keyring/register')
  async registerUser(@Req() req: Request, @Res() res: Response) {
    const data = req.body;
    const result = userDataSchema.safeParse(data);

    if (!result.success) {
      const response = {
        message: 'bad parameters',
        expected: '{ username: string, password: string }',
      };

      res.status(400).send(response);
      return;
    }

    const { username, password } = result.data;

    try {
      const token = await this.touriiOnchainService.registerUser(
        username,
        password,
      );
      res.cookie('token', token, { httpOnly: true, maxAge: 3600000 });
      res.send('User registered');
    } catch (e) {
      res.status(500).send(`Error: ${JSON.stringify(e)}`);
    }
  }

  @Post('keyring/logout')
  async logoutUser(@Res() res: Response) {
    res.clearCookie('token');
    res.send('User logged out');
  }

  @Post('send-green')
  async sendGreen(@Req() req: Request, @Res() res: Response) {
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
}
