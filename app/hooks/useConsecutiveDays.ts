import { useUserInfo } from "./useContract";

export const useConsecutiveDays = () => {
  const { userInfo } = useUserInfo();

  const currentDayId = Math.floor(Date.now() / 86400);
  const lastCheckInDayId = userInfo?.lastCheckInDayId
    ? Number(userInfo.lastCheckInDayId)
    : 0;
  const isEligibleForBonus = lastCheckInDayId === currentDayId - 1;

  return {
    consecutiveDays: Number(userInfo?.consecutiveCheckIns || 0),
    isEligibleForBonus,
  };
};
