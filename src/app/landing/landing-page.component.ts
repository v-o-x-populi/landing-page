import { Component, OnInit, computed, signal } from '@angular/core';
import { CommonModule } from '@angular/common';

type Theme = 'light' | 'dark';

interface Card {
  title: string;
  description: string;
  icon: string;
}

interface Faq {
  question: string;
  answer: string;
}

interface DownloadLink {
  platform: 'android' | 'windows';
  label: string;
  subtitle: string;
  url: string;
  type: 'Mobile' | 'Desktop';
}

@Component({
  selector: 'app-landing-page',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './landing-page.component.html',
  styleUrl: './landing-page.component.scss',
})
export class LandingPageComponent implements OnInit {
  public theme = signal<Theme>('light');
  public readonly isDark = computed(() => this.theme() === 'dark');
  private prefersDark: MediaQueryList | null = null;

  public downloadLinks: DownloadLink[] = [
    {
      platform: 'android',
      label: 'App Vox para Android',
      subtitle: 'Votação e operação em campo com login seguro',
      url: 'https://v-o-x.s3.sa-east-1.amazonaws.com/Vox.apk',
      type: 'Mobile',
    },
    {
      platform: 'windows',
      label: 'App Vox para Windows',
      subtitle: 'Painel para criar eleições e acompanhar dashboards',
      url: 'https://v-o-x.s3.sa-east-1.amazonaws.com/Vox+Setup+0.0.1.exe',
      type: 'Desktop',
    },
  ];
  public qrLinks: DownloadLink[] = this.downloadLinks.filter((d) => d.platform === 'android');

  public features: Card[] = [
    {
      icon: 'diagram-3',
      title: 'Eleições completas',
      description: 'Cadastre cargos, candidatos, sessões e urnas com regras claras e auditáveis.',
    },
    {
      icon: 'broadcast-pin',
      title: 'Tempo real',
      description: 'Socket.IO + Redis para acompanhar contagem e dashboards ao vivo, sem atrasos.',
    },
    {
      icon: 'shield-check',
      title: 'Segurança ponta a ponta',
      description: 'Autenticação JWT, criptografia e trilha de auditoria para cada voto e sessão.',
    },
    {
      icon: 'credit-card-2-front',
      title: 'Pagamentos verificados',
      description:
        'Pedidos, PIX e cartão via Abacate Pay com webhooks assinados e reconciliação automática.',
    },
  ];

  public stack: Card[] = [
    { icon: 'cpu', title: 'NestJS + Node', description: 'API modular e gateways WebSocket' },
    { icon: 'database', title: 'MongoDB + Mongoose', description: 'Persistência escalável' },
    { icon: 'lightning-charge', title: 'Redis + BullMQ', description: 'Cache, filas e sessões' },
    { icon: 'wifi', title: 'Socket.IO', description: 'Atualizações em tempo real' },
    { icon: 'shield-lock', title: 'JWT + Criptografia', description: 'Sessões assinadas' },
    { icon: 'credit-card', title: 'Abacate Pay', description: 'Pagamentos com antifraude' },
  ];

  public steps: Card[] = [
    {
      icon: 'phone',
      title: 'Instalar e entrar',
      description: 'Baixe o app Android ou Windows e faça login ou crie uma conta com seu e-mail.',
    },
    {
      icon: 'person-badge',
      title: 'Completar dados',
      description: 'Valide o e-mail e e "Minha conta" informe seu CPF/CNPJ.',
    },
    {
      icon: 'cart-check',
      title: 'Comprar votos',
      description: 'Na área Pedidos escolha quantidade, pague e libere votos.',
    },
    {
      icon: 'file-text',
      title: 'Criar eleição',
      description: 'Cadastre eleições, candidatos e sessões com horários estabelecidos.',
    },
    {
      icon: 'play-fill',
      title: 'Abrir sessão',
      description: 'Crie uma urna a partir de uma sessão e autorize ela em outro dispositivo',
    },
    {
      icon: 'activity',
      title: 'Acompanhar em tempo real',
      description: 'Veja resultados em tempo real',
    },
  ];

  public faqs: Faq[] = [
    {
      question: 'Como o Vox protege votos e dados?',
      answer:
        'Autenticação JWT, senhas com salt e comunicação sob HTTPS. Cada voto gera trilha de auditoria e validação de integridade.',
    },
    {
      question: 'Os pagamentos são seguros?',
      answer:
        'Os pagamentos passam pelo Abacate Pay (PIX e cartão) com antifraude. Validamos webhooks assinados e não armazenamos dados sensíveis.',
    },
    {
      question: 'Quais plataformas são suportadas?',
      answer:
        'Android para operação em campo, Windows para gestão e versão web integrada à API NestJS.',
    },
    {
      question: 'Preciso informar CPF/CNPJ para comprar votos?',
      answer:
        'Sim. Na área Minha Conta informe CPF ou CNPJ para liberar pedidos de compra de votos e gerar cobranças no Abacate Pay.',
    },
    {
      question: 'O que preciso para abrir uma sessão?',
      answer:
        'Criar a eleição, cadastrar candidatos, definir horários e (opcional) conectar o Abacate Pay.',
    },
    {
      question: 'Posso integrar com minha infraestrutura?',
      answer:
        'Sim. A API NestJS expõe REST e WebSockets. Basta configurar as URLs e tokens no .env.',
    },
  ];

  public stats = [
    { value: 'JWT + HTTPS', label: 'Sessões assinadas e comunicação cifrada' },
    { value: 'Socket.IO', label: 'Atualizações ao vivo em urnas e dashboards' },
    { value: 'Abacate Pay', label: 'Pagamentos auditados com antifraude' },
    { value: 'Mongo + Redis', label: 'Infra pronta para alto volume' },
  ];

  public scrollTo(id: string, event?: Event): void {
    event?.preventDefault();
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }

  public ngOnInit(): void {
    if (typeof window !== 'undefined') {
      this.prefersDark = window.matchMedia('(prefers-color-scheme: dark)');
      const datasetTheme = document.documentElement.dataset['theme'] as Theme | undefined;
      const initial = datasetTheme ?? (this.prefersDark.matches ? 'dark' : 'light');
      this.applyTheme(initial);
      this.prefersDark.addEventListener('change', (e) =>
        this.applyTheme(e.matches ? 'dark' : 'light')
      );
    } else {
      this.applyTheme('light');
    }
  }

  public toggleTheme(): void {
    this.applyTheme(this.theme() === 'light' ? 'dark' : 'light');
  }

  private applyTheme(theme: Theme): void {
    this.theme.set(theme);
    if (typeof document !== 'undefined') {
      document.documentElement.dataset['theme'] = theme;
      document.body.dataset['theme'] = theme;
      const isDark = theme === 'dark';
      document.body.style.backgroundColor = isDark ? '#121212' : '#fbfbff';
      document.body.style.color = isDark ? '#ffffff' : '#111111';
    }
  }

  public generateQr(link: string): string {
    const base = 'https://quickchart.io/qr';
    return `${base}?text=${encodeURIComponent(link)}&size=220&margin=2`;
  }
}
