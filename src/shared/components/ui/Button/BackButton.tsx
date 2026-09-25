// src/shared/components/ui/Button/BackButton.tsx
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { Button } from './index';
import type { ButtonProps } from './button.types';

export interface BackButtonProps extends Omit<ButtonProps, 'action'> {
  to?: string;
  fallbackTo?: string;
}

export const BackButton: React.FC<BackButtonProps> = ({
  label = 'Back',
  variant = 'outline',
  size = 'md',
  icon,
  onClick,
  to,
  fallbackTo,
  type = 'button',
  className = '',
  ...props
}) => {
  const navigate = useNavigate();

  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (onClick) {
      onClick(e);
      return;
    }
    if (to) {
      navigate(to);
      return;
    }
    if (window.history.length > 1) {
      navigate(-1);
    } else if (fallbackTo) {
      navigate(fallbackTo);
    } else {
      navigate(-1);
    }
  };

  return (
    <Button
      type={type}
      variant={variant}
      size={size}
      label={label}
      icon={icon !== undefined ? icon : <ArrowLeft size={size === 'sm' ? 14 : 16} />}
      onClick={handleClick}
      className={className}
      {...props}
    />
  );
};

export default BackButton;
