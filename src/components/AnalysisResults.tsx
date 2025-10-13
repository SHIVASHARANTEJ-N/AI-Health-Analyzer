import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { AlertTriangle, CheckCircle, AlertCircle, XCircle, Pill, Stethoscope, Calendar } from "lucide-react";
import { DoctorBooking } from "./DoctorBooking";

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
  onBookingComplete?: () => void;
}


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

export const AnalysisResults = ({ primaryDiagnosis, findings, summary, onBookingComplete }: AnalysisResultsProps) => {
  const hasCriticalFindings = findings.some(f => f.severity === "major" || f.severity === "critical");
  const [bookingFinding, setBookingFinding] = useState<Finding | null>(null);

  if (bookingFinding) {
    return (
      <div className="space-y-6 animate-fade-in">
        <Button 
          variant="ghost" 
          onClick={() => setBookingFinding(null)}
          className="mb-4"
        >
          ← Back to Results
        </Button>
        <DoctorBooking 
          finding={bookingFinding} 
          onBookingComplete={() => {
            setBookingFinding(null);
            onBookingComplete?.();
          }}
        />
      </div>
    );
  }
  
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
                        onClick={() => setBookingFinding(finding)}
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
    </div>
  );
};
