import { v4 as uuidv4 } from 'uuid';
import { JournalEntry, PandaNFT, PandaTraits, PowerDomain, GeometricForm, EmotionalProfile, ThoughtPatterns, EnergySignature, NFTMetadata } from '../../../types';

export class PandaGenerator {
  private static readonly POWER_DOMAINS = [
    PowerDomain.ELEMENTAL,
    PowerDomain.PSYCHIC,
    PowerDomain.QUANTUM,
    PowerDomain.TECH,
    PowerDomain.COSMIC
  ];

  private static readonly GEOMETRIC_FORMS = [
    { shape: 'point', sides: 0, name: 'Unity' },
    { shape: 'line', sides: 1, name: 'Duality' },
    { shape: 'triangle', sides: 3, name: 'Trinity' },
    { shape: 'square', sides: 4, name: 'Foundation' },
    { shape: 'pentagon', sides: 5, name: 'Life' },
    { shape: 'hexagon', sides: 6, name: 'Harmony' },
    { shape: 'heptagon', sides: 7, name: 'Mysticism' }
  ];

  private static readonly EMOTION_MAP: { [key: string]: number } = {
    'joy': 1, 'happy': 1, 'excited': 1, 'grateful': 1, 'love': 1,
    'sad': 2, 'down': 2, 'melancholy': 2, 'nostalgic': 2,
    'anger': 3, 'frustrated': 3, 'annoyed': 3, 'irritated': 3,
    'fear': 4, 'anxious': 4, 'worried': 4, 'nervous': 4,
    'calm': 5, 'peaceful': 5, 'serene': 5, 'relaxed': 5,
    'curious': 6, 'interested': 6, 'fascinated': 6, 'wonder': 6,
    'inspired': 7, 'motivated': 7, 'determined': 7, 'empowered': 7
  };

  static generateFromJournal(journalEntry: JournalEntry): PandaNFT {
    const traits = this.analyzeJournalEntry(journalEntry);
    const metadata = this.generateMetadata(journalEntry, traits);
    const svgData = this.generateSVG(traits);

    return {
      id: uuidv4(),
      journalEntryId: journalEntry.id,
      generatedAt: new Date().toISOString(),
      traits,
      metadata,
      svgData
    };
  }

  private static analyzeJournalEntry(entry: JournalEntry): PandaTraits {
    const textAnalysis = this.analyzeText(entry);
    const powerDomain = this.determinePowerDomain(textAnalysis);
    const consciousnessLevel = entry.consciousnessLevel || this.calculateConsciousnessLevel(textAnalysis);
    const geometricForm = this.getGeometricForm(consciousnessLevel);
    const emotionalProfile = this.analyzeEmotions(textAnalysis);
    const thoughtPatterns = this.analyzeThoughtPatterns(textAnalysis);
    const energySignature = this.generateEnergySignature(textAnalysis, consciousnessLevel);
    const evolutionPotential = this.calculateEvolutionPotential(textAnalysis, consciousnessLevel);

    return {
      powerDomain,
      consciousnessLevel,
      geometricForm,
      emotionalProfile,
      thoughtPatterns,
      energySignature,
      evolutionPotential
    };
  }

  private static analyzeText(entry: JournalEntry): any {
    let allText = '';
    
    // Handle flexible format
    if (entry.entries && entry.entries.length > 0) {
      allText = entry.entries
        .map(e => `${e.type} ${e.details}`)
        .join(' ')
        .toLowerCase();
    }
    // Handle legacy format
    else if (entry.sections) {
      allText = Object.values(entry.sections)
        .flatMap(section => Object.values(section))
        .join(' ')
        .toLowerCase();
    }

    const words = allText.split(/\s+/).filter(word => word.length > 0);
    const uniqueWords = new Set(words);
    const totalWords = words.length;

    const emotionWords = words.filter(word => Object.keys(this.EMOTION_MAP).includes(word));
    const abstractWords = words.filter(word => 
      ['think', 'believe', 'imagine', 'concept', 'idea', 'theory', 'philosophy', 'meaning', 'purpose'].includes(word)
    );
    const concreteWords = words.filter(word =>
      ['do', 'did', 'make', 'build', 'create', 'physical', 'action', 'task', 'complete'].includes(word)
    );

    return {
      totalWords,
      uniqueWords: uniqueWords.size,
      complexity: uniqueWords.size / totalWords,
      emotionWords,
      abstractWords,
      concreteWords,
      rawText: allText,
      sections: entry.sections,
      entries: entry.entries
    };
  }

