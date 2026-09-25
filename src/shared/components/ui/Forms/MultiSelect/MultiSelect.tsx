import React, { useState, useRef, useEffect, useMemo } from "react";
import ReactDOM from "react-dom";
import { Search, ChevronDown, Check } from "lucide-react";
import { inputBase, inputNormal, inputError, inputDisabled, dropdownMenuBase } from "../inputStyles";
import type { Option } from "../form.types";

interface MultiSelectProps {
    label?: string;
    options: Option[];
    value: (string | number)[];
    onChange: (values: (string | number)[]) => void;
    error?: string;
    helpText?: string;
    placeholder?: string;
    disabled?: boolean;
    required?: boolean;
    maxSelected?: number;
    wrapperClassName?: string;
    labelClassName?: string;
    errorClassName?: string;
    id?: string;
    name?: string;
}

const MultiSelect: React.FC<Readonly<MultiSelectProps>> = ({
    label,
    options = [],
    value = [],
    onChange,
    error,
    helpText,
    placeholder = "Select options...",
    disabled = false,
    required = false,
    maxSelected,
    wrapperClassName = "",
    labelClassName = "",
    errorClassName = "",
    id,
    name,
}) => {
    const [isOpen, setIsOpen] = useState(false);
    const [searchTerm, setSearchTerm] = useState("");
    const [dropdownPosition, setDropdownPosition] = useState<{ top: number; left: number; width: number } | null>(null);
    const wrapperRef = useRef<HTMLDivElement>(null);
    const dropdownRef = useRef<HTMLDivElement>(null);
    const inputRef = useRef<HTMLInputElement>(null);
    const inputId = id || (name ? `multiselect-${name}` : "multiselect-field");

    const containerClasses = [
        inputBase,
        error ? inputError : inputNormal,
        disabled ? inputDisabled : "cursor-pointer hover:bg-card-bg/80",
        "flex items-center justify-between gap-2 h-[38px] w-full text-left",
    ].join(" ");

    const filteredOptions = useMemo(
        () => options.filter((opt) => opt.label.toLowerCase().includes(searchTerm.toLowerCase())),
        [options, searchTerm]
    );

    const selectedOptions = useMemo(
        () => options.filter((opt) => value.includes(opt.value)),
        [options, value]
    );

    const handleSelect = (val: string | number) => {
        if (disabled) return;
        if (value.includes(val)) {
            onChange(value.filter((v) => v !== val));
        } else {
            if (maxSelected && value.length >= maxSelected) return;
            onChange([...value, val]);
        }
    };

    const handleSelectAll = () => {
        if (disabled) return;
        const allFilteredValues = filteredOptions.map((opt) => opt.value);
        const isAllSelected = allFilteredValues.length > 0 && allFilteredValues.every((val) => value.includes(val));

        if (isAllSelected) {
            onChange(value.filter((v) => !allFilteredValues.includes(v)));
        } else {
            const newValues = [...value];
            for (const val of allFilteredValues) {
                if (!newValues.includes(val)) {
                    if (maxSelected && newValues.length >= maxSelected) break;
                    newValues.push(val);
                }
            }
            onChange(newValues);
        }
    };

    useEffect(() => {
        const updatePosition = () => {
            if (isOpen && wrapperRef.current) {
                const rect = wrapperRef.current.getBoundingClientRect();
                setDropdownPosition({
                    top: rect.bottom,
                    left: rect.left,
                    width: rect.width,
                });
            } else {
                setDropdownPosition(null);
            }
        };

        updatePosition();
        window.addEventListener("resize", updatePosition);
        window.addEventListener("scroll", updatePosition);

        const handleClickOutside = (e: MouseEvent) => {
            const target = e.target as Node;
            if (
                wrapperRef.current &&
                !wrapperRef.current.contains(target) &&
                dropdownRef.current &&
                !dropdownRef.current.contains(target)
            ) {
                setIsOpen(false);
                setSearchTerm("");
            }
        };
        document.addEventListener("mousedown", handleClickOutside);

        return () => {
            window.removeEventListener("resize", updatePosition);
            window.removeEventListener("scroll", updatePosition);
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [isOpen]);

    useEffect(() => {
        if (isOpen) {
            const timer = setTimeout(() => inputRef.current?.focus(), 50);
            return () => clearTimeout(timer);
        }
    }, [isOpen]);

    const renderSelection = () => {
        if (selectedOptions.length === 0) {
            return <span className="text-muted-foreground text-[13px] truncate">{placeholder}</span>;
        }
        if (selectedOptions.length <= 2) {
            return (
                <span className="text-input-text font-medium text-[13px] truncate">
                    {selectedOptions.map((o) => o.label).join(", ")}
                </span>
            );
        }
        return (
            <span className="text-input-text font-medium text-[13px] truncate">
                {selectedOptions.length} items selected
            </span>
        );
    };

    const isAllSelected =
        filteredOptions.length > 0 &&
        filteredOptions.every((opt) => value.includes(opt.value));

    const dropdownPortal =
        isOpen && !disabled && dropdownPosition && typeof document !== "undefined"
            ? ReactDOM.createPortal(
                  <div
                      ref={dropdownRef}
                      role="listbox"
                      className={`fixed z-[99999] mt-1 ${dropdownMenuBase} border border-slate-200 dark:border-slate-700 shadow-2xl rounded-lg max-h-72 overflow-hidden flex flex-col`}
                      style={{
                          top: dropdownPosition.top,
                          left: dropdownPosition.left,
                          minWidth: Math.max(dropdownPosition.width, 220),
                          maxWidth: "calc(100vw - 32px)",
                      }}
                  >
                      {/* Search Input Header */}
                      <div className="p-2 bg-slate-50/90 dark:bg-slate-800/90 flex-shrink-0 border-b border-slate-200 dark:border-slate-700">
                          <div className="relative">
                              <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
                              <input
                                  ref={inputRef}
                                  type="text"
                                  value={searchTerm}
                                  onChange={(e) => setSearchTerm(e.target.value)}
                                  placeholder="Search items..."
                                  className="w-full pl-8 pr-3 py-1 text-xs bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-md outline-none focus:border-primary focus:ring-1 focus:ring-primary/20 text-gray-900 dark:text-gray-100 placeholder:text-muted-foreground"
                              />
                          </div>
                      </div>

                      {/* Options List */}
                      <div className="overflow-y-auto flex-1 py-1 bg-white dark:bg-slate-900">
                          {filteredOptions.length > 0 && (
                              <button
                                  type="button"
                                  className="w-full text-left px-3 py-2 text-xs flex items-center gap-2.5 cursor-pointer hover:bg-slate-100 dark:hover:bg-slate-800/80 text-slate-800 dark:text-slate-200 font-semibold border-b border-slate-100 dark:border-slate-800 mb-1 transition-colors"
                                  onClick={handleSelectAll}
                              >
                                  <div
                                      className={`w-4 h-4 rounded border flex items-center justify-center transition-all ${
                                          isAllSelected
                                              ? "bg-primary border-primary text-white"
                                              : "border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800"
                                      }`}
                                  >
                                      {isAllSelected && <Check size={11} strokeWidth={3} />}
                                  </div>
                                  <span>Select All</span>
                              </button>
                          )}

                          {filteredOptions.length ? (
                              filteredOptions.map((opt) => {
                                  const isSelected = value.includes(opt.value);
                                  return (
                                      <button
                                          type="button"
                                          key={String(opt.value)}
                                          role="option"
                                          aria-selected={isSelected}
                                          className={`w-full text-left px-3 py-2 text-xs flex items-center gap-2.5 cursor-pointer transition-colors ${
                                              isSelected
                                                  ? "bg-primary/10 text-primary font-medium"
                                                  : "text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800/60"
                                          }`}
                                          onClick={() => handleSelect(opt.value)}
                                      >
                                          <div
                                              className={`w-4 h-4 rounded border flex items-center justify-center transition-all shrink-0 ${
                                                  isSelected
                                                      ? "bg-primary border-primary text-white"
                                                      : "border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800"
                                              }`}
                                          >
                                              {isSelected && <Check size={11} strokeWidth={3} />}
                                          </div>
                                          <span className="truncate">{opt.label}</span>
                                      </button>
                                  );
                              })
                          ) : (
                              <div className="px-3 py-4 text-center text-xs text-muted-foreground">
                                  No options found
                              </div>
                          )}
                      </div>
                  </div>,
                  document.body
              )
            : null;

    return (
        <div className={wrapperClassName} ref={wrapperRef}>
            {label && (
                <label
                    htmlFor={inputId}
                    className={`block text-[13px] font-medium text-foreground mb-1.5 leading-none ${labelClassName}`}
                >
                    {label}
                    {required && <span className="text-red-500 ml-1">*</span>}
                    {maxSelected && (
                        <span className="ml-2 text-xs text-muted-foreground">
                            (Max {maxSelected})
                        </span>
                    )}
                </label>
            )}

            <div className="relative">
                <button
                    type="button"
                    id={inputId}
                    name={name}
                    className={containerClasses}
                    onClick={() => {
                        if (disabled) return;
                        setIsOpen((prev) => {
                            if (prev) setSearchTerm("");
                            return !prev;
                        });
                    }}
                    disabled={disabled}
                    aria-haspopup="listbox"
                    aria-expanded={isOpen}
                >
                    <div className="flex-1 overflow-hidden min-h-[20px] flex items-center text-sm">
                        {renderSelection()}
                    </div>
                    <ChevronDown
                        className={`w-4 h-4 text-muted-foreground transition-transform duration-150 shrink-0 ${
                            isOpen ? "rotate-180" : ""
                        }`}
                    />
                </button>

                {dropdownPortal}
            </div>

            {helpText && !error && (
                <p className="mt-1.5 text-[12px] text-gray-500 leading-none">{helpText}</p>
            )}
            {error && (
                <p
                    className={`mt-1.5 text-[12px] font-medium text-red-600 leading-none ${errorClassName}`}
                    role="alert"
                >
                    {error}
                </p>
            )}
        </div>
    );
};

export default MultiSelect;
