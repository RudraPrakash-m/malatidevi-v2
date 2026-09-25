// src/features/check/pages/StateCheckPage.tsx

import React from 'react';
import { CheckPageContainer } from '../components/CheckPageContainer';

export const StateCheckPage: React.FC = () => {
  return (
    <CheckPageContainer
      role="STATE"
      title="STATE - State Level Verification & Oversight"
      description="State Level Administrative Authority review, monitoring, and state-wide verification oversight of SHG applications, district allocations, and approvals."
    />
  );
};

export default StateCheckPage;
