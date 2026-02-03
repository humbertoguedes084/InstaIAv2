
import { Niche, PlanType, UserStatus, UserAccount } from './types';

export const NICHES: Niche[] = [
  {
    id: 'pizzaria',
    name: 'Pizzaria Gourmet',
    icon: '🍕',
    description: 'Destaque para queijo derretido e texturas rústicas de alta gastronomia.',
    context: {
      lighting: "warm cinematic oven glow, directional spotlighting to highlight textures",
      atmosphere: "luxury artisan pizzeria, moody lighting, expensive ingredients",
      colors: "deep san marzano red, charred crust gold, vibrant basil green",
      composition: "extreme macro of the texture, 45-degree professional food photography angle"
    }
  },
  {
    id: 'acaiteria',
    name: 'Açaí Premium',
    icon: '🍧',
    description: 'Explosão de frescor tropical com estética clean e refrescante.',
    context: {
      lighting: "bright high-key natural sunlight, crisp shadows, moisture droplets",
      atmosphere: "upscale tropical resort, clean modern presentation",
      colors: "intense velvet purple, neon fruit highlights, clean white marble",
      composition: "dynamic top-down flat lay with artistic topping placement"
    }
  },
  {
    id: 'veiculos',
    name: 'Concessionária de Luxo',
    icon: '🚗',
    description: 'Reflexos metálicos, profundidade e visual de comercial de TV.',
    context: {
      lighting: "soft-box studio reflections, dramatic rim lighting, long exposure light trails",
      atmosphere: "high-tech minimalist hangar or modern architectural background",
      colors: "metallic silver, carbon fiber black, deep sapphire blue",
      composition: "hero perspective, low-wide angle, aggressive professional car photography"
    }
  },
  {
    id: 'cosmeticos',
    name: 'Cosméticos & Estética',
    icon: '💄',
    description: 'Minimalismo, luxo silencioso e texturas impecáveis.',
    context: {
      lighting: "soft diffused beauty lighting, ethereal glow, pearl-like reflections",
      atmosphere: "high-end clinical spa, minimalist laboratory, luxury vanity",
      colors: "champagne gold, soft nude, silk white, rose quartz",
      composition: "perfectly centered product symmetry, artistic liquid smears"
    }
  },
  {
    id: 'roupas',
    name: 'Moda Editorial',
    icon: '👕',
    description: 'Estética de revista de moda (Vogue/GQ style).',
    context: {
      lighting: "professional studio strobe lighting, high contrast, fashion show mood",
      atmosphere: "minimalist urban studio, industrial loft, high-end boutique",
      colors: "neutral editorial palette, high saturation on garments",
      composition: "full-length editorial pose, rule of thirds, dynamic movement"
    }
  },
  {
    id: 'burger',
    name: 'Burguer Artesanal',
    icon: '🍔',
    description: 'Suculência extrema e visual "food porn" profissional.',
    context: {
      lighting: "warm side-lighting to reveal steam and texture, rim light on the bun",
      atmosphere: "modern industrial burger joint, urban nightlife vibe",
      colors: "rich toasted browns, vibrant cheddar yellow, fresh organic greens",
      composition: "monumental stack shot, macro focus on the melting cheese and dripping juices"
    }
  },
  {
    id: 'joalheria',
    name: 'Joalheria & Relógios',
    icon: '💍',
    description: 'Brilho facetado e luxo absoluto em macro.',
    context: {
      lighting: "precise hard-point jewelry lights for star-burst flares and caustic reflections",
      atmosphere: "black velvet infinity background, sophisticated dark luxury",
      colors: "24k gold, polished platinum, obsidian black",
      composition: "extreme close-up macro, razor-sharp focus on details, shallow depth of field"
    }
  }
];

export const MOCK_USERS: UserAccount[] = [
  { 
    id: 'admin-1', 
    email: 'humbertoguedesdev@gmail.com', 
    name: 'Humberto Guedes (Admin)', 
    plan: PlanType.PREMIUM, 
    status: UserStatus.ACTIVE, 
    joinedAt: '2023-01-01', 
    credits: { weekly: 9999, used: 0, extra: 9999 } 
  }
];

export const TESTIMONIALS = [
  { 
    id: 1, 
    name: "Carla Silva", 
    handle: "@burgerprime", 
    rating: 5, 
    text: "Revolucionou nosso marketing no Instagram! De foto do iPhone para campanha profissional em segundos.", 
    avatar: "https://i.pravatar.cc/150?u=12" 
  },
  { 
    id: 2, 
    name: "Marcos Oliveira", 
    handle: "@modaelite", 
    rating: 5, 
    text: "Aumentamos 300% no engajamento em 30 dias. A qualidade das artes é de outro mundo.", 
    avatar: "https://i.pravatar.cc/150?u=45" 
  },
  { 
    id: 3, 
    name: "Juliana Santos", 
    handle: "@makesun", 
    rating: 5, 
    text: "Gerou 5 artes em 2 minutos! Perfeito para quem precisa de agilidade no dia a dia.", 
    avatar: "https://i.pravatar.cc/150?u=89" 
  },
];

export const PLANS = [
  {
    type: PlanType.BASIC,
    price: 'R$ 49,90',
    credits: 40,
    features: [
      'Imagens em Qualidade Agência',
      'Até 40 artes por mês',
      'Direcionamento Criativo via Prompt',
      'Suporte via E-mail',
      'Acesso à Galeria Estúdio'
    ]
  },
  {
    type: PlanType.PRO,
    price: 'R$ 97,90',
    credits: 100,
    features: [
      'Imagens em Qualidade Agência',
      'Até 100 artes por mês',
      'Prioridade na Renderização',
      'Filtros Exclusivos por Nicho',
      'Suporte Prioritário'
    ]
  },
  {
    type: PlanType.PREMIUM,
    price: 'R$ 197,90',
    credits: 500,
    features: [
      'Artes Ilimitadas (Fair Use)',
      'Até 500 artes por mês',
      'Direção de Arte Avançada',
      'Acesso Antecipado a Novos Nichos',
      'Gerente de Conta Exclusivo'
    ]
  }
];
