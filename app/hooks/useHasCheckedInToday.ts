import { useUserInfo } from "./useContract";

export const useHasCheckedInToday = () => {
  const { userInfo } = useUserInfo();

  const currentDayId = Math.floor(Date.now() / 86400);
  const lastCheckInDayId = userInfo?.lastCheckInDayId
    ? Number(userInfo.lastCheckInDayId)
    : 0;

  return {
    isHasCheckedInToday: lastCheckInDayId === currentDayId,
    isLoading: false,
  };
};
