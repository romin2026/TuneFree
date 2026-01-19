<template>
    <div class="desktop-lyric" :class="{ locked: isLocked }">
        <div 
            class="lyric" 
            :class="{ transitioning: isTransitioning }" 
            :style="{ color: lyricColors[currentColorIndex] }" 
            @mouseenter="isHovered = true" 
            @mouseleave="isHovered = false"
        >
            <div class="color-icon" v-if="isHovered && !isLocked" @click="toggleLyricColor">
                🎨
            </div>
            <div class="lock-icon" v-if="isHovered" @click="lockLyric" @mouseenter="isLockHovered = true" @mouseleave="isLockHovered = false">
                {{ 
                    isLocked ? '🔒' : '🔓'
                }}
            </div>
            {{ currentLyric }}
        </div>
    </div>
</template>

<script setup>
import { onMounted, ref, onBeforeUnmount, watch } from 'vue';

let winPos = null;
const hasElectron = typeof electron !== "undefined";
let dragging = false;
const currentLyric = ref('😘TuneFree By Sayqz🌴');
const isTransitioning = ref(false);
const isLocked = ref(false);
const isLockHovered = ref(false);
const isHovered = ref(false); 
const lyricColors = ref([
    '#ff2e63', '#2eff63', '#2e63ff', '#ff63e6', '#f0e130',
    '#ff4500', '#ff8c00', '#ffd700', '#adff2f', '#00fa9a',
    '#00bfff', '#1e90ff', '#4169e1', '#8a2be2', '#ff1493',
    '#ff69b4', '#db7093', '#c71585', '#00ffff', '#7fffd4',
    '#f5deb3', '#d2691e', '#8b4513', '#ff6347', '#ffdab9',
    '#fff0f5', '#e6e6fa', '#d8bfd8', '#dda0dd', '#b0e0e6',
    '#afeeee', '#98fb98', '#90ee90', '#32cd32', '#228b22',
    '#8fbc8f', '#20b2aa', '#4682b4', '#5f9ea0', '#6495ed',
    '#7b68ee', '#9370db', '#8b008b', '#ff7f50', '#ff1493',
    '#ffa07a', '#e9967a', '#f08080', '#cd5c5c', '#dc143c',
    '#ff4500', '#ff8c00', '#ffd700', '#ffdead', '#f5f5dc',
]);
const currentColorIndex = ref(parseInt(localStorage.getItem('currentColorIndex'), 10) || 0); 

let lyricInterval = null;
const handleLyricUpdate = (_, payload) => {
    const newLyric = payload?.currentLyric || '😘TuneFree By Sayqz🌴';
    if (newLyric !== currentLyric.value) {
        isTransitioning.value = true;
        setTimeout(() => {
            currentLyric.value = newLyric;
            isTransitioning.value = false;
        }, 300);
    }
};

const winDown = (ev) => {
    if (!hasElectron || isLocked.value) return;
    dragging = true;
    winPos = JSON.parse(electron.ipcRenderer.sendSync("lyric-drag-start"));
}

const winMove = (ev) => {
    if (!hasElectron || !dragging || isLocked.value) return;
    electron.ipcRenderer.send("lyric-drag-moving", JSON.stringify({
        x: ev.screenX - winPos.x,
        y: ev.screenY - winPos.y,
    }));
}

const winUp = (ev) => {
    dragging = false;
}

const lockLyric = () => {
    isLocked.value = !isLocked.value;
}

watch(isLocked, (flag) => {
    if(!hasElectron) return;
    if(flag){
        electron.ipcRenderer.send("lyric-lock");
    }
    else{
        electron.ipcRenderer.send("lyric-unlock");
    }
});

watch(isLockHovered, (flag) => {
    if(!hasElectron) return;
    if(flag){
        electron.ipcRenderer.send("lyric-unlock");
    }
    else if(isLocked.value){
        electron.ipcRenderer.send("lyric-lock");
    }
});

const updateLyrics = () => {
    try {
        const newIndex = parseInt(localStorage.getItem('newIndex'), 10);
        let newCurrentLyric = '';

        if (newIndex === -1 || isNaN(newIndex)) {
            newCurrentLyric = '😘TuneFree By Sayqz🌴';
        } else {
            newCurrentLyric = localStorage.getItem('currentLyric') || '😘TuneFree By Sayqz🌴';
        }

        if (newCurrentLyric !== currentLyric.value) {
            isTransitioning.value = true; 
            setTimeout(() => {
                currentLyric.value = newCurrentLyric;
                isTransitioning.value = false; 
            }, 300); 
        }
    } catch (error) {
        console.error('更新歌词出错:', error);
        currentLyric.value = '😘TuneFree By Sayqz🌴';
    }
    // 使用 setTimeout 替代递归 setInterval，防止栈溢出
    lyricInterval = setTimeout(updateLyrics, 200);
}

const toggleLyricColor = () => {
    currentColorIndex.value = (currentColorIndex.value + 1) % lyricColors.value.length;
    localStorage.setItem('currentColorIndex', currentColorIndex.value);
}

onMounted(() => {
    window.addEventListener("mousedown", winDown);
    window.addEventListener("mousemove", winMove);
    window.addEventListener("mouseup", winUp);
    if (hasElectron) {
        electron.ipcRenderer.on("lyric-update", handleLyricUpdate);
    }

    updateLyrics();
});

onBeforeUnmount(() => {
    window.removeEventListener("mousedown", winDown);
    window.removeEventListener("mousemove", winMove);
    window.removeEventListener("mouseup", winUp);
    if (hasElectron) {
        electron.ipcRenderer.off("lyric-update", handleLyricUpdate);
    }
    if (lyricInterval) {
        clearTimeout(lyricInterval);
        lyricInterval = null;
    }
});
</script>

<style>
@import url('https://fonts.font.im/css2?family=Poppins:wght@400;700&display=swap');
@import url('https://fonts.font.im/css2?family=Comfortaa:wght@400;700&display=swap');

html, body {
    background-color: transparent !important;
}
.desktop-lyric {
    width: 100%;
    height: 100%;
    font-size: 32px; 
    text-align: center;
}
.desktop-lyric.locked * {
}
.lyric {
    transition: opacity 0.3s ease, transform 0.3s ease; 
    opacity: 1;
    font-weight: bold; 
    font-family: 'Poppins', sans-serif; 
    text-shadow: 2px 2px 5px rgba(0, 0, 0, 0.7); 
    transform: translateY(0); 
    position: relative;
}

.lyric.transitioning {
    opacity: 0;
    transform: translateY(10px); 
}

.color-icon {
    position: absolute;
    top: -30px; 
    left: 47%;
    transform: translateX(-50%);
    cursor: pointer;
    font-size: 24px; 
    opacity: 0.7;
    transition: opacity 0.3s;
}
.lock-icon {
    position: absolute;
    top: -30px; 
    left: 53%;
    transform: translateX(-50%);
    cursor: pointer;
    font-size: 24px; 
    opacity: 0.7;
    transition: opacity 0.3s;
}

.color-icon:hover {
    opacity: 1; 
}
.lock-icon:hover {
    opacity: 1; 
}
</style>
