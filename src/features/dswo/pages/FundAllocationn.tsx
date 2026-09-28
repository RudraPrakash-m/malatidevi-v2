import React, { useState, useMemo, useCallback } from 'react';
import {
  Layers,
  Check,
  Minus,
  RotateCcw,
  Users,
  Building2,
  CheckCircle2,
  Sparkles,
} from 'lucide-react';
import { toast } from 'react-toastify';
import type { MRT_ColumnDef } from 'material-react-table';

import Card from '@/shared/components/layout/Card';
import FormGenerator from '@/shared/components/ui/Forms/FormGenerator';
import Input from '@/shared/components/ui/Forms/Input';
import Button from '@/shared/components/ui/Button';
import { ReusableTable } from '@/shared/components/ui/Table';
import type { FormField } from '@/shared/components/ui/Forms/form.types';

/* -------------------------------------------------------------
   Constants & Unit Rates
------------------------------------------------------------- */

const CATEGORY_LABEL_MAP: Record<string, string> = {
  sw: 'SW',
  uniform: 'Uniform',
  shoes_socks: 'Shoes & Socks',
};

const SECTOR_LABEL_MAP: Record<string, string> = {
  sector_1: 'Sector 1',
  sector_2: 'Sector 2',
  sector_3: 'Sector 3',
};

/* -------------------------------------------------------------
   Mock Database: Projects (for SW / Uniform)
------------------------------------------------------------- */

export interface ProjectItem {
  id: string;
  projectName: string;
  cdpoName: string;
  totalChildren: number;
}

const PROJECT_DATABASE: ProjectItem[] = [
  {
    id: 'proj-1',
    projectName: 'Bhubaneswar Urban ICDS Project',
    cdpoName: 'Smt. Manorama Mishra',
    totalChildren: 1250,
  },
  {
    id: 'proj-2',
    projectName: 'Cuttack Sadar ICDS Project',
    cdpoName: 'Sri Ramesh Chandra Patra',
    totalChildren: 1420,
  },
  {
    id: 'proj-3',
    projectName: 'Bhubaneswar Rural ICDS Project',
    cdpoName: 'Smt. Minati Behera',
    totalChildren: 980,
  },
  {
    id: 'proj-4',
    projectName: 'Jatni ICDS Project',
    cdpoName: 'Smt. Anusaya Mohanty',
    totalChildren: 1100,
  },
  {
    id: 'proj-5',
    projectName: 'Balianta ICDS Project',
    cdpoName: 'Smt. Pratima Dash',
    totalChildren: 850,
  },
  {
    id: 'proj-6',
    projectName: 'Pipili ICDS Project',
    cdpoName: 'Smt. Sabita Nayak',
    totalChildren: 1350,
  },
];

/* -------------------------------------------------------------
   Mock Database: AWC Centers (for Shoes & Socks)
------------------------------------------------------------- */

export interface AwcCenterItem {
  id: string;
  sectorId: string;
  sectorName: string;
  awcCode: string;
  awcName: string;
  awwName: string;
  totalChildren: number;
}

