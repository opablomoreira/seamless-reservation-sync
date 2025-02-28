
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
        <div className="mb-8 animate-in fade-in duration-300">
          <Button
            variant="outline"
            className="gap-2 hover:bg-primary/10"
            onClick={() => setSelectedTimeSlot(null)}
          >
            <ArrowLeft className="h-4 w-4" />
            Voltar ao Calendário
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
        <div className="space-y-8 animate-in fade-in duration-300">
          <div className="mb-6">
            <Button
              variant="outline"
              className="gap-2 hover:bg-primary/10"
              onClick={onGoBack}
            >
              <ArrowLeft className="h-4 w-4" />
              Voltar aos Recursos
            </Button>
            <div className="mt-6">
              <h2 className="text-2xl font-semibold">{selectedResource.name}</h2>
              <p className="text-muted-foreground capitalize mt-1">
                {selectedResource.type === 'room' ? 'Sala' : 'Veículo'} para reserva
              </p>
            </div>
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
