import { Empty, Flex, Input, Layout, Menu, Spin, Tabs, TabsProps, theme } from "antd";
import Search from "antd/es/input/Search";
import { useEffect, useRef, useState } from "react";
import { useDispatch } from "react-redux";
import { klineData } from "../../store/features/portfolioSlice";
import { unwrapResult } from "@reduxjs/toolkit";
import KLine from "../layouts/KLine";
import { LoadingOutlined } from "@ant-design/icons";
import { Content, Footer, Header } from "antd/es/layout/layout";
import { useNavigate } from "react-router-dom";

function SearchItem() {
    const menuitems = [
        { key: '1', label: 'Home' },
        { key: '2', label: 'Portfolio' },
        { key: '3', label: 'Search' }
    ]
    const navigate = useNavigate();
    const navigateToDest=(key:any)=>{
        if(key=='1'){
            navigate('/');
        }else if(key=='2'){
            navigate('/portfolio');
        }else if(key=='3'){
            navigate('/search');
        }
    }
    const {
        token: { colorBgContainer, borderRadiusLG },
    } = theme.useToken();
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
        <Layout>
            <Header style={{ display: 'flex', alignItems: 'center' }}>
                <div className="demo-logo" />
                <Menu
                    onSelect={({ item, key, keyPath, selectedKeys, domEvent }: any) => {
                        //    getComponent(key);
                        navigateToDest(key);
                    }}
                    theme="dark"
                    mode="horizontal"
                    defaultSelectedKeys={['3']}
                    items={menuitems}
                    style={{ flex: 1, minWidth: 0 }}
                />
            </Header>
            <Content style={{ padding: '0 0' }}>
                <div
                    style={{
                        background: colorBgContainer,
                        minHeight: 280,
                        padding: 24,
                        borderRadius: borderRadiusLG,
                    }}
                >
                    <div>
                        <Flex style={{ width: '100%' }} justify='center' align='center'>
                            <Search onSearch={searchItem} value={value} onChange={handleChange} style={{ width: '60%' }} placeholder="input search text" enterButton="Search" size="large" loading={searchloading} />
                        </Flex>
                        <div style={{ height: '50px' }}></div>
                        <div style={{ width: '100%' }}>
                            <Tabs activeKey={active} items={items} onChange={onChange} />
                        </div>
                    </div>

                </div>
            </Content>
            <Footer style={{ textAlign: 'center' }}>
            </Footer>
        </Layout>

    )
}
export default SearchItem;