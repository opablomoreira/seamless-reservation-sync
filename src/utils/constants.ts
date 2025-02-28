
export const RESOURCES = {
  ROOMS: ['Sala 1', 'Sala 2', 'Sala 3'],
  VEHICLES: ['Chevrolet Cobalt']
};

export const MAX_VEHICLE_BOOKING_HOURS = 8; // Maximum hours per day for vehicle booking

export const BOOKING_TIME_SLOTS = Array.from({ length: 12 }, (_, i) => i + 8); // 8:00 to 19:00

export const NOTIFICATION_TYPES = {
  CONFIRMATION: 'confirmation',
  REMINDER: 'reminder',
  CANCELLATION: 'cancellation'
};

export const CANCELLATION_DEADLINE_HOURS = 2; // Hours before booking that cancellation is allowed
