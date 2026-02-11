"use client";

import { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import confetti from "canvas-confetti";
import { Howl } from "howler";

export default function Home() {
  const [answer, setAnswer] = useState(null);
  const [yesScale, setYesScale] = useState(1);
  const [noText, setNoText] = useState("No 😈");

  const noRef = useRef(null);
  const containerRef = useRef(null);

  const clapSound = new Howl({
    src: ["/clap.mp3"],
    volume: 1.0,
  });

  useEffect(() => {
    const saved = localStorage.getItem("valentine-answer");
    if (saved) setAnswer(saved);
  }, []);

  const chaosMove = () => {
    const container = containerRef.current;
    const button = noRef.current;
    if (!container || !button) return;

    const rect = container.getBoundingClientRect();

    const randomX = Math.random() * (rect.width - 150) - rect.width / 2;
    const randomY = Math.random() * (rect.height - 150) - rect.height / 2;

    gsap.to(button, {
      x: randomX,
      y: randomY,
      rotate: Math.random() * 360,
      scale: Math.random() * 0.7 + 0.4,
      duration: 0.3,
      ease: "power3.out",
    });

    setYesScale((prev) => prev + 0.1);
  };

  const handleHover = () => {
    setNoText("Yes 💖");
    chaosMove();
  };

  const handleLeave = () => {
    setNoText("No 😈");
  };

  const megaExplosion = () => {
    localStorage.setItem("valentine-answer", "yes");
    setAnswer("yes");

    clapSound.play();

    // Screen shake
    gsap.fromTo(
      containerRef.current,
      { x: -10 },
      { x: 10, duration: 0.1, repeat: 15, yoyo: true },
    );

    // Fireworks burst spam
    const duration = 3000;
    const end = Date.now() + duration;

    (function frame() {
      confetti({
        particleCount: 8,
        angle: 60,
        spread: 100,
        origin: { x: 0 },
      });
      confetti({
        particleCount: 8,
        angle: 120,
        spread: 100,
        origin: { x: 1 },
      });

      if (Date.now() < end) {
        requestAnimationFrame(frame);
      }
    })();

    // Massive center explosion
    confetti({
      particleCount: 200,
      spread: 180,
      origin: { y: 0.6 },
    });
  };

  if (answer === "yes") {
    return (
      <main className="main explosion-screen">
        <div className="card success-pop">
          <h1>
            Thank you for choosing this answer beautiful. <br />I will see you
            Saturday. 💖
          </h1>
        </div>
      </main>
    );
  }

  return (
    <main className="main" ref={containerRef}>
      <div className="card">
        <h1>Will Saloni Sookram be my (Jordan of the Lake) Valentine? 💌</h1>

        <div className="buttons">
          <button
            className="btn yes"
            style={{ transform: `scale(${yesScale})` }}
            onClick={megaExplosion}
          >
            Yes 💖
          </button>

          <button
            ref={noRef}
            className="btn no"
            onMouseEnter={handleHover}
            onMouseLeave={handleLeave}
          >
            {noText}
          </button>
        </div>
      </div>
    </main>
  );
}
