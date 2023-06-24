import type { FavouriteApi } from '@/api/favourite/types';
import request from '@/utils/request';

export const favouriteApi: FavouriteApi = {
  getFavouriteList: (favouriteQuery) => request({
    url: '/favourite/admin/list',
    method: 'get',
    params: favouriteQuery
  }),

  getFavouriteClassifyList: () => request({
    url: '/favourite/admin/classify',
    method: 'get'
  }),

  addFavourite: (favouriteForm) => request({
    url: '/favourite',
    method: 'post',
    data: favouriteForm
  }),

  updateFavourite: (favouriteForm) => request({
    url: '/favourite',
    method: 'put',
    data: favouriteForm
  }),

  deleteFavourites: (favouriteIds) => request({
    url: '/favourite/' + favouriteIds,
    method: 'delete'
  })
};