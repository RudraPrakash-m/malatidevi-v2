import React, { useState, useMemo } from 'react';
import { toast } from 'react-toastify';
import {
  FileCheck,
  Filter,
} from 'lucide-react';
import Card from '@/shared/components/layout/Card';
import Tabs from '@/shared/components/ui/Tabs';
import type { TabItem } from '@/shared/components/ui/Tabs/tab.types';
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

  const verificationTabs: TabItem[] = useMemo(
    () => [
      { key: 'pending', label: 'Pending' },
      { key: 'approve', label: 'Approve' },
      { key: 'reject', label: 'Reject' },
    ],
    []
  );

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
      {/* 1. Filter Card with native Select controls */}
      <Card title="SHG Verification" icon={Filter}>
        <CheckFilter
          filters={filterValues}
          onChange={setFilterValues}
          onApply={handleApplyFilter}
          onReset={handleResetFilter}
        />
      </Card>

      {/* 2. Main Table Card */}
      <Card title={title} icon={FileCheck}>
        <div className="space-y-4">
          {/* Tabs: Pending, Approve & Reject */}
          <div className="flex items-center justify-between pb-2 border-b border-slate-100 dark:border-gray-800">
            <Tabs
              tabs={verificationTabs}
              activeTab={activeTab}
              onChange={setActiveTab}
            />
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
              if (role === 'BLF' || role === 'BLC') {
                setSummaryItem(item);
              } else {
                setWorkflowItem(item);
              }
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
          if (role === 'BLF') {
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
