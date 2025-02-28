
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
import { Car, Users, Video, Coffee, Calendar } from "lucide-react";

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
        setError('Falha ao carregar recursos');
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
          Tentar Novamente
        </Button>
      </div>
    );
  }

  const groupedResources = {
    rooms: resources.filter(r => r.type === 'room'),
    vehicles: resources.filter(r => r.type === 'vehicle')
  };

  // Function to get appropriate icon for room
  const getRoomIcon = (roomName: string) => {
    if (roomName === 'Sala 1') return <Video className="h-5 w-5 text-blue-500" />;
    if (roomName === 'Sala 2') return <Coffee className="h-5 w-5 text-amber-500" />;
    return <Users className="h-5 w-5 text-indigo-500" />;
  };

  return (
    <div className="space-y-8 animate-fade-in">
      <section>
        <div className="flex items-center space-x-2 mb-6">
          <Users className="h-5 w-5 text-primary" />
          <h3 className="text-xl font-medium">Salas de Reunião</h3>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {groupedResources.rooms.map((resource) => (
            <Card key={resource.id} className="h-full card-shadow hover:border-primary/40 transition-all duration-300">
              <CardHeader className="pb-2">
                <div className="flex justify-between items-start">
                  <div className="flex items-center gap-2">
                    {getRoomIcon(resource.name)}
                    <CardTitle className="text-lg">{resource.name}</CardTitle>
                  </div>
                  <Badge variant="outline" className="bg-accent font-normal">
                    Sala
                  </Badge>
                </div>
                <CardDescription>
                  Capacidade: {resource.name === 'Sala 1' ? '8 pessoas' : resource.name === 'Sala 2' ? '12 pessoas' : '20 pessoas'}
                </CardDescription>
              </CardHeader>
              <CardContent className="py-2">
                <div className="text-sm">
                  <span className="font-medium">Reservas Totais: </span>
                  {bookingCounts[resource.id] || 0}
                </div>
              </CardContent>
              <CardFooter>
                <Button 
                  variant="default" 
                  className="w-full gap-2"
                  onClick={() => onSelectResource(resource)}
                >
                  <Calendar className="h-4 w-4" />
                  Reservar Agora
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      </section>

      <section>
        <div className="flex items-center space-x-2 mb-6">
          <Car className="h-5 w-5 text-primary" />
          <h3 className="text-xl font-medium">Veículos</h3>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {groupedResources.vehicles.map((resource) => (
            <Card key={resource.id} className="h-full card-shadow hover:border-primary/40 transition-all duration-300">
              <CardHeader className="pb-2">
                <div className="flex justify-between items-start">
                  <div className="flex items-center gap-2">
                    <Car className="h-5 w-5 text-emerald-500" />
                    <CardTitle className="text-lg">{resource.name}</CardTitle>
                  </div>
                  <Badge variant="outline" className="bg-secondary font-normal">
                    Veículo
                  </Badge>
                </div>
                <CardDescription>
                  Máximo de reserva: {resource.maxBookingHours} horas/dia
                </CardDescription>
              </CardHeader>
              <CardContent className="py-2">
                <div className="text-sm">
                  <span className="font-medium">Reservas Totais: </span>
                  {bookingCounts[resource.id] || 0}
                </div>
              </CardContent>
              <CardFooter>
                <Button 
                  variant="default" 
                  className="w-full gap-2"
                  onClick={() => onSelectResource(resource)}
                >
                  <Calendar className="h-4 w-4" />
                  Reservar Agora
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      </section>
    </div>
  );
}
