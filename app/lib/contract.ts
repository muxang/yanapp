if (!process.env.NEXT_PUBLIC_CONTRACT_ADDRESS) {
  throw new Error("CONTRACT_ADDRESS is not defined in environment variables");
}

export const CONTRACT_ADDRESS = process.env.NEXT_PUBLIC_CONTRACT_ADDRESS;

export const CONTRACT_ABI = [
  {
    inputs: [],
    name: "BASE_POINTS",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "CHECK_IN_PERIOD",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "user",
        type: "address",
      },
    ],
    name: "canCheckIn",
    outputs: [
      {
        internalType: "bool",
        name: "",
        type: "bool",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "checkIn",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "user",
        type: "address",
      },
    ],
    name: "getUserData",
    outputs: [
      {
        internalType: "uint256",
        name: "lastCheckIn",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "consecutiveCheckins",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "totalPoints",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "",
        type: "address",
      },
    ],
    name: "userData",
    outputs: [
      {
        internalType: "uint256",
        name: "lastCheckIn",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "consecutiveCheckins",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "totalPoints",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "user",
        type: "address",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "points",
        type: "uint256",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "consecutiveCheckins",
        type: "uint256",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "timestamp",
        type: "uint256",
      },
    ],
    name: "CheckedIn",
    type: "event",
  },
];
