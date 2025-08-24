# Regras para Assistentes de IA

## Contexto do Projeto
VIBE Affiliate Platform - Plataforma moderna de marketing de afiliados com dashboard analítico, sistema de campanhas, rastreamento de conversões e gerenciamento de usuários.

## Regras Obrigatórias

### 1. Segurança (OWASP Top 10)
- SEMPRE validar inputs com Zod antes de processamento
- NUNCA expor dados sensíveis em logs ou responses
- SEMPRE usar prepared statements ou ORM para queries
- IMPLEMENTAR rate limiting em todas APIs
- VALIDAR permissões antes de ações
- SANITIZAR outputs para prevenir XSS
- IMPLEMENTAR CSRF protection em forms
- CRIPTOGRAFAR dados PII em storage
- USAR HTTPS obrigatório em produção
- IMPLEMENTAR audit logs para ações críticas

### 2. Padrões de Código
- USE TypeScript strict mode sempre
- SIGA convenções de nomenclatura do projeto:
  - Componentes: PascalCase (UserDashboard)
  - Funções: camelCase (formatCurrency)
  - Constantes: UPPER_SNAKE_CASE (API_BASE_URL)
  - Arquivos: kebab-case (user-settings.tsx)
- IMPLEMENTE error boundaries em componentes críticos
- USE async/await ao invés de callbacks
- MANTENHA componentes pequenos e focados (máx 200 linhas)
- SEMPRE tipificar retornos de funções
- USE interfaces ao invés de types quando possível

### 3. Performance
- IMPLEMENTE lazy loading para imagens e componentes pesados
- USE React.memo() quando apropriado
- OTIMIZE bundle size com dynamic imports
- IMPLEMENTE caching estratégico
- USE Suspense boundaries para loading states
- MINIMIZE re-renders desnecessários
- IMPLEMENTE virtual scrolling para listas >100 items
- OTIMIZE Core Web Vitals (LCP < 2.5s, FID < 100ms, CLS < 0.1)

### 4. Documentação
- COMENTE lógica complexa em português
- ATUALIZE docs ao modificar APIs
- MANTENHA README atualizado
- DOCUMENTE decisões arquiteturais importantes
- USE JSDoc para funções públicas
- MANTENHA CHANGELOG atualizado

