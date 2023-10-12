import { defineStore } from 'pinia';
import type { TagsView, TagViewState } from '@/stores/interface';

const useTagStore = defineStore('useTagStore', {
  state: (): TagViewState => ({
    visitedViews: [],
    iframeViews: []
  }),
  actions: {
    /**
     * 添加标签页
     * @param view 页面
     */
    addView(view: TagsView) {
      // 若标签页已存在
      if (this.visitedViews.some(v => v.path === view.path)) {
        return;
      }
      if (view.meta?.affix) {
        // 若是固定标签页，则添加到开头
        this.visitedViews.unshift(
          // 设置标签名，若没有则设为'no-name'
          Object.assign({}, view, {
            title: view.meta?.title || 'no-name'
          })
        );
      } else {
        // 若不是固定标签页，则添加到末尾
        this.visitedViews.push(
          Object.assign({}, view, {
            title: view.meta?.title || 'no-name'
          })
        );
      }
    },

    /**
     * 添加iframe标签页
     * @param view 页面
     */
    addIframeView(view: TagsView) {
      if (this.iframeViews.some(v => v.path === view.path)) {
        return;
      }
      this.iframeViews.push(
        Object.assign({}, view, {
          title: view.meta?.title || 'no-name'
        })
      );
    },

    /**
     * 删除标签页
     * @param view 页面
     */
    delView(view: TagsView): Promise<TagsView[]> {
      return new Promise(resolve => {
        for (const [i, v] of this.visitedViews.entries()) {
          if (v.path === view.path) {
            this.visitedViews.splice(i, 1);
            break;
          }
        }
        this.iframeViews = this.iframeViews.filter(item => item.path !== view.path);
        resolve([...this.visitedViews]);
      });
    },

    /**
     * 删除其它标签页
     * @param view 页面
     */
    delOtherViews(view: TagsView): Promise<TagsView[]> {
      return new Promise(resolve => {
        this.visitedViews = this.visitedViews.filter(
          v => v.meta?.affix || v.path === view.path
        );
        this.iframeViews = this.iframeViews.filter(item => item.path === view.path);
        resolve([...this.visitedViews]);
      });
    },

    /**
     * 删除左侧标签页
     * @param view 页面
     */
    delLeftViews(view: TagsView): Promise<TagsView[]> {
      return new Promise(resolve => {
        const currentIndex = this.visitedViews.findIndex(
          v => v.path === view.path
        );
        if (currentIndex === -1) {
          return;
        }
        this.visitedViews = this.visitedViews.filter((item, idx) => {
          if (idx >= currentIndex || (item.meta && item.meta.affix)) {
            return true;
          }
          if (item.meta?.link) {
            const fi = this.iframeViews.findIndex(v => v.path === item.path);
            this.iframeViews.splice(fi, 1);
          }
          return false;
        });
        resolve([...this.visitedViews]);
      });
    },

    /**
     * 删除右侧标签页
     * @param view 页面
     */
    delRightViews(view: TagsView): Promise<TagsView[]> {
      return new Promise(resolve => {
        const currentIndex = this.visitedViews.findIndex(
          v => v.path === view.path
        );
        if (currentIndex === -1) {
          return;
        }
        this.visitedViews = this.visitedViews.filter((item, idx) => {
          if (idx <= currentIndex || (item.meta && item.meta.affix)) {
            return true;
          }
          if (item.meta?.link) {
            const fi = this.iframeViews.findIndex(v => v.path === item.path);
            this.iframeViews.splice(fi, 1);
          }
          return false;
        });
        resolve([...this.visitedViews]);
      });
    },

    /**
     * 删除所有标签页
     */
    delAllViews(): Promise<TagsView[]> {
      return new Promise(resolve => {
        this.visitedViews = this.visitedViews.filter(v => v.meta?.affix);
        this.iframeViews = [];
        resolve([...this.visitedViews]);
      });
    },

    /**
     *更新标签页
     * @param view 页面
     */
    updateView(view: TagsView) {
      for (let v of this.visitedViews) {
        if (v.path === view.path) {
          v = Object.assign(v, view);
          break;
        }
      }
    }
  },
  getters: {}
});

export default useTagStore;
