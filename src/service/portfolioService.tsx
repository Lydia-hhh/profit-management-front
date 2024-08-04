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