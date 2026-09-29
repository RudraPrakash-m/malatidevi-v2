// src/features/fund-allocation/pages/AddFundAllocation.tsx

import React, { useState, useEffect, useMemo } from 'react';
import { useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import { PlusCircle, Send, RotateCcw } from 'lucide-react';

import type { RootState } from '@/app/store';
import Card from '@/shared/components/layout/Card';
import Button from '@/shared/components/ui/Button';
import Select from '@/shared/components/ui/Forms/Select';
import Input from '@/shared/components/ui/Forms/Input';
import { DswoFundRequestList } from '../components/DswoFundRequestList';
import {
  ODISHA_DISTRICT_STATS,
  getDistrictInitialData,
  type FundRequestItem,
} from '@/features/state/pages/FundRequestList';

/* -------------------------------------------------------------
   Constants & Options
------------------------------------------------------------- */

const FINANCIAL_YEAR_OPTIONS = [
  { label: '2025-26', value: '2025-26' },
  { label: '2026-27', value: '2026-27' },
  { label: '2027-28', value: '2027-28' },
];

const ITEM_CATEGORY_OPTIONS = [
  { label: 'Uniform', value: 'Uniform' },
  { label: 'Sweater', value: 'Sweater' },
  { label: 'Shoes & Socks', value: 'Shoes & Socks' },
];

const ITEM_PRICES: Record<string, number> = {
  Uniform: 350,
  Sweater: 250,
};

export const AddFundAllocation: React.FC = () => {
  // Get logged-in user and their respective district
  const authUser = useSelector((state: RootState) => state.auth.user);
  const currentDistrict = authUser?.district || 'Cuttack';

  // Fund requests data for this respective district
  const [data, setData] = useState<FundRequestItem[]>(() =>
    getDistrictInitialData(currentDistrict)
  );

  // Sync data if user district changes
  useEffect(() => {
    setData(getDistrictInitialData(currentDistrict));
  }, [currentDistrict]);

  // Form States
  const [financialYear, setFinancialYear] = useState<string>('');
  const [itemCategory, setItemCategory] = useState<string>('');
  const [requestedAmount, setRequestedAmount] = useState<string>('');
  const [isAmountManuallyEdited, setIsAmountManuallyEdited] = useState<boolean>(false);

  // Fetched District Info based on chosen Financial Year and Logged-in DSWO District
  const fetchedData = useMemo(() => {
    if (!financialYear) {
      return {
        district: '',
        projects: '',
        sectors: '',
        awcCount: '',
        totalChildren: '',
        totalChildrenNum: 0,
      };
    }

    const stat =
      ODISHA_DISTRICT_STATS[currentDistrict] || ODISHA_DISTRICT_STATS['Cuttack'];

    // Slight year-over-year demographic growth adjustment for demonstration
    let multiplier = 1.0;
    if (financialYear === '2026-27') multiplier = 1.026;
    if (financialYear === '2027-28') multiplier = 1.059;

    const adjustedChildren = Math.round(stat.totalChildren * multiplier);

    return {
      district: currentDistrict,
      projects: stat.projects.toString(),
      sectors: stat.sectors.toString(),
      awcCount: stat.awcCount.toLocaleString('en-IN'),
      totalChildren: adjustedChildren.toLocaleString('en-IN'),
      totalChildrenNum: adjustedChildren,
    };
  }, [financialYear, currentDistrict]);

  // Unit rate sum based on chosen item category
  const unitRate = useMemo(() => {
    return ITEM_PRICES[itemCategory] || 0;
  }, [itemCategory]);

  // Automatically compute and pre-fill amount when category or FY change, unless manually modified
  useEffect(() => {
    if (!isAmountManuallyEdited) {
      if (unitRate > 0 && fetchedData.totalChildrenNum > 0) {
        const calculated = fetchedData.totalChildrenNum * unitRate;
        setRequestedAmount(calculated.toString());
      } else if (!itemCategory) {
        setRequestedAmount('');
      }
    }
  }, [unitRate, fetchedData.totalChildrenNum, isAmountManuallyEdited, itemCategory]);

  // Handle Financial Year Change
  const handleFinancialYearChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const val = e.target.value;
    setFinancialYear(val);
    setIsAmountManuallyEdited(false);
  };

  // Handle Item Category Change
  const handleCategoryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setItemCategory(e.target.value);
    setIsAmountManuallyEdited(false);
  };

  // Handle manual changes to Requested Amount
  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setIsAmountManuallyEdited(true);
    setRequestedAmount(e.target.value);
  };

  // Handle Reset Form
  const handleReset = () => {
    setFinancialYear('');
    setItemCategory('');
    setRequestedAmount('');
    setIsAmountManuallyEdited(false);
    toast.info('Form has been reset.');
  };

  // Handle Submit Fund Request
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!financialYear) {
      toast.warning('Please select Financial Year.');
      return;
    }

    if (!itemCategory) {
      toast.warning('Please select an Item Category.');
      return;
    }

    if (!requestedAmount || parseFloat(requestedAmount) <= 0) {
      toast.warning('Please enter a valid Requested Amount.');
      return;
    }

    const numAmount = parseFloat(requestedAmount);
    const newRequest: FundRequestItem = {
      id: String(Date.now()).slice(-4),
      financialYear,
      district: currentDistrict,
      project: fetchedData.projects,
      sectors: Number(fetchedData.sectors),
      awcCount: Number(fetchedData.awcCount.replace(/,/g, '')),
      totalChildren: fetchedData.totalChildrenNum,
      itemCategory: itemCategory,
      requestedAmt: numAmount,
      allocateAmount: 0,
      fundAllocated: 0,
      status: 'PENDING',
      applicationDate: new Date().toLocaleDateString('en-GB'),
      requestedBy: `DSWO ${currentDistrict}`,
      purpose: `Procurement request of ${itemCategory} for preschool children across ${currentDistrict} district [FY ${financialYear}]`,
    };

    setData((prev) => [newRequest, ...prev]);
    toast.success(
      `Fund request of ₹${numAmount.toLocaleString('en-IN')} submitted successfully for ${currentDistrict} district [FY ${financialYear}]!`
    );

    // Reset inputs
    setFinancialYear('');
    setItemCategory('');
    setRequestedAmount('');
    setIsAmountManuallyEdited(false);
  };

  return (
    <div className="space-y-6">
      <Card
        title={`Fund Request - ${currentDistrict} District`}
        icon={PlusCircle}
      >
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Form Fields Grid */}
          <div className="grid grid-cols-12 gap-4">
            {/* 1. Financial Year */}
            <div className="col-span-12 sm:col-span-6 lg:col-span-3">
              <Select
                id="request-financial-year"
                name="financialYear"
                label="Financial Year"
                required
                options={FINANCIAL_YEAR_OPTIONS}
                value={financialYear}
                onChange={handleFinancialYearChange}
                placeholder="Select Financial Year"
              />
            </div>

            {/* 2. Item Category (Just after Financial Year) */}
            <div className="col-span-12 sm:col-span-6 lg:col-span-3">
              <Select
                id="request-item-category"
                name="itemCategory"
                label="Item Category"
                placeholder="Select Category"
                options={ITEM_CATEGORY_OPTIONS}
                value={itemCategory}
                onChange={handleCategoryChange}
                required
              />
            </div>

            {/* 3. District (Pre-filled & fetched upon FY selection) */}
            <div className="col-span-12 sm:col-span-6 lg:col-span-3">
              <Input
                id="request-district"
                name="district"
                label="District"
                value={fetchedData.district}
                placeholder={financialYear ? currentDistrict : 'Auto-filled on FY select'}
                disabled
              />
            </div>

            {/* 4. Project */}
            <div className="col-span-12 sm:col-span-6 lg:col-span-3">
              <Input
                id="request-project"
                name="project"
                label="Project"
                value={fetchedData.projects}
                placeholder={financialYear ? fetchedData.projects : 'Auto-filled'}
                disabled
              />
            </div>

            {/* 5. Sector */}
            <div className="col-span-12 sm:col-span-6 lg:col-span-3">
              <Input
                id="request-sector"
                name="sector"
                label="Sector"
                value={fetchedData.sectors}
                placeholder={financialYear ? fetchedData.sectors : 'Auto-filled'}
                disabled
              />
            </div>

            {/* 6. AWC */}
            <div className="col-span-12 sm:col-span-6 lg:col-span-3">
              <Input
                id="request-awc"
                name="awc"
                label="AWC"
                value={fetchedData.awcCount}
                placeholder={financialYear ? fetchedData.awcCount : 'Auto-filled'}
                disabled
              />
            </div>

            {/* 7. Total Children */}
            <div className="col-span-12 sm:col-span-6 lg:col-span-3">
              <Input
                id="request-total-children"
                name="totalChildren"
                label="Total Children"
                value={fetchedData.totalChildren}
                placeholder={financialYear ? fetchedData.totalChildren : 'Auto-filled'}
                disabled
              />
            </div>

            {/* 8. Requested Amount (Pre-filled by calculation & editable) */}
            <div className="col-span-12 sm:col-span-6 lg:col-span-3">
              <Input
                id="request-amount"
                name="amount"
                label="Requested Amount (₹)"
                placeholder="Enter Requested Amount"
                type="number"
                value={requestedAmount}
                onChange={handleAmountChange}
                required
              />
            </div>
          </div>

          {/* Action Buttons: Centered Submit & Reset */}
          <div className="flex items-center justify-center gap-3 pt-2">
            <Button
              type="submit"
              variant="primary"
              label="Submit Request"
              size="md"
              icon={<Send size={16} />}
              disabled={
                !financialYear ||
                !itemCategory ||
                !requestedAmount ||
                parseFloat(requestedAmount) <= 0
              }
            />

            {(financialYear || itemCategory || requestedAmount) && (
              <Button
                type="button"
                variant="secondary"
                label="Reset"
                size="md"
                icon={<RotateCcw size={16} />}
                onClick={handleReset}
              />
            )}
          </div>
        </form>

        {/* Records Table Section */}
        <div className="mt-8 pt-6 border-t border-slate-200 dark:border-slate-800">
          <DswoFundRequestList
            district={currentDistrict}
            data={data}
            setData={setData}
          />
        </div>
      </Card>
    </div>
  );
};

export default AddFundAllocation;
