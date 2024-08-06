import { useRef, useEffect, useState } from "react";
import * as echarts from 'echarts';
import { Spin } from "antd";
import { LoadingOutlined } from "@ant-design/icons";
function BarChart({ timePrice,loading }: any) {
    const chartRef = useRef<any>(null);
    const myChart = useRef<any>(null);
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
                text: 'Bar Chart'
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
                    type: 'bar',
                    data: timePrice,
                    itemStyle:{
                        color:function(params:any){
                            return params.value[1]>0?'#91cc75':'#EE6666';
                        }
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
        getChart();
    }, [timePrice])
    return (
        <Spin indicator={<LoadingOutlined spin />} spinning={loading}>
            <div style={{ width: '100%', height: '500px' }} ref={chartRef}></div>
        </Spin>
    )
}
export default BarChart;