// src/features/fund-allocation/pages/FundAllocationTable.tsx

import React, { useState, useMemo, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import type { MRT_ColumnDef, MRT_Row } from 'material-react-table';
import {
  Layers,
  CheckCircle2,
  RotateCcw,
  ArrowLeft,
} from 'lucide-react';
import { toast } from 'react-toastify';

import Card from '@/shared/components/layout/Card';
import { ReusableTable } from '@/shared/components/ui/Table';
import Input from '@/shared/components/ui/Forms/Input';
import Button from '@/shared/components/ui/Button';

export interface AwcAllocationRow {
  id: string;
  sector: string;
  awcName: string;
  awcCode: string;
  boysCount: number;
  girlsCount: number;
  totalChildren: number;
  unitRate: number;
  autofilledAmount: number;
  allocatedAmount: number | '';
  isEdited: boolean;
  status: 'Allocated' | 'Pending' | 'Draft';
}

const INITIAL_AWC_DATA: AwcAllocationRow[] = [
  {
    id: '1',
    sector: 'Sector 01',
    awcName: 'AWW Center 01 - Unit 8, Bhubaneswar',
    awcCode: 'AWC-BBS-01',
    boysCount: 26,
    girlsCount: 24,
    totalChildren: 50,
    unitRate: 1500,
    autofilledAmount: 75000,
    allocatedAmount: 75000,
    isEdited: false,
    status: 'Allocated',
  },
  {
    id: '2',
    sector: 'Sector 01',
    awcName: 'AWW Center 02 - Saheed Nagar, Bhubaneswar',
    awcCode: 'AWC-BBS-02',
    boysCount: 18,
    girlsCount: 22,
    totalChildren: 40,
    unitRate: 1500,
    autofilledAmount: 60000,
    allocatedAmount: 60000,
    isEdited: false,
    status: 'Allocated',
  },
  {
    id: '3',
    sector: 'Sector 02',
    awcName: 'AWW Center 03 - Nayapalli, Bhubaneswar',
    awcCode: 'AWC-BBS-03',
    boysCount: 32,
    girlsCount: 33,
    totalChildren: 65,
    unitRate: 1500,
    autofilledAmount: 97500,
    allocatedAmount: 97500,
    isEdited: false,
    status: 'Pending',
  },
  {
    id: '4',
    sector: 'Sector 02',
    awcName: 'AWW Center 04 - Khandagiri, Bhubaneswar',
    awcCode: 'AWC-BBS-04',
    boysCount: 28,
    girlsCount: 27,
    totalChildren: 55,
    unitRate: 1500,
    autofilledAmount: 82500,
    allocatedAmount: 82500,
    isEdited: false,
    status: 'Pending',
  },
  {
    id: '5',
    sector: 'Sector 03',
    awcName: 'AWW Center 05 - Patia, Bhubaneswar',
    awcCode: 'AWC-BBS-05',
    boysCount: 15,
    girlsCount: 20,
    totalChildren: 35,
    unitRate: 1500,
    autofilledAmount: 52500,
    allocatedAmount: 52500,
    isEdited: false,
    status: 'Pending',
  },
  {
    id: '6',
    sector: 'Sector 03',
    awcName: 'AWW Center 06 - Old Town, Bhubaneswar',
    awcCode: 'AWC-BBS-06',
    boysCount: 22,
    girlsCount: 23,
    totalChildren: 45,
    unitRate: 1500,
    autofilledAmount: 67500,
    allocatedAmount: 67500,
    isEdited: false,
    status: 'Allocated',
  },
  {
    id: '7',
    sector: 'Sector 04',
    awcName: 'AWW Center 07 - Chandrasekharpur, Bhubaneswar',
    awcCode: 'AWC-BBS-07',
    boysCount: 30,
    girlsCount: 28,
    totalChildren: 58,
    unitRate: 1500,
    autofilledAmount: 87000,
    allocatedAmount: 87000,
    isEdited: false,
    status: 'Draft',
  },
  {
    id: '8',
    sector: 'Sector 04',
    awcName: 'AWW Center 08 - Rasulgarh, Bhubaneswar',
    awcCode: 'AWC-BBS-08',
    boysCount: 25,
    girlsCount: 25,
    totalChildren: 50,
    unitRate: 1500,
    autofilledAmount: 75000,
    allocatedAmount: 75000,
    isEdited: false,
    status: 'Draft',
  },
];

/* -------------------------------------------------------------
   Editable Allocate Amount Cell using common Input component
------------------------------------------------------------- */

interface EditableAllocateAmountCellProps {
  row: MRT_Row<AwcAllocationRow>;
  isSelected: boolean;
  onAmountChange: (id: string, newAmount: number | '') => void;
  onResetAmount: (id: string) => void;
}

const EditableAllocateAmountCell: React.FC<EditableAllocateAmountCellProps> = ({
  row,
  isSelected,
  onAmountChange,
  onResetAmount,
}) => {
  const item = row.original;

  return (
    <div className="flex items-center gap-2 max-w-[200px]">
      <div className="flex-1">
        <Input
          id={`allocate-amount-${item.id}`}
          name={`allocate-amount-${item.id}`}
          type="number"
          min={0}
          disabled={!isSelected}
          value={item.allocatedAmount === '' ? '' : item.allocatedAmount}
          onChange={(e) => {
            const val = e.target.value;
            onAmountChange(item.id, val === '' ? '' : Number(val));
          }}
          placeholder="Autofilled amount"
          wrapperClassName="mb-0"
          className={`text-right font-mono font-semibold text-sm transition-colors ${
            !isSelected
              ? 'bg-slate-100 dark:bg-slate-800/60 text-slate-400 dark:text-slate-500 cursor-not-allowed opacity-60 border-slate-200 dark:border-slate-700'
              : item.isEdited
              ? 'border-amber-400 bg-amber-50/60 text-amber-950 dark:bg-amber-950/40 dark:text-amber-200 dark:border-amber-600 focus:border-amber-500'
              : 'text-slate-800 dark:text-slate-100'
          }`}
        />
      </div>
      {item.isEdited && isSelected && (
        <button
          type="button"
          onClick={() => onResetAmount(item.id)}
          className="p-1.5 rounded-lg text-slate-400 hover:text-blue-600 hover:bg-blue-50 dark:hover:bg-slate-700 transition-colors cursor-pointer shrink-0"
          title={`Reset to autofill (${item.autofilledAmount.toLocaleString('en-IN')})`}
          aria-label="Reset to autofill"
        >
          <RotateCcw size={13} />
        </button>
      )}
    </div>
  );
};

/* -------------------------------------------------------------
   Columns Definition
------------------------------------------------------------- */

interface GetColumnsOptions {
  selectedIds: string[];
  totalRows: number;
  onToggleSelectAll: () => void;
  onToggleSelectRow: (id: string) => void;
  onAmountChange: (id: string, newAmount: number | '') => void;
  onResetAmount: (id: string) => void;
}

const getFundAllocationTableColumns = ({
  selectedIds,
  totalRows,
  onToggleSelectAll,
  onToggleSelectRow,
  onAmountChange,
  onResetAmount,
}: GetColumnsOptions): MRT_ColumnDef<AwcAllocationRow>[] => [
    /* 1. Checkbox Column */
    {
      id: 'select',
      header: 'Select',
      Header: () => (
        <div className="flex items-center justify-center">
          <input
            type="checkbox"
            checked={totalRows > 0 && selectedIds.length === totalRows}
            ref={(el) => {
              if (el) {
                el.indeterminate =
                  selectedIds.length > 0 && selectedIds.length < totalRows;
              }
            }}
            onChange={onToggleSelectAll}
            className="w-4 h-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500 cursor-pointer accent-blue-600"
            title="Select All"
            aria-label="Select All Rows"
          />
        </div>
      ),
      size: 50,
      minSize: 45,
      enableSorting: false,
      enableColumnFilter: false,
      enableColumnActions: false,
      enableColumnOrdering: false,
      Cell: ({ row }) => (
        <div className="flex items-center justify-center">
          <input
            type="checkbox"
            checked={selectedIds.includes(row.original.id)}
            onChange={() => onToggleSelectRow(row.original.id)}
            className="w-4 h-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500 cursor-pointer accent-blue-600"
            aria-label={`Select ${row.original.awcName}`}
          />
        </div>
      ),
    },

    /* 2. Sl. No. Column */
    {
      accessorKey: 'id',
      header: 'SL N0',
      size: 70,
      minSize: 60,
      Cell: ({ row }) => (
        <span className="font-mono text-slate-700 dark:text-slate-300 font-medium">
          {row.index + 1}
        </span>
      ),
    },

    /* 3. Sector Column */
    {
      accessorKey: 'sector',
      header: 'Sector',
      size: 130,
      minSize: 110,
      Cell: ({ cell }) => (
        <span className="text-xs sm:text-sm text-slate-800 dark:text-slate-200 font-medium">
          {cell.getValue<string>()}
        </span>
      ),
    },

    /* 4. AWC Column */
    {
      accessorKey: 'awcName',
      header: 'AWC',
      size: 250,
      minSize: 210,
      Cell: ({ row }) => (
        <div>
          <span className="font-semibold text-slate-900 dark:text-slate-100 block text-sm">
            {row.original.awcName}
          </span>
          <span className="text-[11px] text-slate-400 font-mono">
            {row.original.awcCode}
          </span>
        </div>
      ),
    },

    /* 4. Children Count under Boys / Girls (Multi-level Grouped Header) */
    {
      id: 'childrenCountGroup',
      header: 'Children Count',
      muiTableHeadCellProps: {
        align: 'center',
        sx: {
          textAlign: 'center',
          '& .Mui-TableHeadCell-Content': { justifyContent: 'center' },
          '& .Mui-TableHeadCell-Content-Labels': { justifyContent: 'center', width: '100%' },
        },
      },
      Header: () => (
        <div className="w-full text-center font-semibold">Children Count</div>
      ),
      columns: [
        {
          accessorKey: 'boysCount',
          header: 'Boys',
          size: 90,
          minSize: 80,
          muiTableHeadCellProps: {
            align: 'center',
            sx: {
              textAlign: 'center',
              '& .Mui-TableHeadCell-Content': { justifyContent: 'center' },
              '& .Mui-TableHeadCell-Content-Labels': { justifyContent: 'center', width: '100%' },
            },
          },
          Cell: ({ cell }) => (
            <span className="font-mono font-medium text-slate-800 dark:text-slate-200 block text-center">
              {cell.getValue<number>()}
            </span>
          ),
        },
        {
          accessorKey: 'girlsCount',
          header: 'Girls',
          size: 90,
          minSize: 80,
          muiTableHeadCellProps: {
            align: 'center',
            sx: {
              textAlign: 'center',
              '& .Mui-TableHeadCell-Content': { justifyContent: 'center' },
              '& .Mui-TableHeadCell-Content-Labels': { justifyContent: 'center', width: '100%' },
            },
          },
          Cell: ({ cell }) => (
            <span className="font-mono font-medium text-slate-800 dark:text-slate-200 block text-center">
              {cell.getValue<number>()}
            </span>
          ),
        },
      ],
    },

    /* 5. Allocate Amount (Autofilled & Editable via common Input component) */
    {
      accessorKey: 'allocatedAmount',
      header: 'Allocate Amount',
      size: 210,
      minSize: 180,
      Cell: ({ row }) => (
        <EditableAllocateAmountCell
          row={row}
          isSelected={selectedIds.includes(row.original.id)}
          onAmountChange={onAmountChange}
          onResetAmount={onResetAmount}
        />
      ),
    },
  ];

/* -------------------------------------------------------------
   Main Component: FundAllocationTable
------------------------------------------------------------- */

const FundAllocationTable: React.FC = () => {
  const navigate = useNavigate();
  const [data, setData] = useState<AwcAllocationRow[]>(INITIAL_AWC_DATA);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  // Toggle single row selection
  const handleToggleSelectRow = useCallback((id: string) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  }, []);

  // Toggle select all rows
  const handleToggleSelectAll = useCallback(() => {
    setSelectedIds((prev) =>
      prev.length === data.length ? [] : data.map((d) => d.id)
    );
  }, [data]);

  // Handle inline amount editing using common Input component
  const handleAmountChange = useCallback((id: string, newAmount: number | '') => {
    setData((prev) =>
      prev.map((row) => {
        if (row.id !== id) return row;
        const isEdited =
          newAmount !== '' && Number(newAmount) !== row.autofilledAmount;
        return {
          ...row,
          allocatedAmount: newAmount,
          isEdited,
        };
      })
    );
  }, []);

  // Reset single row amount back to autofilled value
  const handleResetAmount = useCallback((id: string) => {
    setData((prev) =>
      prev.map((row) =>
        row.id === id
          ? {
            ...row,
            allocatedAmount: row.autofilledAmount,
            isEdited: false,
          }
          : row
      )
    );
    toast.info('Amount reset to default autofilled calculation.');
  }, []);

  // Bulk submit allocation for selected or all centers
  const handleSaveAllAllocation = useCallback(() => {
    const targetRows =
      selectedIds.length > 0
        ? data.filter((d) => selectedIds.includes(d.id))
        : data;

    const invalid = targetRows.some(
      (r) => r.allocatedAmount === '' || Number(r.allocatedAmount) <= 0
    );

    if (invalid) {
      toast.error('Please ensure all selected centers have valid allocation amounts.');
      return;
    }

    setIsSubmitting(true);

    setTimeout(() => {
      const totalSum = targetRows.reduce(
        (sum, r) => sum + Number(r.allocatedAmount || 0),
        0
      );

      setData((prev) =>
        prev.map((row) =>
          selectedIds.includes(row.id) || selectedIds.length === 0
            ? { ...row, status: 'Allocated' }
            : row
        )
      );

      setIsSubmitting(false);
      toast.success(
        `Total allocation of ${totalSum.toLocaleString(
          'en-IN'
        )} successfully processed across ${targetRows.length} center(s)!`
      );
    }, 400);
  }, [data, selectedIds]);

  // Columns definition
  const columns = useMemo(
    () =>
      getFundAllocationTableColumns({
        selectedIds,
        totalRows: data.length,
        onToggleSelectAll: handleToggleSelectAll,
        onToggleSelectRow: handleToggleSelectRow,
        onAmountChange: handleAmountChange,
        onResetAmount: handleResetAmount,
      }),
    [
      selectedIds,
      data.length,
      handleToggleSelectAll,
      handleToggleSelectRow,
      handleAmountChange,
      handleResetAmount,
    ]
  );

  return (
    <div className="space-y-6">
      {/* 1. Page Header Card */}
      <Card title="Fund Allocation Details" icon={Layers}>
        {/* Main Table with Checkbox, SL N0, Sector, AWC, Children Count (Boys / Girls), Allocate Amount (Autofilled & Editable) */}
        <div>
          <ReusableTable
            columns={columns}
            data={data}
            enableRowActions={false}
            enableExport={true}
            exportFileName="awc-fund-allocation-table"
          />
        </div>

        {/* Bottom Actions with Allocate button aligned in the middle */}
        <div className="mt-6 pt-4 border-t border-slate-100 dark:border-gray-800 flex flex-col sm:flex-row items-center justify-center relative gap-3">
          <div className="sm:absolute sm:left-0">
            <Button
              type="button"
              variant="outline"
              size="md"
              label="Back"
              icon={<ArrowLeft size={16} />}
              onClick={() => navigate(-1)}
            />
          </div>

          <div className="flex items-center justify-center">
            <Button
              type="button"
              variant="primary"
              size="md"
              label={isSubmitting ? 'Allocating...' : 'Allocate'}
              icon={<CheckCircle2 size={18} />}
              loading={isSubmitting}
              onClick={handleSaveAllAllocation}
            />
          </div>
        </div>
      </Card>
    </div>
  );
};

export default FundAllocationTable;