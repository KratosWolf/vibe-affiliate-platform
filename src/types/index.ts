// Core Types for VIBE Affiliate Platform

export type UserRole = 'admin' | 'affiliate' | 'advertiser' | 'manager';

export type CampaignStatus = 'draft' | 'active' | 'paused' | 'ended';

export type ConversionStatus = 'pending' | 'approved' | 'rejected' | 'paid';

export type PaymentStatus = 'pending' | 'processing' | 'completed' | 'failed' | 'cancelled';

// User Types
export interface User {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  avatar?: string;
  phone?: string;
  country?: string;
  timezone?: string;
  isVerified: boolean;
  isActive: boolean;
  lastLogin?: Date;
  createdAt: Date;
  updatedAt: Date;
}

export interface UserProfile extends User {
  bio?: string;
  website?: string;
  company?: string;
  taxId?: string;
  paymentMethods: PaymentMethod[];
  preferences: UserPreferences;
  stats: UserStats;
}

export interface UserPreferences {
  notifications: {
    email: boolean;
    push: boolean;
    sms: boolean;
  };
  language: string;
  currency: string;
  timezone: string;
}

export interface UserStats {
  totalEarnings: number;
  totalConversions: number;
  totalClicks: number;
  conversionRate: number;
  averageOrderValue: number;
}

// Campaign Types
export interface Campaign {
  id: string;
  name: string;
  description?: string;
  status: CampaignStatus;
  category: string;
  
  // Financial
  budget: number;
  spent: number;
  revenue: number;
  commissionRate: number;
  commissionType: 'percentage' | 'fixed';
  
  // Performance
  clicks: number;
  conversions: number;
  conversionRate: number;
  ctr: number; // Click-through rate
  epc: number; // Earnings per click
  
  // Targeting
  countries: string[];
  devices: ('desktop' | 'mobile' | 'tablet')[];
  trafficSources: string[];
  
  // Dates
  startDate: Date;
  endDate?: Date;
  createdAt: Date;
  updatedAt: Date;
  
  // Relations
  advertiserId: string;
  createdBy: string;
  
  // Media
  images: string[];
  bannerUrl?: string;
  landingPageUrl: string;
  
  // Settings
  isPrivate: boolean;
  requiresApproval: boolean;
  maxDailyBudget?: number;
}

// Conversion Types
export interface Conversion {
  id: string;
  campaignId: string;
  affiliateId: string;
  advertiserId: string;
  
  // Tracking
  clickId: string;
  transactionId?: string;
  orderId?: string;
  
  // Financial
  amount: number;
  currency: string;
  commission: number;
  
  // Status
  status: ConversionStatus;
  
  // Attribution
  clickTimestamp: Date;
  conversionTimestamp: Date;
  
  // Customer data (anonymized)
  customerCountry?: string;
  customerDevice: 'desktop' | 'mobile' | 'tablet';
  customerOS?: string;
  customerBrowser?: string;
  
  // Metadata
  referrer?: string;
  utmSource?: string;
  utmMedium?: string;
  utmCampaign?: string;
  
  createdAt: Date;
  updatedAt: Date;
}

// Payment Types
export interface PaymentMethod {
  id: string;
  userId: string;
  type: 'paypal' | 'bank_transfer' | 'pix' | 'crypto';
  details: Record<string, string>;
  isDefault: boolean;
  isVerified: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface Payment {
  id: string;
  userId: string;
  amount: number;
  currency: string;
  status: PaymentStatus;
  paymentMethodId: string;
  
  // References
  conversions: string[]; // Conversion IDs included in this payment
  
  // Processing
  processingFee?: number;
  netAmount: number;
  
  // External references
  transactionId?: string;
  gatewayResponse?: Record<string, any>;
  
  // Dates
  requestedAt: Date;
  processedAt?: Date;
  completedAt?: Date;
  
  // Metadata
  notes?: string;
  
  createdAt: Date;
  updatedAt: Date;
}

// Link Types
export interface AffiliateLink {
  id: string;
  campaignId: string;
  affiliateId: string;
  
  // Link details
  shortUrl: string;
  originalUrl: string;
  slug?: string;
  
  // Performance
  clicks: number;
  uniqueClicks: number;
  conversions: number;
  
