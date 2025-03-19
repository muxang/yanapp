import { base } from "viem/chains";

export function getContractConfig() {
  return {
    chain: base,
    address: process.env.NEXT_PUBLIC_CONTRACT_ADDRESS as `0x${string}`,
  };
}
