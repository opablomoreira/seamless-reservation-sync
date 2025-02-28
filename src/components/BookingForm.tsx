
import { useState } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import { format } from 'date-fns';
import { Resource } from '@/utils/types';
import { bookingService } from '@/services/bookingService';
import { useOutlookAuth } from '@/hooks/useOutlookAuth';
import { Calendar, Clock } from 'lucide-react';

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { toast } from 'sonner';

interface BookingFormProps {
  resource: Resource;
  selectedStart: Date;
  selectedEnd: Date;
  onSuccess: () => void;
  onCancel: () => void;
}

const formSchema = z.object({
  title: z.string().min(3, { message: 'Title must be at least 3 characters' }),
  description: z.string().optional(),
});

type FormData = z.infer<typeof formSchema>;

export default function BookingForm({
  resource,
  selectedStart,
  selectedEnd,
  onSuccess,
  onCancel
}: BookingFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { user, isAuthenticated, login } = useOutlookAuth();

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: '',
      description: '',
    },
  });

  const onSubmit = async (data: FormData) => {
    if (!isAuthenticated) {
      toast.error('Please sign in with Outlook first');
      return;
    }

    try {
      setIsSubmitting(true);

      // Create the booking
      await bookingService.createBooking(
        {
          resourceId: resource.id,
          start: selectedStart,
          end: selectedEnd,
          title: data.title,
          description: data.description,
        },
        {
          id: user?.id || 'guest',
          name: user?.displayName || 'Guest User',
          email: user?.email || 'guest@example.com',
        }
      );

      toast.success('Booking created successfully');
      onSuccess();
    } catch (error) {
      console.error('Error creating booking:', error);
      toast.error(error instanceof Error ? error.message : 'Failed to create booking');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card className="w-full max-w-md mx-auto animate-slide-up card-shadow">
      <CardHeader>
        <CardTitle>Book {resource.name}</CardTitle>
        <CardDescription>Complete the form to reserve this {resource.type}</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4 mb-4">
          <div className="flex items-center p-3 rounded-md bg-accent/50">
            <Calendar className="h-5 w-5 mr-2 text-primary" />
            <div className="text-sm">
              <span className="font-medium">Date: </span>
              {format(selectedStart, 'EEEE, MMMM d, yyyy')}
            </div>
          </div>
          <div className="flex items-center p-3 rounded-md bg-accent/50">
            <Clock className="h-5 w-5 mr-2 text-primary" />
            <div className="text-sm">
              <span className="font-medium">Time: </span>
              {format(selectedStart, 'h:mm a')} - {format(selectedEnd, 'h:mm a')}
            </div>
          </div>
        </div>

        {!isAuthenticated ? (
          <div className="text-center py-6">
            <p className="text-muted-foreground mb-4">
              You need to sign in with your Outlook account to continue
            </p>
            <Button onClick={login} className="w-full">
              Sign in with Outlook
            </Button>
          </div>
        ) : (
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Title</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter booking title" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Description (optional)</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Add any additional details"
                        className="resize-none"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </form>
          </Form>
        )}
      </CardContent>
      <CardFooter className="flex justify-between">
        <Button variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        {isAuthenticated && (
          <Button
            type="submit"
            disabled={isSubmitting}
            onClick={form.handleSubmit(onSubmit)}
          >
            {isSubmitting ? 'Booking...' : 'Confirm Booking'}
          </Button>
        )}
      </CardFooter>
    </Card>
  );
}
