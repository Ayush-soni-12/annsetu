import { motion } from "framer-motion";
import { Users, Utensils, HeartHandshake, Building2 } from "lucide-react";



const stats = [
  {
    number: "1.5 L+",
    text: "children served daily",
    icon: Users,
  },
  {
    number: "23 Cr+",
    text: "meals served so far",
    icon: Utensils,
  },
  {
    number: "2,300+",
    text: "partner centres",
    icon: HeartHandshake,
  },
  {
    number: "150+",
    text: "cities",
    icon: Building2,
  },
];

const container = {
  hidden: { opacity: 1 },
  show: {
    transition: {
      staggerChildren: 0.15,
    },
  },
};

const item = {
  hidden: { opacity: 0, y: 60 },
  show: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.6,
      ease: "easeOut",
    },
  },
};

export default function StatsSection() {
  return (
    <section className="py-28 relative bg-[#f8f8f8] overflow-hidden">

      {/* 🌿 Background Glow */}
      <div className="absolute -top-20 left-1/2 -translate-x-1/2 w-[500px] h-[500px] bg-orange-200/30 rounded-full blur-3xl"></div>

      <motion.div
        variants={container}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true }}
        className="relative max-w-7xl mx-auto px-6 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8"
      >

        {stats.map((itemData, i) => {
          const Icon = itemData.icon;

          return (
            <motion.div
              key={i}
              variants={item}
              className="relative bg-white/80 backdrop-blur-md rounded-3xl p-10 text-center shadow-md hover:shadow-xl hover:-translate-y-3 transition-all duration-300"
            >
              {/* 🌿 subtle gradient */}
              <div className="absolute inset-0 bg-linear-to-br from-orange-100/20 to-transparent rounded-3xl"></div>

              <div className="relative z-10 flex flex-col items-center">

                {/* 🔥 Icon */}
                <div className="mb-4 p-3 rounded-full bg-orange-100 text-orange-500">
                  <Icon size={28} />
                </div>

                <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-2">
                  {itemData.number}
                </h2>

                <p className="text-gray-600 text-base">
                  {itemData.text}
                </p>
              </div>
            </motion.div>
          );
        })}

      </motion.div>

    </section>
  );
}