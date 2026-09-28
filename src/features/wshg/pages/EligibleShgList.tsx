// src/features/wshg/pages/EligibleShgList.tsx

import React, { useState, useMemo } from 'react';
import type { MRT_ColumnDef } from 'material-react-table';
import {
  Building2,
  RotateCcw,
  Search,
  Filter,
} from 'lucide-react';
import Card from '@/shared/components/layout/Card';
import Button from '@/shared/components/ui/Button';
import Select from '@/shared/components/ui/Forms/Select';
import Input from '@/shared/components/ui/Forms/Input';
import DatePicker from '@/shared/components/ui/Forms/DatePicker';
import { ReusableTable } from '@/shared/components/ui/Table';
import ActionButtons from '@/shared/components/ui/Actions/ActionButtons';
import { Modal } from '@/shared/components/ui/Modal/Modal';

/* -------------------------------------------------------------
   Types & Interfaces
------------------------------------------------------------- */

export interface EligibleShgItem {
  id: string;
  slNo: number;
  shgName: string;
  applicationId: string;
  status: 'active' | 'inactive';
  dateOfApply: string;
  dateOfApprove: string;

  // Detailed modal metadata
  shgCode: string;
  presidentName: string;
  contactNumber: string;
  district: string;
  sector: string;
  totalMembers: number;
  bankName: string;
  accountNumber: string;
  ifscCode: string;
  approvedBy: string;
  remarks: string;
  taggedAwcCount: number;
}

/* -------------------------------------------------------------
   Initial Dataset (Approved & Eligible SHGs)
------------------------------------------------------------- */

