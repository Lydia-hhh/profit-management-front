import { LoadingOutlined } from '@ant-design/icons';
import { Spin } from 'antd';
import * as echarts from 'echarts';
import { useEffect, useRef } from "react";


function KLine({ timePrice, loading }: any) {
    const chartRef = useRef<any>(null);
    const myChart = useRef<any>(null);
    const initChart = () => {
        if (myChart.current) {
            myChart.current.dispose();
        }
        myChart.current = echarts.init(chartRef.current, null, { renderer: 'canvas' });
        window.addEventListener('resize', resizeChart);
    }
    const resizeChart = () => {
        if (myChart.current) {
            myChart.current.resize();
        }
    }
    const upColor = '#00da3c';
    const downColor = '#ec0000';
    function splitData(rawData: any) {
        let categoryData = [];
        let values = [];
        let volumes = [];
        for (let i = 0; i < rawData.length; i++) {
            categoryData.push(rawData[i][0]);
            values.push([rawData[i][1], rawData[i][2], rawData[i][3], rawData[i][4], rawData[i][5]]);
            volumes.push([i, rawData[i][5], rawData[i][1] > rawData[i][2] ? 1 : -1]);
        }
        return {
            categoryData: categoryData,
            values: values,
            volumes: volumes
        };
    }
    function calculateMA(dayCount: any, data: any) {
        var result = [];
        for (var i = 0, len = data.values.length; i < len; i++) {
            if (i < dayCount) {
                result.push('-');
                continue;
            }
            var sum = 0;
            for (var j = 0; j < dayCount; j++) {
                sum += data.values[i - j][1];
            }
            result.push(+(sum / dayCount).toFixed(3));
        }
        return result;
    }
    const getChart = () => {
        const data = splitData(timePrice);
        const option = {
            title: {
                left: 'center',
                text: "K-Line"
            },
            animation: false,
            legend: {
                bottom: 10,
                left: 'center',
                data: ['Dow-Jones index', 'MA5', 'MA10', 'MA20', 'MA30']
            },
            tooltip: {
                trigger: 'axis',
                axisPointer: {
                    type: 'cross'
                },
                borderWidth: 1,
                borderColor: '#ccc',
                padding: 10,
                textStyle: {
                    color: '#000'
                },
                position: function (pos: any, params: any, el: any, elRect: any, size: any) {
                    const obj: any = {
                        top: 10
                    };
                    obj[['left', 'right'][+(pos[0] < size.viewSize[0] / 2)]] = 30;
                    return obj;
                }
                // extraCssText: 'width: 170px'
            },
            axisPointer: {
                link: [
                    {
                        xAxisIndex: 'all'
                    }
                ],
                label: {
                    backgroundColor: '#777'
                }
            },
            toolbox: {
                feature: {
                    dataZoom: {
                        yAxisIndex: false
                    },
                    brush: {
                        type: ['lineX', 'clear']
                    }
                }
            },
            brush: {
                xAxisIndex: 'all',
                brushLink: 'all',
                outOfBrush: {
                    colorAlpha: 0.1
                }
            },
            visualMap: {
                show: false,
                seriesIndex: 5,
                dimension: 2,
                pieces: [
                    {
                        value: 1,
                        color: downColor
                    },
                    {
                        value: -1,
                        color: upColor
                    }
                ]
            },
            grid: [
                {
                    left: '10%',
                    right: '8%',
                    height: '50%'
                },
                {
                    left: '10%',
                    right: '8%',
                    top: '63%',
                    height: '16%'
                }
            ],
            xAxis: [
                {
                    type: 'category',
                    data: data.categoryData,
                    boundaryGap: false,
                    axisLine: { onZero: false },
                    splitLine: { show: false },
                    min: 'dataMin',
                    max: 'dataMax',
                    axisPointer: {
                        z: 100
                    }
                },
                {
                    type: 'category',
                    gridIndex: 1,
                    data: data.categoryData,
                    boundaryGap: false,
                    axisLine: { onZero: false },
                    axisTick: { show: false },
                    splitLine: { show: false },
                    axisLabel: { show: false },
                    min: 'dataMin',
                    max: 'dataMax'
                }
            ],
            yAxis: [
                {
                    scale: true,
                    splitArea: {
                        show: true
                    }
                },
                {
                    scale: true,
                    gridIndex: 1,
                    splitNumber: 2,
                    axisLabel: { show: false },
                    axisLine: { show: false },
                    axisTick: { show: false },
                    splitLine: { show: false }
                }
            ],
            dataZoom: [
                {
                    type: 'inside',
                    xAxisIndex: [0, 1],
                    start: 0,
                    end: 100
                },
                {
                    show: true,
                    xAxisIndex: [0, 1],
                    type: 'slider',
                    top: '85%',
                    start: 0,
                    end: 100
                }
            ],
            series: [
                {
                    name: 'Dow-Jones index',
                    type: 'candlestick',
                    data: data.values,
                    itemStyle: {
                        color: upColor,
                        color0: downColor,
                        borderColor: undefined,
                        borderColor0: undefined
                    }
                },
                // {
                //     name: 'MA5',
                //     type: 'line',
                //     data: calculateMA(5, data),
                //     smooth: true,
                //     lineStyle: {
                //         opacity: 0.5
                //     }
                // },
                // {
                //     name: 'MA10',
                //     type: 'line',
                //     data: calculateMA(10, data),
                //     smooth: true,
                //     lineStyle: {
                //         opacity: 0.5
                //     }
                // },
                // {
                //     name: 'MA20',
                //     type: 'line',
                //     data: calculateMA(20, data),
                //     smooth: true,
                //     lineStyle: {
                //         opacity: 0.5
                //     }
                // },
                // {
                //     name: 'MA30',
                //     type: 'line',
                //     data: calculateMA(30, data),
                //     smooth: true,
                //     lineStyle: {
                //         opacity: 0.5
                //     }
                // },
                {
                    name: 'Volume',
                    type: 'bar',
                    xAxisIndex: 1,
                    yAxisIndex: 1,
                    data: data.volumes
                }
            ]
        }
        myChart.current.setOption(option, true);
    }
    useEffect(() => {
        initChart();
        return () => {
            window.removeEventListener('resize', resizeChart);
        }
    }, [])
    useEffect(() => {
        if (myChart.current) {
            getChart();
            resizeChart();
        }
    }, [timePrice])
    return (
        <Spin indicator={<LoadingOutlined spin />} spinning={loading}>
            <div style={{ width: '100%', height: '500px' }} ref={chartRef}></div>
        </Spin>

    )
}
export default KLine;