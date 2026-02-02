
import { Niche, PlanType, UserStatus, UserAccount } from './types';

export const NICHES: Niche[] = [
  {
    id: 'pizzaria',
    name: 'Pizzaria',
    icon: '🍕',
    description: 'Destaque para queijo derretido e texturas rústicas.',
    context: {
      lighting: "warm glowing oven light, top-down spotlight",
      atmosphere: "rustic italian kitchen, flour dust, cozy",
      colors: "vibrant tomato red, golden crust, basil green",
      composition: "close-up of a slice being lifted with cheese pull"
    }
  },
  {
    id: 'acaiteria',
    name: 'Açaiteria',
    icon: '🍧',
    description: 'Explosão de cores tropicais e frescor.',
    context: {
      lighting: "bright natural sunlight, high contrast",
      atmosphere: "summer vibe, tropical fruits, energetic",
      colors: "deep purple, bright yellow mango, red strawberry",
      composition: "macro shot of toppings falling into the bowl"
    }
  },
  {
    id: 'sorveteria',
    name: 'Sorveteria',
    icon: '🍦',
    description: 'Texturas cremosas e tons pastéis.',
    context: {
      lighting: "soft pastel studio lighting, minimal shadows",
      atmosphere: "sweet shop, playful, refreshing",
      colors: "mint green, strawberry pink, vanilla cream",
      composition: "hero shot of a dripping cone or sundae"
    }
  },
  {
    id: 'veiculos',
    name: 'Loja de Veículos',
    icon: '🚗',
    description: 'Reflexos metálicos e visual premium.',
    context: {
      lighting: "dramatic neon reflections, light trails",
      atmosphere: "urban night, modern showroom, professional",
      colors: "metallic silver, deep black, electric blue",
      composition: "low angle wide shot, aggressive stance"
    }
  },
  {
    id: 'roupas',
    name: 'Loja de Roupa',
    icon: '👕',
    description: 'Estilo editorial de moda e caimento.',
    context: {
      lighting: "magazine studio lighting, soft box",
      atmosphere: "boutique, minimalist, fashionable",
      colors: "neutral beige, crisp white, brand specific",
      composition: "full body lifestyle shot or detailed fabric macro"
    }
  },
  {
    id: 'cosmeticos',
    name: 'Cosméticos',
    icon: '💄',
    description: 'Suavidade, spa e luxo minimalista.',
    context: {
      lighting: "beauty lighting, ring light reflections",
      atmosphere: "luxury spa, clean, high-end vanity",
      colors: "rose gold, nude tones, pearl white",
      composition: "centered product shot with artistic smears"
    }
  },
  {
    id: 'burger',
    name: 'Hamburgueria',
    icon: '🍔',
    description: 'Foco na suculência e camadas do burger.',
    context: {
      lighting: "dramatic side lighting with rim light",
      atmosphere: "steam rising, bokeh street background",
      colors: "warm browns, melted yellow cheese, fresh green",
      composition: "hero stack shot from low angle"
    }
  },
  {
    id: 'petshop',
    name: 'Pet Shop',
    icon: '🐾',
    description: 'Visual fofo, limpo e acolhedor.',
    context: {
      lighting: "soft even daylight, cheerful",
      atmosphere: "clean grooming salon, playful environment",
      colors: "soft blues, whites, friendly yellows",
      composition: "eye-level shot with focus on animal's face"
    }
  },
  {
    id: 'academia',
    name: 'Academia / Fitness',
    icon: '💪',
    description: 'Energia, suor e motivação extrema.',
    context: {
      lighting: "harsh industrial lighting, high contrast shadows",
      atmosphere: "gritty gym, modern fitness center",
      colors: "dark grays, safety orange, electric yellow",
      composition: "dynamic action shot, focus on muscles and equipment"
    }
  },
  {
    id: 'clinica',
    name: 'Clínica de Estética',
    icon: '✨',
    description: 'Assepsia, tecnologia e bem-estar.',
    context: {
      lighting: "bright clinical white, teal accents",
      atmosphere: "modern medical spa, advanced tech",
      colors: "clean white, turquoise, silver",
      composition: "top-down view of tools or close-up of treatment"
    }
  },
  {
    id: 'imobiliaria',
    name: 'Imobiliária',
    icon: '🏠',
    description: 'Amplitude, luz natural e sofisticação.',
    context: {
      lighting: "golden hour through large windows",
      atmosphere: "luxury home interior, spacious, inviting",
      colors: "warm wood, marble white, soft grays",
      composition: "wide angle interior shot with perfect symmetry"
    }
  },
  {
    id: 'sushi',
    name: 'Restaurante Japonês',
    icon: '🍣',
    description: 'Minimalismo oriental e frescor do mar.',
    context: {
      lighting: "soft directional light, slate gray shadows",
      atmosphere: "zen restaurant, stone and wood textures",
      colors: "salmon pink, nori black, wasabi green",
      composition: "macro shot on dark slate plate, artistic garnish"
    }
  },
  {
    id: 'salao',
    name: 'Salão de Beleza',
    icon: '💇‍♀️',
    description: 'Transformação, brilho e auto-estima.',
    context: {
      lighting: "studio hair lighting, glossy reflections",
      atmosphere: "vibrant modern salon, professional mirrors",
      colors: "vivid hair colors, sleek blacks, whites",
      composition: "focus on hair texture and movement"
    }
  },
  {
    id: 'cafeteria',
    name: 'Cafeteria / Bakery',
    icon: '☕',
    description: 'Aconchego e aroma de grãos torrados.',
    context: {
      lighting: "warm moody cafe lighting, morning sun",
      atmosphere: "cozy corner, wood and brick, steam",
      colors: "coffee brown, cream, toasted orange",
      composition: "latte art macro with blurred background"
    }
  },
  {
    id: 'suplementos',
    name: 'Suplementos',
    icon: '💊',
    description: 'Ciência, força e resultados rápidos.',
    context: {
      lighting: "top-down rim lighting, clinical yet powerful",
      atmosphere: "modern laboratory or training facility",
      colors: "bold black, neon accents, stark white",
      composition: "hero product shot with water splashes or powder clouds"
    }
  },
  {
    id: 'joalheria',
    name: 'Joalheria',
    icon: '💍',
    description: 'Brilho macro e luxo absoluto.',
    context: {
      lighting: "sharp point lights for diamond fire",
      atmosphere: "dark velvet, sophisticated, silent luxury",
      colors: "gold, silver, velvet black",
      composition: "extreme macro, shallow depth of field"
    }
  },
  {
    id: 'dentista',
    name: 'Odontologia',
    icon: '🦷',
    description: 'Sorriso perfeito e tecnologia dental.',
    context: {
      lighting: "bright surgical white, blue tints",
      atmosphere: "modern dental office, ultra-clean",
      colors: "sky blue, pure white, polished silver",
      composition: "focus on the brightness of a white smile"
    }
  },
  {
    id: 'otica',
    name: 'Ótica',
    icon: '👓',
    description: 'Clareza, estilo e design ocular.',
    context: {
      lighting: "soft reflections on glass, studio style",
      atmosphere: "minimalist display, fashion forward",
      colors: "gradient backgrounds, clear lenses",
      composition: "3/4 view of eyewear with lens transparency"
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
      'Imagens em Qualidade Standard',
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
      'Imagens em Qualidade Standard',
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
