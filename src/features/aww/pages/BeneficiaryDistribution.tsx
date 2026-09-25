// src/features/aww/pages/BeneficiaryDistribution.tsx

import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Gift } from 'lucide-react';
import { toast } from 'react-toastify';

import Card from '@/shared/components/layout/Card';
import FormGenerator from '@/shared/components/ui/Forms/FormGenerator';
import Button from '@/shared/components/ui/Button';

import { beneficiaryDistributeFormConfig } from '../form-config/beneficiaryDistributeFormConfig';

export const BeneficiaryDistribution: React.FC = () => {
  const navigate = useNavigate();

  const initialValues = {
    phase: '',
    date: '',
    shoe: '',
    sweater: '',
    uniform: '',
    uploadPhoto: '',
  };

  const handleSubmit = (data: Record<string, any>) => {
    console.log('Beneficiary Distribution:', data);
    toast.success('Beneficiary distribution saved successfully');
  };

  return (
    <Card
      title="Beneficiary Distribution"
      icon={Gift}
    >
      <FormGenerator
        fields={beneficiaryDistributeFormConfig}
        onSubmit={handleSubmit}
        defaultValues={initialValues}
        gridColumns={12}
      >
        <div className="mt-6 flex justify-end gap-3">
          <Button
            type="button"
            variant="outline"
            label="Back"
            size="md"
            onClick={() => navigate(-1)}
          />

          <Button
            type="submit"
            variant="primary"
            label="Submit"
            size="md"
          />
        </div>
      </FormGenerator>
    </Card>
  );
};

export default BeneficiaryDistribution;
