import api from '../api';
import request from "../utils/request";


export function Diagram_All({portfolio_id,time_range}:any){
    return new Promise((resolve,reject)=>{
        request.get(api.portfolioApi.DIAGRAM_ALL,{
            params:{portfolio_id,time_range}
        }).then((res)=>{
            resolve(res);
        }).catch((err)=>{
            reject(err)
        })
    })
}
export function Diagram_Profit({portfolio_id,time_range}:any){
    return new Promise((resolve,reject)=>{
        request.get(api.portfolioApi.DIAGRAM_PROFIT,{
            params:{portfolio_id,time_range}
        }).then((res)=>{
            resolve(res);
        }).catch((err)=>{
            reject(err);
        })
    })
}
export function Diagram_Distribution({portfolio_id}:any){
    return new Promise((resolve,reject)=>{
        request.get(api.portfolioApi.DIAGRAM_DISTRIBUTION,{
            params:{portfolio_id}
        }).then((res)=>{
            resolve(res);
        }).catch((err)=>{
            reject(err);
        })
    })
}
export function Portfolio_List(){
    return new Promise((resolve,reject)=>{
        request.get(api.portfolioApi.PORTFOLIO_LIST).then((res)=>{
            resolve(res);
        }).catch((err)=>{
            reject(err);
        })
    })
}
export function Portfolio_News({portfolio_id}:any){
    return new Promise((resolve,reject)=>{
        request.get(api.portfolioApi.PORTFOLIO_NEWS,{
            params:{portfolio_id}
        }).then((res)=>{
            resolve(res);
        }).catch((err)=>{
            reject(err);
        })
    })
}
export function Product_News({item_id}:any){
    return new Promise((resolve,reject)=>{
        request.get(api.portfolioApi.PRODUCT_NEWS,{
            params:{item_id}
        }).then((res)=>{
            resolve(res);
        }).catch((err)=>{
            reject(err);
        })
    })
}