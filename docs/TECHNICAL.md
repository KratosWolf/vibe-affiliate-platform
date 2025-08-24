# Documentação Técnica - VIBE Affiliate Platform

## Arquitetura

### Frontend
- **Framework**: Next.js 15 com App Router
- **Estilização**: Tailwind CSS + Shadcn/ui
- **Estado**: Context API / Zustand (quando necessário)
- **Validação**: Zod + React Hook Form
- **Charts**: Recharts + Tremor
- **Maps**: Mapbox GL JS

### Backend
- **API Routes**: Next.js Route Handlers
- **Validação**: Middleware com Zod
- **Autenticação**: NextAuth.js v5 (Auth.js)
- **Rate Limiting**: Vercel KV + upstash/ratelimit
- **Dados**: Mock data inicialmente → PostgreSQL (Supabase)
- **File Storage**: Vercel Blob
- **Queue/Jobs**: Inngest para processamento assíncrono

### Segurança
- CSP Headers configurados
- CORS com whitelist restritivo
- Input sanitization em todos endpoints
- SQL injection prevention
- XSS protection implementado
- CSRF tokens para forms
- Rate limiting por IP e usuário
- Audit logs para ações críticas

### Infraestrutura
- **Deploy**: Vercel com Edge Functions
- **Database**: Supabase (PostgreSQL)
- **Cache**: Vercel KV (Redis)
- **CDN**: Vercel CDN + Image Optimization
- **Monitoring**: Vercel Analytics + Sentry
- **CI/CD**: GitHub Actions

## Padrões de Código

### Estrutura de Pastas
```
src/
├── app/                    # Rotas e páginas
│   ├── (dashboard)/        # Grupo de rotas dashboard
│   ├── api/                # API endpoints
│   ├── auth/               # Páginas de autenticação
│   └── globals.css         # Estilos globais
├── components/             # Componentes reutilizáveis
│   ├── ui/                 # Shadcn components
│   ├── features/           # Componentes de features
│   ├── forms/              # Form components
│   └── charts/             # Chart components
├── lib/                    # Utilitários e configurações
│   ├── auth/               # Configuração NextAuth
│   ├── db/                 # Database utilities
│   ├── security/           # Funções de segurança
│   ├── mock-data/          # Dados mockados
│   ├── validations/        # Schemas Zod
│   ├── utils.ts            # Utility functions
│   └── constants.ts        # Constantes da aplicação
├── hooks/                  # Custom hooks
├── types/                  # TypeScript types
└── styles/                 # Estilos adicionais
```

### Convenções
- Componentes: PascalCase (UserDashboard.tsx)
- Funções utilitárias: camelCase (formatCurrency)
- Constantes: UPPER_SNAKE_CASE (API_BASE_URL)
- Arquivos: kebab-case (user-settings.tsx)
- Hooks: camelCase com prefixo 'use' (useUserData)

### TypeScript
```typescript
// Exemplo de type definitions
export interface User {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  createdAt: Date;
  updatedAt: Date;
}

export type UserRole = 'admin' | 'affiliate' | 'advertiser';

export interface Campaign {
  id: string;
  name: string;
  description?: string;
  status: CampaignStatus;
  budget: number;
  conversions: number;
  revenue: number;
  createdBy: string;
  createdAt: Date;
}

export type CampaignStatus = 'draft' | 'active' | 'paused' | 'ended';
```

## APIs e Endpoints

### Padrões de API
- Versionamento: `/api/v1/`
- Autenticação: Bearer token (JWT)
- Rate limiting: 100 req/min para authenticated, 20 req/min para anonymous
- CORS: Configurado por endpoint
- Response format: JSON consistente

### Estrutura de Response
```typescript
interface APIResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
  meta?: {
    page?: number;
    limit?: number;
    total?: number;
  };
}
```

### Endpoints Públicos
```typescript
// Webhook para conversões
POST /api/v1/webhooks/conversion
Headers: X-Webhook-Secret

// Pixel de tracking
GET /api/v1/track/pixel?campaign_id=xxx&affiliate_id=xxx

// Redirect de afiliado
GET /api/v1/redirect/:linkId

// Health check
GET /api/v1/health
```

### Endpoints Privados
```typescript
// Dashboard metrics
GET /api/v1/dashboard/metrics
Query: ?period=7d&compare=true

// Campanhas
GET /api/v1/campaigns
POST /api/v1/campaigns
PUT /api/v1/campaigns/:id
DELETE /api/v1/campaigns/:id

// Conversões
GET /api/v1/conversions
Query: ?campaign_id=xxx&from=date&to=date

// Usuários (admin only)
GET /api/v1/users
POST /api/v1/users
PUT /api/v1/users/:id
DELETE /api/v1/users/:id
```

## Mock Data Strategy

### Estrutura de Mock Data
Inicialmente, o projeto utilizará dados mockados para desenvolvimento rápido:

