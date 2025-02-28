
import { Button } from '@/components/ui/button';

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
  );
}
