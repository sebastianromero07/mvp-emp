import React from 'react';
import {
  Utensils,
  Car,
  Film,
  ShieldAlert,
  GraduationCap,
  Heart,
  Home,
  ShoppingBag,
  Laptop,
  Plane,
  Coffee,
  Sparkles,
  Wallet,
} from 'lucide-react';

const ICON_MAP = {
  Utensils,
  Car,
  Film,
  ShieldAlert,
  GraduationCap,
  Heart,
  Home,
  ShoppingBag,
  Laptop,
  Plane,
  Coffee,
  Sparkles,
  Wallet,
};

export function CategoryIcon({ iconName, className = "w-5 h-5", ...props }) {
  const IconComponent = ICON_MAP[iconName] || Wallet;
  return <IconComponent className={className} {...props} />;
}
