// src/features/shared/beneficiary-distribution/pages/BeneficiaryDistributionList.tsx

import React, { useCallback, useMemo, useState } from 'react';
import type { MRT_ColumnDef } from 'material-react-table';
import { Layers } from 'lucide-react';

import { ReusableTable } from '@/shared/components/ui/Table';
import ActionButtons from '@/shared/components/ui/Actions/ActionButtons';
import type { ActionType } from '@/shared/components/ui/Actions/action.types';
import Modal from '@/shared/components/ui/Modal/Modal';
import Card from '@/shared/components/layout/Card';

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

const getBeneficiaryDistributionColumns = (
  handleAction: (
    action: ActionType,
    item: BeneficiaryDistributionItem,
  ) => void,
): MRT_ColumnDef<BeneficiaryDistributionItem>[] => [
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
];

interface BeneficiaryDistributionListProps {
  items?: BeneficiaryDistributionItem[];
}

export const BeneficiaryDistributionList: React.FC<BeneficiaryDistributionListProps> = ({
  items,
}) => {
  const data = items ?? INITIAL_DATA;

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

  const columns = useMemo(
    () => getBeneficiaryDistributionColumns(handleAction),
    [handleAction],
  );

  return (
    <>
      <Card title="Distribution Records" icon={Layers}>
        <ReusableTable
          columns={columns}
          data={data}
          enableRowActions={false}
          enableExport={true}
          exportFileName="beneficiary-distribution_records"
        />
      </Card>

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
    </>
  );
};

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

export default BeneficiaryDistributionList;
