"use client";

import { useAccount } from "wagmi";
import { useUserInfo } from "../hooks/useContract";
import Link from "next/link";
import { useEffect, useState } from "react";
import sdk from "@farcaster/frame-sdk";
import NavigationBar from "../components/NavigationBar";

// 定义FrameContext接口
interface UserContext {
  fid: number;
  username?: string;
  displayName?: string;
  pfpUrl?: string;
  pfp?: string;
  location?: {
    placeId: string;
    description: string;
  };
}

interface FrameContext {
  user?: UserContext;
  isAuthenticated?: boolean;
}

export default function ProfilePage() {
  const { isConnected, address } = useAccount();
  const { userInfo } = useUserInfo();
  const [profileImage, setProfileImage] = useState<string>(
    "https://www.gravatar.com/avatar/00000000000000000000000000000000?d=mp&f=y"
  );
  const [userName, setUserName] = useState<string>("User");
  const [userFid, setUserFid] = useState<number | null>(null);
  const [showToast, setShowToast] = useState<string>("");
  const [isFrameLoaded, setIsFrameLoaded] = useState(false);
  const [frameContext, setFrameContext] = useState<FrameContext | null>(null);

  // 初始化Frame SDK并获取Farcaster用户信息
  useEffect(() => {
    async function initFrameSDK() {
      try {
        // 加载SDK
        await sdk.actions.ready();
        setIsFrameLoaded(true);

        // 获取用户上下文
        const context = await sdk.context;
        setFrameContext(context);
        console.log("Frame context:", context);

        // 从context获取用户信息
        if (context?.user) {
          // 尝试获取头像 - 使用类型断言绕过类型检查
          if (context.user.pfpUrl) {
            setProfileImage(context.user.pfpUrl);
          } else if ((context.user as any).pfp) {
            setProfileImage((context.user as any).pfp);
          }

          if (context.user.displayName) {
            setUserName(context.user.displayName);
          } else if (context.user.username) {
            setUserName(`@${context.user.username}`);
          }

          if (context.user.fid) {
            setUserFid(context.user.fid);
          }
        }
      } catch (error) {
        console.error("Failed to initialize Frame SDK:", error);

        // 备用方案：从URL参数获取
        if (typeof window !== "undefined") {
          try {
            const params = new URLSearchParams(window.location.search);
            const fid = params.get("fid");

            if (fid) {
              // 如果有FID参数，可以从API获取头像和名称
              // 这里仅做示例，实际集成时应使用SDK的方法
              const localImage = localStorage.getItem("farcaster_pfp");
              const localName = localStorage.getItem("farcaster_name");

              if (localImage) setProfileImage(localImage);
              if (localName) setUserName(localName);
              setUserFid(parseInt(fid));
            }
          } catch (error) {
            console.error("Error fetching profile from params:", error);
          }
        }
      }
    }

    initFrameSDK();
  }, []);

  const handleMenuClick = (feature: string) => {
    setShowToast(`This feature would open: ${feature}`);
    setTimeout(() => setShowToast(""), 2000);
  };

  return (
    <div className="app-container content-padding">
      {/* Header */}
      <header className="page-header profile-header">
        <div className="settings-icon">
          <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
            <path d="M19.14 12.94c.04-.3.06-.61.06-.94 0-.32-.02-.64-.07-.94l2.03-1.58c.18-.14.23-.41.12-.61l-1.92-3.32c-.12-.22-.37-.29-.59-.22l-2.39.96c-.5-.38-1.03-.7-1.62-.94l-.36-2.54c-.04-.24-.24-.41-.48-.41h-3.84c-.24 0-.43.17-.47.41l-.36 2.54c-.59.24-1.13.57-1.62.94l-2.39-.96c-.22-.08-.47 0-.59.22L2.74 8.87c-.12.21-.08.47.12.61l2.03 1.58c-.05.3-.09.63-.09.94s.02.64.07.94l-2.03 1.58c-.18.14-.23.41-.12.61l1.92 3.32c.12.22.37.29.59.22l2.39-.96c.5.38 1.03.7 1.62.94l.36 2.54c.05.24.24.41.48.41h3.84c.24 0 .44-.17.47-.41l.36-2.54c.59-.24 1.13-.56 1.62-.94l2.39.96c.22.08.47 0 .59-.22l1.92-3.32c.12-.22.07-.47-.12-.61l-2.01-1.58zM12 15.6c-1.98 0-3.6-1.62-3.6-3.6s1.62-3.6 3.6-3.6 3.6 1.62 3.6 3.6-1.62 3.6-3.6 3.6z" />
          </svg>
        </div>
        <div className="profile-card">
          <img src={profileImage} alt="Profile" className="profile-avatar" />
          <h1 className="profile-name">{userName}</h1>
          {userFid && <p className="profile-subtitle">FID: {userFid}</p>}
          <div className="points-badge mx-auto">
            <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8z" />
              <path d="M12 6c-3.31 0-6 2.69-6 6s2.69 6 6 6 6-2.69 6-6-2.69-6-6-6zm0 10c-2.21 0-4-1.79-4-4s1.79-4 4-4 4 1.79 4 4-1.79 4-4 4z" />
            </svg>
            <span>
              {userInfo?.totalPoints ? Number(userInfo.totalPoints) : 0}
            </span>
          </div>
        </div>
      </header>

      <main className="page-content">
        {/* Stats Card */}
        <div className="card">
          <div className="stats-grid">
            <div className="stat-card">
              <div className="stat-label">Streak Days</div>
              <div className="stat-value">
                {userInfo?.consecutiveCheckIns
                  ? Number(userInfo.consecutiveCheckIns)
                  : 0}
              </div>
            </div>
            <div className="stat-card">
              <div className="stat-label">Total Check-ins</div>
              <div className="stat-value">
                {userInfo?.totalCheckIns ? Number(userInfo.totalCheckIns) : 0}
              </div>
            </div>
            <div className="stat-card">
              <div className="stat-label">Redeemed</div>
              <div className="stat-value">0</div>
            </div>
          </div>
        </div>

        {/* Points & Rewards */}
        <div className="card mt-4">
          <h2 className="section-title mb-2">Points & Rewards</h2>
          <div>
            <div
              className="menu-item"
              onClick={() => handleMenuClick("Points History")}
            >
              <div className="menu-icon icon-blue">
                <svg
                  className="w-5 h-5"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                >
                  <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8z" />
                  <path d="M12 6c-3.31 0-6 2.69-6 6s2.69 6 6 6 6-2.69 6-6-2.69-6-6-6zm0 10c-2.21 0-4-1.79-4-4s1.79-4 4-4 4 1.79 4 4-1.79 4-4 4z" />
                </svg>
              </div>
              <div className="menu-content">
                <div className="menu-title">Points History</div>
                <div className="menu-subtitle">
                  View your points activity log
                </div>
              </div>
              <div className="menu-action">
                <svg
                  className="w-5 h-5"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                >
                  <path d="M8.59 16.59L13.17 12 8.59 7.41 10 6l6 6-6 6-1.41-1.41z" />
                </svg>
              </div>
            </div>
            <div
              className="menu-item"
              onClick={() => handleMenuClick("Connect Wallet")}
            >
              <div className="menu-icon icon-green">
                <svg
                  className="w-5 h-5"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                >
                  <path d="M21 18v1c0 1.1-.9 2-2 2H5c-1.11 0-2-.9-2-2V5c0-1.1.89-2 2-2h14c1.1 0 2 .9 2 2v1h-9c-1.11 0-2 .9-2 2v8c0 1.1.89 2 2 2h9zm-9-2h10V8H12v8z" />
                </svg>
              </div>
              <div className="menu-content">
                <div className="menu-title">Connect Wallet</div>
                <div className="menu-subtitle">Link your blockchain wallet</div>
              </div>
              <div className="menu-action">
                <svg
                  className="w-5 h-5"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                >
                  <path d="M8.59 16.59L13.17 12 8.59 7.41 10 6l6 6-6 6-1.41-1.41z" />
                </svg>
              </div>
            </div>
            <div
              className="menu-item"
              onClick={() => handleMenuClick("My NFTs")}
            >
              <div className="menu-icon icon-orange">
                <svg
                  className="w-5 h-5"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                >
                  <path d="M12 11.39c0-.65-.39-1.23-.98-1.48L5.44 7.55c-1.48 1.68-2.32 3.7-2.8 5.45h7.75c.89 0 1.61-.72 1.61-1.61z" />
                  <path d="M21.96 11.22c-.41-4.41-4.56-7.49-8.98-7.2-2.51.16-4.44.94-5.93 2.04l4.74 2.01c1.33.57 2.2 1.87 2.2 3.32 0 1.99-1.62 3.61-3.61 3.61H2.21C2 16.31 2 16.5 2 16.69c.2 4.37 3.7 7.31 8 7.31 2.61 0 5.09-1.07 6.92-3.05 1.83-1.97 2.73-4.58 2.55-7.22zM12 20.2c-1.01 0-1.81-.82-1.81-1.82 0-1 .8-1.82 1.81-1.82s1.81.82 1.81 1.82c0 1-.8 1.82-1.81 1.82z" />
                </svg>
              </div>
              <div className="menu-content">
                <div className="menu-title">My NFTs</div>
                <div className="menu-subtitle">View your collected NFTs</div>
              </div>
              <div className="menu-action">
                <svg
                  className="w-5 h-5"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                >
                  <path d="M8.59 16.59L13.17 12 8.59 7.41 10 6l6 6-6 6-1.41-1.41z" />
                </svg>
              </div>
            </div>
          </div>
        </div>

        {/* Settings & Support */}
        <div className="card mt-4">
          <h2 className="section-title mb-2">Settings & Support</h2>
          <div>
            <div
              className="menu-item"
              onClick={() => handleMenuClick("Account Settings")}
            >
              <div className="menu-icon icon-purple">
                <svg
                  className="w-5 h-5"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                >
                  <path d="M19.14 12.94c.04-.3.06-.61.06-.94 0-.32-.02-.64-.07-.94l2.03-1.58c.18-.14.23-.41.12-.61l-1.92-3.32c-.12-.22-.37-.29-.59-.22l-2.39.96c-.5-.38-1.03-.7-1.62-.94l-.36-2.54c-.04-.24-.24-.41-.48-.41h-3.84c-.24 0-.43.17-.47.41l-.36 2.54c-.59.24-1.13.57-1.62.94l-2.39-.96c-.22-.08-.47 0-.59.22L2.74 8.87c-.12.21-.08.47.12.61l2.03 1.58c-.05.3-.09.63-.09.94s.02.64.07.94l-2.03 1.58c-.18.14-.23.41-.12.61l1.92 3.32c.12.22.37.29.59.22l2.39-.96c.5.38 1.03.7 1.62.94l.36 2.54c.05.24.24.41.48.41h3.84c.24 0 .44-.17.47-.41l.36-2.54c.59-.24 1.13-.56 1.62-.94l2.39.96c.22.08.47 0 .59-.22l1.92-3.32c.12-.22.07-.47-.12-.61l-2.01-1.58zM12 15.6c-1.98 0-3.6-1.62-3.6-3.6s1.62-3.6 3.6-3.6 3.6 1.62 3.6 3.6-1.62 3.6-3.6 3.6z" />
                </svg>
              </div>
              <div className="menu-content">
                <div className="menu-title">Account Settings</div>
                <div className="menu-subtitle">
                  Update your profile information
                </div>
              </div>
              <div className="menu-action">
                <svg
                  className="w-5 h-5"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                >
                  <path d="M8.59 16.59L13.17 12 8.59 7.41 10 6l6 6-6 6-1.41-1.41z" />
                </svg>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Navigation Bar */}
      <NavigationBar />

      {/* Feature notification toast */}
      {showToast && <div className="notification-toast">{showToast}</div>}
    </div>
  );
}
