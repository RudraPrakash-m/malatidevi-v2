// src/features/shared/beneficiary-distribution/pages/AddBeneficiaryDistribution.tsx

import React, { useState, useMemo, useCallback } from 'react';
import type { MRT_ColumnDef } from 'material-react-table';
import { Filter, RotateCcw, Layers } from 'lucide-react';

import Card from '@/shared/components/layout/Card';
import Select from '@/shared/components/ui/Forms/Select';
import DatePicker from '@/shared/components/ui/Forms/DatePicker';
import Button from '@/shared/components/ui/Button';
import { ReusableTable } from '@/shared/components/ui/Table';
import ActionButtons from '@/shared/components/ui/Actions/ActionButtons';
import type { ActionType } from '@/shared/components/ui/Actions/action.types';
import Modal from '@/shared/components/ui/Modal/Modal';

import type { BeneficiaryDistributionItem } from '../types/beneficiary-distribution.types';
import child1 from '@/assets/images/anganwadi/child-1.jpg';
import child2 from '@/assets/images/anganwadi/child-2.jpg';
import child3 from '@/assets/images/anganwadi/child-3.jpg';
import child4 from '@/assets/images/anganwadi/child-4.jpg';
import child5 from '@/assets/images/anganwadi/child-5.jpg';

const ANGANWADI_CHILD_PHOTOS = [child1, child2, child3, child4, child5];

export const INITIAL_DATA: BeneficiaryDistributionItem[] = [
  {
    id: '1',
    eventDate: '20/09/2026',
    project: 'Hemgir',
    sector: 'Hemgir',
    anganwadiCentre: 'Nugaon AWC',
    villageWard: 'Nugaon',
    totalEligible: 28,
    selectedChildren: 12,
    shoes: 12,
    sweaters: 10,
    uniforms: 12,
    eventPhoto: child1,
    status: 'Pending Review',
  },
  {
    id: '2',
    eventDate: '14/09/2026',
    project: 'Balisankara',
    sector: 'Balisankara',
    anganwadiCentre: 'Kuchinda AWC',
    villageWard: 'Kuchinda',
    totalEligible: 20,
    selectedChildren: 15,
    shoes: 15,
    sweaters: 15,
    uniforms: 15,
    eventPhoto: child2,
    status: 'Pending Review',
  },
  {
    id: '3',
    eventDate: '14/09/2026',
    project: 'Biramitrapur',
    sector: 'Kutra',
    anganwadiCentre: 'Rengali AWC',
    villageWard: 'Rengali',
    totalEligible: 25,
    selectedChildren: 18,
    shoes: 18,
    sweaters: 16,
    uniforms: 18,
    eventPhoto: child3,
    status: 'Under Clarification',
  },
  {
    id: '4',
    eventDate: '13/09/2026',
    project: 'Kutra',
    sector: 'Lephripara',
    anganwadiCentre: 'Talpada AWC',
    villageWard: 'Talpada',
    totalEligible: 22,
    selectedChildren: 20,
    shoes: 20,
    sweaters: 18,
    uniforms: 20,
    eventPhoto: child4,
    status: 'Approved',
  },
  {
    id: '5',
    eventDate: '12/09/2026',
    project: 'Hemgir',
    sector: 'Hemgir',
    anganwadiCentre: 'Barkote AWC',
    villageWard: 'Barkote',
    totalEligible: 18,
    selectedChildren: 16,
    shoes: 16,
    sweaters: 15,
    uniforms: 16,
    eventPhoto: child5,
    status: 'Approved',
  },
];

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

const BeneficiaryDistributionStatusBadge: React.FC<{
  status?: string;
}> = ({ status }) => {
  const normalizedStatus = status?.toLowerCase();

  let className = 'bg-gray-100 text-gray-600';

  if (normalizedStatus === 'approved') {
    className = 'bg-green-100 text-green-700';
  } else if (normalizedStatus === 'pending review') {
    className = 'bg-yellow-100 text-yellow-700';
  } else if (normalizedStatus === 'under clarification') {
    className = 'bg-blue-100 text-blue-700';
  }

  return (
    <span
      className={`inline-flex items-center rounded-md px-2.5 py-1 text-xs font-medium ${className}`}
    >
      {status || 'N/A'}
    </span>
  );
};

const BeneficiaryDistributionActionCell: React.FC<{
  item: BeneficiaryDistributionItem;
  onAction: (
    action: ActionType,
    item: BeneficiaryDistributionItem,
  ) => void;
}> = ({ item, onAction }) => (
  <ActionButtons
    actions={['view']}
    toggleValue={true}
    onAction={(action) => onAction(action, item)}
  />
);

