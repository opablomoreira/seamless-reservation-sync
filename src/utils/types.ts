
export type ResourceType = 'room' | 'vehicle';

export interface Resource {
  id: string;
  name: string;
  type: ResourceType;
  description?: string;
  maxBookingHours?: number;
}

export interface TimeSlot {
  start: Date;
  end: Date;
  available: boolean;
}

export interface CalendarEvent {
  id: string;
  subject: string;
  start: Date;
  end: Date;
  location?: string;
  attendees?: string[];
  organizer: string;
  createdDateTime: Date;
  lastModifiedDateTime?: Date;
}

export interface Booking {
  id: string;
  resourceId: string;
  userId: string;
  userName: string;
  userEmail: string;
  start: Date;
  end: Date;
  title: string;
  description?: string;
  status: 'pending' | 'confirmed' | 'cancelled';
  createdAt: Date;
  outlookEventId?: string;
}

export interface BookingFormData {
  resourceId: string;
  start: Date;
  end: Date;
  title: string;
  description?: string;
}

export interface OutlookAuthConfig {
  clientId: string;
  authority: string;
  redirectUri: string;
  scopes: string[];
}

export interface OutlookUser {
  id: string;
  displayName: string;
  email: string;
  photoUrl?: string;
}

export interface OutlookTokenResponse {
  accessToken: string;
  expiresOn: Date;
  isAuthenticated: boolean;
}

export interface NotificationData {
  type: string;
  booking: Booking;
  recipientEmail: string;
  recipientName: string;
}
