import type { AxiosPromise } from 'axios';
import type { Result } from '@/model';

/**
 * 菜单API
 */
export interface MenuApi {
  /**
   * 获取菜单列表
   * @param menuQuery 查询条件
   */
  getMenuList(menuQuery: MenuQuery): AxiosPromise<Result<Menu[]>>;

  /**
   * 获取菜单树
   * @returns 菜单树
   */
  getMenuTree(): AxiosPromise<Result<MenuTree[]>>;

  /**
   * 获取菜单选项树
   * @returns 菜单选项树
   */
  getMenuOptionTree(): AxiosPromise<Result<MenuTree[]>>;

  /**
   * 添加菜单
   * @param menuForm 菜单表单
   */
  addMenu(menuForm: MenuForm): AxiosPromise<Result<null>>;

  /**
   * 修改菜单
   * @param menuForm 菜单表单
   */
  updateMenu(menuForm: MenuForm): AxiosPromise<Result<null>>;

  /**
   * 删除菜单
   * @param menuId 菜单id
   */
  deleteMenu(menuId: number): AxiosPromise<Result<null>>;
}


/**
 * 菜单
 */
export interface Menu {
  /**
   * 菜单id
   */
  id: number;

  /**
   * 父菜单id
   */
  parentId: number;

  /**
   * 菜单类型 (M菜单 C菜单 B按钮)
   */
  menuType: string;

  /**
   * 菜单名称
   */
  menuName: string;

  /**
   * 路由地址
   */
  path: string;

  /**
   * 菜单图标
   */
  icon: string;

  /**
   * 菜单组件
   */
  component: string;

  /**
   * 权限标识
   */
  perms: string;

  /**
   * 是否为页面 (0否 1是)
   */
  isFrame: number;

  /**
   * 是否隐藏 (0否 1是)
   */
  isHidden: number;

  /**
   * 是否禁用 (0否 1是)
   */
  isDisable: number;

  /**
   * 菜单排序
   */
  orderNum: number;

  /**
   * 子菜单列表
   */
  children: Menu[];

  /**
   * 创建时间
   */
  createTime: string;
}

/**
 * 菜单查询参数
 */
export interface MenuQuery {
  /**
   * 关键词
   */
  keywords?: string;
  /**
   * 是否禁用 (0否 1是)
   */
  isDisable?: number;
}

/**
 * 菜单树
 */
export interface MenuTree {
  /**
   * 菜单id
   */
  id: number;
  /**
   * 菜单名
   */
  label: string;
  /**
   * 子菜单树
   */
  children?: MenuTree[];
}

/**
 * 菜单表单
 */
export interface MenuForm {
  /**
   * 菜单id
   */
  id?: number;

  /**
   * 父菜单id
   */
  parentId?: number;

  /**
   * 菜单名称
   */
  menuName: string;

  /**
   * 类型（M目录 C菜单 B按钮）
   */
  menuType: string;

  /**
   * 路由路径
   */
  path?: string;

  /**
   * 菜单图标
   */
  icon?: string;

  /**
   * 组件路径
   */
  component?: string;

  /**
   * 是否为页面 (0否 1是)
   */
  isFrame: number;

  /**
   * 是否隐藏 (0否 1是)
   */
  isHidden: number;

  /**
   * 是否禁用 (0否 1是)
   */
  isDisable: number;

  /**
   * 菜单排序
   */
  orderNum: number;
  
  /**
   * 权限标识
   */
  perms?: string;
}
