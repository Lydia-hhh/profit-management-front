import { useDispatch } from "react-redux";
import { diagramAll } from "../../store/features/portfolioSlice";
import { unwrapResult } from "@reduxjs/toolkit";
import { useEffect } from "react";

function Home(){
    const dispatch=useDispatch();
    const test=()=>{
        const portfolio_id=1;
        const time_range="5d";
        dispatch(diagramAll({portfolio_id,time_range}) as any).then(unwrapResult).then((res:any)=>{
            console.log("result: "+res)
        })
    }
    useEffect(() => {
        test()
    })
    return(
        <div>


        </div>
    );
}
export default Home;