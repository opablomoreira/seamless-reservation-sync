
import { useState } from 'react';
import { Resource, Booking } from '@/utils/types';
import BookingDetails from '@/components/BookingDetails';
import { useOutlookAuth } from '@/hooks/useOutlookAuth';
import Header from './index/Header';
import TabNavigation from './index/TabNavigation';
import BookingView from './index/BookingView';

export default function Index() {
  const [selectedResource, setSelectedResource] = useState<Resource | null>(null);
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);
  const [activeTab, setActiveTab] = useState('resources');
  const [showBookingDetails, setShowBookingDetails] = useState(false);
  
  const { user, isAuthenticated, login, logout, isLoading } = useOutlookAuth();

  const handleSelectResource = (resource: Resource) => {
    setSelectedResource(resource);
    setActiveTab('calendar');
  };

  const handleBookingSuccess = () => {
    setSelectedResource(null);
    setActiveTab('resources');
  };

  const handleBookingCancelled = () => {
    setShowBookingDetails(false);
    // Could refresh bookings here if we were displaying a list
  };

  return (
    <div className="min-h-screen bg-background">
      <Header 
        user={user}
        isAuthenticated={isAuthenticated}
        isLoading={isLoading}
        login={login}
        logout={logout}
      />

      <main className="container py-6 md:py-10">
        {selectedResource ? (
          <BookingView
            selectedResource={selectedResource}
            onGoBack={() => setSelectedResource(null)}
            onBookingSuccess={handleBookingSuccess}
          />
        ) : (
          <TabNavigation
            activeTab={activeTab}
            setActiveTab={setActiveTab}
            isAuthenticated={isAuthenticated}
            isLoading={isLoading}
            login={login}
            onSelectResource={handleSelectResource}
          />
        )}
      </main>

      {selectedBooking && (
        <BookingDetails
          booking={selectedBooking}
          resource={selectedResource!}
          isOpen={showBookingDetails}
          onClose={() => setShowBookingDetails(false)}
          onCancelled={handleBookingCancelled}
        />
      )}
    </div>
  );
}
