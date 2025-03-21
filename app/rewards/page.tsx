"use client";

import { useAccount } from "wagmi";
import { useUserInfo } from "../hooks/useContract";
import Link from "next/link";
import { useState } from "react";

export default function RewardsPage() {
  const { isConnected } = useAccount();
  const { userInfo } = useUserInfo();
  const [showNotification, setShowNotification] = useState(false);

  const handleNotification = () => {
    try {
      // Call Farcaster SDK to view profile with ID 567606
      import("@farcaster/frame-sdk").then((sdk) => {
        sdk.default.actions.viewProfile({ fid: 567606 });
      });
    } catch (error) {
      console.error("Failed to view profile:", error);
    }
  };

  // 定义可用奖励
  const rewards = [
    {
      id: 1,
      title: "NFT Collection Access",
      description: "Get early access to our exclusive NFT collection drops",
      available: true,
    },
    {
      id: 2,
      title: "Whitelist Spot",
      description: "Secure a whitelist spot for upcoming token launches",
      available: true,
    },
    {
      id: 3,
      title: "DAO Voting Power",
      description: "Earn voting rights in our community governance",
      available: true,
    },
  ];

  return (
    <div className="app-container content-padding">
      {/* Header */}
      <header className="page-header">
        <h1 className="header-title">WrapAi Rewards</h1>
        <p className="header-subtitle">
          Exchange points for exclusive benefits
        </p>
        <div className="points-badge">
          <svg width="18" height="18" viewBox="0 0 24 24">
            <path
              fill="currentColor"
              d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8z"
            />
            <path
              fill="currentColor"
              d="M12 6c-3.31 0-6 2.69-6 6s2.69 6 6 6 6-2.69 6-6-2.69-6-6-6zm0 10c-2.21 0-4-1.79-4-4s1.79-4 4-4 4 1.79 4 4-1.79 4-4 4z"
            />
          </svg>
          <span>
            {userInfo?.totalPoints ? Number(userInfo.totalPoints) : 0}
          </span>
        </div>
      </header>

      <main className="animate-slide-up">
        {/* 将通知按钮移到顶部并增加视觉突出显示 */}
        <div className="notification-banner">
          <button
            className="notification-button-highlighted"
            onClick={handleNotification}
          >
            <svg
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="mr-1"
            >
              <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"></path>
              <path d="M13.73 21a2 2 0 0 1-3.46 0"></path>
            </svg>
            Get Notified of New Rewards
          </button>
        </div>

        {/* 有奖励列表的情况 */}
        {rewards.length > 0 ? (
          <div>
            <div className="center-text mb-4 mt-4">
              <h2 className="rewards-title">Available Rewards</h2>
              <p className="rewards-subtitle">
                Redeem your points for these exclusive rewards
              </p>
            </div>

            <div className="rewards-list">
              {rewards.map((reward) => (
                <div key={reward.id} className="reward-card">
                  <h3 className="reward-title">{reward.title}</h3>
                  <p className="reward-description">{reward.description}</p>
                  <div className="reward-points">
                    <svg
                      width="16"
                      height="16"
                      viewBox="0 0 24 24"
                      className="mr-2"
                    >
                      <path
                        fill="currentColor"
                        d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8z"
                      />
                      <path
                        fill="currentColor"
                        d="M12 6c-3.31 0-6 2.69-6 6s2.69 6 6 6 6-2.69 6-6-2.69-6-6-6zm0 10c-2.21 0-4-1.79-4-4s1.79-4 4-4 4 1.79 4 4-1.79 4-4 4z"
                      />
                    </svg>
                    Points required
                  </div>
                  <button
                    className={`button-secondary reward-button ${
                      reward.available ? "" : "button-disabled"
                    }`}
                    disabled={!reward.available}
                  >
                    Coming Soon
                  </button>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className="center-text mt-8 mb-6">
            <div className="gift-box">
              <svg
                width="100%"
                height="100%"
                viewBox="0 0 24 24"
                fill="#4e7cff"
              >
                <path d="M20,6h-2.18c0.11-0.31,0.18-0.65,0.18-1c0-1.66-1.34-3-3-3c-1.05,0-1.96,0.54-2.5,1.35l-0.5,0.67l-0.5-0.68 C10.96,2.54,10.05,2,9,2C7.34,2,6,3.34,6,5c0,0.35,0.07,0.69,0.18,1H4C2.89,7,2,7.89,2,9v11c0,1.11,0.89,2,2,2h16 c1.11,0,2-0.89,2-2V9C22,7.89,21.11,7,20,6z M15,4c0.55,0,1,0.45,1,1s-0.45,1-1,1s-1-0.45-1-1S14.45,4,15,4z M9,4 c0.55,0,1,0.45,1,1S9.55,6,9,6S8,5.55,8,5S8.45,4,9,4z" />
              </svg>
            </div>
            <h2 className="rewards-title">Exciting Rewards Coming Soon!</h2>
            <p className="rewards-subtitle">
              We're preparing amazing WrapAi rewards for you. Keep checking in
              to accumulate points and be ready when rewards launch!
            </p>
          </div>
        )}

        {showNotification && (
          <div className="notification-toast">
            You'll be notified when new rewards are available!
          </div>
        )}
      </main>

      {/* Navigation Bar */}
      <nav className="nav-bar">
        <Link href="/" className="nav-item">
          <svg className="nav-icon" viewBox="0 0 24 24" strokeWidth="1.5">
            <path d="M19 3h-4.18C14.4 1.84 13.3 1 12 1c-1.3 0-2.4.84-2.82 2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-7 0c.55 0 1 .45 1 1s-.45 1-1 1-1-.45-1-1 .45-1 1-1zm-2 14l-4-4 1.41-1.41L10 14.17l6.59-6.59L18 9l-8 8z" />
          </svg>
          <span>Check-in</span>
        </Link>
        <Link href="/rewards" className="nav-item active">
          <svg className="nav-icon" viewBox="0 0 24 24" strokeWidth="1.5">
            <path d="M20 6h-2.18c.11-.31.18-.65.18-1 0-1.66-1.34-3-3-3-1.05 0-1.96.54-2.5 1.35l-.5.67-.5-.68C10.96 2.54 10.05 2 9 2 7.34 2 6 3.34 6 5c0 .35.07.69.18 1H4c-1.11 0-1.99.89-1.99 2L2 19c0 1.11.89 2 2 2h16c1.11 0 2-.89 2-2V8c0-1.11-.89-2-2-2zm-5-2c.55 0 1 .45 1 1s-.45 1-1 1-1-.45-1-1 .45-1 1-1zM9 4c.55 0 1 .45 1 1s-.45 1-1 1-1-.45-1-1 .45-1 1-1zm11 15H4v-2h16v2zm0-5H4V8h5.08L7 10.83 8.62 12 12 7.4l3.38 4.6L17 10.83 14.92 8H20v6z" />
          </svg>
          <span>Rewards</span>
        </Link>
        <Link href="/profile" className="nav-item">
          <svg className="nav-icon" viewBox="0 0 24 24" strokeWidth="1.5">
            <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
          </svg>
          <span>Profile</span>
        </Link>
      </nav>
    </div>
  );
}
