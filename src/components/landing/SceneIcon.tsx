import React from 'react';
import {
  Home,
  Users,
  CloudSun,
  FileSpreadsheet,
  Compass,
  ShieldCheck,
  KeyRound,
  Flame,
  LifeBuoy,
  Sparkles,
} from 'lucide-react';
import { SceneIconKey } from '../../config/scenes';

interface SceneIconProps {
  iconKey: SceneIconKey;
}

export const SceneIcon: React.FC<SceneIconProps> = ({ iconKey }) => {
  const getIconData = () => {
    switch (iconKey) {
      case 'home':
        return {
          Icon: Home,
          bg: 'bg-amber-100/90 text-amber-800',
          ring: 'ring-amber-200/50',
        };
      case 'family':
        return {
          Icon: Users,
          bg: 'bg-orange-100/90 text-orange-800',
          ring: 'ring-orange-200/50',
        };
      case 'unforeseen':
        return {
          Icon: CloudSun,
          bg: 'bg-sky-100/90 text-sky-800',
          ring: 'ring-sky-200/50',
        };
      case 'commitments':
        return {
          Icon: FileSpreadsheet,
          bg: 'bg-rose-100/90 text-rose-800',
          ring: 'ring-rose-200/50',
        };
      case 'discover':
        return {
          Icon: Compass,
          bg: 'bg-emerald-100/90 text-emerald-800',
          ring: 'ring-emerald-200/50',
        };
      case 'protect':
        return {
          Icon: ShieldCheck,
          bg: 'bg-indigo-100/90 text-indigo-800',
          ring: 'ring-indigo-200/50',
        };
      case 'guardians':
        return {
          Icon: KeyRound,
          bg: 'bg-amber-100/90 text-amber-900',
          ring: 'ring-amber-300/50',
        };
      case 'rehearse':
        return {
          Icon: Flame,
          bg: 'bg-red-100/90 text-red-800',
          ring: 'ring-red-200/50',
        };
      case 'emergency':
        return {
          Icon: LifeBuoy,
          bg: 'bg-rose-100/90 text-rose-900',
          ring: 'ring-rose-300/50',
        };
      case 'peace':
      default:
        return {
          Icon: Sparkles,
          bg: 'bg-amber-200/90 text-amber-900',
          ring: 'ring-amber-400/50',
        };
    }
  };

  const { Icon, bg, ring } = getIconData();

  return (
    <div
      key={iconKey}
      className={`w-9 h-9 rounded-2xl flex items-center justify-center shadow-md ring-2 transition-all duration-500 animate-in fade-in zoom-in-75 ${bg} ${ring}`}
    >
      <Icon className="w-5 h-5 transition-transform duration-300 hover:scale-110" />
    </div>
  );
};
