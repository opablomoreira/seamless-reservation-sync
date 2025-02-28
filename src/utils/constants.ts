
export const RESOURCES = {
  ROOMS: ['Sala 1', 'Sala 2', 'Sala 3'],
  VEHICLES: ['Chevrolet Cobalt']
};

export const MAX_VEHICLE_BOOKING_HOURS = 8; // Máximo de horas por dia para reserva de veículo

export const BOOKING_TIME_SLOTS = Array.from({ length: 12 }, (_, i) => i + 8); // 8:00 to 19:00

export const NOTIFICATION_TYPES = {
  CONFIRMATION: 'confirmação',
  REMINDER: 'lembrete',
  CANCELLATION: 'cancelamento'
};

export const CANCELLATION_DEADLINE_HOURS = 2; // Horas antes da reserva em que o cancelamento é permitido
