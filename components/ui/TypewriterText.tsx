"use client";
import { useState, useEffect, useRef } from "react";
import { motion, useInView } from "framer-motion";

interface TypewriterTextProps {
  text: string;
  speed?: number;
  delay?: number;
  onComplete?: () => void;
  className?: string;
  style?: React.CSSProperties;
  highlightText?: string;
  highlightStyle?: React.CSSProperties;
}

export default function TypewriterText({
  text,
  speed = 50, // milliseconds per character
  delay = 0,
  onComplete,
  className = "",
  style,
  highlightText,
  highlightStyle,
}: TypewriterTextProps) {
  const [displayedText, setDisplayedText] = useState("");
  const [isComplete, setIsComplete] = useState(false);
  const [hasStarted, setHasStarted] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(containerRef, { once: true, amount: 0.5 });

  useEffect(() => {
    if (displayedText.length === text.length && hasStarted) {
      setIsComplete(true);
      onComplete?.();
      return;
    }

    if (!hasStarted) return;

    const timer = setTimeout(() => {
      setDisplayedText(text.slice(0, displayedText.length + 1));
    }, speed);

    return () => clearTimeout(timer);
  }, [displayedText, text, speed, onComplete, hasStarted]);

  // Add delay before starting, but only after it scrolls into view
  useEffect(() => {
    if (isInView) {
      if (delay > 0) {
        const delayTimer = setTimeout(() => {
          setHasStarted(true);
        }, delay);
        return () => clearTimeout(delayTimer);
      } else {
        setHasStarted(true);
      }
    }
  }, [delay, isInView]);

  const renderText = () => {
    if (!highlightText) return <span>{displayedText}</span>;

    const highlightStartIndex = text.toLowerCase().indexOf(highlightText.toLowerCase());
    
    // If the highlight text isn't found in the original text, just render normally
    if (highlightStartIndex === -1) return <span>{displayedText}</span>;
    
    const highlightEndIndex = highlightStartIndex + highlightText.length;
    const currentLength = displayedText.length;

    if (currentLength <= highlightStartIndex) {
      return <span>{displayedText}</span>;
    } else if (currentLength <= highlightEndIndex) {
      return (
        <>
          <span>{displayedText.slice(0, highlightStartIndex)}</span>
          <span style={highlightStyle}>{displayedText.slice(highlightStartIndex, currentLength)}</span>
        </>
      );
    } else {
      return (
        <>
          <span>{displayedText.slice(0, highlightStartIndex)}</span>
          <span style={highlightStyle}>{displayedText.slice(highlightStartIndex, highlightEndIndex)}</span>
          <span>{displayedText.slice(highlightEndIndex, currentLength)}</span>
        </>
      );
    }
  };

  return (
    <div ref={containerRef} className={className} style={style}>
      {renderText()}
      {!isComplete && (
        <motion.span
          animate={{ opacity: [1, 0] }}
          transition={{ duration: 0.6, repeat: Infinity }}
          style={{ marginLeft: "2px", display: "inline-block" }}
        >
          |
        </motion.span>
      )}
    </div>
  );
}
