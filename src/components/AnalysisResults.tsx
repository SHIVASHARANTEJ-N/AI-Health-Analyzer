import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { AlertTriangle, CheckCircle, AlertCircle, XCircle, Pill, Stethoscope, Calendar } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface Finding {
  condition: string;
  severity: "minor" | "moderate" | "major" | "critical";
  description: string;
  recommendation: string;
  remedies?: string[];
  medicines?: string[];
  doctorSpecialty?: string;
  urgency?: "urgent" | "very-urgent" | "emergency";
}

interface AnalysisResultsProps {
  primaryDiagnosis: string;
  findings: Finding[];
  summary: string;
}

const HOSPITALS = [
  { id: "1", name: "City General Hospital", location: "Downtown" },
  { id: "2", name: "St. Mary's Medical Center", location: "Northside" },
  { id: "3", name: "Memorial Healthcare", location: "Eastside" },
  { id: "4", name: "University Medical Center", location: "Westend" },
  { id: "5", name: "Regional Hospital", location: "Southside" },
];

const DOCTORS_BY_SPECIALTY: Record<string, Array<{ id: string; name: string; hospital: string }>> = {
  Cardiologist: [
    { id: "1", name: "Dr. Sarah Johnson", hospital: "City General Hospital" },
    { id: "2", name: "Dr. Michael Chen", hospital: "St. Mary's Medical Center" },
    { id: "3", name: "Dr. Emily Rodriguez", hospital: "Memorial Healthcare" },
  ],
  Neurologist: [
    { id: "4", name: "Dr. James Williams", hospital: "University Medical Center" },
    { id: "5", name: "Dr. Lisa Anderson", hospital: "Regional Hospital" },
    { id: "6", name: "Dr. Robert Taylor", hospital: "City General Hospital" },
  ],
  Oncologist: [
    { id: "7", name: "Dr. Maria Garcia", hospital: "St. Mary's Medical Center" },
    { id: "8", name: "Dr. David Kim", hospital: "Memorial Healthcare" },
    { id: "9", name: "Dr. Jennifer Lee", hospital: "University Medical Center" },
  ],
  Orthopedist: [
    { id: "10", name: "Dr. Christopher Brown", hospital: "Regional Hospital" },
    { id: "11", name: "Dr. Amanda White", hospital: "City General Hospital" },
  ],
  "General Physician": [
    { id: "12", name: "Dr. Thomas Martinez", hospital: "St. Mary's Medical Center" },
    { id: "13", name: "Dr. Patricia Davis", hospital: "Memorial Healthcare" },
    { id: "14", name: "Dr. Richard Wilson", hospital: "University Medical Center" },
  ],
};

const getSeverityConfig = (severity: string) => {
  switch (severity) {
    case "critical":
      return {
        icon: XCircle,
        color: "text-critical",
        bgColor: "bg-critical/10",
        label: "Critical",
      };
    case "major":
      return {
        icon: AlertCircle,
        color: "text-critical",
        bgColor: "bg-critical/10",
        label: "Major",
      };
    case "moderate":
      return {
        icon: AlertTriangle,
        color: "text-warning",
        bgColor: "bg-warning/10",
        label: "Moderate",
      };
    default:
      return {
        icon: CheckCircle,
        color: "text-success",
        bgColor: "bg-success/10",
        label: "Minor",
      };
  }
};

