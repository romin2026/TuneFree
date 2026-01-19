<!-- 全局设置 -->
<template>
  <div :class="{ setting: true, 'use-cover': themeAutoCover }">
    <n-h1 class="title">
      <n-text>全局设置</n-text>
      <div class="copyright" @click="jump">
        <div class="author">
          <n-icon depth="3" size="18">
            <SvgIcon icon="github" />
          </n-icon>
          <n-text class="author-text" depth="3">{{ packageJson.author }}</n-text>
        </div>
        <n-text class="version" depth="3">{{ packageJson.version }}</n-text>
      </div>
    </n-h1>
    <!-- 导航栏 -->
    <n-tabs
      ref="setTabsRef"
      v-model:value="setTabsValue"
      type="segment"
      @update:value="settingTabChange"
    >
      <n-tab name="setTab1"> 常规 </n-tab>
      <n-tab name="setTab2"> 系统 </n-tab>
      <n-tab name="setTab3"> 播放 </n-tab>
      <n-tab name="setTab4"> 歌词 </n-tab>
      <n-tab name="setTab5"> 下载 </n-tab>
      <n-tab name="setTab6"> 其他 </n-tab>
    </n-tabs>
    <!-- 设置项 -->
    <n-scrollbar
      ref="setScrollRef"
      :style="{
        height: `calc(100vh - ${music.getPlaySongData?.id && showPlayBar ? 328 : 248}px)`,
      }"
      class="all-set"
      @scroll="allSetScroll"
    >
      <!-- 常规 -->
      <div class="set-type">
        <n-h3 prefix="bar"> 常规 </n-h3>
        <n-card class="set-item">
            <div class="name">如果您喜欢我们的服务，可以对我们进行赞赏！<n-text class="tip">我们承诺，TuneFree永久免费。</n-text></div>

            <div class="donate-link">
                <a href="https://afdian.net/a/sayqz" target="_blank"><img width="200" src="https://pic1.afdiancdn.com/static/img/welcome/button-sponsorme.png" alt=""></a >
            </div>
          </n-card>

        <n-card class="set-item">
          <div class="name">明暗模式</div>
          <n-select
            v-model:value="themeType"
            :options="[
              {
                label: '浅色模式',
                value: 'light',
              },
              {
                label: '深色模式',
                value: 'dark',
              },
            ]"
            class="set"
            @update:value="themeAuto = false"
          />
        </n-card>
        <n-card class="set-item">
          <div class="name">明暗模式是否跟随系统</div>
          <n-switch
            v-model:value="themeAuto"
            :round="false"
            @update:value="
              (val) => {
                if (val) themeType = osThemeRef;
              }
            "
          />
        </n-card>
        <n-card class="set-item">
          <div class="name">
            开启侧边栏
            <n-text class="tip">将导航栏放于侧边显示，可展开或收起</n-text>
          </div>
          <n-switch v-model:value="showSider" :round="false" />
        </n-card>
        <n-card class="set-item">
          <div class="name">
            侧边栏展示封面
            <n-text class="tip">侧边栏歌单是否展示歌单封面</n-text>
          </div>
          <n-switch v-model:value="siderShowCover" :disabled="!showSider" :round="false" />
        </n-card>
        <n-card class="set-item">
          <div class="name">显示搜索历史</div>
          <n-switch v-model:value="showSearchHistory" :round="false" />
        </n-card>
        <n-card class="set-item">
          <div class="name">
            <div class="dev">
              显示开发者选项 <n-tag>Beta</n-tag>
            </div>
            <n-text class="tip">显示更多开发者相关功能和选项</n-text>
          </div>
          <n-switch v-model:value="showGithub" :round="false" />
        </n-card>
        <n-card class="set-item">
          <div class="name">
            主题色渐变跟随封面
            <n-text class="tip">程序启动时自动检测</n-text>
          </div>
          <n-switch
            v-model:value="themeAutoCover"
            :round="false"
            @update:value="themeAutoCoverChange"
          />
        </n-card>
        <n-card class="set-item">
          <div class="name">
            主题色渐变样式
            <n-text class="tip">
              {{
                themeAutoCoverType === "linear"
                  ? "线性渐变样式"
                  : themeAutoCoverType === "radial"
                    ? "径向渐变样式"
                    : "锥形渐变样式"
              }}
            </n-text>
          </div>
          <n-select
            v-model:value="themeAutoCoverType"
            :disabled="!themeAutoCover"
            :options="[
              {
                label: '线性',
                value: 'linear',
              },
              {
                label: '径向',
                value: 'radial',
              },
              {
                label: '次要',
                value: 'secondary',
              },
              {
                label: '次次要',
                value: 'tertiary',
              },
            ]"
            class="set"
          />
        </n-card>
      </div>
      <!-- 系统 -->
      <div v-if="checkPlatform.electron()" class="set-type">
        <n-h3 prefix="bar"> 系统 </n-h3>
        <n-card class="set-item">
          <div class="name">关闭软件时</div>
          <n-select
            v-model:value="closeType"
            :disabled="closeTip"
            :options="[
              {
                label: '最小化到任务栏',
                value: 'hide',
              },
              {
                label: '直接退出',
                value: 'close',
              },
            ]"
            class="set"
          />
        </n-card>
        <n-card class="set-item">
          <div class="name">每次关闭前都进行提醒</div>
          <n-switch v-model:value="closeTip" :round="false" />
        </n-card>
        <n-card class="set-item">
          <div class="name">任务栏显示歌曲播放进度</div>
          <n-switch
            v-model:value="showTaskbarProgress"
            :round="false"
            @update:value="closeTaskbarProgress"
          />
        </n-card>
        <n-card class="set-item">
          <div class="name">
            显示桌面歌词
            <n-text class="tip">在播放时显示浮窗歌词，方便随时了解歌词内容</n-text>
          </div>
          <n-switch v-model:value="showDesktopLyric" :round="false" />
        </n-card>
        <n-card class="set-item">
          <div class="name">关闭软件</div>
          <n-button type="error" @click="() => electron.ipcRenderer.send('window-close')">退出应用</n-button>
        </n-card>
      </div>
      <div v-else class="set-type">
        <n-h3 prefix="bar"> 系统 </n-h3>
        <n-card class="set-item">
          <div class="name">该设置项为桌面端独占功能</div>
        </n-card>
      </div>
      <!-- 播放 -->
      <div class="set-type">
        <n-h3 prefix="bar"> 播放 </n-h3>
        <n-card class="set-item">
          <div class="name">
            启动时自动播放
            <n-text class="tip">
              {{ checkPlatform.electron() ? "程序启动时自动播放上次歌曲" : "客户端独占功能" }}
            </n-text>
          </div>
          <n-switch v-model:value="autoPlay" :disabled="!checkPlatform.electron()" :round="false" />
        </n-card>
        <n-card class="set-item">
          <div class="name">
            记忆上次播放位置
            <n-text v-if="autoPlay" class="tip"> 与自动播放相冲突，已禁用 </n-text>
          </div>
          <n-switch v-model:value="memorySeek" :disabled="autoPlay" :round="false" />
        </n-card>
        <n-card class="set-item">
          <div class="name">
            音乐资源自动缓存
            <n-text class="tip"> 可能会造成加载缓慢，将在下一首播放或刷新时生效 </n-text>
          </div>
          <n-switch v-model:value="useMusicCache" :round="false" />
        </n-card>
        <n-card class="set-item">
          <div class="name">音乐渐入渐出</div>
          <n-switch v-model:value="songVolumeFade" :round="false" />
        </n-card>
        <n-card class="set-item">
          <div class="name">
            播放全部搜索歌曲
            <n-text class="tip">
              在播放搜索页面上的歌曲时，是否同时播放所有搜索结果中的歌曲
            </n-text>
          </div>
          <n-switch v-model:value="playSearch" :round="false" />
        </n-card>
        <n-card class="set-item">
          <div class="name">
            在线播放音质
            <n-text class="tip">
              {{ songLevelData[songLevel].tip }}
            </n-text>
          </div>
          <n-select v-model:value="songLevel" :options="Object.values(songLevelData)" class="set" />
        </n-card>
        <n-card class="set-item">
          <div class="name">
            底栏歌词显示
            <n-text class="tip">是否在播放时将歌手信息更改为歌词</n-text>
          </div>
          <n-switch v-model:value="bottomLyricShow" :round="false" />
        </n-card>
        <n-card class="set-item">
          <div class="name">显示播放列表歌曲数量</div>
          <n-switch v-model:value="showPlaylistCount" :round="false" />
        </n-card>
        <n-card class="set-item">
          <div class="name">
            播放器样式
            <n-text class="tip"> 播放器左侧区域样式 </n-text>
          </div>
          <n-select
            v-model:value="playCoverType"
            :options="[
              {
                label: '封面模式',
                value: 'cover',
              },
              {
                label: '唱片模式',
                value: 'record',
              },
            ]"
            class="set"
          />
        </n-card>
        <n-card class="set-item">
          <div class="name">
            播放背景样式
            <n-text class="tip">
              {{
                playerBackgroundType === "animation"
                  ? "流体效果，较消耗性能，请谨慎开启"
                  : playerBackgroundType === "blur"
                    ? "将封面模糊处理为背景"
                    : "提取封面主色为渐变色"
              }}
            </n-text>
          </div>
          <n-select
            v-model:value="playerBackgroundType"
            :options="[
              {
                label: '主色渐变',
                value: 'color',
              },
              {
                label: '封面模糊',
                value: 'blur',
              },
              {
                label: '流体效果',
                value: 'animation',
              },
            ]"
            class="set"
          />
        </n-card>
      </div>
      <!-- 歌词 -->
      <div class="set-type">
        <n-h3 prefix="bar"> 歌词 </n-h3>
        <n-card class="set-item">
          <div class="name">
            歌词位置
            <n-text class="tip">歌词显示在播放器的位置</n-text>
          </div>
          <n-select
            v-model:value="lyricsPosition"
            :options="[
              {
                label: '右侧',
                value: 'right',
              },
              {
                label: '底部',
                value: 'bottom',
              },
            ]"
            class="set"
          />
        </n-card>
        <n-card class="set-item">
          <div class="name">
            歌词模式
            <n-text class="tip">显示的歌词类型</n-text>
          </div>
          <n-select
            v-model:value="lyricsBlock"
            :options="[
              {
                label: '逐字歌词',
                value: 'yrc',
              },
              {
                label: '普通歌词',
                value: 'lrc',
              },
              {
                label: '自动选择',
                value: 'auto',
              },
            ]"
            class="set"
          />
        </n-card>
        <n-card class="set-item">
          <div class="name">
            显示逐字歌词
            <n-text class="tip">时间精度精确到字</n-text>
          </div>
          <n-switch v-model:value="showYrc" :round="false" />
        </n-card>
        <n-card class="set-item">
          <div class="name">
            逐字歌词动画
            <n-text class="tip">逐字歌词字体大小变化</n-text>
          </div>
          <n-switch v-model:value="showYrcAnimation" :disabled="!showYrc" :round="false" />
        </n-card>
        <n-card class="set-item">
          <div class="name">
            音译歌词
            <n-text class="tip">显示非中文歌词的音译版本</n-text>
          </div>
          <n-switch v-model:value="showRoma" :round="false" />
        </n-card>
        <n-card class="set-item">
          <div class="name">
            翻译歌词
            <n-text class="tip">显示歌词的翻译版本</n-text>
          </div>
          <n-switch v-model:value="showTransl" :round="false" />
        </n-card>
        <n-card class="set-item">
          <div class="name">
            歌词字体大小
            <n-text class="tip">（{{ lyricsFontSize }}px）</n-text>
          </div>
          <n-slider
            v-model:value="lyricsFontSize"
            :min="12"
            :max="48"
            :step="1"
            style="width: 200px"
          />
        </n-card>
        <n-card class="set-item">
          <div class="name">
            歌词模糊
            <n-text class="tip">将非当前歌词进行模糊处理</n-text>
          </div>
          <n-switch v-model:value="lyricsBlur" :round="false" />
        </n-card>
        <n-card class="set-item">
          <div class="name">
            鼠标悬停暂停
            <n-text class="tip">将鼠标悬停在歌词上时，是否暂停音乐播放</n-text>
          </div>
          <n-switch v-model:value="lrcMousePause" :round="false" />
        </n-card>
        <n-card class="set-item">
          <div class="name">
            歌词倒计时
            <n-text class="tip">在播放结束前 N 秒提醒</n-text>
          </div>
          <n-switch v-model:value="countDownShow" :round="false" />
        </n-card>
        <n-card class="set-item">
          <div class="name">
            使用网易云 UNM 服务器
            <n-text class="tip">某些需特殊权限的歌词可能需要此选项</n-text>
          </div>
          <n-switch v-model:value="useUnmServer" :round="false" />
        </n-card>
      </div>
      <!-- 下载 -->
      <div class="set-type">
        <n-h3 prefix="bar"> 下载 </n-h3>
        <n-card class="set-item">
          <div class="name">
            下载位置
            <n-text class="tip">{{ downloadPath }}</n-text>
          </div>
          <n-button @click="selectDownloadPath">选择位置</n-button>
        </n-card>
        <n-card class="set-item">
          <div class="name">
            下载音乐元数据
            <n-text class="tip">保存歌曲的标签信息</n-text>
          </div>
          <n-switch v-model:value="downloadMeta" :round="false" />
        </n-card>
        <n-card class="set-item">
          <div class="name">
            下载音乐封面
            <n-text class="tip">保存歌曲的专辑封面</n-text>
          </div>
          <n-switch v-model:value="downloadCover" :round="false" />
        </n-card>
        <n-card class="set-item">
          <div class="name">
            下载音乐歌词
            <n-text class="tip">保存歌曲的歌词文件</n-text>
          </div>
          <n-switch v-model:value="downloadLyrics" :round="false" />
        </n-card>
        <n-card class="set-item">
          <div class="name">
            下载加载大小
            <n-text class="tip">单位 MB，超过此大小的文件将自动跳过（设置为0表示不限制）</n-text>
          </div>
          <n-input-number v-model:value="loadSize" :min="0" class="set" />
        </n-card>
      </div>
      <!-- 其他 -->
      <div class="set-type">
        <n-h3 prefix="bar"> 其他 </n-h3>
        <n-card class="set-item">
          <div class="name">
            检查更新
            <n-text class="tip">当前版本：{{ packageJson.version }}</n-text>
          </div>
          <n-button @click="toUpdate">检查更新</n-button>
        </n-card>
        <n-card class="set-item">
          <div class="name">
            显示频谱
            <n-text class="tip">播放时显示音乐频谱效果（较消耗性能）</n-text>
          </div>
          <n-switch v-model:value="showSpectrums" :round="false" />
        </n-card>
        <n-card class="set-item">
          <div class="name">程序重置</div>
          <n-button type="warning" @click="resetApp">重置</n-button>
        </n-card>
      </div>
    </n-scrollbar>
  </div>
