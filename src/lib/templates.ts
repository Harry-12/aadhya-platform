// Beautiful invitation templates inspired by Partiful, Luma, Paperless Post
export interface InvitationTemplate {
  id: string;
  name: string;
  category: 'elegant' | 'fun' | 'minimal' | 'cultural' | 'premium';
  eventTypes: string[]; // which event types this works well for
  preview: {
    gradient: string;
    pattern?: string;
    textColor: string;
    accentColor: string;
    fontStyle: 'serif' | 'modern' | 'handwritten';
  };
  theme: {
    primary: string;
    accent: string;
    background: string;
    text: string;
    cardBg: string;
    borderColor: string;
    gradientFrom: string;
    gradientTo: string;
    buttonGradient: string;
    fontDisplay: string;
    fontBody: string;
  };
  coverOverlay: string; // CSS gradient overlay for cover images
  description: string;
}

export const TEMPLATES: InvitationTemplate[] = [
  {
    id: 'royal-burgundy',
    name: 'Royal Burgundy',
    category: 'elegant',
    eventTypes: ['wedding', 'engagement', 'anniversary', 'cradle_ceremony'],
    preview: {
      gradient: 'linear-gradient(135deg, #8B1A1A 0%, #D4A574 50%, #8B1A1A 100%)',
      pattern: 'paisley',
      textColor: '#FFF8F0',
      accentColor: '#D4A574',
      fontStyle: 'serif',
    },
    theme: {
      primary: '#8B1A1A',
      accent: '#D4A574',
      background: '#FFF8F0',
      text: '#2D2D2D',
      cardBg: '#FFFFFF',
      borderColor: 'rgba(212,165,116,0.15)',
      gradientFrom: '#8B1A1A',
      gradientTo: '#6B1414',
      buttonGradient: 'linear-gradient(135deg, #8B1A1A, #A52A2A)',
      fontDisplay: 'Playfair Display',
      fontBody: 'Inter',
    },
    coverOverlay: 'linear-gradient(to bottom, rgba(107,20,20,0.5), rgba(139,26,26,0.3), rgba(255,248,240,1))',
    description: 'Classic elegance with rich burgundy and gold accents',
  },
  {
    id: 'golden-sunset',
    name: 'Golden Sunset',
    category: 'elegant',
    eventTypes: ['wedding', 'engagement', 'housewarming', 'anniversary'],
    preview: {
      gradient: 'linear-gradient(135deg, #F59E0B 0%, #D97706 30%, #B45309 100%)',
      textColor: '#FFFBEB',
      accentColor: '#FCD34D',
      fontStyle: 'serif',
    },
    theme: {
      primary: '#B45309',
      accent: '#F59E0B',
      background: '#FFFBEB',
      text: '#451A03',
      cardBg: '#FFFFFF',
      borderColor: 'rgba(245,158,11,0.15)',
      gradientFrom: '#B45309',
      gradientTo: '#92400E',
      buttonGradient: 'linear-gradient(135deg, #B45309, #D97706)',
      fontDisplay: 'Playfair Display',
      fontBody: 'Inter',
    },
    coverOverlay: 'linear-gradient(to bottom, rgba(180,83,9,0.5), rgba(245,158,11,0.2), rgba(255,251,235,1))',
    description: 'Warm amber tones perfect for evening celebrations',
  },
  {
    id: 'midnight-bloom',
    name: 'Midnight Bloom',
    category: 'premium',
    eventTypes: ['wedding', 'engagement', 'corporate', 'graduation'],
    preview: {
      gradient: 'linear-gradient(135deg, #1E1B4B 0%, #312E81 50%, #4338CA 100%)',
      textColor: '#E0E7FF',
      accentColor: '#A78BFA',
      fontStyle: 'modern',
    },
    theme: {
      primary: '#4338CA',
      accent: '#A78BFA',
      background: '#EEF2FF',
      text: '#1E1B4B',
      cardBg: '#FFFFFF',
      borderColor: 'rgba(99,102,241,0.15)',
      gradientFrom: '#4338CA',
      gradientTo: '#3730A3',
      buttonGradient: 'linear-gradient(135deg, #4338CA, #6366F1)',
      fontDisplay: 'Playfair Display',
      fontBody: 'Inter',
    },
    coverOverlay: 'linear-gradient(to bottom, rgba(30,27,75,0.6), rgba(67,56,202,0.3), rgba(238,242,255,1))',
    description: 'Luxurious deep indigo with violet accents',
  },
  {
    id: 'rose-garden',
    name: 'Rose Garden',
    category: 'elegant',
    eventTypes: ['wedding', 'baby_shower', 'engagement', 'birthday', 'anniversary'],
    preview: {
      gradient: 'linear-gradient(135deg, #BE185D 0%, #EC4899 50%, #F9A8D4 100%)',
      textColor: '#FFF1F2',
      accentColor: '#F472B6',
      fontStyle: 'handwritten',
    },
    theme: {
      primary: '#BE185D',
      accent: '#F472B6',
      background: '#FFF1F2',
      text: '#4A0520',
      cardBg: '#FFFFFF',
      borderColor: 'rgba(236,72,153,0.15)',
      gradientFrom: '#BE185D',
      gradientTo: '#9D174D',
      buttonGradient: 'linear-gradient(135deg, #BE185D, #EC4899)',
      fontDisplay: 'Playfair Display',
      fontBody: 'Inter',
    },
    coverOverlay: 'linear-gradient(to bottom, rgba(190,24,93,0.5), rgba(236,72,153,0.2), rgba(255,241,242,1))',
    description: 'Romantic pinks and roses for love-filled occasions',
  },
  {
    id: 'forest-whisper',
    name: 'Forest Whisper',
    category: 'minimal',
    eventTypes: ['housewarming', 'birthday', 'corporate', 'other', 'festival'],
    preview: {
      gradient: 'linear-gradient(135deg, #065F46 0%, #059669 50%, #34D399 100%)',
      textColor: '#ECFDF5',
      accentColor: '#6EE7B7',
      fontStyle: 'modern',
    },
    theme: {
      primary: '#065F46',
      accent: '#34D399',
      background: '#ECFDF5',
      text: '#064E3B',
      cardBg: '#FFFFFF',
      borderColor: 'rgba(52,211,153,0.15)',
      gradientFrom: '#065F46',
      gradientTo: '#064E3B',
      buttonGradient: 'linear-gradient(135deg, #065F46, #059669)',
      fontDisplay: 'Playfair Display',
      fontBody: 'Inter',
    },
    coverOverlay: 'linear-gradient(to bottom, rgba(6,95,70,0.5), rgba(5,150,105,0.2), rgba(236,253,245,1))',
    description: 'Fresh, natural greens for earthy celebrations',
  },
  {
    id: 'ocean-breeze',
    name: 'Ocean Breeze',
    category: 'fun',
    eventTypes: ['birthday', 'baby_shower', 'graduation', 'other'],
    preview: {
      gradient: 'linear-gradient(135deg, #0369A1 0%, #0EA5E9 50%, #7DD3FC 100%)',
      textColor: '#F0F9FF',
      accentColor: '#38BDF8',
      fontStyle: 'modern',
    },
    theme: {
      primary: '#0369A1',
      accent: '#38BDF8',
      background: '#F0F9FF',
      text: '#0C4A6E',
      cardBg: '#FFFFFF',
      borderColor: 'rgba(56,189,248,0.15)',
      gradientFrom: '#0369A1',
      gradientTo: '#075985',
      buttonGradient: 'linear-gradient(135deg, #0369A1, #0EA5E9)',
      fontDisplay: 'Playfair Display',
      fontBody: 'Inter',
    },
    coverOverlay: 'linear-gradient(to bottom, rgba(3,105,161,0.5), rgba(14,165,233,0.2), rgba(240,249,255,1))',
    description: 'Cool and refreshing ocean-inspired palette',
  },
  {
    id: 'lavender-dreams',
    name: 'Lavender Dreams',
    category: 'elegant',
    eventTypes: ['birthday', 'baby_shower', 'wedding', 'engagement'],
    preview: {
      gradient: 'linear-gradient(135deg, #7C3AED 0%, #A78BFA 50%, #DDD6FE 100%)',
      textColor: '#F5F3FF',
      accentColor: '#C4B5FD',
      fontStyle: 'handwritten',
    },
    theme: {
      primary: '#7C3AED',
      accent: '#A78BFA',
      background: '#F5F3FF',
      text: '#3B0764',
      cardBg: '#FFFFFF',
      borderColor: 'rgba(167,139,250,0.15)',
      gradientFrom: '#7C3AED',
      gradientTo: '#6D28D9',
      buttonGradient: 'linear-gradient(135deg, #7C3AED, #8B5CF6)',
      fontDisplay: 'Playfair Display',
      fontBody: 'Inter',
    },
    coverOverlay: 'linear-gradient(to bottom, rgba(124,58,237,0.5), rgba(167,139,250,0.2), rgba(245,243,255,1))',
    description: 'Dreamy purple hues for magical moments',
  },
  {
    id: 'cherry-blossom',
    name: 'Cherry Blossom',
    category: 'cultural',
    eventTypes: ['cradle_ceremony', 'baby_shower', 'birthday', 'wedding'],
    preview: {
      gradient: 'linear-gradient(135deg, #FB7185 0%, #FDA4AF 50%, #FFE4E6 100%)',
      textColor: '#FFF1F2',
      accentColor: '#FECDD3',
      fontStyle: 'serif',
    },
    theme: {
      primary: '#E11D48',
      accent: '#FB7185',
      background: '#FFF1F2',
      text: '#4C0519',
      cardBg: '#FFFFFF',
      borderColor: 'rgba(251,113,133,0.15)',
      gradientFrom: '#E11D48',
      gradientTo: '#BE123C',
      buttonGradient: 'linear-gradient(135deg, #E11D48, #F43F5E)',
      fontDisplay: 'Playfair Display',
      fontBody: 'Inter',
    },
    coverOverlay: 'linear-gradient(to bottom, rgba(225,29,72,0.4), rgba(251,113,133,0.2), rgba(255,241,242,1))',
    description: 'Soft pinks inspired by spring blossoms',
  },
  {
    id: 'noir-elegance',
    name: 'Noir Elegance',
    category: 'premium',
    eventTypes: ['corporate', 'graduation', 'wedding', 'anniversary'],
    preview: {
      gradient: 'linear-gradient(135deg, #18181B 0%, #3F3F46 50%, #52525B 100%)',
      textColor: '#FAFAFA',
      accentColor: '#D4D4D8',
      fontStyle: 'modern',
    },
    theme: {
      primary: '#18181B',
      accent: '#A1A1AA',
      background: '#FAFAFA',
      text: '#18181B',
      cardBg: '#FFFFFF',
      borderColor: 'rgba(161,161,170,0.2)',
      gradientFrom: '#18181B',
      gradientTo: '#09090B',
      buttonGradient: 'linear-gradient(135deg, #18181B, #3F3F46)',
      fontDisplay: 'Playfair Display',
      fontBody: 'Inter',
    },
    coverOverlay: 'linear-gradient(to bottom, rgba(24,24,27,0.7), rgba(63,63,70,0.3), rgba(250,250,250,1))',
    description: 'Sophisticated black and white for formal events',
  },
  {
    id: 'diwali-lights',
    name: 'Diwali Lights',
    category: 'cultural',
    eventTypes: ['festival', 'housewarming', 'cradle_ceremony', 'wedding'],
    preview: {
      gradient: 'linear-gradient(135deg, #DC2626 0%, #F59E0B 50%, #EAB308 100%)',
      pattern: 'diyas',
      textColor: '#FFFBEB',
      accentColor: '#FCD34D',
      fontStyle: 'serif',
    },
    theme: {
      primary: '#DC2626',
      accent: '#F59E0B',
      background: '#FFFBEB',
      text: '#7C2D12',
      cardBg: '#FFFFFF',
      borderColor: 'rgba(245,158,11,0.2)',
      gradientFrom: '#DC2626',
      gradientTo: '#B91C1C',
      buttonGradient: 'linear-gradient(135deg, #DC2626, #EF4444)',
      fontDisplay: 'Playfair Display',
      fontBody: 'Inter',
    },
    coverOverlay: 'linear-gradient(to bottom, rgba(220,38,38,0.5), rgba(245,158,11,0.3), rgba(255,251,235,1))',
    description: 'Vibrant reds and golds for festive celebrations',
  },
  {
    id: 'peacock-royale',
    name: 'Peacock Royale',
    category: 'cultural',
    eventTypes: ['wedding', 'engagement', 'festival', 'cradle_ceremony', 'housewarming'],
    preview: {
      gradient: 'linear-gradient(135deg, #0F766E 0%, #2DD4BF 40%, #14B8A6 70%, #0D9488 100%)',
      textColor: '#F0FDFA',
      accentColor: '#5EEAD4',
      fontStyle: 'serif',
    },
    theme: {
      primary: '#0F766E',
      accent: '#2DD4BF',
      background: '#F0FDFA',
      text: '#134E4A',
      cardBg: '#FFFFFF',
      borderColor: 'rgba(45,212,191,0.15)',
      gradientFrom: '#0F766E',
      gradientTo: '#115E59',
      buttonGradient: 'linear-gradient(135deg, #0F766E, #14B8A6)',
      fontDisplay: 'Playfair Display',
      fontBody: 'Inter',
    },
    coverOverlay: 'linear-gradient(to bottom, rgba(15,118,110,0.5), rgba(45,212,191,0.2), rgba(240,253,250,1))',
    description: 'Rich teal and turquoise inspired by peacock feathers',
  },
  {
    id: 'party-confetti',
    name: 'Party Confetti',
    category: 'fun',
    eventTypes: ['birthday', 'graduation', 'baby_shower', 'other'],
    preview: {
      gradient: 'linear-gradient(135deg, #7C3AED 0%, #EC4899 33%, #F59E0B 66%, #10B981 100%)',
      textColor: '#FFFFFF',
      accentColor: '#F472B6',
      fontStyle: 'modern',
    },
    theme: {
      primary: '#7C3AED',
      accent: '#EC4899',
      background: '#FAF5FF',
      text: '#1F2937',
      cardBg: '#FFFFFF',
      borderColor: 'rgba(124,58,237,0.1)',
      gradientFrom: '#7C3AED',
      gradientTo: '#6D28D9',
      buttonGradient: 'linear-gradient(135deg, #7C3AED, #EC4899)',
      fontDisplay: 'Playfair Display',
      fontBody: 'Inter',
    },
    coverOverlay: 'linear-gradient(to bottom, rgba(124,58,237,0.4), rgba(236,72,153,0.2), rgba(250,245,255,1))',
    description: 'Colorful and playful for fun parties',
  },
];

export function getTemplateById(id: string): InvitationTemplate | undefined {
  return TEMPLATES.find(t => t.id === id);
}

export function getTemplatesForEventType(eventType: string): InvitationTemplate[] {
  return TEMPLATES.filter(t => t.eventTypes.includes(eventType));
}

export function getTemplatesByCategory(category: string): InvitationTemplate[] {
  return TEMPLATES.filter(t => t.category === category);
}
