import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { History, Sprout, Bug, Clock } from "lucide-react";
import { useRecentReports } from "@/hooks/use-species-identification";
import { formatDistanceToNow } from "date-fns";

export default function RecentActivity() {
  const { data: reports, isLoading } = useRecentReports();

  if (isLoading) {
    return (
      <Card className="glassmorphism border-border/50">
        <CardContent className="p-6">
          <h3 className="text-lg font-semibold mb-4 flex items-center">
            <History className="text-forest mr-2" />
            Recent Activity
          </h3>
          <div className="space-y-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="animate-pulse flex items-center space-x-3 p-3 bg-secondary/50 rounded-lg">
                <div className="w-8 h-8 bg-secondary rounded-full"></div>
                <div className="flex-1">
                  <div className="h-4 bg-secondary rounded w-3/4 mb-1"></div>
                  <div className="h-3 bg-secondary rounded w-1/2"></div>
                </div>
                <div className="w-12 h-3 bg-secondary rounded"></div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="glassmorphism border-border/50" data-testid="card-recent-activity">
      <CardContent className="p-6">
        <h3 className="text-lg font-semibold mb-4 flex items-center text-foreground">
          <History className="text-forest mr-2" />
          Recent Activity
        </h3>
        <div className="space-y-3">
          {reports?.length > 0 ? (
            reports.slice(0, 5).map((report: any, index: number) => (
              <div 
                key={report.id} 
                className="flex items-center space-x-3 p-3 bg-secondary/50 rounded-lg hover:bg-secondary/70 transition-colors"
                data-testid={`activity-item-${index}`}
              >
                <div className="w-8 h-8 bg-gradient-to-br from-saffron/20 to-forest/20 rounded-full flex items-center justify-center">
                  {report.speciesName?.toLowerCase().includes('plant') || 
                   report.speciesName?.toLowerCase().includes('ivy') ||
                   report.speciesName?.toLowerCase().includes('kudzu') ? (
                    <Sprout className="text-xs text-saffron h-3 w-3" />
                  ) : (
                    <Bug className="text-xs text-saffron h-3 w-3" />
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium truncate text-foreground" data-testid={`activity-species-${index}`}>
                    {report.speciesName}
                  </p>
                  <p className="text-xs text-muted-foreground truncate" data-testid={`activity-location-${index}`}>
                    {report.location}
                  </p>
                </div>
                <div className="flex items-center text-xs text-muted-foreground">
                  <Clock className="h-3 w-3 mr-1" />
                  <span data-testid={`activity-time-${index}`}>
                    {formatDistanceToNow(new Date(report.createdAt), { addSuffix: true })}
                  </span>
                </div>
              </div>
            ))
          ) : (
            <div className="text-center py-8 text-muted-foreground">
              <History className="h-12 w-12 mx-auto mb-2 text-saffron/50" />
              <p>No recent activity</p>
              <p className="text-sm">Submit a report to see activity here</p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
