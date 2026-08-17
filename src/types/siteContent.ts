// Centralized site content data type definitions
export interface HeroReel {
  id?: string;
  poster: string;
  videoUrl: string;
  caption: string;
  likes: string;
  comments: string;
  active?: boolean;
}

export interface ShowreelImage {
  id?: string;
  src: string;
  label: string;
  active?: boolean;
}

export interface ShowreelVideo {
  id?: string;
  src: string;
  poster: string;
  label: string;
  active?: boolean;
}

export interface IndustryItem {
  id?: string;
  name: string;
  statement: string;
  image: string;
  active?: boolean;
}

export interface Testimonial {
  id?: string;
  quote: string;
  author: string;
  company: string;
  industry: string;
  active?: boolean;
}

export interface InstagramTile {
  id?: string;
  type: string;
  client: string;
  campaign: string;
  image: string;
  active?: boolean;
}

export interface SiteContent {
  hero: {
    heading: string;
    headingItalic: string;
    subtitle: string;
    mockReels: HeroReel[];
  };
  showreel: {
    heading: string;
    description: string;
    leftImages: ShowreelImage[];
    centerVideos: ShowreelVideo[];
    rightImages: ShowreelImage[];
  };
  industries: IndustryItem[];
  testimonials: Testimonial[];
  instagramFeed: InstagramTile[];
}
