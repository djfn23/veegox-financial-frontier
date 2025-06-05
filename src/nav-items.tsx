
import {
  HomeIcon,
  BarChart3,
  Network,
  Coins,
  Shield,
  Vote,
  TrendingUp,
  Package,
  DollarSign,
  PiggyBank,
  HandCoins,
  Info,
  BookOpen,
  HelpCircle,
  ShieldCheck,
  Link2,
  Settings
} from "lucide-react";

export const navItems = [
  {
    title: "Accueil",
    to: "/",
    icon: <HomeIcon className="h-4 w-4" />,
  },
  {
    title: "Dashboard",
    to: "/dashboard",
    icon: <BarChart3 className="h-4 w-4" />,
  },
  {
    title: "Blockchain",
    to: "/blockchain",
    icon: <Network className="h-4 w-4" />,
    subItems: [
      {
        title: "Réseaux",
        to: "/blockchain-networks",
        icon: <Link2 className="h-4 w-4" />,
      },
      {
        title: "VeegoxChain",
        to: "/veegoxchain",
        icon: <Network className="h-4 w-4" />,
      },
      {
        title: "Admin VeegoxChain",
        to: "/veegoxchain/admin",
        icon: <Settings className="h-4 w-4" />,
      }
    ]
  },
  {
    title: "Tokens",
    to: "/tokens",
    icon: <Coins className="h-4 w-4" />,
  },
  {
    title: "Staking",
    to: "/staking",
    icon: <Shield className="h-4 w-4" />,
  },
  {
    title: "Gouvernance",
    to: "/governance",
    icon: <Vote className="h-4 w-4" />,
  },
  {
    title: "Analytics",
    to: "/analytics",
    icon: <TrendingUp className="h-4 w-4" />,
  },
  {
    title: "Produits",
    to: "/products",
    icon: <Package className="h-4 w-4" />,
    subItems: [
      {
        title: "Investissement",
        to: "/investing",
        icon: <DollarSign className="h-4 w-4" />,
      },
      {
        title: "Épargne",
        to: "/savings",
        icon: <PiggyBank className="h-4 w-4" />,
      },
      {
        title: "Prêt",
        to: "/lending",
        icon: <HandCoins className="h-4 w-4" />,
      },
    ],
  },
  {
    title: "À propos",
    to: "/about",
    icon: <Info className="h-4 w-4" />,
  },
  {
    title: "Blog",
    to: "/blog",
    icon: <BookOpen className="h-4 w-4" />,
  },
  {
    title: "Aide",
    to: "/help",
    icon: <HelpCircle className="h-4 w-4" />,
  },
  {
    title: "Sécurité",
    to: "/security",
    icon: <ShieldCheck className="h-4 w-4" />,
  },
];
