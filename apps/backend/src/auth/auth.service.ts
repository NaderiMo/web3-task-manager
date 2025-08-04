import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ethers } from 'ethers';
import { PrismaService } from '../prisma/prisma.service';

export interface AuthRequest {
  wallet: string;
  signature: string;
  message: string;
}

export interface AuthResponse {
  access_token: string;
  user: {
    id: string;
    wallet: string;
  };
}

@Injectable()
export class AuthService {
  constructor(
    private jwtService: JwtService,
    private prisma: PrismaService,
  ) {}

  async generateNonce(wallet: string): Promise<string> {
    const nonce = Math.floor(Math.random() * 1000000).toString();
    const message = `Sign this message to authenticate with Web3 Task Manager. Nonce: ${nonce}`;

    return message;
  }

  async verifySignature(
    wallet: string,
    signature: string,
    message: string,
  ): Promise<boolean> {
    try {
      const recoveredAddress = ethers.verifyMessage(message, signature);
      return recoveredAddress.toLowerCase() === wallet.toLowerCase();
    } catch (error) {
      return false;
    }
  }

  async authenticate(authRequest: AuthRequest): Promise<AuthResponse> {
    const { wallet, signature, message } = authRequest;

    const isValid = await this.verifySignature(wallet, signature, message);
    if (!isValid) {
      throw new UnauthorizedException('Invalid signature');
    }

    let user = await this.prisma.user.findUnique({
      where: { wallet: wallet.toLowerCase() },
    });

    if (!user) {
      user = await this.prisma.user.create({
        data: {
          wallet: wallet.toLowerCase(),
        },
      });
    }

    const payload = { sub: user.id, wallet: user.wallet };
    const access_token = this.jwtService.sign(payload);

    return {
      access_token,
      user: {
        id: user.id,
        wallet: user.wallet,
      },
    };
  }

  async validateUser(userId: string) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
    });
    return user;
  }
}
