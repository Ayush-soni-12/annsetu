import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";

// Each word is its own component so hooks are called at the top level (Rules of Hooks)
function WordSpan({ word, scrollYProgress, index, total }) {
  const start = index / total;
  const end = start + 0.15;

  const color = useTransform(scrollYProgress, [start, end], ["#9ca3af", "#000"]);

  return (
    <motion.span key={index} style={{ color }}>
      {word}
    </motion.span>
  );
}

export default function WordReveal() {
  const ref = useRef(null);

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start 50%", "end 70%"],
  });

  const text = "No one should sleep hungry when food is within reach.";
  const words = text.split(" ");

  return (
    <section ref={ref} className="py-20 bg-white">
      <div className="max-w-5xl mx-auto text-center px-6 flex flex-wrap justify-center gap-3 text-4xl md:text-6xl font-semibold leading-relaxed">
        {words.map((word, i) => (
          <WordSpan
            key={i}
            word={word}
            index={i}
            total={words.length}
            scrollYProgress={scrollYProgress}
          />
        ))}
      </div>
    </section>
  );
}