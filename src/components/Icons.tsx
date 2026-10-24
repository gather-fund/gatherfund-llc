import type { ReactNode } from 'react';

// Line icons drawn at a 1.5px stroke in the current text colour (design system: icons).
function Icon({ size = 24, children }: { size?: number; children: ReactNode }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      {children}
    </svg>
  );
}

export const MenuIcon = () => <Icon><path d="M4 7h16M4 12h16M4 17h16" /></Icon>;
export const CloseIcon = () => <Icon><path d="M6 6l12 12M18 6L6 18" /></Icon>;
export const PlusIcon = () => <Icon><path d="M12 5v14M5 12h14" /></Icon>;
export const PersonIcon = () => <Icon><circle cx="12" cy="8" r="3.5" /><path d="M5 20a7 7 0 0 1 14 0" /></Icon>;
export const PeopleIcon = () => <Icon><circle cx="9" cy="8" r="3.5" /><path d="M2.5 20a6.5 6.5 0 0 1 13 0" /><path d="M16 4.6a3.5 3.5 0 0 1 0 6.8M18.5 14.4a6.5 6.5 0 0 1 3 5.6" /></Icon>;
export const TargetIcon = () => <Icon><circle cx="12" cy="12" r="9" /><circle cx="12" cy="12" r="5" /><circle cx="12" cy="12" r="1" /></Icon>;
export const TrendIcon = () => <Icon><path d="M3 17l6-6 4 4 8-8" /><path d="M15 7h6v6" /></Icon>;
export const ArrowUpRightIcon = () => <Icon size={18}><path d="M7 17L17 7" /><path d="M8 7h9v9" /></Icon>;
export const ChevronLeftIcon = ({ size = 18 }: { size?: number }) => <Icon size={size}><path d="M15 6l-6 6 6 6" /></Icon>;
export const ChevronRightIcon = () => <Icon size={18}><path d="M9 6l6 6-6 6" /></Icon>;
export const ErrorIcon = () => <Icon size={16}><circle cx="12" cy="12" r="9" /><path d="M12 7.5v5M12 16.5v.01" /></Icon>;
