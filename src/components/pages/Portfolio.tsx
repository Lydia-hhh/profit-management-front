import { Button, Dropdown, Empty, Flex, Form, FormProps, Input, Layout, Menu, MenuProps, message, Modal, Space, Spin, Tabs, TabsProps, theme } from "antd";
import DiagramAll from "../layouts/DiagramAll";
import React, { useEffect, useRef, useState } from "react";
import { useDispatch, UseDispatch } from "react-redux";
import { change_selected_list, portfolioDelete, portfolioList, portfolioPost, recordList, selectActiveKey, selectAddItem, selectDelete, selectStatisticalInfo, set_records, set_statistical_info } from "../../store/features/portfolioSlice";
import { unwrapResult } from "@reduxjs/toolkit";
import DiagramProfit from "../layouts/DiagramProfit";
import PieChart from "../layouts/PieChart";
import NewsPortfolio from "../layouts/NewsPortfolio";
import Record from "../layouts/Record";
import Activity from "../layouts/Activity";
import { DeleteOutlined, DownOutlined, EllipsisOutlined, LoadingOutlined } from "@ant-design/icons";
import { useAppDispatch, useAppSelector } from "../../store/hooks";
import RecordInfo from "../layouts/RecordInfo";
import AddEntryModal from "../layouts/AddEntryModal";
import SearchComponent from "../layouts/SearchComponent";
import TotalProperty from "../layouts/TotalProperty";
import { Content, Footer, Header } from "antd/es/layout/layout";
import { useNavigate } from "react-router-dom";

