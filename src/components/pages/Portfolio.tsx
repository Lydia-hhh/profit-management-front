import { Button, Form, FormProps, Input, Modal, Tabs, TabsProps } from "antd";
import DiagramAll from "../layouts/DiagramAll";
import React, { useEffect, useState } from "react";
import { useDispatch, UseDispatch } from "react-redux";
import { portfolioList, portfolioPost } from "../../store/features/portfolioSlice";
import { unwrapResult } from "@reduxjs/toolkit";
import DiagramProfit from "../layouts/DiagramProfit";
import PieChart from "../layouts/PieChart";
import NewsPortfolio from "../layouts/NewsPortfolio";
import Record from "../layouts/Record";
import Activity from "../layouts/Activity";
import SearchComponent from "../layouts/SearchComponent";

function Portfolio() {
    const dispatch = useDispatch();
    const [activeKey, setActiveKey] = useState(undefined);
    const [items, setItems] = useState<any[] | undefined>([]);
    const [open, setOpen] = useState(false);
    const [confirmLoading, setConfirmLoading] = useState(false);
    const [form] = Form.useForm();
    const [portfolios, setportfolios] = useState<any[]>([])
    const [isSearchModalVisible, setIsSearchModalVisible] = useState(false);
    const [selectedPortfolioId, setSelectedPortfolioId] = useState<string | null>(null);


    const onChange = (key: string) => {
        console.log(key)
        setActiveKey(key as any);
        setSelectedPortfolioId(key);
    };
    const getPortfolioList = async () => {
        const res=await dispatch(portfolioList() as any).then(unwrapResult);
        if (res && res.code==200){
            const _items: TabsProps['items'] = res.data.map((portfolio: { portfolio_id: any; name: any; }) => {
                return {
                    key: portfolio.portfolio_id,
                    label: portfolio.name,
                    closable: false,
                    children:
                        <div>
                            <DiagramAll portfolio_id={portfolio.portfolio_id} />
                            <div style={{ height: '50px' }}></div>
                            <DiagramProfit portfolio_id={portfolio.portfolio_id} />
                            <div style={{ height: '50px' }}></div>
                            <PieChart portfolio_id={portfolio.portfolio_id} />
                            <Button type="primary" onClick={showSearchModal} style={{ marginLeft: "10px" }}>
                                + Add Item
                            </Button>
                            <SearchComponent
                                visible={isSearchModalVisible}
                                onCancel={handleSearchCancel}
                                onSelect={handleSearchSelect}
                                selectedPortfolioId={selectedPortfolioId}
                            />
                            <Record portfolio_id={portfolio.portfolio_id}/>
                    <Activity portfolio_id={portfolio.portfolio_id}/>
                    <NewsPortfolio portfolio_id={portfolio.portfolio_id}/>
                        </div>
                }
            })
            setItems(_items);
            setportfolios(res.data);
            return _items;
        }
        return [];
    }


    const onEdit = (
        targetKey: React.MouseEvent | React.KeyboardEvent | string,
        action: 'add' | 'remove',
    ) => {
        if (action === 'add') {
            showModal();
        }
    };
    const handleSearchSelect = async (item: any) => {
        try {
            setIsSearchModalVisible(false);
            getPortfolioList();
        } catch (error) {
            console.error('Failed to use item:', error);
        }
    };
    const showSearchModal = () => {
    setIsSearchModalVisible(true);
  };

  const handleSearchCancel = () => {
    setIsSearchModalVisible(false);
  };
    const _items: TabsProps['items'] = portfolios.map(portfolio => {
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
    });
    const showModal = () => {
        setOpen(true);
    };

    const handleCancel = () => {
        console.log('Clicked cancel button');
        setOpen(false);
    };

    const onFinish = (values: any) => {
        console.log('Success:', values);
        setConfirmLoading(true);
        const portfolio_name = values.portfolio_name;
        dispatch(portfolioPost({ portfolio_name }) as any).then(unwrapResult).then(async (res: any) => {
            setOpen(false);
            setConfirmLoading(false);
            if (res && res.code == 200) {
                const _items: any = await getPortfolioList();
                if(_items.length>0){
                    setActiveKey(_items[_items.length-1].key)
                }
            }
        })
    };

    const onFinishFailed = (errorInfo: any) => {
        console.log('Failed:', errorInfo);
    };
    useEffect(() => {
        getPortfolioList();
    }, [])
    // get currenct portfolio_id
    useEffect(() => {
        if (portfolios.length > 0) {
            setSelectedPortfolioId(portfolios[0].portfolio_id);
            console.log("selectedPortfolioId: "+selectedPortfolioId)
        }
    }, [portfolios]);
    return (

        <div style={{ width: '80%', marginLeft: '10%' }}>
            <Tabs type="editable-card" items={items} onChange={onChange} activeKey={activeKey} onEdit={onEdit} />
            <SearchComponent
                visible={isSearchModalVisible}
                onCancel={handleSearchCancel}
                onSelect={handleSearchSelect}
                selectedPortfolioId={selectedPortfolioId}
            />
            <Modal
                title="Create a New Investment Portfolio"
                open={open}
                confirmLoading={confirmLoading}
                footer=""
                closable={false}
            >
                <Form
                    onFinishFailed={onFinishFailed}
                    onFinish={onFinish}
                    labelCol={{ span: 6 }}
                    wrapperCol={{ span: 18 }}
                    form={form}
                >
                    <Form.Item
                        name="portfolio_name"
                        label="Portfolio Name"
                        rules={[{
                            required: true,
                            message: 'Please enter the name of the investment portfolio'
                        }]}>
                        <Input placeholder="Please enter the name of the investment portfolio" showCount maxLength={255} minLength={1}></Input>

                    </Form.Item>
                    <Form.Item wrapperCol={{ offset: 16, span: 9 }}>
                        <Button style={{ marginRight: '30px' }} onClick={handleCancel}>Cancel</Button>
                        <Button htmlType="submit" type="primary">OK</Button>
                    </Form.Item>

                </Form>

            </Modal>
        </div>
    )
}
export default Portfolio;
