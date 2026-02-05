
import { Niche, PlanType, UserStatus, UserAccount } from './types';

export const NICHES: Niche[] = [
  {
    id: 'sushi',
    name: 'Sushi & Izakaya Premium',
    icon: '🍣',
    description: 'Estética oriental minimalista com foco no frescor extremo e luxo japonês.',
    template: 'Fotografia macro de um combo de sushi premium sobre pedra ardósia negra. Iluminação lateral dramática realçando a textura do salmão fresco com brilho úmido. Fundo desfocado de um restaurante zen sofisticado. Cores: Laranja vibrante, preto profundo e verde wasabi.',
    context: {
      lighting: "soft focused spot-lighting on the fish texture, high-contrast chiaroscuro style",
      atmosphere: "zen high-end sushi bar, dark polished stone background, minimalist elegance",
      colors: "vibrant salmon pink, deep tuna red, wasabi neon green, pure white rice",
      composition: "perfect geometric alignment, rule of thirds, extreme macro of raw textures"
    }
  },
  {
    id: 'acaiteria',
    name: 'Açaiteria & Sorveteria',
    icon: '🍧',
    description: 'Explosão de refrescância, texturas geladas e cores tropicais vibrantes.',
    template: 'Pote de açaí premium transbordando acompanhamentos (leite em pó, morangos frescos, granola crocante). Gotículas de condensação no exterior do pote para transmitir temperatura gelada. Iluminação de sol matinal (High-Key) criando sombras suaves e realçando as cores vibrantes. Fundo de madeira clara ou mármore branco. Estética de lifestyle tropical de luxo.',
    context: {
      lighting: "bright high-key natural sunlight, crisp shadows, moisture droplets on surfaces",
      atmosphere: "upscale tropical resort, clean modern presentation, refreshing vibe",
      colors: "intense velvet purple, neon fruit highlights, clean white marble, deep berry tones",
      composition: "dynamic 45-degree angle, extreme focus on toppings texture, bokeh background"
    }
  },
  {
    id: 'burger',
    name: 'Burger Artesanal',
    icon: '🍔',
    description: 'Suculência e visual food porn para hamburguerias de elite.',
    template: 'Hambúrguer artesanal monumental em ângulo baixo (Hero Shot). Queijo cheddar derretendo em camadas, pão brioche brilhante com gergelim. Vapor sutil saindo da carne suculenta. Luz quente vindo de trás para criar contorno. Fundo rústico de madeira e metal.',
    context: {
      lighting: "warm backlighting, steam detail, high contrast highlights",
      atmosphere: "rustic urban burger joint, industrial interior",
      colors: "golden brown, melted yellow, deep meat red, fresh green",
      composition: "low angle, massive look, extreme detail on textures"
    }
  },
  {
    id: 'pizzaria',
    name: 'Pizzaria Gourmet',
    icon: '🍕',
    description: 'Destaque para texturas rústicas e ingredientes selecionados.',
    template: 'Pizza artesanal saindo do forno a lenha. Close-up no queijo borbulhando e manjericão fresco. Bordas levemente chamuscadas (leopard spots). Fundo escuro com sutil brilho alaranjado do fogo. Estética de revista de gastronomia italiana.',
    context: {
      lighting: "warm cinematic oven glow, directional spotlighting to highlight textures",
      atmosphere: "luxury artisan pizzeria, moody lighting, expensive ingredients",
      colors: "deep san marzano red, charred crust gold, vibrant basil green",
      composition: "extreme macro of the texture, 45-degree professional food photography angle"
    }
  },
  {
    id: 'barbearia',
    name: 'Barbearia Premium',
    icon: '✂️',
    description: 'Estética vintage e masculina com foco em detalhes e cuidado.',
    template: 'Interior de barbearia clássica com poltronas de couro e espelhos moldurados. Close-up em ferramentas de metal brilhante (tesoura, navalha). Luz de tungstênio quente e neon azul sutil. Estética lifestyle masculina sofisticada.',
    context: {
      lighting: "warm vintage tungsten, sharp reflections on metal tools",
      atmosphere: "traditional luxury barbershop, leather and dark wood",
      colors: "tobacco brown, chrome silver, deep navy blue",
      composition: "shallow depth of field, focused on premium details"
    }
  },
  {
    id: 'dentista',
    name: 'Odontologia Estética',
    icon: '🦷',
    description: 'Visual clean, tecnológico e focado em bem-estar e perfeição.',
    template: 'Consultório odontológico ultra-moderno e minimalista. Iluminação branca pura e brilhante. Detalhes em metal escovado e vidro. Atmosfera de clínica de luxo, transmitindo segurança e higiene impecável. Foto de alta claridade.',
    context: {
      lighting: "pure white clinical light, shadowless, high key",
      atmosphere: "futuristic luxury dental clinic, pristine clean",
      colors: "titanium white, soft cyan, metallic silver",
      composition: "symmetrical, architectural wide angle, clean lines"
    }
  },
  {
    id: 'imoveis',
    name: 'Imobiliária High-End',
    icon: '🏢',
    description: 'Visual arquitetônico de mansões e apartamentos de luxo.',
    template: 'Sala de estar de uma mansão de luxo com pé direito duplo. Janelas amplas mostrando pôr do sol dourado. Decoração minimalista com móveis de design. Iluminação equilibrada entre interna quente e externa natural. Ângulo ultra-wide.',
    context: {
      lighting: "golden hour natural light mixed with warm interior accents",
      atmosphere: "exclusive luxury mansion, modern architecture",
      colors: "neutral beige, oak wood, sunset gold, sky blue",
      composition: "wide-angle architectural photography, straight vertical lines"
    }
  },
  {
    id: 'cosmeticos',
    name: 'Cosméticos & Skincare',
    icon: '💄',
    description: 'Texturas acetinadas e iluminação suave de beleza.',
    template: 'Frasco de sérum luxuoso sobre pedestal de mármore. Respingo artístico de água ou creme ao lado. Iluminação suave e difusa estilo "beauty lighting". Reflexos perolados e estética clean-girl. Fundo em tons pastéis suaves.',
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
    description: 'Estética de passarela e revistas de moda internacionais.',
    template: 'Look de moda editorial em um loft industrial urbano. Modelo posando com iluminação de estúdio contrastante. Estética Vogue/GQ. Texturas de tecido nítidas (seda, couro). Profundidade de campo rasa focando no design da peça.',
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
    description: 'Cuidado animal com estética fofa e sofisticada.',
    template: 'Cachorro da raça Golden Retriever saindo de um banho em spa pet, com laço elegante. Fundo de azulejos coloridos modernos e plantas. Luz natural suave de janela. Cores alegres e vibrantes, transmitindo carinho e qualidade.',
    context: {
      lighting: "soft daylight, bright and cheerful",
      atmosphere: "luxury modern pet boutique, colorful and friendly",
      colors: "mint green, pastel pink, golden fur tones",
      composition: "eye-level portrait, bokeh background, sharp fur detail"
    }
  },
  {
    id: 'suplementos',
    name: 'Suplementos & Fitness',
    icon: '💪',
    description: 'Energia, força e visual técnico para performance.',
    template: 'Pote de Whey Protein em cenário de academia industrial escura. Luz lateral dura realçando o relevo da embalagem e gotas de suor/condensação. Estética de alta performance, sombras profundas e luzes de neon azul/vermelho sutil.',
    context: {
      lighting: "harsh side-lighting, cinematic shadows, high contrast",
      atmosphere: "industrial dark gym, high performance vibe",
      colors: "carbon black, electric blue, metallic silver",
      composition: "dynamic tilted angle, close-up on product labels"
    }
  },
  {
    id: 'cafe',
    name: 'Café & Patisserie',
    icon: '☕',
    description: 'Aconchego e texturas de confeitaria fina.',
    template: 'Xícara de cappuccino com latte art complexa. Ao lado, um croissant dourado e folhado. Vapor subindo sutilmente. Luz de manhã entrando pela janela. Mesa de madeira rústica com grãos de café espalhados. Estética aconchegante.',
    context: {
      lighting: "soft morning window light, warm lamp glow, steam backlit",
      atmosphere: "minimalist nordic cafe, rustic brick and wood elements",
      colors: "espresso brown, velvet cream, terracotta, matte black",
      composition: "top-down artistic latte art, cozy lifestyle setup"
    }
  },
  {
    id: 'joalheria',
    name: 'Joalheria & Luxo',
    icon: '💍',
    description: 'Brilho facetado e luxo absoluto em macro.',
    template: 'Anel de diamante sobre veludo negro profundo. Iluminação pontual criando "starbursts" e brilhos intensos nas facetas da joia. Fundo totalmente escuro para destacar o metal precioso. Macro fotografia de extrema nitidez.',
    context: {
      lighting: "precise jewelry sparkle lights, hard caustic reflections",
      atmosphere: "black infinity studio, sophisticated dark elegance",
      colors: "24k gold, polished silver, diamond white, obsidian",
      composition: "extreme macro, razor-sharp focus on gemstones and facets"
    }
  },
  {
    id: 'advocacia',
    name: 'Advocacia & Business',
    icon: '⚖️',
    description: 'Sobriedade, autoridade e visual corporativo clássico.',
    template: 'Escritório de advocacia com biblioteca de livros antigos ao fundo. Mesa de madeira nobre com caneta tinteiro e documentos. Luz de abajur clássico criando atmosfera de seriedade e confiança. Estética de filme de tribunal.',
    context: {
      lighting: "moody office lighting, desk lamp glow, soft executive shadows",
      atmosphere: "traditional mahogany library, modern glass skyscraper office",
      colors: "deep mahogany, brass gold, charcoal grey, oxford blue",
      composition: "formal executive portrait, stable horizontal lines, authoritative depth"
    }
  },
  {
    id: 'farmacia',
    name: 'Saúde & Farmácia',
    icon: '💊',
    description: 'Confiabilidade, clareza e visual médico premium.',
    template: 'Embalagem de vitamina em ambiente de laboratório moderno e iluminado. Prateleiras brancas impecáveis. Luz fria e clara. Estética de wellness e saúde preventiva. Fundo com sutil profundidade de campo.',
    context: {
      lighting: "pure white clinical light, shadowless photography",
      atmosphere: "modern laboratory, pristine shelves, wellness focus",
      colors: "medical blue, bright white, mint green",
      composition: "symmetrical product placement, high clarity, reliable feel"
    }
  },
  {
    id: 'veiculos',
    name: 'Veículos & Detailing',
    icon: '🚗',
    description: 'Brilho metálico e visual de comercial automotivo.',
    template: 'Carro esportivo em estúdio escuro com luzes de LED tubulares refletidas na lataria impecável. Foco nos faróis acesos e no emblema da marca. Estética tech e veloz. Chão molhado refletindo as luzes do ambiente.',
    context: {
      lighting: "soft-box studio reflections, dramatic rim lighting, long exposure light trails",
      atmosphere: "high-tech minimalist hangar or modern architectural background",
      colors: "metallic silver, carbon fiber black, deep sapphire blue",
      composition: "hero perspective, low-wide angle, aggressive professional car photography"
    }
  }
];

export const PLANS = [
  {
    type: PlanType.BASIC,
    price: 'R$ 79,90',
    credits: 40,
    features: [
      'Imagens em Qualidade Agência Premium',
      'Até 40 artes por mês',
      'Direcionamento Criativo via Prompt',
      'Suporte via WhatsApp',
      'Acesso à Galeria Estúdio'
    ]
  },
  {
    type: PlanType.PRO,
    price: 'R$ 147,90',
    credits: 100,
    features: [
      'Imagens em Qualidade Agência Premium',
      'Até 100 artes por mês',
      'Prioridade na Renderização',
      'Filtros Exclusivos por Nicho',
      'Suporte Prioritário'
    ]
  },
  {
    type: PlanType.PREMIUM,
    price: 'R$ 297,90',
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
