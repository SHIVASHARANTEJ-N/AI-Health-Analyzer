import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { CalendarIcon, Stethoscope, Award } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface DoctorBookingProps {
  finding: {
    condition: string;
    doctorSpecialty?: string;
    urgency?: string;
  };
  onBookingComplete: () => void;
}

const DOCTORS_DATA = {
  "Cardiologist": [
    { name: "Dr. Sarah Johnson", experience: "15 years experience, MBBS, MD Cardiology", hospital: "Apollo Heart Institute", location: "New Delhi" },
    { name: "Dr. Michael Chen", experience: "12 years experience, MBBS, DM Cardiology", hospital: "Fortis Escorts Heart Institute", location: "New Delhi" },
    { name: "Dr. Priya Sharma", experience: "10 years experience, MBBS, DNB Cardiology", hospital: "Narayana Heart Centre", location: "Bangalore" },
  ],
  "Neurologist": [
    { name: "Dr. James Wilson", experience: "18 years experience, MBBS, DM Neurology", hospital: "NIMHANS", location: "Bangalore" },
    { name: "Dr. Emily Brown", experience: "14 years experience, MBBS, MD Neurology", hospital: "Fortis Memorial Research Institute", location: "Gurgaon" },
    { name: "Dr. Raj Kumar", experience: "11 years experience, MBBS, DNB Neurology", hospital: "Global Hospital", location: "Mumbai" },
  ],
  "Dermatologist": [
    { name: "Dr. Lisa Anderson", experience: "13 years experience, MBBS, MD Dermatology", hospital: "Kaya Skin Clinic", location: "Multiple Locations" },
    { name: "Dr. David Lee", experience: "9 years experience, MBBS, DVD Dermatology", hospital: "Apollo Hospital - Dermatology", location: "Chennai" },
    { name: "Dr. Aisha Patel", experience: "8 years experience, MBBS, DDV", hospital: "Fortis Hospital", location: "Mumbai" },
  ],
  "Orthopedic": [
    { name: "Dr. Robert Taylor", experience: "16 years experience, MBBS, MS Orthopedics", hospital: "Indian Spinal Injuries Centre", location: "New Delhi" },
    { name: "Dr. Maria Garcia", experience: "12 years experience, MBBS, DNB Orthopedics", hospital: "Fortis Hospital - Orthopedics", location: "Mumbai" },
    { name: "Dr. Vikram Singh", experience: "10 years experience, MBBS, MS Orthopedics", hospital: "Apollo Hospital - Orthopedics", location: "Hyderabad" },
  ],
  "General Physician": [
    { name: "Dr. John Smith", experience: "20 years experience, MBBS, MD General Medicine", hospital: "Max Hospital", location: "New Delhi" },
    { name: "Dr. Amanda White", experience: "15 years experience, MBBS, MD Internal Medicine", hospital: "Apollo Hospital", location: "Chennai" },
    { name: "Dr. Suresh Reddy", experience: "12 years experience, MBBS, MD", hospital: "Fortis Hospital", location: "Bangalore" },
  ],
};

export const DoctorBooking = ({ finding, onBookingComplete }: DoctorBookingProps) => {
  const [selectedDoctor, setSelectedDoctor] = useState("");
  const [appointmentDate, setAppointmentDate] = useState<Date>();
  const [appointmentTime, setAppointmentTime] = useState("");
  const [isBooking, setIsBooking] = useState(false);
  const { toast } = useToast();

  const specialty = (finding.doctorSpecialty || "General Physician") as keyof typeof DOCTORS_DATA;
  const doctors = DOCTORS_DATA[specialty] || DOCTORS_DATA["General Physician"];
  const selectedDoctorData = doctors.find(d => d.name === selectedDoctor);

  const handleBooking = async () => {
    if (!selectedDoctor || !appointmentDate || !appointmentTime) {
      toast({
        title: "Missing Information",
        description: "Please fill in all fields",
        variant: "destructive",
      });
      return;
    }

    if (!selectedDoctorData) {
      toast({
        title: "Error",
        description: "Please select a valid doctor",
        variant: "destructive",
      });
      return;
    }

    setIsBooking(true);
    try {
      const appointmentDateTime = new Date(appointmentDate);
      const [hours, minutes] = appointmentTime.split(':');
      appointmentDateTime.setHours(parseInt(hours), parseInt(minutes));

      const { error } = await (supabase as any)
        .from('appointments')
        .insert({
          doctor_name: selectedDoctor,
          doctor_specialty: finding.doctorSpecialty || "General Physician",
          doctor_experience: selectedDoctorData.experience,
          hospital_name: selectedDoctorData.hospital,
          location: selectedDoctorData.location,
          appointment_date: appointmentDateTime.toISOString(),
          urgency: finding.urgency || "urgent",
          related_condition: finding.condition,
          status: 'scheduled'
        });

      if (error) throw error;

      toast({
        title: "Appointment Booked",
        description: "Your appointment has been scheduled successfully",
      });

      onBookingComplete();
    } catch (error) {
      console.error('Error booking appointment:', error);
      toast({
        title: "Error",
        description: "Failed to book appointment",
        variant: "destructive",
      });
    } finally {
      setIsBooking(false);
    }
  };

  return (
    <Card className="p-6 space-y-6">
      <div className="flex items-center gap-2 mb-4">
        <Stethoscope className="w-5 h-5 text-primary" />
        <h3 className="text-lg font-semibold">Book Appointment with {finding.doctorSpecialty || "General Physician"}</h3>
      </div>

      <div className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="doctor">Select Doctor</Label>
          <Select value={selectedDoctor} onValueChange={setSelectedDoctor}>
            <SelectTrigger>
              <SelectValue placeholder="Choose a doctor" />
            </SelectTrigger>
            <SelectContent>
              {doctors.map((doctor) => (
                <SelectItem key={doctor.name} value={doctor.name}>
                  <div className="flex flex-col items-start">
                    <span className="font-medium">{doctor.name}</span>
                    <span className="text-xs text-muted-foreground flex items-center gap-1">
                      <Award className="w-3 h-3" />
                      {doctor.experience}
                    </span>
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {selectedDoctorData && (
          <>
            <div className="space-y-2">
              <Label>Hospital</Label>
              <div className="p-3 rounded-md border bg-muted/50">
                <p className="font-medium">{selectedDoctorData.hospital}</p>
                <p className="text-sm text-muted-foreground mt-1">{selectedDoctorData.location}</p>
              </div>
            </div>
          </>
        )}

        <div className="space-y-2">
          <Label>Appointment Date</Label>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className={cn(
                  "w-full justify-start text-left font-normal",
                  !appointmentDate && "text-muted-foreground"
                )}
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {appointmentDate ? format(appointmentDate, "PPP") : "Pick a date"}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar
                mode="single"
                selected={appointmentDate}
                onSelect={setAppointmentDate}
                disabled={(date) => date < new Date()}
                initialFocus
                className="pointer-events-auto"
              />
            </PopoverContent>
          </Popover>
        </div>

        <div className="space-y-2">
          <Label htmlFor="time">Appointment Time</Label>
          <Input
            id="time"
            type="time"
            value={appointmentTime}
            onChange={(e) => setAppointmentTime(e.target.value)}
          />
        </div>

        <Button 
          onClick={handleBooking} 
          disabled={isBooking}
          className="w-full"
        >
          {isBooking ? "Booking..." : "Confirm Appointment"}
        </Button>
      </div>
    </Card>
  );
};
