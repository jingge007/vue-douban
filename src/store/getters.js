export const movie = state => state.movie                                           // 电影的信息

export const wantedMovies = state => state.wantedMovies                            // 想看的电影

export const watchedMovies = state => state.watchedMovies                         // 看过的电影

export const reviewsType = state => state.reviewsType                            // 电影的短评或影评的类型

export const reviewId = state => state.reviewId                                 // 电影影评的列表ID

export const favoriteComments = state => state.favoriteComments                // 电影短评的点赞

export const searchHistory = state => state.searchHistory                     // 搜索历史，每次刷新从缓存中读取

export const currentCelebrityId = state => state.currentCelebrityId         // 影人的id

export const collected = state => state.collected                          // 收藏影人


