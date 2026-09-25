// src/components/ui/Badge/badge.types.ts
import type { ReactNode, HTMLAttributes } from 'react';

export interface BadgeProps extends HTMLAttributes<HTMLDivElement> {
  children?: ReactNode;
  variant?: 'primary' | 'secondary' | 'outline';
  size?: 'sm' | 'md' | 'lg';
  isLoading?: boolean;
  className?: string;
}
