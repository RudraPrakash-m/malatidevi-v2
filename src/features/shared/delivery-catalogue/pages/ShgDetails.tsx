// src/features/shared/delivery-catalogue/pages/ShgDetails.tsx

import React, { useState } from 'react';
import { ArrowLeft, ArrowRight, Building2 } from 'lucide-react';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';

import Card from '@/shared/components/layout/Card';
import FormGenerator from '@/shared/components/ui/Forms/FormGenerator';
import Button from '@/shared/components/ui/Button';

import { shgDetailsFormConfig } from '../form-config/shgDetailsFormConfig';

interface ShgDetailsProps {
  onBack?: () => void;
  onNext?: (data: Record<string, any>) => void;
}

export const ShgDetails: React.FC<ShgDetailsProps> = ({
  onBack,
  onNext,
}) => {
  const navigate = useNavigate();
  const [autoOrderId] = useState(() => `SO-${Math.floor(1000 + Math.random() * 9000)}`);
  const [initialValues] = useState({
    orderId: autoOrderId,
    shgId: autoOrderId,
    name: '',
    item: '',
    quantity: '',
    dueDate: '',
    deliveryDate: '',
  });

  const handleSubmit = (data: Record<string, any>) => {
    console.log('SHG Details:', data);
    toast.success('SHG details saved successfully');
    if (onNext) {
      onNext(data);
    } else {
      navigate('/delivery-catalogue');
    }
  };

  return (
    <Card title="SHG Details" icon={Building2}>
      <FormGenerator
        fields={shgDetailsFormConfig}
        onSubmit={handleSubmit}
        defaultValues={initialValues}
        gridColumns={12}
      >
        <div className="mt-6 flex justify-between gap-3 col-span-full">
          <Button
            type="button"
            variant="outline"
            label="Back"
            icon={<ArrowLeft size={16} />}
            onClick={onBack || (() => navigate(-1))}
          />

          <Button
            type="submit"
            variant="primary"
            label="Next"
            iconRight={<ArrowRight size={16} />}
          />
        </div>
      </FormGenerator>
    </Card>
  );
};

export default ShgDetails;
