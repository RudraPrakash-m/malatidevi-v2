// src/features/dswo/pages/DswoVerificationList.tsx

import React from 'react';
import { CheckPageContainer } from '@/features/check/components/CheckPageContainer';

export const DswoVerificationList: React.FC = () => {
  return (
    <CheckPageContainer
      role="DSWO"
      title="DSWO - District Social Welfare Officer Verification & Approval"
      description="District Social Welfare Officer (DSWO) scrutiny and approval authority. Accords final approval, generates SHG portal user credentials dispatched via SMS to registered mobile number, or reverts back to BLC/BLF."
    />
  );
};

export default DswoVerificationList;
