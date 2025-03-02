
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { CalendarRange, LogIn, LogOut } from 'lucide-react';

interface HeaderProps {
  user: {
    displayName: string;
    email: string;
    photoUrl?: string;
  } | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: () => void;
  logout: () => void;
}

export default function Header({ 
  user, 
  isAuthenticated, 
  isLoading, 
  login, 
  logout 
}: HeaderProps) {
  return (
    <header className="border-b sticky top-0 z-10 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between">
        <div className="flex items-center gap-2">
          <CalendarRange className="h-6 w-6 text-primary" />
          <h1 className="text-xl font-medium">Sistema de Reservas Bell'Arte</h1>
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
              <Button variant="ghost" size="icon" onClick={logout} title="Sair">
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
              <span>Entrar com Outlook</span>
            </Button>
          )}
        </div>
      </div>
    </header>
  );
}
