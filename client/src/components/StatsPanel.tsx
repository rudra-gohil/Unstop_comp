import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { BarChart, AlertTriangle, MapPin, TrendingUp } from "lucide-react";
import { useAppStats } from "@/hooks/use-species-identification";

export default function StatsPanel() {
  const { data: stats, isLoading } = useAppStats();

  if (isLoading) {
    return (
      <Card className="glassmorphism border-border/50">
        <CardContent className="p-6">
          <div className="animate-pulse">
            <div className="h-4 bg-secondary rounded w-3/4 mb-4"></div>
            <div className="space-y-4">
              {[1, 2, 3].map((i) => (
                <div key={i} className="flex justify-between">
                  <div className="h-3 bg-secondary rounded w-1/2"></div>
                  <div className="h-3 bg-secondary rounded w-1/4"></div>
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="glassmorphism border-border/50" data-testid="card-stats">
      <CardContent className="p-6">
        <h3 className="text-lg font-semibold mb-4 flex items-center text-foreground">
          <BarChart className="text-gold mr-2 h-5 w-5" />
          Conservation Stats
        </h3>
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <span className="text-muted-foreground flex items-center">
              <TrendingUp className="h-4 w-4 mr-2" />
              Species Identified
            </span>
            <span className="font-bold text-saffron" data-testid="text-total-identifications">
              {stats?.totalIdentifications.toLocaleString() || 0}
            </span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-muted-foreground flex items-center">
              <AlertTriangle className="h-4 w-4 mr-2" />
              Active Threats
            </span>
            <span className="font-bold text-destructive" data-testid="text-active-threats">
              {stats?.activeThreats || 196}
            </span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-muted-foreground flex items-center">
              <MapPin className="h-4 w-4 mr-2" />
              Regions Covered
            </span>
            <span className="font-bold text-forest" data-testid="text-regions-covered">
              {stats?.regionsCovered || 0}
            </span>
          </div>
          <div className="mt-4">
            <div className="flex justify-between text-sm mb-2">
              <span className="text-muted-foreground">Conservation Progress</span>
              <span className="text-saffron font-medium">{stats?.conservationProgress || 0}%</span>
            </div>
            <Progress 
              value={stats?.conservationProgress || 0} 
              className="h-2"
              data-testid="progress-conservation"
            />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
