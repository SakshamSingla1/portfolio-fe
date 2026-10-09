import React from "react";
import { FaChrome, FaFirefoxBrowser, FaSafari, FaEdge, FaOpera, FaGoogle, FaLinkedin, FaGithub, FaTwitter, FaFacebook, FaInstagram, FaYoutube, FaRedditAlien } from "react-icons/fa";

// Shared browser/location/referrer breakdown colors & icons — used by both the home
// Dashboard's "Portfolio Views" widget (ViewAnalytics.template.tsx) and the dedicated
// Analytics page, so the two don't drift with duplicated copies.

export const BROWSER_COLORS: Record<string, string> = {
  Chrome:  "#4285f4",
  Firefox: "#ff6611",
  Safari:  "#0070c9",
  Edge:    "#0078d7",
  Opera:   "#ff1b2d",
  Other:   "#94a3b8",
};

export const BROWSER_ICONS: Record<string, React.ReactNode> = {
  Chrome:  <FaChrome size={11} />,
  Firefox: <FaFirefoxBrowser size={11} />,
  Safari:  <FaSafari size={11} />,
  Edge:    <FaEdge size={11} />,
  Opera:   <FaOpera size={11} />,
};

export const LOC_PALETTE = ["#3b82f6", "#8b5cf6", "#10b981", "#f59e0b", "#ef4444"];

export const SOURCE_COLORS: Record<string, string> = {
  Direct:    "#94a3b8",
  google:    "#4285f4",
  linkedin:  "#0a66c2",
  github:    "#24292e",
  twitter:   "#1d9bf0",
  facebook:  "#1877f2",
  instagram: "#e1306c",
  youtube:   "#ff0000",
  reddit:    "#ff4500",
  bing:      "#00809d",
};

export const getSourceColor = (src: string): string => {
  if (src === "Direct") return SOURCE_COLORS.Direct;
  const lower = src.toLowerCase();
  for (const [key, color] of Object.entries(SOURCE_COLORS)) {
    if (lower.includes(key)) return color;
  }
  return "#8b5cf6";
};

export const SOURCE_ICONS: Record<string, React.ReactNode> = {
  google:    <FaGoogle size={10} />,
  linkedin:  <FaLinkedin size={11} />,
  github:    <FaGithub size={11} />,
  twitter:   <FaTwitter size={11} />,
  facebook:  <FaFacebook size={11} />,
  instagram: <FaInstagram size={11} />,
  youtube:   <FaYoutube size={11} />,
  reddit:    <FaRedditAlien size={11} />,
};

export const getSourceIcon = (src: string): React.ReactNode | null => {
  if (src === "Direct") return null;
  const lower = src.toLowerCase();
  for (const [key, icon] of Object.entries(SOURCE_ICONS)) {
    if (lower.includes(key)) return icon;
  }
  return null;
};
