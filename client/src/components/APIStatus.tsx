import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Activity, Clock, Database } from "lucide-react";
import { useAPIHealth } from "@/hooks/use-species-identification";

export default function APIStatus() {
  const { data: health, isLoading, error } = useAPIHealth();

  const getStatusColor = () => {
    if (error) return "destructive";
    if (isLoading) return "secondary";
    return health?.status === "online" ? "default" : "destructive";
  };

  const getStatusText = () => {
    if (error) return "Offline";
    if (isLoading) return "Checking...";
    return health?.status === "online" ? "Online" : "Offline";
  };

  return (
    <Card className="glassmorphism border-border/50" data-testid="card-api-status">
      <CardContent className="p-6">
        <h3 className="text-lg font-semibold mb-4 flex items-center text-foreground">
          <div className="w-6 h-6 mr-2 text-saffron flex items-center justify-center">
            <span className="text-sm font-bold">J</span>
          </div>
          Julia Backend
        </h3>
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-sm text-muted-foreground flex items-center">
              <Activity className="h-4 w-4 mr-2" />
              API Status
            </span>
            <div className="flex items-center space-x-2">
              {!error && !isLoading && (
                <div className="w-2 h-2 bg-forest rounded-full animate-pulse"></div>
              )}
              <Badge variant={getStatusColor()} data-testid="badge-api-status">
                {getStatusText()}
              </Badge>
            </div>
          </div>
          
          <div className="flex items-center justify-between">
            <span className="text-sm text-muted-foreground flex items-center">
              <Database className="h-4 w-4 mr-2" />
              Model Version
            </span>
            <span className="text-sm font-medium text-foreground" data-testid="text-model-version">
              {health?.modelVersion || "Unknown"}
            </span>
          </div>
          
          <div className="flex items-center justify-between">
            <span className="text-sm text-muted-foreground flex items-center">
              <Clock className="h-4 w-4 mr-2" />
              Response Time
            </span>
            <span className="text-sm font-medium text-saffron" data-testid="text-response-time">
              {health?.responseTime ? `~${health.responseTime}ms` : "N/A"}
            </span>
          </div>
          
          <div className="flex items-center justify-between">
            <span className="text-sm text-muted-foreground">
              Species Database
            </span>
            <span className="text-sm font-medium text-foreground">
              {health?.speciesCount || 196} species
            </span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
