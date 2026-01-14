import { Fade, useTheme, useMediaQuery } from "@mui/material";
import { motion } from "framer-motion";
import { useInView } from "react-intersection-observer";
import { FaShieldAlt, FaArrowRight } from "react-icons/fa";
import Button from "../../atoms/Button/Button";

const OnboardingSection = ({ onFlip }: { onFlip: () => void }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  const [ref, inView] = useInView({ threshold: 0.1, triggerOnce: true });

  return (
    <div
      ref={ref}
      className={`h-full flex flex-col rounded-tl-3xl rounded-bl-3xl 
      bg-linear-to-br from-gray-50 to-white relative overflow-hidden`}
    >
      <motion.img
        src="https://res.cloudinary.com/dwveckkwz/image/upload/v1753875910/Gemini_Generated_Image_lvu2l3lvu2l3lvu2_if4fey.png"
        alt="Onboarding"
        className={`w-full object-cover rounded-tl-3xl ${
          isMobile ? "h-32" : "h-58"
        }`}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6 }}
      />

      <Fade in={inView} timeout={600}>
        <div className={`flex-1 flex flex-col ${isMobile ? "p-6 pb-28" : "p-10"}`}>
          {/* Title */}
          <div className="text-center">
            <h1
              className={`font-bold text-gray-900 ${
                isMobile ? "text-2xl" : "text-4xl"
              }`}
            >
              Welcome Back
            </h1>

            <p
              className={`mt-3 text-gray-600 ${
                isMobile ? "text-sm" : "text-base"
              }`}
            >
              Manage portfolios, track data, and access your workspace securely.
            </p>
          </div>

          {/* Info */}
          <div className="mt-10 flex items-center justify-center gap-2 text-sm text-gray-500">
            <FaShieldAlt className="text-green-500" />
            Secure access with role-based authentication
          </div>
        </div>
      </Fade>

      {/* Mobile CTA only */}
      {isMobile && (
        <motion.div
          className="fixed bottom-0 left-0 right-0 p-6 bg-white border-t shadow-xl"
          initial={{ y: 80 }}
          animate={{ y: 0 }}
          transition={{ duration: 0.3 }}
        >
          <Button
            onClick={onFlip}
            variant="primaryContained"
            label="Continue"
            startIcon={<FaArrowRight />}
            fullWidth
          />
        </motion.div>
      )}
    </div>
  );
};

export default OnboardingSection;