  private static determinePowerDomain(analysis: any): PowerDomain {
    const domainScores = {
      [PowerDomain.ELEMENTAL]: 0,
      [PowerDomain.PSYCHIC]: 0,
      [PowerDomain.QUANTUM]: 0,
      [PowerDomain.TECH]: 0,
      [PowerDomain.COSMIC]: 0
    };

    const elementalWords = ['earth', 'fire', 'water', 'air', 'nature', 'physical', 'body', 'exercise', 'health'];
    const psychicWords = ['mind', 'thought', 'emotion', 'feeling', 'intuition', 'dream', 'vision', 'meditation'];
    const quantumWords = ['possibility', 'potential', 'change', 'transform', 'evolve', 'paradox', 'duality'];
    const techWords = ['code', 'system', 'logic', 'data', 'algorithm', 'digital', 'compute', 'optimize'];
    const cosmicWords = ['universe', 'spiritual', 'consciousness', 'divine', 'eternal', 'infinite', 'sacred', 'soul'];

    const text = analysis.rawText;
    
    elementalWords.forEach(word => {
      if (text.includes(word)) domainScores[PowerDomain.ELEMENTAL]++;
    });
    psychicWords.forEach(word => {
      if (text.includes(word)) domainScores[PowerDomain.PSYCHIC]++;
    });
    quantumWords.forEach(word => {
      if (text.includes(word)) domainScores[PowerDomain.QUANTUM]++;
    });
    techWords.forEach(word => {
      if (text.includes(word)) domainScores[PowerDomain.TECH]++;
    });
    cosmicWords.forEach(word => {
      if (text.includes(word)) domainScores[PowerDomain.COSMIC]++;
    });

    let maxDomain = PowerDomain.ELEMENTAL;
    let maxScore = 0;
    
    Object.entries(domainScores).forEach(([domain, score]) => {
      if (score > maxScore) {
        maxScore = score;
        maxDomain = domain as PowerDomain;
      }
    });

    if (maxScore === 0) {
      const randomIndex = Math.floor(Math.random() * this.POWER_DOMAINS.length);
      return this.POWER_DOMAINS[randomIndex];
    }

    return maxDomain;
  }

  private static calculateConsciousnessLevel(analysis: any): number {
    const complexityScore = analysis.complexity * 3;
    const depthScore = Math.min(analysis.totalWords / 100, 2);
    const diversityScore = Math.min(analysis.uniqueWords / 50, 2);
    
    const totalScore = complexityScore + depthScore + diversityScore;
    return Math.min(Math.max(Math.ceil(totalScore), 1), 7);
  }

  private static getGeometricForm(level: number): GeometricForm {
    const form = this.GEOMETRIC_FORMS[Math.min(level - 1, this.GEOMETRIC_FORMS.length - 1)];
    const colors = ['#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', '#FECA57', '#9B59B6', '#E74C3C'];
    const animations = ['pulse', 'rotate', 'float', 'shimmer', 'morph', 'glow', 'transcend'];

    return {
      shape: form.shape,
      complexity: level,
      color: colors[level - 1],
      animation: animations[level - 1]
    };
  }

  private static analyzeEmotions(analysis: any): EmotionalProfile {
    const emotions = analysis.emotionWords.map((word: string) => ({
      word,
      type: Object.entries(this.EMOTION_MAP).find(([key]) => key === word)?.[1] || 0
    }));

    const emotionCounts: { [key: number]: number } = {};
    emotions.forEach((emotion: any) => {
      emotionCounts[emotion.type] = (emotionCounts[emotion.type] || 0) + 1;
    });

    let dominantType = 5;
    let maxCount = 0;
    
    Object.entries(emotionCounts).forEach(([type, count]) => {
      if (count > maxCount) {
        maxCount = count;
        dominantType = parseInt(type);
      }
    });

    const emotionNames = ['Joy', 'Sadness', 'Anger', 'Fear', 'Calm', 'Curiosity', 'Inspiration'];
    const intensity = Math.min(emotions.length / 10, 1);
    const balance = Object.keys(emotionCounts).length / 7;

    return {
      dominantEmotion: emotionNames[dominantType - 1] || 'Calm',
      intensity,
      balance
    };
  }

