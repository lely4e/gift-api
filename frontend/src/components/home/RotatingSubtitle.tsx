import { useState, useEffect, type FC } from "react";
import { motion } from "framer-motion";
import { DiceFiveIcon } from "@phosphor-icons/react";

const SITUATIONS = [
  { text: "Gift for a friend? Skip the chat, make a poll."},
  { text: "Planning a trip? Stop digging for that one reply."},
  { text: "Movie night chaos? Vote instead of arguing."},
  { text: "No idea what to get them? Let choosr ask everyone."},
  { text: "Nobody has an idea? AI suggests a few." },
  { text: "Stuck with someone else's shortlist? Add your own." },
  { text: "Votes lost in the thread? Watch the tally live." },
  { text: "Ideas everywhere? All in one page." },
  { text: '"Love this one" - but which? Comments sit on the option.' },
  { text: "Chat scrolls away in an hour? This link doesn't." },
];

const CHAR_MS = 28;
const CHAR_JITTER_MS = 18;
const HOLD_MS = 2700;

function reducedMotion() {
  if (typeof window === "undefined") return false;
  return !!window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;
}

const RotatingSubtitle: FC = () => {
  const skip = reducedMotion();
  const [index, setIndex] = useState(0);
  const [typedChars, setTypedChars] = useState(skip ? SITUATIONS[0].text.length : 0);

  const situation = SITUATIONS[index];
  const done = typedChars >= situation.text.length;

  useEffect(() => {
    if (skip) return;
    if (!done) {
      const t = setTimeout(() => setTypedChars((c) => c + 1), CHAR_MS + Math.random() * CHAR_JITTER_MS);
      return () => clearTimeout(t);
    }
    const t = setTimeout(() => {
      setIndex((i) => (i + 1) % SITUATIONS.length);
      setTypedChars(0);
    }, HOLD_MS);
    return () => clearTimeout(t);
  }, [typedChars, done, skip]);

  return (
    <div>
      <div
        className="flex items-start gap-2"
        style={{ fontSize: "clamp(23px, 3.6cqw, 36px)", minHeight: "4.5rem" }}
      >
        <motion.span
          className="inline-flex shrink-0"
          style={{ color: "#ff6a00" }}
          animate={{ rotate: 360 }}
          transition={{ duration: 0.9, repeat: Infinity, repeatDelay: 2.2, ease: "easeInOut" }}
        >
          <DiceFiveIcon size="1.1em" weight="fill" />
        </motion.span>
        <p
          className="font-serif italic text-left whitespace-normal sm:whitespace-nowrap"
          style={{ color: "var(--text-inactive)" }}
        >
          {situation.text.slice(0, typedChars)}
          {!skip && (
            <motion.span
              aria-hidden="true"
              animate={{ opacity: [1, 0] }}
              transition={{ duration: 0.6, repeat: Infinity, repeatType: "reverse" }}
              style={{
                display: "inline-block",
                width: 2,
                height: "0.9em",
                marginLeft: 2,
                verticalAlign: "text-bottom",
                background: "var(--accent-orange-2)",
              }}
            />
          )}
        </p>
      </div>
    </div>
  );
};

export default RotatingSubtitle;
