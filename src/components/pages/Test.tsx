
import * as echarts from 'echarts';
import request from '../../utils/request';
import { useEffect } from 'react';
function Test() {

    var ROOT_PATH = 'https://echarts.apache.org/examples';

    // var chartDom = document.getElementById('main');
    // var myChart = echarts.init(chartDom);
    // var option;
    
    // const upColor = '#00da3c';
    // const downColor = '#ec0000';
    // function splitData(rawData:any) {
    //   let categoryData = [];
    //   let values = [];
    //   let volumes = [];
    //   for (let i = 0; i < rawData.length; i++) {
    //     categoryData.push(rawData[i].splice(0, 1)[0]);
    //     values.push(rawData[i]);
    //     volumes.push([i, rawData[i][4], rawData[i][0] > rawData[i][1] ? 1 : -1]);
    //   }
    //   return {
    //     categoryData: categoryData,
    //     values: values,
    //     volumes: volumes
    //   };
    // }
    // function calculateMA(dayCount:any, data:any) {
    //   var result = [];
    //   for (var i = 0, len = data.values.length; i < len; i++) {
    //     if (i < dayCount) {
    //       result.push('-');
    //       continue;
    //     }
    //     var sum = 0;
    //     for (var j = 0; j < dayCount; j++) {
    //       sum += data.values[i - j][1];
    //     }
    //     result.push(+(sum / dayCount).toFixed(3));
    //   }
    //   return result;
    // }
    // const getChart=()=>{
    //     request.get(ROOT_PATH+'/data/asset/data/stock-DJI.json').then((res:any)=>{
    //         console.log(res);
    //     })
    // }
    const data=[["2004-01-02",10452.74,10409.85,10367.41,10554.96,168890000],
    ["2004-01-05",10411.85,10544.07,10411.85,10575.92,221290000],
    ["2004-01-06",10543.85,10538.66,10454.37,10584.07,191460000],
    ["2004-01-07",10535.46,10529.03,10432,10587.55,225490000],
    ["2004-01-08",10530.07,10592.44,10480.59,10651.99,237770000],["2004-01-09",10589.25,10458.89,10420.52,10603.48,223250000],["2004-01-12",10461.55,10485.18,10389.85,10543.03,197960000],["2004-01-13",10485.18,10427.18,10341.19,10539.25,197310000],["2004-01-14",10428.67,10538.37,10426.89,10573.85,186280000],["2004-01-15",10534.52,10553.85,10454.52,10639.03,260090000],["2004-01-16",10556.37,10600.51,10503.7,10666.88,254170000],["2004-01-20",10601.4,10528.66,10447.92,10676.96,224300000],["2004-01-21",10522.77,10623.62,10453.11,10665.7,214920000],["2004-01-22",10624.22,10623.18,10545.03,10717.4,219720000],["2004-01-23",10625.25,10568.29,10490.14,10691.77,234260000],["2004-01-26",10568,10702.51,10510.44,10725.18,186170000],["2004-01-27",10701.1,10609.92,10579.33,10748.81,206560000],["2004-01-28",10610.07,10468.37,10412.44,10703.25,247660000],["2004-01-29",10467.41,10510.29,10369.92,10611.56,273970000],["2004-01-30",10510.22,10488.07,10385.56,10551.03,208990000],["2004-02-02",10487.78,10499.18,10395.55,10614.44,224800000],["2004-02-03",10499.48,10505.18,10414.15,10571.48,183810000],["2004-02-04",10503.11,10470.74,10394.81,10567.85,227760000]];
    function splitData(rawData:any) {
        let categoryData = [];
        let values = [];
        let volumes = [];
        for (let i = 0; i < rawData.length; i++) {
          categoryData.push(rawData[i].splice(0, 1)[0]);
          values.push(rawData[i]);
          volumes.push([i, rawData[i][4], rawData[i][0] > rawData[i][1] ? 1 : -1]);
        }
        return {
          categoryData: categoryData,
          values: values,
          volumes: volumes
        };
      }
    useEffect(()=>{
        console.log(splitData(data));
    },[])
    return (
        <div id='main'></div>
    )
}
export default Test;