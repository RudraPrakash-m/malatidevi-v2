// src/features/state/pages/FundAllocationField.tsx

import React, { useState, useMemo } from 'react';
import { useSelector } from 'react-redux';
import type { RootState } from '@/app/store';
import {
  CheckCircle2,
  Wallet,
  RotateCcw,
  Check,
  Minus,
  ReceiptText,
  Filter,
  Building2,
  MapPin,
  Users,
  IndianRupee,
  BarChart2,
  FileText,
} from 'lucide-react';
import type { MRT_ColumnDef } from 'material-react-table';
import { toast } from 'react-toastify';

import Card from '@/shared/components/layout/Card';
import Button from '@/shared/components/ui/Button';
import Select from '@/shared/components/ui/Forms/Select';
import Input from '@/shared/components/ui/Forms/Input';
import DatePicker from '@/shared/components/ui/Forms/DatePicker';
import { ReusableTable } from '@/shared/components/ui/Table';
import { Modal } from '@/shared/components/ui/Modal/Modal';

/* -------------------------------------------------------------
   Constants & Unit Rates
------------------------------------------------------------- */

const FINANCIAL_YEAR_OPTIONS = [
  { label: '2025-26', value: '2025-26' },
  { label: '2026-27', value: '2026-27' },
  { label: '2027-28', value: '2027-28' },
];

const ITEM_CATEGORY_OPTIONS = [
  { label: 'Uniform', value: 'Uniform' },
  { label: 'Sweater', value: 'Sweater' },
  { label: 'Shoes & Socks', value: 'Shoe' },
];

/* -------------------------------------------------------------
   30 Odisha Districts Data (Admin / DSWO Level)
------------------------------------------------------------- */

interface DistrictAllocationRow {
  id: string;
  district: string;
  projects: number;
  sectors: number;
  awcCount: number;
  totalChildren: number;
  amount?: number;
  date?: string;
}

const DISTRICT_DATA: DistrictAllocationRow[] = [
  { id: '1', district: 'Angul', projects: 8, sectors: 42, awcCount: 380, totalChildren: 25400 },
  { id: '2', district: 'Balangir', projects: 14, sectors: 78, awcCount: 690, totalChildren: 42100 },
  { id: '3', district: 'Balasore', projects: 12, sectors: 64, awcCount: 580, totalChildren: 38600 },
  { id: '4', district: 'Bargarh', projects: 12, sectors: 60, awcCount: 540, totalChildren: 34200 },
  { id: '5', district: 'Bhadrak', projects: 7, sectors: 39, awcCount: 360, totalChildren: 24800 },
  { id: '6', district: 'Boudh', projects: 3, sectors: 18, awcCount: 170, totalChildren: 11500 },
  { id: '7', district: 'Cuttack', projects: 15, sectors: 82, awcCount: 750, totalChildren: 48900 },
  { id: '8', district: 'Deogarh', projects: 3, sectors: 16, awcCount: 150, totalChildren: 9800 },
  { id: '9', district: 'Dhenkanal', projects: 8, sectors: 44, awcCount: 410, totalChildren: 27300 },
  { id: '10', district: 'Gajapati', projects: 7, sectors: 36, awcCount: 340, totalChildren: 21700 },
  { id: '11', district: 'Ganjam', projects: 23, sectors: 120, awcCount: 1150, totalChildren: 74500 },
  { id: '12', district: 'Jagatsinghpur', projects: 8, sectors: 40, awcCount: 370, totalChildren: 23600 },
  { id: '13', district: 'Jajpur', projects: 10, sectors: 55, awcCount: 510, totalChildren: 33400 },
  { id: '14', district: 'Jharsuguda', projects: 5, sectors: 26, awcCount: 240, totalChildren: 15200 },
  { id: '15', district: 'Kalahandi', projects: 13, sectors: 68, awcCount: 620, totalChildren: 39800 },
  { id: '16', district: 'Kandhamal', projects: 12, sectors: 62, awcCount: 570, totalChildren: 36400 },
  { id: '17', district: 'Kendrapara', projects: 9, sectors: 48, awcCount: 450, totalChildren: 29100 },
  { id: '18', district: 'Kendujhar', projects: 13, sectors: 70, awcCount: 650, totalChildren: 41500 },
  { id: '19', district: 'Khordha', projects: 10, sectors: 56, awcCount: 520, totalChildren: 35700 },
  { id: '20', district: 'Koraput', projects: 14, sectors: 76, awcCount: 710, totalChildren: 44200 },
  { id: '21', district: 'Malkangiri', projects: 7, sectors: 38, awcCount: 350, totalChildren: 22900 },
  { id: '22', district: 'Mayurbhanj', projects: 26, sectors: 138, awcCount: 1280, totalChildren: 82300 },
  { id: '23', district: 'Nabarangpur', projects: 10, sectors: 54, awcCount: 500, totalChildren: 32800 },
  { id: '24', district: 'Nayagarh', projects: 8, sectors: 42, awcCount: 390, totalChildren: 25600 },
  { id: '25', district: 'Nuapada', projects: 5, sectors: 28, awcCount: 260, totalChildren: 16700 },
  { id: '26', district: 'Puri', projects: 11, sectors: 58, awcCount: 540, totalChildren: 35100 },
  { id: '27', district: 'Rayagada', projects: 11, sectors: 59, awcCount: 550, totalChildren: 35800 },
  { id: '28', district: 'Sambalpur', projects: 9, sectors: 47, awcCount: 430, totalChildren: 28400 },
  { id: '29', district: 'Subarnapur', projects: 6, sectors: 31, awcCount: 290, totalChildren: 18900 },
  { id: '30', district: 'Sundargarh', projects: 17, sectors: 89, awcCount: 820, totalChildren: 53600 },
];

/* -------------------------------------------------------------
   SHG Dataset (CDPO Level)
------------------------------------------------------------- */

interface ShgAllocationRow {
  id: string;
  shgName: string;
  code: string;
  leaderName: string;
  bankName: string;
  accountNumber: string;
  amount?: number;
  date?: string;
  totalChildren?: number;
}

const CDPO_SHG_DATA: ShgAllocationRow[] = [
  { id: '1', shgName: 'Maa Tarini Self Help Group', code: 'SHG-001', leaderName: 'Sunita Majhi', bankName: 'State Bank of India', accountNumber: '32098457612', totalChildren: 1250 },
  { id: '2', shgName: 'Sakhi Mahila Samiti', code: 'SHG-002', leaderName: 'Pravasini Nayak', bankName: 'Odisha Gramya Bank', accountNumber: '44590123847', totalChildren: 1420 },
  { id: '3', shgName: 'Annapurna SHG', code: 'SHG-003', leaderName: 'Minati Jena', bankName: 'UCO Bank', accountNumber: '08123498765', totalChildren: 980 },
  { id: '4', shgName: 'Maa Samaleswari Mahila Mandal', code: 'SHG-004', leaderName: 'Geetanjali Sahoo', bankName: 'Punjab National Bank', accountNumber: '11029384756', totalChildren: 1350 },
  { id: '5', shgName: 'Radha Krishna SHG', code: 'SHG-005', leaderName: 'Basanti Swain', bankName: 'Canara Bank', accountNumber: '22938475610', totalChildren: 890 },
  { id: '6', shgName: 'Maa Mangala Mahila Samiti', code: 'SHG-006', leaderName: 'Sabita Mohanty', bankName: 'State Bank of India', accountNumber: '33495867102', totalChildren: 1560 },
  { id: '7', shgName: 'Jay Jagannath SHG', code: 'SHG-007', leaderName: 'Puspalata Samal', bankName: 'Union Bank of India', accountNumber: '44019283746', totalChildren: 1100 },
  { id: '8', shgName: 'Maa Sarala Self Help Group', code: 'SHG-008', leaderName: 'Rashmita Behera', bankName: 'Bank of Baroda', accountNumber: '55029384719', totalChildren: 1280 },
  { id: '9', shgName: 'Kalyani Mahila SHG', code: 'SHG-009', leaderName: 'Namita Tripathy', bankName: 'Odisha Gramya Bank', accountNumber: '66019283745', totalChildren: 750 },
  { id: '10', shgName: 'Maa Laxmi Mahila Samiti', code: 'SHG-010', leaderName: 'Snehalata Pattnaik', bankName: 'State Bank of India', accountNumber: '77029384615', totalChildren: 1680 },
  { id: '11', shgName: 'Bhabani Mahila Mandal', code: 'SHG-011', leaderName: 'Pratima Dash', bankName: 'Indian Bank', accountNumber: '88019283746', totalChildren: 1150 },
  { id: '12', shgName: 'Shree Ganesh SHG', code: 'SHG-012', leaderName: 'Anusaya Rout', bankName: 'UCO Bank', accountNumber: '99029384756', totalChildren: 680 },
];

