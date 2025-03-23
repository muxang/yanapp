"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export default function NavigationBar() {
  const pathname = usePathname();

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-[#E0E0E0] shadow-sm z-50 max-w-md mx-auto">
      <div className="flex justify-between items-center">
        <Link
          href="/"
          className={`flex flex-col items-center justify-center py-2 px-6 flex-1 ${
            pathname === "/" ? "text-[#4776E6]" : "text-[#8A8A8E]"
          }`}
        >
          <div className="mb-1 text-xl">⭐</div>
          <span className="text-[10px]">Check-in</span>
        </Link>

        <Link
          href="/rewards"
          className={`flex flex-col items-center justify-center py-2 px-6 flex-1 ${
            pathname === "/rewards" ? "text-[#4776E6]" : "text-[#8A8A8E]"
          }`}
        >
          <div className="mb-1 text-xl">🎁</div>
          <span className="text-[10px]">Rewards</span>
        </Link>

        <Link
          href="/profile"
          className={`flex flex-col items-center justify-center py-2 px-6 flex-1 ${
            pathname === "/profile" ? "text-[#4776E6]" : "text-[#8A8A8E]"
          }`}
        >
          <div className="mb-1 text-xl">👤</div>
          <span className="text-[10px]">Profile</span>
        </Link>
      </div>
    </nav>
  );
}
