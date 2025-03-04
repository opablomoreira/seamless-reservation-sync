
import { useState, useEffect } from 'react';
import { Calendar } from '@/components/ui/calendar';
import { Button } from '@/components/ui/button';
import { Booking, Resource, TimeSlot } from '@/utils/types';
import { bookingService } from '@/services/bookingService';
import { Badge } from '@/components/ui/badge';
import { ChevronLeft, ChevronRight, Clock, Check, X } from 'lucide-react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

interface BookingCalendarProps {
  resource: Resource;
  selectedDate: Date;
  onDateChange: (date: Date) => void;
  onSelectTimeSlot: (start: Date, end: Date) => void;
  existingBookings?: Booking[];
}

export default function BookingCalendar({
  resource,
  selectedDate,
  onDateChange,
  onSelectTimeSlot,
  existingBookings = []
}: BookingCalendarProps) {
  const [timeSlots, setTimeSlots] = useState<TimeSlot[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchTimeSlots = async () => {
      try {
        setLoading(true);
        setError(null);
        const slots = await bookingService.getAvailableTimeSlots(resource.id, selectedDate);
        setTimeSlots(slots);
      } catch (err) {
        console.error('Erro ao buscar horários disponíveis:', err);
        setError('Falha ao carregar horários disponíveis');
      } finally {
        setLoading(false);
      }
    };

    fetchTimeSlots();
  }, [resource.id, selectedDate]);

  // Function to navigate to previous/next day
  const navigateDay = (direction: 'previous' | 'next') => {
    const newDate = new Date(selectedDate);
    if (direction === 'previous') {
      newDate.setDate(newDate.getDate() - 1);
    } else {
      newDate.setDate(newDate.getDate() + 1);
    }
    onDateChange(newDate);
  };

  // Disable past dates
  const disabledDays = { before: new Date() };

  return (
    <div className="space-y-8 animate-fade-in">
      <div className="flex flex-col md:flex-row gap-8">
        <div className="bg-card rounded-lg border p-4 card-shadow">
          <Calendar
            mode="single"
            selected={selectedDate}
            onSelect={(date) => date && onDateChange(date)}
            disabled={disabledDays}
            className="rounded-md"
            locale={ptBR}
          />
        </div>

        <div className="flex-1 bg-card rounded-lg border overflow-hidden card-shadow">
          <div className="p-4 border-b bg-muted/30">
            <div className="flex items-center justify-between">
              <Button
                variant="outline"
                size="icon"
                onClick={() => navigateDay('previous')}
                disabled={new Date().toDateString() === selectedDate.toDateString()}
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <h3 className="text-lg font-medium">
                {format(selectedDate, 'EEEE, d \'de\' MMMM \'de\' yyyy', { locale: ptBR })}
              </h3>
              <Button
                variant="outline"
                size="icon"
                onClick={() => navigateDay('next')}
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </div>

          <div className="p-4 max-h-[360px] overflow-y-auto">
            <div className="space-y-2">
              {loading ? (
                <div className="space-y-2">
                  {Array.from({ length: 8 }).map((_, i) => (
                    <div key={i} className="h-12 bg-muted animate-pulse rounded" />
                  ))}
                </div>
              ) : error ? (
                <div className="text-center p-4">
                  <p className="text-destructive">{error}</p>
                </div>
              ) : timeSlots.length === 0 ? (
                <div className="text-center p-4">
                  <p className="text-muted-foreground">Nenhum horário disponível</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 gap-2">
                  {timeSlots.map((slot, index) => (
                    <Button
                      key={index}
                      variant={slot.available ? "outline" : "ghost"}
                      className={`justify-between h-14 ${
                        slot.available
                          ? "hover:border-primary/50 hover:bg-accent/50"
                          : "opacity-60 cursor-not-allowed"
                      }`}
                      disabled={!slot.available}
                      onClick={() => slot.available && onSelectTimeSlot(slot.start, slot.end)}
                    >
                      <div className="flex items-center space-x-2">
                        <Clock className="h-4 w-4" />
                        <span>
                          {format(slot.start, "HH:mm")} - {format(slot.end, "HH:mm")}
                        </span>
                      </div>
                      {slot.available ? (
                        <Badge className="ml-auto bg-green-100 text-green-700 hover:bg-green-200" variant="outline">
                          <Check className="h-3 w-3 mr-1" /> Disponível
                        </Badge>
                      ) : (
                        <Badge className="ml-auto bg-red-100 text-red-700" variant="outline">
                          <X className="h-3 w-3 mr-1" /> Reservado
                        </Badge>
                      )}
                    </Button>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
