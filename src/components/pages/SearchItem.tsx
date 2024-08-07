import { Empty, Flex, Input, Spin, Tabs, TabsProps } from "antd";
import Search from "antd/es/input/Search";
import { useEffect, useRef, useState } from "react";
import { useDispatch } from "react-redux";
import { klineData } from "../../store/features/portfolioSlice";
import { unwrapResult } from "@reduxjs/toolkit";
import KLine from "../layouts/KLine";
import { LoadingOutlined } from "@ant-design/icons";

function SearchItem() {

    const [searchloading, setsearchLoading] = useState<boolean>(false);
    const [value, setValue] = useState<any>('');
    const itemId = useRef<any>('')
    const [timePrice, settimePrice] = useState<any[]>([]);
    const [disabled, setdisabled] = useState<string>("all")
    const [loading, setloading] = useState<boolean>(false);
    const [active, setActive] = useState<any>('1d');
    const dispatch = useDispatch();
    const onChange = (key: string) => {
        getDiagramKLine(key);
        setActive(key);
    };
    const getDiagramKLine = (time_range: any) => {
        const item_id = itemId.current;
        setdisabled(time_range)
        setloading(true);
        dispatch(klineData({ item_id, time_range }) as any).then(unwrapResult).then((res: any) => {
            setdisabled("all")
            setloading(false);
            setsearchLoading(false);
            if (res && res.code == 200) {
                settimePrice(res.data);
            }
        })
    }
    const getChildrenNode = () => {
        if (timePrice.length === 0) {
            return (
                <Spin indicator={<LoadingOutlined spin />} spinning={loading}>
                    <Empty
                        image="https://gw.alipayobjects.com/zos/antfincdn/ZHrcdLPrvN/empty.svg"
                        imageStyle={{ height: 60 }}
                        description={
                            "No data available at the moment"
                        }
                    >
                    </Empty>
                </Spin>
            )
        }
        return (
            <KLine timePrice={timePrice} loading={loading} />
        )
    }

    const items: TabsProps['items'] = [
        {
            key: '1d',
            label: '1 day',
            children: getChildrenNode(),
            disabled: !(disabled === "all" || disabled === "1d") || value === '' || itemId.current === ''
        },
        {
            key: '5d',
            label: '5 days',
            children: getChildrenNode(),
            disabled: !(disabled === "all" || disabled === "5d") || value === '' || itemId.current === ''
        },
        {
            key: '1m',
            label: '1 month',
            children: getChildrenNode(),
            disabled: !(disabled === "all" || disabled === "1m") || value === '' || itemId.current === ''
        },
        {
            key: '6m',
            label: '6 months',
            children: getChildrenNode(),
            disabled: !(disabled === "all" || disabled === "6m") || value === '' || itemId.current === ''
        },
        {
            key: '1y',
            label: '1 year',
            children: getChildrenNode(),
            disabled: !(disabled === "all" || disabled === "1y") || value === '' || itemId.current === ''
        },
        {
            key: '5y',
            label: '5 years',
            children: getChildrenNode(),
            disabled: !(disabled === "all" || disabled === "5y") || value === '' || itemId.current === ''
        },
    ];
    useEffect(() => {

    }, [])

    const handleChange = (e: any) => {
        setValue(e.target.value)
    }
    const searchItem = (value: any, _e: any, info: any) => {
        if (value.length > 0) {
            itemId.current = value
            setsearchLoading(true);
            getDiagramKLine("1d")
            setActive('1d');
        }
    }
    return (
        <div>
            <Flex style={{ width: '100%' }} justify='center' align='center'>
                <Search onSearch={searchItem} value={value} onChange={handleChange} style={{ width: '60%' }} placeholder="input search text" enterButton="Search" size="large" loading={searchloading} />
            </Flex>
            <div style={{ height: '50px' }}></div>
            <div style={{ width: '100%' }}>
                <Tabs activeKey={active} items={items} onChange={onChange} />
            </div>
        </div>
    )
}
export default SearchItem;