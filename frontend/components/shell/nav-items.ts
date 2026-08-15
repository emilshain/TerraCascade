import {
  LayoutDashboard,
  Map,
  History,
  ShieldCheck,
  type LucideIcon,
} from "lucide-react";

export interface NavItem {
  href: string;
  label: string;
  icon: LucideIcon;
}

export const NAV_ITEMS: NavItem[] = [
  { href: "/", label: "Dashboard", icon: LayoutDashboard },
  { href: "/map", label: "Map", icon: Map },
  { href: "/audit", label: "Audit timeline", icon: History },
  { href: "/login", label: "Officer Sign In", icon: ShieldCheck },
];

