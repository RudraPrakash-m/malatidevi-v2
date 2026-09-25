import React from "react";
import type { ButtonProps, ButtonAction, ButtonVariant, ButtonSize } from "./button.types";
import { baseButtonStyle, buttonVariants, buttonSizes } from "./button.styles";
import {
  Loader2,
  Filter,
  RotateCcw,
  X,
  Check,
  RefreshCw,
  Plus,
  ArrowLeft,
  Download,
  Trash2,
  CheckCircle2,
  XCircle,
  Send,
  Eye,
  Search,
  Forward,
  Pencil,
  Info,
  AlertTriangle,
  AlertCircle,
} from "lucide-react";

const actionLabelMap: Record<string, string> = {
  submit: "Submit",
  save: "Save Changes",
  update: "Update",
  approve: "Approve",
  reject: "Reject",
  cancel: "Cancel",
  reset: "Reset",
  back: "Back",
};

const getButtonType = (
  type?: "button" | "submit" | "reset",
  action?: ButtonAction
): "button" | "submit" | "reset" => {
  if (type) return type;
  if (action === "submit") return "submit";
  if (action === "reset") return "reset";
  return "button";
};

const getIconSize = (size?: ButtonSize): number => {
  if (size === "sm") return 14;
  if (size === "lg") return 18;
  return 16;
};

const getAutoIcon = (
  action?: string,
  labelText?: string,
  iconSize: number = 15
): React.ReactNode | null => {
  const text = (labelText || "").trim().toLowerCase();
  const act = (action || "").toLowerCase();

  if (act === "reset" || text === "reset" || text.includes("reset") || text === "clear selection") {
    return <RotateCcw size={iconSize} />;
  }
  if (act === "cancel" || text === "cancel" || text === "close") {
    return <X size={iconSize} />;
  }
  if (act === "filter" || text === "filter" || text.includes("filter")) {
    return <Filter size={iconSize} />;
  }
  if (act === "back" || text === "back" || text.includes("back")) {
    return <ArrowLeft size={iconSize} />;
  }
  if (act === "approve" || text.includes("approve")) {
    return <CheckCircle2 size={iconSize} />;
  }
  if (act === "reject" || text.includes("reject")) {
    return <XCircle size={iconSize} />;
  }
  if (act === "forward" || text.includes("forward")) {
    return <Forward size={iconSize} />;
  }
  if (act === "update" || text.includes("update")) {
    return <RefreshCw size={iconSize} />;
  }
  if (act === "save" || text.includes("save")) {
    return <Check size={iconSize} />;
  }
  if (act === "submit" || text.includes("submit")) {
    return <Send size={iconSize} />;
  }
  if (act === "download" || text.includes("export") || text.includes("download")) {
    return <Download size={iconSize} />;
  }
  if (act === "delete" || text.includes("delete") || text.includes("remove")) {
    return <Trash2 size={iconSize} />;
  }
  if (act === "add" || text.startsWith("add ") || text === "add" || text.includes("create")) {
    return <Plus size={iconSize} />;
  }
  if (text === "search") {
    return <Search size={iconSize} />;
  }
  if (text === "view") {
    return <Eye size={iconSize} />;
  }
  if (text === "edit") {
    return <Pencil size={iconSize} />;
  }
  if (text === "info" || act === "info") {
    return <Info size={iconSize} />;
  }
  if (text === "warning" || act === "warning") {
    return <AlertTriangle size={iconSize} />;
  }
  if (text === "error" || act === "error") {
    return <AlertCircle size={iconSize} />;
  }

  return null;
};

export const Button: React.FC<Readonly<ButtonProps>> = ({
  label,
  action,
  variant = "primary",
  size = "md",
  loading = false,
  icon,
  iconRight,
  fullWidth = false,
  className = "",
  disabled,
  children,
  type,
  outline,
  noIcon = false,
  ...props
}) => {
  const finalLabel = label || (typeof children === "string" ? children : "") || (action ? actionLabelMap[action] : "");
  const buttonType = getButtonType(type, action);
  const iconSize = getIconSize(size);

  // Resolve effective variant with outline support
  let effectiveVariant: ButtonVariant = variant;
  const lowerLabel = String(finalLabel).trim().toLowerCase();

  if (outline) {
    if (variant === "primary") effectiveVariant = "outline-primary";
    else if (variant === "danger") effectiveVariant = "outline-danger";
    else if (variant === "error") effectiveVariant = "outline-error";
    else if (variant === "success") effectiveVariant = "outline-success";
    else if (variant === "warning") effectiveVariant = "outline-warning";
    else if (variant === "info") effectiveVariant = "outline-info";
    else if (variant === "secondary") effectiveVariant = "outline-secondary";
    else effectiveVariant = "outline";
  } else if (action === "cancel" || lowerLabel === "cancel") {
    // Cancel buttons automatically use outline style
    effectiveVariant =
      variant === "danger"
        ? "outline-danger"
        : variant === "secondary"
        ? "outline-secondary"
        : variant.startsWith("outline")
        ? variant
        : "outline-danger";
  } else if (action === "reset" || lowerLabel === "reset" || lowerLabel === "clear selection") {
    // Reset buttons automatically use outline style
    effectiveVariant = "outline";
  } else if (action === "back" || lowerLabel === "back" || lowerLabel === "go back") {
    // Back buttons automatically use outline style across all pages
    effectiveVariant = "outline";
  }

  // Determine icon
  const resolvedIcon =
    icon !== undefined
      ? icon
      : !noIcon
      ? getAutoIcon(action, typeof finalLabel === "string" ? finalLabel : undefined, iconSize)
      : null;

  // Helper to safely render icon whether passed as element or component
  const renderIconNode = (iconNode: any, sz: number) => {
    if (!iconNode) return null;
    if (React.isValidElement(iconNode)) {
      return iconNode;
    }
    if (
      typeof iconNode === "function" ||
      (typeof iconNode === "object" && iconNode !== null && "$$typeof" in iconNode)
    ) {
      const IconComponent = iconNode;
      return <IconComponent size={sz} />;
    }
    return iconNode;
  };

  return (
    <button
      type={buttonType}
      className={`
        ${baseButtonStyle}
        ${buttonVariants[effectiveVariant] || buttonVariants.primary}
        ${buttonSizes[size] || buttonSizes.md}
        ${fullWidth ? "w-full" : ""}
        ${className}
      `}
      disabled={loading || disabled}
      {...props}
    >
      {loading ? (
        <Loader2 className="animate-spin shrink-0 size-4" />
      ) : resolvedIcon ? (
        <span className="shrink-0 flex items-center">{renderIconNode(resolvedIcon, iconSize)}</span>
      ) : null}

      {(finalLabel || children) && (
        <span className="flex items-center">
          {finalLabel || children}
        </span>
      )}

      {!loading && iconRight && (
        <span className="shrink-0 flex items-center">{renderIconNode(iconRight, iconSize)}</span>
      )}
    </button>
  );
};

export { BackButton } from "./BackButton";
export type { BackButtonProps } from "./BackButton";
export default Button;
