// src/features/blf/pages/BlfVerificationList.tsx

import React from 'react';
import { CheckPageContainer } from '@/features/check/components/CheckPageContainer';

export const BlfVerificationList: React.FC = () => {
  return (
    <CheckPageContainer
      role="BLF"
      title="BLF - SHG Verification & Recommendation"
      description="Block Level Facilitator (BLF) scrutiny of newly registered SHG applications. Conduct physical ground verification, review byelaws & bank passbook, and forward to Block Level Committee (BLC) or revert/reject if deficiencies are found."
    />
  );
};

export default BlfVerificationList;
