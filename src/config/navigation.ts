import {
  BookOpen,
  Code2,
  Flame,
  Gift,
  PawPrint,
  Ticket,
  Trophy,
  type LucideIcon,
} from "lucide-react";

export const NAVIGATION_CONFIG: ReadonlyArray<{
  key: string;
  path: string;
  icon: LucideIcon;
  isContentType: boolean;
}> = [
  { key: "guide", path: "/guide", icon: BookOpen, isContentType: true },
  { key: "codes", path: "/codes", icon: Code2, isContentType: true },
  { key: "pets", path: "/pets", icon: PawPrint, isContentType: true },
  { key: "ranked", path: "/ranked", icon: Trophy, isContentType: true },
  { key: "win-streaks", path: "/win-streaks", icon: Flame, isContentType: true },
  { key: "lucky-blocks", path: "/lucky-blocks", icon: Gift, isContentType: true },
  { key: "game-passes", path: "/game-passes", icon: Ticket, isContentType: true },
];

export const CONTENT_TYPES = NAVIGATION_CONFIG.filter((item) => item.isContentType).map((item) => item.path.replace(/^\//, ""));
