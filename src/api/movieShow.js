import axios from 'axios'
import {commonParams} from './config'

export function getMovieShow(start, count) {               // 正在热映的数据
  const url = '/v2/movie/in_theaters'
  const data = Object.assign({}, commonParams, {
    start,
    count
  })
  return axios.get(url, {
    params: data
  }).then((res) => {
    return Promise.resolve(res.data)
  }).catch((err) => {
    console.log(err)
  })
}

export function getComingMovie(start, count) {           // 即将上映的数据
  const url = 'v2/movie/coming_soon';
  const data = Object.assign({}, commonParams, {
    start,
    count
  });
  return axios.get(url, {
    params: data
  }).then((res) => {
    return Promise.resolve(res.data);
  }).catch((err) => {
    console.log(err);
  });
}
