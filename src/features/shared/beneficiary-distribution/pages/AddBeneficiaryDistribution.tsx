// src/features/shared/beneficiary-distribution/pages/AddBeneficiaryDistribution.tsx
import React, { useState, useMemo } from 'react';
import { Filter, RotateCcw } from 'lucide-react';
import Card from '@/shared/components/layout/Card';
import Select from '@/shared/components/ui/Forms/Select';
import DatePicker from '@/shared/components/ui/Forms/DatePicker';
import Button from '@/shared/components/ui/Button';
import { BeneficiaryDistributionList, INITIAL_DATA } from './BeneficiaryDistributionList';

interface DistributionFilterParams {
  startDate: string;
  endDate: string;
  project: string;
  sector: string;
  anganwadiCentre: string;
}

const DEFAULT_FILTERS: DistributionFilterParams = {
  startDate: '',
  endDate: '',
  project: '',
  sector: '',
  anganwadiCentre: '',
};

const PROJECT_OPTIONS = [
  { label: 'All Projects', value: '' },
  { label: 'Hemgir', value: 'hemgir' },
  { label: 'Balisankara', value: 'balisankara' },
  { label: 'Biramitrapur', value: 'biramitrapur' },
  { label: 'Kutra', value: 'kutra' },
];

const SECTOR_OPTIONS = [
  { label: 'All Sectors', value: '' },
  { label: 'Hemgir', value: 'hemgir' },
  { label: 'Balisankara', value: 'balisankara' },
  { label: 'Kutra', value: 'kutra' },
  { label: 'Lephripara', value: 'lephripara' },
];

const AWC_OPTIONS = [
  { label: 'All Anganwadi Centers', value: '' },
  { label: 'Nugaon AWC', value: 'nugaon' },
  { label: 'Kuchinda AWC', value: 'kuchinda' },
  { label: 'Rengali AWC', value: 'rengali' },
  { label: 'Talpada AWC', value: 'talpada' },
  { label: 'Barkote AWC', value: 'barkote' },
  { label: 'AWC Hemgir-01', value: 'awc_hemgir_01' },
  { label: 'AWC Hemgir-02', value: 'awc_hemgir_02' },
  { label: 'AWC Hemgir-03', value: 'awc_hemgir_03' },
  { label: 'AWC Hemgir-04', value: 'awc_hemgir_04' },
];

const parseDateToTimestamp = (dateStr: string): number | null => {
  if (!dateStr) return null;
  if (dateStr.includes('/')) {
    const parts = dateStr.split('/');
    if (parts.length === 3) {
      const day = parseInt(parts[0], 10);
      const month = parseInt(parts[1], 10);
      const year = parseInt(parts[2], 10);
      if (!isNaN(day) && !isNaN(month) && !isNaN(year)) {
        return new Date(year, month - 1, day).getTime();
      }
    }
  }
  if (dateStr.includes('-')) {
    const parts = dateStr.split('-');
    if (parts.length === 3) {
      const year = parseInt(parts[0], 10);
      const month = parseInt(parts[1], 10);
      const day = parseInt(parts[2], 10);
      if (!isNaN(day) && !isNaN(month) && !isNaN(year)) {
        return new Date(year, month - 1, day).getTime();
      }
    }
  }
  const timestamp = new Date(dateStr).getTime();
  return isNaN(timestamp) ? null : timestamp;
};

