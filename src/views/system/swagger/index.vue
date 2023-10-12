<!--
 * @description 系统接口页面
 * @author juliy
 * @date 2023/10/12 15:38
-->
<template>
  <my-iframe v-model:src="url" />
</template>

<script setup lang='ts'>
const url = ref(import.meta.env.VITE_APP_BASE_API + '/doc.html');
</script>
