import { useRef, useEffect, useState } from "react";
import * as echarts from 'echarts';
import { Spin } from "antd";
import { LoadingOutlined } from "@ant-design/icons";
function LineChart({ timePrice,loading }: any) {
    const chartRef = useRef<any>(null);
    const myChart = useRef<any>(null);
    // const [loading, setloading] = useState<boolean>(true)
    const initChart = () => {
        if (myChart.current) {
            myChart.current.dispose();
        }
        myChart.current = echarts.init(chartRef.current);
        window.addEventListener('resize', function () {
            myChart.current.resize();
        })
    }
    const getChart = () => {
        let option = {
            title: {
                left: 'center',
                text: 'Line Chart'
            },
            tooltip: {
                trigger: 'axis',
                position: function (pt: any[]) {
                    return [pt[0], '10%'];
                }
            },
            xAxis: {
                type: 'time',
            },
            yAxis: {
                type: 'value',
            },
            series: [
                {
                    name: 'USD $',
                    type: 'line',
                    smooth: true,
                    symbol: 'none',
                    data: timePrice,
                    areaStyle: {
                        color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                            {
                                offset: 0,
                                color: 'rgb(66,133,244)'
                            },
                            {
                                offset: 1,
                                color: 'rgb(255, 255, 255)'
                            }
                        ])
                    }
                    
                }
            ],
            dataZoom: [
                {
                    type: 'inside',
                    start: 0,
                    end: 100
                },
                {
                    start: 0,
                    end: 100
                }
            ]
        };
        myChart.current.setOption(option);
    }

    useEffect(() => {
        initChart();
    }, [])
    useEffect(() => {
        // if(timePrice.length===0){
        //     setloading(true);
        // }else{
        //     setloading(false);
        // }
        getChart();
    }, [timePrice])
    return (
        <Spin indicator={<LoadingOutlined spin />} spinning={loading}>
            <div style={{ width: '100%', height: '500px' }} ref={chartRef}></div>
        </Spin>
    )
}
export default LineChart;