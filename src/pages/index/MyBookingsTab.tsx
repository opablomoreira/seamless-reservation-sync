
import { Button } from '@/components/ui/button';
import { CalendarRange, LogIn } from 'lucide-react';

interface MyBookingsTabProps {
  isAuthenticated: boolean;
  isLoading: boolean;
  login: () => void;
}

export default function MyBookingsTab({ isAuthenticated, isLoading, login }: MyBookingsTabProps) {
  return (
    <div className="rounded-xl border bg-card text-card-foreground shadow glass p-6">
      {isAuthenticated ? (
        <div className="text-center py-10">
          <div className="flex justify-center mb-4">
            <CalendarRange className="h-12 w-12 text-primary" />
          </div>
          <h3 className="text-2xl font-semibold mb-4">Minhas Reservas</h3>
          <p className="text-muted-foreground max-w-md mx-auto">
            Este recurso mostraria suas reservas e permitiria gerenciá-las.
            Esta seção seria implementada em uma aplicação real.
          </p>
        </div>
      ) : (
        <div className="text-center py-10">
          <div className="flex justify-center mb-4">
            <LogIn className="h-12 w-12 text-primary" />
          </div>
          <h3 className="text-2xl font-semibold mb-4">Login Necessário</h3>
          <p className="text-muted-foreground mb-6 max-w-md mx-auto">
            Você precisa fazer login com sua conta Outlook para ver suas reservas.
          </p>
          <Button onClick={login} disabled={isLoading} className="px-6">
            <LogIn className="mr-2 h-4 w-4" />
            Entrar com Outlook
          </Button>
        </div>
      )}
    </div>
  );
}
