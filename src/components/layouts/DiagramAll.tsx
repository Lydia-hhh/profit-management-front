import React, { useEffect, useState } from 'react';
import { Button, Dropdown, Empty, message, Tabs, Typography } from 'antd';
import type { MenuProps, TabsProps } from 'antd';
import LineChart from './LineChart';
import { useDispatch } from 'react-redux';
import {diagramAll, diagramProfit, selectAddItem, selectSelectedList} from '../../store/features/portfolioSlice';
import { unwrapResult } from '@reduxjs/toolkit';
import { UserOutlined } from '@ant-design/icons';
import {useAppSelector} from "../../store/hooks";

function DiagramAll({ portfolio_id }: any) {
  const [timePrice, settimePrice] = useState<any[]>([]);
  const [disabled, setdisabled] = useState<string>("all")
  const [loading, setloading] = useState<boolean>(false);
  const [time_range, setTimeRange] = useState<string>("1d");
  const dispatch = useDispatch();
  const selectedSubRecordIds=useAppSelector(selectSelectedList);
  const onChange = (key: string) => {
    setTimeRange(key)
    getDiagramAll(key);
  };
  const getDiagramAll = (time_range: any) => {
    let data: any[] = [];
    setdisabled(time_range)
    setloading(true);
    let records_id = selectedSubRecordIds==null?"[2]":selectedSubRecordIds
    console.log("ids: "+records_id)
    dispatch(diagramAll({ records_id, time_range }) as any).then(unwrapResult).then((res: any) => {
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
        <LineChart timePrice={timePrice} loading={loading} />
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
    getDiagramAll(time_range);
  }, [])
  useEffect(() => {
    settimePrice([]);
    getDiagramAll(time_range);
  }, [selectedSubRecordIds])
  return (
    <div style={{width:'100%'}}>
      <Tabs defaultActiveKey="1" items={items} onChange={onChange} />
    </div>
  )
}
export default DiagramAll;
