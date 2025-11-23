export interface HeroSlide {
  id: number;
  title: string;
  subtitle: string;
  src: string;
  href?: string;
}
export interface Initiative {
  id: number;
  title: string;
  desc: string;
  tag: string;
  amount: string;
  image?: string;
  link?: string;
}
export interface Program {
  id: number;
  title: string;
  desc: string;
  icon: string;
  image?: string;
  link?: string;
}
export interface Message {
  id: number;
  name: string;
  email: string;
  message: string;
  createdAt?: string;
}
export interface AboutContent {
  title: string;
  description: string;
}

export interface ContactContent {
  phone: string;
  email: string;
  address: string;
}

export interface VisionMission {
  title: string;
  description: string;
}

export interface DonateContent {
  title: string;
  description: string;
  bank: string;
  link: string;
}

export interface VolunteerContent {
  title: string;
  description: string;
  steps: string[];
}
export interface AppContent {
  heroSlides: HeroSlide[];
  heroImage?: string;
  initiatives: Initiative[];
  programs: Program[];
  messages: Message[];
  about: AboutContent;
  contact: ContactContent;
  vision: VisionMission;
  mission: VisionMission;
  donate: DonateContent;
  volunteer: VolunteerContent;
}