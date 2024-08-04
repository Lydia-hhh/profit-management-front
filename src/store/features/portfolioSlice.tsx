import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import service from './../../service';
import { RootState } from "..";

export const diagramAll=createAsyncThunk("portfolio/diagramAll",async(userInput:any)=>{
    try{
        const res=await service.portfolioService.Diagram_All(userInput);
        return res;
    }catch(err:any){
        console.log(err)
        alert("server error, please contact developer")
    }
})
