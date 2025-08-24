// Mock Data for VIBE Affiliate Platform
import type {
  User, Campaign, Conversion, Payment, AffiliateLink, 
  DashboardMetrics, CampaignPerformance, UserStats
} from '@/types';

// Utility function to simulate network delay
export const simulateNetworkDelay = (min = 200, max = 1200) => {
  const delay = Math.random() * (max - min) + min;
  return new Promise(resolve => setTimeout(resolve, delay));
};

// Mock Users Data
export const mockUsers: User[] = [
  {
    id: 'user_1',
    email: 'admin@vibe.com',
    name: 'Admin VIBE',
    role: 'admin',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face',
    phone: '+55 11 99999-9999',
    country: 'BR',
    timezone: 'America/Sao_Paulo',
    isVerified: true,
    isActive: true,
    lastLogin: new Date('2024-08-24T08:30:00Z'),
    createdAt: new Date('2024-01-01T00:00:00Z'),
    updatedAt: new Date('2024-08-24T08:30:00Z'),
  },
  {
    id: 'user_2',
    email: 'affiliate@example.com',
    name: 'João Silva',
    role: 'affiliate',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face',
    phone: '+55 11 88888-8888',
    country: 'BR',
    timezone: 'America/Sao_Paulo',
    isVerified: true,
    isActive: true,
    lastLogin: new Date('2024-08-23T18:45:00Z'),
    createdAt: new Date('2024-02-15T00:00:00Z'),
    updatedAt: new Date('2024-08-23T18:45:00Z'),
  },
  {
    id: 'user_3',
    email: 'advertiser@company.com',
    name: 'Maria Santos',
    role: 'advertiser',
    avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b2ad?w=150&h=150&fit=crop&crop=face',
    phone: '+55 11 77777-7777',
    country: 'BR',
    timezone: 'America/Sao_Paulo',
    isVerified: true,
    isActive: true,
    lastLogin: new Date('2024-08-24T09:15:00Z'),
    createdAt: new Date('2024-03-01T00:00:00Z'),
    updatedAt: new Date('2024-08-24T09:15:00Z'),
  },
];

// Mock Campaigns Data
export const mockCampaigns: Campaign[] = [
  {
    id: 'camp_1',
    name: 'Black Friday 2024 - Electronics',
    description: 'Promoção especial Black Friday com até 70% de desconto em eletrônicos',
    status: 'active',
    category: 'Eletrônicos',
    budget: 100000,
    spent: 65000,
    revenue: 325000,
    commissionRate: 8.5,
    commissionType: 'percentage',
    clicks: 15420,
    conversions: 1285,
    conversionRate: 8.33,
    ctr: 3.2,
    epc: 21.08,
    countries: ['BR', 'AR', 'CL', 'MX'],
    devices: ['desktop', 'mobile', 'tablet'],
    trafficSources: ['google', 'facebook', 'instagram', 'tiktok'],
    startDate: new Date('2024-11-01T00:00:00Z'),
    endDate: new Date('2024-12-01T23:59:59Z'),
    createdAt: new Date('2024-10-15T00:00:00Z'),
    updatedAt: new Date('2024-08-24T10:00:00Z'),
    advertiserId: 'user_3',
    createdBy: 'user_3',
    images: [
      'https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=800&h=400&fit=crop',
      'https://images.unsplash.com/photo-1586953208448-b95a79798f07?w=800&h=400&fit=crop'
    ],
    bannerUrl: 'https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?w=1200&h=300&fit=crop',
    landingPageUrl: 'https://exemplo-loja.com/black-friday',
    isPrivate: false,
    requiresApproval: true,
    maxDailyBudget: 5000,
  },
  {
    id: 'camp_2',
    name: 'Curso de Marketing Digital',
    description: 'Curso completo de marketing digital com certificado reconhecido',
    status: 'active',
    category: 'Educação',
    budget: 50000,
    spent: 23000,
    revenue: 150000,
    commissionRate: 25,
    commissionType: 'percentage',
    clicks: 8930,
    conversions: 567,
    conversionRate: 6.35,
    ctr: 4.1,
    epc: 16.80,
    countries: ['BR', 'PT'],
    devices: ['desktop', 'mobile'],
    trafficSources: ['youtube', 'google', 'facebook'],
    startDate: new Date('2024-08-01T00:00:00Z'),
    endDate: new Date('2024-12-31T23:59:59Z'),
    createdAt: new Date('2024-07-15T00:00:00Z'),
    updatedAt: new Date('2024-08-23T15:30:00Z'),
    advertiserId: 'user_3',
    createdBy: 'user_3',
    images: [
      'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=800&h=400&fit=crop'
    ],
    landingPageUrl: 'https://cursosdigitais.com/marketing',
    isPrivate: false,
    requiresApproval: false,
    maxDailyBudget: 2000,
  },
  {
    id: 'camp_3',
    name: 'Produtos de Beleza Premium',
    description: 'Linha completa de cosméticos premium com ingredientes naturais',
    status: 'paused',
    category: 'Beleza e Cuidados',
    budget: 75000,
    spent: 41000,
    revenue: 205000,
    commissionRate: 12,
    commissionType: 'percentage',
    clicks: 12350,
    conversions: 985,
    conversionRate: 7.97,
    ctr: 2.8,
    epc: 16.60,
    countries: ['BR'],
    devices: ['mobile', 'desktop'],
    trafficSources: ['instagram', 'tiktok', 'youtube'],
    startDate: new Date('2024-06-01T00:00:00Z'),
    createdAt: new Date('2024-05-15T00:00:00Z'),
    updatedAt: new Date('2024-08-20T11:20:00Z'),
    advertiserId: 'user_3',
    createdBy: 'user_3',
    images: [
      'https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=800&h=400&fit=crop'
    ],
    landingPageUrl: 'https://belezapremium.com',
    isPrivate: true,
    requiresApproval: true,
  },
];

