import React, { forwardRef } from "react";
import { inputBase, inputNormal, inputError, inputDisabled } from "../inputStyles";

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
    label?: string;
    error?: string;
    helpText?: string;
    wrapperClassName?: string;
    labelClassName?: string;
    errorClassName?: string;
    icon?: React.ReactNode;
}

const ALLOWED_NAV_KEYS = new Set([
    "Backspace",
    "Delete",
    "Tab",
    "Escape",
    "Enter",
    "ArrowLeft",
    "ArrowRight",
    "Home",
    "End",
]);

const Input = forwardRef<HTMLInputElement, Readonly<InputProps>>(
    ({ label, error, disabled, required, helpText, id, wrapperClassName = "", labelClassName = "", errorClassName = "", type, maxLength, icon, className = "", onKeyDown, ...props }, ref) => {
        const inputId = id || `input-${props.name || "field"}`;

        const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
            if (type === "tel") {
                const isNavKey = ALLOWED_NAV_KEYS.has(e.key);
                if (!isNavKey && !/^\d$/.test(e.key)) {
                    e.preventDefault();
                    return;
                }
                if (maxLength && e.currentTarget.value.length >= maxLength && !isNavKey) {
                    e.preventDefault();
                    return;
                }
            }
            onKeyDown?.(e);
        };

        const handleInput = (e: React.SyntheticEvent<HTMLInputElement>) => {
            if (type === "tel" && maxLength) {
                const el = e.currentTarget;
                const cleaned = el.value.replace(/\D/g, "").slice(0, maxLength);
                if (el.value !== cleaned) {
                    el.value = cleaned;
                }
            }
        };

        return (
            <div className={wrapperClassName}>
                {label && (
                    <label htmlFor={inputId} className={`block text-[13px] font-medium text-foreground mb-1.5 leading-none ${labelClassName}`}>
                        {label}{required && <span className="text-red-500 ml-1">*</span>}
                    </label>
                )}
                <div className="relative flex items-center">
                    {icon && (
                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none flex items-center justify-center z-10">
                            {icon}
                        </span>
                    )}
                    <input
                        ref={ref}
                        id={inputId}
                        type={type}
                        maxLength={maxLength}
                        {...props}
                        disabled={disabled}
                        onKeyDown={handleKeyDown}
                        onInput={handleInput}
                        className={[
                            inputBase,
                            error ? inputError : inputNormal,
                            disabled ? inputDisabled : "",
                            "h-[38px]",
                            icon ? "!pl-9" : "",
                            className,
                        ].filter(Boolean).join(" ")}
                    />
                </div>
                {helpText && !error && <p className="mt-1.5 text-[12px] text-gray-500 leading-none">{helpText}</p>}
                {error && <p className={`mt-1.5 text-[12px] font-medium text-red-600 leading-none ${errorClassName}`} role="alert">{error}</p>}
            </div>
        );
    }
);

Input.displayName = "Input";
export default Input;
