import React from "react";

export const WrapAILogo = ({
  size = 40,
  color = "#4F6AF6",
  secondaryColor = "#eeccff",
}: {
  size?: number;
  color?: string;
  secondaryColor?: string;
}) => {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 40 40"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <circle cx="20" cy="20" r="20" fill={color} />
      <path
        d="M10 12L16 28H18L24 12"
        stroke="white"
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <circle cx="28" cy="14" r="3" fill={secondaryColor} />
      <circle cx="28" cy="26" r="3" fill={secondaryColor} />
      <path
        d="M8 22L32 22"
        stroke="white"
        strokeWidth="2"
        strokeLinecap="round"
        strokeDasharray="2 2"
      />
    </svg>
  );
};