// Mock Conversions Data
export const mockConversions: Conversion[] = [
  {
    id: 'conv_1',
    campaignId: 'camp_1',
    affiliateId: 'user_2',
    advertiserId: 'user_3',
    clickId: 'click_123456',
    transactionId: 'tx_789012',
    orderId: 'order_345678',
    amount: 299.90,
    currency: 'BRL',
    commission: 25.49,
    status: 'approved',
    clickTimestamp: new Date('2024-08-23T14:30:00Z'),
    conversionTimestamp: new Date('2024-08-23T14:45:00Z'),
    customerCountry: 'BR',
    customerDevice: 'mobile',
    customerOS: 'iOS',
    customerBrowser: 'Safari',
    referrer: 'https://instagram.com',
    utmSource: 'instagram',
    utmMedium: 'social',
    utmCampaign: 'blackfriday2024',
    createdAt: new Date('2024-08-23T14:45:00Z'),
    updatedAt: new Date('2024-08-24T09:00:00Z'),
  },
  {
    id: 'conv_2',
    campaignId: 'camp_2',
    affiliateId: 'user_2',
    advertiserId: 'user_3',
    clickId: 'click_654321',
    amount: 497.00,
    currency: 'BRL',
    commission: 124.25,
    status: 'pending',
    clickTimestamp: new Date('2024-08-24T10:15:00Z'),
    conversionTimestamp: new Date('2024-08-24T10:30:00Z'),
    customerCountry: 'BR',
    customerDevice: 'desktop',
    customerOS: 'Windows',
    customerBrowser: 'Chrome',
    utmSource: 'google',
    utmMedium: 'search',
    utmCampaign: 'marketing-curso',
    createdAt: new Date('2024-08-24T10:30:00Z'),
    updatedAt: new Date('2024-08-24T10:30:00Z'),
  },
];

