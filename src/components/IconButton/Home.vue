<!--
 * @description 博客首页
 * @author JuLiy
 * @date 2023/3/20 20:31
-->
<template>
  <div>
    <svg-icon icon-class="home" size="1.2rem" @click="goto"></svg-icon>
  </div>
</template>

<script lang="ts" setup>

const url = import.meta.env.VITE_BLOG_URL;

const goto = () => {
  window.open(url);
};
</script>

<style lang="scss" scoped></style>
