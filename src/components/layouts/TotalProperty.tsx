import { useEffect } from "react";
import { selectStatisticalInfo } from "../../store/features/portfolioSlice";
import { useAppSelector } from "../../store/hooks";

function TotalProperty(){
    const statistical_info=useAppSelector(selectStatisticalInfo);
    useEffect(()=>{
    },[statistical_info?.total_property])
    return(
        <div style={{fontSize:'20px',fontWeight:'10px'}}>${statistical_info?.total_property}</div>
    )
}
export default TotalProperty;