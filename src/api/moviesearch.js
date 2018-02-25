import axios from 'axios';
import {commonParams} from './config';

export function movieSearch(query, start, count) {             // 通过搜索框搜索数据
  const url = '/v2/movie/search';
  const data = Object.assign({}, commonParams, {
    q: query,
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

export function tagSearch(tag, start, count) {               // 通过关键词搜索数据
  const url = '/v2/movie/search';
  const data = Object.assign({}, commonParams, {
    tag,
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

