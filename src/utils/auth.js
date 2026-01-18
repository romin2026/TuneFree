import { siteData } from "@/stores";

/**
 * 检查用户是否已登录
 * @returns {boolean} 如果用户已登录，则返回 true；否则返回 false
 */
export const isLogin = () => {
  const data = siteData();
  // 更改状态
  data.userLoginStatus = false;
  return false;
};
