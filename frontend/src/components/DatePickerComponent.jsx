import React, { useState } from 'react';
import { Calendar } from './ui/calendar';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from './ui/dialog';
import { Button } from './ui/button';

const DatePickerComponent = ({ open, onClose, onDateSelect }) => {
  const [date, setDate] = useState(new Date());

  const handleSelect = () => {
    if (date) {
      onDateSelect(date);
    }
  };

  // NASA APOD started on June 16, 1995
  const minDate = new Date('1995-06-16');
  const maxDate = new Date();

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="bg-gradient-to-br from-slate-900 to-slate-800 border border-white/20 text-white" data-testid="date-picker-modal">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold" style={{ fontFamily: 'Space Grotesk, sans-serif' }}>
            Select a Date
          </DialogTitle>
          <DialogDescription className="text-gray-400">
            Choose any date from June 16, 1995 to today
          </DialogDescription>
        </DialogHeader>
        <div className="flex flex-col items-center gap-4 py-4">
          <Calendar
            mode="single"
            selected={date}
            onSelect={setDate}
            disabled={(date) => date < minDate || date > maxDate}
            className="rounded-md border border-white/20 bg-white/5"
            data-testid="calendar"
          />
          <Button
            onClick={handleSelect}
            className="w-full bg-blue-500 hover:bg-blue-600 text-white font-medium"
            disabled={!date}
            data-testid="select-date-button"
          >
            View APOD for {date?.toLocaleDateString()}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default DatePickerComponent;
