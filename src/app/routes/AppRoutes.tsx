import { Routes, Route, Navigate, useNavigate } from "react-router-dom";
import { Suspense, lazy, useEffect } from "react";
import { routes } from "./routeConfig";
import ProtectedRoute from "./ProtectedRoute";
import AuthLayout from "@/shared/components/layout/AuthLayout";
import MainLayout from "@/shared/components/layout/MainLayout";
import PublicRoute from "./PublicRoute";

// Core App Pages & Direct Critical Routes
import Login from "@/features/auth/pages/Login";
import Dashboard from "@/features/dashboard/pages/Dashboard";
import WshgTrackingPage from "@/features/wshg/pages/WshgTracking";

// WSHG Feature Pages
const WshgRegistration = lazy(() => import("@/features/wshg/pages/WshgRegistration"));
const WshgRegistrationList = lazy(() => import("@/features/wshg/pages/WshgRegistrationList"));

// Centralized Role Dashboard Pages
const StateDashboard = lazy(() => import("@/features/dashboard/pages/StateDashboard"));
const DswoDashboard = lazy(() => import("@/features/dashboard/pages/DswoDashboard"));
const CdpoDashboard = lazy(() => import("@/features/dashboard/pages/CdpoDashboard"));
const BlcDashboard = lazy(() => import("@/features/dashboard/pages/BlcDashboard"));
const BlfDashboard = lazy(() => import("@/features/dashboard/pages/BlfDashboard"));
const AwwDashboard = lazy(() => import("@/features/dashboard/pages/AwwDashboard"));

// AWW Feature Pages
const AwwShgDetails = lazy(() => import("@/features/shared/delivery-catalogue/pages/ShgDetails"));
const AwwDeliveryCatalogue = lazy(() => import("@/features/shared/delivery-catalogue/pages/DeliveryCatalogue"));
const AwwBeneficiaryDistribution = lazy(() => import("@/features/aww/pages/BeneficiaryDistribution"));

// State Role Feature Pages
const FundAllocationField = lazy(() => import("@/features/state/pages/FundAllocationField"));
const FundRequestList = lazy(() => import("@/features/state/pages/FundRequestList"));
const StateCheckPage = lazy(() => import("@/features/check/pages/StateCheckPage"));

// DSWO Role Feature Pages
const DswoVerificationList = lazy(() => import("@/features/dswo/pages/DswoVerificationList"));
const DswoFundRequest = lazy(() => import("@/features/dswo/pages/DswoFundRequest"));
const DswoCheckPage = lazy(() => import("@/features/check/pages/DswoCheckPage"));
const AddFundAllocation = lazy(() => import("@/features/dswo/pages/AddFundAllocation"));
const FundAllocationn = lazy(() => import("@/features/dswo/pages/FundAllocationn"));
const FundAllocationList = lazy(() => import("@/features/dswo/pages/FundAllocationList"));
const FundAllocationTable = lazy(() => import("@/features/dswo/pages/FundAllocationTable"));

// CDPO Role Feature Pages
const CdpoDeliveryCatalogue = lazy(() => import("@/features/shared/delivery-catalogue/pages/DeliveryCatalogue"));

// BLF Role Feature Pages
const BlfVerificationList = lazy(() => import("@/features/blf/pages/BlfVerificationList"));
const BlfCheckPage = lazy(() => import("@/features/check/pages/BlfCheckPage"));

// BLC Role Feature Pages
const BlcVerificationList = lazy(() => import("@/features/blc/pages/BlcVerificationList"));
const BlcCheckPage = lazy(() => import("@/features/check/pages/BlcCheckPage"));

// Beneficiary Shared Pages
const AddBeneficiaryDistribution = lazy(() => import("@/features/shared/beneficiary-distribution/pages/AddBeneficiaryDistribution"));
const BeneficiaryDistributionList = lazy(() => import("@/features/shared/beneficiary-distribution/pages/BeneficiaryDistributionList"));

// UC Certificate Shared Feature Pages
const StateUcOversight = lazy(() => import("@/features/shared/uc-certificate/pages/UcOversight"));
const AddUcCertificate = lazy(() => import("@/features/shared/uc-certificate/pages/AddUcCertificate"));
const UcGeneration = lazy(() => import("@/features/shared/uc-certificate/pages/UcGeneration"));
const UcCertificateList = lazy(() => import("@/features/shared/uc-certificate/pages/UcCertificateList"));
const EligibleShgList = lazy(() => import("@/features/wshg/pages/EligibleShgList"));

// Supply Management Pages
const AddSupplyManagement = lazy(() => import("@/features/cdpo/pages/AddSupplyManagement"));
const SupplyManagementList = lazy(() => import("@/features/cdpo/pages/SupplyManagementList"));

