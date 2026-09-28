// src/features/check/pages/DswoCheckPage.tsx

import React from 'react';
import { CheckPageContainer } from '../components/CheckPageContainer';

export const DswoCheckPage: React.FC = () => {
  return (
    <CheckPageContainer
      role="DSWO" 
      title="DSWO - District Social Welfare Officer Final Approval"
      description="District Social Welfare Officer (DSWO) final scrutiny and approval authority. Accords final approval, generates SHG portal user credentials dispatched via SMS to registered mobile number, or reverts back to BLC/BLF."
    />
  );
};

export default DswoCheckPage;