const INITIAL_ELIGIBLE_SHG_DATA: EligibleShgItem[] = [
  {
    id: 'shg-01',
    slNo: 1,
    shgName: 'Maa Tarini SHG',
    applicationId: 'SHG-2025-APP-0102',
    status: 'active',
    dateOfApply: '12/03/2025',
    dateOfApprove: '25/03/2025',
    shgCode: 'SHG-KJR-001',
    presidentName: 'Smt. Mamata Mohanta',
    contactNumber: '+91 98765 43210',
    district: 'Keonjhar',
    sector: 'Keonjhar Sadar',
    totalMembers: 12,
    bankName: 'State Bank of India',
    accountNumber: '•••• •••• 4512',
    ifscCode: 'SBIN0001234',
    approvedBy: 'DSWO Keonjhar (Approved via L3)',
    remarks: 'Verified complete documentation and production capability for uniforms and sweaters.',
    taggedAwcCount: 4,
  },
  {
    id: 'shg-02',
    slNo: 2,
    shgName: 'Maa Mangala SHG',
    applicationId: 'SHG-2025-APP-0145',
    status: 'active',
    dateOfApply: '15/03/2025',
    dateOfApprove: '29/03/2025',
    shgCode: 'SHG-KJR-002',
    presidentName: 'Smt. Pravasini Sahoo',
    contactNumber: '+91 98765 43211',
    district: 'Keonjhar',
    sector: 'Keonjhar Sadar',
    totalMembers: 15,
    bankName: 'Bank of India',
    accountNumber: '•••• •••• 8923',
    ifscCode: 'BKID0004567',
    approvedBy: 'DSWO Keonjhar (Approved via L3)',
    remarks: 'All quality checks and bank credentials verified successfully.',
    taggedAwcCount: 3,
  },
  {
    id: 'shg-03',
    slNo: 3,
    shgName: 'Sakhi Swyamsiddha SHG',
    applicationId: 'SHG-2025-APP-0189',
    status: 'active',
    dateOfApply: '20/03/2025',
    dateOfApprove: '04/04/2025',
    shgCode: 'SHG-GJM-003',
    presidentName: 'Smt. Anita Pradhan',
    contactNumber: '+91 98765 43212',
    district: 'Ganjam',
    sector: 'Bhanjanagar',
    totalMembers: 10,
    bankName: 'Punjab National Bank',
    accountNumber: '•••• •••• 1109',
    ifscCode: 'PUNB0007890',
    approvedBy: 'DSWO Ganjam (Approved via L3)',
    remarks: 'Prior experience in school apparel delivery, high reliability rating.',
    taggedAwcCount: 3,
  },
  {
    id: 'shg-04',
    slNo: 4,
    shgName: 'Subhadra Mahila Mandal',
    applicationId: 'SHG-2025-APP-0231',
    status: 'inactive',
    dateOfApply: '02/04/2025',
    dateOfApprove: '18/04/2025',
    shgCode: 'SHG-GJM-004',
    presidentName: 'Smt. Geetanjali Das',
    contactNumber: '+91 98765 43213',
    district: 'Ganjam',
    sector: 'Bhanjanagar',
    totalMembers: 14,
    bankName: 'UCO Bank',
    accountNumber: '•••• •••• 6745',
    ifscCode: 'UCBA0001122',
    approvedBy: 'DSWO Ganjam (Approved via L3)',
    remarks: 'Temporarily deactivated pending annual renewal and audit clearance.',
    taggedAwcCount: 2,
  },
  {
    id: 'shg-05',
    slNo: 5,
    shgName: 'Durga Self Help Group',
    applicationId: 'SHG-2025-APP-0294',
    status: 'active',
    dateOfApply: '10/04/2025',
    dateOfApprove: '24/04/2025',
    shgCode: 'SHG-BAL-005',
    presidentName: 'Smt. Runu Rani Jena',
    contactNumber: '+91 98765 43214',
    district: 'Balasore',
    sector: 'Remuna',
    totalMembers: 11,
    bankName: 'Canara Bank',
    accountNumber: '•••• •••• 3341',
    ifscCode: 'CNRB0002233',
    approvedBy: 'DSWO Balasore (Approved via L3)',
    remarks: 'Compliant with tailoring machinery infrastructure standards.',
    taggedAwcCount: 3,
  },
  {
    id: 'shg-06',
    slNo: 6,
    shgName: 'Maa Bhabani SHG',
    applicationId: 'SHG-2025-APP-0348',
    status: 'active',
    dateOfApply: '18/04/2025',
    dateOfApprove: '02/05/2025',
    shgCode: 'SHG-BAL-006',
    presidentName: 'Smt. Basanti Nayak',
    contactNumber: '+91 98765 43215',
    district: 'Balasore',
    sector: 'Remuna',
    totalMembers: 13,
    bankName: 'State Bank of India',
    accountNumber: '•••• •••• 9812',
    ifscCode: 'SBIN0005544',
    approvedBy: 'DSWO Balasore (Approved via L3)',
    remarks: 'Active and verified by both BLF and BLC committees.',
    taggedAwcCount: 2,
  },
  {
    id: 'shg-07',
    slNo: 7,
    shgName: 'Utkalika Mahila Samiti',
    applicationId: 'SHG-2025-APP-0410',
    status: 'inactive',
    dateOfApply: '22/04/2025',
    dateOfApprove: '06/05/2025',
    shgCode: 'SHG-MAY-007',
    presidentName: 'Smt. Minati Behera',
    contactNumber: '+91 98765 43216',
    district: 'Mayurbhanj',
    sector: 'Baripada',
    totalMembers: 10,
    bankName: 'Indian Overseas Bank',
    accountNumber: '•••• •••• 5521',
    ifscCode: 'IOBA0009988',
    approvedBy: 'DSWO Mayurbhanj (Approved via L3)',
    remarks: 'Inactive due to leadership handover and bank signatory updates.',
    taggedAwcCount: 0,
  },
  {
    id: 'shg-08',
    slNo: 8,
    shgName: 'Radha Krishna SHG',
    applicationId: 'SHG-2025-APP-0472',
    status: 'active',
    dateOfApply: '05/05/2025',
    dateOfApprove: '19/05/2025',
    shgCode: 'SHG-MAY-008',
    presidentName: 'Smt. Sabita Sethi',
    contactNumber: '+91 98765 43217',
    district: 'Mayurbhanj',
    sector: 'Baripada',
    totalMembers: 16,
    bankName: 'Bank of Baroda',
    accountNumber: '•••• •••• 7733',
    ifscCode: 'BARB0003322',
    approvedBy: 'DSWO Mayurbhanj (Approved via L3)',
    remarks: 'Eligible for direct project allocations.',
    taggedAwcCount: 4,
  },
];

