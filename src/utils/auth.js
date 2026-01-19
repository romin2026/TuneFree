import { siteData } from "@/stores";

/**
 * 检查本地用户信息是否可用
 * @returns {boolean} 如果本地用户信息存在，则返回 true；否则返回 false
 */
export const isLogin = () => {
  const data = siteData();
  // 由于移除了登录系统，改为本地数据模式
  // 检查本地存储的用户数据或 IndexedDB 中是否存在用户信息
  const userInfo = localStorage.getItem('userInfo');
  const hasUserData = userInfo !== null && userInfo !== '' && userInfo !== 'undefined';
  data.userLoginStatus = hasUserData;
  return hasUserData;
};
