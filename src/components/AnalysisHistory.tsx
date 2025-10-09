import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { Trash2, FileText, Calendar } from "lucide-react";
import { format } from "date-fns";

interface HistoryItem {
  id: string;
  symptoms: string | null;
  file_name: string | null;
  file_type: string | null;
  analysis_result: any;
  created_at: string;
}

interface AnalysisHistoryProps {
  onSelectAnalysis: (data: any) => void;
  refreshTrigger?: number;
}

export const AnalysisHistory = ({ onSelectAnalysis, refreshTrigger }: AnalysisHistoryProps) => {
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  const fetchHistory = async () => {
    try {
      const { data, error } = await supabase
        .from('analysis_history')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setHistory(data || []);
    } catch (error) {
      console.error('Error fetching history:', error);
      toast({
        title: "Error",
        description: "Failed to load analysis history",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchHistory();
  }, [refreshTrigger]);

  const handleDelete = async (id: string) => {
    try {
      const { error } = await supabase
        .from('analysis_history')
        .delete()
        .eq('id', id);

      if (error) throw error;

      setHistory(history.filter(item => item.id !== id));
      toast({
        title: "Deleted",
        description: "Analysis removed from history",
      });
    } catch (error) {
      console.error('Error deleting:', error);
      toast({
        title: "Error",
        description: "Failed to delete analysis",
        variant: "destructive",
      });
    }
  };

  if (isLoading) {
    return <div className="text-center text-muted-foreground">Loading history...</div>;
  }

  if (history.length === 0) {
    return (
      <div className="text-center text-muted-foreground py-8">
        <FileText className="w-12 h-12 mx-auto mb-2 opacity-50" />
        <p>No analysis history yet</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <h3 className="text-xl font-semibold text-foreground mb-4">Analysis History</h3>
      {history.map((item) => (
        <Card key={item.id} className="p-4 hover:bg-accent/5 transition-colors">
          <div className="flex items-start justify-between gap-4">
            <button
              onClick={() => onSelectAnalysis(item.analysis_result)}
              className="flex-1 text-left"
            >
              <div className="flex items-center gap-2 mb-2">
                <Calendar className="w-4 h-4 text-muted-foreground" />
                <span className="text-sm text-muted-foreground">
                  {format(new Date(item.created_at), 'PPp')}
                </span>
              </div>
              {item.file_name && (
                <div className="flex items-center gap-2 mb-1">
                  <FileText className="w-4 h-4 text-primary" />
                  <span className="text-sm font-medium text-foreground">{item.file_name}</span>
                </div>
              )}
              {item.symptoms && (
                <p className="text-sm text-muted-foreground line-clamp-2">
                  {item.symptoms}
                </p>
              )}
            </button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => handleDelete(item.id)}
              className="text-destructive hover:text-destructive"
            >
              <Trash2 className="w-4 h-4" />
            </Button>
          </div>
        </Card>
      ))}
    </div>
  );
};