const STATUS_FILTER_OPTIONS = [
  { value: 'all', label: 'All Status' },
  { value: 'active', label: 'Active' },
  { value: 'inactive', label: 'Inactive' },
];

/* -------------------------------------------------------------
   Main Component: EligibleShgList
------------------------------------------------------------- */

export const EligibleShgList: React.FC = () => {
  const [data] = useState<EligibleShgItem[]>(INITIAL_ELIGIBLE_SHG_DATA);
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [dateFilter, setDateFilter] = useState<string>('');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [appliedFilters, setAppliedFilters] = useState<{
    status: string;
    date: string;
    search: string;
  }>({
    status: 'all',
    date: '',
    search: '',
  });
  const [selectedShg, setSelectedShg] = useState<EligibleShgItem | null>(null);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);

  // Handle open modal
  const handleOpenView = (item: EligibleShgItem) => {
    setSelectedShg(item);
    setIsModalOpen(true);
  };

  // Handle close modal
  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedShg(null);
  };

  // Check if any filter is active
  const isFilterActive =
    statusFilter !== 'all' ||
    dateFilter !== '' ||
    searchQuery !== '' ||
    appliedFilters.status !== 'all' ||
    appliedFilters.date !== '' ||
    appliedFilters.search !== '';

  // Apply filters
  const handleApplyFilters = () => {
    setAppliedFilters({
      status: statusFilter,
      date: dateFilter,
      search: searchQuery,
    });
  };

  // Reset filters
  const handleResetFilters = () => {
    setStatusFilter('all');
    setDateFilter('');
    setSearchQuery('');
    setAppliedFilters({
      status: 'all',
      date: '',
      search: '',
    });
  };

  // Filtered dataset based on appliedFilters
  const filteredData = useMemo(() => {
    return data.filter((item) => {
      if (appliedFilters.status !== 'all' && item.status !== appliedFilters.status) {
        return false;
      }
      if (appliedFilters.date && appliedFilters.date.trim()) {
        const filterDateRaw = appliedFilters.date.trim();
        let filterDateNormalized = filterDateRaw;
        if (filterDateRaw.includes('-')) {
          const [y, m, d] = filterDateRaw.split('-');
          if (y && m && d) {
            filterDateNormalized = `${d.padStart(2, '0')}/${m.padStart(2, '0')}/${y}`;
          }
        }
        const applyDate = (item.dateOfApply || '').trim();
        const approveDate = (item.dateOfApprove || '').trim();
        const matchesDate =
          applyDate === filterDateNormalized ||
          applyDate === filterDateRaw ||
          approveDate === filterDateNormalized ||
          approveDate === filterDateRaw;
        if (!matchesDate) {
          return false;
        }
      }
      if (appliedFilters.search && appliedFilters.search.trim()) {
        const q = appliedFilters.search.toLowerCase().trim();
        const matchesName = item.shgName.toLowerCase().includes(q);
        const matchesAppId = item.applicationId.toLowerCase().includes(q);
        const matchesSector = item.sector.toLowerCase().includes(q);
        const matchesDistrict = item.district.toLowerCase().includes(q);
        const matchesPresident = item.presidentName.toLowerCase().includes(q);
        if (
          !matchesName &&
          !matchesAppId &&
          !matchesSector &&
          !matchesDistrict &&
          !matchesPresident
        ) {
          return false;
        }
      }
      return true;
    });
  }, [data, appliedFilters]);

  // Counts
  const totalCount = data.length;
  const activeCount = data.filter((d) => d.status === 'active').length;
  const inactiveCount = data.filter((d) => d.status === 'inactive').length;

  // Table Column Definitions matching user's requested specification:
  // sl no, shg name, application id, status(active/inactive), date of apply, date of approve, action(view)
  const columns = useMemo<MRT_ColumnDef<EligibleShgItem>[]>(
    () => [
      {
        accessorKey: 'slNo',
        header: 'Sl. No',
        size: 65,
        minSize: 55,
        muiTableHeadCellProps: { align: 'center' },
        muiTableBodyCellProps: { align: 'center' },
        Cell: ({ cell, row }) => (
          <span className="font-mono text-xs text-slate-600 dark:text-slate-400 font-medium">
            {cell.getValue<number>() || row.index + 1}
          </span>
        ),
      },
      {
        accessorKey: 'shgName',
        header: 'SHG Name',
        size: 240,
        minSize: 180,
        Cell: ({ row }) => (
          <span className="font-semibold text-xs text-slate-900 dark:text-slate-100">
            {row.original.shgName}
          </span>
        ),
      },
      {
        accessorKey: 'applicationId',
        header: 'Application ID',
        size: 170,
        minSize: 140,
        muiTableHeadCellProps: { align: 'center' },
        muiTableBodyCellProps: { align: 'center' },
        Cell: ({ cell }) => (
          <span className="font-mono text-xs font-semibold text-slate-800 dark:text-slate-200">
            {cell.getValue<string>()}
          </span>
        ),
      },
      {
        accessorKey: 'status',
        header: 'Status',
        size: 130,
        minSize: 110,
        muiTableHeadCellProps: { align: 'center' },
        muiTableBodyCellProps: { align: 'center' },
        Cell: ({ cell }) => {
          const status = cell.getValue<string>();
          const isActive = status === 'active';
          return (
            <span
              className={`text-xs font-semibold ${isActive
                  ? 'text-emerald-600 dark:text-emerald-400'
                  : 'text-rose-600 dark:text-rose-400'
                }`}
            >
              {isActive ? 'Active' : 'Inactive'}
            </span>
          );
        },
      },
      {
        accessorKey: 'dateOfApply',
        header: 'Date of Apply',
        size: 120,
        minSize: 105,
        muiTableHeadCellProps: { align: 'center' },
        muiTableBodyCellProps: { align: 'center' },
        Cell: ({ cell }) => (
          <span className="font-mono text-xs text-slate-700 dark:text-slate-300 font-medium">
            {cell.getValue<string>()}
          </span>
        ),
      },
      {
        accessorKey: 'dateOfApprove',
        header: 'Date of Approve',
        size: 120,
        minSize: 105,
        muiTableHeadCellProps: { align: 'center' },
        muiTableBodyCellProps: { align: 'center' },
        Cell: ({ cell }) => (
          <span className="font-mono text-xs font-medium text-slate-800 dark:text-slate-200">
            {cell.getValue<string>()}
          </span>
        ),
      },
      {
        id: 'action',
        header: 'Action',
        size: 80,
        minSize: 75,
        muiTableHeadCellProps: { align: 'center' },
        muiTableBodyCellProps: { align: 'center' },
        Cell: ({ row }) => (
          <div className="flex items-center justify-center">
            <ActionButtons
              actions={['view']}
              onAction={() => handleOpenView(row.original)}
              actionTitles={{ view: 'View' }}
            />
          </div>
        ),
      },
    ],
    []
  );

  return (
    <div className="space-y-6">
      {/* Main Card */}
      <Card
        title="Eligible SHG List"
        icon={Building2}
        action={
          <div className="flex items-center gap-3 text-xs font-medium">
            <span className="text-blue-600 dark:text-blue-400">
              Total Eligible: <strong className="font-bold text-blue-700 dark:text-blue-300">{totalCount}</strong>
            </span>
            <span className="text-slate-300 dark:text-slate-600">|</span>
            <span className="text-emerald-600 dark:text-emerald-400">
              Active: <strong className="font-bold text-emerald-700 dark:text-emerald-300">{activeCount}</strong>
            </span>
            <span className="text-slate-300 dark:text-slate-600">|</span>
            <span className="text-rose-600 dark:text-rose-400">
              Inactive: <strong className="font-bold text-rose-700 dark:text-rose-300">{inactiveCount}</strong>
            </span>
          </div>
        }
      >
        <div className="space-y-4">
          {/* Quick Filters */}
          <div className="grid grid-cols-12 gap-4 items-end pb-3 border-b border-slate-200 dark:border-slate-800">
            {/* Search Input */}
            <div className="col-span-12 sm:col-span-6 lg:col-span-3">
              <Input
                id="search-shg"
                name="searchShg"
                label="Search SHG / Application ID / Sector"
                placeholder="Search by name, ID, sector..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                icon={<Search size={15} />}
              />
            </div>

            {/* Status Filter */}
            <div className="col-span-12 sm:col-span-6 lg:col-span-3">
              <Select
                id="filter-status"
                name="filterStatus"
                label="Status"
                options={STATUS_FILTER_OPTIONS}
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
              />
            </div>

            {/* Date Filter (Apply/Approve Date) */}
            <div className="col-span-12 sm:col-span-6 lg:col-span-3">
              <DatePicker
                id="filter-shg-date"
                name="filterDate"
                label="Filter by Date"
                placeholder="dd/mm/yyyy"
                value={dateFilter}
                onChange={(e) => setDateFilter(e.target.value)}
                isClearable
              />
            </div>

            {/* Filter & Reset Action */}
            <div className="col-span-12 sm:col-span-6 lg:col-span-3 flex items-center gap-2">
              <Button
                type="button"
                variant="outline-primary"
                size="md"
                label="Filter"
                icon={<Filter size={15} />}
                onClick={handleApplyFilters}
              />
              {isFilterActive && (
                <Button
                  type="button"
                  variant="outline"
                  size="md"
                  label="Reset"
                  icon={<RotateCcw size={15} />}
                  onClick={handleResetFilters}
                />
              )}
            </div>
          </div>

          {/* ReusableTable */}
          <ReusableTable
            columns={columns}
            data={filteredData}
            enableRowActions={false}
            enableExport={true}
            exportFileName="eligible_shg_list"
          />
        </div>
      </Card>

      {/* SHG View Details Modal */}
      {selectedShg && (
        <Modal
          isOpen={isModalOpen}
          onClose={handleCloseModal}
          size="2xl"
          title={`SHG Details - ${selectedShg.shgName}`}
          subtitle={`Registration & Verification Details for ${selectedShg.applicationId}`}
          footer={
            <div className="flex items-center justify-end w-full">
              <Button
                type="button"
                variant="outline"
                size="md"
                label="Close"
                onClick={handleCloseModal}
              />
            </div>
          }
        >
          <div className="p-1 space-y-4">
            <div className="grid grid-cols-12 gap-3.5">
              {/* Row 1: Basic Identifiers */}
              <div className="col-span-12 sm:col-span-6 lg:col-span-4">
                <Input
                  id="modal-application-id"
                  name="applicationId"
                  label="Application ID"
                  value={selectedShg.applicationId}
                  disabled
                />
              </div>
              <div className="col-span-12 sm:col-span-6 lg:col-span-4">
                <Input
                  id="modal-shg-code"
                  name="shgCode"
                  label="SHG Code"
                  value={selectedShg.shgCode}
                  disabled
                />
              </div>
              <div className="col-span-12 sm:col-span-6 lg:col-span-4">
                <Input
                  id="modal-shg-name"
                  name="shgName"
                  label="SHG Name"
                  value={selectedShg.shgName}
                  disabled
                />
              </div>

              {/* Row 2: Leadership & Location */}
              <div className="col-span-12 sm:col-span-6 lg:col-span-4">
                <Input
                  id="modal-president"
                  name="presidentName"
                  label="President / Leader"
                  value={selectedShg.presidentName}
                  disabled
                />
              </div>
              <div className="col-span-12 sm:col-span-6 lg:col-span-4">
                <Input
                  id="modal-contact"
                  name="contactNumber"
                  label="Contact Number"
                  value={selectedShg.contactNumber}
                  disabled
                />
              </div>
              <div className="col-span-12 sm:col-span-6 lg:col-span-4">
                <Input
                  id="modal-district"
                  name="district"
                  label="District"
                  value={selectedShg.district}
                  disabled
                />
              </div>

              {/* Row 3: Sector & Capacities */}
              <div className="col-span-12 sm:col-span-6 lg:col-span-4">
                <Input
                  id="modal-sector"
                  name="sector"
                  label="Sector"
                  value={selectedShg.sector}
                  disabled
                />
              </div>
              <div className="col-span-12 sm:col-span-6 lg:col-span-4">
                <Input
                  id="modal-members"
                  name="totalMembers"
                  label="Total Members"
                  value={`${selectedShg.totalMembers} Members`}
                  disabled
                />
              </div>
              <div className="col-span-12 sm:col-span-6 lg:col-span-4">
                <Input
                  id="modal-tagged-awc"
                  name="taggedAwc"
                  label="Tagged AWCs"
                  value={`${selectedShg.taggedAwcCount} Centers`}
                  disabled
                />
              </div>

              {/* Row 4: Dates & Status */}
              <div className="col-span-12 sm:col-span-6 lg:col-span-4">
                <Input
                  id="modal-apply-date"
                  name="dateOfApply"
                  label="Date of Application"
                  value={selectedShg.dateOfApply}
                  disabled
                />
              </div>
              <div className="col-span-12 sm:col-span-6 lg:col-span-4">
                <Input
                  id="modal-approve-date"
                  name="dateOfApprove"
                  label="Date of Approval"
                  value={selectedShg.dateOfApprove}
                  disabled
                />
              </div>
              <div className="col-span-12 sm:col-span-6 lg:col-span-4">
                <Input
                  id="modal-status"
                  name="status"
                  label="Status"
                  value={selectedShg.status === 'active' ? 'Active' : 'Inactive'}
                  disabled
                />
              </div>

              {/* Row 5: Bank Details */}
              <div className="col-span-12 sm:col-span-6 lg:col-span-4">
                <Input
                  id="modal-bank-name"
                  name="bankName"
                  label="Bank Name"
                  value={selectedShg.bankName}
                  disabled
                />
              </div>
              <div className="col-span-12 sm:col-span-6 lg:col-span-4">
                <Input
                  id="modal-account-no"
                  name="accountNumber"
                  label="Account Number"
                  value={selectedShg.accountNumber}
                  disabled
                />
              </div>
              <div className="col-span-12 sm:col-span-6 lg:col-span-4">
                <Input
                  id="modal-ifsc"
                  name="ifscCode"
                  label="IFSC Code"
                  value={selectedShg.ifscCode}
                  disabled
                />
              </div>

              {/* Row 6: Approval Authority & Remarks */}
              <div className="col-span-12 sm:col-span-6">
                <Input
                  id="modal-approved-by"
                  name="approvedBy"
                  label="Approved Authority"
                  value={selectedShg.approvedBy}
                  disabled
                />
              </div>
              <div className="col-span-12 sm:col-span-6">
                <Input
                  id="modal-remarks"
                  name="remarks"
                  label="Remarks"
                  value={selectedShg.remarks || '—'}
                  disabled
                />
              </div>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};

export default EligibleShgList;
