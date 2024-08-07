// src/components/RecordTable.tsx
import React, { useState, useEffect, useRef } from 'react';
import { Breadcrumb, Layout, Menu, theme,Alert } from "antd";
import { Table, Button, message, Modal, Form, Input, InputNumber, Popconfirm, List, Spin } from 'antd';
import { ColumnsType } from 'antd/lib/table';
import { PlusOutlined, DeleteOutlined, EditOutlined } from '@ant-design/icons';
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
}

const RecordInfo: React.FC<{ portfolio_id: string }> = ({ portfolio_id }) => {
  const dispatch = useDispatch();
  const [statisticalInfo, setStatisticalInfo] = useState<Statistical>();
  const [pieOption, setPieOption] = useState<any>(null);
  const chartRef = useRef<any>(null);
  const [loading, setLoading] = useState(false);

  const fetchRecords = () => {
    try {
        dispatch(recordList({portfolio_id}) as any).then(unwrapResult).then((res: any) => {
            console.log("getRecordList result: ", res)
            if (res && res.code == 200) {
                const info = res.data['statistical_info']
                setStatisticalInfo(res.data['statistical_info']);
                if(info)
                    setPieOption(getPieOption(info.category,"Portfolio Breakdown","The percentage of your portfolio that is invested in different asset types."));
            }
        })
    } catch (error) {
        message.error('Failed to fetch records');
    }
    };


  const getPieOption = (data:PieChartDataItem[],title:String|undefined,subtitle:String|undefined) => ({
    backgroundColor: 'transparent',
    title: [{
      text: title,
      left: 'center'
    },
    {
        text: subtitle,
        left: '20%',
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
    let data: PieChartDataItem[] = [];
    let title;
    let subtitle;
    if (statisticalInfo) {
      switch (index) {
        case 0:
          data = statisticalInfo.category;
          title = "Portfolio Breakdowm";
          subtitle = "                    The percentage of your portfolio that is invested in different asset types.";
          break;
        case 1:
          data = statisticalInfo.marketCap;
          title = 'Market Cap';
          subtitle = "A valuation method that multiplies the price of a company's stock by the total number of outstanding shares.\nSmall company: market cap below $2B.\nMedium company: market cap $2B - $10B.\nLarge company: market cap above $10B.";
          break;
        case 2:
          data = statisticalInfo.dividend_yields;
          title = 'Dividend Yield';
          subtitle = "A ratio (dividend/price) that estimates how much a company will pay out in dividends each year compared to its stock price.\nLow: ratio less than 1%.\nMedium: ratio 1%-3%.\nHigh: ratio greater than 3%."
          break;
        case 3:
          data = statisticalInfo.trailingPE;
          title = 'P/E ratio';
          subtitle = "The ratio of current share price to trailing twelve month earnings per share (EPS) that signals if the price is high or low compared to other stocks.\nLow: ratio less than 10.\nMedium: ratio 10-20.\nHigh: ratio greater than 20."
          break;
        default:
          data = [];
          title = '';
          subtitle = '';
      }
    }
    setPieOption(getPieOption(data,title,subtitle));
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
    return null;}

  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh' }}>
      <div style={{ width: '300px', marginRight: '20px' }}>
        <List
          bordered
          dataSource={statisticalInfo.list_data}
          renderItem={(item, index) => (
            <List.Item onClick={() => handleListItemClick(index)}>
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
          position: 'relative'
        }}
        ref={chartRef}
      >
        {loading ? <Spin size="large" /> : null}
      </div>
    </div>
  );
};
//   return (
//     <Layout style={{ minHeight: '100vh' }}>
//       <Sider width={500} style={{ background: '#fff' }}>
//         <List
//           bordered
//           dataSource={statisticalInfo ? statisticalInfo.list_data : []}
//           renderItem={(item, index) => (
//             <List.Item onClick={() => handleListItemClick(index)}>
//               {item}
//             </List.Item>
//           )}
//         />
//       </Sider>
//       <Layout style={{ background: 'transparent' }}>
//         <Content style={{ margin: '24px 16px 0', overflow: 'initial' }}>
//           <div
//             style={{ padding: 24, background: '#fff' ,textAlign: 'center', height: '400px' }}
//             ref={chartRef}
//           >
//             {loading ? <Spin size="large" /> : null}
//           </div>
//         </Content>
//       </Layout>
//     </Layout>
//   );
// };

export default RecordInfo;