function Portfolio() {
    const dispatch = useDispatch();
    const [isSearchModalVisible, setIsSearchModalVisible] = useState(false);
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [selectedItemId, setSelectedItemId] = useState<string | null>(null);
    // const [records, setRecords] = useState<any[]>([]);
    const sliceDispatch = useAppDispatch();
    const navigate = useNavigate();
    const [activeKey, setActiveKey] = useState(undefined);
    const [tapitems, settapItems] = useState<any[] | undefined>([]);
    const [open, setOpen] = useState(false);
    const [confirmLoading, setConfirmLoading] = useState(false);
    const [portfolioId, setportfolioId] = useState<any>(null);
    const [deleteopen, setDeleteopen] = useState<boolean>(false);
    const [form] = Form.useForm();
    const { TabPane } = Tabs;
    const add_item = useAppSelector(selectAddItem);
    const deleted = useAppSelector(selectDelete);
    const active_key = useAppSelector(selectActiveKey);
    const statistical_info = useAppSelector(selectStatisticalInfo);
    const [loading, setLoading] = useState<boolean>(false);
    // const [recordloading, setrecordloading] = useState<boolean>(false);
    const menuitems = [
        { key: '1', label: 'Home' },
        { key: '2', label: 'Portfolio' },
        { key: '3', label: 'Search' }
    ]
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
    const showSearchModal = () => {
        setIsSearchModalVisible(true);
    };

    const handleSearchCancel = () => {
        setIsSearchModalVisible(false);
    };
    const handleSearchSelect = async (item: any) => {
        try {
            setIsSearchModalVisible(false);
            setSelectedItemId(item.item_id);
            setIsModalVisible(true);
        } catch (error) {
            console.error('Failed to use item:', error);
        }
    };
    const handleAddRecord = () => {
        setIsModalVisible(true);
    };


    const onChange = (key: string) => {
        setportfolioId(key)
        setActiveKey(key as any);
        fetchRecords(key);
    };
    const onChangeRecord = (key: string) => {
    };
    const hasRecords = async ({ portfolio_id }: any) => {
        const res = await dispatch(recordList({ portfolio_id }) as any).then(unwrapResult);
        if (res && res.code == 200) {
            if (res.data && res.data.items_list.length > 0) {
                return true;
            }
            return false;
        }
        return false;
    };

    const getItems = async (active: any) => {
        setLoading(true);
        const portfolios: any[] = await getPortfolioList();
        const result: any[] = await Promise.all(portfolios.map(async (portfolio: any) => {
            const flag: any = await hasRecords({ portfolio_id: portfolio.portfolio_id });
            return {
                portfolio_id: portfolio.portfolio_id,
                portfolio_name: portfolio.name,
                has_record: flag
            };
        }));
        if (active === null && result.length > 0) {
            setportfolioId(result[0].portfolio_id);
            await fetchRecords(result[0].portfolio_id);
        } else {
            setportfolioId(active);
            await fetchRecords(active);
        }
        const _items: any[] = result.map((item: any) => {
            return {
                key: item.portfolio_id,
                label: item.portfolio_name, // 确保使用 item.portfolio_name
                closable: false,
                children: getTabNode(item.has_record, item.portfolio_id)
            };
        });
        if (active === null && _items.length > 0) {
            setActiveKey(_items[0].key);
        } else {
            setActiveKey(active);
        }
        settapItems(_items);
        setLoading(false);
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
                <Flex style={{ width: '100%' }} vertical>
                    <Flex style={{ width: '100%' }} justify="space-between">
                        <div>
                            <TotalProperty />
                        </div>
                        <Dropdown onOpenChange={() => { setportfolioId(portfolio_id) }} menu={{ items }} trigger={['click']}>
                            <a onClick={(e) => e.preventDefault()}>
                                <Space>
                                    <EllipsisOutlined style={{ fontSize: '30px' }} />
                                </Space>
                            </a>
                        </Dropdown>

                    </Flex>
                    <Flex style={{ width: '100%' }} align="center">
                        <Flex vertical style={{ width: '75%' }}>
                            <DiagramAll />
                            <div style={{ height: '100px' }}></div>
                            <DiagramProfit />
                        </Flex>
                        <Flex style={{ width: '25%' }}>
                            <RecordInfo portfolio_id={portfolio_id} />
                        </Flex>

                    </Flex>
                    <div style={{ height: '50px' }}></div>
                    <Tabs defaultActiveKey="1" onChange={onChangeRecord}>
                        <TabPane tab="Records" key="1">
                            {/* <Button type="primary" onClick={showSearchModal} style={{ marginLeft: "10px" }}>
                                + Add Item
                            </Button> */}
                            <Record portfolio_id={portfolio_id} />
                        </TabPane>
                        你可以在这里添加其他TabPane
                        <TabPane tab="Activity" key="2">
                            <Activity portfolio_id={portfolio_id} />
                        </TabPane>
                        <TabPane tab="News" key="3">
                            <NewsPortfolio portfolio_id={portfolio_id} />
                        </TabPane>

                    </Tabs>
                </Flex>
            )
        }
        return (
            <div style={{ width: '100%' }}>
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
                <div style={{ height: '20px' }}></div>
                <Flex style={{ width: '100%' }} align="center" justify="center">
                    <Button type="primary" onClick={showSearchModal}>Create New Portfolio</Button>
                </Flex>

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
        setOpen(false);
    };
    const handleDeleteCancel = () => {
        setDeleteopen(false);
    }
    const handleDeleteOk = (portfolio_id: any) => {
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
        setConfirmLoading(true);
        const portfolio_name = values.portfolio_name;
        dispatch(portfolioPost({ portfolio_name }) as any).then(unwrapResult).then(async (res: any) => {
            setOpen(false);
            setConfirmLoading(false);
            if (res && res.code == 200) {
                const portfolio_id = res.data?.portfolio_id;
                setActiveKey(portfolio_id);
                await getItems(portfolio_id);

                // if (_items.length > 0) {
                //     setActiveKey(_items[_items.length - 1].key)
                // }

            }
        })
    };
    const fetchRecords = async (portfolio_id: any) => {
        try {
            const res: any = await dispatch(recordList({ portfolio_id }) as any).then(unwrapResult);
            if (res && res.code == 200) {
                sliceDispatch(set_records(res.data['items_list']))
                sliceDispatch(set_statistical_info(res.data["statistical_info"]))
            }
        } catch (error) {
            message.error('Failed to fetch records');
        }
    };
    const onFinishFailed = (errorInfo: any) => {
    };
    useEffect(() => {
        getItems(null);
    }, [])
    useEffect(() => {
        console.log("add_item: ", add_item);
        setActiveKey(active_key)
        getItems(active_key);
    }, [add_item, deleted])
    return (
        <Spin indicator={<LoadingOutlined spin />} spinning={loading}>
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
                        defaultSelectedKeys={['2']}
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
                        <div style={{ width: '100%' }}>
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
                                    <Form.Item wrapperCol={{ offset: 15, span: 9 }}>
                                        <Button style={{ marginRight: '25px' }} onClick={handleCancel}>Cancel</Button>
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
                            <SearchComponent
                                visible={isSearchModalVisible}
                                onCancel={handleSearchCancel}
                                onSelect={handleSearchSelect}
                                selectedPortfolioId={portfolioId}
                                onAddSuccess={() => { fetchRecords(portfolioId) }}
                            />

                            <AddEntryModal
                                visible={isModalVisible}
                                onCancel={() => setIsModalVisible(false)}
                                onAdd={handleAddRecord}
                                item_id={selectedItemId}
                                portfolio_id={portfolioId}
                                onAddSuccess={() => { fetchRecords(portfolioId) }}
                            />
                        </div>
                    </div>
                </Content>
                <Footer style={{ textAlign: 'center' }}>
                </Footer>

            </Layout>



        </Spin>

    )
}
export default Portfolio;
