import { base, baseSepolia } from "viem/chains";

interface ContractConfig {
  address: `0x${string}`;
  chain: typeof base | typeof baseSepolia;
}

if (!process.env.NEXT_PUBLIC_CONTRACT_ADDRESS) {
  throw new Error(
    "NEXT_PUBLIC_CONTRACT_ADDRESS is not set in environment variables"
  );
}

if (!process.env.NEXT_PUBLIC_CONTRACT_ADDRESS.match(/^0x[a-fA-F0-9]{40}$/)) {
  throw new Error(
    "NEXT_PUBLIC_CONTRACT_ADDRESS must be a valid Ethereum address"
  );
}

export const CONTRACT_CONFIG: Record<string, ContractConfig> = {
  production: {
    address: process.env.NEXT_PUBLIC_CONTRACT_ADDRESS as `0x${string}`,
    chain: base,
  },
  development: {
    address: process.env.NEXT_PUBLIC_CONTRACT_ADDRESS as `0x${string}`,
    chain: baseSepolia,
  },
};

export const getContractConfig = () => {
  const env =
    process.env.NODE_ENV === "production" ? "production" : "development";
  return CONTRACT_CONFIG[env];
};
