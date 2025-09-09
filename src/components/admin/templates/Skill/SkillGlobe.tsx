import { useMemo } from "react";
import { Cloud } from "react-icon-cloud";

export interface SkillGlobeProps {
  logoUrls: string[];
}

export const cloudProps = {
  containerProps: {
    style: {
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      width: "50%",
      minHeight: "200px", // Give it a bit more vertical space
      paddingTop: "40px",
      paddingBottom: "40px",
      position: "relative", // For potential background effects
      overflow: "hidden", // Ensure no overflow from animations
    },
  },
  options: {
    reverse: false,
    depth: 1, // Slightly more depth for a better 3D feel
    wheelZoom: false,
    imageScale: 3.0, // Slightly larger images
    activeCursor: "pointer", // Indicate interactivity
    tooltip: "native", // Keeping native for simplicity, but custom is an option
    initial: [0.1, -0.1],
    clickToFront: 600, // Smoother transition when clicking
    tooltipDelay: 0,
    outlineColour: "#00000000", // Transparent outline
    maxSpeed: 0.02, // A bit slower for a calmer, more elegant movement
    minSpeed: 0.04, // Slower minimum speed
    // Added options for a more organic feel
    freezeActive: true,
    freezeDecel: true,
    // Shuffle the items for varied initial placement
    shuffleTags: true,
  },
};

const LogoCloud: React.FC<SkillGlobeProps> = ({ logoUrls = [] }) => {
  const renderedLogos = useMemo(() => {
    if (!logoUrls || logoUrls.length === 0) {
      return null;
    }
    return logoUrls.map((url, index) => (
      <a key={index} href="#" onClick={(e) => e.preventDefault()}>
        <img
          height="42"
          width="42"
          alt="Company or brand logo"
          src={url}
          style={{ objectFit: "contain" }}
        />
      </a>
    ));
  }, [logoUrls]);

  return (
    // @ts-ignore
    <Cloud {...cloudProps}>
      <>{renderedLogos}</>
    </Cloud>
  );
}

export default LogoCloud;