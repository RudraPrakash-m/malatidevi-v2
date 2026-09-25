import React from 'react';

export interface DashboardBannerProps {
  tag: string;
  title: string;
  description: string;
  gradient?: string;
  tagColor?: string;
}

export const DashboardBanner: React.FC<DashboardBannerProps> = ({
  tag,
  title,
  description,
  gradient = 'from-blue-950 via-indigo-900 to-slate-900',
  tagColor = 'bg-blue-500/30 text-blue-200 border-blue-400/30',
}) => {
  return (
    <div className={`p-6 rounded-2xl bg-gradient-to-r ${gradient} text-white shadow-md relative overflow-hidden`}>
      <div className="relative z-10 max-w-3xl">
        <span className={`px-3 py-1 text-xs font-bold rounded-full ${tagColor} border inline-block mb-3`}>
          {tag}
        </span>
        <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight">
          {title}
        </h1>
        <p className="mt-2 text-sm text-slate-100/80 leading-relaxed">
          {description}
        </p>
      </div>
    </div>
  );
};

export default DashboardBanner;
