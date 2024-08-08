import React,{useEffect, useState} from 'react';
import { Tabs } from 'antd';
import type { TabsProps } from 'antd';
import LineChart from './LineChart';
import { useDispatch } from 'react-redux';
import {diagramAll, diagramProfit, selectSelectedList} from '../../store/features/portfolioSlice';
import { unwrapResult } from '@reduxjs/toolkit';
import BarChart from './BarChart';
import {useAppSelector} from "../../store/hooks";

function DiagramProfit(){
    const [timePrice,settimePrice]=useState<any[]>([]);
    const [disabled,setdisabled]=useState<string>("all")
    const [loading,setloading]=useState<boolean>(false);
    const [time_range, setTimeRange] = useState<string>("1m");
    const dispatch = useDispatch();
    const selectedSubRecordIds=useAppSelector(selectSelectedList);
    const onChange = (key: string) => {
        setTimeRange(key)
        settimePrice([]);
        getDiagramProfit(key);
    };
    const getDiagramProfit=(time_range:any)=>{
        let data:any[]=[];
        const records_id =JSON.stringify(selectedSubRecordIds);
        if(records_id.length===0){
          return;
        }
        setdisabled(time_range)
        setloading(true)
        dispatch(diagramProfit({records_id,time_range}) as any).then(unwrapResult).then((res:any)=>{
          setdisabled("all")
          setloading(false)
            if(res && res.code==200){
                for(let i=0;i<res.data.length;i++){
                    data.push([Date.parse(res.data[i].time),res.data[i].price])
                }
                settimePrice(data);
            }
        })
    }
    const items: TabsProps['items'] = [
    {
      key: '1m',
      label: '1 month',
      children:<BarChart title={"Daily Return"} style={{with:'100%',height:'100%'}} timePrice={timePrice} loading={loading}/>,
      disabled:!(disabled==="all"||disabled==="1m")
    },
    {
        key: '6m',
        label: '6 months',
        children:<BarChart title={"Daily Return"} style={{with:'100%',height:'100%'}} timePrice={timePrice} loading={loading}/>,
        disabled:!(disabled==="all"||disabled==="6m")
      },
      {
        key: '1y',
        label: '1 year',
        children:<BarChart title={"Daily Return"} style={{with:'100%',height:'100%'}} timePrice={timePrice} loading={loading}/>,
        disabled:!(disabled==="all"||disabled==="1y")
      },
      {
        key: '5y',
        label: '5 years',
        children: <BarChart title={"Daily Return"} style={{with:'100%',height:'100%'}} timePrice={timePrice} loading={loading}/>,
        disabled:!(disabled==="all"||disabled==="5y")
      },
    ];
  //   useEffect(()=>{
  //     settimePrice([]);
  //     getDiagramProfit(time_range);
  // },[])

    useEffect(() => {
        settimePrice([]);
        getDiagramProfit(time_range);
    }, [selectedSubRecordIds])

    return(
        <div style={{width:'100%'}}>
            <Tabs defaultActiveKey="1" items={items} onChange={onChange}/>
        </div>
    )
}
export default DiagramProfit;
