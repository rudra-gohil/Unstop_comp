import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Flag, Send, Loader2 } from "lucide-react";
import { useSubmitReport } from "@/hooks/use-species-identification";
import { useToast } from "@/hooks/use-toast";

export default function ReportForm() {
  const [location, setLocation] = useState("");
  const [notes, setNotes] = useState("");
  const [speciesName, setSpeciesName] = useState("");
  const { toast } = useToast();
  const submitReport = useSubmitReport();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!location.trim() || !speciesName.trim()) {
      toast({
        title: "Missing information",
        description: "Please fill in species name and location",
        variant: "destructive",
      });
      return;
    }

    try {
      await submitReport.mutateAsync({
        speciesName: speciesName.trim(),
        location: location.trim(),
        notes: notes.trim() || undefined,
      });

      // Reset form
      setLocation("");
      setNotes("");
      setSpeciesName("");

      toast({
        title: "Report submitted",
        description: "Thank you for contributing to conservation efforts",
      });
    } catch (error) {
      toast({
        title: "Submission failed",
        description: "Failed to submit report. Please try again.",
        variant: "destructive",
      });
    }
  };

  return (
    <Card className="glassmorphism border-border/50" data-testid="card-report-form">
      <CardContent className="p-6">
        <h3 className="text-lg font-semibold mb-4 flex items-center text-foreground">
          <Flag className="text-gold mr-2" />
          Report Findings
        </h3>
        <form onSubmit={handleSubmit} className="space-y-4" data-testid="form-report">
          <div>
            <Label htmlFor="species-name" className="text-sm font-medium">
              Species Name
            </Label>
            <Input
              id="species-name"
              type="text"
              value={speciesName}
              onChange={(e) => setSpeciesName(e.target.value)}
              className="bg-secondary border-border focus:border-saffron"
              placeholder="e.g., English Ivy, Spotted Lanternfly"
              data-testid="input-species-name"
            />
          </div>
          
          <div>
            <Label htmlFor="location" className="text-sm font-medium">
              Location
            </Label>
            <Input
              id="location"
              type="text"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              className="bg-secondary border-border focus:border-saffron"
              placeholder="City, State/Province"
              data-testid="input-location"
            />
          </div>
          
          <div>
            <Label htmlFor="notes" className="text-sm font-medium">
              Additional Notes
            </Label>
            <Textarea
              id="notes"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="bg-secondary border-border focus:border-saffron resize-none"
              rows={3}
              placeholder="Observed behavior, population density, impact on native species, etc."
              data-testid="textarea-notes"
            />
          </div>
          
          <Button
            type="submit"
            disabled={submitReport.isPending}
            className="w-full bg-gradient-to-r from-forest to-accent text-white font-semibold hover:shadow-lg hover:shadow-forest/25 transform hover:scale-105 transition-all"
            data-testid="button-submit-report"
          >
            {submitReport.isPending ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Submitting...
              </>
            ) : (
              <>
                <Send className="mr-2 h-4 w-4" />
                Submit Report
              </>
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
