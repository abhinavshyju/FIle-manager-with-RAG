import React from "react";
import { useScroll, useTransform } from "motion/react";
import { GoogleGeminiEffect } from "@/components/ui/google-gemini-effect";

export default function HeroPage() {
  const ref = React.useRef(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"],
  });

  const pathLengthFirst = useTransform(scrollYProgress, [0, 0.8], [0.2, 1.6]);
  const pathLengthSecond = useTransform(scrollYProgress, [0, 0.8], [0.15, 1.6]);
  const pathLengthThird = useTransform(scrollYProgress, [0, 0.8], [0.1, 1.6]);
  const pathLengthFourth = useTransform(scrollYProgress, [0, 0.8], [0.05, 1.6]);
  const pathLengthFifth = useTransform(scrollYProgress, [0, 0.8], [0, 1.6]);

  return (
    <div className="bg-black  text-white">
      <div
        className="h-[200vh]  w-full dark:border dark:border-white/[0.1] relative  overflow-clip"
        ref={ref}
      >
        <GoogleGeminiEffect
          title="DocSphere"
          func={() => {
            window.location.href = "/dashboard";
          }}
          description="A dynamic space for storing and managing documents"
          pathLengths={[
            pathLengthFirst,
            pathLengthSecond,
            pathLengthThird,
            pathLengthFourth,
            pathLengthFifth,
          ]}
        />
      </div>
    </div>
  );
}
