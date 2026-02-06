import React from 'react';
import { ChevronDownIcon } from '@heroicons/react/24/outline';

export default function FilterSection({ filters, options, monthNames, onFilterChange, onSetToday }) {
    return (
        <div className="flex flex-wrap gap-2 mb-8">
            <div className="flex items-center gap-1 p-1.5 bg-white dark:bg-white/5 rounded-xl border border-black/5 dark:border-white/5 w-fit shadow-sm">
                <div className="relative group">
                    <select
                        value={filters.year || ''}
                        onChange={(e) => onFilterChange('year', e.target.value)}
                        className="appearance-none bg-transparent border-0 rounded-lg pl-3 pr-8 py-2 text-[10px] font-black uppercase tracking-widest text-brand-black dark:text-brand-white focus:ring-0 cursor-pointer hover:bg-black/5 dark:hover:bg-white/5 transition-colors"
                    >
                        <option value="" className="bg-white dark:bg-brand-black">Tahun</option>
                        {options.years.map((year) => (
                            <option key={year} value={year} className="bg-white dark:bg-brand-black">{year}</option>
                        ))}
                    </select>
                    <ChevronDownIcon className="absolute right-2 top-1/2 -translate-y-1/2 w-3 h-3 text-brand-black/40 dark:text-brand-white/40 pointer-events-none group-hover:text-brand-gold transition-colors" />
                </div>

                <div className="w-px h-4 bg-black/10 dark:bg-white/10"></div>

                <div className="relative group">
                    <select
                        value={filters.month || ''}
                        onChange={(e) => onFilterChange('month', e.target.value)}
                        disabled={!filters.year}
                        className="appearance-none bg-transparent border-0 rounded-lg pl-3 pr-8 py-2 text-[10px] font-black uppercase tracking-widest text-brand-black dark:text-brand-white focus:ring-0 cursor-pointer hover:bg-black/5 dark:hover:bg-white/5 transition-colors disabled:opacity-30"
                    >
                        <option value="" className="bg-white dark:bg-brand-black">Bulan</option>
                        {options.months.map((month) => (
                            <option key={month} value={month} className="bg-white dark:bg-brand-black">{monthNames[month]}</option>
                        ))}
                    </select>
                    <ChevronDownIcon className="absolute right-2 top-1/2 -translate-y-1/2 w-3 h-3 text-brand-black/40 dark:text-brand-white/40 pointer-events-none group-hover:text-brand-gold transition-colors" />
                </div>

                <div className="w-px h-4 bg-black/10 dark:bg-white/10"></div>

                <div className="relative group">
                    <select
                        value={filters.day || ''}
                        onChange={(e) => onFilterChange('day', e.target.value)}
                        disabled={!filters.month}
                        className="appearance-none bg-transparent border-0 rounded-lg pl-3 pr-8 py-2 text-[10px] font-black uppercase tracking-widest text-brand-black dark:text-brand-white focus:ring-0 cursor-pointer hover:bg-black/5 dark:hover:bg-white/5 transition-colors disabled:opacity-30"
                    >
                        <option value="" className="bg-white dark:bg-brand-black">Tgl</option>
                        {options.days.map((day) => (
                            <option key={day} value={day} className="bg-white dark:bg-brand-black">{day}</option>
                        ))}
                    </select>
                    <ChevronDownIcon className="absolute right-2 top-1/2 -translate-y-1/2 w-3 h-3 text-brand-black/40 dark:text-brand-white/40 pointer-events-none group-hover:text-brand-gold transition-colors" />
                </div>
            </div>

            <button
                onClick={onSetToday}
                className="px-4 py-2 bg-brand-gold text-brand-black rounded-xl text-[10px] font-black uppercase tracking-widest shadow-md hover:bg-brand-gold/90 transition-all shrink-0"
            >
                Hari Ini
            </button>
        </div>
    );
}
