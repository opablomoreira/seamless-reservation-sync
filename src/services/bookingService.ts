
import { Booking, BookingFormData, Resource, TimeSlot } from "@/utils/types";
import { RESOURCES, MAX_VEHICLE_BOOKING_HOURS, CANCELLATION_DEADLINE_HOURS } from "@/utils/constants";
import { useOutlookCalendar } from "@/hooks/useOutlookCalendar";

// Mock database of bookings (in a real app, this would be stored in a database)
let mockBookings: Booking[] = [];

// Mock resources
const mockResources: Resource[] = [
  ...RESOURCES.ROOMS.map((name, index) => ({
    id: `room-${index + 1}`,
    name,
    type: 'room' as const
  })),
  ...RESOURCES.VEHICLES.map((name, index) => ({
    id: `vehicle-${index + 1}`,
    name,
    type: 'vehicle' as const,
    maxBookingHours: MAX_VEHICLE_BOOKING_HOURS
  }))
];

export const bookingService = {
  // Get all resources
  getResources: (): Promise<Resource[]> => {
    return Promise.resolve(mockResources);
  },
  
  // Get a specific resource by ID
  getResourceById: (id: string): Promise<Resource | undefined> => {
    const resource = mockResources.find(r => r.id === id);
    return Promise.resolve(resource);
  },
  
  // Get all bookings
  getAllBookings: (): Promise<Booking[]> => {
    return Promise.resolve([...mockBookings]);
  },
  
  // Get bookings for a specific resource
  getBookingsByResource: (resourceId: string): Promise<Booking[]> => {
    const bookings = mockBookings.filter(b => b.resourceId === resourceId);
    return Promise.resolve([...bookings]);
  },
  
  // Get bookings for a specific user
  getBookingsByUser: (userId: string): Promise<Booking[]> => {
    const bookings = mockBookings.filter(b => b.userId === userId);
    return Promise.resolve([...bookings]);
  },
  
  // Create a new booking
  createBooking: async (data: BookingFormData, user: { id: string, name: string, email: string }): Promise<Booking> => {
    // Check if resource exists
    const resource = await bookingService.getResourceById(data.resourceId);
    if (!resource) {
      throw new Error("Resource not found");
    }
    
    // Validate booking time
    if (data.start >= data.end) {
      throw new Error("End time must be after start time");
    }
    
    // Calculate booking duration in hours
    const durationHours = (data.end.getTime() - data.start.getTime()) / (1000 * 60 * 60);
    
    // For vehicles, check max booking duration
    if (resource.type === 'vehicle' && resource.maxBookingHours && durationHours > resource.maxBookingHours) {
      throw new Error(`Vehicle bookings cannot exceed ${resource.maxBookingHours} hours`);
    }
    
    // Check for conflicts with existing bookings
    const isConflict = await bookingService.hasBookingConflict(data.resourceId, data.start, data.end);
    if (isConflict) {
      throw new Error("This time slot is already booked");
    }
    
    // Create the booking object
    const newBooking: Booking = {
      id: `booking-${Date.now()}`,
      resourceId: data.resourceId,
      userId: user.id,
      userName: user.name,
      userEmail: user.email,
      start: data.start,
      end: data.end,
      title: data.title,
      description: data.description,
      status: 'confirmed',
      createdAt: new Date(),
    };
    
    // In a real app, you would integrate with Outlook here
    try {
      // This is a mock that would be replaced with actual Outlook integration
      const outlookEventId = `outlook-${Date.now()}`;
      newBooking.outlookEventId = outlookEventId;
      
      // Add to our mock database
      mockBookings.push(newBooking);
      
      // In a real app, you would send a confirmation email here
      console.log(`Sending confirmation email to ${user.email} for booking ${newBooking.id}`);
      
      return newBooking;
    } catch (error) {
      console.error("Failed to create Outlook event:", error);
      throw new Error("Failed to sync with Outlook calendar");
    }
  },
  
  // Update an existing booking
  updateBooking: async (id: string, data: Partial<BookingFormData>, userId: string): Promise<Booking> => {
    // Find the booking
    const bookingIndex = mockBookings.findIndex(b => b.id === id);
    if (bookingIndex === -1) {
      throw new Error("Booking not found");
    }
    
    const booking = mockBookings[bookingIndex];
    
    // Check if user owns the booking
    if (booking.userId !== userId) {
      throw new Error("You don't have permission to update this booking");
    }
    
    // Check if it's too late to update
    const now = new Date();
    const hoursUntilBooking = (booking.start.getTime() - now.getTime()) / (1000 * 60 * 60);
    
    if (hoursUntilBooking < CANCELLATION_DEADLINE_HOURS) {
      throw new Error(`Bookings can only be updated at least ${CANCELLATION_DEADLINE_HOURS} hours in advance`);
    }
    
    // Check for time conflicts if updating times
    if ((data.start || data.end) && (data.start || booking.start) < (data.end || booking.end)) {
      const hasConflict = await bookingService.hasBookingConflict(
        booking.resourceId,
        data.start || booking.start,
        data.end || booking.end,
        id
      );
      
      if (hasConflict) {
        throw new Error("The updated time slot is already booked");
      }
    }
    
    // Update the booking
    const updatedBooking = {
      ...booking,
      ...(data.title && { title: data.title }),
      ...(data.description && { description: data.description }),
      ...(data.start && { start: data.start }),
      ...(data.end && { end: data.end })
    };
    
    // Update in our mock database
    mockBookings[bookingIndex] = updatedBooking;
    
    // In a real app, you would update the Outlook event here
    console.log(`Updating Outlook event ${booking.outlookEventId}`);
    
    // Return the updated booking
    return updatedBooking;
  },
  
  // Cancel a booking
  cancelBooking: async (id: string, userId: string): Promise<boolean> => {
    // Find the booking
    const bookingIndex = mockBookings.findIndex(b => b.id === id);
    if (bookingIndex === -1) {
      throw new Error("Booking not found");
    }
    
    const booking = mockBookings[bookingIndex];
    
    // Check if user owns the booking
    if (booking.userId !== userId) {
      throw new Error("You don't have permission to cancel this booking");
    }
    
    // Check if it's too late to cancel
    const now = new Date();
    const hoursUntilBooking = (booking.start.getTime() - now.getTime()) / (1000 * 60 * 60);
    
    if (hoursUntilBooking < CANCELLATION_DEADLINE_HOURS) {
      throw new Error(`Bookings can only be cancelled at least ${CANCELLATION_DEADLINE_HOURS} hours in advance`);
    }
    
    // Update the booking status
    mockBookings[bookingIndex] = {
      ...booking,
      status: 'cancelled'
    };
    
    // In a real app, you would delete the Outlook event here
    console.log(`Deleting Outlook event ${booking.outlookEventId}`);
    
    // In a real app, you would send a cancellation notification email here
    console.log(`Sending cancellation email to ${booking.userEmail} for booking ${booking.id}`);
    
    return true;
  },
  
  // Check if a booking conflicts with existing bookings
  hasBookingConflict: async (resourceId: string, start: Date, end: Date, excludeBookingId?: string): Promise<boolean> => {
    const bookings = await bookingService.getBookingsByResource(resourceId);
    
    // Filter out cancelled bookings and the booking we're updating (if any)
    const activeBookings = bookings.filter(b => 
      b.status !== 'cancelled' && 
      (!excludeBookingId || b.id !== excludeBookingId)
    );
    
    // Check for time conflicts
    return activeBookings.some(booking => 
      // New booking starts during existing booking
      (start >= booking.start && start < booking.end) ||
      // New booking ends during existing booking
      (end > booking.start && end <= booking.end) ||
      // New booking completely contains existing booking
      (start <= booking.start && end >= booking.end)
    );
  },
  
  // Get available time slots for a resource on a specific day
  getAvailableTimeSlots: async (resourceId: string, date: Date): Promise<TimeSlot[]> => {
    // Get all bookings for this resource
    const bookings = await bookingService.getBookingsByResource(resourceId);
    
    // Filter to only active bookings on the selected date
    const startOfDay = new Date(date);
    startOfDay.setHours(0, 0, 0, 0);
    
    const endOfDay = new Date(date);
    endOfDay.setHours(23, 59, 59, 999);
    
    const bookingsOnDate = bookings.filter(b => 
      b.status !== 'cancelled' &&
      b.start >= startOfDay &&
      b.start < endOfDay
    );
    
    // Generate all possible time slots for the business hours (8:00 to 18:00)
    const timeSlots: TimeSlot[] = [];
    
    // Start from 8:00
    const slotStart = new Date(date);
    slotStart.setHours(8, 0, 0, 0);
    
    // End at 18:00
    const dayEnd = new Date(date);
    dayEnd.setHours(18, 0, 0, 0);
    
    // Create 1-hour time slots
    while (slotStart < dayEnd) {
      const slotEnd = new Date(slotStart);
      slotEnd.setHours(slotStart.getHours() + 1);
      
      // Check if this slot conflicts with any booking
      const isAvailable = !bookingsOnDate.some(booking => 
        (slotStart >= booking.start && slotStart < booking.end) ||
        (slotEnd > booking.start && slotEnd <= booking.end) ||
        (slotStart <= booking.start && slotEnd >= booking.end)
      );
      
      timeSlots.push({
        start: new Date(slotStart),
        end: new Date(slotEnd),
        available: isAvailable
      });
      
      // Move to next hour
      slotStart.setHours(slotStart.getHours() + 1);
    }
    
    return timeSlots;
  },
  
  // Get booking statistics
  getBookingStats: async (): Promise<{ 
    totalBookings: number, 
    bookingsByResource: { resourceId: string, resourceName: string, count: number }[],
    bookingsByUser: { userId: string, userName: string, count: number }[]
  }> => {
    const bookings = await bookingService.getAllBookings();
    const resources = await bookingService.getResources();
    
    // Count total bookings
    const totalBookings = bookings.filter(b => b.status !== 'cancelled').length;
    
    // Count bookings per resource
    const bookingsByResource = resources.map(resource => {
      const count = bookings.filter(b => 
        b.resourceId === resource.id && 
        b.status !== 'cancelled'
      ).length;
      
      return {
        resourceId: resource.id,
        resourceName: resource.name,
        count
      };
    });
    
    // Count bookings per user
    const userMap = new Map<string, { userId: string, userName: string, count: number }>();
    
    bookings
      .filter(b => b.status !== 'cancelled')
      .forEach(booking => {
        const userId = booking.userId;
        
        if (!userMap.has(userId)) {
          userMap.set(userId, {
            userId,
            userName: booking.userName,
            count: 0
          });
        }
        
        const userData = userMap.get(userId)!;
        userData.count += 1;
      });
    
    const bookingsByUser = Array.from(userMap.values());
    
    return {
      totalBookings,
      bookingsByResource,
      bookingsByUser
    };
  }
};