</template>

<script setup>
import { storeToRefs } from "pinia";
import axios from 'axios';
import { useOsTheme } from "naive-ui";
import { siteSettings, siteStatus, musicData } from "@/stores";
import { checkPlatform } from "@/utils/helper";
import debounce from "@/utils/debounce";
import packageJson from "@/../package.json";
const music = musicData();
const status = siteStatus();
const settings = siteSettings();
const { showPlayBar, coverTheme } = storeToRefs(status);
const {
  themeType,
  themeTypeName,
  themeAuto,
  themeAutoCover,
  themeAutoCoverType,
  showSider,
  closeTip,
  closeType,
  loadSize,
  songVolumeFade,
  autoPlay,
  showYrc,
  showYrcAnimation,
  countDownShow,
  playerBackgroundType,
  useUnmServer,
  showTransl,
  showRoma,
  songLevel,
  showTaskbarProgress,
  lyricsPosition,
  lyricsBlock,
  lrcMousePause,
  lyricsFontSize,
  lyricsBlur,
  showSearchHistory,
  bottomLyricShow,
  downloadPath,
  memorySeek,
  showGithub,
  playCoverType,
  playSearch,
  showPlaylistCount,
  showSpectrums,
  siderShowCover,
  useMusicCache,
  downloadMeta,
  downloadCover,
  downloadLyrics,
  showDesktopLyric,
} = storeToRefs(settings);

