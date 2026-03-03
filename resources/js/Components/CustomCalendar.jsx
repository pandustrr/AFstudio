import React, { useState, useMemo, useEffect } from 'react';
import { ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/24/outline';

const CustomCalendar = ({ selectedDates = [], onDateSelect, onMonthChange }) => {
    // Initial view date based on first selectedDate or today
    const [viewDate, setViewDate] = useState(selectedDates.length > 0 ? new Date(selectedDates[0]) : new Date());

    const currentYear = viewDate.getFullYear();
    const currentMonth = viewDate.getMonth();

    const monthNames = ["JAN", "FEB", "MAR", "APR", "MEI", "JUN", "JUL", "AGU", "SEP", "OKT", "NOV", "DES"];
    const dayNames = ["MIN", "SEN", "SEL", "RAB", "KAM", "JUM", "SAB"];

    const getDaysInMonth = (year, month) => new Date(year, month + 1, 0).getDate();
    const getFirstDayOfMonth = (year, month) => new Date(year, month, 1).getDay();

    useEffect(() => {
        if (onMonthChange) {
            onMonthChange(currentMonth, currentYear);
        }
    }, [currentMonth, currentYear, onMonthChange]);

    const days = useMemo(() => {
        const daysInMonth = getDaysInMonth(currentYear, currentMonth);
        const firstDay = getFirstDayOfMonth(currentYear, currentMonth);
        const prevMonthDays = getDaysInMonth(currentYear, currentMonth - 1);

        const daysArray = [];

        // Previous month filler
        for (let i = 0; i < firstDay; i++) {
            daysArray.push({
                day: prevMonthDays - firstDay + 1 + i,
                type: 'prev',
                date: new Date(currentYear, currentMonth - 1, prevMonthDays - firstDay + 1 + i)
            });
        }

        // Current month days
        for (let i = 1; i <= daysInMonth; i++) {
            daysArray.push({
                day: i,
                type: 'current',
                date: new Date(currentYear, currentMonth, i)
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
    }, [currentYear, currentMonth]);

    const handlePrevMonth = () => setViewDate(new Date(currentYear, currentMonth - 1, 1));
    const handleNextMonth = () => setViewDate(new Date(currentYear, currentMonth + 1, 1));

    const formatDate = (date) => {
        const y = date.getFullYear();
        const m = String(date.getMonth() + 1).padStart(2, '0');
        const d = String(date.getDate()).padStart(2, '0');
        return `${y}-${m}-${d}`;
    };

    const isSelected = (date) => {
        if (!selectedDates || !date) return false;
        return selectedDates.includes(formatDate(date));
    };

    const toggleDate = (date) => {
        const dateStr = formatDate(date);
        let newDates;
        if (selectedDates.includes(dateStr)) {
            newDates = selectedDates.filter(d => d !== dateStr);
        } else {
            newDates = [...selectedDates, dateStr];
        }
        onDateSelect(newDates);
    };

    return (
        <div className="bg-[#2D2D2D] text-white p-6 rounded-[40px] w-full max-w-[320px] mx-auto font-sans shadow-2xl overflow-hidden">
            {/* Header */}
            <div className="flex justify-between items-center mb-8 px-2">
                <button
                    type="button"
                    onClick={handlePrevMonth}
                    className="p-2 text-white/40 hover:text-white transition-colors"
                >
                    <ChevronLeftIcon className="w-6 h-6 stroke-[3]" />
                </button>

                <div className="flex flex-col items-center">
                    <h2 className="text-3xl font-black tracking-tighter uppercase leading-none">
                        {monthNames[currentMonth]}
                    </h2>
                    <span className="text-[10px] tracking-[0.4em] font-bold text-white/30 mt-1">{currentYear}</span>
                </div>

                <button
                    type="button"
                    onClick={handleNextMonth}
                    className="p-2 text-white/40 hover:text-white transition-colors"
                >
                    <ChevronRightIcon className="w-6 h-6 stroke-[3]" />
                </button>
            </div>

            {/* Days Header */}
            <div className="grid grid-cols-7 mb-6 text-center">
                {dayNames.map((day, index) => (
                    <div key={day} className={`text-[9px] font-black tracking-widest uppercase ${index === 0 ? 'text-red-500' : 'text-white/30'}`}>
                        {day}
                    </div>
                ))}
            </div>

            {/* Grid */}
            <div className="grid grid-cols-7 gap-y-2 place-items-center">
                {days.map((item, idx) => {
                    const selected = isSelected(item.date);
                    const isCurrentMonth = item.type === 'current';
                    const isSun = item.date.getDay() === 0;

                    return (
                        <button
                            key={idx}
                            type="button"
                            onClick={() => toggleDate(item.date)}
                            className={`
                                relative flex items-center justify-center w-8 h-8 sm:w-10 sm:h-10 text-sm font-black transition-all rounded-xl
                                ${selected
                                    ? 'bg-brand-gold text-white shadow-[0_4px_20px_rgba(196,160,103,0.4)] scale-110 z-10'
                                    : isCurrentMonth
                                        ? isSun ? 'text-red-500' : 'text-white'
                                        : 'text-white/10'
                                }
                                hover:scale-110
                            `}
                        >
                            {item.day}
                        </button>
                    );
                })}
            </div>
        </div>
    );
};

export default CustomCalendar;