// Mock Links Data
export const mockAffiliateLinks: AffiliateLink[] = [
  {
    id: 'link_1',
    campaignId: 'camp_1',
    affiliateId: 'user_2',
    shortUrl: 'https://vibe.ly/bf2024',
    originalUrl: 'https://exemplo-loja.com/black-friday?aff=user_2&camp=camp_1',
    slug: 'bf2024',
    clicks: 5420,
    uniqueClicks: 4890,
    conversions: 425,
    isActive: true,
    utmParams: {
      source: 'vibe',
      medium: 'affiliate',
      campaign: 'blackfriday2024',
      content: 'user_2',
    },
    createdAt: new Date('2024-11-01T00:00:00Z'),
    updatedAt: new Date('2024-08-24T08:00:00Z'),
  },
  {
    id: 'link_2',
    campaignId: 'camp_2',
    affiliateId: 'user_2',
    shortUrl: 'https://vibe.ly/marketing-curso',
    originalUrl: 'https://cursosdigitais.com/marketing?aff=user_2&camp=camp_2',
    clicks: 2180,
    uniqueClicks: 1950,
    conversions: 145,
    isActive: true,
    utmParams: {
      source: 'vibe',
      medium: 'affiliate',
      campaign: 'marketing-digital',
      content: 'user_2',
    },
    createdAt: new Date('2024-08-01T00:00:00Z'),
    updatedAt: new Date('2024-08-24T07:30:00Z'),
  },
];

// Mock Dashboard Metrics
export const mockDashboardMetrics: DashboardMetrics = {
  period: {
    start: new Date('2024-08-17T00:00:00Z'),
    end: new Date('2024-08-24T23:59:59Z'),
  },
  totalRevenue: 125487.50,
  totalCommissions: 15685.94,
  totalClicks: 28450,
  totalConversions: 1856,
  conversionRate: 6.52,
  clickThroughRate: 3.8,
  averageOrderValue: 67.60,
  earningsPerClick: 0.55,
  growth: {
    revenue: 18.5,
    commissions: 22.3,
    clicks: 15.7,
    conversions: 12.4,
  },
  topCampaigns: [
    {
      campaignId: 'camp_1',
      campaignName: 'Black Friday 2024 - Electronics',
      revenue: 75250.00,
      conversions: 1120,
      clicks: 18420,
      conversionRate: 6.08,
    },
    {
      campaignId: 'camp_2',
      campaignName: 'Curso de Marketing Digital',
      revenue: 35180.50,
      conversions: 485,
      clicks: 7200,
      conversionRate: 6.74,
    },
    {
      campaignId: 'camp_3',
      campaignName: 'Produtos de Beleza Premium',
      revenue: 15057.00,
      conversions: 251,
      clicks: 2830,
      conversionRate: 8.87,
    },
  ],
  topAffiliates: [
    {
      affiliateId: 'user_2',
      affiliateName: 'João Silva',
      revenue: 89420.50,
      conversions: 1285,
      commissions: 11226.67,
    },
  ],
  topCountries: [
    {
      country: 'BR',
      countryName: 'Brasil',
      revenue: 98750.25,
      conversions: 1456,
      clicks: 22180,
    },
    {
      country: 'AR',
      countryName: 'Argentina',
      revenue: 15420.50,
      conversions: 285,
      clicks: 4120,
    },
    {
      country: 'CL',
      countryName: 'Chile',
      revenue: 8950.75,
      conversions: 115,
      clicks: 2150,
    },
  ],
};

// Mock API Functions with realistic delays
export async function getMockUser(id: string): Promise<User | null> {
  await simulateNetworkDelay(300, 800);
  return mockUsers.find(user => user.id === id) || null;
}

export async function getMockUsers(): Promise<User[]> {
  await simulateNetworkDelay(400, 1000);
  return mockUsers;
}

export async function getMockCampaigns(filters?: {
  status?: string;
  userId?: string;
  search?: string;
}): Promise<Campaign[]> {
  await simulateNetworkDelay(500, 1200);
  
  let campaigns = [...mockCampaigns];
  
  if (filters?.status) {
    campaigns = campaigns.filter(c => c.status === filters.status);
  }
  
  if (filters?.userId) {
    campaigns = campaigns.filter(c => c.createdBy === filters.userId);
  }
  
  if (filters?.search) {
    const search = filters.search.toLowerCase();
    campaigns = campaigns.filter(c => 
      c.name.toLowerCase().includes(search) ||
      c.description?.toLowerCase().includes(search) ||
      c.category.toLowerCase().includes(search)
    );
  }
  
  return campaigns;
}

