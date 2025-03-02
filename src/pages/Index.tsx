
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
  // Always initialize activeTab to 'resources' to make it the default/home tab
  const [activeTab, setActiveTab] = useState('resources');
  const [showBookingDetails, setShowBookingDetails] = useState(false);
  
  const { user, isAuthenticated, login, logout, isLoading } = useOutlookAuth();

  const handleSelectResource = (resource: Resource) => {
    setSelectedResource(resource);
    // We're not changing the activeTab here anymore
  };

  const handleBookingSuccess = () => {
    setSelectedResource(null);
    // After booking is successful, explicitly set the activeTab back to 'resources'
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
            onGoBack={() => {
              setSelectedResource(null);
              // Ensure we return to the resources tab when going back
              setActiveTab('resources');
            }}
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