  private static analyzeThoughtPatterns(analysis: any): ThoughtPatterns {
    const abstractScore = Math.min(analysis.abstractWords.length / 20, 1);
    const concreteScore = Math.min(analysis.concreteWords.length / 20, 1);
    
    const patternWords = ['pattern', 'connect', 'relate', 'similar', 'trend', 'cycle', 'repeat'];
    const patternCount = patternWords.filter(word => analysis.rawText.includes(word)).length;
    const patternScore = Math.min(patternCount / 5, 1);

    return {
      abstractThinking: abstractScore,
      concreteThinking: concreteScore,
      patternRecognition: patternScore
    };
  }

  private static generateEnergySignature(analysis: any, level: number): EnergySignature {
    const frequency = 100 + (level * 100) + (analysis.complexity * 500);
    const amplitude = 0.5 + (analysis.emotionWords.length / 20);
    const vibrations = ['steady', 'pulsing', 'oscillating', 'resonant', 'harmonic', 'quantum', 'transcendent'];

    return {
      frequency,
      amplitude: Math.min(amplitude, 1),
      vibration: vibrations[level - 1]
    };
  }

  private static calculateEvolutionPotential(analysis: any, currentLevel: number): number {
    const growthWords = ['learn', 'grow', 'improve', 'develop', 'evolve', 'progress', 'advance'];
    const growthCount = growthWords.filter(word => analysis.rawText.includes(word)).length;
    const growthScore = Math.min(growthCount / 3, 1);
    
    const potentialLevels = 7 - currentLevel;
    const evolutionPotential = (potentialLevels / 6) * 0.7 + growthScore * 0.3;
    
    return evolutionPotential;
  }

  private static generateMetadata(entry: JournalEntry, traits: PandaTraits): NFTMetadata {
    const name = `Consciousness Panda #${Date.now()}`;
    const description = `A unique panda NFT generated from deep personal reflections on ${new Date(entry.date).toLocaleDateString()}.`;
    
    const backstory = this.generateBackstory(entry, traits);
    
    const attributes = [
      { trait_type: 'Power Domain', value: traits.powerDomain },
      { trait_type: 'Consciousness Level', value: traits.consciousnessLevel },
      { trait_type: 'Geometric Form', value: traits.geometricForm.shape },
      { trait_type: 'Dominant Emotion', value: traits.emotionalProfile.dominantEmotion },
      { trait_type: 'Energy Frequency', value: traits.energySignature.frequency },
      { trait_type: 'Evolution Potential', value: Math.round(traits.evolutionPotential * 100) }
    ];

    return {
      name,
      description,
      backstory,
      attributes
    };
  }

  private static generateBackstory(entry: JournalEntry, traits: PandaTraits): string {
    const domainStories: { [key: string]: string } = {
      [PowerDomain.ELEMENTAL]: 'Born from the primal forces of nature',
      [PowerDomain.PSYCHIC]: 'Awakened through deep mental exploration',
      [PowerDomain.QUANTUM]: 'Emerged from the space between possibilities',
      [PowerDomain.TECH]: 'Compiled from pure logical constructs',
      [PowerDomain.COSMIC]: 'Descended from the cosmic consciousness'
    };

    const levelDescriptions = [
      'taking its first steps',
      'beginning to understand',
      'finding its path',
      'mastering its abilities',
      'transcending limitations',
      'approaching enlightenment',
      'achieving cosmic unity'
    ];

    const backstory = `${domainStories[traits.powerDomain]}, this panda is ${levelDescriptions[traits.consciousnessLevel - 1]}. ` +
      `With ${traits.emotionalProfile.dominantEmotion.toLowerCase()} as its guiding force and a ${traits.geometricForm.shape} ` +
      `as its sacred form, it vibrates at ${traits.energySignature.frequency}Hz. ` +
      `Its journey reflects the consciousness that created it on ${new Date(entry.date).toLocaleDateString()}.`;

    return backstory;
  }

