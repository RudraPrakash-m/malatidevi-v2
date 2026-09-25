// src/features/dswo/components/DswoFilterBar.tsx

import React from 'react';
import { Filter, RotateCcw } from 'lucide-react';
import Card from '@/shared/components/layout/Card';
import Select from '@/shared/components/ui/Forms/Select';
import Button from '@/shared/components/ui/Button';
import type { CheckFilterParams } from '@/features/shared';

export interface DswoFilterBarProps {
  filters: CheckFilterParams;
  onChange: (filters: CheckFilterParams) => void;
  onApply: () => void;
  onReset: () => void;
}

const FY_OPTIONS = [
  { label: 'All Financial Years', value: 'all' },
  { label: '2025-26', value: '2025-26' },
  { label: '2026-27', value: '2026-27' },
  { label: '2027-28', value: '2027-28' },
];

const PHASE_OPTIONS = [
  { label: 'All Phases', value: 'all' },
  { label: 'Phase 1', value: 'Phase 1' },
  { label: 'Phase 2', value: 'Phase 2' },
];

const PROJECT_OPTIONS = [
  { label: 'All Projects', value: 'all' },
  { label: 'Project 1', value: 'Project 1' },
  { label: 'Project 2', value: 'Project 2' },
  { label: 'Project 3', value: 'Project 3' },
];

export const DswoFilterBar: React.FC<DswoFilterBarProps> = ({
  filters,
  onChange,
  onApply,
  onReset,
}) => {
  return (
    <Card title="SHG Verification Filters" icon={Filter}>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3 items-end">
        <Select
          label="Financial Year"
          options={FY_OPTIONS}
          value={filters.financialYear || 'all'}
          onChange={(e) => onChange({ ...filters, financialYear: e.target.value })}
        />

        <Select
          label="Phase"
          options={PHASE_OPTIONS}
          value={filters.phase || 'all'}
          onChange={(e) => onChange({ ...filters, phase: e.target.value })}
        />

        <Select
          label="Project"
          options={PROJECT_OPTIONS}
          value={filters.project || 'all'}
          onChange={(e) => onChange({ ...filters, project: e.target.value })}
        />

        <div className="flex items-center gap-2">
          <Button
            type="button"
            variant="primary"
            size="md"
            label="Apply Filter"
            onClick={onApply}
          />
          <Button
            type="button"
            variant="outline"
            size="md"
            label="Reset"
            icon={<RotateCcw size={14} />}
            onClick={onReset}
          />
        </div>
      </div>
    </Card>
  );
};

export default DswoFilterBar;
