<!--
 * @description 内链组件
 * @author juliy
 * @date 2023/10/12 9:52
-->
<template>
  <div :style="'height:' + height">
    <iframe
        :id="props.iframeId"
        :src="props.src"
        style="width: 100%; height: 100%; border: none;"
    ></iframe>
  </div>
</template>

<script setup lang='ts'>
const props = defineProps({
  src: {
    type: String,
    default: '/'
  },
  iframeId: {
    type: String
  }
});

const height = ref(document.documentElement.clientHeight - 94.5 + 'px');
</script>

<style scoped lang='scss'>
</style>
