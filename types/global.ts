import { LucideIcon } from "lucide-react";

export interface ILayoutProps {
  children: React.ReactNode;
}
export interface IPageProps {
  params: { id: string };
  searchParams: {};
}

export interface INavLink {
  title: string;
  url: string;
  icon: LucideIcon;
  isActive?: boolean;
  items?: {
    title: string;
    url: string;
  }[];
}
export type IActionType = "delete" | "update" | "view" | "";

