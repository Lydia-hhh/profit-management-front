import { useDispatch } from "react-redux";
import { diagramAll } from "../../store/features/portfolioSlice";
import { unwrapResult } from "@reduxjs/toolkit";
import { useEffect, useState } from "react";
import DiagramAll from "../layouts/DiagramAll";
import Portfolio from "./Portfolio";
import { Breadcrumb, Layout, Menu, theme } from "antd";
import { Content, Footer, Header } from "antd/es/layout/layout";
import SearchItem from "./SearchItem";
import HomeContent from '../layouts/HomeContent';

function Home() {
    const [component,setComponent]=useState<any>(null)
    const items = [
        { key: '1', label: 'Home' },
        { key: '2', label: 'Portfolio' },
        { key: '3', label: 'Search' }
    ]
    const getComponent=(key:any)=>{
        if(key=='1'){
        setComponent(<HomeContent />);
            // setComponent(<div>Home</div>)
        }else if(key=='2'){
            setComponent(<Portfolio/>)
        }else if(key=='3'){
            setComponent(<SearchItem/>)
        }else{
            setComponent(<div>None</div>)
        }
    }
    useEffect(() => {
        getComponent('1');
    },[])
    const {
        token: { colorBgContainer, borderRadiusLG },
    } = theme.useToken();
    return (
        <Layout>
            <Header style={{ display: 'flex', alignItems: 'center' }}>
                <div className="demo-logo" />
                <Menu
                    onSelect={({ item, key, keyPath, selectedKeys, domEvent }: any) => {
                       getComponent(key);
                    }}
                    theme="dark"
                    mode="horizontal"
                    defaultSelectedKeys={['1']}
                    items={items}
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
                    {component}
                </div>
            </Content>
            <Footer style={{ textAlign: 'center' }}>
            </Footer>
        </Layout>
    );
}
export default Home;