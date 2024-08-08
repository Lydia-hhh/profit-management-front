import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import service from './../../service';
import { RootState } from "..";
const initialState={
    add_item:true,
    active_key:undefined,
    selectedSubRecordIds:[],
    records:[],
    deleted:true,
    statistical_info:{
        total_property:"0",
        total_return:"0",
        total_return_rate:"0",
        daily_return:"0",
        daily_return_rate:"0"

    }
};
export const diagramAll=createAsyncThunk("portfolio/diagramAll",async(userInput:any)=>{
    try{
        const res=await service.portfolioService.Diagram_All(userInput);
        return res;
    }catch(err:any){
        console.log(err)
        alert("server error, please contact developer")
    }
})
export const diagramSingle=createAsyncThunk("portfolio/diagramSingle",async(userInput:any)=>{
    try{
        const res=await service.portfolioService.Diagram_Single(userInput);
        return res;
    }catch(err:any){
        console.log(err)
        alert("server error, please contact developer")
    }
})
export const diagramProfit=createAsyncThunk("portfolio/diagramProfit",async(userInput:any)=>{
    try{
        const res=await service.portfolioService.Diagram_Profit(userInput);
        return res;
    }catch(err:any){
        console.log(err);
        alert("server error, please contact developer")
    }
})
export const diagramDistribution=createAsyncThunk("portfolio/diagramDistribution",async(userInput:any)=>{
    try{
        const res=await service.portfolioService.Diagram_Distribution(userInput);
        return res;
    }catch(err:any){
        console.log(err);
        alert("server error, please contact developer")
    }
})
export const portfolioList=createAsyncThunk("portfolio/portfolioList",async()=>{
    try{
        const res=await service.portfolioService.Portfolio_List();
        return res;
    }catch(err:any){
        console.log(err);
        alert("server error, please contact developer")
    }
})
export const portfolioPost=createAsyncThunk("portfolio/portfolioPost",async(userInput:any)=>{
    try{
        const res=await service.portfolioService.Portfolio_Post(userInput);
        return res;
    }catch(err:any){
        console.log(err)
        alert("server error, please contact developer")
    }
})
export const portfolioDelete=createAsyncThunk("portfolio/portfolioDelete",async(userInput:any)=>{
    try{
        const res=await service.portfolioService.Portfolio_Delete(userInput);
        return res;
    }catch(err:any){
        console.log(err);
        alert("server error, please contact developer")
    }
})
export const portfolioNews=createAsyncThunk("portfolio/news",async(userInput:any)=>{
    try{
        const res=await service.portfolioService.Portfolio_News(userInput);
        return res;
    }catch(err:any){
        console.log(err)
        alert("server error, please contact developer")
    }
})
export const productNews=createAsyncThunk("products/news",async(userInput:any)=>{
    try{
        const res=await service.portfolioService.Product_News(userInput);
        return res;
    }catch(err:any){
        console.log(err)
        alert("server error, please contact developer")
    }
})
export const recordList=createAsyncThunk("portfolio/recordList",async(userInput:any)=>{
    try{
        const res=await service.portfolioService.Record_List(userInput);
        return res;
    }catch(err:any){
        console.log(err);
        alert("server error, please contact developer")
    }
})
/*fuzzy search*/
export const fuzzySearchList=createAsyncThunk("portfolio/fuzzySearchList",
    async(userInput:any)=>{
    try{
        const res=await service.portfolioService.FuzzySearch_list(userInput);

        return res;
    }catch(err:any){
        console.log(err);
        alert("server error, please contact developer")
    }
})
export const recordDelete=createAsyncThunk("portfolio/recordDelete",async(userInput:any)=>{
    try{
        const res=await service.portfolioService.Record_Delete(userInput);
        return res;
    }catch(err:any){
        console.log(err);
        alert("server error, please contact developer")
    }
})
/*get Info*/
export const productsInfo=createAsyncThunk("portfolio/productsInfo",
    async(userInput:any)=>{
    try{
        const res=await service.portfolioService.ProductInfo(userInput);
        return res;
    }catch(err:any){
        console.log(err);
        alert("server error, please contact developer")
    }
})
export const productDelete=createAsyncThunk("portfolio/productDelete",async(userInput:any)=>{
    try{
        const res=await service.portfolioService.Product_Delete(userInput);
        return res
    }catch(err:any){
        console.log(err);
        alert("server error, please contact developer")
    }
})

/*add*/
export const addProduct=createAsyncThunk("portfolio/addProduct",
    async(userInput:any)=>{
    try{
        const res=await service.portfolioService.AddProduct(userInput);
        return res;
    }catch(err:any){
        console.log(err);
        alert("server error, please contact developer")
    }
})
export const activity=createAsyncThunk("activity",async(userInput:any)=>{
    try{
        const res=await service.portfolioService.Activity(userInput);
        return res;
    }catch(err:any){
        console.log(err)
        alert("server error, please contact developer")
    }
})
export const klineData=createAsyncThunk("portfolio/klineData",async(userInput:any)=>{
    try{
        const res=await service.portfolioService.KlineData(userInput);
        return res;
    }catch(err:any){
        console.log(err);
        alert("server error, please contact developer");
    }
})
export const getProductHistoryPrice=createAsyncThunk("portfolio/getProductHistoryPrice",async(userInput:any)=>{
    try{
        const res=await service.portfolioService.ProductHistoryPrice(userInput);
        return res;
    }catch(err:any){
        console.log(err)
        alert("server error, please contact developer")
    }
})
export const getProductDetail=createAsyncThunk("portfolio/getProductDetail",async(userInput:any)=>{
    try{
        const res=await service.portfolioService.ProductDetail(userInput);
        return res;
    }catch(err:any){
        console.log(err)
        alert("server error, please contact developer")
    }
})
const portfolioSlice=createSlice({
    name:'portfolioSlice',initialState,
    reducers:{
        change_add_item:(state)=>{
            state.add_item=!state.add_item;
        },
        set_active_key:(state,action:PayloadAction<any>)=>{
            state.active_key=action.payload;
        },
        change_selected_list:(state,action:PayloadAction<any>)=>{
            state.selectedSubRecordIds=JSON.parse(action.payload);
        },
        set_records:(state,action:PayloadAction<any>)=>{
            state.records=action.payload;
        },
        delete_record:(state)=>{
            state.deleted=!state.deleted;
        },
        set_statistical_info:(state,action:PayloadAction<any>)=>{
            state.statistical_info=action.payload;
        }

    }
})
export const {change_add_item,set_active_key,change_selected_list,set_records,delete_record,set_statistical_info}=portfolioSlice.actions;
export const selectAddItem=(state:RootState)=>state.portfolioReducer.add_item;
export const selectActiveKey=(state:RootState)=>state.portfolioReducer.active_key;
export const selectSelectedList=(state:RootState)=>state.portfolioReducer.selectedSubRecordIds;
export const selectRecords=(state:RootState)=>state.portfolioReducer.records;
export const selectDelete=(state:RootState)=>state.portfolioReducer.deleted;
export const selectStatisticalInfo=(state:RootState)=>state.portfolioReducer.statistical_info;
export default portfolioSlice.reducer;
