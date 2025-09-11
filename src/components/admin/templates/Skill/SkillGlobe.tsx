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
      minHeight: "200px",
      maxWidth: "500px",
      margin: "0 auto",
      paddingTop: "40px",
      paddingBottom: "40px",
      position: "relative",
      overflow: "hidden",
    },
  },
  options: {
    reverse: false,
    depth: 1,
    wheelZoom: false,
    imageScale: 3.0,
    activeCursor: "pointer",
    tooltip: "native",
    initial: [0.1, -0.1],
    clickToFront: 600,
    tooltipDelay: 0,
    outlineColour: "#00000000",
    maxSpeed: 0.02,
    minSpeed: 0.04,
    freezeActive: true,
    freezeDecel: true,
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