const DetailItem: React.FC<{
  label: string;
  value: React.ReactNode;
}> = ({ label, value }) => (
  <div className="border-b pb-2">
    <span className="text-xs font-semibold uppercase text-gray-500">
      {label}
    </span>
    <p className="mt-1 whitespace-pre-line text-sm font-medium text-foreground">
      {value}
    </p>
  </div>
);

export const AddBeneficiaryDistribution: React.FC = () => {
  const [filterValues, setFilterValues] = useState<DistributionFilterParams>(DEFAULT_FILTERS);
  const [appliedFilters, setAppliedFilters] = useState<DistributionFilterParams>(DEFAULT_FILTERS);
  const [selectedItem, setSelectedItem] = useState<BeneficiaryDistributionItem | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleAction = useCallback(
    (action: ActionType, row: BeneficiaryDistributionItem) => {
      if (action === 'view') {
        setSelectedItem(row);
        setIsModalOpen(true);
      }
    },
    [],
  );

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

  const columns = useMemo<MRT_ColumnDef<BeneficiaryDistributionItem>[]>(
    () => [
      {
        accessorKey: 'id',
        header: 'Sl. No',
        size: 60,
        minSize: 50,
        muiTableHeadCellProps: { align: 'center' },
        muiTableBodyCellProps: { align: 'center' },
        Cell: ({ row }) => (
          <span className="font-mono text-xs text-slate-600 dark:text-slate-400 font-medium">
            {row.index + 1}
          </span>
        ),
      },
      {
        accessorKey: 'eventDate',
        header: 'Event Date',
        size: 110,
        minSize: 95,
        muiTableHeadCellProps: { align: 'center' },
        muiTableBodyCellProps: { align: 'center' },
        Cell: ({ cell }) => (
          <span className="font-mono text-xs text-slate-700 dark:text-slate-300 font-medium">
            {cell.getValue<string>()}
          </span>
        ),
      },
      {
        accessorKey: 'anganwadiCentre',
        header: 'Anganwadi Centre',
        size: 190,
        minSize: 150,
        Cell: ({ cell }) => (
          <span className="font-semibold text-xs text-slate-900 dark:text-slate-100">
            {cell.getValue<string>()}
          </span>
        ),
      },
      {
        accessorKey: 'villageWard',
        header: 'Village / Ward',
        size: 130,
        minSize: 100,
        Cell: ({ cell }) => (
          <span className="text-xs text-slate-700 dark:text-slate-300">
            {cell.getValue<string>()}
          </span>
        ),
      },
      {
        accessorKey: 'totalEligible',
        header: 'Total Eligible',
        size: 110,
        minSize: 90,
        muiTableHeadCellProps: { align: 'right' },
        muiTableBodyCellProps: { align: 'right' },
        Cell: ({ cell }) => (
          <span className="font-mono text-xs font-semibold text-slate-700 dark:text-slate-300">
            {cell.getValue<number>()}
          </span>
        ),
      },
      {
        accessorKey: 'selectedChildren',
        header: 'Selected Children',
        size: 110,
        minSize: 90,
        muiTableHeadCellProps: { align: 'right' },
        muiTableBodyCellProps: { align: 'right' },
        Cell: ({ cell }) => (
          <span className="font-mono text-xs font-bold text-slate-800 dark:text-slate-100">
            {cell.getValue<number>()}
          </span>
        ),
      },
      {
        accessorKey: 'shoes',
        header: 'Shoes',
        size: 75,
        minSize: 60,
        muiTableHeadCellProps: { align: 'right' },
        muiTableBodyCellProps: { align: 'right' },
        Cell: ({ cell }) => (
          <span className="font-mono text-xs text-slate-700 dark:text-slate-300">
            {cell.getValue<number>()}
          </span>
        ),
      },
      {
        accessorKey: 'sweaters',
        header: 'Sweaters',
        size: 80,
        minSize: 65,
        muiTableHeadCellProps: { align: 'right' },
        muiTableBodyCellProps: { align: 'right' },
        Cell: ({ cell }) => (
          <span className="font-mono text-xs text-slate-700 dark:text-slate-300">
            {cell.getValue<number>()}
          </span>
        ),
      },
      {
        accessorKey: 'uniforms',
        header: 'Uniforms',
        size: 80,
        minSize: 65,
        muiTableHeadCellProps: { align: 'right' },
        muiTableBodyCellProps: { align: 'right' },
        Cell: ({ cell }) => (
          <span className="font-mono text-xs text-slate-700 dark:text-slate-300">
            {cell.getValue<number>()}
          </span>
        ),
      },
      {
        accessorKey: 'eventPhoto',
        header: 'Event Photo',
        size: 100,
        minSize: 90,
        muiTableHeadCellProps: { align: 'center' },
        muiTableBodyCellProps: { align: 'center' },
        Cell: ({ cell, row }) => {
          const fallbackPhoto = ANGANWADI_CHILD_PHOTOS[row.index % ANGANWADI_CHILD_PHOTOS.length];
          const imageUrl = cell.getValue<string>() || fallbackPhoto;

          return (
            <div className="flex items-center justify-center">
              <button
                type="button"
                onClick={() => handleAction('view', row.original)}
                className="group relative cursor-pointer overflow-hidden rounded-md border border-gray-200 dark:border-gray-700 shadow-2xs transition-all hover:scale-105 hover:shadow-md focus:outline-none"
                title="Click to view full photo"
              >
                <img
                  src={imageUrl}
                  alt="Anganwadi Child"
                  className="h-9 w-13 object-cover transition-transform duration-200 group-hover:scale-110"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = fallbackPhoto;
                  }}
                />
              </button>
            </div>
          );
        },
      },
      {
        accessorKey: 'action',
        header: 'Action',
        size: 80,
        minSize: 75,
        muiTableHeadCellProps: { align: 'center' },
        muiTableBodyCellProps: { align: 'center' },
        Cell: ({ row }) => (
          <div className="flex items-center justify-center">
            <BeneficiaryDistributionActionCell
              item={row.original}
              onAction={handleAction}
            />
          </div>
        ),
      },
    ],
    [handleAction]
  );

  return (
    <div className="space-y-6">
      {/* Distribution Records Table Card with Integrated Filters */}
      <Card
        title="Distribution Records"
        icon={Layers}
        action={
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-1 rounded-lg text-xs font-semibold bg-blue-50 text-blue-800 dark:bg-blue-950/60 dark:text-blue-300 border border-blue-200 dark:border-blue-800/80 shadow-2xs">
              {filteredData.length} Records Listed
            </span>
          </div>
        }
      >
        <div className="space-y-4">
          {/* Quick Filters inside Table Card */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-12 gap-4 items-end pb-3 border-b border-slate-200 dark:border-slate-800">
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

          {/* Table */}
          <ReusableTable
            columns={columns}
            data={filteredData}
            enableRowActions={false}
            enableExport={true}
            exportFileName="beneficiary-distribution_records"
          />
        </div>
      </Card>

      {/* View Details Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={
          selectedItem
            ? `Distribution Details - ${selectedItem.anganwadiCentre}`
            : 'Distribution Details'
        }
        size="2xl"
      >
        {selectedItem && (
          <div className="space-y-5 p-4">
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <DetailItem label="Sl. No." value={selectedItem.id} />
              <DetailItem label="Event Date" value={selectedItem.eventDate} />
              <DetailItem label="Anganwadi Centre" value={selectedItem.anganwadiCentre} />
              <DetailItem label="Village / Ward" value={selectedItem.villageWard} />
              <DetailItem label="Total Eligible (Ages 3-6)" value={selectedItem.totalEligible} />
              <DetailItem label="Selected Children" value={selectedItem.selectedChildren} />
              <DetailItem label="Shoes" value={selectedItem.shoes} />
              <DetailItem label="Sweaters" value={selectedItem.sweaters} />
              <DetailItem label="Uniforms" value={selectedItem.uniforms} />

              <div className="border-b pb-2">
                <span className="text-xs font-semibold uppercase text-gray-500">
                  Status
                </span>
                <div className="mt-2">
                  <BeneficiaryDistributionStatusBadge status={selectedItem.status} />
                </div>
              </div>

              <div className="border-b pb-2 md:col-span-2">
                <span className="text-xs font-semibold uppercase text-gray-500">
                  Event Photo
                </span>
                <div className="mt-2">
                  <img
                    src={selectedItem.eventPhoto || child1}
                    alt="Anganwadi Child Distribution Event"
                    className="h-48 w-auto max-w-full rounded-lg object-cover shadow-sm border border-gray-200"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = child1;
                    }}
                  />
                </div>
              </div>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default AddBeneficiaryDistribution;
