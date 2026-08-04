"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import type { LucideIcon } from "lucide-react";
import { ArrowRight } from "lucide-react";

export interface StackStage {
  icon: LucideIcon;
  name: string;
  detail: string;
}

interface CardInstance {
  id: number;
  stage: number; // index into stages[]
}

const positionStyles = [
  { scale: 1, y: 12 },
  { scale: 0.95, y: -16 },
  { scale: 0.9, y: -44 },
];

const exitAnimation = { y: 360, scale: 1, zIndex: 10 };
const enterAnimation = { y: -16, scale: 0.9 };

function CardFace({
  stage,
  total,
  data,
}: {
  stage: number;
  total: number;
  data: StackStage;
}) {
  const Icon = data.icon;
  return (
    <div className="flex h-full w-full flex-col gap-4 p-6 sm:p-7">
      <div className="flex items-center justify-between">
        <div className="flex h-12 w-12 items-center justify-center rounded-xl border border-hairline bg-base text-accent">
          <Icon size={22} strokeWidth={1.75} />
        </div>
        <span className="font-mono text-[11px] uppercase tracking-[0.2em] text-fg-subtle">
          Stage {String(stage + 1).padStart(2, "0")} / {String(total).padStart(2, "0")}
        </span>
      </div>
      <h3 className="font-heading text-2xl font-semibold tracking-tight text-fg sm:text-[28px]">
        {data.name}
      </h3>
      <p className="text-[15px] leading-relaxed text-fg-muted">{data.detail}</p>
    </div>
  );
}

function StackCard({
  card,
  index,
  total,
  data,
}: {
  card: CardInstance;
  index: number;
  total: number;
  data: StackStage;
}) {
  const { scale, y } = positionStyles[index] ?? positionStyles[2];
  const zIndex = 3 - index;

  const exitAnim = index === 0 ? exitAnimation : undefined;
  const initialAnim = index === 2 ? enterAnimation : undefined;

  return (
    <motion.div
      key={card.id}
      initial={initialAnim}
      animate={{ y, scale }}
      exit={exitAnim}
      transition={{ type: "spring", duration: 0.9, bounce: 0 }}
      style={{ zIndex, left: "50%", x: "-50%", bottom: 0 }}
      className="absolute flex h-[300px] w-[324px] items-stretch justify-center overflow-hidden rounded-t-2xl border-x border-t border-hairline bg-elevated shadow-2xl shadow-black/40 will-change-transform sm:w-[512px]"
    >
      <CardFace stage={card.stage} total={total} data={data} />
    </motion.div>
  );
}

export default function ProcessCardStack({ stages }: { stages: StackStage[] }) {
  const total = stages.length;
  const [cards, setCards] = useState<CardInstance[]>(() =>
    [0, 1, 2].map((stage, i) => ({ id: i, stage: stage % total })),
  );
  const [nextId, setNextId] = useState(3);

  const handleAdvance = () => {
    setCards((prev) => {
      const last = prev[prev.length - 1];
      const nextStage = (last.stage + 1) % total;
      return [...prev.slice(1), { id: nextId, stage: nextStage }];
    });
    setNextId((n) => n + 1);
  };

  const topStage = cards[0]?.stage ?? 0;

  return (
    <div className="flex w-full flex-col items-center justify-center pt-2">
      <div className="relative h-[380px] w-full overflow-hidden sm:w-[644px]">
        <AnimatePresence initial={false}>
          {cards.slice(0, 3).map((card, index) => (
            <StackCard
              key={card.id}
              card={card}
              index={index}
              total={total}
              data={stages[card.stage]}
            />
          ))}
        </AnimatePresence>
      </div>

      <div className="relative z-10 -mt-px flex w-full items-center justify-center gap-5 border-t border-hairline py-5">
        {/* progress dots — highlight the stage currently on top */}
        <div className="flex items-center gap-2">
          {stages.map((_, i) => (
            <span
              key={i}
              className={`h-1.5 rounded-full transition-all duration-300 ${
                i === topStage ? "w-6 bg-white" : "w-1.5 bg-surface-subtle"
              }`}
            />
          ))}
        </div>

        <button
          type="button"
          onClick={handleAdvance}
          className="flex h-10 cursor-pointer select-none items-center justify-center gap-1.5 rounded-full border border-hairline-strong bg-base px-4 text-sm font-medium text-fg transition-all hover:border-accent hover:bg-elevated active:scale-[0.98]"
        >
          Next stage
          <ArrowRight size={16} />
        </button>
      </div>
    </div>
  );
}
