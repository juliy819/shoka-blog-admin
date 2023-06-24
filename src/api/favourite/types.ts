import type { PageQuery, PageResult, Result } from '@/model';
import type { AxiosPromise } from 'axios';

export interface FavouriteApi {
  /**
   * 获取收藏项列表
   * @param favouriteQuery 收藏项查询参数
   * @return 收藏项列表
   */
  getFavouriteList(favouriteQuery: FavouriteQuery): AxiosPromise<Result<PageResult<Favourite[]>>>;

  /**
   * 获取收藏项分类列表
   * @return 收藏项分类列表
   */
  getFavouriteClassifyList(): AxiosPromise<Result<string[]>>;

  /**
   * 添加收藏项
   * @param favouriteForm 收藏项表单
   */
  addFavourite(favouriteForm: FavouriteForm): AxiosPromise<Result<null>>;

  /**
   * 修改收藏项
   * @param favouriteForm 收藏项表单
   */
  updateFavourite(favouriteForm: FavouriteForm): AxiosPromise<Result<null>>;

  /**
   * 删除收藏项
   * @param favouriteIds 收藏项id列表
   */
  deleteFavourites(favouriteIds: number[]): AxiosPromise<Result<null>>;
}

/**
 * 收藏项
 */
export interface Favourite {
  /**
   * 收藏项id
   */
  id: number;

  /**
   * 标题
   */
  title: string;

  /**
   * 描述
   */
  description: string;

  /**
   * 分类
   */
  classify: string;

  /**
   * 图标
   */
  icon: string;

  /**
   * 链接
   */
  url: string;

  /**
   * 排序号
   */
  orderNum: number;
}

/**
 * 收藏项表单
 */
export interface FavouriteForm {
  /**
   * 收藏项id
   */
  id?: number;

  /**
   * 标题
   */
  title: string;

  /**
   * 描述
   */
  description: string;

  /**
   * 分类
   */
  classify: string;

  /**
   * 图标
   */
  icon: string;

  /**
   * 链接
   */
  url: string;

  /**
   * 排序号
   */
  orderNum: number;
}

/**
 * 收藏项查询参数
 */
export interface FavouriteQuery extends PageQuery {
  /**
   * 关键词
   */
  keywords?: string;

  /**
   * 分类名
   */
  favouriteClassifyName?: string;
}
