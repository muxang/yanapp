"use client";

import React, { useState, useEffect } from "react";
import { useAccount, useWriteContract, useReadContract } from "wagmi";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import { getContractConfig } from "../contracts/config";
import { CHECK_IN_ABI } from "../contracts/abi";

type TodoItem = {
  id: string;
  text: string;
  completed: boolean;
  createdAt: number;
};

export default function Todo() {
  const { address, isConnected } = useAccount();
  const [todos, setTodos] = useState<TodoItem[]>([]);
  const [newTodo, setNewTodo] = useState("");
  const { writeContractAsync } = useWriteContract();
  const contractConfig = getContractConfig();

  // 从合约获取当前用户的积分
  const { data: userInfo } = useReadContract({
    address: contractConfig.address,
    abi: CHECK_IN_ABI,
    functionName: "getUserInfo",
    args: address ? [address] : undefined,
    query: {
      enabled: !!address && isConnected,
    },
  });

  const userPoints = userInfo ? Number(userInfo[2]) : 0;

  // 从链上或本地存储加载待办事项
  useEffect(() => {
    if (isConnected && address) {
      // 在真实应用中，我们可能会从链上加载用户的待办事项
      // 这里为简单起见，还使用localStorage
      const storedTodos = localStorage.getItem(`todos_${address}`);
      if (storedTodos) {
        setTodos(JSON.parse(storedTodos));
      }
    }
  }, [isConnected, address]);

  // 保存待办事项到本地存储
  useEffect(() => {
    if (isConnected && address && todos.length > 0) {
      localStorage.setItem(`todos_${address}`, JSON.stringify(todos));
    }
  }, [todos, isConnected, address]);

  const handleAddTodo = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTodo.trim()) return;

    const newTodoItem: TodoItem = {
      id: Date.now().toString(),
      text: newTodo.trim(),
      completed: false,
      createdAt: Date.now(),
    };

    setTodos([...todos, newTodoItem]);
    setNewTodo("");
  };

  const toggleTodo = (id: string) => {
    setTodos(
      todos.map((todo) =>
        todo.id === id ? { ...todo, completed: !todo.completed } : todo
      )
    );
  };

  const deleteTodo = (id: string) => {
    setTodos(todos.filter((todo) => todo.id !== id));
  };

  return (
    <div className="w-full bg-gray-800 rounded-lg p-6 shadow-lg">
      {!isConnected ? (
        <div className="flex flex-col items-center">
          <ConnectButton />
          <p className="mt-4 text-gray-400">
            Connect wallet to manage your todos
          </p>
        </div>
      ) : (
        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <h1 className="text-2xl font-bold text-white">Todo List</h1>
            <div className="bg-blue-600/20 px-3 py-1 rounded-full flex items-center gap-2">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5 text-blue-400"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path d="M10 2a8 8 0 100 16 8 8 0 000-16zm0 14a6 6 0 110-12 6 6 0 010 12z" />
                <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
              </svg>
              <span className="text-blue-400 font-medium">
                {userPoints} points
              </span>
            </div>
          </div>

          <form onSubmit={handleAddTodo} className="flex gap-2">
            <input
              type="text"
              value={newTodo}
              onChange={(e) => setNewTodo(e.target.value)}
              placeholder="Add a new task..."
              className="flex-1 bg-gray-700 text-white p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <button
              type="submit"
              className="bg-gradient-to-r from-blue-500 to-purple-600 text-white p-3 rounded-lg hover:opacity-90 transition-all"
            >
              Add
            </button>
          </form>

          <div className="space-y-2">
            {todos.length === 0 ? (
              <p className="text-gray-400 text-center py-4">
                Your todo list is empty
              </p>
            ) : (
              todos.map((todo) => (
                <div
                  key={todo.id}
                  className={`flex items-center justify-between bg-gray-700 p-3 rounded-lg ${
                    todo.completed ? "opacity-60" : ""
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <input
                      type="checkbox"
                      checked={todo.completed}
                      onChange={() => toggleTodo(todo.id)}
                      className="w-5 h-5 accent-purple-600"
                    />
                    <span
                      className={`text-white ${
                        todo.completed ? "line-through text-gray-400" : ""
                      }`}
                    >
                      {todo.text}
                    </span>
                  </div>
                  <button
                    onClick={() => deleteTodo(todo.id)}
                    className="text-red-400 hover:text-red-300"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path
                        fillRule="evenodd"
                        d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </button>
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
}
