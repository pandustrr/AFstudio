import React, { useState, useMemo } from 'react';
import { ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/24/outline';

const CalendarWidget = ({ selectedDate, onDateSelect, monthlyStats = {}, availableYears = [], dateMarks = {} }) => {
    // Current view state
    const [viewDate, setViewDate] = useState(new Date(selectedDate));
    const [showYearSelector, setShowYearSelector] = useState(false);

    // Helpers
    const getDaysInMonth = (year, month) => new Date(year, month + 1, 0).getDate();
    const getFirstDayOfMonth = (year, month) => new Date(year, month, 1).getDay(); // 0 = Sunday

    const currentYear = viewDate.getFullYear();
    const currentMonth = viewDate.getMonth(); // 0-indexed

    const monthNames = [
        "JAN", "FEB", "MAR", "APR", "MAY", "JUN",
        "JUL", "AUG", "SEP", "OCT", "NOV", "DEC"
    ];

    const dayNames = ["MIN", "SEN", "SEL", "RAB", "KAM", "JUM", "SAB"];

    // Navigation
    const handlePrevMonth = () => {
        setViewDate(new Date(currentYear, currentMonth - 1, 1));
    };

    const handleNextMonth = () => {
        setViewDate(new Date(currentYear, currentMonth + 1, 1));
    };

    const handleYearChange = (year) => {
        setViewDate(new Date(year, currentMonth, 1));
        setShowYearSelector(false);
    };

    // Calendar Grid Generation
    const days = useMemo(() => {
        const daysInMonth = getDaysInMonth(currentYear, currentMonth);
        const firstDay = getFirstDayOfMonth(currentYear, currentMonth); // 0-6 (Sun-Sat)

        const daysArray = [];

        // Previous month filler
        const prevMonthDays = getDaysInMonth(currentYear, currentMonth - 1);
        for (let i = 0; i < firstDay; i++) {
            daysArray.push({
                day: prevMonthDays - firstDay + 1 + i,
                type: 'prev',
                date: new Date(currentYear, currentMonth - 1, prevMonthDays - firstDay + 1 + i)
            });
        }

        // Current month days
        for (let i = 1; i <= daysInMonth; i++) {
            const dateObj = new Date(currentYear, currentMonth, i);
            const dateStr = dateObj.toLocaleDateString('en-CA');

            daysArray.push({
                day: i,
                type: 'current',
                date: dateObj,
                dateStr: dateStr,
                stats: monthlyStats[dateStr] || 0,
                mark: dateMarks[dateStr] || null
            });
        }

        // Next month filler
        const totalCells = Math.ceil(daysArray.length / 7) * 7;
        const remainingCells = totalCells - daysArray.length;

        for (let i = 1; i <= remainingCells; i++) {
            daysArray.push({
                day: i,
                type: 'next',
                date: new Date(currentYear, currentMonth + 1, i)
            });
        }

        return daysArray;
    }, [currentYear, currentMonth, monthlyStats, dateMarks]);

    const isSelected = (date) => {
        if (!date) return false;
        const sel = new Date(selectedDate);
        return date.getDate() === sel.getDate() &&
            date.getMonth() === sel.getMonth() &&
            date.getFullYear() === sel.getFullYear();
    };

    const isSunday = (date) => date.getDay() === 0;

    return (
        <div className="bg-white dark:bg-white/5 text-brand-black dark:text-white p-4 w-full max-w-md mx-auto font-sans shadow-2xl rounded-3xl relative overflow-hidden border border-black/5 dark:border-white/5">
            {/* Header */}
            <div className="relative flex justify-center items-center mb-8 pt-2">
                <button
                    onClick={handlePrevMonth}
                    className="absolute left-0 p-2 text-brand-black/30 dark:text-white/30 hover:text-brand-black dark:hover:text-white transition-colors"
                >
                    <ChevronLeftIcon className="w-6 h-6" />
                </button>

                <div className="flex flex-col items-center cursor-pointer group" onClick={() => setShowYearSelector(!showYearSelector)}>
                    <h2 className="text-3xl font-black tracking-tighter text-brand-black dark:text-white uppercase group-hover:text-brand-gold transition-colors">
                        {monthNames[currentMonth]}
                    </h2>
                    <span className="text-[10px] tracking-[0.3em] font-bold text-brand-black/30 dark:text-white/30 group-hover:text-brand-gold transition-colors">{currentYear}</span>
                </div>

                <button
                    onClick={handleNextMonth}
                    className="absolute right-0 p-2 text-brand-black/30 dark:text-white/30 hover:text-brand-black dark:hover:text-white transition-colors"
                >
                    <ChevronRightIcon className="w-6 h-6" />
                </button>
            </div>

            {/* Year Selector Overlay */}
            {showYearSelector && (
                <div className="absolute inset-0 bg-white/95 dark:bg-zinc-900/95 backdrop-blur-sm z-50 flex flex-col items-center justify-center animate-in fade-in duration-200">
                    <h3 className="text-brand-black/50 dark:text-white/50 text-xs tracking-widest uppercase mb-4">Pilih Tahun</h3>
                    <div className="grid grid-cols-3 gap-4">
                        {availableYears.map(year => (
                            <button
                                key={year}
                                onClick={() => handleYearChange(year)}
                                className={`px-4 py-2 rounded-lg text-sm font-bold transition-all ${year === currentYear
                                    ? 'bg-brand-gold text-white shadow-lg shadow-brand-gold/20 scale-110'
                                    : 'text-brand-black/70 dark:text-white/70 hover:text-brand-gold hover:bg-black/5 dark:hover:bg-white/5'
                                    }`}
                            >
                                {year}
                            </button>
                        ))}
                    </div>
                </div>
            )}

            {/* Days Header */}
            <div className="grid grid-cols-7 mb-6 text-center">
                {dayNames.map((day, index) => (
                    <div key={day} className={`text-[11px] font-bold tracking-widest uppercase ${index === 0 ? 'text-red-600' : 'text-brand-black/40 dark:text-white/40'}`}>
                        {day}
                    </div>
                ))}
            </div>

            {/* Grid */}
            <div className="grid grid-cols-7 gap-y-6 place-items-center">
                {days.map((item, idx) => {
                    if (item.type !== 'current') {
                        return (
                            <div key={idx} className="w-8 h-8 flex items-center justify-center text-sm font-bold text-brand-black/10 dark:text-white/10">
                                {item.day}
                            </div>
                        );
                    }

                    const selected = isSelected(item.date);
                    const isSun = isSunday(item.date);
                    const hasStats = item.stats > 0;

                    return (
                        <button
                            key={idx}
                            onClick={() => onDateSelect(item.date)}
                            className="relative flex items-center justify-center group"
                            style={{ width: '40px', height: '40px' }}
                        >
                            {selected ? (
                                // Selected State
                                <div className="absolute top-0 w-[42px] h-[48px] -mt-2 bg-brand-gold border border-brand-gold rounded-lg flex flex-col items-center justify-center shadow-xl shadow-brand-gold/20 z-20">
                                    <span className="text-xl font-black text-white">{item.day}</span>
                                    {/* Small dot if marked and selected */}
                                    {item.mark && item.mark.color && (
                                        <div
                                            className="absolute top-1 right-1 w-1.5 h-1.5 rounded-full bg-white z-30"
                                        />
                                    )}
                                </div>
                            ) : (
                                <>
                                    {/* Mark Color Indicator (Subtle background) */}
                                    {item.mark && item.mark.color && (
                                        <div
                                            className="absolute inset-[2px] rounded-xl opacity-20 z-0"
                                            style={{ backgroundColor: item.mark.color }}
                                        />
                                    )}

                                    {/* Mark Label Dot */}
                                    {item.mark && item.mark.color && (
                                        <div
                                            className="absolute top-1 right-1 w-1.5 h-1.5 rounded-full z-10 animate-pulse shadow-[0_0_5px_rgba(0,0,0,0.2)]"
                                            style={{ backgroundColor: item.mark.color }}
                                        />
                                    )}

                                    <span className={`text-sm font-black transition-colors relative z-10 ${isSun ? 'text-red-600' : 'text-brand-black dark:text-white'} group-hover:text-brand-gold`}>
                                        {item.day}
                                    </span>

                                    {/* Indicators */}
                                    {hasStats && (
                                        <div className="absolute -bottom-1 flex flex-col gap-[1.5px] items-center">
                                            {item.stats > 2 ? (
                                                <>
                                                    <div className={`w-5 h-[2px] ${isSun ? 'bg-red-600' : 'bg-brand-gold'}`}></div>
                                                    <div className={`w-5 h-[2px] ${isSun ? 'bg-red-600' : 'bg-brand-gold'} opacity-70`}></div>
                                                    <div className={`w-5 h-[2px] ${isSun ? 'bg-red-600' : 'bg-brand-gold'} opacity-40`}></div>
                                                </>
                                            ) : item.stats > 1 ? (
                                                <>
                                                    <div className={`w-5 h-[2px] ${isSun ? 'bg-red-600' : 'bg-brand-gold'}`}></div>
                                                    <div className={`w-5 h-[2px] ${isSun ? 'bg-red-600' : 'bg-brand-gold'} opacity-50`}></div>
                                                </>
                                            ) : (
                                                <div className={`w-5 h-[2px] ${isSun ? 'bg-red-600' : 'bg-brand-gold'}`}></div>
                                            )}
                                        </div>
                                    )}
                                </>
                            )}
                        </button>
                    );
                })}
            </div>
        </div >
    );
};

export default CalendarWidget;
