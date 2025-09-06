import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Settings } from "lucide-react";
import ImageUpload from "@/components/ImageUpload";
import ResultsDisplay from "@/components/ResultsDisplay";
import StatsPanel from "@/components/StatsPanel";
import RecentActivity from "@/components/RecentActivity";
import ReportForm from "@/components/ReportForm";
import APIStatus from "@/components/APIStatus";
import AnimatedBackground from "@/components/AnimatedBackground";

export default function Home() {
  const [analysisResults, setAnalysisResults] = useState<any>(null);

  const handleAnalysisComplete = (results: any) => {
    setAnalysisResults(results);
  };

  return (
    <div className="min-h-screen bg-background text-foreground sacred-bg relative">
      {/* Animated Background */}
      <AnimatedBackground />

      {/* Header */}
      <header className="relative z-10 glassmorphism border-b border-border/50">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-gradient-to-br from-saffron to-gold rounded-full flex items-center justify-center animate-pulse-glow">
                <i className="fas fa-leaf text-background text-xl"></i>
                <span className="text-background text-xl font-bold">🌿</span>
              </div>
              <div>
                <h1 className="text-2xl font-bold bg-gradient-to-r from-saffron to-gold bg-clip-text text-transparent">
                  InvasiveID Julia
                </h1>
                <p className="text-muted-foreground text-sm">196 Indian Species • AI-Powered Conservation</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <div className="hidden md:flex items-center space-x-2 text-sm text-muted-foreground">
                <div className="w-2 h-2 bg-forest rounded-full animate-pulse"></div>
                <span>Julia API Connected</span>
              </div>
              <Button
                variant="ghost"
                size="icon"
                className="glassmorphism hover:bg-saffron/10"
                data-testid="button-settings"
              >
                <Settings className="h-4 w-4 text-muted-foreground" />
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="relative z-10 container mx-auto px-6 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Upload and Results Section */}
          <div className="lg:col-span-2 space-y-6">
            <ImageUpload onAnalysisComplete={handleAnalysisComplete} />
            <ResultsDisplay results={analysisResults} />
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            <StatsPanel />
            <RecentActivity />
            <ReportForm />
            <APIStatus />
          </div>
        </div>
      </main>
    </div>
  );
}
