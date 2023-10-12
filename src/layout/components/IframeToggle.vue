<!--
 * @description IframeToggle
 * @author juliy
 * @date 2023/10/12 15:03
-->
<template>
  <transition-group name="fade-transform">
    <inner-link
        v-for="(item, index) in tagStore.iframeViews"
        :key="item.path"
        :iframeId="'iframe' + index"
        v-show="route.path === item.path"
        :src="item.meta?.link as string"
    ></inner-link>
  </transition-group>
</template>

<script setup lang='ts'>
import InnerLink from '@/layout/components/InnerLink.vue';
import useStore from '@/stores';

const route = useRoute();
const { tagStore } = useStore();
</script>

<style scoped lang='scss'>
</style>
