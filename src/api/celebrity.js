import axios from 'axios';
import {commonParams} from './config';

export function getCelebrity(id) {                          // 获取影人介绍的数据
  const url = `/v2/movie/celebrity/${id}`;
  const data = Object.assign({}, commonParams);
  return axios.get(url, {
    params: data
  }).then((res) => {
    return Promise.resolve(res.data);
  }).catch((err) => {
    console.log(err);
  });
}

export function getCelebrityWorks(id, start, count) {      // 获取影人的全部作品的数据
  const url = `/v2/movie/celebrity/${id}/works`;
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
