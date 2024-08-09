import React, { useEffect, useRef, useState } from 'react';
import { Button, Dropdown, Empty, message, Tabs, Typography } from 'antd';
import type { MenuProps, TabsProps } from 'antd';
import LineChart from './LineChart';
import { useDispatch } from 'react-redux';
import { diagramAll, diagramProfit, selectAddItem, selectSelectedList } from '../../store/features/portfolioSlice';
import { unwrapResult } from '@reduxjs/toolkit';
import { UserOutlined } from '@ant-design/icons';
import { useAppSelector } from "../../store/hooks";

function DiagramAll() {
  const [timePrice, settimePrice] = useState<any[]>([]);
  const [disabled, setdisabled] = useState<string>("all")
  const [loading, setloading] = useState<boolean>(false);
  const [time_range, setTimeRange] = useState<string>("1d");
  const dispatch = useDispatch();
  const selectedSubRecordIds = useAppSelector(selectSelectedList);
  const interValRef = useRef<any>(null);

  const onChange = (key: string) => {
    setTimeRange(key)
    getDiagramAll(key);
    setClock(key);
  };
  const getDiagramAll = (time_range: any) => {
    let data: any[] = [];
    const records_id = JSON.stringify(selectedSubRecordIds)
    if (records_id.length === 0) {
      return;
    }
    setdisabled(time_range)
    setloading(true);
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
      <LineChart title={"Total Property"} timePrice={timePrice} loading={loading} />
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

  // useEffect(() => {
  //   settimePrice([]);
  //   getDiagramAll(time_range);
  // }, [])
  const clearClock = () => {
    if (interValRef.current !== null) {
      clearInterval(interValRef.current);
      interValRef.current = null;
    }
  }
  const setClock = (time_range: any) => {
    if (time_range == '1d') {
      clearClock();
      interValRef.current = setInterval(() => {
        getDiagramAll(time_range);
      }, 60000)
    } else if (time_range == '5d') {
      clearClock();
      interValRef.current = setInterval(() => {
        getDiagramAll(time_range);
      }, 1800000)
    } else {
      clearClock();
    }
  }
  useEffect(() => {
    console.log("selectedSubRecordIds: ",selectedSubRecordIds)
    if (selectedSubRecordIds.length === 0) {
      clearClock();
    } else {
      settimePrice([]);
      getDiagramAll(time_range);
      setClock(time_range);
    }
    return () => {
      clearClock();
    }
  }, [selectedSubRecordIds])
  return (
    <div style={{ width: '100%' }}>
      <Tabs defaultActiveKey="1" items={items} onChange={onChange} />
    </div>
  )
}
export default DiagramAll;
