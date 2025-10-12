export interface Asset {
  id: number;
  title: string;
  description: string;
  price: number;
  category: string;
  thumbnail: string;
  frameRate?: string;
  previewVideo?: string;
  downloadUrl: string;
  tags: string[];
  createdAt: Date;
  downloads: number;
  featured: boolean;
  fileSize: string;
  format: string;
}

export const categories = [
  'All',
  'Transitions',
  'Music',
  'Animations',
  'Backgrounds'
];

// Your custom assets - Real video transitions from GitHub!
export const mockAssets: Asset[] = [
  {
    id: 1,
    title: 'Circle Wipe Easy',
    description: 'Smooth and dynamic video transition perfect for professional video editing projects',
    price: 30,
    category: 'Transitions',
    thumbnail: '/thumbnail/transition 1.png',
    frameRate: '60fps',
    previewVideo: '/videos/transition1.mp4',
    downloadUrl: '/videos/transition1.mp4',
    tags: ['smooth', 'professional', 'dynamic', 'editing'],
    createdAt: new Date('2024-03-26'),
    downloads: 0,
    featured: true,
    fileSize: 'Video File',
    format: 'MP4 Video'
  },
  {
    id: 2,
    title: 'Wipe Ease',
    description: 'Elegant video transition with modern effects for creative video projects',
    price: 30,
    category: 'Transitions',
    thumbnail: '/thumbnail/transition 2.png',
    frameRate: '30fps',
    previewVideo: '/videos/transition2.mp4',
    downloadUrl: '/videos/transition2.mp4',
    tags: ['elegant', 'modern', 'creative', 'effects'],
    createdAt: new Date('2024-03-26'),
    downloads: 0,
    featured: true,
    fileSize: 'Video File',
    format: 'MP4 Video'
  },
  {
    id: 3,
    title: 'Horizontal Wipe',
    description: 'Stunning transition effect with cinematic quality for high-end video production',
    price: 25,
    category: 'Transitions',
    thumbnail: '/thumbnail/transition 3.png',
    frameRate: '24fps',
    previewVideo: '/videos/transition3.mp4',
    downloadUrl: '/videos/transition3.mp4',
    tags: ['cinematic', 'stunning', 'high-end', 'production'],
    createdAt: new Date('2024-03-26'),
    downloads: 0,
    featured: false,
    fileSize: 'Video File',
    format: 'MP4 Video'
  },
  {
    id: 4,
    title: 'Particle Effect',
    description: 'Dynamic particle animation effects perfect for modern video projects and motion graphics',
    price: 20,
    category: 'Animations',
    thumbnail: '/thumbnail/animation1.png',
    frameRate: '30fps',
    previewVideo: '/videos/animation1.mp4',
    downloadUrl: '/videos/animation1.mp4',
    tags: ['particles', 'dynamic', 'modern', 'motion-graphics'],
    createdAt: new Date('2024-03-27'),
    downloads: 0,
    featured: true,
    fileSize: 'Video File',
    format: 'MP4 Video'
  },
  {
    id: 5,
    title: 'Map Animation',
    description: 'Professional map animation with smooth transitions and location markers for corporate presentations',
    price: 35,
    category: 'Animations',
    thumbnail: '/thumbnail/animation2.png',
    frameRate: '30fps',
    previewVideo: '/videos/animation2.mp4',
    downloadUrl: '/videos/animation2.mp4',
    tags: ['map', 'corporate', 'professional', 'location', 'markers'],
    createdAt: new Date('2024-03-27'),
    downloads: 0,
    featured: true,
    fileSize: 'Video File',
    format: 'MP4 Video'
  },
  {
    id: 6,
    title: 'Team Animation',
    description: 'Engaging team introduction animation with character reveals perfect for corporate videos',
    price: 30,
    category: 'Animations',
    thumbnail: '/thumbnail/animation3.png',
    frameRate: '24fps',
    previewVideo: '/videos/animation3.mp4',
    downloadUrl: '/videos/animation3.mp4',
    tags: ['team', 'corporate', 'introduction', 'character', 'reveal'],
    createdAt: new Date('2024-03-27'),
    downloads: 0,
    featured: false,
    fileSize: 'Video File',
    format: 'MP4 Video'
  },
  {
    id: 7,
    title: 'Plane Crash',
    description: 'Dramatic plane crash animation with realistic effects and motion for action sequences',
    price: 25,
    category: 'Animations',
    thumbnail: '/thumbnail/animation 4.png',
    frameRate: '30fps',
    previewVideo: '/videos/animation 4.mp4',
    downloadUrl: '/videos/animation 4.mp4',
    tags: ['plane', 'crash', 'dramatic', 'action', 'realistic'],
    createdAt: new Date('2024-03-28'),
    downloads: 0,
    featured: true,
    fileSize: 'Video File',
    format: 'MP4 Video'
  },
  {
    id: 8,
    title: 'Classic Particles',
    description: 'Elegant classic particle background with smooth motion perfect for professional presentations',
    price: 30,
    category: 'Backgrounds',
    thumbnail: '/thumbnail/background 1.png',
    frameRate: '30fps',
    previewVideo: '/videos/background 1.mp4',
    downloadUrl: '/videos/background 1.mp4',
    tags: ['particles', 'classic', 'elegant', 'professional', 'presentation'],
    createdAt: new Date('2024-03-28'),
    downloads: 0,
    featured: true,
    fileSize: 'Video File',
    format: 'MP4 Video'
  },
  {
    id: 9,
    title: 'Smooth Lines',
    description: 'Clean and modern smooth lines background animation ideal for corporate videos',
    price: 27,
    category: 'Backgrounds',
    thumbnail: '/thumbnail/background 2.png',
    frameRate: '30fps',
    previewVideo: '/videos/background 2.mp4',
    downloadUrl: '/videos/background 2.mp4',
    tags: ['lines', 'smooth', 'modern', 'corporate', 'clean'],
    createdAt: new Date('2024-03-28'),
    downloads: 0,
    featured: true,
    fileSize: 'Video File',
    format: 'MP4 Video'
  },
  {
    id: 10,
    title: 'Classic Cube',
    description: 'Geometric cube background animation with classic styling for creative projects',
    price: 25,
    category: 'Backgrounds',
    thumbnail: '/thumbnail/background 3.png',
    frameRate: '24fps',
    previewVideo: '/videos/backgorund 3.mp4',
    downloadUrl: '/videos/backgorund 3.mp4',
    tags: ['cube', 'geometric', 'classic', 'creative', 'styling'],
    createdAt: new Date('2024-03-28'),
    downloads: 0,
    featured: false,
    fileSize: 'Video File',
    format: 'MP4 Video'
  },
  {
    id: 11,
    title: 'Happy Music 1',
    description: 'Uplifting and cheerful background music perfect for positive content and promotional videos',
    price: 20,
    category: 'Music',
    thumbnail: '🎵',
    frameRate: 'Audio',
    previewVideo: '/videos/happy music 1.mp3',
    downloadUrl: '/videos/happy music 1.mp3',
    tags: ['happy', 'upbeat', 'positive', 'background', 'cheerful'],
    createdAt: new Date('2024-03-29'),
    downloads: 0,
    featured: true,
    fileSize: 'Audio File',
    format: 'MP3 Audio'
  },
  {
    id: 12,
    title: 'Intense Music 1',
    description: 'High-energy intense music perfect for action sequences, gaming videos, and dramatic moments',
    price: 20,
    category: 'Music',
    thumbnail: '🎸',
    frameRate: 'Audio',
    previewVideo: '/videos/intense music 1.mp3',
    downloadUrl: '/videos/intense music 1.mp3',
    tags: ['intense', 'dramatic', 'action', 'energy', 'gaming'],
    createdAt: new Date('2024-03-29'),
    downloads: 0,
    featured: true,
    fileSize: 'Audio File',
    format: 'MP3 Audio'
  },
  {
    id: 13,
    title: 'Sad Music',
    description: 'Emotional and melancholic background music ideal for dramatic scenes and reflective content',
    price: 20,
    category: 'Music',
    thumbnail: '🎹',
    frameRate: 'Audio',
    previewVideo: '/videos/sad music.mp3',
    downloadUrl: '/videos/sad music.mp3',
    tags: ['sad', 'emotional', 'melancholic', 'dramatic', 'reflective'],
    createdAt: new Date('2024-03-29'),
    downloads: 0,
    featured: false,
    fileSize: 'Audio File',
    format: 'MP3 Audio'
  },
  {
    id: 14,
    title: 'Flame Effect',
    description: 'Spectacular flame animation effect with realistic fire physics perfect for action scenes and dramatic visual impact',
    price: 25,
    category: 'Animations',
    thumbnail: '/thumbnail/animation 5.png',
    frameRate: '30fps',
    previewVideo: '/videos/animation 5.mp4',
    downloadUrl: '/videos/animation 5.mp4',
    tags: ['flame', 'fire', 'spectacular', 'realistic', 'action', 'dramatic', 'visual-effects'],
    createdAt: new Date('2024-10-02'),
    downloads: 0,
    featured: true,
    fileSize: 'Video File',
    format: 'MP4 Video'
  },
  {
    id: 15,
    title: 'TV Screen',
    description: 'Modern TV screen animation with glitch effects and retro styling perfect for tech presentations and creative projects',
    price: 30,
    category: 'Animations',
    thumbnail: '/thumbnail/animation 6.png',
    frameRate: '30fps',
    previewVideo: '/videos/animation 6.mp4',
    downloadUrl: '/videos/animation 6.mp4',
    tags: ['tv', 'screen', 'glitch', 'retro', 'tech', 'modern', 'creative', 'presentation'],
    createdAt: new Date('2024-10-02'),
    downloads: 0,
    featured: true,
    fileSize: 'Video File',
    format: 'MP4 Video'
  },
  {
    id: 16,
    title: 'Clock Animation',
    description: 'Elegant clock animation with smooth time progression effects ideal for time-lapse videos and corporate presentations',
    price: 30,
    category: 'Animations',
    thumbnail: '/thumbnail/animation 7.png',
    frameRate: '24fps',
    previewVideo: '/videos/animation 7.mp4',
    downloadUrl: '/videos/animation 7.mp4',
    tags: ['clock', 'time', 'elegant', 'corporate', 'time-lapse', 'progression', 'smooth'],
    createdAt: new Date('2024-10-02'),
    downloads: 0,
    featured: true,
    fileSize: 'Video File',
    format: 'MP4 Video'
  },
  {
    id: 17,
    title: 'Explosion Effect',
    description: 'High-impact explosion animation with particle debris and realistic blast effects perfect for action sequences',
    price: 30,
    category: 'Animations',
    thumbnail: '/thumbnail/animation 8.png',
    frameRate: '60fps',
    previewVideo: '/videos/animation 8.mp4',
    downloadUrl: '/videos/animation 8.mp4',
    tags: ['explosion', 'blast', 'particles', 'debris', 'action', 'impact', 'realistic', 'special-effects'],
    createdAt: new Date('2024-10-02'),
    downloads: 0,
    featured: true,
    fileSize: 'Video File',
    format: 'MP4 Video'
  },
  {
    id: 18,
    title: 'Relaxing',
    description: 'Soothing and peaceful background music perfect for meditation, wellness content, and calm atmospheric videos',
    price: 15,
    category: 'Music',
    thumbnail: '🧘',
    frameRate: 'Audio',
    previewVideo: '/videos/relaxing.mp3',
    downloadUrl: '/videos/relaxing.mp3',
    tags: ['relaxing', 'peaceful', 'meditation', 'wellness', 'calm', 'soothing', 'atmospheric', 'ambient'],
    createdAt: new Date('2024-10-02'),
    downloads: 0,
    featured: true,
    fileSize: 'Audio File',
    format: 'MP3 Audio'
  }
];

// Helper functions
export const getFeaturedAssets = () => mockAssets.filter(asset => asset.featured);
export const getAssetsByCategory = (category: string) => 
  category === 'All' ? mockAssets : mockAssets.filter(asset => asset.category === category);
export const getAssetById = (id: number) => mockAssets.find(asset => asset.id === id);
export const searchAssets = (query: string) => 
  mockAssets.filter(asset => 
    asset.title.toLowerCase().includes(query.toLowerCase()) ||
    asset.description.toLowerCase().includes(query.toLowerCase()) ||
    asset.tags.some(tag => tag.toLowerCase().includes(query.toLowerCase()))
  );