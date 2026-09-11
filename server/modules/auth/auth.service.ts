import { Inject, Injectable, Logger, UnauthorizedException, ConflictException, BadRequestException } from '@nestjs/common';
import { DRIZZLE_DATABASE, type PostgresJsDatabase } from '@lark-apaas/fullstack-nestjs-core';
import { eq } from 'drizzle-orm';
import { createHash, randomUUID } from 'crypto';
import type { UserInfo, LoginRequest, RegisterRequest } from '@shared/api.interface';
import { vpUsers, vpSettings } from '@server/database/schema';

const PASSWORD_SALT = 'visionpilot_2025_salt';
const SESSION_DURATION_MS = 7 * 24 * 60 * 60 * 1000; // 7 days

function hashPassword(password: string): string {
  return createHash('sha256').update(PASSWORD_SALT + password).digest('hex');
}

function mapToUserInfo(user: typeof vpUsers.$inferSelect): UserInfo {
  return {
    id: user.id,
    account: user.account,
    nickname: user.nickname ?? null,
    phone: user.phone ?? null,
    email: user.email ?? null,
  };
}

function isPhone(account: string): boolean {
  return /^1[3-9]\d{9}$/.test(account);
}

function isEmail(account: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(account);
}

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);

  constructor(
    @Inject(DRIZZLE_DATABASE) private readonly db: PostgresJsDatabase,
  ) {}

  async register(dto: RegisterRequest): Promise<{ success: boolean; user: UserInfo; token: string }> {
    const { account, verifyCode, password, confirmPassword } = dto;

    // Validate account
    if (!account || account.trim().length === 0) {
      throw new BadRequestException('账号不能为空');
    }
    if (!isPhone(account) && !isEmail(account)) {
      throw new BadRequestException('账号必须是手机号或邮箱格式');
    }

    // Validate verifyCode
    if (!verifyCode || verifyCode.trim().length === 0) {
      throw new BadRequestException('验证码不能为空');
    }

    // Validate password
    if (!password || password.length < 6) {
      throw new BadRequestException('密码长度不能少于6位');
    }
    if (password !== confirmPassword) {
      throw new BadRequestException('两次输入的密码不一致');
    }

    // Check if account already exists
    const existingUsers: typeof vpUsers.$inferSelect[] = await this.db
      .select()
      .from(vpUsers)
      .where(eq(vpUsers.account, account));

    if (existingUsers.length > 0) {
      throw new ConflictException('该账号已被注册');
    }

    const passwordHash = hashPassword(password);
    const sessionToken = randomUUID();
    const sessionExpiresAt = new Date(Date.now() + SESSION_DURATION_MS);

    const phone = isPhone(account) ? account : null;
    const email = isEmail(account) ? account : null;

    // Create user and default settings in a transaction
    const createdUsers: typeof vpUsers.$inferSelect[] = await this.db.transaction(async (tx) => {
      const newUsers: typeof vpUsers.$inferSelect[] = await tx
        .insert(vpUsers)
        .values({
          account,
          passwordHash,
          phone,
          email,
          nickname: account,
          sessionToken,
          sessionExpiresAt,
        })
        .returning();

      if (newUsers.length === 0) {
        throw new Error('创建用户失败');
      }

      const newUser = newUsers[0];

      // Create default settings record
      await tx.insert(vpSettings).values({
        userId: newUser.id,
      });

      return newUsers;
    });

    const user = createdUsers[0];

    this.logger.log(`用户注册成功: account=${account}`);

    return {
      success: true,
      user: mapToUserInfo(user),
      token: sessionToken,
    };
  }

  async login(dto: LoginRequest): Promise<{ user: UserInfo; token: string }> {
    const { account, password } = dto;

    const users: typeof vpUsers.$inferSelect[] = await this.db
      .select()
      .from(vpUsers)
      .where(eq(vpUsers.account, account));

    if (users.length === 0) {
      throw new UnauthorizedException('账号或密码错误');
    }

    const user = users[0];
    const inputHash = hashPassword(password);

    if (inputHash !== user.passwordHash) {
      throw new UnauthorizedException('账号或密码错误');
    }

    // Generate session token
    const sessionToken = randomUUID();
    const sessionExpiresAt = new Date(Date.now() + SESSION_DURATION_MS);

    const updatedUsers: typeof vpUsers.$inferSelect[] = await this.db
      .update(vpUsers)
      .set({
        sessionToken,
        sessionExpiresAt,
      })
      .where(eq(vpUsers.id, user.id))
      .returning();

    if (updatedUsers.length === 0) {
      throw new UnauthorizedException('登录失败');
    }

    this.logger.log(`用户登录成功: account=${account}`);

    return {
      user: mapToUserInfo(updatedUsers[0]),
      token: sessionToken,
    };
  }

  async logout(token: string): Promise<{ success: boolean }> {
    if (!token) {
      return { success: true };
    }

    const users: typeof vpUsers.$inferSelect[] = await this.db
      .select()
      .from(vpUsers)
      .where(eq(vpUsers.sessionToken, token));

    if (users.length === 0) {
      return { success: true };
    }

    await this.db
      .update(vpUsers)
      .set({
        sessionToken: null,
        sessionExpiresAt: null,
      })
      .where(eq(vpUsers.id, users[0].id));

    this.logger.log(`用户登出成功: account=${users[0].account}`);

    return { success: true };
  }

  async getCurrentUser(token: string): Promise<UserInfo> {
    if (!token) {
      throw new UnauthorizedException('未登录');
    }

    const users: typeof vpUsers.$inferSelect[] = await this.db
      .select()
      .from(vpUsers)
      .where(eq(vpUsers.sessionToken, token));

    if (users.length === 0) {
      throw new UnauthorizedException('会话已失效，请重新登录');
    }

    const user = users[0];

    // Check session expiration
    if (user.sessionExpiresAt && user.sessionExpiresAt.getTime() < Date.now()) {
      // Clear expired session
      await this.db
        .update(vpUsers)
        .set({
          sessionToken: null,
          sessionExpiresAt: null,
        })
        .where(eq(vpUsers.id, user.id));

      throw new UnauthorizedException('会话已过期，请重新登录');
    }

    return mapToUserInfo(user);
  }
}
