import { useState } from "react";
import { FileUpload } from "@/components/FileUpload";
import { SymptomInput } from "@/components/SymptomInput";
import { AnalysisResults } from "@/components/AnalysisResults";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Activity, Sparkles, Shield } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const Index = () => {
  const [file, setFile] = useState<File | null>(null);
  const [symptoms, setSymptoms] = useState("");
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const { toast } = useToast();

  const handleAnalyze = async () => {
    if (!file && !symptoms.trim()) {
      toast({
        title: "Input Required",
        description: "Please upload a medical report or describe your symptoms",
        variant: "destructive",
      });
      return;
    }

    setIsAnalyzing(true);
    
    // Simulate AI analysis
    await new Promise(resolve => setTimeout(resolve, 3000));
    
    setIsAnalyzing(false);
    setShowResults(true);
    
    toast({
      title: "Analysis Complete",
      description: "Your medical report has been analyzed successfully",
    });
  };

  // Mock data for demo
  const mockResults = {
    primaryDiagnosis: "Moderate Hypertension with Cardiovascular Risk Factors",
    summary: "The analysis indicates elevated blood pressure readings consistent with Stage 2 hypertension. Additional findings suggest early signs of cardiovascular stress and metabolic concerns that require medical attention and lifestyle modifications.",
    findings: [
      {
        condition: "Hypertension (Stage 2)",
        severity: "major" as const,
        description: "Blood pressure readings consistently above 140/90 mmHg, indicating moderate to severe hypertension. This increases risk of heart disease, stroke, and kidney damage.",
        recommendation: "Immediate consultation with a cardiologist is strongly recommended. Blood pressure monitoring and medication may be necessary.",
        doctorSpecialty: "Cardiologist",
        urgency: "urgent" as const,
      },
      {
        condition: "Elevated Cholesterol Levels",
        severity: "moderate" as const,
        description: "LDL cholesterol levels are above optimal range (130-159 mg/dL), contributing to cardiovascular risk.",
        recommendation: "Dietary modifications and regular exercise recommended. Consider cholesterol-lowering medication if lifestyle changes are insufficient.",
        remedies: [
          "Increase fiber intake with oats, beans, and vegetables",
          "Incorporate omega-3 rich foods like salmon and walnuts",
          "Reduce saturated fats and trans fats in diet",
          "Exercise at least 30 minutes daily, 5 days per week"
        ],
        medicines: [
          "Atorvastatin 10-20mg (prescription required)",
          "Omega-3 supplements (1000mg daily)",
          "Plant sterols supplements"
        ]
      },
      {
        condition: "Vitamin D Deficiency",
        severity: "minor" as const,
        description: "Vitamin D levels below 20 ng/mL, which may affect bone health and immune function.",
        recommendation: "Sun exposure and vitamin D supplementation recommended. Re-test in 3 months.",
        remedies: [
          "Get 15-20 minutes of sunlight daily",
          "Consume vitamin D rich foods: fatty fish, egg yolks, fortified milk",
          "Take daily walks in morning sunlight"
        ],
        medicines: [
          "Vitamin D3 2000 IU daily supplement",
          "Calcium with Vitamin D combination tablets"
        ]
      }
    ]
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-10">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Activity className="w-8 h-8 text-primary" />
              <h1 className="text-2xl font-bold text-foreground">MediScan AI</h1>
            </div>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Shield className="w-4 h-4" />
              <span>HIPAA Compliant</span>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-12 max-w-5xl">
        {!showResults ? (
          <>
            {/* Hero Section */}
            <div className="text-center mb-12">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary mb-4">
                <Sparkles className="w-4 h-4" />
                <span className="text-sm font-medium">AI-Powered Medical Analysis</span>
              </div>
              <h2 className="text-4xl font-bold text-foreground mb-4">
                Get Instant Health Insights
              </h2>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                Upload your medical reports or describe your symptoms for AI-powered analysis 
                and personalized health recommendations
              </p>
            </div>

            {/* Input Section */}
            <Tabs defaultValue="upload" className="mb-8">
              <TabsList className="grid w-full grid-cols-2 max-w-md mx-auto">
                <TabsTrigger value="upload">Upload Report</TabsTrigger>
                <TabsTrigger value="symptoms">Describe Symptoms</TabsTrigger>
              </TabsList>
              <TabsContent value="upload" className="mt-6">
                <FileUpload onFileSelect={setFile} />
              </TabsContent>
              <TabsContent value="symptoms" className="mt-6">
                <SymptomInput onSymptomChange={setSymptoms} />
              </TabsContent>
            </Tabs>

            {/* Analyze Button */}
            <div className="flex justify-center">
              <Button
                size="lg"
                onClick={handleAnalyze}
                disabled={isAnalyzing}
                className="min-w-[200px]"
              >
                {isAnalyzing ? (
                  <>
                    <div className="w-4 h-4 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin mr-2" />
                    Analyzing...
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4 mr-2" />
                    Analyze Now
                  </>
                )}
              </Button>
            </div>

            {/* Features */}
            <div className="grid md:grid-cols-3 gap-6 mt-16">
              <div className="text-center p-6">
                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
                  <Activity className="w-6 h-6 text-primary" />
                </div>
                <h3 className="font-semibold text-foreground mb-2">Instant Analysis</h3>
                <p className="text-sm text-muted-foreground">
                  Get comprehensive health insights in seconds
                </p>
              </div>
              <div className="text-center p-6">
                <div className="w-12 h-12 rounded-full bg-accent/10 flex items-center justify-center mx-auto mb-4">
                  <Shield className="w-6 h-6 text-accent" />
                </div>
                <h3 className="font-semibold text-foreground mb-2">Secure & Private</h3>
                <p className="text-sm text-muted-foreground">
                  Your data is encrypted and HIPAA compliant
                </p>
              </div>
              <div className="text-center p-6">
                <div className="w-12 h-12 rounded-full bg-success/10 flex items-center justify-center mx-auto mb-4">
                  <Sparkles className="w-6 h-6 text-success" />
                </div>
                <h3 className="font-semibold text-foreground mb-2">AI-Powered</h3>
                <p className="text-sm text-muted-foreground">
                  Advanced machine learning for accurate insights
                </p>
              </div>
            </div>
          </>
        ) : (
          <>
            <div className="mb-8 flex items-center justify-between">
              <div>
                <h2 className="text-3xl font-bold text-foreground mb-2">Analysis Results</h2>
                <p className="text-muted-foreground">
                  Review your health assessment and recommendations below
                </p>
              </div>
              <Button
                variant="outline"
                onClick={() => {
                  setShowResults(false);
                  setFile(null);
                  setSymptoms("");
                }}
              >
                New Analysis
              </Button>
            </div>
            <AnalysisResults {...mockResults} />
          </>
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-border mt-20 py-8">
        <div className="container mx-auto px-4 text-center text-sm text-muted-foreground">
          <p>© 2025 MediScan AI. This tool is for informational purposes only and does not replace professional medical advice.</p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