const AWC_CENTER_DATABASE: Record<string, AwcCenterItem[]> = {
  sector_1: [
    {
      id: 'awc-1',
      sectorId: 'sector_1',
      sectorName: 'Sector 1',
      awcCode: 'AWC-001',
      awcName: 'Unit 8 Anganwadi Center',
      awwName: 'Smt. Sunita Das',
      totalChildren: 45,
    },
    {
      id: 'awc-2',
      sectorId: 'sector_1',
      sectorName: 'Sector 1',
      awcCode: 'AWC-002',
      awcName: 'Saheed Nagar Anganwadi Center',
      awwName: 'Smt. Rashmita Nayak',
      totalChildren: 50,
    },
    {
      id: 'awc-3',
      sectorId: 'sector_1',
      sectorName: 'Sector 1',
      awcCode: 'AWC-003',
      awcName: 'Nayapalli Anganwadi Center',
      awwName: 'Smt. Geetanjali Sahoo',
      totalChildren: 38,
    },
    {
      id: 'awc-4',
      sectorId: 'sector_1',
      sectorName: 'Sector 1',
      awcCode: 'AWC-004',
      awcName: 'Khandagiri Anganwadi Center',
      awwName: 'Smt. Minati Jena',
      totalChildren: 55,
    },
    {
      id: 'awc-5',
      sectorId: 'sector_1',
      sectorName: 'Sector 1',
      awcCode: 'AWC-005',
      awcName: 'Baramunda Anganwadi Center',
      awwName: 'Smt. Prabhasini Rout',
      totalChildren: 42,
    },
  ],
  sector_2: [
    {
      id: 'awc-6',
      sectorId: 'sector_2',
      sectorName: 'Sector 2',
      awcCode: 'AWC-006',
      awcName: 'Patia Anganwadi Center',
      awwName: 'Smt. Namita Mohapatra',
      totalChildren: 48,
    },
    {
      id: 'awc-7',
      sectorId: 'sector_2',
      sectorName: 'Sector 2',
      awcCode: 'AWC-007',
      awcName: 'Chandrasekharpur Anganwadi Center',
      awwName: 'Smt. Jayashree Behera',
      totalChildren: 52,
    },
    {
      id: 'awc-8',
      sectorId: 'sector_2',
      sectorName: 'Sector 2',
      awcCode: 'AWC-008',
      awcName: 'Infocity Anganwadi Center',
      awwName: 'Smt. Anita Tripathy',
      totalChildren: 40,
    },
    {
      id: 'awc-9',
      sectorId: 'sector_2',
      sectorName: 'Sector 2',
      awcCode: 'AWC-009',
      awcName: 'Sailashree Vihar Anganwadi Center',
      awwName: 'Smt. Sanghamitra Panda',
      totalChildren: 35,
    },
  ],
  sector_3: [
    {
      id: 'awc-10',
      sectorId: 'sector_3',
      sectorName: 'Sector 3',
      awcCode: 'AWC-010',
      awcName: 'Old Town Anganwadi Center',
      awwName: 'Smt. Basanti Swain',
      totalChildren: 46,
    },
    {
      id: 'awc-11',
      sectorId: 'sector_3',
      sectorName: 'Sector 3',
      awcCode: 'AWC-011',
      awcName: 'Rasulgarh Anganwadi Center',
      awwName: 'Smt. Snehalata Pattnaik',
      totalChildren: 60,
    },
    {
      id: 'awc-12',
      sectorId: 'sector_3',
      sectorName: 'Sector 3',
      awcCode: 'AWC-012',
      awcName: 'Mancheswar Anganwadi Center',
      awwName: 'Smt. Pushpalata Samal',
      totalChildren: 34,
    },
  ],
};

/* -------------------------------------------------------------
   Main Component: FundAllocationn
------------------------------------------------------------- */

