import { useEffect, useRef } from "react";

export default function AnimatedBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Set canvas size
    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    // Particle system for Manim-style animations
    class Particle {
      x: number;
      y: number;
      vx: number;
      vy: number;
      size: number;
      hue: number;
      
      constructor() {
        this.x = Math.random() * canvas.width;
        this.y = Math.random() * canvas.height;
        this.vx = (Math.random() - 0.5) * 0.5;
        this.vy = (Math.random() - 0.5) * 0.5;
        this.size = Math.random() * 2 + 1;
        this.hue = Math.random() * 60 + 20; // Orange/gold hues
      }

      update() {
        this.x += this.vx;
        this.y += this.vy;

        // Wrap around edges
        if (this.x < 0) this.x = canvas.width;
        if (this.x > canvas.width) this.x = 0;
        if (this.y < 0) this.y = canvas.height;
        if (this.y > canvas.height) this.y = 0;

        // Gentle oscillation
        this.x += Math.sin(Date.now() * 0.001 + this.y * 0.01) * 0.2;
        this.y += Math.cos(Date.now() * 0.001 + this.x * 0.01) * 0.2;
      }

      draw() {
        ctx.save();
        ctx.globalAlpha = 0.6;
        ctx.fillStyle = `hsl(${this.hue}, 80%, 60%)`;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
      }
    }

    // Vector field visualization
    class VectorField {
      draw() {
        ctx.save();
        ctx.strokeStyle = 'rgba(255, 153, 51, 0.1)';
        ctx.lineWidth = 1;

        const gridSize = 60;
        const time = Date.now() * 0.001;

        for (let x = 0; x < canvas.width; x += gridSize) {
          for (let y = 0; y < canvas.height; y += gridSize) {
            const angle = Math.sin(x * 0.01 + time) + Math.cos(y * 0.01 + time);
            const length = 15;
            
            const endX = x + Math.cos(angle) * length;
            const endY = y + Math.sin(angle) * length;

            ctx.beginPath();
            ctx.moveTo(x, y);
            ctx.lineTo(endX, endY);
            ctx.stroke();

            // Arrow head
            const headLength = 3;
            const headAngle = Math.PI / 6;
            
            ctx.beginPath();
            ctx.moveTo(endX, endY);
            ctx.lineTo(
              endX - headLength * Math.cos(angle - headAngle),
              endY - headLength * Math.sin(angle - headAngle)
            );
            ctx.moveTo(endX, endY);
            ctx.lineTo(
              endX - headLength * Math.cos(angle + headAngle),
              endY - headLength * Math.sin(angle + headAngle)
            );
            ctx.stroke();
          }
        }
        ctx.restore();
      }
    }

    // Initialize particles
    const particles: Particle[] = [];
    const numParticles = 50;
    for (let i = 0; i < numParticles; i++) {
      particles.push(new Particle());
    }

    const vectorField = new VectorField();

    // Animation loop
    function animate() {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Draw vector field
      vectorField.draw();

      // Update and draw particles
      particles.forEach(particle => {
        particle.update();
        particle.draw();
      });

      // Draw connecting lines between nearby particles
      ctx.save();
      ctx.strokeStyle = 'rgba(255, 153, 51, 0.1)';
      ctx.lineWidth = 0.5;
      
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x;
          const dy = particles[i].y - particles[j].y;
          const distance = Math.sqrt(dx * dx + dy * dy);
          
          if (distance < 100) {
            ctx.globalAlpha = (100 - distance) / 100 * 0.2;
            ctx.beginPath();
            ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(particles[j].x, particles[j].y);
            ctx.stroke();
          }
        }
      }
      ctx.restore();

      requestAnimationFrame(animate);
    }

    animate();

    return () => {
      window.removeEventListener('resize', resizeCanvas);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none z-0"
      style={{ background: 'transparent' }}
    />
  );
}