// 标签页数据
const setTabsRef = ref(null);
const setScrollRef = ref(null);
const setTabsValue = ref("setTab1");

const toUpdate = async () => {
  $message.info("当前版本已移除在线更新检查，请关注发布渠道获取更新");
};

// 基础数据
const osThemeRef = useOsTheme();

// 音质数据
const songLevelData = {
  standard: {
    label: "标准音质",
    tip: "标准音质 128kbps",
    value: "standard",
  },
  higher: {
    label: "较高音质",
    tip: "较高音质 328kbps",
    value: "higher",
  },
  exhigh: {
    label: "极高 HQ",
    tip: "近 CD 品质的细节体验，最高 320kbps",
    value: "exhigh",
  },
  lossless: {
    label: "无损 SQ",
    tip: "高保真无损音质，最高 48kHz/16bit",
    value: "lossless",
  },
  hires: {
    label: "高清臻音 Spatial Audio",
    tip: "环绕声体验，声音听感增强，96kHz/24bit",
    value: "hires",
  },
  jymaster: { 
    label: "超清母带 Master",
    tip: "还原音频细节，192kHz/24bit",
    value: "jymaster",
  },
  sky: {
    label: "沉浸环绕声 Surround Audio",
    tip: "沉浸式体验，最高 5.1 声道",
    value: "sky",
  },
};