export const AnalysisResults = ({ primaryDiagnosis, findings, summary }: AnalysisResultsProps) => {
  const hasCriticalFindings = findings.some(f => f.severity === "major" || f.severity === "critical");
  const [bookingDialogOpen, setBookingDialogOpen] = useState(false);
  const [selectedSpecialty, setSelectedSpecialty] = useState<string>("");
  const [selectedHospital, setSelectedHospital] = useState<string>("");
  const [selectedDoctor, setSelectedDoctor] = useState<string>("");
  const { toast } = useToast();

  const handleBookAppointment = (specialty: string) => {
    setSelectedSpecialty(specialty);
    setSelectedHospital("");
    setSelectedDoctor("");
    setBookingDialogOpen(true);
  };

  const confirmBooking = () => {
    if (!selectedHospital || !selectedDoctor) {
      toast({
        title: "Incomplete Selection",
        description: "Please select both hospital and doctor",
        variant: "destructive",
      });
      return;
    }

    const hospital = HOSPITALS.find(h => h.id === selectedHospital);
    const allDoctors = Object.values(DOCTORS_BY_SPECIALTY).flat();
    const doctor = allDoctors.find(d => d.id === selectedDoctor);

    toast({
      title: "Appointment Booked Successfully",
      description: `Appointment with ${doctor?.name} at ${hospital?.name} has been scheduled.`,
    });

    setBookingDialogOpen(false);
  };

  const availableDoctors = selectedHospital
    ? (DOCTORS_BY_SPECIALTY[selectedSpecialty] || []).filter(
        doc => doc.hospital === HOSPITALS.find(h => h.id === selectedHospital)?.name
      )
    : DOCTORS_BY_SPECIALTY[selectedSpecialty] || [];
  
  return (
    <div className="space-y-6">
      {/* Primary Diagnosis */}
      <Card className="p-6 shadow-card border-2 border-primary/20 bg-primary/5">
        <h3 className="text-sm font-medium text-muted-foreground mb-2">Primary Diagnosis</h3>
        <h2 className="text-2xl font-bold text-foreground mb-3">{primaryDiagnosis}</h2>
        {hasCriticalFindings && (
          <div className="flex items-center gap-2 text-critical">
            <AlertCircle className="w-5 h-5" />
            <span className="font-semibold">Requires Medical Attention</span>
          </div>
        )}
      </Card>

      <Card className="p-6 shadow-card">
        <h3 className="text-lg font-semibold text-foreground mb-3">Analysis Summary</h3>
        <p className="text-muted-foreground leading-relaxed">{summary}</p>
      </Card>

      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-foreground">Detected Findings</h3>
        {findings.map((finding, index) => {
          const config = getSeverityConfig(finding.severity);
          const Icon = config.icon;

          return (
            <Card key={index} className="p-6 shadow-card">
              <div className="flex items-start gap-4">
                <div className={`p-3 rounded-full ${config.bgColor}`}>
                  <Icon className={`w-6 h-6 ${config.color}`} />
                </div>
                <div className="flex-1 space-y-3">
                  <div className="flex items-start justify-between gap-4">
                    <h4 className="text-lg font-semibold text-foreground">
                      {finding.condition}
                    </h4>
                    <Badge
                      variant={finding.severity === "minor" ? "secondary" : "destructive"}
                      className={finding.severity === "minor" ? "bg-success/20 text-success" : ""}
                    >
                      {config.label}
                    </Badge>
                  </div>
                  <p className="text-muted-foreground">{finding.description}</p>
                  <div className="pt-2 border-t border-border">
                    <p className="text-sm font-medium text-foreground mb-1">
                      Recommendation:
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {finding.recommendation}
                    </p>
                  </div>

                  {/* Remedies and Medicines for Minor/Moderate */}
                  {(finding.severity === "minor" || finding.severity === "moderate") && (
                    <>
                      {finding.remedies && finding.remedies.length > 0 && (
                        <div className="pt-3 border-t border-border">
                          <div className="flex items-center gap-2 mb-2">
                            <Pill className="w-4 h-4 text-primary" />
                            <p className="text-sm font-medium text-foreground">
                              Suggested Remedies:
                            </p>
                          </div>
                          <ul className="list-disc list-inside text-sm text-muted-foreground space-y-1">
                            {finding.remedies.map((remedy, idx) => (
                              <li key={idx}>{remedy}</li>
                            ))}
                          </ul>
                        </div>
                      )}
                      {finding.medicines && finding.medicines.length > 0 && (
                        <div className="pt-3 border-t border-border">
                          <div className="flex items-center gap-2 mb-2">
                            <Pill className="w-4 h-4 text-primary" />
                            <p className="text-sm font-medium text-foreground">
                              Suggested Medicines:
                            </p>
                          </div>
                          <ul className="list-disc list-inside text-sm text-muted-foreground space-y-1">
                            {finding.medicines.map((medicine, idx) => (
                              <li key={idx}>{medicine}</li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </>
                  )}

                  {/* Appointment Booking for Major/Critical */}
                  {(finding.severity === "major" || finding.severity === "critical") && (
                    <div className="pt-3 border-t border-border bg-critical/5 -m-6 mt-3 p-4 rounded-b-lg">
                      <div className="flex items-center gap-2 mb-3">
                        <Stethoscope className="w-5 h-5 text-critical" />
                        <p className="text-sm font-semibold text-critical">
                          Medical Attention Required
                        </p>
                      </div>
                      {finding.doctorSpecialty && (
                        <p className="text-sm text-muted-foreground mb-2">
                          <strong>Specialist Needed:</strong> {finding.doctorSpecialty}
                        </p>
                      )}
                      {finding.urgency && (
                        <p className="text-sm text-muted-foreground mb-3">
                          <strong>Urgency:</strong>{" "}
                          <span className="text-critical font-medium capitalize">
                            {finding.urgency.replace("-", " ")}
                          </span>
                        </p>
                      )}
                      <Button 
                        className="w-full" 
                        variant="destructive"
                        onClick={() => handleBookAppointment(finding.doctorSpecialty || "General Physician")}
                      >
                        <Calendar className="w-4 h-4 mr-2" />
                        Book Appointment Now
                      </Button>
                    </div>
                  )}
                </div>
              </div>
            </Card>
          );
        })}
      </div>

      <Card className="p-4 bg-accent/30 border-primary/20">
        <p className="text-sm text-muted-foreground">
          <strong className="text-foreground">Disclaimer:</strong> This analysis is AI-generated 
          and should not replace professional medical advice. Please consult with a qualified 
          healthcare provider for accurate diagnosis and treatment.
        </p>
      </Card>

      {/* Appointment Booking Dialog */}
      <Dialog open={bookingDialogOpen} onOpenChange={setBookingDialogOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Book Appointment</DialogTitle>
            <DialogDescription>
              Select a hospital and doctor for your {selectedSpecialty} consultation
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="hospital">Select Hospital</Label>
              <Select value={selectedHospital} onValueChange={(value) => {
                setSelectedHospital(value);
                setSelectedDoctor("");
              }}>
                <SelectTrigger id="hospital">
                  <SelectValue placeholder="Choose a hospital" />
                </SelectTrigger>
                <SelectContent>
                  {HOSPITALS.map(hospital => (
                    <SelectItem key={hospital.id} value={hospital.id}>
                      {hospital.name} - {hospital.location}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="doctor">Select Doctor</Label>
              <Select 
                value={selectedDoctor} 
                onValueChange={setSelectedDoctor}
                disabled={!selectedHospital}
              >
                <SelectTrigger id="doctor">
                  <SelectValue placeholder={selectedHospital ? "Choose a doctor" : "Select hospital first"} />
                </SelectTrigger>
                <SelectContent>
                  {availableDoctors.map(doctor => (
                    <SelectItem key={doctor.id} value={doctor.id}>
                      {doctor.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setBookingDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={confirmBooking}>
              Confirm Booking
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};
