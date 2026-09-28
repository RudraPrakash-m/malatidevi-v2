// src/features/dswo/pages/DswoFundRequest.tsx

import React from 'react';
import { DswoFundRequestList } from '../components/DswoFundRequestList';

export const DswoFundRequest: React.FC<{ districtName?: string; district?: string }> = ({
  districtName,
  district = districtName || 'Khordha',
}) => {
  return <DswoFundRequestList district={district} />;
};

export default DswoFundRequest;
