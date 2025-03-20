"use client";

import { useEffect, useState } from "react";
import { WrapAILogo } from "./Icons";

export default function Splash({ onFinish }: { onFinish: () => void }) {
  const [loading, setLoading] = useState(0);

  useEffect(() => {
    // 模拟加载进度
    const interval = setInterval(() => {
      setLoading((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          setTimeout(() => {
            onFinish();
          }, 400); // 完成后延迟400ms再结束
          return 100;
        }
        return prev + 5;
      });
    }, 100);

    return () => clearInterval(interval);
  }, [onFinish]);

  return (
    <div className="splash-screen">
      <div className="splash-content">
        <div className="logo-container">
          <div className="logo-wrapper">
            <WrapAILogo size={80} />
            <h1 className="brand-name">WrapAI</h1>
            <div className="brand-tagline">Web3 + AI Points</div>
          </div>
        </div>

        <div className="progress-container">
          <div className="progress-bar">
            <div
              className="progress-fill"
              style={{ width: `${loading}%` }}
            ></div>
          </div>
          <div className="progress-text">{loading}%</div>
        </div>
      </div>
    </div>
  );
}
