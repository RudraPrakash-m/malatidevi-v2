// src/features/shared/delivery-catalogue/pages/DeliveryCatalogue.tsx

import React, { useState } from 'react';
import { ArrowLeft, ArrowRight, Package } from 'lucide-react';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';

import Card from '@/shared/components/layout/Card';
import FormGenerator from '@/shared/components/ui/Forms/FormGenerator';
import Button from '@/shared/components/ui/Button';

import { deliveryCatalogueFormConfig } from '../form-config/deliveryCatalogueFormConfig';

interface DeliveryCatalogueProps {
  onBack?: () => void;
  onNext?: (data: Record<string, any>) => void;
}

export const DeliveryCatalogue: React.FC<DeliveryCatalogueProps> = ({
  onBack,
  onNext,
}) => {
  const navigate = useNavigate();
  const [autoOrderId] = useState(() => `SO-${Math.floor(1000 + Math.random() * 9000)}`);
  const [initialValues] = useState({
    orderId: autoOrderId,
    shgName: '',
    awcName: '',
    deliveryDate: '',
    size: '',
    colour: '',
    gender: '',
    uniform: '',
    orderReceived: '',
    totalUnits: '',
    deliveryPhoto: null,
    signature: null,
  });

  const handleSubmit = (data: Record<string, any>) => {
    console.log('Delivery & Catalogue Data:', data);
    toast.success('Delivery details saved successfully');
    if (onNext) {
      onNext(data);
    } else {
      navigate('/beneficiary-distribute');
    }
  };

  return (
    <Card title="Delivery & Catalogue Entry" icon={Package}>
      <FormGenerator
        fields={deliveryCatalogueFormConfig}
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

export default DeliveryCatalogue;
