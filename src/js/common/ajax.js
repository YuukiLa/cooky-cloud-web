import axios from 'axios';
import qs from 'qs';
import Utils from './utils';
import debugInfo from "less/lib/less/tree/debug-info";

// 系统令牌刷新请求对象
const refresh_service = axios.create({
  baseURL: process.env.VUE_APP_BASE_API,
  timeout: 5000,
  responseType: 'json',
  validateStatus(status) {
    return status === 200
  }
})
// 系统全局请求对象
const service = axios.create({
  baseURL: process.env.VUE_APP_BASE_API,
  timeout: 5000,
  responseType: 'json',
  validateStatus(status) {
    return status === 200
  }
})
service.interceptors.request.use(
  async config => {
    let _config = config
    try {
      const expireIn = Utils.getLocal("EXPIRES_IN")
      if (expireIn) {
        const left = expireIn - new Date().getTime()
        const refreshToken = Utils.getLocal("USER_REFRESH_TOKEN")
        if (left < 10000 && refreshToken) {
          let token = await queryRefreshToken(refreshToken)
          _config.headers['Authorization'] = 'bearer ' + token
        } else {
          if (Utils.getLocal('USER_TOKEN')) {
            _config.headers['Authorization'] = 'bearer ' + Utils.getLocal('USER_TOKEN')
          }
        }

      }
    } catch (e) {
      console.error(e)
    }
    return _config
  },
  error => {
    console.log(error)
    return Promise.reject(error)
  }
)
service.interceptors.response.use((config) => {
  return config.data
}, (error) => {
  log(error)
  if (error.response) {
    // const errorMessage = error.response.data === null ? '系统内部异常，请联系网站管理员' : error.response.data.msg
    const {status,data} = error.response
    if (status == 400) {
      // window.top.location = '/login';
      HeyUI.$Message.error(data.msg || '参数错误')
    }
    if (status == 401 || status == 403) {
      // window.top.location = '/login';
      HeyUI.$Message.error(data.msg || '暂无权限')
    }
    if (status == 404) {
      HeyUI.$Message.error(data.msg || '访问地址不存在')
    }
    if (status == 500) {
      HeyUI.$Message.error(data.msg || '后台异常')
    }
  }
  return Promise.reject(error)
})
let ajax = {
  PREFIX: '',
  requestingApi: new Set(),
  extractUrl: function (url) {
    return url ? url.split('?')[0] : '';
  },
  isRequesting: function (url) {
    let api = this.extractUrl(url);
    return this.requestingApi.has(api);
  },
  addRequest: function (url) {
    let api = this.extractUrl(url);
    this.requestingApi.add(api);
  },
  deleteRequest: function (url) {
    let api = this.extractUrl(url);
    this.requestingApi.delete(api);
  },
  refresh_token: function (refreshToken) {
    return new Promise((resolve, reject) => {
      refresh_service.post(
        '/auth/oauth/token',
        {
          refresh_token: refreshToken,
          grant_type: 'refresh_token'
        },
        {
          headers: {
            Authorization: 'basic Y29va3k6MTIzNDU2'
          },
          transformRequest: [function (data) {
            return qs.stringify(data);
          }]
        }
      ).then(res => {
        resolve(res)
      }).catch(e => {
        reject(e)
      })
    })
  },
  get: function (url, param, extendParam) {
    let params = {}
    if (param) {
      params.params = param;
    }
    return service.get(url, params);
  },
  post: function (url, data, extendParam) {
    log(url, data)
    return service.post(url, data, {
      transformRequest: [(data) => {
        return qs.stringify(data)
      }]
    });
  },
  postJson: function (url, paramJson, extendParam) {
    return service.post(
      url, paramJson
    )
  },
  putJson: function (url, paramJson, dataType, extendParam) {
    return service.put(
      url,
      paramJson
    )
  },
  delete: function (url, extendParam) {
    return service.delete(url, extendParam);
  },
  ajax: function (param, extendParam) {
    // let header = {}
    // const expireIn = Utils.getLocal("EXPIRES_IN")
    // if (expireIn) {
    //   const left = parseInt(expireIn) - new Date().getTime()
    //   const refreshToken = Utils.getLocal("USER_REFRESH_TOKEN")
    //   if (left < 10000 && refreshToken) {
    //     queryRefreshToken(this.PREFIX,refreshToken)
    //   }
    //   if(Utils.getLocal('USER_TOKEN'))
    //     header.Authorization = 'bearer ' + Utils.getLocal('USER_TOKEN')
    // }
    let params = Utils.extend({}, param, extendParam || {})
    let url = params.url
    if (params.method != 'GET') {
      if (this.isRequesting(url)) {
        return new Promise((resolve, reject) => {
          resolve({ok: false, msg: '重复请求'});
        });
      }
      if (params.repeatable === false) {
        this.addRequest(url);
      }
    }
    return service.request(params)
    // return new Promise((resolve, reject) => {
    //   return service.request(params).then((response) => {
    //     that.deleteRequest(params.url);
    //     let data = response.data;
    //     let status = response.status;
    //     // 如果后端统一封装返回，即所有的请求都是200, 错误码由返回结果提供，则使用以下代码获取状态
    //     if (status == 200) {
    //       status = data.status
    //       if (data.code == 500) {
    //         HeyUI.$Message.error(data.msg || '后台异常')
    //         return
    //       } else if (status == 401) {
    //         HeyUI.$Message.error(data.msg || '暂无权限')
    //         return
    //       }
    //       resolve(data)
    //
    //     }
    //     if (status != 200) {
    //       if (status == 400) {
    //         // window.top.location = '/login';
    //         HeyUI.$Message.error(data.msg || '参数错误')
    //
    //         reject(new Error(data.msg))
    //       }
    //       if (status == 401) {
    //         // window.top.location = '/login';
    //         HeyUI.$Message.error(data.msg || '暂无权限')
    //
    //         reject(new Error(data.msg))
    //       }
    //       if (status == 404) {
    //         HeyUI.$Message.error(data.msg || '访问地址不存在')
    //         reject(new Error(data.msg))
    //       }
    //       if (status == 500) {
    //         HeyUI.$Message.error(data.msg || '后台异常')
    //         reject(new Error(data.msg))
    //       }
    //     }
    //   }).catch(() => {
    //     that.deleteRequest(params.url);
    //     resolve({
    //       ok: false
    //     });
    //   });
    // });
  }
}

async function queryRefreshToken(refreshToken) {
  let data = await ajax.refresh_token(refreshToken)
  if (data.status === 200) {
    let res = data.data
    Utils.saveLocal("USER_TOKEN", res.access_token)
    Utils.saveLocal("USER_REFRESH_TOKEN", res.refresh_token)
    Utils.saveLocal("EXPIRES_IN", res.expires_in * 1000 + new Date().getTime())
    return res.access_token
  } else {
    HeyUI.$Message.error("刷新token过期，请重新登录")
  }
}


export default ajax;