  private static generateSVG(traits: PandaTraits): string {
    const { geometricForm, powerDomain, consciousnessLevel, emotionalProfile, energySignature } = traits;
    
    const domainColors: { [key: string]: string } = {
      [PowerDomain.ELEMENTAL]: '#8B4513',
      [PowerDomain.PSYCHIC]: '#9B59B6',
      [PowerDomain.QUANTUM]: '#00CED1',
      [PowerDomain.TECH]: '#2ECC40',
      [PowerDomain.COSMIC]: '#FFD700'
    };

    const svg = `
      <svg width="400" height="400" viewBox="0 0 400 400" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <radialGradient id="aura">
            <stop offset="0%" stop-color="${domainColors[powerDomain]}" stop-opacity="0.8"/>
            <stop offset="100%" stop-color="${domainColors[powerDomain]}" stop-opacity="0"/>
          </radialGradient>
          <filter id="glow">
            <feGaussianBlur stdDeviation="${3 + consciousnessLevel}" result="coloredBlur"/>
            <feMerge>
              <feMergeNode in="coloredBlur"/>
              <feMergeNode in="SourceGraphic"/>
            </feMerge>
          </filter>
        </defs>
        
        <!-- Aura -->
        <circle cx="200" cy="200" r="${100 + energySignature.amplitude * 50}" fill="url(#aura)" opacity="0.6">
          <animate attributeName="r" 
            values="${100 + energySignature.amplitude * 50};${120 + energySignature.amplitude * 50};${100 + energySignature.amplitude * 50}" 
            dur="${5 - consciousnessLevel * 0.5}s" 
            repeatCount="indefinite"/>
        </circle>
        
        <!-- Sacred Geometry Background -->
        ${this.generateSacredGeometry(geometricForm, 200, 200, 80)}
        
        <!-- Panda Base -->
        <g filter="url(#glow)">
          <!-- Body -->
          <ellipse cx="200" cy="250" rx="80" ry="60" fill="#1a1a1a"/>
          
          <!-- Head -->
          <circle cx="200" cy="150" r="60" fill="#f0f0f0"/>
          
          <!-- Ears -->
          <circle cx="160" cy="120" r="25" fill="#1a1a1a"/>
          <circle cx="240" cy="120" r="25" fill="#1a1a1a"/>
          
          <!-- Eyes -->
          <circle cx="180" cy="150" r="15" fill="#1a1a1a"/>
          <circle cx="220" cy="150" r="15" fill="#1a1a1a"/>
          <circle cx="182" cy="148" r="5" fill="#ffffff"/>
          <circle cx="218" cy="148" r="5" fill="#ffffff"/>
          
          <!-- Nose -->
          <ellipse cx="200" cy="165" rx="8" ry="6" fill="#1a1a1a"/>
          
          <!-- Arms -->
          <ellipse cx="140" cy="230" rx="25" ry="40" fill="#1a1a1a" transform="rotate(-30 140 230)"/>
          <ellipse cx="260" cy="230" rx="25" ry="40" fill="#1a1a1a" transform="rotate(30 260 230)"/>
          
          <!-- Legs -->
          <ellipse cx="170" cy="280" rx="25" ry="35" fill="#1a1a1a"/>
          <ellipse cx="230" cy="280" rx="25" ry="35" fill="#1a1a1a"/>
          
          <!-- Consciousness Indicator -->
          <circle cx="200" cy="150" r="3" fill="${geometricForm.color}" opacity="0.8">
            <animate attributeName="r" values="3;6;3" dur="2s" repeatCount="indefinite"/>
          </circle>
        </g>
        
        <!-- Power Domain Symbol -->
        ${this.generatePowerSymbol(powerDomain, 200, 90, 20)}
        
        <!-- Energy Particles -->
        ${this.generateEnergyParticles(energySignature, domainColors[powerDomain])}
      </svg>
    `;

    return svg;
  }

  private static generateSacredGeometry(form: GeometricForm, cx: number, cy: number, size: number): string {
    const { shape, color } = form;
    
    switch (shape) {
      case 'point':
        return `<circle cx="${cx}" cy="${cy}" r="5" fill="${color}" opacity="0.3"/>`;
      
      case 'line':
        return `<line x1="${cx - size}" y1="${cy}" x2="${cx + size}" y2="${cy}" stroke="${color}" stroke-width="2" opacity="0.3"/>`;
      
      case 'triangle':
        return this.generatePolygon(3, cx, cy, size, color);
      
      case 'square':
        return this.generatePolygon(4, cx, cy, size, color);
      
      case 'pentagon':
        return this.generatePolygon(5, cx, cy, size, color);
      
      case 'hexagon':
        return this.generatePolygon(6, cx, cy, size, color);
      
      case 'heptagon':
        return this.generatePolygon(7, cx, cy, size, color);
      
      default:
        return '';
    }
  }