### 5. Git e Versionamento
- Commits atômicos e descritivos em português
- Branch naming: feature/*, bugfix/*, hotfix/*
- SEMPRE criar PR antes de merge para main
- EXECUTAR testes antes de push
- USE Conventional Commits
- NUNCA commit de secrets ou dados sensíveis

## APIs e Endpoints

### Padrões de API Response
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
Configurar CORS apropriadamente para endpoints que precisam ser públicos:
```typescript
// Exemplo para API pública de tracking
export async function POST(req: Request) {
  // Configurar CORS para endpoint público
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
  };
  
  // Validar input
  const validation = trackingSchema.safeParse(await req.json());
  if (!validation.success) {
    return NextResponse.json(
      { success: false, error: 'Invalid input' },
      { status: 400, headers }
    );
  }
  
  // Rate limiting
  const { success } = await ratelimit.limit(getClientIP(req));
  if (!success) {
    return NextResponse.json(
      { success: false, error: 'Rate limit exceeded' },
      { status: 429, headers }
    );
  }
  
  // Processar...
}
```

### Rate Limiting Strategy
```typescript
// Diferentes limits por tipo de endpoint
export const rateLimits = {
  // Endpoints públicos (tracking, webhooks)
  public: new Ratelimit({
    redis: kv,
    limiter: Ratelimit.slidingWindow(1000, "60 s")
  }),
  
  // Login/auth endpoints
  auth: new Ratelimit({
    redis: kv,
    limiter: Ratelimit.slidingWindow(5, "60 s")
  }),
  
  // APIs gerais autenticadas
  api: new Ratelimit({
    redis: kv,
    limiter: Ratelimit.slidingWindow(100, "60 s")
  }),
  
  // APIs administrativas
  admin: new Ratelimit({
    redis: kv,
    limiter: Ratelimit.slidingWindow(200, "60 s")
  })
};
```

## Validações e Schemas

### Schemas Zod Obrigatórios
```typescript
// Sempre validar inputs de API
const createCampaignSchema = z.object({
  name: z.string().min(1).max(100),
  description: z.string().max(500).optional(),
  budget: z.number().positive(),
  startDate: z.string().datetime(),
  endDate: z.string().datetime(),
}).refine(data => new Date(data.endDate) > new Date(data.startDate), {
  message: "Data final deve ser posterior à inicial",
});

// Validar em middleware
export async function POST(req: Request) {
  try {
    const body = await req.json();
    const validatedData = createCampaignSchema.parse(body);
    // Continuar processamento...
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({
        success: false,
        error: 'Validation failed',
        details: error.errors
      }, { status: 400 });
    }
    throw error;
  }
}
```

## Componentes e UI

### Padrões de Componentes
```typescript
// Sempre usar forwardRef quando necessário
const Button = React.forwardRef<
  HTMLButtonElement,
  ButtonProps
>(({ className, variant, size, ...props }, ref) => {
  return (
    <button
      className={cn(buttonVariants({ variant, size, className }))}
      ref={ref}
      {...props}
    />
  );
});
Button.displayName = "Button";

// Error boundaries para componentes críticos
class DashboardErrorBoundary extends React.Component {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error) {
    return { hasError: true };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('Dashboard error:', error, errorInfo);
    // Enviar para Sentry em produção
  }

  render() {
    if (this.state.hasError) {
      return <DashboardErrorFallback />;
    }

    return this.props.children;
  }
}
```

## Mock Data e Testing

### Estrutura de Mock Data
```typescript
// Sempre simular delays realistas
export const simulateNetworkDelay = (min = 200, max = 800) => {
  const delay = Math.random() * (max - min) + min;
  return new Promise(resolve => setTimeout(resolve, delay));
};

// Mock data com tipos TypeScript
export const mockCampaigns: Campaign[] = [
  {
    id: 'camp_1',
    name: 'Black Friday 2024',
    status: 'active',
    budget: 50000,
    spent: 32000,
    conversions: 1250,
    revenue: 125000,
    ctr: 3.5,
    conversionRate: 12.8,
    createdAt: new Date('2024-11-01'),
    updatedAt: new Date('2024-11-15'),
  }
];

// Funções de acesso preparadas para migração
export async function getCampaigns(userId: string): Promise<Campaign[]> {
  await simulateNetworkDelay();
  
  // Em desenvolvimento: retornar mock data
  if (process.env.NODE_ENV === 'development') {
    return mockCampaigns.filter(c => c.userId === userId);
  }
  
  // Em produção: chamar banco real
  return await db.campaigns.findMany({ where: { userId } });
}
```

## Checklist Antes de Commit

- [ ] Código passa no TypeScript sem erros
- [ ] Testes executados com sucesso
- [ ] Sem dados sensíveis expostos
- [ ] Documentação atualizada se necessário
- [ ] Segurança verificada (OWASP)
- [ ] Performance otimizada
- [ ] Rate limiting implementado se API
- [ ] Validações Zod em inputs
- [ ] Error handling implementado
- [ ] Loading states para UX
- [ ] Responsive design verificado
- [ ] Accessibility (WCAG) considerado

## Comandos Úteis de Desenvolvimento
```bash
# Verificações obrigatórias
npm run type-check    # TypeScript check
npm run lint          # ESLint
npm run test          # Unit tests
npm run build         # Build verification

# Desenvolvimento
npm run dev           # Development server
npm run test:watch    # Tests em watch mode
npm run storybook     # Component library

# Deploy
npm run preview       # Preview build
npm run analyze       # Bundle analyzer
```

## Integração com Ferramentas IA

### Cursor IDE Rules
- SEMPRE revisar código gerado por IA
- VERIFICAR implementação de segurança
- CONFIRMAR tipagem TypeScript correta
- TESTAR funcionalidades geradas
- ATUALIZAR documentação quando necessário

### GitHub Copilot
- USAR para acelerar desenvolvimento de boilerplate
- REVISAR sugestões de segurança cuidadosamente
- PERSONALIZAR para padrões do projeto
- NUNCA aceitar código sem review

Lembre-se: IA é uma ferramenta para acelerar, mas a responsabilidade final pelo código é sempre do desenvolvedor!