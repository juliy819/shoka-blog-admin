import type { MenuApi } from '@/api/menu/types';
import request from '@/utils/request';

export const menuApi: MenuApi = {
  getMenuList: (menuQuery) => request({
    url: '/menu/list',
    method: 'get',
    params: menuQuery
  }),

  getMenuTree: () => request({
    url: '/menu/getMenuTree',
    method: 'get'
  }),

  getMenuOptionTree: () => request({
    url: '/menu/getMenuOptionTree',
    method: 'get'
  }),

  addMenu: (menuForm) => request({
    url: '/menu',
    method: 'post',
    data: menuForm
  }),

  updateMenu: (menuForm) => request({
    url: '/menu',
    method: 'post',
    data: menuForm
  }),

  deleteMenu: (menuId) => request({
    url: `/menu/${menuId}`,
    method: 'delete'
  })
};