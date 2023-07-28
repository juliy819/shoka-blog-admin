import { createApp } from 'vue';
import { createPinia } from 'pinia';
import piniaPersist from 'pinia-plugin-persist';
import SvgIcon from '@/components/SvgIcon.vue';
import * as ElementPlusIconsVue from '@element-plus/icons-vue';
import '@/permission';
import 'nprogress/nprogress.css';
import 'virtual:svg-icons-register';
import '@/assets/styles/index.scss';
import App from './App.vue';
import router from './router';
import VueMarkdownEditor from '@kangc/v-md-editor';
import '@kangc/v-md-editor/lib/style/base-editor.css';
import vuepressTheme from '@kangc/v-md-editor/lib/theme/vuepress.js';
import '@kangc/v-md-editor/lib/theme/style/vuepress.css';
import createEmojiPlugin from '@kangc/v-md-editor/lib/plugins/emoji/index';
import '@kangc/v-md-editor/lib/plugins/emoji/emoji.css';
import createTodoListPlugin from '@kangc/v-md-editor/lib/plugins/todo-list/index';
import '@kangc/v-md-editor/lib/plugins/todo-list/todo-list.css';
import Prism from 'prismjs';

const app = createApp(App);
const pinia = createPinia();

for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
  app.component(key, component);
}

VueMarkdownEditor.use(vuepressTheme, { Prism })
  .use(createEmojiPlugin())
  .use(createTodoListPlugin());

pinia.use(piniaPersist);
app.use(pinia);
app.use(router);
app.use(VueMarkdownEditor);
app.component('svg-icon', SvgIcon);
app.mount('#app');
