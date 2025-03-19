import { useAccount, useReadContract, useWriteContract } from "wagmi";
import { CHECK_IN_ABI } from "./abi";
import { getContractConfig } from "./config";
import { UserInfo } from "./types";

export function useCheckIn() {
  const { writeContractAsync } = useWriteContract();
  const config = getContractConfig();

  return {
    checkIn: async () => {
      return writeContractAsync({
        address: config.address,
        abi: CHECK_IN_ABI,
        functionName: "checkIn",
      });
    },
  };
}

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
