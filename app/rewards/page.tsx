"use client";

import { useAccount } from "wagmi";
import { useUserInfo } from "../hooks/useContract";
import Link from "next/link";

export default function RewardsPage() {
  const { isConnected } = useAccount();
  const { userInfo } = useUserInfo();

  return (
    <div className="app-container content-padding">
      {/* Header */}
      <header className="page-header">
        <h1 className="header-title">MWGA Rewards</h1>
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
        <h3 className="text-lg font-semibold mb-4">Available Rewards</h3>

        <div className="space-y-4">
          {/* NFT Reward Card */}
          <div className="card reward-card">
            <div className="flex items-center mb-3">
              <div className="bg-blue-100 rounded-lg p-2 mr-3">
                <svg
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="var(--primary)"
                  stroke-width="2"
                >
                  <path d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z"></path>
                  <line x1="7" y1="7" x2="7.01" y2="7"></line>
                </svg>
              </div>
              <div>
                <h4 className="font-medium">Exclusive NFT Collection</h4>
                <p className="text-sm text-gray-500">
                  Limited edition MWGA artwork
                </p>
              </div>
            </div>
            <div className="flex justify-between items-center">
              <div className="flex items-center">
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  className="text-primary mr-1"
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
                <span className="font-semibold">500 points</span>
              </div>
              <button className="button-secondary py-2 px-4">Redeem</button>
            </div>
          </div>

          {/* Whitelist Access Card */}
          <div className="card reward-card">
            <div className="flex items-center mb-3">
              <div className="bg-green-100 rounded-lg p-2 mr-3">
                <svg
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="#4CAF50"
                  stroke-width="2"
                >
                  <rect
                    x="3"
                    y="11"
                    width="18"
                    height="11"
                    rx="2"
                    ry="2"
                  ></rect>
                  <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
                </svg>
              </div>
              <div>
                <h4 className="font-medium">Whitelist Access</h4>
                <p className="text-sm text-gray-500">
                  Priority access to upcoming drops
                </p>
              </div>
            </div>
            <div className="flex justify-between items-center">
              <div className="flex items-center">
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  className="text-primary mr-1"
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
                <span className="font-semibold">1000 points</span>
              </div>
              <button className="button-secondary py-2 px-4">Redeem</button>
            </div>
          </div>

          {/* DAO Voting Power Card */}
          <div className="card reward-card">
            <div className="flex items-center mb-3">
              <div className="bg-purple-100 rounded-lg p-2 mr-3">
                <svg
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="#9C27B0"
                  stroke-width="2"
                >
                  <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
                  <circle cx="12" cy="12" r="3"></circle>
                </svg>
              </div>
              <div>
                <h4 className="font-medium">DAO Voting Power</h4>
                <p className="text-sm text-gray-500">
                  Influence MWGA project decisions
                </p>
              </div>
            </div>
            <div className="flex justify-between items-center">
              <div className="flex items-center">
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  className="text-primary mr-1"
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
                <span className="font-semibold">2000 points</span>
              </div>
              <button className="button-secondary py-2 px-4">Redeem</button>
            </div>
          </div>
        </div>

        <h3 className="text-lg font-semibold mt-6 mb-4">Coming Soon</h3>

        <div className="card p-6">
          <div className="flex justify-center mb-4">
            <svg
              width="60"
              height="60"
              viewBox="0 0 24 24"
              className="text-secondary"
            >
              <path
                fill="currentColor"
                d="M20,6h-2.18c0.11-0.31,0.18-0.65,0.18-1c0-1.66-1.34-3-3-3c-1.05,0-1.96,0.54-2.5,1.35l-0.5,0.67l-0.5-0.68 C10.96,2.54,10.05,2,9,2C7.34,2,6,3.34,6,5c0,0.35,0.07,0.69,0.18,1H4C2.89,7,2,7.89,2,9v11c0,1.11,0.89,2,2,2h16 c1.11,0,2-0.89,2-2V9C22,7.89,21.11,7,20,6z M15,4c0.55,0,1,0.45,1,1s-0.45,1-1,1s-1-0.45-1-1S14.45,4,15,4z M9,4 c0.55,0,1,0.45,1,1S9.55,6,9,6S8,5.55,8,5S8.45,4,9,4z"
              />
            </svg>
          </div>

          <h2 className="text-center text-xl font-bold mb-2">
            More Rewards Coming Soon
          </h2>

          <p className="text-center text-gray-600 mb-4">
            Stay tuned for additional MWGA rewards and keep checking in!
          </p>

          <div className="flex justify-center">
            <button className="button-secondary">
              <svg
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
                className="mr-1"
              >
                <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"></path>
                <path d="M13.73 21a2 2 0 0 1-3.46 0"></path>
              </svg>
              Get Notified
            </button>
          </div>
        </div>
      </main>

      {/* Navigation Bar */}
      <nav className="nav-bar">
        <Link href="/" className="nav-item">
          <svg className="nav-icon" viewBox="0 0 24 24" stroke-width="1.5">
            <path d="M19 3h-4.18C14.4 1.84 13.3 1 12 1c-1.3 0-2.4.84-2.82 2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-7 0c.55 0 1 .45 1 1s-.45 1-1 1-1-.45-1-1 .45-1 1-1zm-2 14l-4-4 1.41-1.41L10 14.17l6.59-6.59L18 9l-8 8z" />
          </svg>
          <span>Check-in</span>
        </Link>
        <Link href="/rewards" className="nav-item active">
          <svg className="nav-icon" viewBox="0 0 24 24" stroke-width="1.5">
            <path d="M20 6h-2.18c.11-.31.18-.65.18-1 0-1.66-1.34-3-3-3-1.05 0-1.96.54-2.5 1.35l-.5.67-.5-.68C10.96 2.54 10.05 2 9 2 7.34 2 6 3.34 6 5c0 .35.07.69.18 1H4c-1.11 0-1.99.89-1.99 2L2 19c0 1.11.89 2 2 2h16c1.11 0 2-.89 2-2V8c0-1.11-.89-2-2-2zm-5-2c.55 0 1 .45 1 1s-.45 1-1 1-1-.45-1-1 .45-1 1-1zM9 4c.55 0 1 .45 1 1s-.45 1-1 1-1-.45-1-1 .45-1 1-1zm11 15H4v-2h16v2zm0-5H4V8h5.08L7 10.83 8.62 12 12 7.4l3.38 4.6L17 10.83 14.92 8H20v6z" />
          </svg>
          <span>Rewards</span>
        </Link>
        <Link href="/profile" className="nav-item">
          <svg className="nav-icon" viewBox="0 0 24 24" stroke-width="1.5">
            <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
          </svg>
          <span>Profile</span>
        </Link>
      </nav>
    </div>
  );
}
