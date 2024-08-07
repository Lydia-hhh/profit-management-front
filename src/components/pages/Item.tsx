import { useEffect,useState } from "react";
import DiagramSingle from "../layouts/DiagramSingle";
import NewsItem from "../layouts/NewsItem";
import { useSearchParams,useNavigate } from "react-router-dom";
import { useDispatch } from 'react-redux';
import { getProductDetail } from "../../store/features/portfolioSlice"
import { Card, Row, Col, Button } from "antd";

function Item(){
    const [params]=useSearchParams();
    const item_id=params.get("item_id");
    console.log("item_id: ",item_id)
    const [stockData, setStockData] = useState<StockData | null>(null);
    const [comInfo, setComInfo] = useState<ComInfo | null>(null);
    const dispatch = useDispatch();
    const navigate = useNavigate(); 

    interface StockData {
        currency:string;
        previous_close: number | null;
        open: number | null;
        day_low: number | null;
        day_high: number | null;
        fifty_two_week_low: number | null;
        fifty_two_week_high: number | null;
        market_cap: number | null;
        average_volume: number | null;
        trailing_pe: number | null;
        dividend_yield: number | null;
        exchange: string | null;
    }
    
    interface ComInfo {
        company_name: string;
        location: string;
        website: string;
        industry: string;
    }
    
    interface ProductDetail {
        data:{
            stockData: StockData;
            comInfo: ComInfo;
        }
    }

    const containerStyle: React.CSSProperties = {
        width: '80%',
        margin: '0 auto',
        padding: '20px',
        boxSizing: 'border-box' as 'border-box',
    };

    const itemStyle: React.CSSProperties = {
        padding: '10px',
        margin: '10px 0',
    };

    useEffect(() => {
        if (item_id) {
            dispatch(getProductDetail({ item_id }) as any)
                .then((action: any) => {
                    if (getProductDetail.fulfilled.match(action)) {
                        console.log("payload"+action.payload)
                        // setProductDetail(action.payload as ProductDetail);
                        const payload = action.payload as ProductDetail
                        const { stockData, comInfo } = payload.data;
                        setStockData(stockData);
                        setComInfo(comInfo);
                        console.log("STockDaa: "+stockData.average_volume)
                    }
                })
                .catch((err: any) => {
                    console.error("Server error:", err);
                    alert("Server error, please contact developer");
                });
        }
    }, [item_id, dispatch]);

    return (
        <div style={containerStyle}>
            <Button 
                type="link" 
                onClick={() => navigate(-1)} 
                style={{ marginBottom: '16px', padding: 0, fontSize: '16px' }}
            >
                &lt; Back
            </Button>
            <div>{item_id}</div>
            <div style={{ height: '15px' }}></div>
            <Row gutter={[16, 16]}>
                <Col span={16}>
                    <DiagramSingle item_id={item_id} />
                    <div style={{ height: '15px' }}></div>
                    <NewsItem item_id={item_id} />
                </Col>
                <Col span={8}>
                {stockData && (
                    Object.values(stockData).some(value => value !== null) && (
                        <Card title="Market Data" style={{ marginBottom: '16px' }}>
                            {stockData.currency && (
                                <p><strong>Currency:</strong> {stockData.currency}</p>
                            )}
                            {stockData.previous_close !== null && (
                                <p><strong>Previous Close:</strong> {stockData.previous_close}</p>
                            )}
                            {stockData.open !== null && (
                                <p><strong>Open:</strong> {stockData.open}</p>
                            )}
                            {(stockData.day_low !== null && stockData.day_high !== null) && (
                                <p><strong>Day Price Range:</strong> {stockData.day_low} ~ {stockData.day_high}</p>
                            )}
                            {(stockData.fifty_two_week_low !== null && stockData.fifty_two_week_high !== null) && (
                                <p><strong>52-Week Price Range:</strong> {stockData.fifty_two_week_low} ~ {stockData.fifty_two_week_high}</p>
                            )}
                            {stockData.market_cap !== null && (
                                <p><strong>Market Cap:</strong> {stockData.market_cap}</p>
                            )}
                            {stockData.average_volume !== null && (
                                <p><strong>Average Volume:</strong> {stockData.average_volume}</p>
                            )}
                            {stockData.trailing_pe !== null && (
                                <p><strong>Trailing P/E:</strong> {stockData.trailing_pe}</p>
                            )}
                            {stockData.dividend_yield !== null && (
                                <p><strong>Dividend Yield:</strong> {(stockData.dividend_yield * 100).toFixed(2)}%</p>
                            )}
                            {stockData.exchange && (
                                <p><strong>Exchange:</strong> {stockData.exchange}</p>
                            )}
                        </Card>
                    )
                )}
                    {comInfo && (
                        Object.values(comInfo).some(value => value) && (
                            <Card title="Company Information">
                                {comInfo.company_name && (
                                    <p><strong>Company Name:</strong> {comInfo.company_name}</p>
                                )}
                                {comInfo.location && (
                                    <p><strong>Location:</strong> {comInfo.location}</p>
                                )}
                                {comInfo.website && (
                                    <p>
                                        <strong>Website:</strong> <a href={comInfo.website} target="_blank" rel="noopener noreferrer">{comInfo.website}</a>
                                    </p>
                                )}
                                {comInfo.industry && (
                                    <p><strong>Industry:</strong> {comInfo.industry}</p>
                                )}
                            </Card>
                        )
                    )}
                </Col>
            </Row>
        </div>
    );
}
export default Item;