/* -------------------------------------------------------------
   Fund Allocation List Data (History)
------------------------------------------------------------- */

interface DistrictRequestedFundRow {
  id: string;
  district: string;
  financialYear: string;
  allocationDate: string;
  projects: number;
  sectors: number;
  awcCount: number;
  totalChildren: number;
  fundAllocated: number;
}

const DISTRICT_REQUESTED_FUND_DATA: DistrictRequestedFundRow[] = [
  { id: '1', district: 'Angul', financialYear: '2025-26', allocationDate: '15/09/2026', projects: 8, sectors: 42, awcCount: 380, totalChildren: 25400, fundAllocated: 18542000 },
  { id: '2', district: 'Balangir', financialYear: '2025-26', allocationDate: '12/09/2026', projects: 14, sectors: 78, awcCount: 690, totalChildren: 42100, fundAllocated: 30733000 },
  { id: '3', district: 'Balasore', financialYear: '2026-27', allocationDate: '10/09/2026', projects: 12, sectors: 64, awcCount: 580, totalChildren: 38600, fundAllocated: 28178000 },
  { id: '4', district: 'Cuttack', financialYear: '2025-26', allocationDate: '08/09/2026', projects: 15, sectors: 82, awcCount: 750, totalChildren: 48900, fundAllocated: 35697000 },
  { id: '5', district: 'Ganjam', financialYear: '2026-27', allocationDate: '05/09/2026', projects: 23, sectors: 120, awcCount: 1150, totalChildren: 74500, fundAllocated: 54385000 },
  { id: '6', district: 'Khordha', financialYear: '2025-26', allocationDate: '01/09/2026', projects: 10, sectors: 56, awcCount: 520, totalChildren: 35700, fundAllocated: 26061000 },
  { id: '7', district: 'Mayurbhanj', financialYear: '2025-26', allocationDate: '28/08/2026', projects: 26, sectors: 138, awcCount: 1280, totalChildren: 82300, fundAllocated: 60079000 },
  { id: '8', district: 'Puri', financialYear: '2026-27', allocationDate: '25/08/2026', projects: 11, sectors: 58, awcCount: 540, totalChildren: 35100, fundAllocated: 25623000 },
  { id: '9', district: 'Sambalpur', financialYear: '2025-26', allocationDate: '20/08/2026', projects: 9, sectors: 47, awcCount: 430, totalChildren: 28400, fundAllocated: 20732000 },
  { id: '10', district: 'Sundargarh', financialYear: '2027-28', allocationDate: '15/08/2026', projects: 17, sectors: 89, awcCount: 820, totalChildren: 53600, fundAllocated: 39128000 },
];

interface ShgRequestedFundRow {
  id: string;
  shgName: string;
  code: string;
  financialYear: string;
  allocationDate: string;
  leaderName: string;
  bankName: string;
  accountNumber: string;
  fundAllocated: number;
}

const CDPO_REQUESTED_FUND_DATA: ShgRequestedFundRow[] = [
  { id: '1', shgName: 'Maa Tarini Self Help Group', code: 'SHG-001', financialYear: '2025-26', allocationDate: '15/09/2026', leaderName: 'Sunita Majhi', bankName: 'State Bank of India', accountNumber: '32098457612', fundAllocated: 437500 },
  { id: '2', shgName: 'Sakhi Mahila Samiti', code: 'SHG-002', financialYear: '2025-26', allocationDate: '12/09/2026', leaderName: 'Pravasini Nayak', bankName: 'Odisha Gramya Bank', accountNumber: '44590123847', fundAllocated: 497000 },
  { id: '3', shgName: 'Annapurna SHG', code: 'SHG-003', financialYear: '2026-27', allocationDate: '10/09/2026', leaderName: 'Minati Jena', bankName: 'UCO Bank', accountNumber: '08123498765', fundAllocated: 343000 },
  { id: '4', shgName: 'Maa Samaleswari Mahila Mandal', code: 'SHG-004', financialYear: '2025-26', allocationDate: '08/09/2026', leaderName: 'Geetanjali Sahoo', bankName: 'Punjab National Bank', accountNumber: '11029384756', fundAllocated: 472500 },
  { id: '5', shgName: 'Radha Krishna SHG', code: 'SHG-005', financialYear: '2026-27', allocationDate: '05/09/2026', leaderName: 'Basanti Swain', bankName: 'Canara Bank', accountNumber: '22938475610', fundAllocated: 311500 },
  { id: '6', shgName: 'Maa Mangala Mahila Samiti', code: 'SHG-006', financialYear: '2025-26', allocationDate: '01/09/2026', leaderName: 'Sabita Mohanty', bankName: 'State Bank of India', accountNumber: '33495867102', fundAllocated: 546000 },
];

const LIST_FY_FILTER_OPTIONS = [
  { label: 'All Financial Years', value: 'all' },
  ...FINANCIAL_YEAR_OPTIONS,
];

const LIST_DISTRICT_FILTER_OPTIONS = [
  { label: 'All Districts', value: 'all' },
  ...DISTRICT_DATA.map((d) => ({ label: d.district, value: d.district })),
];

const LIST_SHG_FILTER_OPTIONS = [
  { label: 'All SHGs', value: 'all' },
  ...CDPO_SHG_DATA.map((s) => ({ label: s.shgName, value: s.shgName })),
];

/* -------------------------------------------------------------
   District Projects Generator for Modal View
------------------------------------------------------------- */

interface DistrictProjectDetail {
  id: string;
  projectName: string;
  cdpoName: string;
  sectors: number;
  awcCount: number;
  totalChildren: number;
}

const CDPO_OFFICERS = [
  'Smt. Manorama Mishra',
  'Sri Ramesh Chandra Patra',
  'Smt. Minati Behera',
  'Smt. Anusaya Mohanty',
  'Smt. Pratima Dash',
  'Smt. Sabita Nayak',
  'Sri Bijay Kumar Das',
  'Smt. Rashmita Nayak',
  'Smt. Geetanjali Sahoo',
  'Smt. Minati Jena',
  'Smt. Prabhasini Rout',
  'Smt. Namita Mohapatra',
  'Smt. Jayashree Behera',
  'Smt. Anita Tripathy',
  'Smt. Sanghamitra Panda',
  'Smt. Basanti Swain',
  'Smt. Snehalata Pattnaik',
  'Smt. Pushpalata Samal',
];

const PROJECT_TYPE_SUFFIXES = [
  'Urban ICDS Project',
  'Sadar ICDS Project',
  'Rural ICDS Project',
  'East Block ICDS Project',
  'West Block ICDS Project',
  'North Block ICDS Project',
  'South Block ICDS Project',
  'Central ICDS Project',
  'Block-1 ICDS Project',
  'Block-2 ICDS Project',
  'Block-3 ICDS Project',
  'Block-4 ICDS Project',
  'Tribal Block ICDS Project',
  'Model ICDS Project',
  'Municipal ICDS Project',
];

const getDistrictProjects = (district: DistrictAllocationRow): DistrictProjectDetail[] => {
  const count = district.projects || 1;
  const avgSectors = Math.max(1, Math.round(district.sectors / count));
  const avgAwc = Math.max(1, Math.round(district.awcCount / count));
  const avgChildren = Math.max(1, Math.round(district.totalChildren / count));

  let remainingSectors = district.sectors;
  let remainingAwc = district.awcCount;
  let remainingChildren = district.totalChildren;

  return Array.from({ length: count }, (_, idx) => {
    const isLast = idx === count - 1;
    const pSectors = isLast ? Math.max(1, remainingSectors) : avgSectors;
    const pAwc = isLast ? Math.max(1, remainingAwc) : avgAwc;
    const pChildren = isLast ? Math.max(0, remainingChildren) : avgChildren;

    remainingSectors -= pSectors;
    remainingAwc -= pAwc;
    remainingChildren -= pChildren;

    const suffix = PROJECT_TYPE_SUFFIXES[idx % PROJECT_TYPE_SUFFIXES.length];
    const cdpo = CDPO_OFFICERS[idx % CDPO_OFFICERS.length];

    return {
      id: `${district.id}-proj-${idx + 1}`,
      projectName: `${district.district} ${suffix}`,
      cdpoName: cdpo,
      sectors: pSectors,
      awcCount: pAwc,
      totalChildren: pChildren,
    };
  });
};

