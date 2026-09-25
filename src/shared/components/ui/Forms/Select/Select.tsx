import React, { forwardRef } from "react";
import { SearchableSelect } from "../SearchableSelect/SearchableSelect";
import type { Option } from "../form.types";

export interface SelectProps extends Omit<React.SelectHTMLAttributes<HTMLSelectElement>, "onChange" | "value"> {
    label?: string;
    options: Option[];
    value?: string | number;
    error?: string;
    helpText?: string;
    placeholder?: string;
    wrapperClassName?: string;
    labelClassName?: string;
    selectClassName?: string;
    errorClassName?: string;
    disabled?: boolean;
    required?: boolean;
    id?: string;
    name?: string;
    onChange?: (e: React.ChangeEvent<HTMLSelectElement>) => void;
}

const Select = forwardRef<HTMLDivElement, SelectProps>(
    (
        {
            label,
            options,
            value = "",
            error,
            helpText,
            placeholder = "Select an option",
            wrapperClassName = "",
            labelClassName = "",
            errorClassName = "",
            disabled = false,
            required = false,
            id,
            name,
            onChange,
        },
        ref
    ) => {
        const selectId = id || `select-${name || "field"}`;

        const handleChange = (selectedVal: string | number) => {
            if (onChange) {
                const syntheticEvent = {
                    target: {
                        name: name || "",
                        value: String(selectedVal),
                        id: selectId,
                    },
                    currentTarget: {
                        name: name || "",
                        value: String(selectedVal),
                        id: selectId,
                    },
                } as unknown as React.ChangeEvent<HTMLSelectElement>;
                onChange(syntheticEvent);
            }
        };

        return (
            <div ref={ref} className="w-full">
                <SearchableSelect
                    id={selectId}
                    label={label}
                    options={options}
                    value={value}
                    onChange={handleChange}
                    error={error}
                    helpText={helpText}
                    placeholder={placeholder}
                    disabled={disabled}
                    required={required}
                    wrapperClassName={wrapperClassName}
                    labelClassName={labelClassName}
                    errorClassName={errorClassName}
                />
            </div>
        );
    }
);

Select.displayName = "Select";
export default Select;
