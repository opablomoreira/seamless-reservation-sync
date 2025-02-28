
import { useState, useEffect } from 'react';
import { Resource } from '@/utils/types';
import { bookingService } from '@/services/bookingService';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Car, Calendar, Users } from "lucide-react";

interface ResourceListProps {
  onSelectResource: (resource: Resource) => void;
}

export default function ResourceList({ onSelectResource }: ResourceListProps) {
  const [resources, setResources] = useState<Resource[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [bookingCounts, setBookingCounts] = useState<Record<string, number>>({});

  useEffect(() => {
    const fetchResources = async () => {
      try {
        setLoading(true);
        const data = await bookingService.getResources();
        setResources(data);

        // Get booking counts for each resource
        const counts: Record<string, number> = {};
        
        for (const resource of data) {
          const bookings = await bookingService.getBookingsByResource(resource.id);
          counts[resource.id] = bookings.filter(b => b.status !== 'cancelled').length;
        }
        
        setBookingCounts(counts);
      } catch (err) {
        setError('Failed to load resources');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchResources();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="animate-pulse flex flex-col space-y-4 w-full">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="h-32 bg-gray-200 rounded-lg w-full"></div>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4 text-center">
        <p className="text-destructive">{error}</p>
        <Button 
          variant="outline" 
          onClick={() => window.location.reload()}
          className="mt-4"
        >
          Try Again
        </Button>
      </div>
    );
  }

  const groupedResources = {
    rooms: resources.filter(r => r.type === 'room'),
    vehicles: resources.filter(r => r.type === 'vehicle')
  };

  return (
    <div className="space-y-8 animate-fade-in">
      <section>
        <div className="flex items-center space-x-2 mb-6">
          <Users className="h-5 w-5" />
          <h3 className="text-xl font-medium">Meeting Rooms</h3>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {groupedResources.rooms.map((resource) => (
            <Card key={resource.id} className="h-full card-shadow hover:border-primary/40 transition-all duration-300">
              <CardHeader className="pb-2">
                <div className="flex justify-between items-start">
                  <CardTitle className="text-lg">{resource.name}</CardTitle>
                  <Badge variant="outline" className="bg-accent font-normal">
                    Room
                  </Badge>
                </div>
                <CardDescription>
                  Capacity: {resource.name === 'Sala 1' ? '8 people' : resource.name === 'Sala 2' ? '12 people' : '20 people'}
                </CardDescription>
              </CardHeader>
              <CardContent className="py-2">
                <div className="text-sm">
                  <span className="font-medium">Total Bookings: </span>
                  {bookingCounts[resource.id] || 0}
                </div>
              </CardContent>
              <CardFooter>
                <Button 
                  variant="default" 
                  className="w-full"
                  onClick={() => onSelectResource(resource)}
                >
                  Book Now
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      </section>

      <section>
        <div className="flex items-center space-x-2 mb-6">
          <Car className="h-5 w-5" />
          <h3 className="text-xl font-medium">Vehicles</h3>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {groupedResources.vehicles.map((resource) => (
            <Card key={resource.id} className="h-full card-shadow hover:border-primary/40 transition-all duration-300">
              <CardHeader className="pb-2">
                <div className="flex justify-between items-start">
                  <CardTitle className="text-lg">{resource.name}</CardTitle>
                  <Badge variant="outline" className="bg-secondary font-normal">
                    Vehicle
                  </Badge>
                </div>
                <CardDescription>
                  Max booking: {resource.maxBookingHours} hours/day
                </CardDescription>
              </CardHeader>
              <CardContent className="py-2">
                <div className="text-sm">
                  <span className="font-medium">Total Bookings: </span>
                  {bookingCounts[resource.id] || 0}
                </div>
              </CardContent>
              <CardFooter>
                <Button 
                  variant="default" 
                  className="w-full"
                  onClick={() => onSelectResource(resource)}
                >
                  Book Now
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      </section>
    </div>
  );
}
