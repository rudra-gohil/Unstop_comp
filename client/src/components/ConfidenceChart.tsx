import { useEffect, useRef } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { TrendingUp } from "lucide-react";

interface ConfidenceChartProps {
  predictions: Array<{
    species: string;
    confidence: number;
    scientificName: string;
  }>;
}

export default function ConfidenceChart({ predictions }: ConfidenceChartProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || !predictions.length) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Set canvas size
    canvas.width = canvas.offsetWidth * 2; // High DPI
    canvas.height = canvas.offsetHeight * 2;
    ctx.scale(2, 2);

    const width = canvas.offsetWidth;
    const height = canvas.offsetHeight;

    // Julia/Makie-inspired scatter plot animation
    const animateChart = () => {
      ctx.clearRect(0, 0, width, height);

      // Background grid
      ctx.strokeStyle = 'rgba(255, 153, 51, 0.1)';
      ctx.lineWidth = 1;
      const gridSize = 40;
      
      for (let x = 0; x <= width; x += gridSize) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, height);
        ctx.stroke();
      }
      
      for (let y = 0; y <= height; y += gridSize) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(width, y);
        ctx.stroke();
      }

      // Draw predictions as animated scatter points
      predictions.forEach((prediction, index) => {
        const x = (index + 1) * (width / (predictions.length + 1));
        const y = height - (prediction.confidence * height * 0.8) - 40;
        const size = 8 + prediction.confidence * 12;
        
        // Animated glow effect
        const time = Date.now() * 0.003;
        const pulse = Math.sin(time + index) * 0.3 + 0.7;
        
        // Outer glow
        const gradient = ctx.createRadialGradient(x, y, 0, x, y, size * 2);
        gradient.addColorStop(0, `hsla(${28 + index * 20}, 80%, 60%, ${pulse * 0.6})`);
        gradient.addColorStop(1, 'transparent');
        
        ctx.fillStyle = gradient;
        ctx.beginPath();
        ctx.arc(x, y, size * 2, 0, Math.PI * 2);
        ctx.fill();

        // Main point
        ctx.fillStyle = `hsl(${28 + index * 20}, 80%, 60%)`;
        ctx.beginPath();
        ctx.arc(x, y, size * pulse, 0, Math.PI * 2);
        ctx.fill();

        // Confidence percentage
        ctx.fillStyle = '#ffffff';
        ctx.font = '12px Inter, sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText(`${(prediction.confidence * 100).toFixed(1)}%`, x, y - size - 10);

        // Species name
        ctx.fillStyle = '#9ca3af';
        ctx.font = '10px Inter, sans-serif';
        ctx.fillText(prediction.species.replace('_', ' '), x, y + size + 20);
      });

      // Confidence trend line
      if (predictions.length > 1) {
        ctx.strokeStyle = 'rgba(255, 153, 51, 0.6)';
        ctx.lineWidth = 2;
        ctx.beginPath();
        
        predictions.forEach((prediction, index) => {
          const x = (index + 1) * (width / (predictions.length + 1));
          const y = height - (prediction.confidence * height * 0.8) - 40;
          
          if (index === 0) {
            ctx.moveTo(x, y);
          } else {
            ctx.lineTo(x, y);
          }
        });
        
        ctx.stroke();
      }

      requestAnimationFrame(animateChart);
    };

    animateChart();
  }, [predictions]);

  return (
    <Card className="glassmorphism border-border/50 julia-scatter">
      <CardContent className="p-6">
        <h3 className="text-lg font-semibold mb-4 flex items-center">
          <TrendingUp className="text-gold mr-2" />
          Confidence Distribution
        </h3>
        <div className="relative">
          <canvas
            ref={canvasRef}
            className="w-full h-64 rounded-lg"
            style={{ background: 'rgba(0,0,0,0.2)' }}
            data-testid="canvas-confidence-chart"
          />
          {predictions.length === 0 && (
            <div className="absolute inset-0 flex items-center justify-center text-muted-foreground">
              <div className="text-center">
                <TrendingUp className="h-12 w-12 mx-auto mb-2 text-saffron" />
                <p>Julia Makie-style visualization</p>
                <p className="text-sm">Upload an image to see results</p>
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
