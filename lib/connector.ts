import sdk from "@farcaster/frame-sdk";
import { SwitchChainError, fromHex, getAddress, numberToHex } from "viem";
import { ChainNotConfiguredError, createConnector } from "wagmi";
import { base } from "wagmi/chains";

frameConnector.type = "frameConnector" as const;

// 检查是否在 Frame 环境中
const isFrameEnvironment = () => {
  try {
    return window?.parent !== window;
  } catch (error) {
    return false;
  }
};

// 初始化 SDK
const initializeSDK = async () => {
  try {
    await sdk.actions.ready();
    return true;
  } catch (error) {
    console.error("Failed to initialize SDK:", error);
    return false;
  }
};

export function frameConnector() {
  let connected = false;
  let initialized = false;

  return createConnector<typeof sdk.wallet.ethProvider>((config) => ({
    id: "farcaster",
    name: "Farcaster Wallet",
    type: frameConnector.type,

    async setup() {
      if (!isFrameEnvironment()) {
        console.warn("Not in Farcaster Frame environment");
        return;
      }
      initialized = await initializeSDK();
      if (initialized) {
        await this.connect();
      }
    },

    async connect() {
      if (!isFrameEnvironment()) {
        throw new Error("Farcaster Frame environment not available");
      }

      if (!initialized) {
        initialized = await initializeSDK();
        if (!initialized) {
          throw new Error("Failed to initialize Farcaster SDK");
        }
      }

      try {
        const provider = sdk.wallet.ethProvider;
        if (!provider) {
          throw new Error("Provider not available");
        }

        const accounts = await provider.request({
          method: "eth_requestAccounts",
        });

        // 获取当前链ID
        const currentChainId = await this.getChainId();

        // 如果不是 Base 链，尝试切换
        if (currentChainId !== base.id) {
          try {
            await provider.request({
              method: "wallet_switchEthereumChain",
              params: [{ chainId: numberToHex(base.id) }],
            });
          } catch (error: any) {
            // 如果链未添加，则添加 Base 链
            if (error.code === 4902) {
              await provider.request({
                method: "wallet_addEthereumChain",
                params: [
                  {
                    chainId: numberToHex(base.id),
                    chainName: "Base",
                    nativeCurrency: {
                      name: "Ethereum",
                      symbol: "ETH",
                      decimals: 18,
                    },
                    rpcUrls: ["https://mainnet.base.org"],
                    blockExplorerUrls: ["https://basescan.org"],
                  },
                ],
              });
            } else {
              throw error;
            }
          }
        }

        connected = true;

        return {
          accounts: accounts.map((x) => getAddress(x)),
          chainId: base.id,
        };
      } catch (error) {
        console.error("Failed to connect:", error);
        throw error;
      }
    },

    async disconnect() {
      connected = false;
      initialized = false;
    },

    async getAccounts() {
      if (!connected || !initialized) {
        throw new Error("Not connected or not initialized");
      }

      try {
        const provider = sdk.wallet.ethProvider;
        if (!provider) {
          throw new Error("Provider not available");
        }

        const accounts = await provider.request({
          method: "eth_requestAccounts",
        });
        return accounts.map((x) => getAddress(x));
      } catch (error) {
        console.error("Failed to get accounts:", error);
        throw error;
      }
    },

    async getChainId() {
      if (!initialized) {
        throw new Error("SDK not initialized");
      }

      try {
        const provider = sdk.wallet.ethProvider;
        if (!provider) {
          throw new Error("Provider not available");
        }

        const hexChainId = await provider.request({ method: "eth_chainId" });
        return fromHex(hexChainId, "number");
      } catch (error) {
        console.error("Failed to get chain ID:", error);
        throw error;
      }
    },

    async isAuthorized() {
      if (!connected || !initialized) {
        return false;
      }

      try {
        const accounts = await this.getAccounts();
        return !!accounts.length;
      } catch {
        return false;
      }
    },

    async switchChain({ chainId }) {
      if (!initialized) {
        throw new Error("SDK not initialized");
      }

      try {
        const provider = sdk.wallet.ethProvider;
        if (!provider) {
          throw new Error("Provider not available");
        }

        const chain = config.chains.find((x) => x.id === chainId);
        if (!chain) throw new SwitchChainError(new ChainNotConfiguredError());

        await provider.request({
          method: "wallet_switchEthereumChain",
          params: [{ chainId: numberToHex(chainId) }],
        });
        return chain;
      } catch (error) {
        console.error("Failed to switch chain:", error);
        throw error;
      }
    },

    onAccountsChanged(accounts) {
      if (accounts.length === 0) this.onDisconnect();
      else
        config.emitter.emit("change", {
          accounts: accounts.map((x) => getAddress(x)),
        });
    },

    onChainChanged(chain) {
      const chainId = Number(chain);
      config.emitter.emit("change", { chainId });
    },

    async onDisconnect() {
      config.emitter.emit("disconnect");
      connected = false;
      initialized = false;
    },

    async getProvider() {
      if (!initialized) {
        initialized = await initializeSDK();
        if (!initialized) {
          throw new Error("SDK not initialized");
        }
      }

      const provider = sdk.wallet.ethProvider;
      if (!provider) {
        throw new Error("Provider not available");
      }

      return provider;
    },
  }));
}
