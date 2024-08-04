/*
This directory houses all the functions used to call the API. 
It is fairly modular, most of the functions just need a url sub-path and data
and the library used or the url of the API doesnt really matter.

The different calls should be organised under different sub-directories (e.g. user/ for all user related calls)
*/

import axios from "axios";

export const API_URL = process.env.REACT_APP_API_URL || "/api";

// add fake latency to a callback
const latency = (callback, delay) => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      callback().then(resolve).catch(reject);
    }, delay);
  });
};

// different HTTP method handlers that wrap around the library
export const apiGET = (path, data) => {
  return latency(() => {
    return axios.get(`${API_URL}${path}`, data);
  }, 100) 
};

export const apiPOST = (path, data) => {
  return latency(() => {
    return axios.post(`${API_URL}${path}`, data);
  }, 100);
};

export const apiPATCH = (path, data) => {
  return axios.patch(`${API_URL}${path}`, data);
};


export const apiDELETE = (path, data) => {
  return axios.delete(`${API_URL}${path}`, data);
};
