<!-- 导航栏 - 用户数据 -->
<template>
  <n-dropdown
    :show-arrow="true"
    :show="userMenuShow"
    :options="userMenuOptions"
    placement="bottom-end"
    @select="userMenuSelect"
    @clickoutside="userMenuShow = false"
  >
    <div
      class="user"
      :style="{ pointerEvents: userMenuShow ? 'none' : 'auto' }"
      @click="userMenuShow = !userMenuShow"
    >
      <div class="avatar">
        <n-avatar round>
          <n-icon depth="3">
            <SvgIcon icon="account-circle" />
          </n-icon>
        </n-avatar>
      </div>
      <div class="user-data">
        <n-text class="name">访客模式</n-text>
        <n-icon depth="3" class="more">
          <SvgIcon icon="menu-down" />
        </n-icon>
      </div>
    </div>
  </n-dropdown>
</template>

<script setup>
import { storeToRefs } from "pinia";
import { useRouter } from "vue-router";
import { NIcon, NText } from "naive-ui";
import { siteSettings } from "@/stores";
import SvgIcon from "@/components/Global/SvgIcon";

const router = useRouter();
const settings = siteSettings();
const { themeType } = storeToRefs(settings);

// 菜单数据
const userMenuShow = ref(false);

// 图标渲染
const renderIcon = (icon) => {
  return () => h(NIcon, null, () => h(SvgIcon, { icon }));
};

// 生成导航栏用户信息
const createUserData = () => {
  return h(
    "div",
    { className: "nav-user-data" },
    h(NText, { depth: 3 }, () => ["当前为访客模式，未提供账号登录功能"]),
  );
};

// 用户信息
const userMenuOptions = computed(() => [
  {
    key: "header",
    type: "render",
    render: createUserData,
  },
  {
    type: "divider",
    key: "d1",
  },
  {
    label: themeType.value === "dark" ? "浅色模式" : "深色模式",
    key: "darkOrlight",
    icon: renderIcon(themeType.value === "dark" ? "round-wb-sunny" : "round-dark-mode"),
  },
  {
    label: "全局设置",
    key: "setting",
    icon: renderIcon("round-settings"),
  },
]);

// 用户信息选中
const userMenuSelect = (key) => {
  console.log(key);
  userMenuShow.value = false;
  switch (key) {
    // 明暗切换
    case "darkOrlight":
      settings.setThemeType(themeType.value === "light" ? "dark" : "light");
      break;
    // 全局设置
    case "setting":
      router.push("/setting");
      break;
    default:
      break;
  }
};
</script>

<style lang="scss" scoped>
.user {
  display: flex;
  flex-direction: row;
  align-items: center;
  height: 34px;
  margin-left: auto;
  padding: 4px 6px 4px 0;
  background-color: var(--n-border-color);
  border-radius: 25px;
  box-sizing: border-box;
  cursor: pointer;
  -webkit-app-region: no-drag;
  .avatar {
    display: flex;
    align-items: center;
    height: 38px;
    width: 38px;
    min-width: 38px;
    margin-right: 8px;
    .n-avatar {
      width: 100%;
      height: 100%;
      align-items: center;
      justify-content: center;
      :deep(img) {
        width: 80%;
        height: 80%;
        border-radius: 50%;
      }
    }
  }
  .user-data {
    display: flex;
    align-items: center;
    max-width: 200px;
    .vip {
      margin-left: 6px;
      height: 18px;
    }
    .more {
      font-size: 20px;
      margin-left: 2px;
    }
  }
  @media (max-width: 700px) {
    padding: 0;
    .avatar {
      margin: 0;
    }
    .user-data {
      display: none;
    }
  }
}
</style>

<style lang="scss">
.nav-user-data {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 8px 12px;
  .nav-user-num {
    width: 100%;
    display: flex;
    flex-direction: row;
    align-items: center;
    cursor: pointer;
    .user-pl {
      display: flex;
      flex-direction: column;
      align-items: center;
      margin: 0px 8px;
      min-width: 30px;
      font-size: 16px;
      .n-text {
        font-size: 12px;
      }
    }
  }
  .nav-user-silder {
    text-align: center;
    width: 100%;
    margin-top: 12px;
    .n-button {
      font-size: 13px;
    }
  }
}
</style>
