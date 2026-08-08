import type { CSSProperties } from "react";

const PARTICLES = [
  { left: "6%", top: "18%", size: 6, delay: "0s", duration: "16s", driftX: "10px", driftY: "-26px" },
  { left: "14%", top: "62%", size: 4, delay: "1.4s", duration: "20s", driftX: "-14px", driftY: "-34px" },
  { left: "22%", top: "34%", size: 3, delay: "2.8s", duration: "15s", driftX: "8px", driftY: "-20px" },
  { left: "31%", top: "80%", size: 5, delay: "0.6s", duration: "18s", driftX: "-10px", driftY: "-30px" },
  { left: "40%", top: "12%", size: 4, delay: "3.6s", duration: "22s", driftX: "14px", driftY: "-24px" },
  { left: "49%", top: "48%", size: 6, delay: "1.9s", duration: "17s", driftX: "-8px", driftY: "-28px" },
  { left: "58%", top: "70%", size: 3, delay: "0.3s", duration: "19s", driftX: "12px", driftY: "-22px" },
  { left: "66%", top: "24%", size: 5, delay: "2.2s", duration: "21s", driftX: "-12px", driftY: "-32px" },
  { left: "74%", top: "56%", size: 4, delay: "4.1s", duration: "16s", driftX: "9px", driftY: "-26px" },
  { left: "82%", top: "16%", size: 3, delay: "1.1s", duration: "18s", driftX: "-11px", driftY: "-24px" },
  { left: "90%", top: "68%", size: 5, delay: "3.3s", duration: "20s", driftX: "13px", driftY: "-30px" },
  { left: "10%", top: "88%", size: 4, delay: "2.5s", duration: "17s", driftX: "-9px", driftY: "-22px" },
  { left: "94%", top: "40%", size: 3, delay: "0.9s", duration: "19s", driftX: "10px", driftY: "-28px" },
  { left: "37%", top: "92%", size: 6, delay: "3.9s", duration: "15s", driftX: "-13px", driftY: "-20px" },
  { left: "55%", top: "6%", size: 4, delay: "1.6s", duration: "22s", driftX: "11px", driftY: "-32px" },
];

export function ParticleField() {
  return (
    <div className="particle-field" aria-hidden="true">
      {PARTICLES.map((particle, index) => (
        <span
          key={index}
          className="particle"
          style={
            {
              left: particle.left,
              top: particle.top,
              width: particle.size,
              height: particle.size,
              animationDelay: particle.delay,
              animationDuration: particle.duration,
              "--drift-x": particle.driftX,
              "--drift-y": particle.driftY,
            } as CSSProperties
          }
        />
      ))}
    </div>
  );
}
