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

  const [lastCheckIn, consecutiveCheckIns, totalPoints, totalCheckIns] = data;

  return {
    userInfo: {
      lastCheckIn,
      consecutiveCheckIns,
      totalPoints,
      totalCheckIns,
    } satisfies UserInfo,
    isLoading,
    refetch,
  } as const;
}
