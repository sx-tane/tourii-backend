import { Entity } from '../entity';

interface UserProps {
  userId: string;
  username: string;
  discordId?: string;
  discordUsername?: string;
  twitterId?: string;
  twitterUsername?: string;
  googleEmail?: string;
  email?: string;
  password: string;
  passportWalletAddress?: string;
  perksWalletAddress: string;
  latestIpAddress?: string;
  isPremium: boolean;
  totalQuestCompleted: number;
  totalTravelDistance: number;
  role: string;
  registeredAt: Date;
  discordJoinedAt: Date;
  isBanned: boolean;
  delFlag: boolean;
  insUserId: string;
  insDateTime: Date;
  updUserId: string;
  updDateTime: Date;
  requestId?: string;
}

export class UserEntity extends Entity<UserProps> {
  // biome-ignore lint/complexity/noUselessConstructor: <explanation>
  constructor(props: UserProps, id: string) {
    super(props, id);
  }

  get userId(): string {
    return this.props.userId;
  }

  get username(): string {
    return this.props.username;
  }

  get discordId(): string | undefined {
    return this.props.discordId;
  }

  get discordUsername(): string | undefined {
    return this.props.discordUsername;
  }

  get twitterId(): string | undefined {
    return this.props.twitterId;
  }

  get twitterUsername(): string | undefined {
    return this.props.twitterUsername;
  }

  get googleEmail(): string | undefined {
    return this.props.googleEmail;
  }

  get email(): string | undefined {
    return this.props.email;
  }

  get password(): string {
    return this.props.password;
  }

  get passportWalletAddress(): string | undefined {
    return this.props.passportWalletAddress;
  }

  get perksWalletAddress(): string {
    return this.props.perksWalletAddress;
  }

  get latestIpAddress(): string | undefined {
    return this.props.latestIpAddress;
  }

  get isPremium(): boolean {
    return this.props.isPremium;
  }

  get totalQuestCompleted(): number {
    return this.props.totalQuestCompleted;
  }

  get totalTravelDistance(): number {
    return this.props.totalTravelDistance;
  }

  get role(): string {
    return this.props.role;
  }

  get registeredAt(): Date {
    return this.props.registeredAt;
  }

  get discordJoinedAt(): Date {
    return this.props.discordJoinedAt;
  }

  get isBanned(): boolean {
    return this.props.isBanned;
  }

  get delFlag(): boolean {
    return this.props.delFlag;
  }

  get insUserId(): string {
    return this.props.insUserId;
  }

  get insDateTime(): Date {
    return this.props.insDateTime;
  }

  get updUserId(): string {
    return this.props.updUserId;
  }

  get updDateTime(): Date {
    return this.props.updDateTime;
  }

  get requestId(): string | undefined {
    return this.props.requestId;
  }
}
