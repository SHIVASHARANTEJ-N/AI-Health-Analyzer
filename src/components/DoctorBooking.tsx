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
    { name: "Dr. Sarah Johnson", experience: "15 years experience, MBBS, MD Cardiology" },
    { name: "Dr. Michael Chen", experience: "12 years experience, MBBS, DM Cardiology" },
    { name: "Dr. Priya Sharma", experience: "10 years experience, MBBS, DNB Cardiology" },
  ],
  "Neurologist": [
    { name: "Dr. James Wilson", experience: "18 years experience, MBBS, DM Neurology" },
    { name: "Dr. Emily Brown", experience: "14 years experience, MBBS, MD Neurology" },
    { name: "Dr. Raj Kumar", experience: "11 years experience, MBBS, DNB Neurology" },
  ],
  "Dermatologist": [
    { name: "Dr. Lisa Anderson", experience: "13 years experience, MBBS, MD Dermatology" },
    { name: "Dr. David Lee", experience: "9 years experience, MBBS, DVD Dermatology" },
    { name: "Dr. Aisha Patel", experience: "8 years experience, MBBS, DDV" },
  ],
  "Orthopedic": [
    { name: "Dr. Robert Taylor", experience: "16 years experience, MBBS, MS Orthopedics" },
    { name: "Dr. Maria Garcia", experience: "12 years experience, MBBS, DNB Orthopedics" },
    { name: "Dr. Vikram Singh", experience: "10 years experience, MBBS, MS Orthopedics" },
  ],
  "General Physician": [
    { name: "Dr. John Smith", experience: "20 years experience, MBBS, MD General Medicine" },
    { name: "Dr. Amanda White", experience: "15 years experience, MBBS, MD Internal Medicine" },
    { name: "Dr. Suresh Reddy", experience: "12 years experience, MBBS, MD" },
  ],
};

const HOSPITALS_DATA = {
  "Cardiologist": [
    { name: "Apollo Heart Institute", location: "New Delhi" },
    { name: "Fortis Escorts Heart Institute", location: "New Delhi" },
    { name: "Narayana Heart Centre", location: "Bangalore" },
  ],
  "Neurologist": [
    { name: "NIMHANS", location: "Bangalore" },
    { name: "Fortis Memorial Research Institute", location: "Gurgaon" },
    { name: "Global Hospital", location: "Mumbai" },
  ],
  "Dermatologist": [
    { name: "Kaya Skin Clinic", location: "Multiple Locations" },
    { name: "Apollo Hospital - Dermatology", location: "Chennai" },
    { name: "Fortis Hospital", location: "Mumbai" },
  ],
  "Orthopedic": [
    { name: "Indian Spinal Injuries Centre", location: "New Delhi" },
    { name: "Fortis Hospital - Orthopedics", location: "Mumbai" },
    { name: "Apollo Hospital - Orthopedics", location: "Hyderabad" },
  ],
  "General Physician": [
    { name: "Max Hospital", location: "New Delhi" },
    { name: "Apollo Hospital", location: "Chennai" },
    { name: "Fortis Hospital", location: "Bangalore" },
  ],
};

export const DoctorBooking = ({ finding, onBookingComplete }: DoctorBookingProps) => {
  const [selectedDoctor, setSelectedDoctor] = useState("");
  const [hospitalName, setHospitalName] = useState("");
  const [location, setLocation] = useState("");
  const [appointmentDate, setAppointmentDate] = useState<Date>();
  const [appointmentTime, setAppointmentTime] = useState("");
  const [isBooking, setIsBooking] = useState(false);
  const { toast } = useToast();

  const specialty = (finding.doctorSpecialty || "General Physician") as keyof typeof DOCTORS_DATA;
  const doctors = DOCTORS_DATA[specialty] || DOCTORS_DATA["General Physician"];
  const hospitals = HOSPITALS_DATA[specialty] || HOSPITALS_DATA["General Physician"];

  const handleBooking = async () => {
    if (!selectedDoctor || !hospitalName || !location || !appointmentDate || !appointmentTime) {
      toast({
        title: "Missing Information",
        description: "Please fill in all fields",
        variant: "destructive",
      });
      return;
    }

    setIsBooking(true);
    try {
      const selectedDoctorData = doctors.find(d => d.name === selectedDoctor);
      const appointmentDateTime = new Date(appointmentDate);
      const [hours, minutes] = appointmentTime.split(':');
      appointmentDateTime.setHours(parseInt(hours), parseInt(minutes));

      const { error } = await (supabase as any)
        .from('appointments')
        .insert({
          doctor_name: selectedDoctor,
          doctor_specialty: finding.doctorSpecialty || "General Physician",
          doctor_experience: selectedDoctorData?.experience || "Experienced Professional",
          hospital_name: hospitalName,
          location: location,
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

        <div className="space-y-2">
          <Label htmlFor="hospital">Select Hospital</Label>
          <Select 
            value={hospitalName} 
            onValueChange={(value) => {
              setHospitalName(value);
              const selectedHospital = hospitals.find(h => h.name === value);
              if (selectedHospital) {
                setLocation(selectedHospital.location);
              }
            }}
          >
            <SelectTrigger>
              <SelectValue placeholder="Choose a hospital" />
            </SelectTrigger>
            <SelectContent>
              {hospitals.map((hospital) => (
                <SelectItem key={hospital.name} value={hospital.name}>
                  <div className="flex flex-col items-start">
                    <span className="font-medium">{hospital.name}</span>
                    <span className="text-xs text-muted-foreground">
                      {hospital.location}
                    </span>
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

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
