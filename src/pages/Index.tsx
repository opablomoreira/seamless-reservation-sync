
import { useState } from 'react';
import { Resource, Booking } from '@/utils/types';
import ResourceList from '@/components/ResourceList';
import BookingCalendar from '@/components/BookingCalendar';
import BookingForm from '@/components/BookingForm';
import BookingDetails from '@/components/BookingDetails';
import { useOutlookAuth } from '@/hooks/useOutlookAuth';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ArrowLeft, CalendarRange, ListTodo, LogIn, LogOut } from 'lucide-react';

export default function Index() {
  const [selectedResource, setSelectedResource] = useState<Resource | null>(null);
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [selectedTimeSlot, setSelectedTimeSlot] = useState<{ start: Date; end: Date } | null>(null);
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);
  const [activeTab, setActiveTab] = useState('resources');
  const [showBookingDetails, setShowBookingDetails] = useState(false);
  
  const { user, isAuthenticated, login, logout, isLoading } = useOutlookAuth();

  const handleSelectResource = (resource: Resource) => {
    setSelectedResource(resource);
    setActiveTab('calendar');
  };

  const handleSelectTimeSlot = (start: Date, end: Date) => {
    setSelectedTimeSlot({ start, end });
  };

  const handleBookingSuccess = () => {
    setSelectedTimeSlot(null);
    setSelectedResource(null);
    setActiveTab('resources');
  };

  const handleCancelBooking = () => {
    setSelectedTimeSlot(null);
  };

  const handleBookingCancelled = () => {
    setShowBookingDetails(false);
    // Could refresh bookings here if we were displaying a list
  };

  const goBack = () => {
    if (selectedTimeSlot) {
      setSelectedTimeSlot(null);
    } else if (selectedResource) {
      setSelectedResource(null);
      setActiveTab('resources');
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b sticky top-0 z-10 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-16 items-center justify-between">
          <div className="flex items-center gap-2">
            <CalendarRange className="h-6 w-6" />
            <h1 className="text-xl font-medium">Reservation System</h1>
          </div>
          <div className="flex items-center gap-4">
            {isAuthenticated && user ? (
              <div className="flex items-center gap-2">
                <Avatar className="h-8 w-8">
                  <AvatarImage src={user.photoUrl} alt={user.displayName} />
                  <AvatarFallback>{user.displayName?.charAt(0)}</AvatarFallback>
                </Avatar>
                <div className="hidden md:block">
                  <p className="text-sm font-medium">{user.displayName}</p>
                  <p className="text-xs text-muted-foreground">{user.email}</p>
                </div>
                <Button variant="ghost" size="icon" onClick={logout}>
                  <LogOut className="h-4 w-4" />
                </Button>
              </div>
            ) : (
              <Button
                variant="outline"
                size="sm"
                className="gap-2"
                onClick={login}
                disabled={isLoading}
              >
                <LogIn className="h-4 w-4" />
                <span>Sign In with Outlook</span>
              </Button>
            )}
          </div>
        </div>
      </header>

      <main className="container py-6 md:py-10">
        {selectedTimeSlot && selectedResource ? (
          <div className="mb-8">
            <Button
              variant="outline"
              className="gap-2"
              onClick={goBack}
            >
              <ArrowLeft className="h-4 w-4" />
              Back to Calendar
            </Button>
            <div className="mt-8">
              <BookingForm
                resource={selectedResource}
                selectedStart={selectedTimeSlot.start}
                selectedEnd={selectedTimeSlot.end}
                onSuccess={handleBookingSuccess}
                onCancel={handleCancelBooking}
              />
            </div>
          </div>
        ) : (
          <div className="space-y-8">
            {selectedResource && (
              <div className="mb-6">
                <Button
                  variant="outline"
                  className="gap-2"
                  onClick={goBack}
                >
                  <ArrowLeft className="h-4 w-4" />
                  Back to Resources
                </Button>
                <h2 className="text-2xl font-medium mt-4">{selectedResource.name}</h2>
                <p className="text-muted-foreground capitalize">
                  {selectedResource.type} booking
                </p>
              </div>
            )}

            {!selectedResource ? (
              <Tabs defaultValue="resources" value={activeTab} onValueChange={setActiveTab}>
                <div className="flex justify-center mb-6">
                  <TabsList className="grid w-full max-w-md grid-cols-2">
                    <TabsTrigger value="resources" className="gap-2">
                      <ListTodo className="h-4 w-4" />
                      Resources
                    </TabsTrigger>
                    <TabsTrigger value="myBookings" className="gap-2">
                      <CalendarRange className="h-4 w-4" />
                      My Bookings
                    </TabsTrigger>
                  </TabsList>
                </div>

                <TabsContent value="resources" className="mt-0">
                  <div className="rounded-xl border bg-card text-card-foreground shadow glass p-6">
                    <ResourceList onSelectResource={handleSelectResource} />
                  </div>
                </TabsContent>

                <TabsContent value="myBookings" className="mt-0">
                  <div className="rounded-xl border bg-card text-card-foreground shadow glass p-6">
                    {isAuthenticated ? (
                      <div className="text-center py-10">
                        <h3 className="text-xl font-medium mb-6">My Bookings</h3>
                        <p className="text-muted-foreground max-w-md mx-auto">
                          This feature would show your bookings and allow you to manage them.
                          This section would be implemented in a real application.
                        </p>
                      </div>
                    ) : (
                      <div className="text-center py-10">
                        <h3 className="text-xl font-medium mb-2">Sign In Required</h3>
                        <p className="text-muted-foreground mb-6 max-w-md mx-auto">
                          You need to sign in with your Outlook account to view your bookings.
                        </p>
                        <Button onClick={login} disabled={isLoading}>
                          Sign in with Outlook
                        </Button>
                      </div>
                    )}
                  </div>
                </TabsContent>
              </Tabs>
            ) : (
              <div className="rounded-xl border bg-card text-card-foreground shadow glass p-6">
                <BookingCalendar
                  resource={selectedResource}
                  selectedDate={selectedDate}
                  onDateChange={setSelectedDate}
                  onSelectTimeSlot={handleSelectTimeSlot}
                />
              </div>
            )}
          </div>
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
