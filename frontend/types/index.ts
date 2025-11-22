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
}
export interface Program {
  id: number;
  title: string;
  desc: string;
  icon: string;
}
export interface Message {
  id: number;
  name: string;
  email: string;
  message: string;
}
export interface AppContent {
  heroSlides: HeroSlide[];
  initiatives: Initiative[];
  programs: Program[];
  messages: Message[];
}