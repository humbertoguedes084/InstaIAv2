
import { Niche, PlanType, UserStatus, UserAccount } from './types';

export const NICHES: Niche[] = [
  {
    id: 'sushi',
    name: 'Sushi & Izakaya Premium',
    icon: '🍣',
    description: 'Estética oriental minimalista com foco no frescor extremo e luxo japonês.',
    context: {
      lighting: "soft focused spot-lighting on the fish texture, high-contrast chiaroscuro style",
      atmosphere: "zen high-end sushi bar, dark polished stone background, minimalist elegance",
      colors: "vibrant salmon pink, deep tuna red, wasabi neon green, pure white rice",
      composition: "perfect geometric alignment, rule of thirds, extreme macro of raw textures"
    }
  },
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
    id: 'petshop',
    name: 'Pet Shop Boutique',
    icon: '🐾',
    description: 'Estética fofa e luxuosa para cuidados animais premium.',
    context: {
      lighting: "warm soft daylight, playful highlights, cozy shadows",
      atmosphere: "luxury pet spa, colorful modern interior, high-end grooming studio",
      colors: "pastel blues, soft pinks, clean beige, mint green",
      composition: "eye-level portrait, expressive animal features, professional pet photography"
    }
  },
  {
    id: 'imoveis',
    name: 'Imobiliária High-End',
    icon: '🏢',
    description: 'Visual arquitetônico de revistas de luxo e design.',
    context: {
      lighting: "golden hour architectural lighting, interior ambient glow, balanced exposure",
      atmosphere: "minimalist luxury mansion, modern penthouse, high-ceiling loft",
      colors: "oak wood tones, concrete grey, navy blue accents, pure white",
      composition: "wide-angle architectural shot, perfect vertical lines, leading lines"
    }
  },
  {
    id: 'dentista',
    name: 'Odontologia Estética',
    icon: '🦷',
    description: 'Visual clínico impecável, brilho e sensação de saúde.',
    context: {
      lighting: "sterile high-key lighting, dental reflector glow, sparkling highlights",
      atmosphere: "modern high-tech clinic, minimalist white luxury",
      colors: "cyan blue, titanium white, silver chrome, healthy pinks",
      composition: "macro focus on details, clean clinical symmetry, professional medical photography"
    }
  },
  {
    id: 'advocacia',
    name: 'Advocacia & Business',
    icon: '⚖️',
    description: 'Sobriedade, autoridade e visual corporativo clássico.',
    context: {
      lighting: "moody office lighting, desk lamp glow, soft executive shadows",
      atmosphere: "traditional mahogany library, modern glass skyscraper office",
      colors: "deep mahogany, brass gold, charcoal grey, oxford blue",
      composition: "formal executive portrait, stable horizontal lines, authoritative depth"
    }
  },
  {
    id: 'suplementos',
    name: 'Suplementação & Fitness',
    icon: '💪',
    description: 'Energia, força e texturas metálicas/suadas.',
    context: {
      lighting: "harsh side-lighting to emphasize muscle and texture, dramatic shadows",
      atmosphere: "dark industrial gym, professional crossfit box, futuristic lab",
      colors: "neon electric blue, carbon black, metallic orange, vibrant red",
      composition: "dynamic low-angle shot, extreme sharpness, high-contrast action feel"
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
      composition: "monumental stack shot, macro focus on melting cheese and dripping juices"
    }
  },
  {
    id: 'barbearia',
    name: 'Barbearia Premium',
    icon: '✂️',
    description: 'Visual vintage moderno, couro e texturas de metal escovado.',
    context: {
      lighting: "warm tungsten bulbs, neon sign reflections, sharp highlights on tools",
      atmosphere: "vintage luxury barbershop, leather chairs, wood panels",
      colors: "leather brown, chrome silver, deep navy, classic red",
      composition: "cinematic depth of field, focused on craftsmanship details"
    }
  },
  {
    id: 'cafe',
    name: 'Cafeteria Especializada',
    icon: '☕',
    description: 'Aconchego, vapor e grãos selecionados em alta definição.',
    context: {
      lighting: "soft morning window light, warm lamp glow, steam backlit",
      atmosphere: "minimalist nordic cafe, rustic brick and wood elements",
      colors: "espresso brown, velvet cream, terracotta, matte black",
      composition: "top-down artistic latte art, cozy lifestyle setup"
    }
  },
  {
    id: 'vinhos',
    name: 'Adega & Vinhos',
    icon: '🍷',
    description: 'Elegância, transparência e visual de sommelier de elite.',
    context: {
      lighting: "backlighting to show wine clarity, candle flicker, soft rim lights",
      atmosphere: "stone wine cellar, luxury dining, vineyard sunset mood",
      colors: "deep burgundy, amber gold, forest green, rustic oak",
      composition: "elegant vertical pour, macro focus on glass condensation"
    }
  },
  {
    id: 'joalheria',
    name: 'Joalheria & Luxo',
    icon: '💍',
    description: 'Brilho facetado e luxo absoluto em macro fotografia.',
    context: {
      lighting: "precise jewelry sparkle lights, hard caustic reflections",
      atmosphere: "black infinity studio, sophisticated dark elegance",
      colors: "24k gold, polished silver, diamond white, obsidian",
      composition: "extreme macro, razor-sharp focus on gemstones and facets"
    }
  },
  {
    id: 'farmacia',
    name: 'Saúde & Farmácia',
    icon: '💊',
    description: 'Visual clean, confiável e ultra-nítido.',
    context: {
      lighting: "pure white clinical light, shadowless photography",
      atmosphere: "modern laboratory, pristine shelves, wellness focus",
      colors: "medical blue, bright white, mint green",
      composition: "symmetrical product placement, high clarity, reliable feel"
    }
  },
  {
    id: 'escola',
    name: 'Cursos & Educação',
    icon: '📚',
    description: 'Visual vibrante, inspirador e focado em aprendizado.',
    context: {
      lighting: "bright inspiring daylight, colorful environment",
      atmosphere: "modern coworking, vibrant classroom, digital nomad setup",
      colors: "indigo blue, bright yellow, creative purple",
      composition: "dynamic angles, focus on tools like tablets/books"
    }
  },
  {
    id: 'hortifruti',
    name: 'Hortifruti Orgânico',
    icon: '🍎',
    description: 'Frescor máximo, cores vibrantes e texturas naturais.',
    context: {
      lighting: "bright natural sunlight, fresh water droplets",
      atmosphere: "rustic farmers market, eco-friendly presentation",
      colors: "vibrant garden colors, earthy browns, leafy greens",
      composition: "overflowing bounty, rustic wood background, macro textures"
    }
  },
  {
    id: 'esportes',
    name: 'Artigos Esportivos',
    icon: '👟',
    description: 'Movimento, velocidade e tecnologia de alta performance.',
    context: {
      lighting: "dramatic flash photography, high contrast, rim lighting",
      atmosphere: "urban track, modern stadium, futuristic tech lab",
      colors: "neon green, electric blue, aggressive black",
      composition: "dynamic tilted angle, sense of motion, sharp details"
    }
  },
  {
    id: 'tech',
    name: 'Tecnologia & Gadgets',
    icon: '💻',
    description: 'Futurismo, leds e estética de vale do silício.',
    context: {
      lighting: "cyberpunk neon accents, soft glow from screens",
      atmosphere: "minimalist tech workstation, dark laboratory",
      colors: "deep space grey, neon violet, electric cyan",
      composition: "perfectly aligned tech grid, macro of circuits and textures"
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
