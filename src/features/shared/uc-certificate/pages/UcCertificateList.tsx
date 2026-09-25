// src/features/shared/uc-certificate/pages/UcCertificateList.tsx

import React, { useMemo } from 'react';
import type { MRT_ColumnDef } from 'material-react-table';
import { Layers } from 'lucide-react';
import { ReusableTable } from '@/shared/components/ui/Table';
import Card from '@/shared/components/layout/Card';
import type { UcCertificateItem } from '../types/uc-certificate.types';
import { useUcCertificateItems } from '../state/ucCertificateState';

export const UcCertificateList: React.FC = () => {
  const { items } = useUcCertificateItems();

  const columns = useMemo<MRT_ColumnDef<UcCertificateItem>[]>(
    () => [
      {
        accessorKey: 'slNo',
        header: 'SL. No.',
        size: 80,
        Cell: ({ cell }) => (
          <span className="font-mono text-xs font-semibold text-slate-700 dark:text-slate-300">
            {cell.getValue<number>()}
          </span>
        ),
      },
      {
        accessorKey: 'financialYear',
        header: 'Financial Year',
        size: 140,
        Cell: ({ cell }) => (
          <span className="font-mono text-xs font-medium text-slate-800 dark:text-slate-200">
            {cell.getValue<string>()}
          </span>
        ),
      },
      {
        accessorKey: 'project',
        header: 'Project',
        size: 140,
        Cell: ({ cell }) => (
          <span className="font-medium text-xs text-slate-900 dark:text-white">
            {cell.getValue<string>()}
          </span>
        ),
      },
      {
        accessorKey: 'phase',
        header: 'Phase',
        size: 120,
        Cell: ({ cell }) => (
          <span className="font-medium text-xs text-slate-800 dark:text-slate-200">
            {cell.getValue<string>()}
          </span>
        ),
      },
      {
        accessorKey: 'totalAwc',
        header: 'Total AWC',
        size: 120,
        Cell: ({ cell }) => (
          <span className="font-mono text-xs font-semibold text-slate-800 dark:text-slate-200">
            {cell.getValue<number>()}
          </span>
        ),
      },
      {
        accessorKey: 'totalChildren',
        header: 'Total Children',
        size: 140,
        Cell: ({ cell }) => (
          <span className="font-mono text-xs font-bold text-blue-700 dark:text-blue-300">
            {cell.getValue<number>()}
          </span>
        ),
      },
      {
        accessorKey: 'totalBoys',
        header: 'Total Boys',
        size: 120,
        Cell: ({ cell }) => (
          <span className="font-mono text-xs text-slate-700 dark:text-slate-300">
            {cell.getValue<number>()}
          </span>
        ),
      },
      {
        accessorKey: 'totalGirls',
        header: 'Total Girls',
        size: 120,
        Cell: ({ cell }) => (
          <span className="font-mono text-xs text-slate-700 dark:text-slate-300">
            {cell.getValue<number>()}
          </span>
        ),
      },
    ],
    []
  );

  return (
    <Card title="Uc Certificate Details" icon={Layers}>
      <ReusableTable
        columns={columns}
        data={items}
        enableRowActions={false}
        enableExport={true}
        exportFileName="uc-certificate_records"
      />
    </Card>
  );
};

export default UcCertificateList;
