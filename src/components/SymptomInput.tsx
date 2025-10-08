import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { MessageSquare } from "lucide-react";

interface SymptomInputProps {
  onSymptomChange: (symptoms: string) => void;
}

export const SymptomInput = ({ onSymptomChange }: SymptomInputProps) => {
  const [symptoms, setSymptoms] = useState("");

  const handleChange = (value: string) => {
    setSymptoms(value);
    onSymptomChange(value);
  };

  return (
    <Card className="p-6 shadow-elevated">
      <div className="flex items-center gap-2 mb-4">
        <MessageSquare className="w-5 h-5 text-primary" />
        <Label htmlFor="symptoms" className="text-lg font-semibold">
          Describe Your Symptoms
        </Label>
      </div>
      <Textarea
        id="symptoms"
        placeholder="Example: I've been experiencing a persistent headache for 3 days, accompanied by mild nausea and sensitivity to light..."
        value={symptoms}
        onChange={(e) => handleChange(e.target.value)}
        className="min-h-[150px] resize-none"
      />
      <p className="text-xs text-muted-foreground mt-2">
        Be as detailed as possible. Include duration, intensity, and any relevant medical history.
      </p>
    </Card>
  );
};
