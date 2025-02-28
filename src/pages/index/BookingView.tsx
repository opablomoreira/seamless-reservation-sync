
import { useState } from 'react';
import { Resource } from '@/utils/types';
import BookingCalendar from '@/components/BookingCalendar';
import BookingForm from '@/components/BookingForm';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';

interface BookingViewProps {
  selectedResource: Resource;
  onGoBack: () => void;
  onBookingSuccess: () => void;
}

export default function BookingView({ 
  selectedResource, 
  onGoBack, 
  onBookingSuccess 
}: BookingViewProps) {
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [selectedTimeSlot, setSelectedTimeSlot] = useState<{ start: Date; end: Date } | null>(null);

  const handleSelectTimeSlot = (start: Date, end: Date) => {
    setSelectedTimeSlot({ start, end });
  };

  const handleCancelBooking = () => {
    setSelectedTimeSlot(null);
  };

  return (
    <>
      {selectedTimeSlot ? (
        <div className="mb-8">
          <Button
            variant="outline"
            className="gap-2"
            onClick={() => setSelectedTimeSlot(null)}
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Calendar
          </Button>
          <div className="mt-8">
            <BookingForm
              resource={selectedResource}
              selectedStart={selectedTimeSlot.start}
              selectedEnd={selectedTimeSlot.end}
              onSuccess={onBookingSuccess}
              onCancel={handleCancelBooking}
            />
          </div>
        </div>
      ) : (
        <div className="space-y-8">
          <div className="mb-6">
            <Button
              variant="outline"
              className="gap-2"
              onClick={onGoBack}
            >
              <ArrowLeft className="h-4 w-4" />
              Back to Resources
            </Button>
            <h2 className="text-2xl font-medium mt-4">{selectedResource.name}</h2>
            <p className="text-muted-foreground capitalize">
              {selectedResource.type} booking
            </p>
          </div>

          <div className="rounded-xl border bg-card text-card-foreground shadow glass p-6">
            <BookingCalendar
              resource={selectedResource}
              selectedDate={selectedDate}
              onDateChange={setSelectedDate}
              onSelectTimeSlot={handleSelectTimeSlot}
            />
          </div>
        </div>
      )}
    </>
  );
}
