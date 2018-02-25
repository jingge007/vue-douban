import * as types from './mutation-types.js'

import {saveWatchedMovie, saveWantedMovie, saveComment, saveSearch, deleteSearch, clearSearch, saveCelebrity} from '../common/js/cache.js'


export const markWatchedMovie = function ({commit}, movie) {                // 看过的电影
  commit(types.SET_WATCHED_MOVIES, saveWatchedMovie(movie))
}

export const markWantedMovie = function ({commit}, movie) {                 // 想看的电影
  commit(types.SET_WANTED_MOVIES, saveWantedMovie(movie))
}

export const markComment = function ({commit}, id) {                 // 电影短评的点赞
  commit(types.SET_COMMENT_ID, saveComment(id))
}

export const saveSearchHistory = function ({commit}, query) {           // 保存搜索结果数据
  commit(types.SET_SEARCH_HISTORY, saveSearch(query));
};

export const deleteSearchHistory = function ({commit}, query) {          // 删除搜索结果的数据
  commit(types.SET_SEARCH_HISTORY, deleteSearch(query));
};

export const clearSearchHistory = function ({commit}) {                // 清空所有的搜索记录
  commit(types.SET_SEARCH_HISTORY, clearSearch());
};

export const markCelebrity = function ({commit}, celebrity) {                // 收藏影人
  commit(types.SET_COLLECT_CELEBRITY, saveCelebrity(celebrity));
};