// 封面自动跟随变化
const themeAutoCoverChange = (val) => {
  if ($changeThemeColor !== "undefined" && Object.keys(coverTheme.value)?.length) {
    $changeThemeColor(val ? coverTheme.value : themeTypeName.value, val);
  }
};

// 标签页切换
const settingTabChange = (name) => {
  const index = Number(name.replace("setTab", ""));
  const setDom = document.querySelectorAll(".set-type")?.[index - 1];
  if (!setDom) return false;
  // 滚动至设置分类
  setDom.scrollIntoView({ behavior: "smooth" });
};

// 设置列表滚动
const allSetScroll = debounce((e) => {
  const distance = e.target.scrollTop + 30;
  const allSetDom = document.querySelectorAll(".set-type");
  allSetDom.forEach((v, i) => {
    if (distance >= v.offsetTop) setTabsValue.value = `setTab${i + 1}`;
  });
}, 100);

// 关闭任务栏进度
const closeTaskbarProgress = (val) => {
  if (!val) electron.ipcRenderer.send("setProgressBar", "close");
};

// 选择下载位置
const selectDownloadPath = async () => {
  const selectedDir = await electron.ipcRenderer.invoke("selectDir", true);
  if (selectedDir) downloadPath.value = selectedDir;
};

// 跳转
const jump = () => {
  window.open(packageJson.home);
};

