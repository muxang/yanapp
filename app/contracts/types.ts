export interface UserInfo {
  lastCheckIn: bigint;
  consecutiveCheckIns: bigint;
  totalPoints: bigint;
  totalCheckIns: bigint;
}

export interface CheckInEvent {
  user: `0x${string}`;
  points: bigint;
  consecutiveCheckIns: bigint;
}
