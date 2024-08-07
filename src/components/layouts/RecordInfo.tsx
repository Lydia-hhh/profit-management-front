// src/components/RecordTable.tsx
import React, { useState, useEffect, useRef } from 'react';
import { Breadcrumb, Layout, Menu, theme, Alert, Flex } from "antd";
import { Table, Button, message, Modal, Form, Input, InputNumber, Popconfirm, List, Spin } from 'antd';
import { ColumnsType } from 'antd/lib/table';
import { PlusOutlined, DeleteOutlined, EditOutlined, LoadingOutlined } from '@ant-design/icons';
import { diagramAll, productDelete, recordDelete, recordList } from "../../store/features/portfolioSlice";
import { unwrapResult } from "@reduxjs/toolkit";
import { useDispatch } from "react-redux";
import * as echarts from 'echarts';


const { Content, Sider } = Layout;

interface PieChartDataItem {
  name: string;
  value: number;
}

interface Statistical {
  category: PieChartDataItem[];
  daily_return: string;
  daily_return_rate: string;
  dividend_yields: PieChartDataItem[];
  list_data: string[];
  marketCap: PieChartDataItem[];
  total_property: string;
  total_return: string;
  total_return_rate: string;
  trailingPE: PieChartDataItem[];
  sector: PieChartDataItem[];
}

const RecordInfo: React.FC<{ portfolio_id: string }> = ({ portfolio_id }) => {
  const dispatch = useDispatch();
  const [statisticalInfo, setStatisticalInfo] = useState<Statistical>();
  const [pieOption, setPieOption] = useState<any>(null);
  const chartRef = useRef<any>(null);
  const [loading, setLoading] = useState(false);
  const [selectedItemIndex, setSelectedItemIndex] = useState<number | null>(null);
  const [infoLoading,setinfoLoading]=useState<boolean>(false);

  const fetchRecords = () => {
    try {
        setinfoLoading(true)
        dispatch(recordList({portfolio_id}) as any).then(unwrapResult).then((res: any) => {
          setinfoLoading(false)
            console.log("getRecordList result: ", res)
            if (res && res.code == 200) {
                const info = res.data['statistical_info']
                setStatisticalInfo(res.data['statistical_info']);
                if(info)
                {
                    setPieOption(getPieOption(info.category?info.category:[],"Portfolio Breakdown","The percentage of your portfolio that is invested in different asset types."));
                    setSelectedItemIndex(0);
                }
            }
        })
    } catch (error) {
      message.error('Failed to fetch records');
    }
  };


  const getPieOption = (data: PieChartDataItem[], title: String | undefined, subtitle: String | undefined) => ({
    backgroundColor: 'transparent',
    title: [{
      text: title,
      left: 'center'
    },
    {
      text: subtitle,
      left: '0%',
      top: '85%',
      textStyle: {
        fontSize: 14,
        color: '#666'
      }
    }
    ],
    tooltip: {
      trigger: 'item'
    },
    legend: {
      orient: 'vertical',
      left: 'left'
    },
    series: [
      {
        name: 'Values',
        type: 'pie',
        radius: '50%',
        data: data.map(item => ({ value: item.value, name: item.name })),
        emphasis: {
          itemStyle: {
            shadowBlur: 10,
            shadowOffsetX: 0,
            shadowColor: 'rgba(0, 0, 0, 0.5)'
          }
        }
      }
    ]
  });

  const handleListItemClick = (index: number) => {
    setLoading(true);
    setSelectedItemIndex(index);
    let data: PieChartDataItem[] = [];
    let title;
    let subtitle;
    if (statisticalInfo) {
      switch (index) {
        case 0:
          data = statisticalInfo.category?statisticalInfo.category:[];
          title = "Portfolio Breakdowm";
          subtitle = "The percentage of your portfolio that is invested in different asset types.";
          break;
        case 1:
          data = statisticalInfo.marketCap?statisticalInfo.marketCap:[]
          title = 'Market Cap';
          subtitle = "A valuation method that multiplies the price of a company's stock by the total number of outstanding shares.\nSmall company: market cap below $2B.\nMedium company: market cap $2B - $10B.\nLarge company: market cap above $10B.";
          break;
        case 2:
          data = statisticalInfo.dividend_yields?statisticalInfo.dividend_yields:[];
          title = 'Dividend Yield';
          subtitle = "A ratio (dividend/price) that estimates how much a company will pay out in dividends each year compared to its stock price.\nLow: ratio less than 1%.\nMedium: ratio 1%-3%.\nHigh: ratio greater than 3%."
          break;
        case 3:
          data = statisticalInfo.trailingPE?statisticalInfo.trailingPE:[];
          title = 'P/E ratio';
          subtitle = "The ratio of current share price to trailing twelve month earnings per share (EPS) that signals if the price is high or low \ncompared to other stocks.\nLow: ratio less than 10.\nMedium: ratio 10-20.\nHigh: ratio greater than 20."
          break;
        case 4:
          data = statisticalInfo.sector?statisticalInfo.sector:[];
          title = 'Sector concentration';
          subtitle = ""
          break;
        default:
          data = [];
          title = '';
          subtitle = '';
      }
    }
    setPieOption(getPieOption(data, title, subtitle));
    setLoading(false);
  };

  useEffect(() => {
    console.log("statisticInfo")
    fetchRecords();
    console.log("statisticInfo")
    console.log(statisticalInfo);
  }, [portfolio_id]);

  useEffect(() => {
    if (chartRef.current && pieOption) {
      const chartInstance = echarts.init(chartRef.current);
      chartInstance.setOption(pieOption);
      const handleResize = () => chartInstance.resize();
      window.addEventListener('resize', handleResize);
      return () => window.removeEventListener('resize', handleResize);
    }
  }, [pieOption]);

  if (!statisticalInfo) {
    return null;
  }

  return (
    <Spin indicator={<LoadingOutlined spin />} spinning={infoLoading}>
      <Flex style={{width:'100%',height:'500px'}} align='center' justify='space-between'>
      <div style={{ width: '300px', marginRight: '20px' }}>
        <List
          bordered
          dataSource={statisticalInfo.list_data}
          renderItem={(item, index) => (
            <List.Item onClick={() => handleListItemClick(index)}
              style={{ backgroundColor: index === selectedItemIndex ? '#e6f7ff' : 'transparent' }}>
              {item}
            </List.Item>
          )}
        />
      </div>
      <div
        style={{
          flex: 1,
          background: 'transparent', // 背景透明
          textAlign: 'center',
          height: '400px',
          position: 'relative',
        }}
        ref={chartRef}
      >
        {loading ? <Spin size="large" /> : null}
      </div>
    </Flex>
    </Spin>
    

  );
};

export default RecordInfo;
