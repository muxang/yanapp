import { ethers } from "ethers";
import { CONTRACT_ADDRESS, CONTRACT_ABI } from "./contract";

export interface UserData {
  lastCheckIn: bigint;
  consecutiveCheckins: bigint;
  totalPoints: bigint;
}

export async function connectWallet() {
  // @ts-ignore - Farcaster wallet is injected into the window object
  if (typeof window !== "undefined" && window.ethereum) {
    try {
      // Request account access
      // @ts-ignore
      const accounts = await window.ethereum.request({
        method: "eth_requestAccounts",
      });
      return accounts[0];
    } catch (error) {
      console.error("User denied account access");
      return null;
    }
  } else {
    console.log("Ethereum wallet not found");
    return null;
  }
}

export async function checkIn() {
  // @ts-ignore
  if (typeof window !== "undefined" && window.ethereum) {
    try {
      // @ts-ignore
      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      const contract = new ethers.Contract(
        CONTRACT_ADDRESS,
        CONTRACT_ABI,
        signer
      );

      const tx = await contract.checkIn();
      await tx.wait();
      return true;
    } catch (error) {
      console.error("Error checking in:", error);
      return false;
    }
  }
  return false;
}

export async function getUserData(address: string): Promise<UserData | null> {
  // @ts-ignore
  if (typeof window !== "undefined" && window.ethereum) {
    try {
      // @ts-ignore
      const provider = new ethers.BrowserProvider(window.ethereum);
      const contract = new ethers.Contract(
        CONTRACT_ADDRESS,
        CONTRACT_ABI,
        provider
      );

      const data = await contract.getUserData(address);
      return {
        lastCheckIn: data[0],
        consecutiveCheckins: data[1],
        totalPoints: data[2],
      };
    } catch (error) {
      console.error("Error getting user data:", error);
      return null;
    }
  }
  return null;
}

export async function canCheckIn(address: string): Promise<boolean> {
  // @ts-ignore
  if (typeof window !== "undefined" && window.ethereum) {
    try {
      // @ts-ignore
      const provider = new ethers.BrowserProvider(window.ethereum);
      const contract = new ethers.Contract(
        CONTRACT_ADDRESS,
        CONTRACT_ABI,
        provider
      );

      return await contract.canCheckIn(address);
    } catch (error) {
      console.error("Error checking if user can check in:", error);
      return false;
    }
  }
  return false;
}
