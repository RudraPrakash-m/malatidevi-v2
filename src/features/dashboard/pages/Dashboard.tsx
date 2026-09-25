import React from 'react';
import { useSelector } from 'react-redux';
import { Navigate } from 'react-router-dom';
import type { RootState } from '@/app/store';

import StateDashboard from './StateDashboard';
import DswoDashboard from './DswoDashboard';
import CdpoDashboard from './CdpoDashboard';
import BlcDashboard from './BlcDashboard';
import BlfDashboard from './BlfDashboard';
import AwwDashboard from './AwwDashboard';

export const Dashboard: React.FC = () => {
  const { user } = useSelector((state: RootState) => state.auth);
  
  const rawRole = String(
    user?.primaryRoleCode || user?.role || user?.loginUserName || ''
  ).toUpperCase();

  if (!rawRole || rawRole.includes('WSHG') || rawRole.includes('SHG')) {
    return <Navigate to="/track-wshg" replace />;
  }

  switch (true) {
    case rawRole.includes('STATE') || rawRole.includes('ADMIN') || rawRole.includes('DIRECTOR'):
      return <StateDashboard />;
    case rawRole.includes('DSWO') || rawRole.includes('DISTRICT'):
      return <DswoDashboard />;
    case rawRole.includes('CDPO') || rawRole.includes('PROJECT'):
      return <CdpoDashboard />;
    case rawRole.includes('BLC'):
      return <BlcDashboard />;
    case rawRole.includes('BLF'):
      return <BlfDashboard />;
    case rawRole.includes('AWW') || rawRole.includes('AWC'):
      return <AwwDashboard />;
    default:
      return null;
  }
};

export default Dashboard;
