import * as types from './mutation-types'

const mutations = {
  [types.SET_MOVIE](state, movie) {                        // 电影的信息
    state.movie = movie
  },
  [types.SET_WANTED_MOVIES](state, movies) {               // 想看的电影
    state.wantedMovies = movies
  },
  [types.SET_WATCHED_MOVIES](state, movies) {              // 看过的电影
    state.watchedMovies = movies
  },
  [types.SET_REVIEWS_TYPE](state, type) {              // 电影的短评或影评的类型
    state.reviewsType = type
  },
  [types.SET_REVIEWS_ID](state, id) {              // 电影影评的列表ID
    state.reviewId = id
  },
  [types.SET_COMMENT_ID](state, comments) {              // 电影短评的点赞
    state.favoriteComments = comments
  },
  [types.SET_SEARCH_HISTORY](state, history) {         // 搜索历史，每次刷新从缓存中读取
    state.searchHistory = history;
  },
  [types.SET_CELEBRITY_ID](state, id) {               // 影人的id
    state.currentCelebrityId = id;
  },
  [types.SET_COLLECT_CELEBRITY](state, celebrity) {        // 收藏影人
    state.collected = celebrity;
  }
}

export default mutations
