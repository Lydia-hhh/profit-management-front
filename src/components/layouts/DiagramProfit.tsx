import React,{useEffect, useState} from 'react';
import { Tabs } from 'antd';
import type { TabsProps } from 'antd';
import LineChart from './LineChart';
import { useDispatch } from 'react-redux';
import { diagramAll, diagramProfit } from '../../store/features/portfolioSlice';
import { unwrapResult } from '@reduxjs/toolkit';
import BarChart from './BarChart';

function DiagramProfit({portfolio_id}:any){
    const [timePrice,settimePrice]=useState<any[]>([]);
    const dispatch=useDispatch();
    const onChange = (key: string) => {
        settimePrice([]);
        getDiagramProfit(key);
    };
    const getDiagramProfit=(time_range:any)=>{
        let data:any[]=[];
        dispatch(diagramProfit({portfolio_id,time_range}) as any).then(unwrapResult).then((res:any)=>{
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
      children: <BarChart style={{with:'100%',height:'100%'}} timePrice={timePrice}/>,
    },
    {
      key: '5d',
      label: '5 days',
      children: <BarChart style={{with:'100%',height:'100%'}} timePrice={timePrice}/>,
    },
    {
      key: '1m',
      label: '1 month',
      children:<BarChart style={{with:'100%',height:'100%'}} timePrice={timePrice}/>,
    },
    {
        key: '6m',
        label: '6 months',
        children:<BarChart style={{with:'100%',height:'100%'}} timePrice={timePrice}/>,
      },
      {
        key: '1y',
        label: '1 year',
        children:<BarChart style={{with:'100%',height:'100%'}} timePrice={timePrice}/>,
      },
      {
        key: '5y',
        label: '5 years',
        children: <BarChart style={{with:'100%',height:'100%'}} timePrice={timePrice}/>,
      },
    ];


    useEffect(()=>{
        settimePrice([]);
        getDiagramProfit('1d');
    },[])

    return(
        <div style={{width:'100%',height:'100%'}}>
            <Tabs type='card' defaultActiveKey="1" items={items} onChange={onChange}/>
        </div>
    )
}
export default DiagramProfit;