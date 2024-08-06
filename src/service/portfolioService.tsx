import api from '../api';
import request from "../utils/request";


export function Diagram_All({ portfolio_id, time_range }: any) {
    return new Promise((resolve, reject) => {
        request.get(api.portfolioApi.DIAGRAM_ALL, {
            params: { portfolio_id, time_range }
        }).then((res) => {
            resolve(res);
        }).catch((err) => {
            reject(err)
        })
    })
}
export function Diagram_Single({item_id,time_range}:any){
    return new Promise((resolve,reject)=>{
        request.get(api.portfolioApi.DIAGRAM_SINGLE,{
            params:{item_id,time_range}
        }).then((res)=>{
            resolve(res);
        }).catch((err)=>{
            reject(err);
        })
    })
}
export function Diagram_Profit({ portfolio_id, time_range }: any) {
    return new Promise((resolve, reject) => {
        request.get(api.portfolioApi.DIAGRAM_PROFIT, {
            params: { portfolio_id, time_range }
        }).then((res) => {
            resolve(res);
        }).catch((err) => {
            reject(err);
        })
    })
}
export function Diagram_Distribution({ portfolio_id }: any) {
    return new Promise((resolve, reject) => {
        request.get(api.portfolioApi.DIAGRAM_DISTRIBUTION, {
            params: { portfolio_id }
        }).then((res) => {
            resolve(res);
        }).catch((err) => {
            reject(err);
        })
    })
}
export function Portfolio_List() {
    return new Promise((resolve, reject) => {
        request.get(api.portfolioApi.PORTFOLIO_LIST).then((res) => {
            resolve(res);
        }).catch((err) => {
            reject(err);
        })
    })
}
export function Portfolio_Post({ portfolio_name }: any) {
    return new Promise((resolve, reject) => {
        request.post(api.portfolioApi.PORTFOLIO, { portfolio_name }).then((res) => {
            resolve(res);
        }).catch((err) => {
            reject(err);
        })
    })
}
export function Portfolio_Delete({portfolio_id}:any){
    return new Promise((resolve,reject)=>{
        request.delete(api.portfolioApi.PORTFOLIO+"/"+portfolio_id).then((res)=>{
            resolve(res);
        }).catch((err)=>{
            reject(err);
        })
    })
}
export function Record_List({ portfolio_id }: any) {
    return new Promise((resolve, reject) => {
        const url = api.portfolioApi.PORTFOLIO + "/" + portfolio_id
        request.get(url).then((res) => {
            resolve(res);
        }).catch((err) => {
            reject(err);
        })
    })
}

export function Record_Delete({ record_id }: any) {
    return new Promise((resolve, reject) => {
        const url = api.portfolioApi.PRODUCTS + "/" + record_id
        request.delete(url).then((res) => {
            resolve(res);
        }).catch((err) => {
            reject(err);
        })
    })
}

export function Product_Delete({ portfolio_id, item_id }: any) {
    return new Promise((resolve, reject) => {
        request.delete(api.portfolioApi.PRODUCTS_DEL, {
            params: { portfolio_id, item_id }
        }).then((res) => {
            resolve(res);
        }).catch((err) => {
            reject(err);
        })
    })
}
export function Portfolio_News({ portfolio_id }: any) {
    return new Promise((resolve, reject) => {
        request.get(api.portfolioApi.PORTFOLIO_NEWS, {
            params: { portfolio_id }
        }).then((res) => {
            resolve(res);
        }).catch((err) => {
            reject(err);
        })
    })
}
export function Product_News({ item_id }: any) {
    return new Promise((resolve, reject) => {
        request.get(api.portfolioApi.PRODUCT_NEWS, {
            params: { item_id }
        }).then((res) => {
            resolve(res);
        }).catch((err) => {
            reject(err);
        })
    })
}
export function Activity({ portfolio_id }: any) {
    return new Promise((resolve, reject) => {
        const url = api.portfolioApi.ACTIVITY + "/" + portfolio_id
        request.get(url).then((res) => {
            resolve(res);
        }).catch((err) => {
            reject(err);
        })
    })
}
export function FuzzySearch_list({typeIn}:any){
    return new Promise((resolve,reject)=>{
        request.get(api.portfolioApi.PRODUCTS_SEARCH,{
            params:{typeIn}
        }).then((res)=>{
            resolve(res);
        }).catch((err)=>{
            reject(err);
        })
    })
}
export function ProductInfo({item_id}:any){
    return new Promise((resolve,reject)=>{
        request.get(api.portfolioApi.PRODUCTS_INFO,{
            params:{item_id}
        }).then((res)=>{
            resolve(res);
        }).catch((err)=>{
            reject(err);
        })
    })
}
export function AddProduct({
    portfolio_id,
    item_id,
    item_name,
    item_type,
    amount,
    buy_date,
    price,
    currency
}: any): Promise<any> {
    return new Promise((resolve, reject) => {
        request.post(api.portfolioApi.PRODUCTS_ADD, {
            portfolio_id,
            item_id,
            item_name,
            item_type,
            amount,
            buy_date,
            price,
            currency
        })
        .then(response => {
            resolve(response.data);
        })
        .catch(error => {
            reject(error);
        });
    });
}