  private static generatePolygon(sides: number, cx: number, cy: number, size: number, color: string): string {
    const points = [];
    for (let i = 0; i < sides; i++) {
      const angle = (i * 2 * Math.PI) / sides - Math.PI / 2;
      const x = cx + size * Math.cos(angle);
      const y = cy + size * Math.sin(angle);
      points.push(`${x},${y}`);
    }
    
    return `
      <polygon points="${points.join(' ')}" fill="none" stroke="${color}" stroke-width="2" opacity="0.3">
        <animateTransform attributeName="transform" type="rotate" 
          from="0 ${cx} ${cy}" to="360 ${cx} ${cy}" dur="20s" repeatCount="indefinite"/>
      </polygon>
    `;
  }

  private static generatePowerSymbol(domain: PowerDomain, cx: number, cy: number, size: number): string {
    const symbols: { [key: string]: string } = {
      [PowerDomain.ELEMENTAL]: `
        <g transform="translate(${cx}, ${cy})">
          <path d="M0,-${size} L${size},${size} L-${size},${size} Z" fill="#8B4513" opacity="0.6"/>
        </g>
      `,
      [PowerDomain.PSYCHIC]: `
        <g transform="translate(${cx}, ${cy})">
          <circle r="${size}" fill="none" stroke="#9B59B6" stroke-width="2" opacity="0.6"/>
          <circle r="${size/2}" fill="#9B59B6" opacity="0.4"/>
        </g>
      `,
      [PowerDomain.QUANTUM]: `
        <g transform="translate(${cx}, ${cy})">
          <ellipse rx="${size}" ry="${size/2}" fill="none" stroke="#00CED1" stroke-width="2" opacity="0.6" transform="rotate(45)"/>
          <ellipse rx="${size}" ry="${size/2}" fill="none" stroke="#00CED1" stroke-width="2" opacity="0.6" transform="rotate(-45)"/>
        </g>
      `,
      [PowerDomain.TECH]: `
        <g transform="translate(${cx}, ${cy})">
          <rect x="-${size}" y="-${size}" width="${size*2}" height="${size*2}" fill="none" stroke="#2ECC40" stroke-width="2" opacity="0.6"/>
          <circle r="${size/2}" fill="#2ECC40" opacity="0.4"/>
        </g>
      `,
      [PowerDomain.COSMIC]: `
        <g transform="translate(${cx}, ${cy})">
          ${Array.from({length: 8}, (_, i) => {
            const angle = (i * Math.PI) / 4;
            const x2 = Math.cos(angle) * size;
            const y2 = Math.sin(angle) * size;
            return `<line x1="0" y1="0" x2="${x2}" y2="${y2}" stroke="#FFD700" stroke-width="2" opacity="0.6"/>`;
          }).join('')}
        </g>
      `
    };

    return symbols[domain] || '';
  }

  private static generateEnergyParticles(energy: EnergySignature, color: string): string {
    const particles = [];
    const particleCount = Math.floor(energy.frequency / 100);
    
    for (let i = 0; i < particleCount; i++) {
      const angle = (i * 2 * Math.PI) / particleCount;
      const radius = 150 + Math.random() * 50;
      const x = 200 + Math.cos(angle) * radius;
      const y = 200 + Math.sin(angle) * radius;
      const size = 2 + Math.random() * 3;
      const duration = 3 + Math.random() * 4;
      
      particles.push(`
        <circle cx="${x}" cy="${y}" r="${size}" fill="${color}" opacity="0.6">
          <animate attributeName="opacity" values="0;0.6;0" dur="${duration}s" repeatCount="indefinite"/>
          <animateTransform attributeName="transform" type="rotate" 
            from="0 200 200" to="360 200 200" dur="${duration * 10}s" repeatCount="indefinite"/>
        </circle>
      `);
    }
    
    return particles.join('');
  }
}