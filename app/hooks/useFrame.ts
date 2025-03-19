import { useEffect, useState } from "react";

export function useFrame() {
  const [isFrame, setIsFrame] = useState(false);

  useEffect(() => {
    try {
      const frameContext = window?.parent !== window;
      setIsFrame(frameContext);
    } catch (error) {
      console.warn("Failed to detect frame context:", error);
      setIsFrame(false);
    }
  }, []);

  return {
    isFrame,
  };
}
