export const routes = {
  login: { path: "/login", label: "Login", protected: false },
  dashboard: { path: "/dashboard", label: "Dashboard", protected: true },

  // SHG Citizen & Public Routes
  wshgTracking: {
    path: "/track-wshg",
    label: "Application Tracking",
    protected: false,
  },
  wshgRegistration: {
    path: "/add-wshg",
    label: "New Registration",
    protected: false,
  },
  addWshgRegistration: {
    path: "/add-wshg",
    label: "New Registration",
    protected: false,
  },
  wshgList: { path: "/wshg-list", label: "SHG List", protected: true },
  wshgVerification: {
    path: "/wshg-verification",
    label: "SHG Verification",
    protected: true,
  },

  // Multi-Role Verification Check Routes
  blfCheck: { path: "/check/blf", label: "SHG Application List", protected: true },
  blcCheck: { path: "/check/blc", label: "BLC Verification", protected: true },
  dswoCheck: {
    path: "/check/dswo",
    label: "DSWO Verification",
    protected: true,
  },
  stateCheck: {
    path: "/check/state",
    label: "State Verification Check",
    protected: true,
  },
  verificationList: {
    path: "/verification-list",
    label: "Verification List",
    protected: true,
  },

  // Supply Management & Delivery
  addSupplymanagement: {
    path: "/add-supply",
    label: "Create Supply Order",
    protected: true,
  },
  supplyManagement: {
    path: "/supply-management",
    label: "Supply Management",
    protected: true,
  },
  shgDetails: { path: "/shg-details", label: "SHG Details", protected: true },
  deliveryCatalogue: {
    path: "/delivery-catalogue",
    label: "Delivery Catalogue",
    protected: true,
  },

  // Beneficiary Distribution
  addBeneficiary: {
    path: "/add-beneficiary",
    label: "Beneficiary Distribution",
    protected: true,
  },
  beneficiaryDistribution: {
    path: "/beneficiary-distribution",
    label: "Beneficiary Distribution List",
    protected: true,
  },
  beneficiaryDistribute: {
    path: "/beneficiary-distribute",
    label: "Beneficiary Distribution",
    protected: true,
  },

  // UC Certificate
  addUccertificate: {
    path: "/add-uc",
    label: "Utilization Certificate",
    protected: true,
  },
  ucGeneration: {
    path: "/uc-generation",
    label: "Utilization List",
    protected: true,
  },
  ucCertificatelist: {
    path: "/uc-certificate",
    label: "UC Certificate List",
    protected: true,
  },
  eligibleShgList: {
    path: "/eligible-shg-list",
    label: "Eligible SHG List",
    protected: true,
  },

  // Fund Allocation & Request
  fundAllocation: {
    path: "/fund-allocation",
    label: "Request Fund",
    protected: true,
  },
  fundRequest: {
    path: "/fund-request",
    label: "Fund Request",
    protected: true,
  },
  fundAllocationList: {
    path: "/fund-allocation-list",
    label: "Fund Allocation List",
    protected: true,
  },
  fundAllocationField: {
    path: "/fund-allocation-field",
    label: "Fund Allocation",
    protected: true,
  },
  fundAllocationn: {
    path: "/fund-allocationn",
    label: "Fund Allocation",
    protected: true,
  },
  fundRequestList: {
    path: "/fund-request-list",
    label: "Requested Fund List",
    protected: true,
  },
  fundAllocationTable: {
    path: "/fund-allocation-table",
    label: "Fund Allocation Table",
    protected: true,
  },
  requisitionList: {
    path: "/requisition-list",
    label: "Requisition List",
    protected: true,
  },

  // State Role Aliases
  stateDashboard: {
    path: "/state/dashboard",
    label: "State Dashboard",
    protected: true,
  },
  stateFundAllocation: {
    path: "/state/fund-allocation",
    label: "State Fund Allocation",
    protected: true,
  },
  stateRequestedFundList: {
    path: "/state/fund-request-list",
    label: "State Requested Fund List",
    protected: true,
  },
  stateUcOversight: {
    path: "/state/uc-oversight",
    label: "State UC Oversight",
    protected: true,
  },

  // DSWO Role Aliases
  dswoDashboard: {
    path: "/dswo/dashboard",
    label: "DSWO Dashboard",
    protected: true,
  },
  dswoVerificationList: {
    path: "/dswo/verification-list",
    label: "DSWO Verification List",
    protected: true,
  },
  dswoBeneficiaryDistribution: {
    path: "/dswo/beneficiary-distribution",
    label: "DSWO Beneficiary Distribution",
    protected: true,
  },
  dswoFundRequest: {
    path: "/dswo/fund-request",
    label: "DSWO Fund Request",
    protected: true,
  },

  // CDPO Role Aliases
  cdpoDashboard: {
    path: "/cdpo/dashboard",
    label: "CDPO Dashboard",
    protected: true,
  },
  cdpoCreateSupplyOrder: {
    path: "/cdpo/create-supply-order",
    label: "CDPO Create Supply Order",
    protected: true,
  },
  cdpoDeliveryCatalogue: {
    path: "/cdpo/delivery-catalogue",
    label: "CDPO Delivery Catalogue",
    protected: true,
  },

  // BLF Role Aliases
  blfDashboard: {
    path: "/blf/dashboard",
    label: "BLF Dashboard",
    protected: true,
  },
  blfVerificationList: {
    path: "/blf/verification-list",
    label: "BLF Verification List",
    protected: true,
  },

  // BLC Role Aliases
  blcDashboard: {
    path: "/blc/dashboard",
    label: "BLC Dashboard",
    protected: true,
  },
  blcVerificationList: {
    path: "/blc/verification-list",
    label: "BLC Verification List",
    protected: true,
  },

  // AWW Role Aliases
  awwDashboard: {
    path: "/aww/dashboard",
    label: "AWW Dashboard",
    protected: true,
  },
  awwDistribution: {
    path: "/aww/distribution",
    label: "AWW Beneficiary Distribution",
    protected: true,
  },
  awwStockReceipt: {
    path: "/aww/stock-receipt",
    label: "AWW Stock Receipt",
    protected: true,
  },
};
