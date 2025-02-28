
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ListTodo, CalendarRange } from 'lucide-react';
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
        <ResourcesTab onSelectResource={onSelectResource} />
      </TabsContent>

      <TabsContent value="myBookings" className="mt-0">
        <MyBookingsTab 
          isAuthenticated={isAuthenticated} 
          isLoading={isLoading} 
          login={login} 
        />
      </TabsContent>
    </Tabs>
  );
}
