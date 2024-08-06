import { useEffect, useRef, useState } from "react";
import * as echarts from 'echarts';
import { Spin } from "antd";
import { LoadingOutlined } from "@ant-design/icons";
import { useDispatch } from "react-redux";
import { diagramDistribution } from "../../store/features/portfolioSlice";
import { unwrapResult } from "@reduxjs/toolkit";
function PieChart({ portfolio_id }: any) {
    const chartRef = useRef<any>(null);
    const myChart = useRef<any>(null);
    const [loading, setloading] = useState<boolean>(true);
    const [data, setData] = useState<any[]>([]);
    const dispatch = useDispatch();
    const getDiagramDistribution = () => {
        setloading(true)
        dispatch(diagramDistribution({ portfolio_id }) as any).then(unwrapResult).then((res: any) => {
            setloading(false);
            if (res && res.code == 200) {
                setData(res.data);
            }
        })
    }

    const initChart = () => {
        if (myChart.current) {
            myChart.current.dispose();
        }
        myChart.current = echarts.init(chartRef.current);
        window.addEventListener('resize', resizeChart);
    }
    const resizeChart = () => {
        if (myChart.current) {
            myChart.current.resize();
        }
    }
    const getChart = () => {
        let option = {
            title: {
                text: 'Pie Chart',
                subtext: '',
                left: 'center'
            },
            tooltip: {
                trigger: 'item'
            },
            legend: {
                orient: 'vertical',
                left: 'left'
            },
            series: [
                {
                    name: 'Access From',
                    type: 'pie',
                    radius: '50%',
                    data: data,
                    emphasis: {
                        itemStyle: {
                            shadowBlur: 10,
                            shadowOffsetX: 0,
                            shadowColor: 'rgba(0, 0, 0, 0.5)'
                        }
                    }
                }
            ]
        };
        myChart.current.setOption(option);
    }

    useEffect(() => {
        initChart();
        return () => {
            window.removeEventListener('resize', resizeChart);
        }
    }, [])
    useEffect(() => {
        getDiagramDistribution();
    }, [portfolio_id])
    useEffect(() => {
        if(myChart.current){
            getChart();
            resizeChart();
        }
    }, [data])
    return (
        <Spin indicator={<LoadingOutlined spin />} spinning={loading}>
            <div style={{ width: '100%', height: '500px' }} ref={chartRef}></div>
        </Spin>
    )
}
export default PieChart;