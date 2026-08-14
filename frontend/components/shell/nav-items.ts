import {
  LayoutDashboard,
  ListChecks,
  Map,
  Network,
  Wallet,
  MessageSquareText,
  History,
  type LucideIcon,
} from "lucide-react";

export interface NavItem {
  href: string;
  label: string;
  icon: LucideIcon;
}

export const NAV_ITEMS: NavItem[] = [
  { href: "/", label: "Command overview", icon: LayoutDashboard },
  { href: "/actions", label: "Action board", icon: ListChecks },
  { href: "/map", label: "Impact map", icon: Map },
  { href: "/cascade", label: "Cascade & resources", icon: Network },
  { href: "/budget", label: "Budget planner", icon: Wallet },
  { href: "/alerts", label: "Alert composer", icon: MessageSquareText },
  { href: "/audit", label: "Audit timeline", icon: History },
];
