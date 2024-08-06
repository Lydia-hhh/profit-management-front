// src/components/RecordTable.tsx
import React, { useState, useEffect } from 'react';
import { Table, Button, message, Modal, Form, Input, InputNumber, Popconfirm } from 'antd';
import { ColumnsType } from 'antd/lib/table';
import { PlusOutlined, DeleteOutlined, EditOutlined } from '@ant-design/icons';
import {diagramAll, productDelete, recordDelete, recordList} from "../../store/features/portfolioSlice";
import {unwrapResult} from "@reduxjs/toolkit";
import {useDispatch} from "react-redux";
import classNames from 'classnames';
import SearchComponent from "../layouts/SearchComponent";
import AddEntryModal from '../layouts/AddEntryModal';
import { useNavigate } from 'react-router-dom';

function Record({portfolio_id}:any) {
    const dispatch = useDispatch();
    const [records, setRecords] = useState<Record[]>([]);
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [isSearchModalVisible, setIsSearchModalVisible] = useState(false);
    const [selectedItemId, setSelectedItemId] = useState<string | null>(null);
    const navigate=useNavigate();

    const handleSearchSelect = async (item: any) => {
        try {
            setIsSearchModalVisible(false);
            setSelectedItemId(item.item_id);
            setIsModalVisible(true);
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

    interface Record {
        item_id: string;
        item_name: string;
        amount: number;
        currency: string;
        current_price: number;
        total_amount: number;
        total_return: number;
        total_amount_rate: number;
        daily_return: number;
        daily_return_rate: number;
        stock_price: number;
        records: SubRecord[];
    }

    interface SubRecord {
        record_id: number;
        buy_date: string;
        buy_price: number;
        currency: string;
        amount: number;
        revenue: number;
        revenue_rate: number;
        stock_price: number;
    }

    const fetchRecords = () => {
        try {
            dispatch(recordList({portfolio_id}) as any).then(unwrapResult).then((res: any) => {
                console.log("getRecordList result: ", res)
                if (res && res.code == 200) {
                    setRecords(res.data);
                    console.log(res.data)
                }
            })
        } catch (error) {
            message.error('Failed to fetch records');
        }
    };

    const handleAddRecord = () => {
        setIsModalVisible(true);
    };

    const handleAddRecordWithId = (id:any, event: React.MouseEvent<HTMLElement>) => {
        event.stopPropagation();
        setSelectedItemId(id);
        setIsModalVisible(true);
        fetchRecords();
        console.log("I fetch Records!")
    };

    const handleDeleteRecord = (item_id: any, e: React.MouseEvent<HTMLElement> | undefined) => {
        e?.stopPropagation();
        try {
            dispatch(productDelete({portfolio_id,item_id}) as any).then(unwrapResult).then((res: any) => {
                if (res && res.code == 200) {
                    message.success('Record deleted successfully');
                    fetchRecords();
                }
            })
        } catch (error) {
            message.error('Failed to delete record');
        }
    };

    const handleDeleteSubRecord = (record_id: number) => {
        try {
            console.log("sub_id:"+record_id)
            dispatch(recordDelete({record_id}) as any).then(unwrapResult).then((res: any) => {
                if (res && res.code == 200) {
                    message.success('Record deleted successfully');
                    fetchRecords();
                }
            })

        } catch (error) {
            message.error('Failed to delete record');
        }
    };

    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0'); // 月份从0开始
        const day = String(date.getDate()).padStart(2, '0');
        return `${year}-${month}-${day}`;
    };

    const columns: ColumnsType<Record> = [
        { title: 'Item ID', dataIndex: 'item_id', key: 'item_id' },
        { title: 'Item Name', dataIndex: 'item_name', key: 'item_name' },
        { title: 'Current Price', dataIndex: 'current_price', key: 'current_price' },
        { title: 'Currency', dataIndex: 'currency', key: 'currency' },
        { title: 'Daily Return', dataIndex: 'daily_return', key: 'daily_return' ,
            render: (text) => (
                <span className={classNames('font', { positive: text >= 0, negative: text < 0 })}>
                    {text}
                </span>
            ),},
        { title: 'Daily Return Rate', dataIndex: 'daily_return_rate', key: 'daily_return_rate',
            render: (text) => {
                const value = parseFloat(text);
                return (
                    <span className={classNames('value', { positive: value > 0, negative: value < 0, zero: value == 0})}>
                      {text} {value >= 0 ? (value == 0?'-':'▲') : '▼'}
                    </span>
                );
            },},
        { title: 'Total Amount', dataIndex: 'total_amount', key: 'total_amount' },
        { title: 'Total Return', dataIndex: 'total_return', key: 'total_return' ,
            render: (text) => (
                <span className={classNames('font', { positive: text >= 0, negative: text < 0 })}>
                    {text}
                </span>
            ),},
        { title: 'Total Return Rate', dataIndex: 'total_return_rate', key: 'total_return_rate' ,
            render: (text) => {
                const value = parseFloat(text);
                return (
                    <span className={classNames('value', { positive: value > 0, negative: value < 0, zero: value == 0})}>
                      {text} {value >= 0 ? (value == 0?'-':'▲') : '▼'}
                    </span>
                );
            },},
        { title: 'Stock Price', dataIndex: 'stock_price', key: 'stock_price' },
        {
            title: 'Actions',
            key: 'actions',
            width: 100,
            render: (text, record) => (
                <span>
          <Button icon={<PlusOutlined />} onClick={(e) => handleAddRecordWithId(record.item_id,e)}/>
            <Popconfirm
                title="Sure to delete?"
                onConfirm={(e) => {
                    e?.stopPropagation();
                    handleDeleteRecord(record.item_id, e);
                }}
                onCancel={(e) => e?.stopPropagation()}
            >
            <Button icon={<DeleteOutlined />} onClick={(e) => e?.stopPropagation()} />
          </Popconfirm>
        </span>
            )
        }
    ];

    const subColumns: ColumnsType<SubRecord> = [
        { title: 'Buy Date', dataIndex: 'buy_date', key: 'buy_date',
            render: (text) => (
                formatDate(text)
            ),
        },
        { title: 'Buy Price', dataIndex: 'buy_price', key: 'buy_price' },
        { title: 'Amount', dataIndex: 'amount', key: 'amount' },
        { title: 'Revenue', dataIndex: 'revenue', key: 'revenue',
            render: (text) => (
                <span className={classNames('font', { positive: text >= 0, negative: text < 0 })}>
                    {text}
                </span>
            ),},
        { title: 'Revenue Rate', dataIndex: 'revenue_rate', key: 'revenue_rate' ,
            render: (text) => {
                const value = parseFloat(text);
                return (
                    <span className={classNames('value', { positive: value > 0, negative: value < 0, zero: value == 0})}>
                      {text} {value >= 0 ? (value == 0?'-':'▲') : '▼'}
                    </span>
                );
            },},
        { title: 'Stock Price', dataIndex: 'stock_price', key: 'stock_price' },
        {
            title: 'Actions',
            key: 'actions',
            render: (text, subRecord) => (
                <span>
                  <Popconfirm
                      title="Sure to delete?"
                      onConfirm={() => handleDeleteSubRecord(subRecord.record_id)}
                  >
                    <Button icon={<DeleteOutlined />} />
                  </Popconfirm>
                </span>
            )
        }
    ];

    useEffect(() => {
        // Fetch records from the backend
        fetchRecords();
        console.log("fetch records")
        console.log(records)
    }, [portfolio_id]);

    const onRowClick = (record: Record) => {
        navigate('/item?item_id='+record.item_id)
    };

    return (
        <div>
            <Button type="primary" onClick={showSearchModal} style={{ marginLeft: "10px" }}>
                                + Add Item
            </Button>
            <SearchComponent
                visible={isSearchModalVisible}
                onCancel={handleSearchCancel}
                onSelect={handleSearchSelect}
                selectedPortfolioId={portfolio_id}
                onAddSuccess={fetchRecords}
            />
            <Table
                columns={columns}
                dataSource={records}
                expandable={{
                    expandedRowRender: (record) => (
                        <Table
                            columns={subColumns}
                            dataSource={record.records}
                            pagination={false}
                            rowKey="record_id"
                        />
                    )
                }}
                rowKey="item_id"
                onRow={(record) => ({
                    onClick: () => onRowClick(record),
                })}
            />
            <AddEntryModal
                visible={isModalVisible}
                onCancel={() => setIsModalVisible(false)}
                onAdd={handleAddRecord}
                item_id={selectedItemId}
                portfolio_id={portfolio_id}
                onAddSuccess={fetchRecords}
            />
        </div>
    );

}
export default Record;
