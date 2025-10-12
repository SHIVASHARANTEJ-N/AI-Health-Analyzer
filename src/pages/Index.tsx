import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { FileUpload } from "@/components/FileUpload";
import { SymptomInput } from "@/components/SymptomInput";
import { AnalysisResults } from "@/components/AnalysisResults";
import { AnalysisHistory } from "@/components/AnalysisHistory";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Activity, Sparkles, Shield, LogOut, History } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

const Index = () => {
  const [file, setFile] = useState<File | null>(null);
  const [symptoms, setSymptoms] = useState("");
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const [showHistory, setShowHistory] = useState(false);
  const [analysisData, setAnalysisData] = useState<any>(null);
  const [userEmail, setUserEmail] = useState<string>("");
  const [historyRefresh, setHistoryRefresh] = useState(0);
  const { toast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    const checkAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        navigate("/auth");
        return;
      }
      setUserEmail(session.user.email || "");
    };

    checkAuth();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (!session) {
        navigate("/auth");
      } else {
        setUserEmail(session.user.email || "");
      }
    });

    return () => subscription.unsubscribe();
  }, [navigate]);

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    navigate("/auth");
  };

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
    
    try {
      let fileData = null;
      let fileType = null;

      // Convert file to base64 if provided
      if (file) {
        fileData = await new Promise<string>((resolve, reject) => {
          const reader = new FileReader();
          reader.onloadend = () => resolve(reader.result as string);
          reader.onerror = reject;
          reader.readAsDataURL(file);
        });
        fileType = file.type;
      }

      const { data, error } = await supabase.functions.invoke('analyze-symptoms', {
        body: { 
          symptoms: symptoms.trim(),
          fileData,
          fileType,
          fileName: file?.name
        }
      });

      if (error) {
        console.error('Analysis error:', error);
        throw error;
      }

      if (!data) {
        throw new Error('No data received from analysis');
      }

      setAnalysisData(data);
      setShowResults(true);
      setHistoryRefresh(prev => prev + 1);
      
      toast({
        title: "Analysis Complete",
        description: "Your medical report has been analyzed successfully",
      });
    } catch (error) {
      console.error('Error analyzing symptoms:', error);
      toast({
        title: "Analysis Failed",
        description: error instanceof Error ? error.message : "Failed to analyze symptoms. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsAnalyzing(false);
    }
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
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Shield className="w-4 h-4" />
                <span>HIPAA Compliant</span>
              </div>
              <div className="flex items-center gap-2">
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={() => {
                    setShowHistory(!showHistory);
                    setShowResults(false);
                  }}
                >
                  <History className="w-4 h-4 mr-2" />
                  History
                </Button>
                <span className="text-sm text-muted-foreground">{userEmail}</span>
                <Button variant="ghost" size="sm" onClick={handleSignOut}>
                  <LogOut className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-12 max-w-5xl">
        {showHistory ? (
          <>
            <div className="mb-8 flex items-center justify-between">
              <div>
                <h2 className="text-3xl font-bold text-foreground mb-2">Analysis History</h2>
                <p className="text-muted-foreground">
                  Review your past medical analyses
                </p>
              </div>
              <Button
                variant="outline"
                onClick={() => setShowHistory(false)}
              >
                Back to Analysis
              </Button>
            </div>
            <AnalysisHistory 
              onSelectAnalysis={(data) => {
                setAnalysisData(data);
                setShowResults(true);
                setShowHistory(false);
              }}
              refreshTrigger={historyRefresh}
            />
          </>
        ) : !showResults ? (
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
                  setAnalysisData(null);
                }}
              >
                New Analysis
              </Button>
            </div>
            {analysisData && <AnalysisResults {...analysisData} />}
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
