import { Image } from "antd";
import { activity, portfolioNews } from "../../store/features/portfolioSlice";
import { useEffect, useRef, useState } from "react";
import * as echarts from 'echarts';
import { LoadingOutlined } from "@ant-design/icons";
import { useDispatch } from "react-redux";
import { unwrapResult } from "@reduxjs/toolkit";
import { List, Card, Spin } from 'antd';
// import 'antd/dist/antd.css';
const { Meta } = Card;

function Activity({portfolio_id}:any){
    const [loading, setloading] = useState<boolean>(true);
    const [data,setData]=useState<any[]>([]);
    const dispatch=useDispatch();

    const getActivity=()=>{
        setloading(true)
        dispatch(activity({portfolio_id}) as any).then(unwrapResult).then((res:any)=>{
            setloading(false);
            if(res && res.code==200){
                setData(res.data);
            }
        })
    }


    useEffect(() => {
        getActivity();
    }, [portfolio_id])

    return (
        <div>
          {loading ? (
            <Spin />
          ) : (
            <List
              grid={{ gutter: 16, column: 1 }}
              dataSource={data}
              renderItem={(item) => (
                <List.Item>
                  <Card>
                    <Meta
                      title={item.item_name}
                      description={
                        <>
                          <div><strong>Buy Date:</strong> {new Date(item.buy_date).toLocaleDateString()}</div>
                          <div><strong>Amount:</strong> {item.amount} </div>
                          <div><strong>Buy Price:</strong> {item.currency} {item.buy_price.toFixed(2)}</div>
                        </>
                      }
                    />
                  </Card>
                </List.Item>
              )}
            />
          )}
        </div>
      );
};

export default Activity;
