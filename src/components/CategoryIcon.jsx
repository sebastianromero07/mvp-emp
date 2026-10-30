import React from 'react';
import { Utensils, Car, Film, ShieldAlert, Wallet, Sparkles } from 'lucide-react';

export function CategoryIcon({ iconName, className = "w-5 h-5", ...props }) {
  switch (iconName) {
    case 'Utensils':
      return <Utensils className={className} {...props} />;
    case 'Car':
      return <Car className={className} {...props} />;
    case 'Film':
      return <Film className={className} {...props} />;
    case 'ShieldAlert':
      return <ShieldAlert className={className} {...props} />;
    default:
      return <Wallet className={className} {...props} />;
  }
}
