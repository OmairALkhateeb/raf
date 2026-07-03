'use client';

import { useState } from 'react';
import { MapPin, ChevronDown, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useLanguage } from '@/contexts/LanguageContext';
import { useDeliveryLocation, type DeliveryLocation } from '@/contexts/DeliveryLocationContext';

const OMAN_GOVERNORATES: Omit<DeliveryLocation, 'area'>[] = [
  { governorate: 'Muscat', governorateAr: 'مسقط' },
  { governorate: 'Dhofar', governorateAr: 'ظفار' },
  { governorate: 'Al Batinah North', governorateAr: 'شمال الباطنة' },
  { governorate: 'Al Batinah South', governorateAr: 'جنوب الباطنة' },
  { governorate: 'Ad Dakhiliyah', governorateAr: 'الداخلية' },
  { governorate: 'Ash Sharqiyah North', governorateAr: 'شمال الشرقية' },
  { governorate: 'Ash Sharqiyah South', governorateAr: 'جنوب الشرقية' },
  { governorate: 'Al Dhahirah', governorateAr: 'الظاهرة' },
  { governorate: 'Al Buraimi', governorateAr: 'البريمي' },
  { governorate: 'Al Wusta', governorateAr: 'الوسطى' },
  { governorate: 'Musandam', governorateAr: 'مسندم' },
];

export default function DeliveryLocationSelector() {
  const { language, isRTL } = useLanguage();
  const { location, setLocation, displayLabel } = useDeliveryLocation();
  const [isOpen, setIsOpen] = useState(false);
  const [selectedGov, setSelectedGov] = useState<Omit<DeliveryLocation, 'area'> | null>(
    location ? { governorate: location.governorate, governorateAr: location.governorateAr } : null,
  );
  const [area, setArea] = useState(location?.area ?? '');

  const openModal = () => {
    setSelectedGov(
      location ? { governorate: location.governorate, governorateAr: location.governorateAr } : null,
    );
    setArea(location?.area ?? '');
    setIsOpen(true);
  };

  const handleSave = () => {
    if (!selectedGov) return;
    setLocation({
      governorate: selectedGov.governorate,
      governorateAr: selectedGov.governorateAr,
      area: area.trim() || undefined,
    });
    setIsOpen(false);
  };

  const prefix = language === 'ar' ? 'التوصيل إلى:' : 'Deliver to:';

  return (
    <>
      <button
        type="button"
        onClick={openModal}
        dir={isRTL ? 'rtl' : 'ltr'}
        className={`w-full flex items-center justify-center gap-2 px-4 py-2 bg-[#FAF7F2] border-b border-[#2D1F1F]/8 text-[12px] sm:text-[13px] text-[#2D1F1F] hover:bg-[#F5F0E8] transition-colors ${
          isRTL ? 'flex-row-reverse' : ''
        }`}
        aria-label={displayLabel(language)}
      >
        <MapPin size={14} className="text-[#C9A84C] shrink-0" />
        <span className="truncate">
          <span className="text-[#2D1F1F]/50">{prefix}</span>{' '}
          <span className={`font-semibold ${location ? 'text-[#2D1F1F]' : 'text-[#C9A84C]'}`}>
            {location ? displayLabel(language) : (language === 'ar' ? 'اختر الموقع' : 'Choose location')}
          </span>
        </span>
        <ChevronDown size={13} className="text-[#2D1F1F]/40 shrink-0" />
      </button>

      <AnimatePresence>
        {isOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/40 z-[60]"
              onClick={() => setIsOpen(false)}
            />
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 40 }}
              transition={{ type: 'spring', damping: 28, stiffness: 320 }}
              dir={isRTL ? 'rtl' : 'ltr'}
              className="fixed inset-x-4 bottom-4 sm:inset-auto sm:top-1/2 sm:left-1/2 sm:-translate-x-1/2 sm:-translate-y-1/2 sm:w-full sm:max-w-md bg-white rounded-xl shadow-2xl z-[70] overflow-hidden"
              role="dialog"
              aria-modal="true"
              aria-labelledby="delivery-location-title"
            >
              <div className={`flex items-center justify-between px-5 py-4 border-b border-[#2D1F1F]/8 ${isRTL ? 'flex-row-reverse' : ''}`}>
                <h2 id="delivery-location-title" className="text-base font-serif font-bold text-[#2D1F1F]">
                  {language === 'ar' ? 'حدد موقع التوصيل' : 'Set Delivery Location'}
                </h2>
                <button
                  type="button"
                  onClick={() => setIsOpen(false)}
                  className="p-1.5 text-[#2D1F1F]/40 hover:text-[#2D1F1F] transition-colors"
                  aria-label={language === 'ar' ? 'إغلاق' : 'Close'}
                >
                  <X size={18} />
                </button>
              </div>

              <div className="p-5 space-y-4">
                <div>
                  <label className="block text-[10px] font-black tracking-[0.2em] uppercase text-[#2D1F1F]/45 mb-2">
                    {language === 'ar' ? 'المحافظة' : 'Governorate'}
                  </label>
                  <select
                    value={selectedGov?.governorate ?? ''}
                    onChange={e => {
                      const gov = OMAN_GOVERNORATES.find(g => g.governorate === e.target.value);
                      setSelectedGov(gov ?? null);
                    }}
                    className={`w-full h-11 px-4 border border-[#2D1F1F]/15 bg-[#FAF7F2] text-sm text-[#2D1F1F] rounded-md focus:outline-none focus:border-[#C9A84C] transition-colors ${
                      isRTL ? 'text-right' : 'text-left'
                    }`}
                  >
                    <option value="">
                      {language === 'ar' ? '— اختر المحافظة —' : '— Select governorate —'}
                    </option>
                    {OMAN_GOVERNORATES.map(gov => (
                      <option key={gov.governorate} value={gov.governorate}>
                        {language === 'ar' ? gov.governorateAr : gov.governorate}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-[10px] font-black tracking-[0.2em] uppercase text-[#2D1F1F]/45 mb-2">
                    {language === 'ar' ? 'المنطقة / الحي (اختياري)' : 'Area / District (optional)'}
                  </label>
                  <input
                    type="text"
                    value={area}
                    onChange={e => setArea(e.target.value)}
                    placeholder={language === 'ar' ? 'مثال: القرم، الخوض، صلالة' : 'e.g. Al Qurum, Al Khoud, Salalah'}
                    className={`w-full h-11 px-4 border border-[#2D1F1F]/15 bg-[#FAF7F2] text-sm text-[#2D1F1F] placeholder-[#2D1F1F]/30 rounded-md focus:outline-none focus:border-[#C9A84C] transition-colors ${
                      isRTL ? 'text-right' : 'text-left'
                    }`}
                  />
                </div>

                <button
                  type="button"
                  onClick={handleSave}
                  disabled={!selectedGov}
                  className="w-full h-11 bg-[#2D1F1F] text-white text-[11px] font-black tracking-[0.2em] uppercase rounded-md hover:bg-[#C9A84C] hover:text-[#2D1F1F] transition-colors disabled:opacity-40"
                >
                  {language === 'ar' ? 'تأكيد الموقع' : 'Confirm Location'}
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
