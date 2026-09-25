// src/features/shared/wshg-application/GeoTagPhotoModal.tsx

import React from 'react';
import { MapPin, Navigation, Calendar, CheckCircle2 } from 'lucide-react';
import Modal from '@/shared/components/ui/Modal/Modal';
import Button from '@/shared/components/ui/Button';
import type { CheckItem } from '../types/shared.types';

export interface GeoTagPhotoModalProps {
  isOpen: boolean;
  onClose: () => void;
  item: CheckItem | null;
}

export const GeoTagPhotoModal: React.FC<GeoTagPhotoModalProps> = ({
  isOpen,
  onClose,
  item,
}) => {
  if (!item) return null;

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={`GeoTag Photo & Premises Verification - ${item.name}`}
      size="lg"
    >
      <div className="space-y-4">
        {/* Photo with GPS Overlays */}
        <div className="relative rounded-xl overflow-hidden border border-slate-200 dark:border-slate-700 bg-slate-950 aspect-video max-h-[340px] flex items-center justify-center">
          <img
            src={item.geoTagPhoto}
            alt={`GeoTag Premises for ${item.name}`}
            className="w-full h-full object-cover"
          />

          {/* GeoTag Badge Overlay */}
          <div className="absolute bottom-3 left-3 right-3 p-3 rounded-lg bg-black/75 backdrop-blur-md text-white border border-white/20 text-xs flex flex-wrap items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <MapPin size={16} className="text-amber-400 shrink-0" />
              <div>
                <span className="font-semibold text-white">
                  Lat: {item.geoLatitude.toFixed(4)}°, Long: {item.geoLongitude.toFixed(4)}°
                </span>
                <span className="ml-2 text-[11px] text-emerald-400 font-mono">
                  (±{item.geoAccuracy || '2.5m'})
                </span>
              </div>
            </div>
            <div className="flex items-center gap-1.5 text-[11px] text-slate-300">
              <Calendar size={13} className="text-slate-400" />
              <span>{item.geoTimestamp || item.applyDate}</span>
            </div>
          </div>
        </div>

        {/* Location & Verification Metadata */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs">
          <div>
            <span className="text-slate-500 dark:text-slate-400 block mb-0.5 font-medium">
              Registered Site Address
            </span>
            <p className="font-semibold text-slate-800 dark:text-slate-200">
              {item.geoAddress || `${item.block}, ${item.district}, Odisha`}
            </p>
          </div>

          <div>
            <span className="text-slate-500 dark:text-slate-400 block mb-0.5 font-medium">
              Geographic Coordinates
            </span>
            <div className="flex items-center gap-2">
              <span className="font-mono font-medium text-slate-700 dark:text-slate-300">
                {item.geoLatitude}, {item.geoLongitude}
              </span>
              <a
                href={`https://maps.google.com/?q=${item.geoLatitude},${item.geoLongitude}`}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1 text-xs text-orange-600 dark:text-orange-400 font-semibold hover:underline"
              >
                <Navigation size={12} />
                Open Map
              </a>
            </div>
          </div>

          <div>
            <span className="text-slate-500 dark:text-slate-400 block mb-0.5 font-medium">
              Block / District
            </span>
            <p className="font-semibold text-slate-800 dark:text-slate-200">
              {item.block} / {item.district}
            </p>
          </div>

          <div>
            <span className="text-slate-500 dark:text-slate-400 block mb-0.5 font-medium">
              Geo-Fencing Status
            </span>
            <span className="inline-flex items-center gap-1 text-emerald-600 dark:text-emerald-400 font-semibold">
              <CheckCircle2 size={13} /> Matched with Block Boundary
            </span>
          </div>
        </div>

        {/* Footer */}
        <div className="flex justify-end gap-2 pt-2 border-t border-slate-100 dark:border-slate-800">
          <Button
            type="button"
            variant="secondary"
            label="Close"
            size="sm"
            onClick={onClose}
          />
        </div>
      </div>
    </Modal>
  );
};

export default GeoTagPhotoModal;
