import sdk from "@farcaster/frame-sdk";
import { SwitchChainError, fromHex, getAddress, numberToHex } from "viem";
import { ChainNotConfiguredError, createConnector } from "wagmi";

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
        await this.connect({ chainId: config.chains[0].id });
      }
    },

    async connect({ chainId } = {}) {
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

        let currentChainId = await this.getChainId();
        if (chainId && currentChainId !== chainId) {
          const chain = await this.switchChain!({ chainId });
          currentChainId = chain.id;
        }

        connected = true;

        return {
          accounts: accounts.map((x) => getAddress(x)),
          chainId: currentChainId,
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
