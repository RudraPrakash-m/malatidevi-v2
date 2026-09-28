import React, { useState, useMemo } from 'react';
import { toast } from 'react-toastify';
import {
  FileCheck,
} from 'lucide-react';
import Card from '@/shared/components/layout/Card';
import { CheckFilter } from './CheckFilter';
import { CheckTable } from './CheckTable';
import {
  ReadOnlySummaryModal,
  DocumentViewerModal,
  GeoTagPhotoModal,
  ActionWorkflowModal,
  CredentialsModal,
  RevertModal,
  RejectModal,
  ApproveModal,
} from '@/features/shared';
import { useCheckItems } from '../state/checkState';
import type { CheckItem, CheckRole, CheckFilterParams } from '../types/check.types';

interface CheckPageContainerProps {
  role: CheckRole;
  title: string;
  description?: string;
}

const VERIFICATION_TABS = [
  {
    key: 'pending',
    label: 'Pending',
    activeText: 'text-amber-950 dark:text-amber-200 font-bold',
    inactiveText: 'text-slate-600 dark:text-slate-400 hover:text-amber-800 dark:hover:text-amber-300 font-medium',
    indicatorBg: 'bg-amber-100 border border-amber-300 dark:bg-amber-950/80 dark:border-amber-700 shadow-xs',
  },
  {
    key: 'approve',
    label: 'Approve',
    activeText: 'text-emerald-950 dark:text-emerald-200 font-bold',
    inactiveText: 'text-slate-600 dark:text-slate-400 hover:text-emerald-800 dark:hover:text-emerald-300 font-medium',
    indicatorBg: 'bg-emerald-100 border border-emerald-300 dark:bg-emerald-950/80 dark:border-emerald-700 shadow-xs',
  },
  {
    key: 'reject',
    label: 'Reject',
    activeText: 'text-rose-950 dark:text-rose-200 font-bold',
    inactiveText: 'text-slate-600 dark:text-slate-400 hover:text-rose-800 dark:hover:text-rose-300 font-medium',
    indicatorBg: 'bg-rose-100 border border-rose-300 dark:bg-rose-950/80 dark:border-rose-700 shadow-xs',
  },
] as const;

