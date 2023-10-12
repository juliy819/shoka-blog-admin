import type { PermissionState } from '@/stores/interface';
import type { RouteRecordRaw } from 'vue-router';
import { constantRoutes } from '@/router';
import { loginApi } from '@/api/login';
import { defineStore } from 'pinia';
import ParentView from '@/components/ParentView.vue';
import Layout from '@/layout/index.vue';
import InnerLink from '@/layout/components/InnerLink.vue';
import { isExternal } from '@/utils/validate';

// 匹配views里面所有的.vue文件
const modules = import.meta.glob('../../views/**/**.vue');

const usePermissionStore = defineStore('usePermissionStore', {
  state: (): PermissionState => ({
    routes: [],
    addRoutes: [],
    sidebarRouters: []
  }),
  actions: {
    /**
     * 设置路由
     * @param routes 路由
     */
    setRoutes(routes: RouteRecordRaw[]) {
      this.addRoutes = routes;
      this.routes = constantRoutes.concat(routes);
    },

    /**
     * 设置侧边栏路由
     * @param routes 路由
     */
    setSidebarRouters(routes: RouteRecordRaw[]) {
      this.sidebarRouters = routes;
    },

    /**
     * 生成路由
     */
    generateRoutes(): Promise<RouteRecordRaw[]> {
      return new Promise((resolve, reject) => {
        // 向后端请求路由数据
        loginApi.getRouters()
          .then(({ data }) => {
            const sData = JSON.parse(JSON.stringify(data.data));
            const rData = JSON.parse(JSON.stringify(data.data));
            const sidebarRoutes = filterAsyncRoutes(sData);
            const rewriteRoutes = filterAsyncRoutes(rData, true);
            this.setRoutes(rewriteRoutes);
            this.setSidebarRouters(constantRoutes.concat(sidebarRoutes));
            resolve(rewriteRoutes);
          })
          .catch(error => {
            reject(error);
          });
      });
    }
  }
});

/** 遍历后台传来的路由字符串，转换为组件对象 */
const filterAsyncRoutes = (asyncRouterMap: RouteRecordRaw[], type: Boolean = false) => {
  const res: RouteRecordRaw[] = [];
  asyncRouterMap.forEach(route => {
    // 这里拿到的route中的属性均为字符串，不是RawRouteComponent等ts定义的类型
    // 需要将其解构并转为any类型以进行字符串比较判断，不然ts会报错
    const tmpRoute = { ...route } as any;

    if (type && tmpRoute.children) {
      tmpRoute.children = filterChildren(tmpRoute.children);
    }
    // 判断类型
    if (tmpRoute.component === 'Layout') {
      tmpRoute.component = Layout;
    } else if (tmpRoute.component === 'ParentView') {
      tmpRoute.component = ParentView;
    } else if (tmpRoute.component === 'InnerLink') {
      tmpRoute.component = InnerLink;
    } else {
      tmpRoute.component = loadView(tmpRoute.component);
    }
    // 给链接前加上'/'防止报错
    if (isExternal(tmpRoute.path)) {
      tmpRoute.path = `/${tmpRoute.path}`;
    }
    // 若包含子路由，则再依次转换添加
    if (tmpRoute.children !== null && tmpRoute.children && tmpRoute.children.length) {
      tmpRoute.children = filterAsyncRoutes(tmpRoute.children);
    } else {
      delete tmpRoute.children;
      delete tmpRoute.redirect;
    }
    res.push(tmpRoute);
  });
  return res;
};

/**
 * 筛选子路由（包括子路由的子路由）
 * @param childrenMap 子路由
 * @param lastRouter 上一级路由
 */
const filterChildren = (childrenMap: any, lastRouter: Boolean | any = false) => {
  let children: any[] = [];
  childrenMap.forEach((el: any) => {
    if (el.children && el.children.length) {
      if (el.component === 'ParentView' && !lastRouter) {
        el.children.forEach((c: any) => {
          c.path = el.path + '/' + c.path;
          if (c.children && c.children.length) {
            children = children.concat(filterChildren(c.children, c));
            return;
          }
          children.push(c);
        });
        return;
      }
    }
    if (lastRouter) {
      el.path = lastRouter.path + '/' + el.path;
    }
    children = children.concat(el);
  });
  return children;
};

/** 获取路由对应的组件实例 */
const loadView = (routeStr: string) => {
  let res;
  for (const path in modules) {
    const dir = path.split('views/')[1].split('/index.vue')[0];
    if (dir === routeStr) {
      res = () => modules[path]();
    }
  }
  return res;
};

export default usePermissionStore;
