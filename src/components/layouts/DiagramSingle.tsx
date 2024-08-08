import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { diagramSingle } from "../../store/features/portfolioSlice";
import { unwrapResult } from "@reduxjs/toolkit";
import LineChart from "./LineChart";
import { Tabs, TabsProps } from "antd";

function DiagramSingle({item_id}:any){
    const [timePrice, settimePrice] = useState<any[]>([]);
    const [disabled, setdisabled] = useState<string>("all")
    const [loading, setloading] = useState<boolean>(false);
    const dispatch = useDispatch();
    const onChange = (key: string) => {
      // settimePrice([]);
      getDiagramSingle(key);
    };
    const getDiagramSingle = (time_range: any) => {
      let data: any[] = [];
      setdisabled(time_range)
      setloading(true);
      dispatch(diagramSingle({ item_id, time_range }) as any).then(unwrapResult).then((res: any) => {
        setdisabled("all")
        setloading(false);
        if (res && res.code == 200) {
          for (let i = 0; i < res.data.length; i++) {
            data.push([Date.parse(res.data[i].time), res.data[i].price])
          }
          settimePrice(data);
        }
      })
    }
    const getChildrenNode = () => {
      return (
          <LineChart title={"Price Trend"}  style={{ with: '100%', height: '100%' }} timePrice={timePrice} loading={loading} />
      )
    }
  
    const items: TabsProps['items'] = [
      {
        key: '1d',
        label: '1 day',
        children: getChildrenNode(),
        disabled: !(disabled === "all" || disabled === "1d")
      },
      {
        key: '5d',
        label: '5 days',
        children: getChildrenNode(),
        disabled: !(disabled === "all" || disabled === "5d")
      },
      {
        key: '1m',
        label: '1 month',
        children: getChildrenNode(),
        disabled: !(disabled === "all" || disabled === "1m")
      },
      {
        key: '6m',
        label: '6 months',
        children: getChildrenNode(),
        disabled: !(disabled === "all" || disabled === "6m")
      },
      {
        key: '1y',
        label: '1 year',
        children: getChildrenNode(),
        disabled: !(disabled === "all" || disabled === "1y")
      },
      {
        key: '5y',
        label: '5 years',
        children: getChildrenNode(),
        disabled: !(disabled === "all" || disabled === "5y")
      },
    ];
  
    useEffect(() => {
      settimePrice([]);
      getDiagramSingle('1d');
    }, [])
  
    return (
      <div style={{width:'100%'}}>
        <Tabs defaultActiveKey="1" items={items} onChange={onChange} />
      </div>
    )
}
export default DiagramSingle;