export const AddBeneficiaryDistribution: React.FC = () => {
  const [filterValues, setFilterValues] = useState<DistributionFilterParams>(DEFAULT_FILTERS);
  const [appliedFilters, setAppliedFilters] = useState<DistributionFilterParams>(DEFAULT_FILTERS);

  const handleApplyFilter = () => {
    setAppliedFilters({ ...filterValues });
  };

  const handleResetFilter = () => {
    setFilterValues(DEFAULT_FILTERS);
    setAppliedFilters(DEFAULT_FILTERS);
  };

  const filteredData = useMemo(() => {
    return INITIAL_DATA.filter((item) => {
      if (appliedFilters.startDate) {
        const startTimestamp = parseDateToTimestamp(appliedFilters.startDate);
        const itemTimestamp = parseDateToTimestamp(item.eventDate);
        if (startTimestamp !== null && itemTimestamp !== null && itemTimestamp < startTimestamp) {
          return false;
        }
      }

      if (appliedFilters.endDate) {
        const endTimestamp = parseDateToTimestamp(appliedFilters.endDate);
        const itemTimestamp = parseDateToTimestamp(item.eventDate);
        if (endTimestamp !== null && itemTimestamp !== null && itemTimestamp > endTimestamp) {
          return false;
        }
      }

      if (appliedFilters.project && appliedFilters.project !== 'all') {
        const itemProject = (item.project || '').toLowerCase().replace(/[^a-z0-9]/g, '');
        const filterProject = appliedFilters.project.toLowerCase().replace(/[^a-z0-9]/g, '');
        if (!itemProject.includes(filterProject) && !filterProject.includes(itemProject)) {
          return false;
        }
      }

      if (appliedFilters.sector && appliedFilters.sector !== 'all') {
        const itemSector = (item.sector || '').toLowerCase().replace(/[^a-z0-9]/g, '');
        const filterSector = appliedFilters.sector.toLowerCase().replace(/[^a-z0-9]/g, '');
        if (!itemSector.includes(filterSector) && !filterSector.includes(itemSector)) {
          return false;
        }
      }

      if (appliedFilters.anganwadiCentre && appliedFilters.anganwadiCentre !== 'all') {
        const itemAwc = (item.anganwadiCentre || '').toLowerCase().replace(/[^a-z0-9]/g, '');
        const filterAwc = appliedFilters.anganwadiCentre.toLowerCase().replace(/[^a-z0-9]/g, '');
        if (!itemAwc.includes(filterAwc) && !filterAwc.includes(itemAwc)) {
          return false;
        }
      }

      return true;
    });
  }, [appliedFilters]);

  return (
    <div className="space-y-6">
      {/* Filter Card */}
      <Card title="Filter Beneficiary Distribution" icon={Filter}>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-12 gap-4 items-end">
          {/* Start Date */}
          <div className="col-span-12 sm:col-span-6 lg:col-span-2">
            <DatePicker
              id="filter-start-date"
              name="startDate"
              label="Start Date"
              placeholder="DD/MM/YYYY"
              value={filterValues.startDate}
              onChange={(e) =>
                setFilterValues((prev) => ({
                  ...prev,
                  startDate: e.target.value,
                }))
              }
            />
          </div>

          {/* End Date */}
          <div className="col-span-12 sm:col-span-6 lg:col-span-2">
            <DatePicker
              id="filter-end-date"
              name="endDate"
              label="End Date"
              placeholder="DD/MM/YYYY"
              value={filterValues.endDate}
              onChange={(e) =>
                setFilterValues((prev) => ({
                  ...prev,
                  endDate: e.target.value,
                }))
              }
            />
          </div>

          {/* Project */}
          <div className="col-span-12 sm:col-span-6 lg:col-span-2">
            <Select
              id="filter-project"
              name="project"
              label="Project"
              placeholder="Select Project"
              options={PROJECT_OPTIONS}
              value={filterValues.project}
              onChange={(e) =>
                setFilterValues((prev) => ({
                  ...prev,
                  project: e.target.value,
                }))
              }
            />
          </div>

          {/* Sector */}
          <div className="col-span-12 sm:col-span-6 lg:col-span-2">
            <Select
              id="filter-sector"
              name="sector"
              label="Sector"
              placeholder="Select Sector"
              options={SECTOR_OPTIONS}
              value={filterValues.sector}
              onChange={(e) =>
                setFilterValues((prev) => ({
                  ...prev,
                  sector: e.target.value,
                }))
              }
            />
          </div>

          {/* Anganwadi Center */}
          <div className="col-span-12 sm:col-span-6 lg:col-span-2">
            <Select
              id="filter-anganwadi-center"
              name="anganwadiCentre"
              label="Anganwadi Center"
              placeholder="Select Anganwadi Center"
              options={AWC_OPTIONS}
              value={filterValues.anganwadiCentre}
              onChange={(e) =>
                setFilterValues((prev) => ({
                  ...prev,
                  anganwadiCentre: e.target.value,
                }))
              }
            />
          </div>

          {/* Filter & Reset Buttons */}
          <div className="col-span-12 sm:col-span-6 lg:col-span-2 flex items-center gap-2">
            <Button
              type="button"
              variant="outline-primary"
              label="Filter"
              size="md"
              icon={<Filter size={15} />}
              onClick={handleApplyFilter}
            />
            <Button
              type="button"
              variant="outline"
              label="Reset"
              size="md"
              icon={<RotateCcw size={15} />}
              onClick={handleResetFilter}
            />
          </div>
        </div>
      </Card>

      {/* Distribution Records Table */}
      <BeneficiaryDistributionList items={filteredData} />
    </div>
  );
};

export default AddBeneficiaryDistribution;