```typescript
// src/lib/mock-data/index.ts
export const mockUsers: User[] = [
  {
    id: '1',
    email: 'admin@vibe.com',
    name: 'Admin User',
    role: 'admin',
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-01'),
  },
  // ... mais usuários
];

export const mockCampaigns: Campaign[] = [
  {
    id: '1',
    name: 'Black Friday 2024',
    description: 'Campanha especial Black Friday',
    status: 'active',
    budget: 50000,
    conversions: 1250,
    revenue: 125000,
    createdBy: '1',
    createdAt: new Date('2024-11-01'),
  },
  // ... mais campanhas
];

// Simular delay de rede para desenvolvimento realista
export const simulateDelay = (ms: number = 1000) => 
  new Promise(resolve => setTimeout(resolve, ms));

// Funções para simular operações de banco
export async function getMockUser(id: string): Promise<User | null> {
  await simulateDelay(300);
  return mockUsers.find(user => user.id === id) || null;
}

export async function getMockCampaigns(userId: string): Promise<Campaign[]> {
  await simulateDelay(500);
  return mockCampaigns.filter(campaign => campaign.createdBy === userId);
}
```

### Migração para Banco Real
A estrutura está preparada para migração futura:
- Interfaces TypeScript já definidas
- Funções de acesso a dados abstraídas
- Validações Zod prontas para uso
- Schemas de banco preparados

## Segurança

### Headers HTTP
```typescript
// middleware.ts
const securityHeaders = {
  'X-Frame-Options': 'DENY',
  'X-Content-Type-Options': 'nosniff',
  'X-XSS-Protection': '1; mode=block',
  'Referrer-Policy': 'strict-origin-when-cross-origin',
  'Permissions-Policy': 'camera=(), microphone=(), geolocation=()',
  'Strict-Transport-Security': 'max-age=31536000; includeSubDomains',
  'Content-Security-Policy': "default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval'; style-src 'self' 'unsafe-inline';"
}
```

### Autenticação e Autorização
```typescript
// lib/auth/config.ts
export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: 'credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' }
      },
      async authorize(credentials) {
        // Validação segura aqui
        if (!credentials?.email || !credentials?.password) return null;
        
        const user = await validateUser(credentials.email, credentials.password);
        return user;
      }
    }),
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    })
  ],
  session: { strategy: 'jwt' },
  callbacks: {
    jwt: async ({ token, user }) => {
      if (user) {
        token.role = user.role;
      }
      return token;
    },
    session: async ({ session, token }) => {
      if (token) {
        session.user.id = token.sub!;
        session.user.role = token.role as UserRole;
      }
      return session;
    }
  }
};
```

### Rate Limiting
```typescript
// lib/rate-limit.ts
import { Ratelimit } from "@upstash/ratelimit";
import { kv } from "@vercel/kv";

export const ratelimit = new Ratelimit({
  redis: kv,
  limiter: Ratelimit.slidingWindow(100, "60 s"), // 100 requests per minute
});

// Por endpoint específico
export const strictRatelimit = new Ratelimit({
  redis: kv,
  limiter: Ratelimit.slidingWindow(10, "60 s"), // 10 requests per minute
});
```

### Validações
```typescript
// lib/validations/campaign.ts
import { z } from 'zod';

export const createCampaignSchema = z.object({
  name: z.string().min(1, 'Nome é obrigatório').max(100),
  description: z.string().max(500).optional(),
  budget: z.number().positive('Budget deve ser positivo'),
  startDate: z.date(),
  endDate: z.date(),
}).refine(data => data.endDate > data.startDate, {
  message: "Data final deve ser posterior à data inicial",
  path: ["endDate"],
});

export type CreateCampaignInput = z.infer<typeof createCampaignSchema>;
```

## Performance

### Otimizações
- Next.js Image Optimization habilitado
- Dynamic imports para code splitting
- React.memo() em componentes pesados
- Debounce em inputs de busca
- Virtual scrolling para listas grandes
- Service Worker para cache offline

### Monitoramento
- Core Web Vitals tracking
- Performance API usage
- Error boundary em componentes críticos
- Sentry para error tracking
- Vercel Analytics para métricas

### Caching Strategy
```typescript
// Configuração de cache
export const cacheConfig = {
  // Cache estático para assets
  static: 'public, max-age=31536000, immutable',
  
  // Cache dinâmico para APIs
  api: 'private, max-age=300, stale-while-revalidate=60',
  
  // Cache de dashboard
  dashboard: 'private, max-age=60, stale-while-revalidate=10'
};
```

## Testing Strategy

### Tipos de Testes
1. **Unit Tests**: Jest + Testing Library
2. **Integration Tests**: API routes testing
3. **E2E Tests**: Playwright
4. **Visual Tests**: Chromatic/Percy
5. **Performance Tests**: Lighthouse CI

### Coverage Goals
- Unit tests: >80%
- Integration tests: >70%
- E2E tests: Critical user journeys
- Performance: LCP < 2.5s, FID < 100ms

## Deployment

### Environments
- **Development**: Local + feature branches
- **Staging**: Vercel preview deployments
- **Production**: Vercel production

### CI/CD Pipeline
1. Lint + Type check
2. Unit tests
3. Build verification
4. Security audit
5. Deploy to staging
6. E2E tests
7. Deploy to production

### Environment Variables
```bash
# Application
NODE_ENV=production
NEXT_PUBLIC_APP_URL=https://vibe-affiliate.com

# Database
DATABASE_URL=postgresql://...
DIRECT_URL=postgresql://...

# Auth
NEXTAUTH_SECRET=...
NEXTAUTH_URL=https://vibe-affiliate.com

# APIs
GOOGLE_CLIENT_ID=...
GOOGLE_CLIENT_SECRET=...

# Monitoring
SENTRY_DSN=...
VERCEL_ANALYTICS_ID=...
```