/* -------------------------------------------------------------
   Main Component: FundAllocationField
------------------------------------------------------------- */

interface FundAllocationFieldProps {
  onBack?: () => void;
  onFilter?: (data: Record<string, any>) => void;
}

const FundAllocationField: React.FC<FundAllocationFieldProps> = ({
  onBack: _onBack,
  onFilter,
}) => {
  // Role detection: CDPO role check
  const authUser = useSelector((state: RootState) => state.auth.user);
  const isCdpo = authUser?.primaryRoleCode === 'CDPO' || authUser?.loginUserName === 'cdpo';

  // Category options: CDPO allocates for Uniform & Sweater only (Shoes are allocated directly to AWW)
  const availableCategoryOptions = useMemo(() => {
    if (isCdpo) {
      return [
        { label: 'Uniform', value: 'Uniform' },
        { label: 'Sweater', value: 'Sweater' },
      ];
    }
    return ITEM_CATEGORY_OPTIONS;
  }, [isCdpo]);

  // Form states
  const [financialYear, setFinancialYear] = useState<string>('2025-26');
  const [itemCategory, setItemCategory] = useState<string>('Uniform');
  const [totalAmount, setTotalAmount] = useState<string>('');

  // Fund Allocation List Filter states
  const [filterFyInput, setFilterFyInput] = useState<string>('all');
  const [filterLocationInput, setFilterLocationInput] = useState<string>('all');
  const [filterDateInput, setFilterDateInput] = useState<string>('');

  // Applied filter state
  const [appliedListFilters, setAppliedListFilters] = useState<{
    financialYear: string;
    location: string;
    date: string;
  }>({
    financialYear: 'all',
    location: 'all',
    date: '',
  });

  // Selected Row IDs state (default unchecked)
  const [selectedIds, setSelectedIds] = useState<string[]>([]);

  // Custom user-edited row amounts
  const [customAmounts, setCustomAmounts] = useState<Record<string, number>>({});

  // Today's date formatted as YYYY-MM-DD for DatePicker and DD/MM/YYYY
  const todayIsoDate = useMemo(() => {
    const today = new Date();
    const day = String(today.getDate()).padStart(2, '0');
    const month = String(today.getMonth() + 1).padStart(2, '0');
    const year = today.getFullYear();
    return `${year}-${month}-${day}`;
  }, []);

  const todayFormattedDate = useMemo(() => {
    const today = new Date();
    const day = String(today.getDate()).padStart(2, '0');
    const month = String(today.getMonth() + 1).padStart(2, '0');
    const year = today.getFullYear();
    return `${day}/${month}/${year}`;
  }, []);

  // Recalculate and sync the form's Total Amount whenever selected rows or amounts change
  const syncTotalAmount = (
    activeSelectedIds: string[],
    currentAmounts: Record<string, number>
  ) => {
    let sum = 0;
    activeSelectedIds.forEach((id) => {
      if (currentAmounts[id]) {
        sum += currentAmounts[id];
      }
    });
    setTotalAmount(sum > 0 ? String(sum) : '');
  };

  // Base dataset depending on role with manual amounts
  const baseTableData = useMemo(() => {
    if (isCdpo) {
      return CDPO_SHG_DATA.map((item) => {
        const amount =
          customAmounts[item.id] !== undefined
            ? customAmounts[item.id]
            : 0;
        return {
          ...item,
          date: todayFormattedDate,
          amount,
        };
      });
    }

    return DISTRICT_DATA.map((item) => {
      const amount =
        customAmounts[item.id] !== undefined
          ? customAmounts[item.id]
          : 0;
      return {
        ...item,
        date: todayFormattedDate,
        amount,
      };
    });
  }, [isCdpo, customAmounts, todayFormattedDate]);

  // Handler for editing row amount
  const handleAmountChange = (id: string, newAmount: number) => {
    const updatedAmounts = {
      ...customAmounts,
      [id]: newAmount,
    };
    setCustomAmounts(updatedAmounts);

    if (selectedIds.includes(id)) {
      syncTotalAmount(selectedIds, updatedAmounts);
    }
  };

  // Selectable row IDs (for non-CDPO, cannot select if totalChildren is 0)
  const selectableIds = useMemo(() => {
    if (isCdpo) {
      return baseTableData.map((d) => d.id);
    }
    return (baseTableData as DistrictAllocationRow[])
      .filter((d) => (d.totalChildren ?? 0) > 0)
      .map((d) => d.id);
  }, [baseTableData, isCdpo]);

  // Selected rows data
  const selectedRows = useMemo(() => {
    return baseTableData.filter((row) => selectedIds.includes(row.id));
  }, [baseTableData, selectedIds]);

  // Total metrics calculated across selected rows (used for non-CDPO summary & submission)
  const totalSelectedChildren = useMemo(() => {
    return (selectedRows as DistrictAllocationRow[]).reduce((sum, row) => sum + (row.totalChildren || 0), 0);
  }, [selectedRows]);

  const totalSelectedProjects = useMemo(() => {
    return (selectedRows as DistrictAllocationRow[]).reduce((sum, row) => sum + (row.projects || 0), 0);
  }, [selectedRows]);

  const totalSelectedSectors = useMemo(() => {
    return (selectedRows as DistrictAllocationRow[]).reduce((sum, row) => sum + (row.sectors || 0), 0);
  }, [selectedRows]);

  const totalSelectedAwc = useMemo(() => {
    return (selectedRows as DistrictAllocationRow[]).reduce((sum, row) => sum + (row.awcCount || 0), 0);
  }, [selectedRows]);

  const totalSelectedAmount = useMemo(() => {
    return selectedRows.reduce((sum, row) => sum + (row.amount || 0), 0);
  }, [selectedRows]);

  // Toggle row checkbox
  const handleToggleRow = (id: string) => {
    const target = baseTableData.find((d) => d.id === id);
    if (!isCdpo && target && ('totalChildren' in target) && (target.totalChildren ?? 0) <= 0) {
      return;
    }

    const nextSelected = selectedIds.includes(id)
      ? selectedIds.filter((itemId) => itemId !== id)
      : [...selectedIds, id];

    setSelectedIds(nextSelected);
    syncTotalAmount(nextSelected, customAmounts);
  };

  // Toggle select all
  const handleToggleSelectAll = () => {
    const isAllSelected =
      selectableIds.length > 0 &&
      selectableIds.every((id) => selectedIds.includes(id));

    const nextSelected = isAllSelected ? [] : selectableIds;
    setSelectedIds(nextSelected);
    syncTotalAmount(nextSelected, customAmounts);
  };

  // District Projects Modal states (for non-CDPO)
  const [districtModalData, setDistrictModalData] = useState<DistrictAllocationRow | null>(null);
  const [isDistrictModalOpen, setIsDistrictModalOpen] = useState<boolean>(false);

  const handleOpenDistrictModal = (districtRow: DistrictAllocationRow) => {
    setDistrictModalData(districtRow);
    setIsDistrictModalOpen(true);
  };

  const handleCloseDistrictModal = () => {
    setIsDistrictModalOpen(false);
    setDistrictModalData(null);
  };

  // Filtered Fund Allocation List data
  const filteredListFundData = useMemo(() => {
    if (isCdpo) {
      return CDPO_REQUESTED_FUND_DATA.filter((row) => {
        if (appliedListFilters.financialYear && appliedListFilters.financialYear !== 'all' && row.financialYear !== appliedListFilters.financialYear) {
          return false;
        }
        if (appliedListFilters.location && appliedListFilters.location !== 'all' && row.shgName !== appliedListFilters.location) {
          return false;
        }
        if (appliedListFilters.date) {
          let formattedFilterDate = appliedListFilters.date;
          if (appliedListFilters.date.includes('-')) {
            const [year, month, day] = appliedListFilters.date.split('-');
            formattedFilterDate = `${day}/${month}/${year}`;
          }
          if (row.allocationDate !== formattedFilterDate) {
            return false;
          }
        }
        return true;
      });
    }

    return DISTRICT_REQUESTED_FUND_DATA.filter((row) => {
      if (appliedListFilters.financialYear && appliedListFilters.financialYear !== 'all' && row.financialYear !== appliedListFilters.financialYear) {
        return false;
      }
      if (appliedListFilters.location && appliedListFilters.location !== 'all' && row.district !== appliedListFilters.location) {
        return false;
      }
      if (appliedListFilters.date) {
        let formattedFilterDate = appliedListFilters.date;
        if (appliedListFilters.date.includes('-')) {
          const [year, month, day] = appliedListFilters.date.split('-');
          formattedFilterDate = `${day}/${month}/${year}`;
        }
        if (row.allocationDate !== formattedFilterDate) {
          return false;
        }
      }
      return true;
    });
  }, [appliedListFilters, isCdpo]);

  const handleApplyListFilter = () => {
    setAppliedListFilters({
      financialYear: filterFyInput,
      location: filterLocationInput,
      date: filterDateInput,
    });
  };

  const handleResetListFilter = () => {
    setFilterFyInput('all');
    setFilterLocationInput('all');
    setFilterDateInput('');
    setAppliedListFilters({
      financialYear: 'all',
      location: 'all',
      date: '',
    });
  };

  // Handle Allocation submission
  const handleAllocate = (e?: React.FormEvent) => {
    if (e) e.preventDefault();

    if (!financialYear && !itemCategory && !totalAmount) {
      toast.info('Please enter fund allocation details.');
      return;
    }

    if (selectedIds.length === 0) {
      toast.warning(`Please select at least one ${isCdpo ? 'SHG' : 'district'} for fund allocation.`);
      return;
    }

    const parsedAmt = totalAmount ? parseFloat(totalAmount.replace(/,/g, '')) || 0 : totalSelectedAmount;

    onFilter?.({
      financialYear,
      itemCategory,
      totalAmount: parsedAmt,
      selectedIds,
      allocations: selectedRows,
    });

    const categoryText = itemCategory ? ` for ${itemCategory}` : '';
    const amtText = parsedAmt ? ` with Total Amt: ₹${parsedAmt.toLocaleString('en-IN')}` : '';

    toast.success(
      `Fund allocated successfully for ${selectedIds.length} ${isCdpo ? 'SHG(s)' : 'district(s)'}${financialYear ? ` [FY ${financialYear}]` : ''}${categoryText}${amtText}!`
    );
  };

  // Reset Filters
  const handleResetFilter = () => {
    setFinancialYear('');
    setItemCategory('');
    setCustomAmounts({});
    setTotalAmount('');
    setSelectedIds([]);
    toast.info('Form has been reset.');
  };

  /* -------------------------------------------------------------
     Table Columns for CDPO (SHG List: No project, sector, AWC, children)
  ------------------------------------------------------------- */
  const cdpoColumns = useMemo<MRT_ColumnDef<ShgAllocationRow>[]>(
    () => [
      {
        id: 'selection',
        header: 'Select',
        Header: () => {
          const isAllSelected =
            selectableIds.length > 0 &&
            selectableIds.every((id) => selectedIds.includes(id));
          const isSomeSelected =
            selectedIds.length > 0 && !isAllSelected;

          return (
            <div className="flex items-center justify-center gap-1.5 py-0.5">
              <button
                type="button"
                onClick={handleToggleSelectAll}
                className={`w-4 h-4 rounded border flex items-center justify-center transition-all cursor-pointer ${isAllSelected || isSomeSelected
                  ? 'bg-primary border-primary text-white shadow-xs'
                  : 'border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 hover:border-primary'
                  }`}
                title={isAllSelected ? 'Deselect All' : 'Select All'}
                aria-label={isAllSelected ? 'Deselect All' : 'Select All'}
              >
                {isAllSelected && <Check size={11} strokeWidth={3} />}
                {isSomeSelected && <Minus size={11} strokeWidth={3} />}
              </button>
              <span className="font-bold text-xs">Select</span>
            </div>
          );
        },
        size: 70,
        minSize: 60,
        enableSorting: false,
        enableColumnActions: false,
        enableColumnFilter: false,
        muiTableHeadCellProps: {
          align: 'center',
          sx: {
            '& .Mui-TableHeadCell-Content': { justifyContent: 'center' },
            '& .Mui-TableHeadCell-Content-Labels': { justifyContent: 'center' },
          },
        },
        muiTableBodyCellProps: { align: 'center' },
        Cell: ({ row }) => {
          const isSelected = selectedIds.includes(row.original.id);
          return (
            <div className="flex items-center justify-center">
              <button
                type="button"
                onClick={() => handleToggleRow(row.original.id)}
                className={`w-4 h-4 rounded border flex items-center justify-center transition-all cursor-pointer ${isSelected
                  ? 'bg-primary border-primary text-white shadow-xs'
                  : 'border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 hover:border-primary/60'
                  }`}
                title={isSelected ? `Deselect ${row.original.shgName}` : `Select ${row.original.shgName}`}
                aria-label={`Select ${row.original.shgName}`}
              >
                {isSelected && <Check size={11} strokeWidth={3} />}
              </button>
            </div>
          );
        },
      },
      {
        accessorKey: 'id',
        header: 'Sl. No',
        size: 60,
        minSize: 50,
        muiTableHeadCellProps: { align: 'center' },
        muiTableBodyCellProps: { align: 'center' },
        Cell: ({ row }) => (
          <div className="w-full text-center font-mono text-xs font-semibold text-slate-700 dark:text-slate-300">
            {row.index + 1}
          </div>
        ),
      },
      {
        accessorKey: 'shgName',
        header: 'SHG Name',
        size: 280,
        minSize: 200,
        Cell: ({ row }) => {
          const isSelected = selectedIds.includes(row.original.id);
          return (
            <span
              className={`font-semibold text-xs sm:text-sm ${isSelected ? 'text-primary dark:text-primary-light font-bold' : 'text-slate-800 dark:text-slate-200'
                }`}
            >
              {row.original.shgName}
            </span>
          );
        },
      },
      {
        accessorKey: 'amount',
        header: 'Amount (₹)',
        size: 150,
        minSize: 120,
        muiTableHeadCellProps: { align: 'right' as const },
        muiTableBodyCellProps: { align: 'right' as const },
        Cell: ({ row }) => {
          const isSelected = selectedIds.includes(row.original.id);
          const currentAmount = customAmounts[row.original.id];
          return (
            <div className="flex justify-end">
              <input
                type="number"
                min="0"
                step="any"
                value={currentAmount !== undefined ? (currentAmount === 0 ? '' : currentAmount) : ''}
                placeholder="0"
                disabled={!isSelected}
                onChange={(e) => {
                  const raw = e.target.value;
                  const num = raw === '' ? 0 : parseFloat(raw);
                  handleAmountChange(row.original.id, isNaN(num) ? 0 : num);
                }}
                className={`w-full max-w-[130px] px-2.5 py-1 text-right font-mono font-bold text-xs rounded-md border transition-all outline-none ${isSelected
                  ? 'bg-white dark:bg-slate-900 border-slate-300 dark:border-slate-700 text-emerald-700 dark:text-emerald-400 focus:border-primary focus:ring-1 focus:ring-primary/20 shadow-2xs hover:border-slate-400 dark:hover:border-slate-600'
                  : 'bg-slate-100 dark:bg-slate-800/60 border-slate-200 dark:border-slate-800 text-slate-400 dark:text-slate-600 cursor-not-allowed opacity-60'
                  }`}
              />
            </div>
          );
        },
      },
    ],
    [selectedIds, customAmounts, todayFormattedDate, selectableIds]
  );

  /* -------------------------------------------------------------
     Table Columns for Non-CDPO (Districts with Projects, Sectors, AWCs, Children)
  ------------------------------------------------------------- */
  const districtColumns = useMemo<MRT_ColumnDef<DistrictAllocationRow>[]>(
    () => [
      {
        id: 'selection',
        header: 'Select',
        Header: () => {
          const isAllSelected =
            selectableIds.length > 0 &&
            selectableIds.every((id) => selectedIds.includes(id));
          const isSomeSelected =
            selectedIds.length > 0 && !isAllSelected;

          return (
            <div className="flex items-center justify-center gap-1.5 py-0.5">
              <button
                type="button"
                onClick={handleToggleSelectAll}
                className={`w-4 h-4 rounded border flex items-center justify-center transition-all cursor-pointer ${isAllSelected || isSomeSelected
                  ? 'bg-primary border-primary text-white shadow-xs'
                  : 'border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 hover:border-primary'
                  }`}
                title={isAllSelected ? 'Deselect All' : 'Select All'}
                aria-label={isAllSelected ? 'Deselect All' : 'Select All'}
              >
                {isAllSelected && <Check size={11} strokeWidth={3} />}
                {isSomeSelected && <Minus size={11} strokeWidth={3} />}
              </button>
              <span className="font-bold text-xs">Select</span>
            </div>
          );
        },
        size: 70,
        minSize: 60,
        enableSorting: false,
        enableColumnActions: false,
        enableColumnFilter: false,
        muiTableHeadCellProps: {
          align: 'center',
          sx: {
            '& .Mui-TableHeadCell-Content': { justifyContent: 'center' },
            '& .Mui-TableHeadCell-Content-Labels': { justifyContent: 'center' },
          },
        },
        muiTableBodyCellProps: { align: 'center' },
        Cell: ({ row }) => {
          const isSelectable = (row.original.totalChildren ?? 0) > 0;
          const isSelected = selectedIds.includes(row.original.id);
          return (
            <div className="flex items-center justify-center">
              <button
                type="button"
                disabled={!isSelectable}
                onClick={() => isSelectable && handleToggleRow(row.original.id)}
                className={`w-4 h-4 rounded border flex items-center justify-center transition-all ${!isSelectable
                  ? 'border-slate-200 dark:border-slate-800 bg-slate-100 dark:bg-slate-800/50 text-slate-300 dark:text-slate-600 cursor-not-allowed opacity-40'
                  : isSelected
                    ? 'bg-primary border-primary text-white shadow-xs cursor-pointer'
                    : 'border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 hover:border-primary/60 cursor-pointer'
                  }`}
                title={!isSelectable ? 'Cannot select (Total Children is 0)' : isSelected ? `Deselect ${row.original.district}` : `Select ${row.original.district}`}
                aria-label={`Select ${row.original.district}`}
              >
                {isSelected && <Check size={11} strokeWidth={3} />}
              </button>
            </div>
          );
        },
      },
      {
        accessorKey: 'id',
        header: 'Sl. No',
        size: 60,
        minSize: 50,
        muiTableHeadCellProps: { align: 'center' },
        muiTableBodyCellProps: { align: 'center' },
        Cell: ({ row }) => (
          <div className="w-full text-center font-mono text-xs font-semibold text-slate-700 dark:text-slate-300">
            {row.index + 1}
          </div>
        ),
      },
      {
        accessorKey: 'district',
        header: 'District',
        size: 150,
        minSize: 120,
        Cell: ({ cell, row }) => {
          const isSelected = selectedIds.includes(row.original.id);
          return (
            <button
              type="button"
              onClick={() => handleOpenDistrictModal(row.original)}
              className={`text-left font-semibold text-xs sm:text-sm transition-all hover:underline hover:text-primary cursor-pointer inline-flex items-center gap-1.5 group ${isSelected ? 'text-primary dark:text-primary-light font-bold' : 'text-slate-800 dark:text-slate-200'
                }`}
              title={`Click to view ${row.original.projects} projects in ${row.original.district}`}
            >
              <span className="group-hover:text-primary transition-colors">{cell.getValue<string>()}</span>
            </button>
          );
        },
      },
      {
        accessorKey: 'projects',
        header: 'Project',
        size: 80,
        minSize: 65,
        muiTableHeadCellProps: { align: 'right' },
        muiTableBodyCellProps: { align: 'right' },
        Cell: ({ cell, row }) => {
          const isSelected = selectedIds.includes(row.original.id);
          return (
            <button
              type="button"
              onClick={() => handleOpenDistrictModal(row.original)}
              className={`w-full text-right font-mono text-xs sm:text-sm hover:text-primary hover:underline cursor-pointer ${isSelected ? 'text-slate-700 dark:text-slate-300 font-semibold' : 'text-slate-500 dark:text-slate-400'
                }`}
              title={`Click to view ${cell.getValue<number>()} projects in ${row.original.district}`}
            >
              {cell.getValue<number>()}
            </button>
          );
        },
      },
      {
        accessorKey: 'sectors',
        header: 'Sector',
        size: 80,
        minSize: 65,
        muiTableHeadCellProps: { align: 'right' },
        muiTableBodyCellProps: { align: 'right' },
        Cell: ({ cell, row }) => {
          const isSelected = selectedIds.includes(row.original.id);
          return (
            <div
              className={`w-full text-right font-mono text-xs sm:text-sm ${isSelected ? 'text-slate-700 dark:text-slate-300' : 'text-slate-400 dark:text-slate-500'
                }`}
            >
              {cell.getValue<number>()}
            </div>
          );
        },
      },
      {
        accessorKey: 'awcCount',
        header: 'AWC',
        size: 90,
        minSize: 75,
        muiTableHeadCellProps: { align: 'right' },
        muiTableBodyCellProps: { align: 'right' },
        Cell: ({ cell, row }) => {
          const isSelected = selectedIds.includes(row.original.id);
          return (
            <div
              className={`w-full text-right font-mono text-xs sm:text-sm ${isSelected ? 'text-slate-700 dark:text-slate-300' : 'text-slate-400 dark:text-slate-500'
                }`}
            >
              {(cell.getValue<number>() ?? 0).toLocaleString('en-IN')}
            </div>
          );
        },
      },
      {
        accessorKey: 'totalChildren',
        header: 'Total Children',
        size: 120,
        minSize: 100,
        muiTableHeadCellProps: { align: 'right' },
        muiTableBodyCellProps: { align: 'right' },
        Cell: ({ cell, row }) => {
          const isSelected = selectedIds.includes(row.original.id);
          const childrenCount = cell.getValue<number>() ?? 0;
          return (
            <div
              className={`w-full text-right font-mono text-xs sm:text-sm font-semibold ${childrenCount === 0
                ? 'text-red-500 dark:text-red-400'
                : isSelected
                  ? 'text-slate-800 dark:text-slate-100'
                  : 'text-slate-400 dark:text-slate-500'
                }`}
            >
              {childrenCount}
            </div>
          );
        },
      },
      {
        accessorKey: 'amount',
        header: 'Amount (₹)',
        size: 150,
        minSize: 120,
        muiTableHeadCellProps: { align: 'right' as const },
        muiTableBodyCellProps: { align: 'right' as const },
        Cell: ({ row }) => {
          const isSelected = selectedIds.includes(row.original.id);
          const currentAmount = customAmounts[row.original.id];
          return (
            <div className="flex justify-end">
              <input
                type="number"
                min="0"
                step="any"
                value={currentAmount !== undefined ? (currentAmount === 0 ? '' : currentAmount) : ''}
                placeholder="0"
                disabled={!isSelected}
                onChange={(e) => {
                  const raw = e.target.value;
                  const num = raw === '' ? 0 : parseFloat(raw);
                  handleAmountChange(row.original.id, isNaN(num) ? 0 : num);
                }}
                className={`w-full max-w-[130px] px-2.5 py-1 text-right font-mono font-bold text-xs rounded-md border transition-all outline-none ${isSelected
                  ? 'bg-white dark:bg-slate-900 border-slate-300 dark:border-slate-700 text-emerald-700 dark:text-emerald-400 focus:border-primary focus:ring-1 focus:ring-primary/20 shadow-2xs hover:border-slate-400 dark:hover:border-slate-600'
                  : 'bg-slate-100 dark:bg-slate-800/60 border-slate-200 dark:border-slate-800 text-slate-400 dark:text-slate-600 cursor-not-allowed opacity-60'
                  }`}
              />
            </div>
          );
        },
      },
    ],
    [selectedIds, customAmounts, todayFormattedDate, selectableIds]
  );

  /* -------------------------------------------------------------
     Fund Allocation List Columns for CDPO
  ------------------------------------------------------------- */
  const cdpoRequestedFundColumns = useMemo<MRT_ColumnDef<ShgRequestedFundRow>[]>(
    () => [
      {
        accessorKey: 'id',
        header: 'Sl. No',
        size: 60,
        minSize: 50,
        muiTableHeadCellProps: { align: 'center' },
        muiTableBodyCellProps: { align: 'center' },
        Cell: ({ row }) => (
          <div className="w-full text-center font-mono text-xs font-semibold text-slate-700 dark:text-slate-300">
            {row.index + 1}
          </div>
        ),
      },
      {
        accessorKey: 'shgName',
        header: 'SHG Name',
        size: 280,
        minSize: 200,
        Cell: ({ row }) => (
          <span className="font-semibold text-xs sm:text-sm text-slate-800 dark:text-slate-200">
            {row.original.shgName}
          </span>
        ),
      },
      {
        accessorKey: 'allocationDate',
        header: 'Allocation Date',
        size: 130,
        minSize: 110,
        muiTableHeadCellProps: { align: 'center' },
        muiTableBodyCellProps: { align: 'center' },
        Cell: ({ cell }) => (
          <div className="w-full text-center font-mono text-xs sm:text-sm text-slate-700 dark:text-slate-300 font-medium">
            {cell.getValue<string>() || '—'}
          </div>
        ),
      },
      {
        accessorKey: 'fundAllocated',
        header: 'Fund Allocated (₹)',
        size: 150,
        minSize: 120,
        muiTableHeadCellProps: { align: 'right' },
        muiTableBodyCellProps: { align: 'right' },
        Cell: ({ cell }) => (
          <div className="w-full text-right font-mono text-xs sm:text-sm font-bold text-amber-700 dark:text-amber-400">
            {(cell.getValue<number>() ?? 0).toLocaleString('en-IN')}
          </div>
        ),
      },
    ],
    []
  );

  /* -------------------------------------------------------------
     Fund Allocation List Columns for Non-CDPO
  ------------------------------------------------------------- */
  const districtRequestedFundColumns = useMemo<MRT_ColumnDef<DistrictRequestedFundRow>[]>(
    () => [
      {
        accessorKey: 'id',
        header: 'Sl. No',
        size: 60,
        minSize: 50,
        muiTableHeadCellProps: { align: 'center' },
        muiTableBodyCellProps: { align: 'center' },
        Cell: ({ row }) => (
          <div className="w-full text-center font-mono text-xs font-semibold text-slate-700 dark:text-slate-300">
            {row.index + 1}
          </div>
        ),
      },
      {
        accessorKey: 'district',
        header: 'District',
        size: 150,
        minSize: 120,
        Cell: ({ cell, row }) => (
          <button
            type="button"
            onClick={() => {
              const matched = DISTRICT_DATA.find((d) => d.district === row.original.district);
              if (matched) {
                handleOpenDistrictModal(matched);
              } else {
                handleOpenDistrictModal({
                  id: row.original.id,
                  district: row.original.district,
                  projects: row.original.projects,
                  sectors: row.original.sectors,
                  awcCount: row.original.awcCount,
                  totalChildren: row.original.totalChildren,
                });
              }
            }}
            className="text-left font-semibold text-xs sm:text-sm text-slate-800 dark:text-slate-200 hover:text-primary hover:underline cursor-pointer inline-flex items-center gap-1.5 group"
            title={`Click to view projects in ${cell.getValue<string>()}`}
          >
            <span className="group-hover:text-primary transition-colors">{cell.getValue<string>()}</span>
            <span className="text-[10px] px-1 py-0.2 rounded bg-primary/10 text-primary border border-primary/20 opacity-0 group-hover:opacity-100 transition-opacity font-normal">
              View
            </span>
          </button>
        ),
      },
      {
        accessorKey: 'allocationDate',
        header: 'Allocation Date',
        size: 130,
        minSize: 110,
        muiTableHeadCellProps: { align: 'center' },
        muiTableBodyCellProps: { align: 'center' },
        Cell: ({ cell }) => (
          <div className="w-full text-center font-mono text-xs sm:text-sm text-slate-700 dark:text-slate-300 font-medium">
            {cell.getValue<string>() || '—'}
          </div>
        ),
      },
      {
        accessorKey: 'projects',
        header: 'Project',
        size: 80,
        minSize: 65,
        muiTableHeadCellProps: { align: 'right' },
        muiTableBodyCellProps: { align: 'right' },
        Cell: ({ cell }) => (
          <div className="w-full text-right font-mono text-xs sm:text-sm text-slate-700 dark:text-slate-300">
            {cell.getValue<number>()}
          </div>
        ),
      },
      {
        accessorKey: 'sectors',
        header: 'Sector',
        size: 80,
        minSize: 65,
        muiTableHeadCellProps: { align: 'right' },
        muiTableBodyCellProps: { align: 'right' },
        Cell: ({ cell }) => (
          <div className="w-full text-right font-mono text-xs sm:text-sm text-slate-700 dark:text-slate-300">
            {cell.getValue<number>()}
          </div>
        ),
      },
      {
        accessorKey: 'awcCount',
        header: 'AWC',
        size: 90,
        minSize: 75,
        muiTableHeadCellProps: { align: 'right' },
        muiTableBodyCellProps: { align: 'right' },
        Cell: ({ cell }) => (
          <div className="w-full text-right font-mono text-xs sm:text-sm text-slate-700 dark:text-slate-300">
            {(cell.getValue<number>() ?? 0).toLocaleString('en-IN')}
          </div>
        ),
      },
      {
        accessorKey: 'totalChildren',
        header: 'Total Children',
        size: 120,
        minSize: 100,
        muiTableHeadCellProps: { align: 'right' },
        muiTableBodyCellProps: { align: 'right' },
        Cell: ({ cell }) => (
          <div className="w-full text-right font-mono text-xs sm:text-sm font-semibold text-slate-800 dark:text-slate-100">
            {cell.getValue<number>() ?? 0}
          </div>
        ),
      },
      {
        accessorKey: 'fundAllocated',
        header: 'Fund Allocated (₹)',
        size: 150,
        minSize: 120,
        muiTableHeadCellProps: { align: 'right' },
        muiTableBodyCellProps: { align: 'right' },
        Cell: ({ cell }) => (
          <div className="w-full text-right font-mono text-xs sm:text-sm font-bold text-amber-700 dark:text-amber-400">
            {(cell.getValue<number>() ?? 0).toLocaleString('en-IN')}
          </div>
        ),
      },
    ],
    []
  );

  // Table Columns Definition for District Projects Modal (Non-CDPO)
  const districtProjectsColumns = useMemo<MRT_ColumnDef<DistrictProjectDetail>[]>(
    () => [
      {
        accessorKey: 'id',
        header: 'Sl. No',
        size: 60,
        minSize: 50,
        muiTableHeadCellProps: { align: 'center' },
        muiTableBodyCellProps: { align: 'center' },
        Cell: ({ row }) => (
          <div className="w-full text-center font-mono text-xs font-semibold text-slate-700 dark:text-slate-300">
            {row.index + 1}
          </div>
        ),
      },
      {
        accessorKey: 'projectName',
        header: 'Project Name',
        size: 240,
        minSize: 180,
        Cell: ({ cell }) => (
          <div className="flex items-center gap-2">
            <span className="p-1 rounded-md bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 shrink-0">
              <Building2 size={14} />
            </span>
            <span className="font-semibold text-xs text-slate-900 dark:text-slate-100">
              {cell.getValue<string>()}
            </span>
          </div>
        ),
      },
      {
        accessorKey: 'cdpoName',
        header: 'CDPO In-Charge',
        size: 180,
        minSize: 140,
        Cell: ({ cell }) => (
          <span className="text-xs text-slate-700 dark:text-slate-300 font-medium">
            {cell.getValue<string>()}
          </span>
        ),
      },
      {
        accessorKey: 'sectors',
        header: 'Sector',
        size: 80,
        minSize: 65,
        muiTableHeadCellProps: { align: 'right' },
        muiTableBodyCellProps: { align: 'right' },
        Cell: ({ cell }) => (
          <div className="w-full text-right font-mono text-xs sm:text-sm text-slate-700 dark:text-slate-300">
            {cell.getValue<number>()}
          </div>
        ),
      },
      {
        accessorKey: 'awcCount',
        header: 'AWC',
        size: 90,
        minSize: 75,
        muiTableHeadCellProps: { align: 'right' },
        muiTableBodyCellProps: { align: 'right' },
        Cell: ({ cell }) => (
          <div className="w-full text-right font-mono text-xs sm:text-sm text-slate-700 dark:text-slate-300">
            {(cell.getValue<number>() ?? 0).toLocaleString('en-IN')}
          </div>
        ),
      },
      {
        accessorKey: 'totalChildren',
        header: 'Total Children',
        size: 120,
        minSize: 100,
        muiTableHeadCellProps: { align: 'right' },
        muiTableBodyCellProps: { align: 'right' },
        Cell: ({ cell }) => (
          <div className="w-full text-right font-mono text-xs font-semibold text-amber-700 dark:text-amber-400">
            {cell.getValue<number>() ?? 0}
          </div>
        ),
      },
    ],
    []
  );

  // Projects list data for the selected district in Modal
  const modalProjectsData = useMemo(() => {
    return districtModalData ? getDistrictProjects(districtModalData) : [];
  }, [districtModalData]);

  return (
    <div className="space-y-6">
      {/* Main Card containing Form & Allocation Table */}
      <Card title={isCdpo ? 'SHG Fund Allocation' : 'Fund Allocation'} icon={Wallet}>
        <form onSubmit={handleAllocate}>
          <div className="grid grid-cols-12 gap-4 items-start">
            {/* 1. Financial Year */}
            <div className="col-span-12 sm:col-span-6 lg:col-span-2">
              <Select
                id="fund-financial-year"
                name="financialYear"
                label="Financial Year"
                required
                options={FINANCIAL_YEAR_OPTIONS}
                value={financialYear}
                onChange={(e) => setFinancialYear(e.target.value)}
                placeholder="Select Financial Year"
              />
            </div>

            {/* 2. Item Category */}
            <div className="col-span-12 sm:col-span-6 lg:col-span-2">
              <Select
                id="fund-item-category"
                name="itemCategory"
                label="Item Category"
                placeholder="Select Category"
                options={availableCategoryOptions}
                value={itemCategory}
                onChange={(e) => {
                  setItemCategory(e.target.value);
                }}
                required
              />
            </div>

            {/* 3. Date */}
            <div className="col-span-12 sm:col-span-6 lg:col-span-2">
              <DatePicker
                id="fund-allocation-date"
                name="allocationDate"
                label="Date"
                placeholder="DD/MM/YYYY"
                value={todayIsoDate}
                disabled
              />
            </div>

            {/* 4. Total Amount */}
            <div className="col-span-12 sm:col-span-6 lg:col-span-2">
              <Input
                id="fund-total-amt"
                name="totalAmt"
                label="Total Amount (₹)"
                placeholder="0"
                type="number"
                value={totalAmount}
                readOnly
              />
            </div>
          </div>

          {/* Table Section */}
          <div className="mt-4 space-y-3">
            {/* Fund Allocation Summary Section - ONLY FOR NON-CDPO (Hidden for CDPO) */}
            {!isCdpo && (
              <div className="p-3 sm:p-3.5 bg-white dark:bg-gray-900 rounded-xl border border-slate-200/80 dark:border-gray-800 shadow-2xs space-y-2.5">
                <div className="flex items-center justify-between flex-wrap gap-2.5">
                  <div className="flex items-center gap-2 flex-wrap">
                    <BarChart2 className="text-blue-600 dark:text-blue-400" size={17} />
                    <span className="font-bold text-xs sm:text-sm text-slate-800 dark:text-slate-100">
                      Fund Allocation Summary
                    </span>
                    <span className="px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-blue-100/70 text-blue-600 dark:bg-blue-950/70 dark:text-blue-400">
                      {selectedIds.length} of {DISTRICT_DATA.length} Districts Selected
                    </span>
                  </div>
                </div>

                {/* Metrics Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-2.5">
                  {/* 1. Total Projects */}
                  <div className="flex items-center gap-2.5 px-3 py-2 rounded-lg bg-white dark:bg-gray-800/90 border border-slate-200/70 dark:border-gray-700/60 border-l-[3px] border-l-blue-500 shadow-2xs transition-all hover:scale-[1.01]">
                    <div className="w-8 h-8 rounded-lg bg-blue-50 dark:bg-blue-950/70 text-blue-600 dark:text-blue-400 flex items-center justify-center shrink-0">
                      <FileText size={16} />
                    </div>
                    <div className="min-w-0">
                      <p className="text-[11px] font-medium text-slate-500 dark:text-slate-400 truncate">Total Projects</p>
                      <p className="font-mono text-base font-bold text-blue-600 dark:text-blue-400 leading-tight">
                        {totalSelectedProjects.toLocaleString('en-IN')}
                      </p>
                    </div>
                  </div>

                  {/* 2. Total Sectors */}
                  <div className="flex items-center gap-2.5 px-3 py-2 rounded-lg bg-white dark:bg-gray-800/90 border border-slate-200/70 dark:border-gray-700/60 border-l-[3px] border-l-indigo-600 shadow-2xs transition-all hover:scale-[1.01]">
                    <div className="w-8 h-8 rounded-lg bg-indigo-50 dark:bg-indigo-950/70 text-indigo-600 dark:text-indigo-400 flex items-center justify-center shrink-0">
                      <MapPin size={16} />
                    </div>
                    <div className="min-w-0">
                      <p className="text-[11px] font-medium text-slate-500 dark:text-slate-400 truncate">Total Sectors</p>
                      <p className="font-mono text-base font-bold text-indigo-700 dark:text-indigo-400 leading-tight">
                        {totalSelectedSectors.toLocaleString('en-IN')}
                      </p>
                    </div>
                  </div>

                  {/* 3. Total AWCs */}
                  <div className="flex items-center gap-2.5 px-3 py-2 rounded-lg bg-white dark:bg-gray-800/90 border border-slate-200/70 dark:border-gray-700/60 border-l-[3px] border-l-pink-500 shadow-2xs transition-all hover:scale-[1.01]">
                    <div className="w-8 h-8 rounded-lg bg-pink-50 dark:bg-pink-950/70 text-pink-500 dark:text-pink-400 flex items-center justify-center shrink-0">
                      <Building2 size={16} />
                    </div>
                    <div className="min-w-0">
                      <p className="text-[11px] font-medium text-slate-500 dark:text-slate-400 truncate">Total AWCs</p>
                      <p className="font-mono text-base font-bold text-pink-600 dark:text-pink-400 leading-tight">
                        {totalSelectedAwc.toLocaleString('en-IN')}
                      </p>
                    </div>
                  </div>

                  {/* 4. Total Children */}
                  <div className="flex items-center gap-2.5 px-3 py-2 rounded-lg bg-white dark:bg-gray-800/90 border border-slate-200/70 dark:border-gray-700/60 border-l-[3px] border-l-amber-500 shadow-2xs transition-all hover:scale-[1.01]">
                    <div className="w-8 h-8 rounded-lg bg-amber-50 dark:bg-amber-950/70 text-amber-500 dark:text-amber-400 flex items-center justify-center shrink-0">
                      <Users size={16} />
                    </div>
                    <div className="min-w-0">
                      <p className="text-[11px] font-medium text-slate-500 dark:text-slate-400 truncate">Total Children</p>
                      <p className="font-mono text-base font-bold text-amber-600 dark:text-amber-400 leading-tight">
                        {totalSelectedChildren.toLocaleString('en-IN')}
                      </p>
                    </div>
                  </div>

                  {/* 5. Total Amount */}
                  <div className="flex items-center gap-2.5 px-3 py-2 rounded-lg bg-white dark:bg-gray-800/90 border border-slate-200/70 dark:border-gray-700/60 border-l-[3px] border-l-emerald-500 shadow-2xs transition-all hover:scale-[1.01]">
                    <div className="w-8 h-8 rounded-lg bg-emerald-50 dark:bg-emerald-950/70 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shrink-0">
                      <IndianRupee size={16} />
                    </div>
                    <div className="min-w-0">
                      <p className="text-[11px] font-medium text-slate-500 dark:text-slate-400 truncate">Total Amount</p>
                      <p className="font-mono text-base font-bold text-emerald-600 dark:text-emerald-400 leading-tight">
                        ₹{totalSelectedAmount.toLocaleString('en-IN')}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Main Allocation Table */}
            {isCdpo ? (
              <ReusableTable
                key="cdpo-shg-allocation-table"
                columns={cdpoColumns}
                data={baseTableData as ShgAllocationRow[]}
                enableRowActions={false}
                enableExport={true}
                exportFileName="shg_fund_allocation_records"
              />
            ) : (
              <ReusableTable
                key="district-fund-allocation-table"
                columns={districtColumns}
                data={baseTableData as DistrictAllocationRow[]}
                enableRowActions={false}
                enableExport={true}
                exportFileName="district_fund_allocation_records"
              />
            )}

            {/* Action Buttons below the Table */}
            <div className="pt-2 flex flex-wrap items-center justify-center gap-3">
              {(financialYear || itemCategory || totalAmount || selectedIds.length > 0) && (
                <Button
                  type="button"
                  variant="secondary"
                  label="Reset"
                  size="md"
                  icon={<RotateCcw size={16} />}
                  onClick={handleResetFilter}
                />
              )}

              <Button
                type="submit"
                disabled={totalSelectedAmount === 0 || selectedIds.length === 0}
                variant="primary"
                label="Allocate"
                size="md"
                icon={<CheckCircle2 size={16} />}
              />

            </div>
          </div>
        </form>
      </Card>

      {/* Fund Allocation List Card (History) */}
      <Card
        title="Fund Allocation List"
        icon={ReceiptText}
        action={
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-1 rounded-lg text-xs font-semibold bg-blue-50 text-blue-800 dark:bg-blue-950/60 dark:text-blue-300 border border-blue-200 dark:border-blue-800/80 shadow-2xs">
              {filteredListFundData.length} {isCdpo ? 'SHG(s)' : 'District(s)'} Listed
            </span>
          </div>
        }
      >
        <div className="space-y-4">
          {/* Filters: Financial Year, District/SHG & Allocation Date */}
          <div className="grid grid-cols-12 gap-4 items-end pb-3 border-b border-slate-200 dark:border-slate-800">
            <div className="col-span-12 sm:col-span-6 lg:col-span-3">
              <Select
                id="list-filter-fy"
                name="listFinancialYear"
                label="Financial Year"
                options={LIST_FY_FILTER_OPTIONS}
                value={filterFyInput}
                onChange={(e) => setFilterFyInput(e.target.value)}
                placeholder="Select Financial Year"
              />
            </div>

            <div className="col-span-12 sm:col-span-6 lg:col-span-3">
              <Select
                id="list-filter-location"
                name="listLocation"
                label={isCdpo ? 'SHG' : 'District'}
                options={isCdpo ? LIST_SHG_FILTER_OPTIONS : LIST_DISTRICT_FILTER_OPTIONS}
                value={filterLocationInput}
                onChange={(e) => setFilterLocationInput(e.target.value)}
                placeholder={isCdpo ? 'Select SHG' : 'Select District'}
              />
            </div>

            <div className="col-span-12 sm:col-span-6 lg:col-span-3">
              <DatePicker
                id="list-filter-date"
                name="listAllocationDate"
                label="Allocation Date"
                placeholder="DD/MM/YYYY"
                value={filterDateInput}
                onChange={(e) => setFilterDateInput(e.target.value)}
              />
            </div>

            <div className="col-span-12 sm:col-span-6 lg:col-span-3 flex items-center gap-2">
              <Button
                type="button"
                variant="outline-primary"
                size="md"
                label="Filter"
                icon={<Filter size={15} />}
                onClick={handleApplyListFilter}
              />
              {(filterFyInput !== 'all' || filterLocationInput !== 'all' || filterDateInput !== '' || appliedListFilters.financialYear !== 'all' || appliedListFilters.location !== 'all' || appliedListFilters.date !== '') && (
                <Button
                  type="button"
                  variant="outline"
                  size="md"
                  label="Reset"
                  icon={<RotateCcw size={15} />}
                  onClick={handleResetListFilter}
                />
              )}
            </div>
          </div>

          {isCdpo ? (
            <ReusableTable
              key={`cdpo-requested-fund-table-${appliedListFilters.financialYear}-${appliedListFilters.location}-${appliedListFilters.date}`}
              columns={cdpoRequestedFundColumns}
              data={filteredListFundData as ShgRequestedFundRow[]}
              enableRowActions={false}
              enableExport={true}
              exportFileName="shg_fund_allocation_list"
            />
          ) : (
            <ReusableTable
              key={`district-requested-fund-table-${appliedListFilters.financialYear}-${appliedListFilters.location}-${appliedListFilters.date}`}
              columns={districtRequestedFundColumns}
              data={filteredListFundData as DistrictRequestedFundRow[]}
              enableRowActions={false}
              enableExport={true}
              exportFileName="district_fund_allocation_list"
            />
          )}
        </div>
      </Card>

      {/* Small District Projects Modal (For non-CDPO) */}
      {districtModalData && (
        <Modal
          isOpen={isDistrictModalOpen}
          onClose={handleCloseDistrictModal}
          size="2xl"
          title={`${districtModalData.district} District Projects`}
          subtitle={`Detailed view of ${districtModalData.projects} ICDS Projects across ${districtModalData.district} District`}
          footer={
            <div className="flex items-center justify-between w-full">
              <span className="text-xs text-slate-500 dark:text-slate-400">
                Total Projects: <strong className="text-slate-700 dark:text-slate-200">{districtModalData.projects}</strong>
              </span>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={handleCloseDistrictModal}
              >
                Close
              </Button>
            </div>
          }
        >
          <div className="space-y-4">
            {/* Quick Summary Badges */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              <div className="p-2.5 rounded-xl bg-blue-50/80 dark:bg-blue-950/40 border border-blue-200/70 dark:border-blue-900/60 shadow-2xs">
                <p className="text-[11px] font-medium text-blue-700 dark:text-blue-300">Projects</p>
                <p className="text-sm font-bold font-mono text-blue-900 dark:text-blue-100">{districtModalData.projects}</p>
              </div>
              <div className="p-2.5 rounded-xl bg-indigo-50/80 dark:bg-indigo-950/40 border border-indigo-200/70 dark:border-indigo-900/60 shadow-2xs">
                <p className="text-[11px] font-medium text-indigo-700 dark:text-indigo-300">Sectors</p>
                <p className="text-sm font-bold font-mono text-indigo-900 dark:text-indigo-100">{districtModalData.sectors}</p>
              </div>
              <div className="p-2.5 rounded-xl bg-purple-50/80 dark:bg-purple-950/40 border border-purple-200/70 dark:border-purple-900/60 shadow-2xs">
                <p className="text-[11px] font-medium text-purple-700 dark:text-purple-300">AWCs</p>
                <p className="text-sm font-bold font-mono text-purple-900 dark:text-purple-100">{districtModalData.awcCount.toLocaleString('en-IN')}</p>
              </div>
              <div className="p-2.5 rounded-xl bg-amber-50/80 dark:bg-amber-950/40 border border-amber-200/70 dark:border-amber-900/60 shadow-2xs">
                <p className="text-[11px] font-medium text-amber-700 dark:text-amber-300">Total Children</p>
                <p className="text-sm font-bold font-mono text-amber-900 dark:text-amber-100">{(districtModalData.totalChildren || 0).toLocaleString('en-IN')}</p>
              </div>
            </div>

            {/* ReusableTable for Projects */}
            <ReusableTable
              key={`district-projects-table-${districtModalData.id}`}
              columns={districtProjectsColumns}
              data={modalProjectsData}
              enableRowActions={false}
              enableExport={true}
              exportFileName={`${districtModalData.district.toLowerCase()}_projects_list`}
            />
          </div>
        </Modal>
      )}
    </div>
  );
};

export default FundAllocationField;