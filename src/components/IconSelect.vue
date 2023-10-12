<!--
 * @description 图标选择组件
 * @author juliy
 * @date 2023/10/11 15:01
-->
<template>
  <div class="icon-select">
    <el-input v-model="iconName" clearable placeholder="请输入图标名称" @clear="filterIcons" @input="filterIcons" />
    <div class="icon-select__list">
      <div class="icon-item" v-for="(icon, index) in iconList" :key="index" @click="selectedIcon(icon)">
        <svg-icon class="icon" color="#999" :icon-class="icon" style="width: 32px; height: 48px" />
        <span class="icon-name">{{ icon }}</span>
      </div>
    </div>
  </div>
</template>

<script setup lang='ts'>
import { ref } from 'vue';

const icons = [] as string[];
const modules = import.meta.glob('@/assets/icons/*.svg');

for (const path in modules) {
  const p = path.split('assets/icons/')[1].split('.svg')[0];
  icons.push(p);
}

const iconList = ref(icons);
const iconName = ref('');
const emit = defineEmits(['selected']);

/**
 * 筛选图标
 */
const filterIcons = () => {
  iconList.value = icons;
  if (iconName.value) {
    iconList.value = icons.filter(item => item.indexOf(iconName.value) !== -1);
  }
};

/**
 * 选择图标
 * @param name
 */
const selectedIcon = (name: string) => {
  emit('selected', name);
  document.body.click();
};

/**
 * 重置数据
 */
const reset = () => {
  iconName.value = '';
  iconList.value = icons;
};

defineExpose({
  reset
});
</script>

<style scoped lang='scss'>
.icon-select {
  width: 100%;
  padding: 10px;

  &__list {
    height: 200px;
    overflow-y: scroll;

    .icon-item {
      height: 48px;
      line-height: 48px;
      cursor: pointer;
      width: 33%;
      float: left;
      display: flex;
      align-content: center;
      align-items: center;
    }

    .icon {
      margin-right: 5px;
    }

    .icon-name {
      width: 70%;
      height: 100%;
      overflow: hidden;
    }
  }
}

@media screen and (max-width: 767px) {
  .icon-select__list {
    .icon-item {
      width: 50%;
    }
  }
}
</style>
