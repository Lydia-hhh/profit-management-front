import axios from 'axios'

const pendingRequests=new Map();

const request = axios.create({
    baseURL: 'http://127.0.0.1:5050',  
    timeout: 120000
})

const getRequestKey=(config:any)=>`${config.method}:${config.url}`;
const removePendingRequest=(config:any)=>{
    const requestKey=getRequestKey(config);
    if(pendingRequests.has(requestKey)){
        const cancelToken=pendingRequests.get(requestKey);
        cancelToken("Operation canceled due to new request.");
        pendingRequests.delete(requestKey);
    }
}

// request 拦截器
request.interceptors.request.use(config => {
    // removePendingRequest(config);
    // const requestKey=getRequestKey(config);
    // config.cancelToken=new axios.CancelToken((cancel)=>{
    //     pendingRequests.set(requestKey,cancel)
    // })
    return config
}, error => {
    return Promise.reject(error)
});

// response 拦截器
// 可以在接口响应后统一处理结果
request.interceptors.response.use(
    response => {
        // const requestKey=getRequestKey(response.config);
        // pendingRequests.delete(requestKey);
        let res = response.data;
        // 如果是返回的文件
        if (response.config.responseType === 'blob') {
            return res
        }
        // 兼容服务端返回的字符串数据
        if (typeof res === 'string') {
            res = res ? JSON.parse(res) : res
        }
        return res;
    },
    error => {
        // if(axios.isCancel(error)){
        //     console.log("Request canceled: ",error.message);
        // }else{
        //     const requestKey=getRequestKey(error.config);
        //     pendingRequests.delete(requestKey);
        // }
        console.log('err' + error) // for debug
        return Promise.reject(error)
    }
)
export default request

