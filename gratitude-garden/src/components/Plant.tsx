import { useMemo } from "react";

export type PlantStage = "seed" | "sprout" | "sapling" | "bloom";

interface PlantProps {
  seed: string;
  stage: PlantStage;
  word?: string;
  date?: string;
}

// stable seeded randomness
function hash(str: string) {
  let h = 2166136261;
  for (let i = 0; i < str.length; i++) {
    h ^= str.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return () => {
    h += 0x6d2b79f5;
    let t = h;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

export function Plant({ seed, stage, word, date }: PlantProps) {
  const rng = useMemo(() => hash(seed), [seed]);

  const tilt = (rng() - 0.5) * 10;
  const curve = (rng() - 0.5) * 12;
  const offset = rng() * 6;

  const height = {
    seed: 20,
    sprout: 55,
    sapling: 75,
    bloom: 95,
  }[stage];

  return (
    <div
  className="plant-animate"
  style={{
    transform: `rotate(${tilt}deg) translateY(${offset}px)`,
    animationDelay: `${rng() * 5}s`, // 🌿 random timing
  }}
      title={word}
    >
      <svg width="30" height={height} viewBox={`0 0 70 ${height}`}>
        
        {/* Seed */}
        {stage === "seed" && (
          <ellipse cx="35" cy={height - 5} rx="7" ry="4" fill="#5c3d2e" />
        )}

        {/* Stem */}
        {stage !== "seed" && (
          <path
            d={`M35 ${height} Q${35 + curve} ${height / 2} 35 15`}
            stroke="url(#stemGradient)"
            strokeWidth="3"
            fill="none"
            strokeLinecap="round"
          />
        )}

        {/* Sprout */}
        {stage === "sprout" && (
          <path
            d="M35 18 C45 10, 55 25, 35 28 C15 25, 25 10, 35 18"
            fill="url(#leafGradient)"
          />
        )}

        {/* Leaves */}
        {(stage === "sapling" || stage === "bloom") && (
          <>
            <path
              d="M35 22 C48 10, 58 28, 35 32"
              fill="url(#leafGradient)"
            />
            <path
              d="M35 22 C22 10, 12 28, 35 32"
              fill="url(#leafGradientDark)"
            />
          </>
        )}

        {/* Flower */}
        {stage === "bloom" && (
          <>
            {[...Array(6)].map((_, i) => (
              <ellipse
                key={i}
                cx="35"
                cy="14"
                rx="4"
                ry="8"
                fill="#ff8fab"
                transform={`rotate(${i * 60} 35 14)`}
              />
            ))}
            <circle cx="35" cy="14" r="3" fill="#ffd166" />
          </>
        )}

        <defs>
          <linearGradient id="stemGradient" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#66bb6a" />
            <stop offset="100%" stopColor="#1b5e20" />
          </linearGradient>

          <linearGradient id="leafGradient" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#a5d6a7" />
            <stop offset="100%" stopColor="#2e7d32" />
          </linearGradient>

          <linearGradient id="leafGradientDark" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#81c784" />
            <stop offset="100%" stopColor="#1b5e20" />
          </linearGradient>
        </defs>

      </svg>
    </div>
  );
}