export async function getMockCampaign(id: string): Promise<Campaign | null> {
  await simulateNetworkDelay(300, 700);
  return mockCampaigns.find(campaign => campaign.id === id) || null;
}

export async function getMockConversions(filters?: {
  campaignId?: string;
  affiliateId?: string;
  status?: string;
}): Promise<Conversion[]> {
  await simulateNetworkDelay(600, 1400);
  
  let conversions = [...mockConversions];
  
  if (filters?.campaignId) {
    conversions = conversions.filter(c => c.campaignId === filters.campaignId);
  }
  
  if (filters?.affiliateId) {
    conversions = conversions.filter(c => c.affiliateId === filters.affiliateId);
  }
  
  if (filters?.status) {
    conversions = conversions.filter(c => c.status === filters.status);
  }
  
  return conversions;
}

export async function getMockAffiliateLinks(affiliateId: string): Promise<AffiliateLink[]> {
  await simulateNetworkDelay(400, 900);
  return mockAffiliateLinks.filter(link => link.affiliateId === affiliateId);
}

export async function getMockDashboardMetrics(): Promise<DashboardMetrics> {
  await simulateNetworkDelay(800, 1500);
  return mockDashboardMetrics;
}

// Mock mutation functions
export async function createMockCampaign(data: Partial<Campaign>): Promise<Campaign> {
  await simulateNetworkDelay(1000, 2000);
  
  const newCampaign: Campaign = {
    id: `camp_${Date.now()}`,
    name: data.name || 'Nova Campanha',
    description: data.description,
    status: 'draft',
    category: data.category || 'Outros',
    budget: data.budget || 0,
    spent: 0,
    revenue: 0,
    commissionRate: data.commissionRate || 10,
    commissionType: data.commissionType || 'percentage',
    clicks: 0,
    conversions: 0,
    conversionRate: 0,
    ctr: 0,
    epc: 0,
    countries: data.countries || ['BR'],
    devices: data.devices || ['desktop', 'mobile'],
    trafficSources: data.trafficSources || [],
    startDate: data.startDate || new Date(),
    endDate: data.endDate,
    createdAt: new Date(),
    updatedAt: new Date(),
    advertiserId: data.advertiserId || 'user_3',
    createdBy: data.createdBy || 'user_3',
    images: data.images || [],
    landingPageUrl: data.landingPageUrl || '',
    isPrivate: data.isPrivate || false,
    requiresApproval: data.requiresApproval || true,
  };
  
  mockCampaigns.push(newCampaign);
  return newCampaign;
}

export async function updateMockCampaign(id: string, data: Partial<Campaign>): Promise<Campaign | null> {
  await simulateNetworkDelay(800, 1500);
  
  const campaignIndex = mockCampaigns.findIndex(c => c.id === id);
  if (campaignIndex === -1) return null;
  
  mockCampaigns[campaignIndex] = {
    ...mockCampaigns[campaignIndex],
    ...data,
    updatedAt: new Date(),
  };
  
  return mockCampaigns[campaignIndex];
}

export async function deleteMockCampaign(id: string): Promise<boolean> {
  await simulateNetworkDelay(500, 1000);
  
  const campaignIndex = mockCampaigns.findIndex(c => c.id === id);
  if (campaignIndex === -1) return false;
  
  mockCampaigns.splice(campaignIndex, 1);
  return true;
}

// Generate chart data for analytics
export function generateChartData(days: number = 30) {
  const data = [];
  const now = new Date();
  
  for (let i = days - 1; i >= 0; i--) {
    const date = new Date(now);
    date.setDate(date.getDate() - i);
    
    data.push({
      date: date.toISOString().split('T')[0],
      value: Math.floor(Math.random() * 10000) + 5000,
      conversions: Math.floor(Math.random() * 100) + 50,
      clicks: Math.floor(Math.random() * 1000) + 500,
    });
  }
  
  return data;
}