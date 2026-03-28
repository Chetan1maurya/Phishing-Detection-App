import { useEffect, useRef } from "react";
import "../styles/welcome.css";

// ─── Star Canvas ──────────────────────────────────────────────────────────────

function StarCanvas() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    let animId;

    // Resize canvas to fill window
    const resize = () => {
      canvas.width  = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener("resize", resize);

    // Generate stars
    const STAR_COUNT = 220;
    const stars = Array.from({ length: STAR_COUNT }, () => ({
      x:       Math.random() * window.innerWidth,
      y:       Math.random() * window.innerHeight,
      r:       Math.random() * 1.4 + 0.2,
      speed:   Math.random() * 0.25 + 0.05,
      opacity: Math.random() * 0.7 + 0.2,
      twinkle: Math.random() * Math.PI * 2, // phase offset
    }));

    // A few bigger "shooting" particles
    const DRIFT_COUNT = 18;
    const drifters = Array.from({ length: DRIFT_COUNT }, () => ({
      x:       Math.random() * window.innerWidth,
      y:       Math.random() * window.innerHeight,
      r:       Math.random() * 0.8 + 0.3,
      speedX:  (Math.random() - 0.5) * 0.3,
      speedY:  Math.random() * 0.4 + 0.1,
      opacity: Math.random() * 0.4 + 0.1,
      color:   Math.random() > 0.6 ? "#00c8ff" : "#ffffff",
    }));

    let frame = 0;

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      frame++;

      // Draw twinkling stars
      stars.forEach((s) => {
        s.y -= s.speed;
        if (s.y < -2) {
          s.y = canvas.height + 2;
          s.x = Math.random() * canvas.width;
        }
        const twinkle = 0.5 + 0.5 * Math.sin(frame * 0.02 + s.twinkle);
        ctx.beginPath();
        ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255,255,255,${s.opacity * twinkle})`;
        ctx.fill();
      });

      // Draw cyan drifting particles
      drifters.forEach((d) => {
        d.x += d.speedX;
        d.y -= d.speedY;
        if (d.y < -4) {
          d.y = canvas.height + 4;
          d.x = Math.random() * canvas.width;
        }
        if (d.x < -4) d.x = canvas.width + 4;
        if (d.x > canvas.width + 4) d.x = -4;

        // Glow effect
        const gradient = ctx.createRadialGradient(d.x, d.y, 0, d.x, d.y, d.r * 4);
        gradient.addColorStop(0, d.color === "#00c8ff"
          ? `rgba(0,200,255,${d.opacity})`
          : `rgba(255,255,255,${d.opacity})`);
        gradient.addColorStop(1, "transparent");

        ctx.beginPath();
        ctx.arc(d.x, d.y, d.r * 4, 0, Math.PI * 2);
        ctx.fillStyle = gradient;
        ctx.fill();

        ctx.beginPath();
        ctx.arc(d.x, d.y, d.r, 0, Math.PI * 2);
        ctx.fillStyle = d.color;
        ctx.fill();
      });

      animId = requestAnimationFrame(draw);
    };

    draw();

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener("resize", resize);
    };
  }, []);

  return <canvas ref={canvasRef} className="star-canvas" />;
}

// ─── Shield SVG ───────────────────────────────────────────────────────────────

function ShieldIcon() {
  return (
    <div className="welcome-icon">
      <svg width="72" height="72" viewBox="0 0 72 72" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path
          d="M36 6L10 18v18c0 15.9 11.1 30.8 26 34.6C51 66.8 62 51.9 62 36V18L36 6z"
          fill="rgba(0,200,255,0.08)"
          stroke="#00c8ff"
          strokeWidth="1.8"
        />
        <path
          d="M25 36l8 8 14-14"
          stroke="#00c8ff"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <circle cx="36" cy="36" r="30" stroke="rgba(0,200,255,0.12)" strokeWidth="1" />
      </svg>
    </div>
  );
}

// ─── Welcome Page ─────────────────────────────────────────────────────────────

export default function WelcomePage({ onLogin, onSignup }) {
  return (
    <div className="welcome-page">
      <StarCanvas />

      <div className="welcome-content">
        <ShieldIcon />

        <h1 className="welcome-title">
          Welcome to <span>Phishing</span> Detection App
        </h1>

        <p className="welcome-subtitle">
          Powered by Machine Learning · 93.17% Accuracy · Real-time Analysis
        </p>

        <div className="welcome-buttons">
          <button className="btn btn-primary" onClick={onSignup}>
            Sign Up
          </button>
          <button className="btn btn-outline" onClick={onLogin}>
            Log In
          </button>
        </div>
      </div>
    </div>
  );
}