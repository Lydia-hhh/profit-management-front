import { Button, Dropdown, Empty, Flex, Form, FormProps, Input, MenuProps, Modal, Space, Tabs, TabsProps } from "antd";
import DiagramAll from "../layouts/DiagramAll";
import React, { useEffect, useState } from "react";
import { useDispatch, UseDispatch } from "react-redux";
import { portfolioDelete, portfolioList, portfolioPost, recordList, selectActiveKey, selectAddItem } from "../../store/features/portfolioSlice";
import { unwrapResult } from "@reduxjs/toolkit";
import DiagramProfit from "../layouts/DiagramProfit";
import PieChart from "../layouts/PieChart";
import NewsPortfolio from "../layouts/NewsPortfolio";
import Record from "../layouts/Record";
import Activity from "../layouts/Activity";
import { DeleteOutlined, DownOutlined, EllipsisOutlined } from "@ant-design/icons";
import { useAppSelector } from "../../store/hooks";

function Portfolio() {
    const dispatch = useDispatch();
    const [activeKey, setActiveKey] = useState(undefined);
    const [tapitems, settapItems] = useState<any[] | undefined>([]);
    const [open, setOpen] = useState(false);
    const [confirmLoading, setConfirmLoading] = useState(false);
    const [portfolioId, setportfolioId] = useState<any>(null);
    const [deleteopen, setDeleteopen] = useState<boolean>(false);
    const [form] = Form.useForm();
    const { TabPane } = Tabs;
    const add_item=useAppSelector(selectAddItem);
    const active_key=useAppSelector(selectActiveKey);

    const onChange = (key: string) => {
        setportfolioId(key)
        setActiveKey(key as any);
    };
    const onChangeRecord = (key: string) => {
        console.log(key);
    };
    const hasRecords = async ({ portfolio_id }: any) => {
        const res = await dispatch(recordList({ portfolio_id }) as any).then(unwrapResult);
        if (res && res.code == 200) {
            if (res.data.length > 0) {
                return true;
            }
            return false;
        }
        return false;
    };

    const getItems = async (active:any) => {
        const portfolios: any[] = await getPortfolioList();
        const result: any[] = await Promise.all(portfolios.map(async (portfolio: any) => {
            const flag: any = await hasRecords({ portfolio_id: portfolio.portfolio_id });
            return {
                portfolio_id: portfolio.portfolio_id,
                portfolio_name: portfolio.name,
                has_record: flag
            };
        }));

        const _items: any[] = result.map((item: any) => {
            return {
                key: item.portfolio_id,
                label: item.portfolio_name, // 确保使用 item.portfolio_name
                closable: false,
                children: getTabNode(item.has_record, item.portfolio_id)
            };
        });
        if (active===null && _items.length > 0) {
            setActiveKey(_items[0].key);
        }else{
            setActiveKey(active);
        }
        settapItems(_items);
        return _items;
    }

    const items: MenuProps['items'] = [
        {
            label: <div>
                <Button type="text" onClick={() => { showDeleteModal() }} style={{ fontSize: '15px' }}>
                    <DeleteOutlined style={{ fontSize: '15px', marginRight: '15px' }} />
                    DELETE
                </Button>
            </div>,
            key: '0',
        },
    ];
    const getTabNode = (has_record: any, portfolio_id: any) => {
        if (has_record) {
            return (
                <div>
                    <Flex style={{ width: '100%' }} justify="flex-end">
                        <Dropdown onOpenChange={() => { setportfolioId(portfolio_id) }} menu={{ items }} trigger={['click']}>
                            <a onClick={(e) => e.preventDefault()}>
                                <Space>
                                    <EllipsisOutlined style={{ fontSize: '30px' }} />
                                </Space>
                            </a>
                        </Dropdown>
                    </Flex>
                    <DiagramAll portfolio_id={portfolio_id} />
                    <div style={{ height: '50px' }}></div>
                    <DiagramProfit portfolio_id={portfolio_id} />
                    <div style={{ height: '50px' }}></div>
                    <PieChart portfolio_id={portfolio_id} />
                    <Tabs defaultActiveKey="1" onChange={onChangeRecord}>
                        <TabPane tab="Records" key="1">
                            <Record portfolio_id={portfolio_id}/>
                        </TabPane>
                        {/* 你可以在这里添加其他TabPane */}
                        <TabPane tab="Activity" key="2">
                            <Activity portfolio_id={portfolio_id}/>
                        </TabPane>
                        <TabPane tab="News" key="3">
                            <NewsPortfolio portfolio_id={portfolio_id}/>
                        </TabPane>
                    </Tabs>;
                </div>
            )
        }
        return (
            <div>
                <Flex style={{ width: '100%' }} justify="flex-end">
                    <Dropdown onOpenChange={() => { setportfolioId(portfolio_id) }} menu={{ items }} trigger={['click']}>
                        <a onClick={(e) => e.preventDefault()}>
                            <Space>
                                <EllipsisOutlined style={{ fontSize: '30px' }} />
                            </Space>
                        </a>
                    </Dropdown>
                </Flex>
                <Empty
                    image="https://gw.alipayobjects.com/zos/antfincdn/ZHrcdLPrvN/empty.svg"
                    imageStyle={{ height: 60 }}
                    description={
                        "No data available at the moment"
                    }
                >
                </Empty>
                <Record portfolio_id={portfolio_id} />
                <Activity portfolio_id={portfolio_id} />
                <NewsPortfolio portfolio_id={portfolio_id} />
            </div>

        )
    }

    const getPortfolioList = async () => {
        const res: any = await dispatch(portfolioList() as any).then(unwrapResult);
        if (res && res.code == 200) {
            const data: any[] = res.data;
            return data;
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
    const showModal = () => {
        setOpen(true);
    };
    const showDeleteModal = () => {
        setDeleteopen(true);
    }

    const handleCancel = () => {
        console.log('Clicked cancel button');
        setOpen(false);
    };
    const handleDeleteCancel = () => {
        setDeleteopen(false);
    }
    const handleDeleteOk = (portfolio_id: any) => {
        console.log("p_id: ", portfolio_id)
        setConfirmLoading(false);
        dispatch(portfolioDelete({ portfolio_id }) as any).then(unwrapResult).then((res: any) => {
            if (res && res.code == 200) {
                getItems(null);
                setDeleteopen(false);
                setConfirmLoading(false);
            }
        })
    }

    const onFinish = (values: any) => {
        console.log('Success:', values);
        setConfirmLoading(true);
        const portfolio_name = values.portfolio_name;
        dispatch(portfolioPost({ portfolio_name }) as any).then(unwrapResult).then(async (res: any) => {
            setOpen(false);
            setConfirmLoading(false);
            if (res && res.code == 200) {
                const _items: any = await getItems(null);
                if (_items.length > 0) {
                    setActiveKey(_items[_items.length - 1].key)
                }
            }
        })
    };

    const onFinishFailed = (errorInfo: any) => {
        console.log('Failed:', errorInfo);
    };
    useEffect(()=>{
        getItems(null);
    },[])
    useEffect(() => {
        setActiveKey(activeKey)
        getItems(activeKey);
    }, [add_item])
    return (

        <div style={{ width: '80%', marginLeft: '10%' }}>
            <Tabs type="editable-card" items={tapitems} onChange={onChange} activeKey={activeKey} onEdit={onEdit} />
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
            <Modal
                open={deleteopen}
                onOk={() => { handleDeleteOk(portfolioId) }}
                confirmLoading={confirmLoading}
                onCancel={handleDeleteCancel}
            >
                <span style={{ fontSize: '18px' }}> Do you want to delete this investment portfolio?</span>
            </Modal>
        </div>
    )
}
export default Portfolio;
