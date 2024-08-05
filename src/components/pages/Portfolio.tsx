import { Button, Tabs, TabsProps } from "antd";
import DiagramAll from "../layouts/DiagramAll";
import { useEffect, useState } from "react";
import { useDispatch, UseDispatch } from "react-redux";
import { portfolioList } from "../../store/features/portfolioSlice";
import { unwrapResult } from "@reduxjs/toolkit";
import DiagramProfit from "../layouts/DiagramProfit";
import PieChart from "../layouts/PieChart";
function Portfolio() {
    const dispatch = useDispatch();
    const [portfolios, setportfolios] = useState<any[]>([])
    const onChange = (key: string) => {
        console.log(key)
    };
    const getPortfolioList = () => {
        dispatch(portfolioList() as any).then(unwrapResult).then((res: any) => {
            console.log("getPortfolioList result: ", res)
            if (res && res.code == 200) {
                setportfolios(res.data);
            }
        })
    }
    const items: TabsProps['items'] = portfolios.map(portfolio => {
        return {
            key: portfolio.portfolio_id,
            label: portfolio.name,
            children:
                <div>
                    <DiagramAll portfolio_id={portfolio.portfolio_id} />
                    <div style={{ height: '50px' }}></div>
                    <DiagramProfit portfolio_id={portfolio.portfolio_id} />
                    <div style={{ height: '50px' }}></div>
                    <PieChart portfolio_id={portfolio.portfolio_id}/>
                </div>
        }
    })
    useEffect(() => {
        getPortfolioList();
    }, [])
    return (
        <div style={{width:'80%',marginLeft:'10%'}}>
            <Button type="primary">Create New Portfolio</Button>
             <Tabs defaultActiveKey="1" items={items} onChange={onChange} />
        </div>
       
    )
}
export default Portfolio;