
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { BookOpen, CalendarRange, Clock } from 'lucide-react';
import ResourcesTab from './ResourcesTab';
import MyBookingsTab from './MyBookingsTab';
import { Resource } from '@/utils/types';

interface TabNavigationProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: () => void;
  onSelectResource: (resource: Resource) => void;
}

export default function TabNavigation({
  activeTab,
  setActiveTab,
  isAuthenticated,
  isLoading,
  login,
  onSelectResource
}: TabNavigationProps) {
  return (
    <Tabs defaultValue="resources" value={activeTab} onValueChange={setActiveTab} className="animate-fade-in">
      <div className="flex justify-center mb-6">
        <TabsList className="grid w-full max-w-md grid-cols-2">
          <TabsTrigger value="resources" className="gap-2 py-3">
            <BookOpen className="h-4 w-4" />
            Recursos
          </TabsTrigger>
          <TabsTrigger value="myBookings" className="gap-2 py-3">
            <CalendarRange className="h-4 w-4" />
            Minhas Reservas
          </TabsTrigger>
        </TabsList>
      </div>

      <TabsContent value="resources" className="mt-0 animate-slide-up">
        <ResourcesTab onSelectResource={onSelectResource} />
      </TabsContent>

      <TabsContent value="myBookings" className="mt-0 animate-slide-up">
        <MyBookingsTab 
          isAuthenticated={isAuthenticated} 
          isLoading={isLoading} 
          login={login} 
        />
      </TabsContent>
    </Tabs>
  );
}
