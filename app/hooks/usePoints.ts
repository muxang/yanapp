import { useCallback } from "react";
import { useUserInfo } from "./useContract";

export const usePoints = () => {
  const { userInfo, refetch } = useUserInfo();

  const addPoints = useCallback(
    async (points: number) => {
      // TODO: Implement points addition logic
      await refetch();
    },
    [refetch]
  );

  return {
    points: Number(userInfo?.totalPoints || 0),
    addPoints,
  };
};
