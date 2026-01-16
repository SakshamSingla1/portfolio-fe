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
        className="absolute inset-0 opacity-35"
        initial={{ scale: 1.1 }}
        animate={{ scale: 1 }}
        transition={{ duration: 1.2 }}
        style={{
          backgroundImage:
            "radial-gradient(circle at 20% 20%, rgba(16,185,129,0.35), transparent 40%), radial-gradient(circle at 80% 30%, rgba(16,185,129,0.25), transparent 45%)",
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
        <div className="flex flex-col items-center gap-3">
          <motion.div
            className="text-[#10b981]"
            animate={{ rotate: [0, 360] }}
            transition={{ repeat: Infinity, duration: 14, ease: "linear" }}
          >
            <FaLaptopCode size={isMobile ? 42 : 58} />
          </motion.div>
          <span className="tracking-widest text-xs uppercase text-gray-400">
            Portfolio
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
              className={`font-extrabold ${
                isMobile ? "text-2xl" : "text-4xl"
              }`}
            >
              Building reliable
              <span className="block text-[#10b981]">
                digital products
              </span>
            </h1>

            <p
              className={`mt-4 text-gray-400 ${
                isMobile ? "text-sm" : "text-base"
              }`}
            >
              Java · Spring Boot · React · System Design
            </p>
          </div>

          <div className="mt-10 grid grid-cols-3 gap-6 text-center">
            <div className="flex flex-col items-center gap-2">
              <FaCode className="text-[#10b981]" />
              <span className="text-xs text-gray-400">Clean Code</span>
            </div>
            <div className="flex flex-col items-center gap-2">
              <FaRocket className="text-[#10b981]" />
              <span className="text-xs text-gray-400">Fast Delivery</span>
            </div>
            <div className="flex flex-col items-center gap-2">
              <FaLaptopCode className="text-[#10b981]" />
              <span className="text-xs text-gray-400">Modern UI</span>
            </div>
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