const AppRoutes = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const handleAuthRedirect = (e: Event) => {
      const customEvent = e as CustomEvent<string>;
      navigate(customEvent.detail);
    };
    window.addEventListener("auth-redirect", handleAuthRedirect);
    return () =>
      window.removeEventListener("auth-redirect", handleAuthRedirect);
  }, [navigate]);

  return (
    <Suspense
      fallback={
        <div className="flex items-center justify-center h-screen bg-gray-100">
          <div className="animate-pulse flex flex-col items-center">
            <div className="rounded-full bg-gray-300 h-16 w-16 mb-4" />
            <div className="h-4 bg-gray-300 rounded w-48 mb-4" />
            <div className="h-4 bg-gray-300 rounded w-64 mb-4" />
            <div className="h-4 bg-gray-300 rounded w-40" />
          </div>
        </div>
      }
    >
      <Routes>
        <Route element={<PublicRoute />}>
          <Route element={<AuthLayout />}>
            <Route path={routes.login.path} element={<Login />} />
          </Route>
        </Route>

        <Route element={<ProtectedRoute />}>
          <Route element={<MainLayout />}>
            <Route path={routes.wshgRegistration.path} element={<WshgRegistration />} />
            <Route path={routes.wshgTracking.path} element={<WshgTrackingPage />} />
            <Route path={routes.dashboard.path} element={<Dashboard />} />

            {/* WSHG Workflow & Verification Routes */}
            <Route path={routes.wshgList.path} element={<WshgRegistrationList />} />
            <Route path={routes.wshgVerification.path} element={<BlfCheckPage />} />
            <Route path={routes.blfCheck.path} element={<BlfCheckPage />} />
            <Route path={routes.blcCheck.path} element={<BlcCheckPage />} />
            <Route path={routes.dswoCheck.path} element={<DswoCheckPage />} />
            <Route path={routes.stateCheck.path} element={<StateCheckPage />} />
            <Route path={routes.verificationList.path} element={<BlfVerificationList />} />

            {/* AWW Workflow Routes */}
            <Route path={routes.shgDetails.path} element={<AwwShgDetails />} />
            <Route path={routes.deliveryCatalogue.path} element={<AwwDeliveryCatalogue />} />
            <Route path={routes.beneficiaryDistribute.path} element={<AwwBeneficiaryDistribution />} />
            <Route path={routes.awwDashboard.path} element={<AwwDashboard />} />
            <Route path={routes.awwDistribution.path} element={<AwwBeneficiaryDistribution />} />
            <Route path={routes.awwStockReceipt.path} element={<AwwDeliveryCatalogue />} />

            {/* Fund Allocation & Management Routes */}
            <Route path={routes.fundAllocationField.path} element={<FundAllocationField />} />
            <Route path={routes.fundRequestList.path} element={<FundRequestList />} />
            <Route path={routes.fundAllocation.path} element={<AddFundAllocation />} />
            <Route path={routes.fundAllocationn.path} element={<FundAllocationn />} />
            <Route path={routes.fundRequest.path} element={<AddFundAllocation />} />
            <Route path={routes.fundAllocationList.path} element={<FundAllocationList />} />
            <Route path={routes.fundAllocationTable.path} element={<FundAllocationTable />} />

            {/* Beneficiary Distribution Routes */}
            <Route path={routes.addBeneficiary.path} element={<AddBeneficiaryDistribution />} />
            <Route path={routes.beneficiaryDistribution.path} element={<BeneficiaryDistributionList />} />

            {/* UC Certificate Shared Routes */}
            <Route path={routes.addUccertificate.path} element={<AddUcCertificate />} />
            <Route path={routes.ucGeneration.path} element={<UcGeneration />} />
            <Route path={routes.ucCertificatelist.path} element={<UcCertificateList />} />
            <Route path={routes.eligibleShgList.path} element={<EligibleShgList />} />

            {/* Supply Management Routes */}
            <Route path={routes.addSupplymanagement.path} element={<AddSupplyManagement />} />
            <Route path={routes.supplyManagement.path} element={<SupplyManagementList />} />

            {/* State Role Specific Aliases */}
            <Route path={routes.stateDashboard.path} element={<StateDashboard />} />
            <Route path={routes.stateFundAllocation.path} element={<FundAllocationField />} />
            <Route path={routes.stateRequestedFundList.path} element={<FundRequestList />} />
            <Route path={routes.stateUcOversight.path} element={<StateUcOversight />} />

            {/* DSWO Role Specific Aliases */}
            <Route path={routes.dswoDashboard.path} element={<DswoDashboard />} />
            <Route path={routes.dswoVerificationList.path} element={<DswoVerificationList />} />
            <Route path={routes.dswoBeneficiaryDistribution.path} element={<AddBeneficiaryDistribution />} />
            <Route path={routes.dswoFundRequest.path} element={<DswoFundRequest />} />

            {/* CDPO Role Specific Aliases */}
            <Route path={routes.cdpoDashboard.path} element={<CdpoDashboard />} />
            <Route path={routes.cdpoCreateSupplyOrder.path} element={<AddSupplyManagement />} />
            <Route path={routes.cdpoDeliveryCatalogue.path} element={<CdpoDeliveryCatalogue />} />

            {/* BLF Role Specific Aliases */}
            <Route path={routes.blfDashboard.path} element={<BlfDashboard />} />
            <Route path={routes.blfVerificationList.path} element={<BlfVerificationList />} />

            {/* BLC Role Specific Aliases */}
            <Route path={routes.blcDashboard.path} element={<BlcDashboard />} />
            <Route path={routes.blcVerificationList.path} element={<BlcVerificationList />} />
          </Route>
        </Route>

        <Route path="*" element={<Navigate to={routes.login.path} replace />} />
      </Routes>
    </Suspense>
  );
};

export default AppRoutes;
