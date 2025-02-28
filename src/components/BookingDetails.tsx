
import { useState } from 'react';
import { Booking, Resource } from '@/utils/types';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { bookingService } from '@/services/bookingService';
import { useOutlookAuth } from '@/hooks/useOutlookAuth';

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Calendar, Clock, User, MapPin, FileText, AlertTriangle } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { toast } from 'sonner';
import { CANCELLATION_DEADLINE_HOURS } from '@/utils/constants';

interface BookingDetailsProps {
  booking: Booking;
  resource: Resource;
  isOpen: boolean;
  onClose: () => void;
  onCancelled: () => void;
}

export default function BookingDetails({
  booking,
  resource,
  isOpen,
  onClose,
  onCancelled
}: BookingDetailsProps) {
  const [isCancelling, setIsCancelling] = useState(false);
  const { user } = useOutlookAuth();

  const handleCancelBooking = async () => {
    if (!user) {
      toast.error('Você precisa estar conectado para cancelar uma reserva');
      return;
    }

    try {
      setIsCancelling(true);
      await bookingService.cancelBooking(booking.id, user.id);
      toast.success('Reserva cancelada com sucesso');
      onCancelled();
    } catch (error) {
      console.error('Erro ao cancelar reserva:', error);
      toast.error(error instanceof Error ? error.message : 'Falha ao cancelar reserva');
    } finally {
      setIsCancelling(false);
    }
  };

  // Check if booking is cancellable
  const now = new Date();
  const hoursUntilBooking = (booking.start.getTime() - now.getTime()) / (1000 * 60 * 60);
  const canCancel = hoursUntilBooking >= CANCELLATION_DEADLINE_HOURS && booking.status !== 'cancelled';

  // Check if user owns this booking
  const isOwner = user?.id === booking.userId;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md animate-fade-in">
        <DialogHeader>
          <DialogTitle>{booking.title}</DialogTitle>
          <DialogDescription>
            Detalhes da reserva para {resource.name}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <div className="flex items-center gap-2">
            <Badge
              variant={booking.status === 'confirmed' ? 'default' : 'destructive'}
              className="capitalize"
            >
              {booking.status === 'confirmed' ? 'Confirmado' : 'Cancelado'}
            </Badge>
          </div>

          <div className="flex items-start gap-3">
            <Calendar className="h-5 w-5 mt-0.5 text-muted-foreground" />
            <div>
              <p className="font-medium">Data</p>
              <p className="text-sm text-muted-foreground">
                {format(booking.start, 'EEEE, d \'de\' MMMM \'de\' yyyy', { locale: ptBR })}
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <Clock className="h-5 w-5 mt-0.5 text-muted-foreground" />
            <div>
              <p className="font-medium">Horário</p>
              <p className="text-sm text-muted-foreground">
                {format(booking.start, 'HH:mm')} - {format(booking.end, 'HH:mm')}
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <MapPin className="h-5 w-5 mt-0.5 text-muted-foreground" />
            <div>
              <p className="font-medium">Recurso</p>
              <p className="text-sm text-muted-foreground">
                {resource.name} ({resource.type === 'room' ? 'Sala' : 'Veículo'})
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <User className="h-5 w-5 mt-0.5 text-muted-foreground" />
            <div>
              <p className="font-medium">Reservado Por</p>
              <p className="text-sm text-muted-foreground">{booking.userName}</p>
              <p className="text-xs text-muted-foreground">{booking.userEmail}</p>
            </div>
          </div>

          {booking.description && (
            <div className="flex items-start gap-3">
              <FileText className="h-5 w-5 mt-0.5 text-muted-foreground" />
              <div>
                <p className="font-medium">Descrição</p>
                <p className="text-sm text-muted-foreground">{booking.description}</p>
              </div>
            </div>
          )}

          {!canCancel && booking.status !== 'cancelled' && (
            <div className="flex items-start gap-3 p-3 rounded-md bg-accent">
              <AlertTriangle className="h-5 w-5 mt-0.5 text-amber-500" />
              <div>
                <p className="font-medium">Política de Cancelamento</p>
                <p className="text-sm text-muted-foreground">
                  Reservas só podem ser canceladas com pelo menos {CANCELLATION_DEADLINE_HOURS} horas de antecedência.
                </p>
              </div>
            </div>
          )}
        </div>

        <Separator />

        <DialogFooter className="flex justify-between sm:justify-between">
          <Button variant="outline" onClick={onClose}>
            Fechar
          </Button>
          {isOwner && canCancel && (
            <Button
              variant="destructive"
              onClick={handleCancelBooking}
              disabled={isCancelling}
            >
              {isCancelling ? 'Cancelando...' : 'Cancelar Reserva'}
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
