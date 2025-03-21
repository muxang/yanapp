import { useAccount, useReadContract, useWriteContract } from "wagmi";
import { CHECK_IN_ABI } from "../contracts/abi";
import { getContractConfig } from "../contracts/config";
import { UserInfo } from "../contracts/types";
import sdk from "@farcaster/frame-sdk";
import { base } from "wagmi/chains";

/**
 * Hook for handling check-in functionality
 * @returns Object containing checkIn function
 */
export function useCheckIn() {
  const { writeContractAsync } = useWriteContract();
  const config = getContractConfig();

  return {
    checkIn: async () => {
      try {
        const tx = await writeContractAsync({
          address: config.address,
          abi: CHECK_IN_ABI,
          functionName: "checkIn",
        });

        // 等待交易确认
        await sdk.actions.ready();
        return tx;
      } catch (error) {
        console.error("Check-in failed:", error);
        throw error;
      }
    },
  };
}

/**
 * Hook for fetching user information from the contract
 * @param address Optional address to fetch info for. If not provided, uses connected wallet address
 * @returns Object containing user info, loading state, and refetch function
 */
export function useUserInfo(address?: `0x${string}`) {
  const { address: userAddress } = useAccount();
  const config = getContractConfig();
  const targetAddress = address || (userAddress as `0x${string}` | undefined);

  const { data, isLoading, refetch } = useReadContract({
    address: config.address,
    abi: CHECK_IN_ABI,
    functionName: "getUserInfo",
    args: targetAddress ? [targetAddress] : undefined,
    query: {
      enabled: !!targetAddress,
      staleTime: 5000, // 5秒内认为数据是新鲜的
    },
  });

  if (!data) {
    return {
      userInfo: null,
      isLoading,
      refetch,
    } as const;
  }

  // 新的合约返回一个单一的 UserInfo 结构
  return {
    userInfo: data as UserInfo,
    isLoading,
    refetch,
  } as const;
}

/**
 * Hook for checking if user has already checked in today
 * @returns Object with flag indicating if user has checked in today
 */
export function useHasCheckedInToday() {
  const { userInfo } = useUserInfo();
  const { address } = useAccount();
  const config = getContractConfig();

  // 使用合约的canCheckIn方法结果的反向值来判断是否已签到
  const { data: canCheckInResult, isLoading } = useReadContract({
    address: config.address,
    abi: CHECK_IN_ABI,
    functionName: "canCheckIn",
    args: address ? [address] : undefined,
    query: {
      enabled: !!address,
      staleTime: 5000,
    },
  });

  // 如果合约说用户可以签到，那么就意味着今天还没有签到
  const isHasCheckedInToday = userInfo?.lastCheckIn ? !canCheckInResult : false;

  return {
    isHasCheckedInToday,
    isLoading,
  };
}
