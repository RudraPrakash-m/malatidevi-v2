// src/features/cdpo/pages/AddSupplyManagement.tsx

import React, { useState, useMemo, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import { PlusCircle, ArrowLeft, Check, Users, Shirt, Building2, Info } from 'lucide-react';

import Card from '@/shared/components/layout/Card';
import Button from '@/shared/components/ui/Button';
import Select from '@/shared/components/ui/Forms/Select';
import SearchableSelect from '@/shared/components/ui/Forms/SearchableSelect';
import MultiSelect from '@/shared/components/ui/Forms/MultiSelect';
import SupplyManagementList from './SupplyManagementList';
import { addSupplyManagementItem } from '../state/supplyManagementState';
import type { SizeBreakdown } from '../types/supply-management.types';

/* -------------------------------------------------------------
   Constants & Options
------------------------------------------------------------- */

// Unit rates per child
const ITEM_RATES = {
  sweater: { name: 'Sweater', rate: 300, color: 'amber' },
  uniform: { name: 'Uniform', rate: 400, color: 'purple' },
} as const;

export const FINANCIAL_YEAR_OPTIONS = [
  { label: '2025-26', value: '2025-26' },
  { label: '2026-27', value: '2026-27' },
  { label: '2027-28', value: '2027-28' },
];

export const SECTOR_OPTIONS = [
  { label: 'Sector 1', value: 'sector_1' },
  { label: 'Sector 2', value: 'sector_2' },
  { label: 'Sector 3', value: 'sector_3' },
  { label: 'Sector 4', value: 'sector_4' },
  { label: 'Sector 5', value: 'sector_5' },
  { label: 'Sector 6', value: 'sector_6' },
];

export const ALL_SECTOR_VALUES = SECTOR_OPTIONS.map((s) => s.value);

export const ITEM_CATEGORY_OPTIONS = [
  { label: 'Sweater', value: 'sw' },
  { label: 'Uniform', value: 'uniform' },
];

export const ALL_SHG_OPTIONS = [
  { label: 'SHG A', value: 'shg_a', sector: 'sector_1' },
  { label: 'SHG B', value: 'shg_b', sector: 'sector_2' },
  { label: 'Athmallik SHG', value: 'athmallik_shg', sector: 'sector_1' },
  { label: 'Angul SHG', value: 'angul_shg', sector: 'sector_3' },
  { label: 'Talcher SHG', value: 'talcher_shg', sector: 'sector_4' },
  { label: 'Chhendipada SHG', value: 'chhendipada_shg', sector: 'sector_5' },
];

interface CategorySizeBreakdown {
  boysSizes: Required<SizeBreakdown>;
  girlsSizes: Required<SizeBreakdown>;
}

// SHG Demographics mapping: Total AWC, Total Boys, Total Girls, and separate Sizes (22, 23, 24, 25) for SW and Uniform
interface ShgDemographics {
  name: string;
  totalAwc: number;
  totalBoys: number;
  totalGirls: number;
  sweater: CategorySizeBreakdown;
  uniform: CategorySizeBreakdown;
}

const SHG_DEMOGRAPHICS_MAP: Record<string, ShgDemographics> = {
  athmallik_shg: {
    name: 'Athmallik SHG',
    totalAwc: 15,
    totalBoys: 140,
    totalGirls: 160,
    sweater: {
      boysSizes: { size22: 30, size23: 45, size24: 40, size25: 25 },
      girlsSizes: { size22: 35, size23: 50, size24: 45, size25: 30 },
    },
    uniform: {
      boysSizes: { size22: 35, size23: 40, size24: 35, size25: 30 },
      girlsSizes: { size22: 40, size23: 45, size24: 40, size25: 35 },
    },
  },
  angul_shg: {
    name: 'Angul SHG',
    totalAwc: 12,
    totalBoys: 115,
    totalGirls: 135,
    sweater: {
      boysSizes: { size22: 25, size23: 35, size24: 30, size25: 25 },
      girlsSizes: { size22: 30, size23: 40, size24: 35, size25: 30 },
    },
    uniform: {
      boysSizes: { size22: 25, size23: 30, size24: 30, size25: 30 },
      girlsSizes: { size22: 30, size23: 35, size24: 35, size25: 35 },
    },
  },
  talcher_shg: {
    name: 'Talcher SHG',
    totalAwc: 18,
    totalBoys: 160,
    totalGirls: 180,
    sweater: {
      boysSizes: { size22: 35, size23: 45, size24: 45, size25: 35 },
      girlsSizes: { size22: 40, size23: 50, size24: 50, size25: 40 },
    },
    uniform: {
      boysSizes: { size22: 40, size23: 40, size24: 40, size25: 40 },
      girlsSizes: { size22: 45, size23: 45, size24: 45, size25: 45 },
    },
  },
  chhendipada_shg: {
    name: 'Chhendipada SHG',
    totalAwc: 14,
    totalBoys: 125,
    totalGirls: 145,
    sweater: {
      boysSizes: { size22: 28, size23: 37, size24: 35, size25: 25 },
      girlsSizes: { size22: 32, size23: 43, size24: 40, size25: 30 },
    },
    uniform: {
      boysSizes: { size22: 30, size23: 35, size24: 30, size25: 30 },
      girlsSizes: { size22: 35, size23: 40, size24: 35, size25: 35 },
    },
  },
  shg_a: {
    name: 'SHG A',
    totalAwc: 15,
    totalBoys: 140,
    totalGirls: 160,
    sweater: {
      boysSizes: { size22: 30, size23: 45, size24: 40, size25: 25 },
      girlsSizes: { size22: 35, size23: 50, size24: 45, size25: 30 },
    },
    uniform: {
      boysSizes: { size22: 35, size23: 40, size24: 35, size25: 30 },
      girlsSizes: { size22: 40, size23: 45, size24: 40, size25: 35 },
    },
  },
  shg_b: {
    name: 'SHG B',
    totalAwc: 18,
    totalBoys: 180,
    totalGirls: 220,
    sweater: {
      boysSizes: { size22: 40, size23: 50, size24: 50, size25: 40 },
      girlsSizes: { size22: 50, size23: 60, size24: 60, size25: 50 },
    },
    uniform: {
      boysSizes: { size22: 45, size23: 45, size24: 45, size25: 45 },
      girlsSizes: { size22: 55, size23: 55, size24: 55, size25: 55 },
    },
  },
};

const DEFAULT_CATEGORY_SIZES: CategorySizeBreakdown = {
  boysSizes: { size22: 25, size23: 25, size24: 25, size25: 25 },
  girlsSizes: { size22: 30, size23: 30, size24: 30, size25: 30 },
};

export const AddSupplyManagement: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const sizeGridRef = React.useRef<HTMLDivElement>(null);

  // Form states
  const [financialYear, setFinancialYear] = useState<string>('2025-26');
  const [selectedSectors, setSelectedSectors] = useState<string[]>(ALL_SECTOR_VALUES);
  const [selectedShg, setSelectedShg] = useState<string>('shg_a');
  const [selectedCategory, setSelectedCategory] = useState<string>('sw');

  // Filter SHGs by selected sectors
  const availableShgOptions = useMemo(() => {
    if (selectedSectors.length === 0) return ALL_SHG_OPTIONS;
    return ALL_SHG_OPTIONS.filter((shg) => selectedSectors.includes(shg.sector));
  }, [selectedSectors]);

  // If selected SHG is no longer in available list, auto-select first available or reset
  useEffect(() => {
    if (availableShgOptions.length > 0) {
      const isCurrentValid = availableShgOptions.some((shg) => shg.value === selectedShg);
      if (!isCurrentValid) {
        setSelectedShg(availableShgOptions[0].value);
      }
    } else {
      setSelectedShg('');
    }
  }, [availableShgOptions, selectedShg]);

  // Selected SHG demographics
  const shgData = useMemo<ShgDemographics | null>(() => {
    if (!selectedShg) return null;
    return (
      SHG_DEMOGRAPHICS_MAP[selectedShg] || {
        name: selectedShg,
        totalAwc: 10,
        totalBoys: 100,
        totalGirls: 120,
        sweater: DEFAULT_CATEGORY_SIZES,
        uniform: DEFAULT_CATEGORY_SIZES,
      }
    );
  }, [selectedShg]);

  // Active category key ('sweater' | 'uniform' | null)
  const activeCategoryKey = useMemo<'sweater' | 'uniform' | null>(() => {
    if (selectedCategory === 'sw') return 'sweater';
    if (selectedCategory === 'uniform') return 'uniform';
    return null;
  }, [selectedCategory]);

  // Current category sizes (different for SW vs Uniform)
  const currentCategorySizes = useMemo<CategorySizeBreakdown | null>(() => {
    if (!shgData || !activeCategoryKey) return null;
    return shgData[activeCategoryKey] || DEFAULT_CATEGORY_SIZES;
  }, [shgData, activeCategoryKey]);

  // Auto-scroll to Size Allocation Grid after selecting item category
  useEffect(() => {
    if (activeCategoryKey && selectedShg && sizeGridRef.current) {
      const timer = setTimeout(() => {
        sizeGridRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }, 120);
      return () => clearTimeout(timer);
    }
  }, [activeCategoryKey, selectedShg]);

  // Counts
  const totalAwc = shgData?.totalAwc || 0;
  const totalBoys = shgData?.totalBoys || 0;
  const totalGirls = shgData?.totalGirls || 0;
  const totalChildren = useMemo(() => totalBoys + totalGirls, [totalBoys, totalGirls]);

  // Financial calculations
  const itemRate = activeCategoryKey ? ITEM_RATES[activeCategoryKey].rate : 0;
  const totalCalculatedAmount = useMemo(() => {
    return totalChildren * itemRate;
  }, [totalChildren, itemRate]);

  // Form submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!financialYear) {
      toast.error('Please select a Financial Year.');
      return;
    }

    if (selectedSectors.length === 0) {
      toast.error('Please select at least one Sector.');
      return;
    }

    if (!selectedShg) {
      toast.error('Please select an SHG Name.');
      return;
    }

    if (!selectedCategory) {
      toast.error('Please select an Item Category.');
      return;
    }

    const currentShgData = SHG_DEMOGRAPHICS_MAP[selectedShg] || {
      name: selectedShg,
      totalAwc: totalAwc || 10,
      totalBoys,
      totalGirls,
      sweater: DEFAULT_CATEGORY_SIZES,
      uniform: DEFAULT_CATEGORY_SIZES,
    };

    const itemLabel = selectedCategory === 'sw' ? 'Sweater' : 'Uniform';
    const catKey = selectedCategory === 'sw' ? 'sweater' : 'uniform';
    const sizes = currentShgData[catKey] || DEFAULT_CATEGORY_SIZES;

    addSupplyManagementItem({
      financialYear: financialYear || '2025-26',
      shgName: currentShgData.name || selectedShg,
      itemCategory: itemLabel,
      quantity: totalChildren > 0 ? totalChildren : (itemLabel === 'Sweater' ? 300 : 400),
      orderDate: new Date().toISOString().split('T')[0],
      status: 'pending',
      boysSizes: sizes.boysSizes,
      girlsSizes: sizes.girlsSizes,
    });

    toast.success(
      id
        ? 'Supply Management order updated successfully!'
        : `Supply Management order created for ${currentShgData.name || 'SHG'} with Total: ₹${totalCalculatedAmount.toLocaleString(
          'en-IN'
        )}!`
    );
    navigate('/supply-management');
  };

  return (
    <div className="space-y-6">
      <Card
        title={id ? 'Edit Supply Management' : 'Add Supply Management'}
        icon={PlusCircle}
      >
        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Top Form Controls: Financial Year, Sector (MultiSelect), SHG Name, Item Category */}
          <div className="grid grid-cols-12 gap-4 items-start">
            {/* Financial Year */}
            <div className="col-span-12 sm:col-span-6 lg:col-span-3">
              <Select
                id="supply-fy-select"
                name="financialYear"
                label="Financial Year"
                required
                options={FINANCIAL_YEAR_OPTIONS}
                value={financialYear}
                onChange={(e) => setFinancialYear(e.target.value)}
                placeholder="Select Financial Year"
              />
            </div>

            {/* Sector Filter with MultiSelect (Default all checked) */}
            <div className="col-span-12 sm:col-span-6 lg:col-span-3">
              <MultiSelect
                id="supply-sector-filter"
                name="sectors"
                label="Sector"
                required
                options={SECTOR_OPTIONS}
                value={selectedSectors}
                onChange={(vals) => setSelectedSectors(vals as string[])}
                placeholder="Select Sectors..."
                helpText={`${selectedSectors.length} of ${SECTOR_OPTIONS.length} sectors selected`}
              />
            </div>

            {/* SHG Name */}
            <div className="col-span-12 sm:col-span-6 lg:col-span-3">
              <SearchableSelect
                id="supply-shg-select"
                label="SHG Name"
                required
                options={availableShgOptions}
                value={selectedShg}
                onChange={(val) => setSelectedShg(String(val || ''))}
                placeholder="Select SHG"
              />
            </div>

            {/* Item Category */}
            <div className="col-span-12 sm:col-span-6 lg:col-span-3">
              <Select
                id="supply-category-select"
                name="itemCategory"
                label="Item Category"
                required
                options={ITEM_CATEGORY_OPTIONS}
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                placeholder="Select Item Category"
              />
            </div>
          </div>
          {/* Dynamic Grid Sections */}
          {selectedShg && (
            <div className="w-full space-y-5 mt-3 pt-5 border-t border-slate-200/80 dark:border-slate-800">
              {/* Section 1: Demographics Grid Cards */}
              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-2.5 flex items-center gap-1.5">
                  <Building2 size={14} className="text-primary" />
                  <span>SHG Demographics Summary</span>
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
                  {/* Card 1: Total AWC */}
                  <div className="p-3.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-900/50 flex items-center justify-between shadow-2xs">
                    <div>
                      <p className="text-[11px] font-semibold text-slate-500 dark:text-slate-400">Total AWC</p>
                      <p className="text-lg font-bold font-mono text-slate-800 dark:text-slate-100 mt-0.5">{totalAwc}</p>
                    </div>
                    <div className="w-9 h-9 rounded-lg bg-slate-200/70 dark:bg-slate-800 flex items-center justify-center text-slate-600 dark:text-slate-300">
                      <Building2 size={18} />
                    </div>
                  </div>

                  {/* Card 2: Total Children */}
                  <div className="p-3.5 rounded-xl border border-blue-200 dark:border-blue-900/60 bg-blue-50/50 dark:bg-blue-950/20 flex items-center justify-between shadow-2xs">
                    <div>
                      <p className="text-[11px] font-semibold text-blue-700 dark:text-blue-300">Total Benificiaries</p>
                      <p className="text-lg font-bold font-mono text-blue-900 dark:text-blue-200 mt-0.5">{totalChildren}</p>
                    </div>
                    <div className="w-9 h-9 rounded-lg bg-blue-100 dark:bg-blue-900/60 flex items-center justify-center text-blue-700 dark:text-blue-300">
                      <Users size={18} />
                    </div>
                  </div>

                  {/* Card 3: Total Boys */}
                  <div className="p-3.5 rounded-xl border border-sky-200 dark:border-sky-900/60 bg-sky-50/50 dark:bg-sky-950/20 flex items-center justify-between shadow-2xs">
                    <div>
                      <p className="text-[11px] font-semibold text-sky-700 dark:text-sky-300">Total Boys</p>
                      <p className="text-lg font-bold font-mono text-sky-900 dark:text-sky-200 mt-0.5">{totalBoys}</p>
                    </div>
                    <div className="w-9 h-9 rounded-lg bg-sky-100 dark:bg-sky-900/60 flex items-center justify-center text-sky-700 dark:text-sky-300">
                      <Users size={18} />
                    </div>
                  </div>

                  {/* Card 4: Total Girls */}
                  <div className="p-3.5 rounded-xl border border-rose-200 dark:border-rose-900/60 bg-rose-50/50 dark:bg-rose-950/20 flex items-center justify-between shadow-2xs">
                    <div>
                      <p className="text-[11px] font-semibold text-rose-700 dark:text-rose-300">Total Girls</p>
                      <p className="text-lg font-bold font-mono text-rose-900 dark:text-rose-200 mt-0.5">{totalGirls}</p>
                    </div>
                    <div className="w-9 h-9 rounded-lg bg-rose-100 dark:bg-rose-900/60 flex items-center justify-center text-rose-700 dark:text-rose-300">
                      <Shirt size={18} />
                    </div>
                  </div>
                </div>
              </div>

              {/* Section 2: Size Distribution Matrix Grid (Shown ONLY when category is selected) */}
              {activeCategoryKey && currentCategorySizes ? (
                <div ref={sizeGridRef} className="scroll-mt-6 transition-all duration-300">
                  <div className="flex items-center justify-between mb-2.5">
                    <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                      <Shirt size={14} className="text-primary" />
                      <span>
                        {activeCategoryKey === 'sweater' ? 'Sweater (SW)' : 'Uniform'} Size Allocation Grid
                      </span>
                    </h4>
                  </div>

                  {/* Matrix Table Grid */}
                  <div className="overflow-hidden rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-2xs">
                    <table className="w-full text-left border-collapse text-xs">
                      <thead>
                        <tr className="border-b border-slate-200 dark:border-slate-800 bg-slate-100/80 dark:bg-slate-800/60 font-semibold text-slate-700 dark:text-slate-300">
                          <th className="py-2.5 px-4">Gender Group</th>
                          <th className="py-2.5 px-3 text-center">Size 22</th>
                          <th className="py-2.5 px-3 text-center">Size 23</th>
                          <th className="py-2.5 px-3 text-center">Size 24</th>
                          <th className="py-2.5 px-3 text-center">Size 25</th>
                          <th className="py-2.5 px-4 text-right">Group Total</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                        {/* Boys Row */}
                        <tr className="hover:bg-sky-50/30 dark:hover:bg-sky-950/10 transition-colors">
                          <td className="py-2.5 px-4 font-bold text-sky-800 dark:text-sky-300 flex items-center gap-2">
                            {/* <span className="w-2 h-2 rounded-full bg-sky-500"></span> */}
                            <span>Boys</span>
                          </td>
                          <td className="py-2.5 px-3 text-center">
                            <span className="inline-block min-w-[50px] py-1 px-2.5 rounded-lg bg-sky-50/80 dark:bg-sky-950/50 border border-sky-200 dark:border-sky-800/80 font-mono font-bold text-sky-900 dark:text-sky-200 shadow-2xs">
                              {currentCategorySizes.boysSizes.size22}
                            </span>
                          </td>
                          <td className="py-2.5 px-3 text-center">
                            <span className="inline-block min-w-[50px] py-1 px-2.5 rounded-lg bg-sky-50/80 dark:bg-sky-950/50 border border-sky-200 dark:border-sky-800/80 font-mono font-bold text-sky-900 dark:text-sky-200 shadow-2xs">
                              {currentCategorySizes.boysSizes.size23}
                            </span>
                          </td>
                          <td className="py-2.5 px-3 text-center">
                            <span className="inline-block min-w-[50px] py-1 px-2.5 rounded-lg bg-sky-50/80 dark:bg-sky-950/50 border border-sky-200 dark:border-sky-800/80 font-mono font-bold text-sky-900 dark:text-sky-200 shadow-2xs">
                              {currentCategorySizes.boysSizes.size24}
                            </span>
                          </td>
                          <td className="py-2.5 px-3 text-center">
                            <span className="inline-block min-w-[50px] py-1 px-2.5 rounded-lg bg-sky-50/80 dark:bg-sky-950/50 border border-sky-200 dark:border-sky-800/80 font-mono font-bold text-sky-900 dark:text-sky-200 shadow-2xs">
                              {currentCategorySizes.boysSizes.size25}
                            </span>
                          </td>
                          <td className="py-2.5 px-4 text-right font-mono font-bold text-sky-900 dark:text-sky-200">
                            {totalBoys}
                          </td>
                        </tr>

                        {/* Girls Row */}
                        <tr className="hover:bg-rose-50/30 dark:hover:bg-rose-950/10 transition-colors">
                          <td className="py-2.5 px-4 font-bold text-rose-800 dark:text-rose-300 flex items-center gap-2">
                            <span>Girls</span>
                          </td>
                          <td className="py-2.5 px-3 text-center">
                            <span className="inline-block min-w-[50px] py-1 px-2.5 rounded-lg bg-rose-50/80 dark:bg-rose-950/50 border border-rose-200 dark:border-rose-800/80 font-mono font-bold text-rose-900 dark:text-rose-200 shadow-2xs">
                              {currentCategorySizes.girlsSizes.size22}
                            </span>
                          </td>
                          <td className="py-2.5 px-3 text-center">
                            <span className="inline-block min-w-[50px] py-1 px-2.5 rounded-lg bg-rose-50/80 dark:bg-rose-950/50 border border-rose-200 dark:border-rose-800/80 font-mono font-bold text-rose-900 dark:text-rose-200 shadow-2xs">
                              {currentCategorySizes.girlsSizes.size23}
                            </span>
                          </td>
                          <td className="py-2.5 px-3 text-center">
                            <span className="inline-block min-w-[50px] py-1 px-2.5 rounded-lg bg-rose-50/80 dark:bg-rose-950/50 border border-rose-200 dark:border-rose-800/80 font-mono font-bold text-rose-900 dark:text-rose-200 shadow-2xs">
                              {currentCategorySizes.girlsSizes.size24}
                            </span>
                          </td>
                          <td className="py-2.5 px-3 text-center">
                            <span className="inline-block min-w-[50px] py-1 px-2.5 rounded-lg bg-rose-50/80 dark:bg-rose-950/50 border border-rose-200 dark:border-rose-800/80 font-mono font-bold text-rose-900 dark:text-rose-200 shadow-2xs">
                              {currentCategorySizes.girlsSizes.size25}
                            </span>
                          </td>
                          <td className="py-2.5 px-4 text-right font-mono font-bold text-rose-900 dark:text-rose-200">
                            {totalGirls}
                          </td>
                        </tr>
                      </tbody>
                      <tfoot>
                        <tr className="border-t border-slate-200 dark:border-slate-700 bg-slate-50/90 dark:bg-slate-800/80 font-bold">
                          <td className="py-2.5 px-4 text-slate-800 dark:text-slate-200">Size Total</td>
                          <td className="py-2.5 px-3 text-center font-mono text-slate-700 dark:text-slate-300">
                            {currentCategorySizes.boysSizes.size22 + currentCategorySizes.girlsSizes.size22}
                          </td>
                          <td className="py-2.5 px-3 text-center font-mono text-slate-700 dark:text-slate-300">
                            {currentCategorySizes.boysSizes.size23 + currentCategorySizes.girlsSizes.size23}
                          </td>
                          <td className="py-2.5 px-3 text-center font-mono text-slate-700 dark:text-slate-300">
                            {currentCategorySizes.boysSizes.size24 + currentCategorySizes.girlsSizes.size24}
                          </td>
                          <td className="py-2.5 px-3 text-center font-mono text-slate-700 dark:text-slate-300">
                            {currentCategorySizes.boysSizes.size25 + currentCategorySizes.girlsSizes.size25}
                          </td>
                          <td className="py-2.5 px-4 text-right font-mono text-emerald-700 dark:text-emerald-400 font-extrabold text-sm">
                            {totalChildren}
                          </td>
                        </tr>
                      </tfoot>
                    </table>
                  </div>
                </div>
              ) : (
                <div className="p-4 rounded-xl border border-dashed border-slate-300 dark:border-slate-700 bg-slate-50/60 dark:bg-slate-900/30 flex items-center gap-2.5 text-xs text-slate-500 dark:text-slate-400">
                  <Info size={16} className="text-primary" />
                  <span>Please select an <strong>Item Category</strong> (SW or Uniform) above to load the size distribution grid and pricing calculation.</span>
                </div>
              )}
            </div>
          )}

          {/* Action Buttons: Strictly Full-width & Centered */}
          <div className="w-full flex items-center justify-center gap-3 mt-6 pt-5 border-t border-slate-200/80 dark:border-slate-800">
            <Button
              type="button"
              variant="outline"
              label="Back"
              size="md"
              icon={<ArrowLeft size={16} />}
              onClick={() => navigate('/supply-management')}
            />
            <Button
              type="submit"
              variant="primary"
              label={id ? 'Update Supply Order' : 'Create Supply Order'}
              size="md"
              icon={<Check size={16} />}
            />
          </div>
        </form>
      </Card>

      {/* Supply Management List Table below */}
      <SupplyManagementList />
    </div>
  );
};

export default AddSupplyManagement;
