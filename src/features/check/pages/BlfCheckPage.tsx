// src/features/check/pages/BlfCheckPage.tsx

import React from 'react';
import { CheckPageContainer } from '../components/CheckPageContainer';

export const BlfCheckPage: React.FC = () => {
  return (
    <CheckPageContainer
      role="BLF"
      title="BLF - SHG Verification & Recommendation"
      description="Block Level Facilitator (BLF) scrutiny of newly registered SHG applications. Conduct physical ground verification, review byelaws & bank passbook, and forward to Block Level Committee (BLC) or revert/reject if deficiencies are found."
    />
  );
};

export default BlfCheckPage;
