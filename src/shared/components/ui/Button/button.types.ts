import type { ButtonHTMLAttributes, ReactNode } from "react";

export type ButtonVariant =
  | "primary"
  | "secondary"
  | "success"
  | "danger"
  | "warning"
  | "info"
  | "error"
  | "dark"
  | "light"
  | "outline"
  | "outline-primary"
  | "outline-secondary"
  | "outline-success"
  | "outline-danger"
  | "outline-warning"
  | "outline-info"
  | "outline-error"
  | "ghost"
  | "soft";

export type ButtonSize = "sm" | "md" | "lg";
export type ButtonAction = "submit" | "save" | "update" | "approve" | "reject" | "cancel" | "reset" | "back";

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  label?: string;
  action?: ButtonAction;
  variant?: ButtonVariant;
  size?: ButtonSize;
  loading?: boolean;
  icon?: ReactNode;
  iconRight?: ReactNode;
  fullWidth?: boolean;
  outline?: boolean;
  noIcon?: boolean;
}
