import Todo from "./components/Todo";
import CheckIn from "./components/CheckIn";

// 简单的路由配置
export const routes = [
  {
    path: "/",
    name: "待办事项",
    component: Todo,
  },
  {
    path: "/checkin",
    name: "每日签到",
    component: CheckIn,
  },
];