  // Settings
  isActive: boolean;
  expiresAt?: Date;
  
  // Tracking
  utmParams: {
    source?: string;
    medium?: string;
    campaign?: string;
    content?: string;
    term?: string;
  };
  
  createdAt: Date;
  updatedAt: Date;
}

// Analytics Types
export interface DashboardMetrics {
  period: {
    start: Date;
    end: Date;
  };
  
  // Overview
  totalRevenue: number;
  totalCommissions: number;
  totalClicks: number;
  totalConversions: number;
  
  // Rates
  conversionRate: number;
  clickThroughRate: number;
  averageOrderValue: number;
  earningsPerClick: number;
  
  // Growth (compared to previous period)
  growth: {
    revenue: number;
    commissions: number;
    clicks: number;
    conversions: number;
  };
  
  // Top performers
  topCampaigns: CampaignPerformance[];
  topAffiliates: AffiliatePerformance[];
  topCountries: CountryPerformance[];
}

export interface CampaignPerformance {
  campaignId: string;
  campaignName: string;
  revenue: number;
  conversions: number;
  clicks: number;
  conversionRate: number;
}

export interface AffiliatePerformance {
  affiliateId: string;
  affiliateName: string;
  revenue: number;
  conversions: number;
  commissions: number;
}

export interface CountryPerformance {
  country: string;
  countryName: string;
  revenue: number;
  conversions: number;
  clicks: number;
}

// API Response Types
export interface APIResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
  meta?: {
    page?: number;
    limit?: number;
    total?: number;
    hasNext?: boolean;
    hasPrev?: boolean;
  };
}

export interface PaginatedResponse<T> extends APIResponse<T[]> {
  meta: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    hasNext: boolean;
    hasPrev: boolean;
  };
}

// Form Types
export interface LoginForm {
  email: string;
  password: string;
  rememberMe?: boolean;
}

export interface RegisterForm {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
  role: UserRole;
  acceptTerms: boolean;
}

export interface CreateCampaignForm {
  name: string;
  description?: string;
  category: string;
  landingPageUrl: string;
  budget: number;
  commissionRate: number;
  commissionType: 'percentage' | 'fixed';
  startDate: string;
  endDate?: string;
  countries: string[];
  requiresApproval: boolean;
}

export interface UpdateProfileForm {
  name: string;
  bio?: string;
  website?: string;
  company?: string;
  phone?: string;
  country?: string;
}

// Chart/Visualization Types
export interface ChartDataPoint {
  date: string;
  value: number;
  label?: string;
}

export interface ChartSeries {
  name: string;
  data: ChartDataPoint[];
  color?: string;
}

// Notification Types
export interface Notification {
  id: string;
  userId: string;
  type: 'info' | 'success' | 'warning' | 'error';
  title: string;
  message: string;
  isRead: boolean;
  actionUrl?: string;
  actionLabel?: string;
  createdAt: Date;
}

// Filter Types
export interface DateFilter {
  start: Date;
  end: Date;
  period: '7d' | '30d' | '90d' | 'custom';
}

export interface CampaignFilter {
  status?: CampaignStatus[];
  category?: string[];
  country?: string[];
  search?: string;
  sortBy?: 'name' | 'revenue' | 'conversions' | 'created';
  sortOrder?: 'asc' | 'desc';
}

export interface ConversionFilter extends DateFilter {
  status?: ConversionStatus[];
  campaignId?: string;
  affiliateId?: string;
  minAmount?: number;
  maxAmount?: number;
}

// Webhook Types
export interface WebhookPayload {
  event: string;
  timestamp: string;
  data: Record<string, any>;
  signature?: string;
}

export interface ConversionWebhook extends WebhookPayload {
  event: 'conversion.created' | 'conversion.updated';
  data: {
    conversion: Conversion;
    campaign: Campaign;
    affiliate: Partial<User>;
  };
}

// Error Types
export interface AppError {
  code: string;
  message: string;
  statusCode: number;
  details?: Record<string, any>;
}

// Theme Types
export interface ThemeConfig {
  mode: 'light' | 'dark' | 'system';
  primaryColor: string;
  accentColor: string;
  borderRadius: 'none' | 'sm' | 'md' | 'lg';
}