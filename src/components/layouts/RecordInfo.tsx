// src/components/RecordTable.tsx
import React, { useState, useEffect, useRef } from 'react';
import { Breadcrumb, Layout, Menu, theme, Alert, Flex } from "antd";
import { Table, Button, message, Modal, Form, Input, InputNumber, Popconfirm, List, Spin } from 'antd';
import { ColumnsType } from 'antd/lib/table';
import { PlusOutlined, DeleteOutlined, EditOutlined, LoadingOutlined, ArrowUpOutlined, ArrowDownOutlined } from '@ant-design/icons';
import { diagramAll, productDelete, recordDelete, recordList, selectStatisticalInfo } from "../../store/features/portfolioSlice";
import { unwrapResult } from "@reduxjs/toolkit";
import { useDispatch } from "react-redux";
import * as echarts from 'echarts';
import classNames from 'classnames';
import { useAppSelector } from '../../store/hooks';


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
  const subtitles = [
    'The percentage of your portfolio that is\ninvested in different asset types.',
    "A valuation method that multiplies the price of a company's stock by the total number of outstanding shares.\n Small company: market cap below $2B. \nMedium company: market cap $2B - $10B. \nLarge company: market cap above $10B.",
    "A ratio (dividend/price) that estimates how much a company will pay out in dividends each year compared to its stock price.\n Low: ratio less than 1%. \nMedium: ratio 1%-3%. \nHigh: ratio greater than 3%.",
    "The ratio of current share price to trailing twelve month earnings per share (EPS) that signals if the price is high or low compared to other stocks.\nLow: ratio less than 10.\nMedium: ratio 10-20.\nHigh: ratio greater than 20.",
    "",
    '']
  const dispatch = useDispatch();
  // const [statisticalInfo, setStatisticalInfo] = useState<Statistical>();
  const [pieOption, setPieOption] = useState<any>(null);
  const chartRef = useRef<any>(null);
  const [loading, setLoading] = useState(false);
  const [selectedItemIndex, setSelectedItemIndex] = useState<number | null>(null);
  const [infoLoading, setinfoLoading] = useState<boolean>(false);
  const [subtitle, setsubtitle] = useState<any>(subtitles[0]);
  // const [value, setValue] = useState<any>(190);
  const statistical_info = useAppSelector(selectStatisticalInfo);
  const fetchRecords = () => {
    try {
      setinfoLoading(true)
      dispatch(recordList({ portfolio_id }) as any).then(unwrapResult).then((res: any) => {
        setinfoLoading(false)
        if (res && res.code == 200) {
          const info = res.data['statistical_info']
          // setStatisticalInfo(res.data['statistical_info']);
          if (info) {
            setPieOption(getPieOption(info.category ? info.category : [], "Portfolio Breakdown", "The percentage of your portfolio that is invested in different asset types."));
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
      top: 20,
      left: 'center'
    },
    {
      text: '',
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
      bottom: 10
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
    setsubtitle(subtitles[index]);
    // if (statisticalInfo) {
    //   switch (index) {
    //     case 0:
    //       data = statisticalInfo.category ? statisticalInfo.category : [];
    //       title = "Portfolio Breakdowm";
    //       subtitle = 'The percentage of your portfolio that is\ninvested in different asset types.';
    //       break;
    //     case 1:
    //       data = statisticalInfo.marketCap ? statisticalInfo.marketCap : []
    //       title = 'Market Cap';
    //       subtitle = "A valuation method that multiplies the price of a company's stock by the total number of outstanding shares. Small company: market cap below $2B. Medium company: market cap $2B - $10B. Large company: market cap above $10B.";
    //       break;
    //     case 2:
    //       data = statisticalInfo.dividend_yields ? statisticalInfo.dividend_yields : [];
    //       title = 'Dividend Yield';
    //       subtitle = "A ratio (dividend/price) that estimates how much a company will pay out in dividends each year compared to its stock price. Low: ratio less than 1%. Medium: ratio 1%-3%. High: ratio greater than 3%."
    //       break;
    //     case 3:
    //       data = statisticalInfo.trailingPE ? statisticalInfo.trailingPE : [];
    //       title = 'P/E ratio';
    //       subtitle = "The ratio of current share price to trailing twelve month earnings per share (EPS) that signals if the price is high or low compared to other stocks.Low: ratio less than 10.Medium: ratio 10-20.High: ratio greater than 20."
    //       break;
    //     case 4:
    //       data = statisticalInfo.sector ? statisticalInfo.sector : [];
    //       title = 'Sector concentration';
    //       subtitle = ""
    //       break;
    //     default:
    //       data = [];
    //       title = '';
    //       subtitle = '';
    //   }
    // }
    if (statistical_info) {
      switch (index) {
        case 0:
          data = statistical_info.category ? statistical_info.category : [];
          title = "Portfolio Breakdowm";
          subtitle = 'The percentage of your portfolio that is\ninvested in different asset types.';
          break;
        case 1:
          data = statistical_info.marketCap ? statistical_info.marketCap : []
          title = 'Market Cap';
          subtitle = "A valuation method that multiplies the price of a company's stock by the total number of outstanding shares. Small company: market cap below $2B. Medium company: market cap $2B - $10B. Large company: market cap above $10B.";
          break;
        case 2:
          data = statistical_info.dividend_yields ? statistical_info.dividend_yields : [];
          title = 'Dividend Yield';
          subtitle = "A ratio (dividend/price) that estimates how much a company will pay out in dividends each year compared to its stock price. Low: ratio less than 1%. Medium: ratio 1%-3%. High: ratio greater than 3%."
          break;
        case 3:
          data = statistical_info.trailingPE ? statistical_info.trailingPE : [];
          title = 'P/E ratio';
          subtitle = "The ratio of current share price to trailing twelve month earnings per share (EPS) that signals if the price is high or low compared to other stocks.Low: ratio less than 10.Medium: ratio 10-20.High: ratio greater than 20."
          break;
        case 4:
          data = statistical_info.sector ? statistical_info.sector : [];
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

  // useEffect(() => {
  //   fetchRecords();
  // }, [portfolio_id]);

  // useEffect(()=>{

  // },[statistical_info])

  useEffect(() => {
    if (chartRef.current) {
      const chartInstance = echarts.init(chartRef.current);
      let option=null;
      if(pieOption===null){
        console.log("render pieOption: ",statistical_info.list_data);
          option=getPieOption(statistical_info.category ? statistical_info.category : [], "Portfolio Breakdown", "The percentage of your portfolio that is invested in different asset types.");
          setSelectedItemIndex(0);
      }else{
        option=pieOption;
      }
    chartInstance.setOption(option);
    const handleResize = () => chartInstance.resize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
    }
    // if (chartRef.current && pieOption) {
    //   const chartInstance = echarts.init(chartRef.current);
    //   chartInstance.setOption(pieOption);
    //   const handleResize = () => chartInstance.resize();
    //   window.addEventListener('resize', handleResize);
    //   return () => window.removeEventListener('resize', handleResize);
    // }
  }, [pieOption, statistical_info]);

  // if (!statisticalInfo) {
  //   return null;
  // }
  if (!statistical_info) {
    return null;
  }


  return (<Spin style={{ width: '100%', height: '300px' }} indicator={<LoadingOutlined spin />} spinning={infoLoading}>
    <Flex style={{ width: '100%', height: '900px' }} vertical justify='space-between'>
      <Flex style={{ width: '100%', height: '100px' }} justify='space-between'>
        <div>
          <span>Daily Return</span>

          <div style={{ width: '160px', height: '80px', textAlign: 'center', marginTop: '10px' }} className={classNames('value', { positive: Number(statistical_info?.daily_return) > 0, negative: Number(statistical_info?.daily_return) < 0, zero: Number(statistical_info?.daily_return) == 0 })}>
            <div style={{ marginTop: '15px' }}>
              <span style={{ fontSize: '15px' }}>
                {/* {value} {value >= 0 ? (value == 0 ? '-' : '▲') : '▼'} */}
                {Number(statistical_info?.daily_return) >= 0 ? '+' : ''}  {statistical_info?.daily_return}
              </span><br />
              <span style={{ fontSize: '15px' }}>
                {Number(statistical_info?.daily_return) >= 0 ? <ArrowUpOutlined /> : <ArrowDownOutlined />}  {statistical_info?.daily_return_rate}%
              </span>
            </div>

          </div>
        </div>
        <div>
          <span>Total Revenue</span>
          <div style={{ width: '160px', height: '80px', textAlign: 'center', marginTop: '10px' }} className={classNames('value', { positive: Number(statistical_info?.total_return) > 0, negative: Number(statistical_info?.total_return) < 0, zero: Number(statistical_info?.total_return) == 0 })}>
            <div style={{ marginTop: '15px' }}>
              <span style={{ fontSize: '15px' }}>
                {Number(statistical_info?.total_return) >= 0 ? '+' : ''}  {statistical_info?.total_return}
              </span><br />
              <span style={{ fontSize: '15px' }}>
                {Number(statistical_info?.total_return) >= 0 ? <ArrowUpOutlined /> : <ArrowDownOutlined />}  {statistical_info?.total_return_rate}%
              </span>
            </div>
          </div>
        </div>


      </Flex>
      <div style={{}}>
        <List
          bordered
          // dataSource={statisticalInfo.list_data}
          dataSource={statistical_info.list_data}
          renderItem={(item, index) => (
            <List.Item onClick={() => handleListItemClick(index)}
              style={{ backgroundColor: index === selectedItemIndex ? '#e6f7ff' : 'transparent' }}>
              {item}
            </List.Item>
          )}
        />
      </div>
      {/* </Spin> */}
      <div style={{ width: '100%', height: '500px' }}>
        <div
          style={{
            background: 'transparent',
            width: '100%',
            height: '500px',
            wordWrap: 'break-word'

          }}
          ref={chartRef}
        >
          {loading ? <Spin size="large" /> : null}
        </div>
        <div style={{ wordWrap: 'break-word' }}>
          {subtitle.split('\n').map((line: any, index: any) => (
            <React.Fragment key={index}>
              {line}
              <br />
            </React.Fragment>


          ))}
        </div>

      </div>
    </Flex>
  </Spin>


  );
};

export default RecordInfo;