export const CheckPageContainer: React.FC<CheckPageContainerProps> = ({
  role,
  title,
}) => {
  const {
    items,
    forwardItem,
    finalApproveItem,
    revertItem,
    rejectItem,
  } = useCheckItems();

  // Tab state for verification roles
  const [activeTab, setActiveTab] = useState<string>('pending');
  const activeTabIndex = Math.max(
    0,
    VERIFICATION_TABS.findIndex((t) => t.key === activeTab)
  );
  const currentTab = VERIFICATION_TABS[activeTabIndex] || VERIFICATION_TABS[0];

  // Local filter form state
  const [filterValues, setFilterValues] = useState<CheckFilterParams>({
    financialYear: '',
    phase: '',
    project: '',
  });

  // Applied filter state for data query
  const [appliedFilters, setAppliedFilters] = useState<CheckFilterParams>({
    financialYear: '',
    phase: '',
    project: '',
  });

  // Modal active states
  const [summaryItem, setSummaryItem] = useState<CheckItem | null>(null);
  const [docItem, setDocItem] = useState<CheckItem | null>(null);
  const [photoItem, setPhotoItem] = useState<CheckItem | null>(null);
  const [workflowItem, setWorkflowItem] = useState<CheckItem | null>(null);
  const [revertItemState, setRevertItemState] = useState<CheckItem | null>(null);
  const [rejectItemState, setRejectItemState] = useState<CheckItem | null>(null);
  const [approveItemState, setApproveItemState] = useState<CheckItem | null>(null);
  const [credentialsItem, setCredentialsItem] = useState<CheckItem | null>(null);

  // Filter items based on user selection and active tab
  const filteredItems = useMemo(() => {
    return items.filter((item) => {
      // Tab filtering for verification roles (DSWO & BLF)
      if (activeTab === 'pending') {
        // In Pending Tab: show pending items, exclude approved, reverted, rejected
        if (item.status === 'reverted' || item.status === 'rejected' || item.status === 'approved') {
          return false;
        }
        const isPending =
          item.status === 'pending_dswo' ||
          item.status === 'pending_blf' ||
          item.status === 'pending_blc';
        if (!isPending) return false;
      } else if (activeTab === 'approve') {
        // In Approve Tab: show Approved
        if (item.status !== 'approved') return false;
      } else if (activeTab === 'reject') {
        // In Reject Tab: show Rejected
        if (item.status !== 'rejected') return false;
      }

      if (
        appliedFilters.financialYear &&
        appliedFilters.financialYear !== 'all' &&
        item.financialYear !== appliedFilters.financialYear
      ) {
        return false;
      }
      if (
        appliedFilters.phase &&
        appliedFilters.phase !== 'all'
      ) {
        const filterVal = appliedFilters.phase.toLowerCase().replace(/[^a-z0-9]/g, '');
        const itemVal = item.phase.toLowerCase().replace(/[^a-z0-9]/g, '');
        if (filterVal !== itemVal) {
          return false;
        }
      }
      if (
        appliedFilters.project &&
        appliedFilters.project !== 'all'
      ) {
        const filterVal = appliedFilters.project.toLowerCase().replace(/[^a-z0-9]/g, '');
        const itemVal = item.project.toLowerCase().replace(/[^a-z0-9]/g, '');
        if (filterVal !== itemVal) {
          return false;
        }
      }
      return true;
    });
  }, [items, appliedFilters, activeTab]);

  const handleApplyFilter = () => {
    setAppliedFilters(filterValues);
  };

  const handleResetFilter = () => {
    const empty: CheckFilterParams = {
      financialYear: '',
      phase: '',
      project: '',
    };
    setFilterValues(empty);
    setAppliedFilters(empty);
  };

  return (
    <div className="space-y-6">
      {/* Main Table Card with Integrated Filters & Tabs */}
      <Card
        title={title}
        icon={FileCheck}
        action={
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-1 rounded-lg text-xs font-semibold bg-blue-50 text-blue-800 dark:bg-blue-950/60 dark:text-blue-300 border border-blue-200 dark:border-blue-800/80 shadow-2xs">
              {filteredItems.length} Records Listed
            </span>
          </div>
        }
      >
        <div className="space-y-4">
          {/* Integrated Filter Row */}
          <div className="pb-3 border-b border-slate-200 dark:border-slate-800">
            <CheckFilter
              filters={filterValues}
              onChange={setFilterValues}
              onApply={handleApplyFilter}
              onReset={handleResetFilter}
            />
          </div>

          {/* Tabs: Pending, Approve & Reject with Smooth Sliding Indicator Animation */}
          <div className="flex items-center justify-between pb-2 border-b border-slate-100 dark:border-gray-800">
            <div className="relative inline-flex p-1 bg-slate-100 dark:bg-slate-800/60 rounded-xl border border-slate-200/80 dark:border-slate-700/80">
              {/* Sliding Pill Indicator */}
              <div
                className={`absolute top-1 bottom-1 rounded-lg transition-all duration-300 ease-in-out pointer-events-none ${currentTab.indicatorBg}`}
                style={{
                  left: `calc(${activeTabIndex * (100 / VERIFICATION_TABS.length)}% + 4px)`,
                  width: `calc(${100 / VERIFICATION_TABS.length}% - 8px)`,
                }}
              />

              {/* Tab Buttons */}
              {VERIFICATION_TABS.map((tab) => {
                const isActive = activeTab === tab.key;
                return (
                  <button
                    key={tab.key}
                    type="button"
                    onClick={() => setActiveTab(tab.key)}
                    className={`relative z-10 px-5 py-1.5 text-xs sm:text-sm transition-colors duration-200 rounded-lg cursor-pointer select-none text-center min-w-[85px] ${
                      isActive ? tab.activeText : tab.inactiveText
                    }`}
                  >
                    {tab.label}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Table with Horizontal Scrollbar */}
          <CheckTable
            data={filteredItems}
            currentRole={role}
            activeTab={activeTab}
            hideStatusColumn={activeTab === 'approve' || activeTab === 'reject'}
            onView={(item) => setSummaryItem(item)}
            onViewDoc={(item) => setDocItem(item)}
            onViewPhoto={(item) => setPhotoItem(item)}
            onForward={(item) => {
              setSummaryItem(item);
            }}
            onRevert={(item) => setRevertItemState(item)}
            onReject={(item) => setRejectItemState(item)}
            onViewCredentials={(item) => setCredentialsItem(item)}
            onBulkForward={(selected) => {
              const target = role === 'BLC' ? 'BLF' : role === 'BLF' ? 'BLC' : 'Final Approval';
              if (
                window.confirm(
                  `Forward ${selected.length} application(s) to ${target}?`
                )
              ) {
                selected.forEach((item) =>
                  forwardItem(
                    item.id,
                    role,
                    `Bulk forward to ${target} by ${role}`,
                    'Forward'
                  )
                );
              }
            }}
            onBulkApprove={(selected) => {
              if (
                window.confirm(
                  `Final Approve ${selected.length} application(s) and dispatch credentials via SMS?`
                )
              ) {
                selected.forEach((item) =>
                  finalApproveItem(
                    item.id,
                    'Bulk final approval by District Social Welfare Officer (DSWO). Credentials dispatched via SMS.',
                    'Approve'
                  )
                );
              }
            }}
          />
        </div>
      </Card>

      {/* 1. Read-Only Summary Modal */}
      <ReadOnlySummaryModal
        isOpen={Boolean(summaryItem)}
        onClose={() => setSummaryItem(null)}
        item={summaryItem}
        currentRole={role}
        onOpenDoc={() => summaryItem && setDocItem(summaryItem)}
        onOpenPhoto={() => summaryItem && setPhotoItem(summaryItem)}
        onOpenCredentials={() => summaryItem && setCredentialsItem(summaryItem)}
        onForward={(item) => {
          if (role === 'DSWO') {
            forwardItem(
              item.id,
              'DSWO',
              'Forwarded to BLF after DSWO verification',
              'Forward'
            );
            toast.success('Application forwarded to BLF successfully');
            setSummaryItem(null);
          } else if (role === 'BLF') {
            forwardItem(
              item.id,
              'BLF',
              'Forwarded to BLC after BLF verification',
              'Forward'
            );
            toast.success('Application forwarded to BLC successfully');
            setSummaryItem(null);
          } else if (role === 'BLC') {
            setSummaryItem(null);
            setApproveItemState(item);
          } else {
            setSummaryItem(null);
            setWorkflowItem(item);
          }
        }}
        onRevert={(item) => {
          setSummaryItem(null);
          setRevertItemState(item);
        }}
        onReject={(item) => {
          setSummaryItem(null);
          setRejectItemState(item);
        }}
      />

      {/* 2. Document Viewer Modal */}
      <DocumentViewerModal
        isOpen={Boolean(docItem)}
        onClose={() => setDocItem(null)}
        item={docItem}
      />

      {/* 3. GeoTag Photo Modal */}
      <GeoTagPhotoModal
        isOpen={Boolean(photoItem)}
        onClose={() => setPhotoItem(null)}
        item={photoItem}
      />

      {/* 4. Action Workflow Modal (Forward / Tag Existing) */}
      <ActionWorkflowModal
        isOpen={Boolean(workflowItem)}
        onClose={() => setWorkflowItem(null)}
        item={workflowItem}
        currentRole={role}
        onConfirm={(remarks, actionType, taggedId, taggedName, file) => {
          if (!workflowItem) return;
          if (role === 'BLC') {
            finalApproveItem(
              workflowItem.id,
              remarks,
              actionType === 'Tag Existing' ? 'Tag Existing' : 'Approve',
              taggedId,
              taggedName,
              file
            );
          } else {
            forwardItem(
              workflowItem.id,
              role,
              remarks,
              actionType,
              taggedId,
              taggedName,
              file
            );
          }
        }}
      />

      {/* 5. Revert Modal */}
      <RevertModal
        isOpen={Boolean(revertItemState)}
        onClose={() => setRevertItemState(null)}
        item={revertItemState}
        currentRole={role}
        onConfirm={(remarks, targetLevel) => {
          if (!revertItemState) return;
          revertItem(revertItemState.id, role, remarks, targetLevel);
        }}
      />

      {/* 6. Reject Modal */}
      <RejectModal
        isOpen={Boolean(rejectItemState)}
        onClose={() => setRejectItemState(null)}
        item={rejectItemState}
        currentRole={role}
        onConfirm={(remarks) => {
          if (!rejectItemState) return;
          rejectItem(rejectItemState.id, role, remarks);
        }}
      />

      {/* 7. Credentials Modal Popup */}
      <CredentialsModal
        isOpen={Boolean(credentialsItem)}
        onClose={() => setCredentialsItem(null)}
        item={credentialsItem}
      />

      {/* 8. Approve Modal with Remarks */}
      <ApproveModal
        isOpen={Boolean(approveItemState)}
        onClose={() => setApproveItemState(null)}
        item={approveItemState}
        currentRole={role}
        onConfirm={(remarks) => {
          if (!approveItemState) return;
          finalApproveItem(
            approveItemState.id,
            remarks,
            'Approve'
          );
        }}
      />
    </div>
  );
};

export default CheckPageContainer;
