import { useEffect, useRef } from 'react';

export default function InteractiveSpaceship() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    // Mouse coordinates (start at center)
    const mouse = { x: width / 2, y: height / 2, lastMoved: Date.now() };

    interface TrailParticle {
      x: number;
      y: number;
      alpha: number;
      size: number;
      hue: number;
    }

    const ship = {
      x: width / 2,
      y: height / 2 - 100,
      vx: 0,
      vy: 0,
      angle: 0,
      targetAngle: 0,
      size: 16,
      trail: [] as TrailParticle[],
      speedLimit: 6,
      acceleration: 0.18,
      friction: 0.94,
    };

    const handleMouseMove = (e: MouseEvent) => {
      mouse.x = e.clientX;
      mouse.y = e.clientY;
      mouse.lastMoved = Date.now();
    };

    window.addEventListener('mousemove', handleMouseMove);

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };

    window.addEventListener('resize', handleResize);

    const animate = () => {
      ctx.clearRect(0, 0, width, height);

      const idleTime = Date.now() - mouse.lastMoved;
      let targetX = mouse.x;
      let targetY = mouse.y;

      // 1. Idle / Autopilot mode: Glide in a beautiful double orbit if mouse is idle for > 4.5 seconds
      if (idleTime > 4500) {
        const t = Date.now() * 0.0011;
        // Lissajous curve orbit focused around the center of the viewport
        targetX = width / 2 + Math.sin(t * 1.5) * (width * 0.28);
        targetY = height / 2 + Math.cos(t * 0.8) * (height * 0.22);
      }

      // 2. Physics / Acceleration Logic
      const dx = targetX - ship.x;
      const dy = targetY - ship.y;
      const dist = Math.sqrt(dx * dx + dy * dy);

      if (dist > 8) {
        // Accelerate ship toward target
        const force = Math.min(ship.speedLimit, dist * 0.05);
        ship.vx += (dx / dist) * force * ship.acceleration;
        ship.vy += (dy / dist) * force * ship.acceleration;
      }

      // Apply drag
      ship.vx *= ship.friction;
      ship.vy *= ship.friction;

      // Update position
      ship.x += ship.vx;
      ship.y += ship.vy;

      // Calculate movement angle
      const speed = Math.sqrt(ship.vx * ship.vx + ship.vy * ship.vy);
      if (speed > 0.2) {
        ship.targetAngle = Math.atan2(ship.vy, ship.vx);
      }

      // Smooth angle interpolation (avoid sharp turns)
      let angleDiff = ship.targetAngle - ship.angle;
      while (angleDiff < -Math.PI) angleDiff += Math.PI * 2;
      while (angleDiff > Math.PI) angleDiff -= Math.PI * 2;
      ship.angle += angleDiff * 0.12;

      // 3. Emit glowing trail particles
      if (speed > 0.4) {
        ship.trail.push({
          x: ship.x - Math.cos(ship.angle) * 10,
          y: ship.y - Math.sin(ship.angle) * 10,
          alpha: 1.0,
          size: Math.random() * 2.5 + 0.8,
          // Cosmic color: shifts between cyan, purple, and neon orange based on movement speed
          hue: (Date.now() * 0.1 + speed * 12) % 360,
        });
      }

      if (ship.trail.length > 50) {
        ship.trail.shift();
      }

      // 4. Draw & fade spaceship engine exhaust trail
      ship.trail.forEach((p) => {
        p.alpha -= 0.022;
        p.size = Math.max(0.1, p.size - 0.04);
        if (p.alpha <= 0) return;

        ctx.save();
        ctx.shadowBlur = 8;
        ctx.shadowColor = `hsla(${p.hue}, 100%, 65%, ${p.alpha})`;
        ctx.fillStyle = `hsla(${p.hue}, 100%, 68%, ${p.alpha * 0.72})`;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
      });

      // 5. Draw the beautiful futuristic spaceship (Sleek Winged Delta)
      ctx.save();
      ctx.translate(ship.x, ship.y);
      ctx.rotate(ship.angle);

      // Neon cyan shadow glow around the ship
      ctx.shadowBlur = 10;
      ctx.shadowColor = '#00c6ff';

      // Inner glow fill
      ctx.fillStyle = 'rgba(255, 255, 255, 0.96)';
      ctx.strokeStyle = '#00c6ff';
      ctx.lineWidth = 1.5;

      ctx.beginPath();
      ctx.moveTo(11, 0);          // Nose cone (facing right)
      ctx.lineTo(-7, -5.5);       // Left wingtip
      ctx.lineTo(-4, 0);          // Inner thruster hull
      ctx.lineTo(-7, 5.5);        // Right wingtip
      ctx.closePath();
      ctx.fill();
      ctx.stroke();

      // Mini Engine thruster plume
      ctx.shadowColor = '#7b2fff';
      ctx.shadowBlur = 14;
      ctx.fillStyle = '#7b2fff';
      ctx.beginPath();
      ctx.moveTo(-4, -1.8);
      ctx.lineTo(-10 - Math.random() * 6, 0);
      ctx.lineTo(-4, 1.8);
      ctx.closePath();
      ctx.fill();

      ctx.restore();

      animationFrameId = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100vw',
        height: '100vh',
        pointerEvents: 'none', // Allow clicking elements behind the spaceship
        zIndex: 9999, // Overlay above page components, below interactive overlays
      }}
    />
  );
}
