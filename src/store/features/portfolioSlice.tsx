import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import service from './../../service';
import { RootState } from "..";
const initialState={
    
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
const portfolioSlice=createSlice({
    name:'portfolioSlice',initialState,
    reducers:{}
})
export default portfolioSlice.reducer;