"use client";

import { useEffect, useState } from "react";
import { gsap } from "gsap";
import confetti from "canvas-confetti";
import { Howl } from "howler";

function NoButton({ btn, idx, chaosMove, hoveredStates, setHoveredStates }) {
  return (
    <button
      className="btn no"
      style={{
        scale: btn.size,
        position: btn.isChaos ? "fixed" : "relative",
        marginTop: btn.isChaos ? 0 : "10px",
      }}
      onMouseEnter={(e) => {
        const copy = [...hoveredStates];
        copy[idx] = true;
        setHoveredStates(copy);
        chaosMove(e, idx, false); // hover triggers chaos move
      }}
      onMouseLeave={() => {
        const copy = [...hoveredStates];
        copy[idx] = false;
        setHoveredStates(copy);
      }}
      onClick={(e) => chaosMove(e, idx, true)}
    >
      {hoveredStates[idx] ? "No 😈" : "No 😈"}
    </button>
  );
}

export default function Home() {
  const [answer, setAnswer] = useState(null);
  const [chaosCount, setChaosCount] = useState(0);
  const [yesButtons, setYesButtons] = useState(1);
  const [yesScale, setYesScale] = useState(1); // shared scale for all Yes buttons
  const [noButtons, setNoButtons] = useState([
    { id: 1, size: 1, isChaos: false },
  ]);
  const [hoveredStates, setHoveredStates] = useState([false]);
  const [flood, setFlood] = useState(false);

  const clapSound = new Howl({
    src: ["/clap.mp3"],
    volume: 1.0,
  });

  useEffect(() => {
    const saved = localStorage.getItem("valentine-answer");
    if (saved) setAnswer(saved);
  }, []);

  useEffect(() => {
    // grow Yes buttons pre-flood
    if (chaosCount >= 3 && chaosCount < 10) setYesButtons((prev) => prev + 0.4);

    // spawn new No buttons matching Yes scale
    if (chaosCount === 9) {
      setNoButtons([
        { id: 1, size: yesScale, isChaos: false },
        { id: 2, size: yesScale, isChaos: false },
      ]);
      setHoveredStates([false, false]);
    }

    if (chaosCount >= 30) setFlood(true);
  }, [chaosCount, yesScale]);

  const megaExplosion = () => {
    setYesButtons(0);
    localStorage.setItem("valentine-answer", "yes");
    setAnswer("yes");
    clapSound.play();

    const duration = 4000;
    const end = Date.now() + duration;

    (function frame() {
      confetti({
        particleCount: 30,
        spread: 180,
        origin: { x: Math.random(), y: Math.random() - 0.2 },
      });
      if (Date.now() < end) requestAnimationFrame(frame);
    })();
  };

  const chaosMove = (event, btnIndex, force = true) => {
    const button = event.currentTarget;
    const rect = button.getBoundingClientRect();
    const margin = 400;

    // Update No buttons
    setNoButtons((prev) => {
      const updated = [...prev];
      if (force || !updated[btnIndex].isChaos) updated[btnIndex].isChaos = true;

      // bigger random scale change for No buttons
      updated[btnIndex].size = Math.random() * 0.6 + 0.7;
      return updated;
    });

    // Increment shared Yes scale
    setYesScale((prev) => prev + 0.005);

    // Continue moving button
    const maxX = window.innerWidth - rect.width - margin;
    const maxY = window.innerHeight - rect.height - margin;
    const newX = Math.random() * maxX + margin / 2;
    const newY = Math.random() * maxY + margin / 2;

    gsap.to(button, {
      position: "fixed",
      left: newX,
      top: newY,
      rotate: Math.random() * 360,
      scale: Math.random() * 0.6 + 0.7,
      duration: 0.3,
      ease: "power2.out",
    });

    setChaosCount((prev) => prev + 1);
  };

  const resetGame = () => {
    localStorage.removeItem("valentine-answer");
    setAnswer(null);
    setChaosCount(0);
    setYesButtons(1);
    setYesScale(1);
    setNoButtons([{ id: 1, size: 1, isChaos: false }]);
    setHoveredStates([false]);
    setFlood(false);
  };

  if (answer === "yes") {
    return (
      <main className="main explosion-screen">
        <div className="card success-pop">
          <h1>
            Thank you for choosing this answer beautiful. <br />I will see you
            Saturday. 💖
          </h1>
          <button
            className="btn yes"
            onClick={resetGame}
            style={{ marginTop: "20px" }}
          >
            Try Again 🔄
          </button>
        </div>
      </main>
    );
  }

  const floodCount = 21;
  const floodFontSize = Math.max(12, Math.min(20, 180 / Math.sqrt(floodCount)));

  return (
    <main className="main">
      <div className="card">
        <h1>Will Saloni Sookram be my (Jordan of the Lake) Valentine? 💌</h1>

        <div
          className="buttons"
          style={{
            display: flood ? "grid" : "flex",
            flexWrap: flood ? undefined : "wrap",
            justifyContent: "center",
            gap: "5px",
            gridTemplateColumns: flood ? "repeat(3, 1fr)" : undefined,
          }}
        >
          {/* YES BUTTONS */}
          {Array.from({ length: yesButtons }).map((_, i) => (
            <button
              key={"yes" + i}
              className="btn yes"
              onClick={megaExplosion}
              style={{ scale: yesScale }}
            >
              Yes 💖
            </button>
          ))}

          {/* FLOOD */}
          {flood &&
            Array.from({ length: floodCount }).map((_, i) => (
              <button
                key={"flood" + i}
                className="btn yes flood"
                onClick={megaExplosion}
                style={{
                  fontSize: `${floodFontSize}px`,
                  width: "95%",
                  height: `${floodFontSize * 1.5}px`,
                  boxSizing: "border-box",
                  scale: yesScale,
                }}
              >
                Yes 💖
              </button>
            ))}

          {/* NO BUTTONS */}
          {noButtons.map((btn, idx) => (
            <NoButton
              key={btn.id}
              btn={btn}
              idx={idx}
              chaosMove={chaosMove}
              hoveredStates={hoveredStates}
              setHoveredStates={setHoveredStates}
            />
          ))}
        </div>
      </div>
    </main>
  );
}
