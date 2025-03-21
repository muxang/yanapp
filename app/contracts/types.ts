export interface UserInfo {
  lastCheckIn: bigint;
  lastCheckInDayId: bigint;
  consecutiveCheckIns: bigint;
  totalPoints: bigint;
  totalCheckIns: bigint;
}

export interface CheckInEvent {
  user: `0x${string}`;
  pointsEarned: bigint;
  consecutiveCheckIns: bigint;
  timestamp: bigint;
  dayId: bigint;
}

export interface Reward {
  name: string;
  description: string;
  pointCost: bigint;
  isActive: boolean;
}

export interface RedemptionRecord {
  rewardId: bigint;
  timestamp: bigint;
  pointsSpent: bigint;
}