const FundAllocationn: React.FC = () => {
  // Form Selection States
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const [selectedProject, setSelectedProject] = useState<string>('project_1');
  const [selectedSector, setSelectedSector] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  // Table Selection & Custom Amounts for Projects (SW / Uniform)
  const [selectedProjectIds, setSelectedProjectIds] = useState<string[]>([]);
  const [customProjectAmounts, setCustomProjectAmounts] = useState<Record<string, number | ''>>({});

  // Table Selection & Custom Amounts for AWC (Shoe)
  const [selectedAwcIds, setSelectedAwcIds] = useState<string[]>([]);
  const [customAwcAmounts, setCustomAwcAmounts] = useState<Record<string, number | ''>>({});

  // Check Category Types
  const isShoeCategory = useMemo(() => {
    if (!selectedCategory) return false;
    const cat = selectedCategory.toLowerCase();
    return cat === 'shoes_socks' || cat.includes('shoe');
  }, [selectedCategory]);

  const isNonShoeCategory = useMemo(() => {
    if (!selectedCategory) return false;
    const cat = selectedCategory.toLowerCase();
    return cat === 'sw' || cat === 'uniform';
  }, [selectedCategory]);

  const initialDefaultValues = useMemo(
    () => ({
      financialYear: '2025-26',
      project: 'project_1',
      sector: '',
      category: '',
      amount: '',
    }),
    []
  );

  // Dynamic Form Fields:
  // - When SW or Uniform: Only Financial Year, Category, Amount (Project & Sector NOT shown)
  // - When Shoes: Financial Year, Category, Project, Sector, Amount
  const combinedFields = useMemo<FormField[]>(() => {
    const fields: FormField[] = [
      {
        name: 'financialYear',
        label: 'Financial Year',
        type: 'select',
        required: true,
        placeholder: 'Select Financial Year',
        options: [
          { label: '2025-26', value: '2025-26' },
          { label: '2026-27', value: '2026-27' },
          { label: '2027-28', value: '2027-28' },
        ],
        gridColumn: isShoeCategory ? 2 : 4,
      },
      {
        name: 'category',
        label: 'Category',
        type: 'select',
        required: true,
        placeholder: 'Select Category',
        options: [
          { label: 'SW', value: 'sw' },
          { label: 'Uniform', value: 'uniform' },
          { label: 'Shoes & Socks', value: 'shoes_socks' },
        ],
        gridColumn: isShoeCategory ? 2 : 4,
      },
    ];

    // Show Project and Sector ONLY when category is Shoes & Socks
    if (isShoeCategory) {
      fields.push({
        name: 'project',
        label: 'Project',
        type: 'select',
        required: true,
        placeholder: 'Select Project',
        options: [
          { label: 'Project 1', value: 'project_1' },
          { label: 'Project 2', value: 'project_2' },
          { label: 'Project 3', value: 'project_3' },
        ],
        gridColumn: 2,
      });

      fields.push({
        name: 'sector',
        label: 'Sector',
        type: 'select',
        required: true,
        placeholder: 'Select Sector',
        options: [
          { label: 'Sector 1', value: 'sector_1' },
          { label: 'Sector 2', value: 'sector_2' },
          { label: 'Sector 3', value: 'sector_3' },
        ],
        gridColumn: 3,
      });
    }

    // Amount is kept for all categories
    fields.push({
      name: 'amount',
      label: 'Amount (₹)',
      type: 'number',
      required: true,
      placeholder: 'e.g. 45000',
      min: 1,
      gridColumn: isShoeCategory ? 3 : 4,
      validation: {
        required: true,
        message: 'Please enter a valid disbursement amount',
      },
    });

    return fields;
  }, [isShoeCategory]);

  // Handle Form values change
  const handleValuesChange = (values: Record<string, unknown>) => {
    const cat = (values.category as string) || '';
    const proj = (values.project as string) || 'project_1';
    const sect = (values.sector as string) || '';

    if (cat !== selectedCategory) {
      setSelectedCategory(cat);
      if (cat !== 'shoes_socks' && !cat.toLowerCase().includes('shoe')) {
        setSelectedSector('');
        setSelectedAwcIds([]);
        setCustomAwcAmounts({});
      }
      setSelectedProjectIds([]);
      setCustomProjectAmounts({});
    }

    if (proj !== selectedProject) {
      setSelectedProject(proj);
    }

    if (sect !== selectedSector) {
      setSelectedSector(sect);
      setSelectedAwcIds([]);
      setCustomAwcAmounts({});
    }
  };

  // Form submit handler
  const handleDisburse = (data: Record<string, any>, context?: any) => {
    const numAmount = Number(data.amount);
    const catLabel = CATEGORY_LABEL_MAP[data.category] || data.category;

    setIsSubmitting(true);

    setTimeout(() => {
      toast.success(
        `₹${numAmount.toLocaleString('en-IN')} successfully allocated for ${catLabel}!`
      );
      context?.setValue('amount', '');
      setIsSubmitting(false);
    }, 300);
  };

  /* -----------------------------------------------------------
     Project Table Data & Handlers (for SW / Uniform)
  ----------------------------------------------------------- */

  const projectTableRows = useMemo(() => {
    return PROJECT_DATABASE.map((item) => {
      const customVal = customProjectAmounts[item.id];
      const finalAmount = customVal !== undefined ? customVal : '';

      return {
        ...item,
        calculatedAmount: 0,
        finalAmount,
        isCustom: customVal !== undefined,
      };
    });
  }, [customProjectAmounts]);

  const selectedProjectRows = useMemo(() => {
    return projectTableRows.filter((row) => selectedProjectIds.includes(row.id));
  }, [projectTableRows, selectedProjectIds]);

  const totalSelectedProjectAmount = useMemo(() => {
    return selectedProjectRows.reduce(
      (sum, row) => sum + (typeof row.finalAmount === 'number' ? row.finalAmount : 0),
      0
    );
  }, [selectedProjectRows]);

  const handleToggleProject = (id: string) => {
    setSelectedProjectIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const handleToggleSelectAllProjects = useCallback(() => {
    if (selectedProjectIds.length === PROJECT_DATABASE.length) {
      setSelectedProjectIds([]);
    } else {
      setSelectedProjectIds(PROJECT_DATABASE.map((item) => item.id));
    }
  }, [selectedProjectIds]);

  const handleProjectAmountChange = (id: string, newAmount: number | '') => {
    setCustomProjectAmounts((prev) => ({
      ...prev,
      [id]: newAmount,
    }));
  };

  const handleAllocateProjects = () => {
    if (selectedProjectIds.length === 0) {
      toast.warning('Please select at least one project.');
      return;
    }

    const catLabel = CATEGORY_LABEL_MAP[selectedCategory] || selectedCategory;
    toast.success(
      `₹${totalSelectedProjectAmount.toLocaleString('en-IN')} allocated successfully for ${selectedProjectIds.length} project(s) under ${catLabel}!`
    );
  };

  // Columns for Project Table (SW / Uniform)
  const projectColumns = useMemo<MRT_ColumnDef<any>[]>(
    () => [
      {
        id: 'select',
        header: 'Select',
        Header: () => {
          const isAllSelected =
            selectedProjectIds.length === PROJECT_DATABASE.length && PROJECT_DATABASE.length > 0;
          const isSomeSelected =
            selectedProjectIds.length > 0 && selectedProjectIds.length < PROJECT_DATABASE.length;

          return (
            <div className="flex items-center justify-center gap-1.5 py-0.5">
              <button
                type="button"
                onClick={handleToggleSelectAllProjects}
                className={`w-4 h-4 rounded border flex items-center justify-center transition-all cursor-pointer ${
                  isAllSelected || isSomeSelected
                    ? 'bg-primary border-primary text-white shadow-xs'
                    : 'border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 hover:border-primary'
                }`}
                title={isAllSelected ? 'Deselect All' : 'Select All'}
                aria-label={isAllSelected ? 'Deselect All' : 'Select All'}
              >
                {isAllSelected && <Check size={11} strokeWidth={3} />}
                {isSomeSelected && <Minus size={11} strokeWidth={3} />}
              </button>
              <span className="font-bold text-xs">Select</span>
            </div>
          );
        },
        size: 90,
        minSize: 80,
        enableSorting: false,
        enableColumnActions: false,
        enableColumnFilter: false,
        Cell: ({ row }) => {
          const isSelected = selectedProjectIds.includes(row.original.id);
          return (
            <div className="flex items-center justify-center">
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  handleToggleProject(row.original.id);
                }}
                className={`w-4 h-4 rounded border flex items-center justify-center transition-all cursor-pointer ${
                  isSelected
                    ? 'bg-primary border-primary text-white shadow-xs'
                    : 'border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 hover:border-primary'
                }`}
                aria-label={`Select ${row.original.projectName}`}
              >
                {isSelected && <Check size={11} strokeWidth={3} />}
              </button>
            </div>
          );
        },
      },
      {
        accessorKey: 'slNo',
        header: 'Sl No',
        size: 70,
        minSize: 60,
        Cell: ({ row }) => {
          const isSelected = selectedProjectIds.includes(row.original.id);
          return (
            <span
              className={`font-semibold text-xs ${
                isSelected
                  ? 'text-slate-700 dark:text-slate-300'
                  : 'text-slate-400 dark:text-slate-500'
              }`}
            >
              {row.index + 1}
            </span>
          );
        },
      },
      {
        accessorKey: 'projectName',
        header: 'Project Name',
        size: 260,
        minSize: 220,
        Cell: ({ row, cell }) => {
          const isSelected = selectedProjectIds.includes(row.original.id);
          return (
            <div className={`flex items-center gap-2 ${!isSelected ? 'opacity-60' : ''}`}>
              <span className="p-1 rounded bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 shrink-0">
                <Building2 size={14} />
              </span>
              <span
                className={`font-semibold text-xs ${
                  isSelected
                    ? 'text-slate-900 dark:text-slate-100'
                    : 'text-slate-500 dark:text-slate-400'
                }`}
              >
                {cell.getValue<string>()}
              </span>
            </div>
          );
        },
      },
      {
        accessorKey: 'cdpoName',
        header: 'CDPO Name',
        size: 220,
        minSize: 180,
        Cell: ({ row, cell }) => {
          const isSelected = selectedProjectIds.includes(row.original.id);
          return (
            <span
              className={`text-xs font-medium ${
                isSelected
                  ? 'text-slate-700 dark:text-slate-300'
                  : 'text-slate-400 dark:text-slate-500'
              }`}
            >
              {cell.getValue<string>()}
            </span>
          );
        },
      },
      {
        accessorKey: 'totalChildren',
        header: 'Total Children',
        size: 140,
        minSize: 120,
        Cell: ({ row, cell }) => {
          const isSelected = selectedProjectIds.includes(row.original.id);
          return (
            <div className={`flex items-center gap-1.5 ${!isSelected ? 'opacity-60' : ''}`}>
              <span className="p-1 rounded bg-amber-50 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400">
                <Users size={13} />
              </span>
              <span
                className={`font-bold font-mono text-xs ${
                  isSelected
                    ? 'text-slate-800 dark:text-slate-200'
                    : 'text-slate-500 dark:text-slate-400'
                }`}
              >
                {cell.getValue<number>() ?? 0}
              </span>
            </div>
          );
        },
      },
      {
        accessorKey: 'amount',
        header: 'Amount (₹)',
        size: 200,
        minSize: 180,
        Cell: ({ row }) => {
          const item = row.original;
          const isSelected = selectedProjectIds.includes(item.id);
          const currentVal = customProjectAmounts[item.id] !== undefined ? customProjectAmounts[item.id] : '';

          return (
            <div className="flex items-center gap-1.5">
              <div className="relative flex-1">
                <Input
                  id={`proj-amt-${item.id}`}
                  name={`proj-amt-${item.id}`}
                  type="number"
                  min={0}
                  disabled={!isSelected}
                  value={currentVal === '' ? '' : currentVal}
                  onChange={(e) => {
                    const val = e.target.value;
                    handleProjectAmountChange(item.id, val === '' ? '' : Number(val));
                  }}
                  placeholder="0"
                  wrapperClassName="mb-0"
                  className={`text-right font-mono font-semibold text-xs py-1 transition-colors ${
                    !isSelected
                      ? 'bg-slate-100 dark:bg-slate-800/60 text-slate-400 dark:text-slate-500 cursor-not-allowed opacity-60 border-slate-200 dark:border-slate-700'
                      : 'bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-100 border-primary/50 focus:border-primary'
                  }`}
                />
              </div>
            </div>
          );
        },
      },
    ],
    [selectedProjectIds, customProjectAmounts, handleToggleSelectAllProjects]
  );

  /* -----------------------------------------------------------
     AWC Table Data & Handlers (for Shoes & Socks)
  ----------------------------------------------------------- */

  const currentAwcList = useMemo(() => {
    if (!isShoeCategory || !selectedSector) return [];
    return AWC_CENTER_DATABASE[selectedSector] || [];
  }, [isShoeCategory, selectedSector]);

  const awcTableRows = useMemo(() => {
    return currentAwcList.map((item) => {
      const customVal = customAwcAmounts[item.id];
      const finalAmount = customVal !== undefined ? customVal : '';

      return {
        ...item,
        calculatedAmount: 0,
        finalAmount,
        isCustom: customVal !== undefined,
      };
    });
  }, [currentAwcList, customAwcAmounts]);

  const selectedAwcRows = useMemo(() => {
    return awcTableRows.filter((row) => selectedAwcIds.includes(row.id));
  }, [awcTableRows, selectedAwcIds]);

  const totalSelectedAwcChildren = useMemo(() => {
    return selectedAwcRows.reduce((sum, row) => sum + row.totalChildren, 0);
  }, [selectedAwcRows]);

  const totalSelectedAwcAmount = useMemo(() => {
    return selectedAwcRows.reduce(
      (sum, row) => sum + (typeof row.finalAmount === 'number' ? row.finalAmount : 0),
      0
    );
  }, [selectedAwcRows]);

  const handleToggleAwc = (id: string) => {
    setSelectedAwcIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const handleToggleSelectAllAwc = useCallback(() => {
    if (selectedAwcIds.length === currentAwcList.length) {
      setSelectedAwcIds([]);
    } else {
      setSelectedAwcIds(currentAwcList.map((item) => item.id));
    }
  }, [selectedAwcIds, currentAwcList]);

  const handleAwcAmountChange = (id: string, newAmount: number | '') => {
    setCustomAwcAmounts((prev) => ({
      ...prev,
      [id]: newAmount,
    }));
  };

  const handleAllocateAwc = () => {
    if (selectedAwcIds.length === 0) {
      toast.warning('Please select at least one AWC center.');
      return;
    }

    const sectorLabel = SECTOR_LABEL_MAP[selectedSector] || selectedSector;
    toast.success(
      `₹${totalSelectedAwcAmount.toLocaleString('en-IN')} allocated successfully for ${selectedAwcIds.length} AWC center(s) in ${sectorLabel}!`
    );
  };

  // Columns for AWC Table (Shoes & Socks)
  const awcColumns = useMemo<MRT_ColumnDef<any>[]>(
    () => [
      {
        id: 'select',
        header: 'Select',
        Header: () => {
          const isAllSelected =
            selectedAwcIds.length === currentAwcList.length && currentAwcList.length > 0;
          const isSomeSelected =
            selectedAwcIds.length > 0 && selectedAwcIds.length < currentAwcList.length;

          return (
            <div className="flex items-center justify-center gap-1.5 py-0.5">
              <button
                type="button"
                onClick={handleToggleSelectAllAwc}
                className={`w-4 h-4 rounded border flex items-center justify-center transition-all cursor-pointer ${
                  isAllSelected || isSomeSelected
                    ? 'bg-primary border-primary text-white shadow-xs'
                    : 'border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 hover:border-primary'
                }`}
                title={isAllSelected ? 'Deselect All' : 'Select All'}
                aria-label={isAllSelected ? 'Deselect All' : 'Select All'}
              >
                {isAllSelected && <Check size={11} strokeWidth={3} />}
                {isSomeSelected && <Minus size={11} strokeWidth={3} />}
              </button>
              <span className="font-bold text-xs">Select</span>
            </div>
          );
        },
        size: 90,
        minSize: 80,
        enableSorting: false,
        enableColumnActions: false,
        enableColumnFilter: false,
        Cell: ({ row }) => {
          const isSelected = selectedAwcIds.includes(row.original.id);
          return (
            <div className="flex items-center justify-center">
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  handleToggleAwc(row.original.id);
                }}
                className={`w-4 h-4 rounded border flex items-center justify-center transition-all cursor-pointer ${
                  isSelected
                    ? 'bg-primary border-primary text-white shadow-xs'
                    : 'border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 hover:border-primary'
                }`}
                aria-label={`Select ${row.original.awcName}`}
              >
                {isSelected && <Check size={11} strokeWidth={3} />}
              </button>
            </div>
          );
        },
      },
      {
        accessorKey: 'slNo',
        header: 'Sl No',
        size: 70,
        minSize: 60,
        Cell: ({ row }) => {
          const isSelected = selectedAwcIds.includes(row.original.id);
          return (
            <span
              className={`font-semibold text-xs ${
                isSelected
                  ? 'text-slate-700 dark:text-slate-300'
                  : 'text-slate-400 dark:text-slate-500'
              }`}
            >
              {row.index + 1}
            </span>
          );
        },
      },
      {
        accessorKey: 'awcCode',
        header: 'AWC Code',
        size: 130,
        minSize: 110,
        Cell: ({ row, cell }) => {
          const isSelected = selectedAwcIds.includes(row.original.id);
          return (
            <span
              className={`font-mono font-bold text-xs px-2 py-0.5 rounded border ${
                isSelected
                  ? 'text-primary bg-primary/10 border-primary/20'
                  : 'text-slate-400 bg-slate-100 dark:bg-slate-800 border-slate-200 dark:border-slate-700'
              }`}
            >
              {cell.getValue<string>()}
            </span>
          );
        },
      },
      {
        accessorKey: 'awcName',
        header: 'AWC Name',
        size: 240,
        minSize: 200,
        Cell: ({ row, cell }) => {
          const isSelected = selectedAwcIds.includes(row.original.id);
          return (
            <span
              className={`font-semibold text-xs ${
                isSelected
                  ? 'text-slate-900 dark:text-slate-100'
                  : 'text-slate-500 dark:text-slate-400'
              }`}
            >
              {cell.getValue<string>()}
            </span>
          );
        },
      },
      {
        accessorKey: 'awwName',
        header: 'AWW Name',
        size: 200,
        minSize: 170,
        Cell: ({ row, cell }) => {
          const isSelected = selectedAwcIds.includes(row.original.id);
          return (
            <span
              className={`text-xs font-medium ${
                isSelected
                  ? 'text-slate-700 dark:text-slate-300'
                  : 'text-slate-400 dark:text-slate-500'
              }`}
            >
              {cell.getValue<string>()}
            </span>
          );
        },
      },
      {
        accessorKey: 'totalChildren',
        header: 'Total Children',
        size: 130,
        minSize: 110,
        Cell: ({ row, cell }) => {
          const isSelected = selectedAwcIds.includes(row.original.id);
          return (
            <div className={`flex items-center gap-1.5 ${!isSelected ? 'opacity-60' : ''}`}>
              <span className="p-1 rounded bg-amber-50 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400">
                <Users size={13} />
              </span>
              <span
                className={`font-bold font-mono text-xs ${
                  isSelected
                    ? 'text-slate-800 dark:text-slate-200'
                    : 'text-slate-500 dark:text-slate-400'
                }`}
              >
                {cell.getValue<number>() ?? 0}
              </span>
            </div>
          );
        },
      },
      {
        accessorKey: 'amount',
        header: 'Amount (₹)',
        size: 200,
        minSize: 180,
        Cell: ({ row }) => {
          const item = row.original;
          const isSelected = selectedAwcIds.includes(item.id);
          const currentVal = customAwcAmounts[item.id] !== undefined ? customAwcAmounts[item.id] : '';

          return (
            <div className="flex items-center gap-1.5">
              <div className="relative flex-1">
                <Input
                  id={`awc-amt-${item.id}`}
                  name={`awc-amt-${item.id}`}
                  type="number"
                  min={0}
                  disabled={!isSelected}
                  value={currentVal === '' ? '' : currentVal}
                  onChange={(e) => {
                    const val = e.target.value;
                    handleAwcAmountChange(item.id, val === '' ? '' : Number(val));
                  }}
                  placeholder="0"
                  wrapperClassName="mb-0"
                  className={`text-right font-mono font-semibold text-xs py-1 transition-colors ${
                    !isSelected
                      ? 'bg-slate-100 dark:bg-slate-800/60 text-slate-400 dark:text-slate-500 cursor-not-allowed opacity-60 border-slate-200 dark:border-slate-700'
                      : 'bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-100 border-primary/50 focus:border-primary'
                  }`}
                />
              </div>
            </div>
          );
        },
      },
    ],
    [selectedAwcIds, currentAwcList, customAwcAmounts, handleToggleSelectAllAwc]
  );

  return (
    <div className="space-y-6">
      <Card title="Fund Allocation" icon={Layers}>
        {/* Top Filter Form */}
        <FormGenerator
          fields={combinedFields}
          defaultValues={initialDefaultValues}
          onValuesChange={handleValuesChange}
          onSubmit={handleDisburse}
          loading={isSubmitting}
          gridColumns={12}
        />

        {/* CASE 1: SW / Uniform Selected -> Show Project-level Allocation Table */}
        {isNonShoeCategory && (
          <div className="mt-6 space-y-3 pt-4 border-t border-slate-200/80 dark:border-slate-700/80">
            {/* Summary Banner & Metrics */}
            <div className="p-3 bg-gradient-to-br from-slate-50 to-blue-50/40 dark:from-slate-800/80 dark:to-slate-900/80 rounded-xl border border-slate-200/90 dark:border-slate-700/80 shadow-2xs space-y-2">
              <div className="flex items-center justify-between flex-wrap gap-3">
                <div className="flex items-center gap-2.5 flex-wrap">
                  <span className="font-bold text-sm text-slate-800 dark:text-slate-100 flex items-center gap-1.5">
                    <Building2 size={16} className="text-primary" />
                    {CATEGORY_LABEL_MAP[selectedCategory] || selectedCategory} - Project Fund Allocation
                  </span>
                  <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-primary/10 text-primary border border-primary/20">
                    {selectedProjectIds.length} of {PROJECT_DATABASE.length} Projects Selected
                  </span>
                </div>
              </div>
            </div>

            {/* Reusable Material React Table for Projects */}
            <div className="border border-slate-200 dark:border-slate-700 rounded-xl overflow-hidden bg-white dark:bg-slate-900 shadow-xs">
              <ReusableTable
                columns={projectColumns}
                data={projectTableRows}
              />
            </div>

            {/* Allocation Action Footer */}
            <div className="flex justify-end gap-3 pt-2">
              <Button
                type="button"
                variant="outline"
                label="Reset Selection"
                icon={<RotateCcw size={15} />}
                onClick={() => {
                  setSelectedProjectIds([]);
                  setCustomProjectAmounts({});
                  toast.info('Selections reset.');
                }}
                disabled={selectedProjectIds.length === 0}
              />
              <Button
                type="button"
                variant="primary"
                label={`Allocate Funds (${selectedProjectIds.length} Projects)`}
                icon={<CheckCircle2 size={16} />}
                onClick={handleAllocateProjects}
                disabled={selectedProjectIds.length === 0}
              />
            </div>
          </div>
        )}

        {/* CASE 2: Shoes & Socks Selected with Sector -> Show AWC Allocation Table */}
        {isShoeCategory && selectedSector && (
          <div className="mt-6 space-y-3 pt-4 border-t border-slate-200/80 dark:border-slate-700/80">
            {/* Summary Banner & Metrics */}
            <div className="p-3 bg-gradient-to-br from-slate-50 to-blue-50/40 dark:from-slate-800/80 dark:to-slate-900/80 rounded-xl border border-slate-200/90 dark:border-slate-700/80 shadow-2xs space-y-2">
              <div className="flex items-center justify-between flex-wrap gap-3">
                <div className="flex items-center gap-2.5 flex-wrap">
                  <span className="font-bold text-sm text-slate-800 dark:text-slate-100 flex items-center gap-1.5">
                    <Building2 size={16} className="text-primary" />
                    {SECTOR_LABEL_MAP[selectedSector] || selectedSector} - AWC Fund Allocation
                  </span>
                  <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-primary/10 text-primary border border-primary/20">
                    {selectedAwcIds.length} of {currentAwcList.length} Centers Selected
                  </span>
                </div>

                {/* Live Selected Metrics */}
                <div className="flex items-center gap-3 text-xs flex-wrap">
                  <div className="flex items-center gap-1.5">
                    <span className="text-slate-500 dark:text-slate-400">Total Children:</span>
                    <span className="font-mono font-bold text-slate-800 dark:text-slate-200">
                      {totalSelectedAwcChildren}
                    </span>
                  </div>
                  <span className="text-slate-300 dark:text-slate-600">|</span>
                  <div className="flex items-center gap-1.5">
                    <span className="text-slate-500 dark:text-slate-400">Allocated Amount:</span>
                    <span className="font-mono font-bold text-emerald-600 dark:text-emerald-400 text-sm">
                      ₹{totalSelectedAwcAmount.toLocaleString('en-IN')}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Reusable Material React Table for AWC Centers */}
            <div className="border border-slate-200 dark:border-slate-700 rounded-xl overflow-hidden bg-white dark:bg-slate-900 shadow-xs">
              <ReusableTable
                columns={awcColumns}
                data={awcTableRows}
              />
            </div>

            {/* Allocation Action Footer */}
            <div className="flex justify-end gap-3 pt-2">
              <Button
                type="button"
                variant="outline"
                label="Reset Selection"
                icon={<RotateCcw size={15} />}
                onClick={() => {
                  setSelectedAwcIds([]);
                  setCustomAwcAmounts({});
                  toast.info('Selections reset.');
                }}
                disabled={selectedAwcIds.length === 0}
              />
              <Button
                type="button"
                variant="primary"
                label={`Allocate Funds (${selectedAwcIds.length} Centers)`}
                icon={<CheckCircle2 size={16} />}
                onClick={handleAllocateAwc}
                disabled={selectedAwcIds.length === 0}
              />
            </div>
          </div>
        )}

        {/* Prompt when Shoe is selected but Sector is not yet chosen */}
        {isShoeCategory && !selectedSector && (
          <div className="mt-6 p-8 border border-dashed border-slate-300 dark:border-slate-700 rounded-xl text-center bg-slate-50/50 dark:bg-slate-800/20">
            <Sparkles className="mx-auto text-primary/60 mb-2" size={28} />
            <h4 className="font-semibold text-sm text-slate-700 dark:text-slate-200">
              Please select a Sector
            </h4>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
              Choose a sector above to view and allocate funds to its Anganwadi Centers (AWC).
            </p>
          </div>
        )}
      </Card>
    </div>
  );
};

export default FundAllocationn;