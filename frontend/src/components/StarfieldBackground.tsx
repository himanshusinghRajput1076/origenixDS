import { useEffect, useRef } from 'react';

export default function StarfieldBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    // Mouse targets for smooth parallax drift
    const mouse = { x: width / 2, y: height / 2, tx: width / 2, ty: height / 2 };

    // Physics variables for dragging and momentum panning
    let isDragging = false;
    const dragStart = { x: 0, y: 0 };
    const dragOffset = { x: 0, y: 0, tx: 0, ty: 0 };

    interface Star {
      x: number;
      y: number;
      size: number;
      alpha: number;
      speed: number;
      twinkleSpeed: number;
      twinkleDir: number;
      colorIndex: number; // For slight cosmic color variation in light mode
    }

    interface Spaceship {
      x: number;
      y: number;
      vx: number;
      vy: number;
      angle: number;
      size: number;
      nextLaunchTime: number;
      active: boolean;
      trail: { x: number; y: number; alpha: number; size: number }[];
    }

    const stars: Star[] = [];
    const starCount = Math.min(220, Math.floor((width * height) / 7500));

    for (let i = 0; i < starCount; i++) {
      stars.push({
        x: Math.random() * width,
        y: Math.random() * height,
        size: Math.random() * 1.4 + 0.4,
        alpha: Math.random() * 0.85 + 0.15,
        speed: Math.random() * 0.05 + 0.015,
        twinkleSpeed: Math.random() * 0.012 + 0.004,
        twinkleDir: Math.random() > 0.5 ? 1 : -1,
        colorIndex: Math.floor(Math.random() * 3),
      });
    }

    const spaceship: Spaceship = {
      x: -50,
      y: 0,
      vx: 0,
      vy: 0,
      angle: 0,
      size: 14,
      nextLaunchTime: Date.now() + 4000,
      active: false,
      trail: [],
    };

    const handleMouseDown = (e: MouseEvent) => {
      isDragging = true;
      dragStart.x = e.clientX;
      dragStart.y = e.clientY;
    };

    const handleTouchStart = (e: TouchEvent) => {
      if (e.touches.length > 0) {
        isDragging = true;
        dragStart.x = e.touches[0].clientX;
        dragStart.y = e.touches[0].clientY;
      }
    };

    const handleMouseMove = (e: MouseEvent) => {
      mouse.tx = e.clientX;
      mouse.ty = e.clientY;

      if (isDragging) {
        const dx = e.clientX - dragStart.x;
        const dy = e.clientY - dragStart.y;
        dragOffset.tx += dx;
        dragOffset.ty += dy;
        dragStart.x = e.clientX;
        dragStart.y = e.clientY;
      }
    };

    const handleTouchMove = (e: TouchEvent) => {
      if (e.touches.length > 0) {
        mouse.tx = e.touches[0].clientX;
        mouse.ty = e.touches[0].clientY;
      }

      if (isDragging && e.touches.length > 0) {
        const dx = e.touches[0].clientX - dragStart.x;
        const dy = e.touches[0].clientY - dragStart.y;
        dragOffset.tx += dx;
        dragOffset.ty += dy;
        dragStart.x = e.touches[0].clientX;
        dragStart.y = e.touches[0].clientY;
      }
    };

    const handleMouseUp = () => {
      isDragging = false;
    };

    const handleTouchEnd = () => {
      isDragging = false;
    };

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };

    window.addEventListener('mousedown', handleMouseDown);
    window.addEventListener('touchstart', handleTouchStart, { passive: true });
    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('touchmove', handleTouchMove, { passive: true });
    window.addEventListener('mouseup', handleMouseUp);
    window.addEventListener('touchend', handleTouchEnd);
    window.addEventListener('mouseleave', handleMouseUp);
    window.addEventListener('resize', handleResize);

    const animate = () => {
      // 0. Detect active theme
      const isLightTheme = 
        document.body.getAttribute('data-theme') === 'light' || 
        document.documentElement.getAttribute('data-theme') === 'light' ||
        document.querySelector('[data-theme="light"]') !== null;

      // Draw background based on theme
      if (isLightTheme) {
        // Soft glowing light-mode gradient (indigo-to-lavender drift)
        const grad = ctx.createRadialGradient(
          width / 2, height / 2, 10,
          width / 2, height / 2, Math.max(width, height)
        );
        grad.addColorStop(0, '#f9fafb'); // pure grey-white center
        grad.addColorStop(0.5, '#f3f4f6'); // soft neutral grey
        grad.addColorStop(1, '#e5e7eb'); // light border tint
        ctx.fillStyle = grad;
      } else {
        // Pristine pitch-black space for maximum contrast
        ctx.fillStyle = '#000000';
      }
      ctx.fillRect(0, 0, width, height);

      // Interpolate mouse coordinates smoothly for 3D parallax drift
      mouse.x += (mouse.tx - mouse.x) * 0.055;
      mouse.y += (mouse.ty - mouse.y) * 0.055;

      const dx = (mouse.x - width / 2) / (width / 2);
      const dy = (mouse.y - height / 2) / (height / 2);

      // Interpolate dragOffset coordinates smoothly for spring panning momentum
      dragOffset.x += (dragOffset.tx - dragOffset.x) * 0.075;
      dragOffset.y += (dragOffset.ty - dragOffset.y) * 0.075;

      // Friction decay so momentum slows down smoothly after dragging stops
      if (!isDragging) {
        dragOffset.tx *= 0.95;
        dragOffset.ty *= 0.95;
      }

      // 1. Draw Stars
      stars.forEach((star) => {
        // Update natural falling velocity
        star.y += star.speed;
        if (star.y > height) {
          star.y = 0;
          star.x = Math.random() * width;
        }

        // Twinkling logic
        star.alpha += star.twinkleSpeed * star.twinkleDir;
        if (star.alpha >= 0.95) {
          star.alpha = 0.95;
          star.twinkleDir = -1;
        } else if (star.alpha <= 0.15) {
          star.alpha = 0.15;
          star.twinkleDir = 1;
        }

        // Parallax and drag offset (larger stars shift further, creating a depth illusion)
        // Add a giant offset multiple of width/height to avoid negative numbers modulo wrap issues
        const renderX = (star.x - dx * star.size * 32 + dragOffset.x * star.size * 0.55 + width * 10) % width;
        const renderY = (star.y - dy * star.size * 32 + dragOffset.y * star.size * 0.55 + height * 10) % height;

        if (isLightTheme) {
          // In Light Theme, render glowing dark indigo/purple star particles
          const colors = [
            `rgba(0, 82, 204, ${star.alpha * 0.7})`, // Royal Blue
            `rgba(123, 47, 255, ${star.alpha * 0.75})`, // Indigo
            `rgba(6, 182, 212, ${star.alpha * 0.7})`, // Deep Cyan
          ];
          ctx.fillStyle = colors[star.colorIndex];
        } else {
          // In Dark Theme, render glowing white stellar stars
          ctx.fillStyle = `rgba(255, 255, 255, ${star.alpha})`;
        }

        ctx.beginPath();
        ctx.arc(renderX, renderY, star.size, 0, Math.PI * 2);
        ctx.fill();
      });

      // 2. Spaceship Spawn Logic (Escort background spacecraft)
      if (!spaceship.active && Date.now() > spaceship.nextLaunchTime) {
        spaceship.active = true;
        const startFromLeft = Math.random() > 0.4;
        if (startFromLeft) {
          spaceship.x = -50;
          spaceship.vx = Math.random() * 1.5 + 0.8;
          spaceship.angle = (Math.random() - 0.5) * 0.22;
        } else {
          spaceship.x = width + 50;
          spaceship.vx = -(Math.random() * 1.5 + 0.8);
          spaceship.angle = Math.PI + (Math.random() - 0.5) * 0.22;
        }
        spaceship.y = Math.random() * (height * 0.6) + (height * 0.2);
        spaceship.vy = Math.sin(spaceship.angle) * Math.abs(spaceship.vx);
        spaceship.vx = Math.cos(spaceship.angle) * Math.abs(spaceship.vx);
        spaceship.trail = [];
      }

      // 3. Spaceship Update and Render
      if (spaceship.active) {
        spaceship.x += spaceship.vx;
        spaceship.y += spaceship.vy;

        // Space parallax on the background ship plus drag offset
        const shipRenderX = spaceship.x - dx * 8 + dragOffset.x * 0.2;
        const shipRenderY = spaceship.y - dy * 8 + dragOffset.y * 0.2;

        // Push trail particle
        spaceship.trail.push({
          x: shipRenderX - Math.cos(spaceship.angle) * 8,
          y: shipRenderY - Math.sin(spaceship.angle) * 8,
          alpha: 1.0,
          size: Math.random() * 2.0 + 0.6,
        });

        if (spaceship.trail.length > 30) {
          spaceship.trail.shift();
        }

        // Draw trail
        spaceship.trail.forEach((p, idx) => {
          p.alpha -= 0.03;
          p.size = Math.max(0.1, p.size - 0.05);
          if (p.alpha <= 0) return;

          const ratio = idx / spaceship.trail.length;
          if (isLightTheme) {
            // Soft purple trail on light mode
            ctx.fillStyle = `rgba(123, 47, 255, ${p.alpha * 0.45})`;
          } else {
            // Bright neon cyan glow trail on dark mode
            const hue = ratio * 60 + 190;
            ctx.fillStyle = `hsla(${hue}, 100%, 70%, ${p.alpha * 0.6})`;
          }
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
          ctx.fill();
        });

        // Draw spaceship body
        ctx.save();
        ctx.translate(shipRenderX, shipRenderY);
        ctx.rotate(spaceship.angle);

        if (isLightTheme) {
          // Sleek dark purple winged silhouette
          ctx.shadowBlur = 6;
          ctx.shadowColor = '#7b2fff';
          ctx.fillStyle = '#7b2fff';
          ctx.strokeStyle = '#4c9aff';
          ctx.lineWidth = 1.0;
        } else {
          // Sleek bright cyan spaceship silhouette
          ctx.shadowBlur = 8;
          ctx.shadowColor = '#00c6ff';
          ctx.fillStyle = 'rgba(255, 255, 255, 0.95)';
          ctx.strokeStyle = '#00c6ff';
          ctx.lineWidth = 1.2;
        }

        ctx.beginPath();
        ctx.moveTo(8, 0);
        ctx.lineTo(-5, -4);
        ctx.lineTo(-2, 0);
        ctx.lineTo(-5, 4);
        ctx.closePath();
        ctx.fill();
        ctx.stroke();

        // Thruster exhaust flame
        ctx.shadowBlur = 10;
        ctx.shadowColor = isLightTheme ? '#ff00c6' : '#ff5500';
        ctx.fillStyle = isLightTheme ? '#ff00c6' : '#ff9f00';
        ctx.beginPath();
        ctx.moveTo(-2, -1.2);
        ctx.lineTo(-8 - Math.random() * 5, 0);
        ctx.lineTo(-2, 1.2);
        ctx.closePath();
        ctx.fill();

        ctx.restore();

        // Deactivate if flies far off-screen
        if (
          spaceship.x > width + 100 ||
          spaceship.x < -100 ||
          spaceship.y > height + 100 ||
          spaceship.y < -100
        ) {
          spaceship.active = false;
          // Spawn next shuttle in 12 to 24 seconds
          spaceship.nextLaunchTime = Date.now() + Math.random() * 12000 + 12000;
        }
      }

      animationFrameId = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('mousedown', handleMouseDown);
      window.removeEventListener('touchstart', handleTouchStart);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('touchmove', handleTouchMove);
      window.removeEventListener('mouseup', handleMouseUp);
      window.removeEventListener('touchend', handleTouchEnd);
      window.removeEventListener('mouseleave', handleMouseUp);
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      style={{
        display: 'block',
        width: '100%',
        height: '100%',
        cursor: 'grab',
      }}
      onMouseDown={(e) => (e.currentTarget.style.cursor = 'grabbing')}
      onMouseUp={(e) => (e.currentTarget.style.cursor = 'grab')}
    />
  );
}
