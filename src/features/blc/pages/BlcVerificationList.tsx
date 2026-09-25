// src/features/blc/pages/BlcVerificationList.tsx

import React from 'react';
import { CheckPageContainer } from '@/features/check/components/CheckPageContainer';

export const BlcVerificationList: React.FC = () => {
  return (
    <CheckPageContainer
      role="BLC"
      title="BLC - Block Level Committee Verification & Approval"
      description="Block Level Committee (BLC) review of applications forwarded by BLF. Review L1 inspection notes, resolution registers, and grant final committee approval with credential provisioning, or revert back to BLF."
    />
  );
};

export default BlcVerificationList;
