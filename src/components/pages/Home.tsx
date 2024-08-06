import { useDispatch } from "react-redux";
import { diagramAll } from "../../store/features/portfolioSlice";
import { unwrapResult } from "@reduxjs/toolkit";
import { useEffect } from "react";
import DiagramAll from "../layouts/DiagramAll";
import Portfolio from "./Portfolio";
import { Breadcrumb, Layout, Menu, theme } from "antd";
import { Content, Footer, Header } from "antd/es/layout/layout";

function Home(){
    // const items = new Array(15).fill(null).map((_, index) => ({
    //     key: index + 1,
    //     label: `nav ${index + 1}`,
    //   }));   
     const items=[
        {key:1,label:'Home'},
        {key:2,label:'Portfolio'}
     ]

    useEffect(() => {
    })
    const {
        token: { colorBgContainer, borderRadiusLG },
      } = theme.useToken();
    return(
        <Layout>
        <Header style={{ display: 'flex', alignItems: 'center' }}>
          <div className="demo-logo" />
          <Menu
            theme="dark"
            mode="horizontal"
            defaultSelectedKeys={['2']}
            items={items}
            style={{ flex: 1, minWidth: 0 }}
          />
        </Header>
        <Content style={{ padding: '0 48px' }}>
          <div
            style={{
              background: colorBgContainer,
              minHeight: 280,
              padding: 24,
              borderRadius: borderRadiusLG,
            }}
          >
            <Portfolio/>
          </div>
        </Content>
        <Footer style={{ textAlign: 'center' }}>
        </Footer>
      </Layout>
    );
}
export default Home;