// 程序重置
const resetApp = () => {
  $dialog.warning({
    title: "程序重置",
    content: "确认重置为默认状态？你的本地数据与自定义设置都将丢失！",
    positiveText: "重置",
    negativeText: "取消",
    onPositiveClick: () => {
      if (typeof $cleanAll === "undefined") {
        return $message.error("重置操作出现错误，请重试");
      }
      $cleanAll(false);
      $message.success("重置成功，正在重启");
      setTimeout(() => {
        if (checkPlatform.electron()) {
          electron.ipcRenderer.send("window-relaunch");
        } else {
          window.location.href = "/";
        }
      }, 1000);
    },
  });
};
</script>

<style lang="scss" scoped>
.setting {
  max-width: 1200px;
  margin: 0 auto;
  .title {
    display: flex;
    flex-direction: row;
    align-items: flex-end;
    height: 58px;
    margin: 20px 0;
    font-size: 36px;
    font-weight: bold;
    .copyright {
      display: flex;
      flex-direction: row;
      align-items: center;
      margin-left: 12px;
      margin-bottom: 6px;
      font-size: 16px;
      font-weight: normal;
      cursor: pointer;
      .author {
        display: flex;
        align-items: center;
        &::after {
          content: "/";
          transform: translateY(2px);
          font-size: 14px;
          margin: 0 6px;
          opacity: 0.6;
        }
        .author-text {
          margin-left: 6px;
        }
      }
      .version {
        &::before {
          content: "v";
          margin-right: 2px;
        }
      }
    }
  }
  .n-tabs {
    height: 42px;
  }
  .set-type {
    padding-top: 30px;
    .set-item {
      width: 100%;
      border-radius: 8px;
      margin-bottom: 12px;
      &:last-child {
        margin-bottom: 0;
      }
      :deep(.n-card__content) {
        display: flex;
        flex-direction: row;
        align-items: center;
        justify-content: space-between;
      }
      .name {
        font-size: 16px;
        display: flex;
        flex-direction: column;
        padding-right: 20px;
        .dev {
          display: flex;
          flex-direction: row;
          align-items: center;
          .n-tag {
            margin-left: 6px;
          }
        }
        .tip {
          font-size: 12px;
          opacity: 0.8;
        }
      }
      .set {
        width: 200px;
        @media (max-width: 768px) {
          width: 140px;
          min-width: 140px;
        }
      }
    }
  }
  &.use-cover {
    .n-switch {
      &.n-switch--active {
        :deep(.n-switch__rail) {
          background-color: var(--main-second-color);
        }
      }
    }
  }
}
</style>
