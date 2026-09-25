// src/features/check/pages/BlcCheckPage.tsx

import React from 'react';
import { CheckPageContainer } from '../components/CheckPageContainer';

export const BlcCheckPage: React.FC = () => {
  return (
    <CheckPageContainer
      role="BLC"
      title="BLC - Block Level Committee Verification"
      description="Block Level Committee (BLC) review of applications forwarded by BLF. Review L1 inspection notes, resolution registers, and forward to District Social Welfare Officer (DSWO - Top Level) for sanction, or revert back to BLF."
    />
  );
};

export default BlcCheckPage;
