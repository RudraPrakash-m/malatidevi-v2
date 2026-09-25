// src/features/dswo/pages/DswoFundRequest.tsx

import React from 'react';
import { DswoFundRequestList } from '../components/DswoFundRequestList';

export const DswoFundRequest: React.FC<{ districtName?: string }> = ({
  districtName = 'Khordha',
}) => {
  return <DswoFundRequestList districtName={districtName} />;
};

export default DswoFundRequest;
