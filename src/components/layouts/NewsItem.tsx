import { Image } from "antd";
import { productNews } from "../../store/features/portfolioSlice";
import { useEffect, useRef, useState } from "react";
import * as echarts from 'echarts';
import { Spin } from "antd";
import { LoadingOutlined } from "@ant-design/icons";
import { useDispatch } from "react-redux";
import { unwrapResult } from "@reduxjs/toolkit";
import { List, Avatar } from 'antd';
// import 'antd/dist/antd.css';

function NewsItem({item_id}:any){
    const [loading, setloading] = useState<boolean>(true);
    const [data,setData]=useState<any[]>([]);
    const dispatch=useDispatch();

    const getItemNews=()=>{
        setloading(true)
        dispatch(productNews({item_id}) as any).then(unwrapResult).then((res:any)=>{
            setloading(false);
            if(res && res.code==200){
                setData(res.data);
            }
        })
    }
    const getTimeFromNow = (timestamp: number): string => {
        const now = Date.now() / 1000; // 获取当前时间的时间戳（秒）
        const diffInSeconds = now - timestamp;
        const diffInMinutes = Math.floor(diffInSeconds / 60);
        const diffInHours = Math.floor(diffInMinutes / 60);
        const diffInDays = Math.floor(diffInHours / 24);

        if (diffInSeconds < 60) {
        return `${Math.floor(diffInSeconds)} seconds ago`;
        } else if (diffInMinutes < 60) {
        return `${diffInMinutes} minutes ago`;
        } else if (diffInHours < 24) {
        return `${diffInHours} hours ago`;
        } else {
        return `${diffInDays} days ago`;
        }
    };


    useEffect(() => {
        getItemNews();
    }, [item_id])

    return (
        <div>
          {loading ? (
            <Spin />
          ) : (
            <List
              itemLayout="horizontal"
              dataSource={data}
              renderItem={(item) => {
                const avatarSrc = item.thumbnail && item.thumbnail.resolutions ? 
                  item.thumbnail.resolutions[0].url : 'https://via.placeholder.com/150';
                return (
                  <List.Item>
                    <List.Item.Meta
                      avatar={
                        <a href={item.link} target="_blank" rel="noopener noreferrer">
                          <Avatar src={avatarSrc} />
                        </a>
                      }
                      title={
                        <a href={item.link} target="_blank" rel="noopener noreferrer">
                          {item.title}
                        </a>
                      }
                      description={
                        <>
                          <div>{item.publisher}</div>
                          <div>{getTimeFromNow(item.providerPublishTime)}</div>
                        </>
                      }
                    />
                  </List.Item>
                );
              }}
            />
          )}
        </div>
      );
}     
export default NewsItem;
