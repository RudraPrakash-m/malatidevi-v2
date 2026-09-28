// src/features/wshg/pages/WshgRegistrationList.tsx
import React, { useCallback, useMemo, useState } from 'react';
import type { MRT_ColumnDef } from 'material-react-table';
import { Layers } from 'lucide-react';
import { ReusableTable } from '@/shared/components/ui/Table';
import ActionButtons from '@/shared/components/ui/Actions/ActionButtons';
import type { ActionType } from '@/shared/components/ui/Actions/action.types';
import Modal from '@/shared/components/ui/Modal/Modal';
import Card from '@/shared/components/layout/Card';
import type { WshgRegistrationItem } from '../types/wshg-registration.types';

const INITIAL_DATA: WshgRegistrationItem[] = [
  { id: '1', name: 'Maa Tarini SHG', code: 'Plot 45, Bhubaneswar, Khordha', status: 'active' },
  { id: '2', name: 'Sakhi Mahila SHG', code: 'Ward 3, Jatni, Khordha', status: 'active' },
  { id: '3', name: 'Maa Mangala SHG', code: 'Village Purunapadhan, Balianta', status: 'inactive' },
];

const WshgRegistrationStatusBadge: React.FC<{ status?: string }> = ({ status }) => {
  const isActive = status?.toLowerCase() === 'active';
  return (
    <span
      className={`text-xs font-semibold ${
        isActive
          ? 'text-emerald-600 dark:text-emerald-400'
          : 'text-rose-600 dark:text-rose-400'
      }`}
    >
      {status?.toUpperCase() || 'N/A'}
    </span>
  );
};

const WshgRegistrationActionCell: React.FC<{
  item: WshgRegistrationItem;
  onAction: (action: ActionType, item: WshgRegistrationItem) => void;
}> = ({ item, onAction }) => (
  <ActionButtons
    actions={['view', 'edit', 'delete']}
    toggleValue={item.status === 'active'}
    onAction={(action) => onAction(action, item)}
  />
);

const getWshgRegistrationColumns = (
  handleAction: (action: ActionType, item: WshgRegistrationItem) => void
): MRT_ColumnDef<WshgRegistrationItem>[] => [
  { accessorKey: 'id', header: 'ID', size: 80 },
  { accessorKey: 'name', header: 'SHG Name' },
  { accessorKey: 'code', header: 'Address' },

  {
    accessorKey: 'status',
    header: 'Status',
    Cell: ({ cell }) => <WshgRegistrationStatusBadge status={cell.getValue<string>()} />,
  },
  {
    accessorKey: 'action',
    header: 'Action',
    size: 150,
    Cell: ({ row }) => (
      <WshgRegistrationActionCell
        item={row.original}
        onAction={handleAction}
      />
    ),
  },
];

export const WshgRegistrationList: React.FC = () => {
  const [data] = useState<WshgRegistrationItem[]>(INITIAL_DATA);
  const [selectedItem, setSelectedItem] = useState<WshgRegistrationItem | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleAction = useCallback(
    (action: ActionType, row: WshgRegistrationItem) => {
      if (action === 'view') {
        setSelectedItem(row);
        setIsModalOpen(true);
      }
    },
    []
  );

  const columns = useMemo(() => getWshgRegistrationColumns(handleAction), [handleAction]);

  return (
    <>
      <Card title="SHG Registration Details" icon={Layers}>
        <ReusableTable
          columns={columns}
          data={data}
          enableRowActions={false}
          enableExport={true}
          exportFileName="shg-registration_records"
        />
      </Card>

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={selectedItem ? `SHG Details - ${selectedItem.name}` : 'SHG Details'}
        size="2xl"
      >
        {selectedItem && (
          <div className="p-4 space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="border-b pb-2">
                <span className="text-xs font-semibold text-gray-500 uppercase">ID</span>
                <p className="text-sm font-medium text-foreground mt-1">{selectedItem.id}</p>
              </div>
              <div className="border-b pb-2">
                <span className="text-xs font-semibold text-gray-500 uppercase">SHG Name</span>
                <p className="text-sm font-medium text-foreground mt-1">{selectedItem.name}</p>
              </div>
              <div className="border-b pb-2">
                <span className="text-xs font-semibold text-gray-500 uppercase">Code</span>
                <p className="text-sm font-medium text-foreground mt-1">{selectedItem.code}</p>
              </div>
              <div className="border-b pb-2">
                <span className="text-xs font-semibold text-gray-500 uppercase">Status</span>
                <p className="text-sm font-medium text-foreground mt-1">
                  <WshgRegistrationStatusBadge status={selectedItem.status} />
                </p>
              </div>
            </div>
          </div>
        )}
      </Modal>
    </>
  );
};

export default WshgRegistrationList;
