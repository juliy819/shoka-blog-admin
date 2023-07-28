<template>
  <el-config-provider :locale="zhCN" :size="Cookies.get('size') as any || 'default'">
    <router-view />
  </el-config-provider>
</template>

<script lang="ts" setup>

import { handleThemeStyle } from '@/utils/theme';
import useSettingStore from '@/stores/modules/setting';
import zhCN from 'element-plus/lib/locale/lang/zh-cn';
import Cookies from 'js-cookie';

onMounted(() => {
  nextTick(() => {
    handleThemeStyle(useSettingStore().theme);
  });
});

</script>