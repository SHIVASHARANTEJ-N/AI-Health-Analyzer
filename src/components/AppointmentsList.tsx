import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Calendar, Clock, MapPin, Stethoscope, User, Trash2, Award, Phone } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { format } from "date-fns";

interface AppointmentsListProps {
  refreshTrigger?: number;
}

export const AppointmentsList = ({ refreshTrigger }: AppointmentsListProps) => {
  const [appointments, setAppointments] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  const fetchAppointments = async () => {
    try {
      const { data, error } = await (supabase as any)
        .from('appointments')
        .select('*')
        .order('appointment_date', { ascending: true });

      if (error) throw error;
      setAppointments(data || []);
    } catch (error) {
      console.error('Error fetching appointments:', error);
      toast({
        title: "Error",
        description: "Failed to load appointments",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchAppointments();
  }, [refreshTrigger]);

  const handleDelete = async (id: string) => {
    try {
      const { error } = await (supabase as any)
        .from('appointments')
        .delete()
        .eq('id', id);

      if (error) throw error;

      setAppointments(appointments.filter(item => item.id !== id));
      toast({
        title: "Cancelled",
        description: "Appointment cancelled successfully",
      });
    } catch (error) {
      console.error('Error deleting appointment:', error);
      toast({
        title: "Error",
        description: "Failed to cancel appointment",
        variant: "destructive",
      });
    }
  };

  const getUrgencyColor = (urgency: string) => {
    switch (urgency) {
      case 'urgent':
        return 'bg-orange-500';
      case 'very-urgent':
        return 'bg-red-500';
      case 'emergency':
        return 'bg-red-700';
      default:
        return 'bg-blue-500';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'scheduled':
        return 'bg-green-500';
      case 'completed':
        return 'bg-gray-500';
      case 'cancelled':
        return 'bg-red-500';
      default:
        return 'bg-blue-500';
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="w-8 h-8 border-2 border-primary/30 border-t-primary rounded-full animate-spin" />
      </div>
    );
  }

  if (appointments.length === 0) {
    return (
      <Card className="p-8 text-center">
        <Calendar className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
        <p className="text-muted-foreground">No appointments scheduled</p>
      </Card>
    );
  }

  return (
    <ScrollArea className="h-[600px]">
      <div className="space-y-4">
        {appointments.map((appointment) => (
          <Card key={appointment.id} className="p-6 hover:shadow-lg transition-shadow">
            <div className="flex items-start justify-between gap-4">
              <div className="flex-1 space-y-4">
                <div className="flex items-center gap-2 flex-wrap">
                  <Badge className={getUrgencyColor(appointment.urgency)}>
                    {appointment.urgency}
                  </Badge>
                  <Badge className={getStatusColor(appointment.status)}>
                    {appointment.status}
                  </Badge>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <Stethoscope className="w-4 h-4 text-primary" />
                    <span className="font-medium">{appointment.doctor_specialty}</span>
                  </div>

                  <div className="flex items-center gap-2">
                    <User className="w-4 h-4 text-muted-foreground" />
                    <span className="font-medium">{appointment.doctor_name}</span>
                  </div>

                  <div className="flex items-center gap-2">
                    <Award className="w-4 h-4 text-muted-foreground" />
                    <span className="text-sm text-muted-foreground">
                      {appointment.doctor_experience}
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    <MapPin className="w-4 h-4 text-muted-foreground" />
                    <span className="text-sm">
                      {appointment.hospital_name}, {appointment.location}
                    </span>
                  </div>

                  {appointment.hospital_phone && (
                    <div className="flex items-center gap-2">
                      <Phone className="w-4 h-4 text-primary" />
                      <a 
                        href={`tel:${appointment.hospital_phone}`} 
                        className="text-sm text-primary hover:underline"
                      >
                        {appointment.hospital_phone}
                      </a>
                    </div>
                  )}

                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-muted-foreground" />
                    <span className="text-sm">
                      {format(new Date(appointment.appointment_date), 'PPP')}
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4 text-muted-foreground" />
                    <span className="text-sm">
                      {format(new Date(appointment.appointment_date), 'p')}
                    </span>
                  </div>

                  <div className="mt-2 p-3 bg-muted rounded-lg">
                    <p className="text-sm">
                      <span className="font-medium">Condition: </span>
                      {appointment.related_condition}
                    </p>
                  </div>
                </div>
              </div>

              {appointment.status === 'scheduled' && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleDelete(appointment.id)}
                  className="shrink-0"
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              )}
            </div>
          </Card>
        ))}
      </div>
    </ScrollArea>
  );
};
