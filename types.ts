
export enum PlanType {
  FREE = 'FREE',
  BASIC = 'BASIC',
  PRO = 'PRO',
  PREMIUM = 'PREMIUM'
}

export enum UserStatus {
  ACTIVE = 'ACTIVE',
  WAITING_HOTMART = 'WAITING_HOTMART',
  TRIAL_EXPIRED = 'TRIAL_EXPIRED',
  CANCELLED = 'CANCELLED'
}

export interface UserAccount {
  id: string;
  email: string;
  name: string;
  plan: PlanType;
  status: UserStatus;
  joinedAt: string;
  credits: {
    weekly: number;
    used: number;
    extra: number;
  };
}

export interface UserUsage {
  credits: {
    weekly: number;
    used: number;
    resets: string;
  };
  history: GeneratedImage[];
  plan: PlanType;
}

export interface GeneratedImage {
  id: string;
  url: string;
  niche: string;
  caption?: string;
  createdAt: string;
  config: GenerationConfig;
}

export interface GenerationConfig {
  nicheId: string;
  quality: 'STANDARD';
  aspectRatio: '1:1' | '9:16' | '3:4';
  text?: string;
  price?: string;
}

export interface Niche {
  id: string;
  name: string;
  icon: string;
  description: string;
  context: {
    lighting: string;
    atmosphere: string;
    colors: string;
    composition: string;
  };
}

export interface AssetUploads {
  productPhoto: string | null;
  brandLogo: string | null;
  styleReference: string | null;
}
