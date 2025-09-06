import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { BarChart3, Sprout, Bug, AlertTriangle, MapPin, Info } from "lucide-react";
import ConfidenceChart from "./ConfidenceChart";

interface Prediction {
  species: string;
  confidence: number;
  scientificName: string;
  category: "plant" | "insect";
  impactLevel: "low" | "medium" | "high";
  nativeTo: string;
}

interface ResultsDisplayProps {
  results: {
    id: string;
    predictions: Prediction[];
    createdAt: string;
  } | null;
}

export default function ResultsDisplay({ results }: ResultsDisplayProps) {
  const [selectedPrediction, setSelectedPrediction] = useState<number>(0);

  if (!results) {
    return null;
  }

  const getImpactColor = (level: string) => {
    switch (level) {
      case "high": return "destructive";
      case "medium": return "default";
      case "low": return "secondary";
      default: return "default";
    }
  };

  const getCategoryIcon = (category: string) => {
    return category === "plant" ? Sprout : Bug;
  };

  return (
    <div className="space-y-6">
      <Card className="glassmorphism border-border/50" data-testid="card-results">
        <CardContent className="p-8">
          <h2 className="text-xl font-semibold mb-6 flex items-center text-foreground">
            <BarChart3 className="text-forest mr-3" />
            Identification Results
          </h2>

          {/* Top Predictions */}
          <div className="space-y-4" data-testid="container-predictions">
            {results.predictions.map((prediction, index) => {
              const CategoryIcon = getCategoryIcon(prediction.category);
              const isSelected = index === selectedPrediction;
              
              return (
                <div
                  key={index}
                  className={`species-card glassmorphism rounded-lg p-6 border border-border/50 cursor-pointer transition-all
                    ${isSelected ? 'border-saffron bg-saffron/5' : 'hover:border-saffron/60'}
                  `}
                  onClick={() => setSelectedPrediction(index)}
                  data-testid={`card-prediction-${index}`}
                >
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center space-x-4">
                      <div className="w-16 h-16 bg-gradient-to-br from-saffron/20 to-forest/20 rounded-lg flex items-center justify-center">
                        <CategoryIcon className="text-saffron text-xl h-8 w-8" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-lg text-foreground" data-testid={`text-species-${index}`}>
                          {prediction.species.replace(/_/g, ' ')}
                        </h3>
                        <p className="text-muted-foreground text-sm" data-testid={`text-scientific-${index}`}>
                          {prediction.scientificName}
                        </p>
                        <div className="flex items-center space-x-2 mt-1">
                          <Badge 
                            variant={getImpactColor(prediction.impactLevel)}
                            className="text-xs"
                            data-testid={`badge-category-${index}`}
                          >
                            {prediction.category === "plant" ? "Invasive Plant" : "Invasive Insect"}
                          </Badge>
                          <Badge 
                            variant="outline"
                            className="text-xs border-border"
                            data-testid={`badge-impact-${index}`}
                          >
                            {prediction.impactLevel.charAt(0).toUpperCase() + prediction.impactLevel.slice(1)} Impact
                          </Badge>
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-2xl font-bold text-saffron" data-testid={`text-confidence-${index}`}>
                        {(prediction.confidence * 100).toFixed(1)}%
                      </div>
                      <div className="text-xs text-muted-foreground">Confidence</div>
                    </div>
                  </div>
                  
                  {/* Confidence Bar */}
                  <div className="mb-4">
                    <Progress 
                      value={prediction.confidence * 100} 
                      className="h-3"
                      data-testid={`progress-confidence-${index}`}
                    />
                  </div>

                  {/* Impact Info */}
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div className="flex items-center">
                      <AlertTriangle className="h-4 w-4 mr-2 text-destructive" />
                      <span className="text-muted-foreground">Impact Level:</span>
                      <span className={`font-medium ml-2 ${
                        prediction.impactLevel === 'high' ? 'text-destructive' : 
                        prediction.impactLevel === 'medium' ? 'text-yellow-500' : 
                        'text-green-500'
                      }`}>
                        {prediction.impactLevel.charAt(0).toUpperCase() + prediction.impactLevel.slice(1)}
                      </span>
                    </div>
                    <div className="flex items-center">
                      <MapPin className="h-4 w-4 mr-2 text-muted-foreground" />
                      <span className="text-muted-foreground">Native to:</span>
                      <span className="text-foreground ml-2">{prediction.nativeTo}</span>
                    </div>
                  </div>

                  {/* Detailed Information for Selected */}
                  {isSelected && (
                    <div className="mt-4 pt-4 border-t border-border/50">
                      <div className="flex items-center mb-2">
                        <Info className="h-4 w-4 mr-2 text-saffron" />
                        <span className="font-medium">Additional Information</span>
                      </div>
                      <p className="text-muted-foreground text-sm">
                        This species has been identified with {(prediction.confidence * 100).toFixed(1)}% confidence. 
                        {prediction.impactLevel === 'high' && " Immediate action may be required to prevent ecological damage."}
                        {prediction.impactLevel === 'medium' && " Monitor for population growth and spread."}
                        {prediction.impactLevel === 'low' && " Regular monitoring is recommended."}
                      </p>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Confidence Visualization */}
      <ConfidenceChart predictions={results.predictions} />
    </div>
  );
}
