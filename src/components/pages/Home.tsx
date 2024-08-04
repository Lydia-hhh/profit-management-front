import { useDispatch } from "react-redux";
import { diagramAll } from "../../store/features/portfolioSlice";
import { unwrapResult } from "@reduxjs/toolkit";
import { useEffect } from "react";
import DiagramAll from "../layouts/DiagramAll";
import Portfolio from "./Portfolio";

function Home(){
    const dispatch=useDispatch();
    const test=()=>{
        const portfolio_id=1;
        const time_range="5d";
        dispatch(diagramAll({portfolio_id,time_range}) as any).then(unwrapResult).then((res:any)=>{
        })
    }
    useEffect(() => {
        // test()
    })
    return(
        <div>
            <Portfolio/>
        </div>
    );
}
export default Home;