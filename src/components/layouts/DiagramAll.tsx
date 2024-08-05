import React,{useEffect, useState} from 'react';
import { Tabs } from 'antd';
import type { TabsProps } from 'antd';
import LineChart from './LineChart';
import { useDispatch } from 'react-redux';
import { diagramAll, diagramProfit } from '../../store/features/portfolioSlice';
import { unwrapResult } from '@reduxjs/toolkit';

function DiagramAll({portfolio_id}:any){
    const [timePrice,settimePrice]=useState<any[]>([]);
    const [disabled,setdisabled]=useState<string>("all")
    const dispatch=useDispatch();
    const onChange = (key: string) => {
        settimePrice([]);
        getDiagramAll(key);
    };
    const getDiagramAll=(time_range:any)=>{
        let data:any[]=[];
        setdisabled(time_range)
        dispatch(diagramAll({portfolio_id,time_range}) as any).then(unwrapResult).then((res:any)=>{
            setdisabled("all")
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
      key: '1d',
      label: '1 day',
      children: <LineChart style={{with:'100%',height:'100%'}} timePrice={timePrice}/>,
      disabled:!(disabled==="all"||disabled==="1d")
    },
    {
      key: '5d',
      label: '5 days',
      children: <LineChart style={{with:'100%',height:'100%'}} timePrice={timePrice}/>,
      disabled:!(disabled==="all"||disabled==="5d")
    },
    {
      key: '1m',
      label: '1 month',
      children:<LineChart style={{with:'100%',height:'100%'}} timePrice={timePrice}/>,
      disabled:!(disabled==="all"||disabled==="1m")
    },
    {
        key: '6m',
        label: '6 months',
        children:<LineChart style={{with:'100%',height:'100%'}} timePrice={timePrice}/>,
        disabled:!(disabled==="all"||disabled==="6m")
      },
      {
        key: '1y',
        label: '1 year',
        children:<LineChart style={{with:'100%',height:'100%'}} timePrice={timePrice}/>,
        disabled:!(disabled==="all"||disabled==="1y")
      },
      {
        key: '5y',
        label: '5 years',
        children: <LineChart style={{with:'100%',height:'100%'}} timePrice={timePrice}/>,
        disabled:!(disabled==="all"||disabled==="5y")
      },
    ];


    useEffect(()=>{
        settimePrice([]);
        getDiagramAll('1d');
    },[])

    return(
        <div style={{width:'100%',height:'100%'}}>
            <Tabs type="card" defaultActiveKey="1" items={items} onChange={onChange}/>
        </div>
    )
}
export default DiagramAll;