import axios from 'axios'
import {commonParams} from './config'

export function getMoviedetail(id) {               // 获取电影列表的详情页数据
  const url = `/v2/movie/subject/${id}`
  const data = Object.assign({}, commonParams)
  return axios.get(url, {
    params: data
  }).then((res) => {
    return Promise.resolve(res.data)
  }).catch((err) => {
    console.log(err)
  })
}


export function getAllReviews(id, start, count) {              // 获取全部的电影影评数据
  const url = `/v2/movie/subject/${id}/reviews`;
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

export function getAllComments(id, start, count) {                 // 获取全部的电影短评数据
  const url = `/v2/movie/subject/${id}/comments`;
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

export function getMovieReview(id) {                       // 获取电影影评的详情数据
  const url = `/v2/movie/review/${id}`;
  const data = Object.assign({}, commonParams);
  return axios.get(url, {
    params: data
  }).then((res) => {
    return Promise.resolve(res.data);
  }).catch((err) => {
    console.log(err);
  });
}
