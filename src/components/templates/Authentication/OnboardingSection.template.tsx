import { Fade,useMediaQuery } from "@mui/material";
import { motion } from "framer-motion";
import { useInView } from "react-intersection-observer";
import { FaArrowRight, FaCode, FaLaptopCode, FaRocket } from "react-icons/fa";
import Button from "../../atoms/Button/Button";

const OnboardingSection = ({ onFlip }: { onFlip: () => void }) => {
  const isMobile = useMediaQuery("(max-width:1023px)");
  const [ref, inView] = useInView({ threshold: 0.15, triggerOnce: true });

  return (
    <div
      ref={ref}
      className="h-full flex flex-col rounded-tl-3xl rounded-bl-3xl 
      bg-gradient-to-br from-slate-950 via-slate-900 to-black 
      text-white relative overflow-hidden w-full"
    >
      <motion.div
        className="absolute top-[-20%] left-[-20%] w-[400px] h-[400px] rounded-full bg-emerald-500/20 blur-[100px] pointer-events-none"
        animate={{
          scale: [1, 1.3, 1],
          x: [0, 40, 0],
          y: [0, -30, 0],
        }}
        transition={{
          duration: 12,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />
      <motion.div
        className="absolute bottom-[-10%] right-[-10%] w-[350px] h-[350px] rounded-full bg-teal-500/20 blur-[100px] pointer-events-none"
        animate={{
          scale: [1, 1.2, 1],
          x: [0, -30, 0],
          y: [0, 40, 0],
        }}
        transition={{
          duration: 14,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 1,
        }}
      />

      <motion.div
        className={`w-full flex items-center justify-center ${
          isMobile ? "h-40" : "h-72"
        }`}
        initial={{ opacity: 0, y: -24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <div className="flex flex-col items-center gap-4">
          <motion.div
            className="p-5 rounded-3xl bg-gradient-to-br from-slate-900 to-slate-800 border border-slate-700/50 text-emerald-400 shadow-2xl shadow-emerald-500/10 relative group"
            whileHover={{ scale: 1.05, borderColor: "rgba(16,185,129,0.4)" }}
            transition={{ type: "spring", stiffness: 400, damping: 10 }}
          >
            <div className="absolute inset-0 rounded-3xl bg-emerald-500/10 blur-xl opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
            <FaLaptopCode size={isMobile ? 36 : 52} className="relative z-10" />
          </motion.div>
          <span className="tracking-[0.25em] text-xs uppercase font-semibold text-emerald-400/80">
            Full-Stack Portfolio
          </span>
        </div>
      </motion.div>

      <Fade in={inView} timeout={700}>
        <div
          className={`flex-1 flex flex-col justify-center ${
            isMobile ? "px-6 pb-28" : "px-14"
          }`}
        >
          <div className="text-center">
            <h1
              className={`font-extrabold tracking-tight ${
                isMobile ? "text-3xl" : "text-5xl"
              }`}
            >
              Building reliable
              <span className="block mt-1 bg-gradient-to-r from-emerald-400 to-teal-500 bg-clip-text text-transparent">
                digital products
              </span>
            </h1>

            <p
              className={`mt-4 text-slate-400 font-medium ${
                isMobile ? "text-sm" : "text-base"
              }`}
            >
              Java · Spring Boot · React · System Design
            </p>
          </div>

          <div className="mt-12 grid grid-cols-3 gap-4 text-center">
            <motion.div 
              className="flex flex-col items-center gap-3 p-5 rounded-2xl bg-white/5 backdrop-blur-md border border-white/10 shadow-lg"
              whileHover={{ y: -6, backgroundColor: "rgba(255,255,255,0.08)", borderColor: "rgba(16,185,129,0.4)", boxShadow: "0 10px 30px -10px rgba(16,185,129,0.3)" }}
              transition={{ type: "spring", stiffness: 300, damping: 20 }}
            >
              <div className="p-3 rounded-xl bg-gradient-to-br from-emerald-500/20 to-teal-500/20 text-emerald-400 text-2xl shadow-inner">
                <FaCode />
              </div>
              <span className="text-xs font-bold tracking-wide text-slate-300">Clean Code</span>
            </motion.div>
            <motion.div 
              className="flex flex-col items-center gap-3 p-5 rounded-2xl bg-white/5 backdrop-blur-md border border-white/10 shadow-lg"
              whileHover={{ y: -6, backgroundColor: "rgba(255,255,255,0.08)", borderColor: "rgba(16,185,129,0.4)", boxShadow: "0 10px 30px -10px rgba(16,185,129,0.3)" }}
              transition={{ type: "spring", stiffness: 300, damping: 20 }}
            >
              <div className="p-3 rounded-xl bg-gradient-to-br from-emerald-500/20 to-teal-500/20 text-emerald-400 text-2xl shadow-inner">
                <FaRocket />
              </div>
              <span className="text-xs font-bold tracking-wide text-slate-300">Fast Delivery</span>
            </motion.div>
            <motion.div 
              className="flex flex-col items-center gap-3 p-5 rounded-2xl bg-white/5 backdrop-blur-md border border-white/10 shadow-lg"
              whileHover={{ y: -6, backgroundColor: "rgba(255,255,255,0.08)", borderColor: "rgba(16,185,129,0.4)", boxShadow: "0 10px 30px -10px rgba(16,185,129,0.3)" }}
              transition={{ type: "spring", stiffness: 300, damping: 20 }}
            >
              <div className="p-3 rounded-xl bg-gradient-to-br from-emerald-500/20 to-teal-500/20 text-emerald-400 text-2xl shadow-inner">
                <FaLaptopCode />
              </div>
              <span className="text-xs font-bold tracking-wide text-slate-300">Modern UI</span>
            </motion.div>
          </div>
        </div>
      </Fade>

      {isMobile && (
        <motion.div
          className="fixed bottom-0 left-0 right-0 p-6 bg-slate-950/95 border-t border-slate-800 backdrop-blur-xl"
          initial={{ y: 90 }}
          animate={{ y: 0 }}
          transition={{ duration: 0.35, ease: "easeOut" }}
        >
          <Button
            onClick={onFlip}
            variant="primaryContained"
            label="Enter Portfolio"
            startIcon={<FaArrowRight />}
            fullWidth
          />
        </motion.div>
      )}
    </div>
  );
};

export default OnboardingSection;
