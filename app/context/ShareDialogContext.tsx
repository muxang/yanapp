"use client";

import React, { createContext, useContext, useState, ReactNode } from "react";
import { ShareDialog } from "../components/ShareDialog";

// 定义分享对话框数据接口
interface ShareDialogData {
  consecutiveDays: number;
  earnedPoints: number;
  totalPoints: number;
}

// 定义上下文接口
interface ShareDialogContextType {
  openShareDialog: (data: ShareDialogData) => void;
  closeShareDialog: () => void;
  isShareDialogOpen: boolean;
}

// 创建上下文
const ShareDialogContext = createContext<ShareDialogContextType | undefined>(
  undefined
);

// 自定义Hook提供上下文访问
export const useShareDialog = (): ShareDialogContextType => {
  const context = useContext(ShareDialogContext);
  if (!context) {
    throw new Error("useShareDialog must be used within a ShareDialogProvider");
  }
  return context;
};

// Provider组件接口
interface ShareDialogProviderProps {
  children: ReactNode;
}

// Provider组件实现
export const ShareDialogProvider: React.FC<ShareDialogProviderProps> = ({
  children,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [dialogData, setDialogData] = useState<ShareDialogData>({
    consecutiveDays: 0,
    earnedPoints: 0,
    totalPoints: 0,
  });

  // 打开分享对话框
  const openShareDialog = (data: ShareDialogData) => {
    console.log("Opening share dialog with data:", data);
    setDialogData(data);
    setIsOpen(true);
  };

  // 关闭分享对话框
  const closeShareDialog = () => {
    console.log("Closing share dialog");
    setIsOpen(false);
  };

  // 提供上下文值并包含ShareDialog组件
  return (
    <ShareDialogContext.Provider
      value={{
        openShareDialog,
        closeShareDialog,
        isShareDialogOpen: isOpen,
      }}
    >
      {children}
      <ShareDialog
        isOpen={isOpen}
        onClose={closeShareDialog}
        data={dialogData}
      />
    </ShareDialogContext.Provider>
  );
};
