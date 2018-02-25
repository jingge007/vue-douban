import Vue from 'vue'
import Router from 'vue-router'
import moiveShow from 'components/moiveShow/moiveShow.vue'
import rank from 'components/rank/rank.vue'
import user from 'components/user/user.vue'
import search from 'components/search/search.vue'
import moviedetail from 'components/moviedetail/moviedetail.vue'
import allcomments from 'components/allcomments/allcomments.vue'
import reviewdetail from 'components/reviewdetail/reviewdetail.vue'
import rankdetail from 'components/rankdetail/rankdetail.vue'
import celebritydetail from 'components/celebritydetail/celebritydetail.vue'
import CelebrityWorks from 'components/CelebrityWorks/CelebrityWorks.vue'
import video from 'components/video/video.vue'
import videodetail from 'components/videodetail/videodetail.vue'


Vue.use(Router)

export default new Router({
  linkActiveClass: 'active',
  // mode: 'history',
  routes: [
    {path: '/', redirect: '/moiveshow', component: moiveShow},
    {
      path: '/moiveshow',
      component: moiveShow,
      meta: {keepAlive: true},
      children: [
        {
          path: '/moiveshow/:id',
          component: moviedetail,
          meta: {keepAlive: false}
        },
        {
          path: '/moiveshow/:id/:movietype',
          component: allcomments,
          meta: {keepAlive: true}
        },
        {
          path: '/moiveshow/:id/:movietype/:typeid',
          component: reviewdetail,
          meta: {keepAlive: true}
        }
      ]
    },
    {
      path: '/rank',
      component: rank,
      meta: {keepAlive: true},
      children: [
        {
          path: ':rankType',             // top250
          component: rankdetail,
          meta: {keepAlive: true}
        }
      ]
    },
    {
      path: '/user',
      component: user,
      meta: {keepAlive: true}
    },
    {
      path: '/search',
      component: search,
      meta: {keepAlive: false}
    },
    {
      path: '/clebrity/:clebrityid',
      component: celebritydetail,
      meta: {keepAlive: false},
      children: [
        {
          path: '/clebrity/:clebrityid/works',
          component: CelebrityWorks
        }
      ]
    },
    {
      path: '/video',
      component: video,
      meta: {keepAlive: true},
      children: [
        {
          path: '/video/:videoId',
          component: videodetail
        }
      ]
    }
  ]
})
