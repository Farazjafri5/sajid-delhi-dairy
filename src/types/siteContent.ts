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
  type: string; // "Reel" | "Photo" | "Campaign" etc.
  client?: string;
  campaign?: string;
  caption?: string;
  image: string;
  videoUrl?: string;
  permalink?: string;
  likes?: string;
  comments?: string;
  active?: boolean;
}

export interface BrandingSettings {
  logoUrl?: string;
  logoText?: string;
  tagline?: string;
}

export interface SeoSettings {
  metaTitle?: string;
  metaDescription?: string;
  keywords?: string;
  ogImage?: string;
}

export interface ContactSettings {
  email?: string;
  phone?: string;
  whatsapp?: string;
  instagramHandle?: string;
  instagramUrl?: string;
  businessTypes?: string[];
  serviceOptions?: string[];
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
  instagramSettings?: {
    beholdFeedId?: string;
    handle?: string;
    profileUrl?: string;
    autoSync?: boolean;
    hiddenPostIds?: string[];
    hiddenPermalinks?: string[];
  };
  contactSettings?: ContactSettings;
  branding?: BrandingSettings;
  seo?: SeoSettings;
}

