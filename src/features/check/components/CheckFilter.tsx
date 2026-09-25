// src/features/check/components/CheckFilter.tsx

import React from 'react';
import { Filter, RotateCcw } from 'lucide-react';
import Select from '@/shared/components/ui/Forms/Select';
import Button from '@/shared/components/ui/Button';
import { checkFilterConfig as wshgVerificationFormConfig } from '../form-config/checkFilterConfig';
import type { CheckFilterParams } from '../types/check.types';

interface CheckFilterProps {
  filters: CheckFilterParams;
  onChange: (filters: CheckFilterParams) => void;
  onApply: () => void;
  onReset: () => void;
}

// Maps field.gridColumn dynamically to responsive Tailwind grid column span classes
const getColSpanClass = (gridCol?: number): string => {
  switch (gridCol) {
    case 1:
      return 'col-span-12 sm:col-span-6 lg:col-span-1';
    case 2:
      return 'col-span-12 sm:col-span-6 lg:col-span-2';
    case 3:
      return 'col-span-12 sm:col-span-6 lg:col-span-3';
    case 4:
      return 'col-span-12 sm:col-span-6 lg:col-span-4';
    case 5:
      return 'col-span-12 sm:col-span-6 lg:col-span-5';
    case 6:
      return 'col-span-12 sm:col-span-6 lg:col-span-6';
    case 12:
      return 'col-span-12';
    default:
      return 'col-span-12 sm:col-span-6 lg:col-span-2';
  }
};

export const CheckFilter: React.FC<CheckFilterProps> = ({
  filters,
  onChange,
  onApply,
  onReset,
}) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-12 gap-4 items-end">
      {/* Dynamic Select Fields directly driven by wshgVerificationFormConfig & field.gridColumn */}
      {wshgVerificationFormConfig.map((field) => {
        const fieldName = field.name as keyof CheckFilterParams;
        const value = filters[fieldName] ?? '';
        const colClass = getColSpanClass(field.gridColumn);

        return (
          <div key={field.name} className={colClass}>
            <Select
              id={`filter-${field.name}`}
              name={field.name}
              label={field.label}
              required={field.required ?? true}
              placeholder={field.placeholder || `Select ${field.label}`}
              options={(field.options || []).map((opt) => ({
                label: opt.label,
                value: String(opt.value),
              }))}
              value={value}
              onChange={(e) =>
                onChange({
                  ...filters,
                  [fieldName]: e.target.value,
                })
              }
            />
          </div>
        );
      })}

      {/* Filter and Reset Buttons using common icons */}
      <div className="col-span-12 sm:col-span-6 lg:col-span-2 flex items-center gap-2">
        <Button
          type="button"
          variant="outline-primary"
          label="Filter"
          size="md"
          icon={<Filter size={15} />}
          onClick={onApply}
        />
        <Button
          type="button"
          variant="outline"
          label="Reset"
          size="md"
          icon={<RotateCcw size={15} />}
          onClick={onReset}
        />
      </div>
    </div>
  );
};

export default CheckFilter;
