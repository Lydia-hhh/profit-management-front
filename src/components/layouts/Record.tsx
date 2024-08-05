// src/components/RecordTable.tsx
import React, { useState, useEffect } from 'react';
import { Table, Button, message, Modal, Form, Input, InputNumber, Popconfirm } from 'antd';
import { ColumnsType } from 'antd/lib/table';
import { PlusOutlined, DeleteOutlined, EditOutlined } from '@ant-design/icons';
import {diagramAll, productDelete, recordDelete, recordList} from "../../store/features/portfolioSlice";
import {unwrapResult} from "@reduxjs/toolkit";
import {useDispatch} from "react-redux";


function Record({portfolio_id}:any) {
    const dispatch = useDispatch();
    const [records, setRecords] = useState<Record[]>([]);
    const [isModalVisible, setIsModalVisible] = useState(false);

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
                    console.log("test:")
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

    const handleAddRecordWithId = (id:any) => {
        setIsModalVisible(true);
    };

    const handleDeleteRecord = (item_id:any) => {
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

    const columns: ColumnsType<Record> = [
        { title: 'Item ID', dataIndex: 'item_id', key: 'item_id' },
        { title: 'Item Name', dataIndex: 'item_name', key: 'item_name' },
        { title: 'Current Price', dataIndex: 'current_price', key: 'current_price' },
        { title: 'Daily Return', dataIndex: 'daily_return', key: 'daily_return' },
        { title: 'Daily Return Rate', dataIndex: 'daily_return_rate', key: 'daily_return_rate' },
        { title: 'Total Amount', dataIndex: 'total_amount', key: 'total_amount' },
        { title: 'Total Return', dataIndex: 'total_return', key: 'total_return' },
        { title: 'Total Return Rate', dataIndex: 'total_return_rate', key: 'total_return_rate' },
        { title: 'Stock Price', dataIndex: 'stock_price', key: 'stock_price' },
        {
            title: 'Actions',
            key: 'actions',
            width: 100,
            render: (text, record) => (
                <span>
          <Button icon={<PlusOutlined />} onClick={() => handleAddRecordWithId(record.item_id)} />
            <Popconfirm
                title="Sure to delete?"
                onConfirm={() => handleDeleteRecord(record.item_id)}
            >
            <Button icon={<DeleteOutlined />} />
          </Popconfirm>
        </span>
            )
        }
    ];

    const subColumns: ColumnsType<SubRecord> = [
        { title: 'Buy Date', dataIndex: 'buy_date', key: 'buy_date' },
        { title: 'Buy Price', dataIndex: 'buy_price', key: 'buy_price' },
        { title: 'Amount', dataIndex: 'amount', key: 'amount' },
        { title: 'Revenue', dataIndex: 'revenue', key: 'revenue' },
        { title: 'Revenue Rate', dataIndex: 'revenue_rate', key: 'revenue_rate' },
        { title: 'Stock Price', dataIndex: 'stock_price', key: 'stock_price' },
        {
            title: 'Actions',
            key: 'actions',
            render: (text, subRecord) => (
                <span>
          {/*<Button icon={<EditOutlined />} onClick={() => handleEditRecord(subRecord)} />*/}
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

    return (
        <div>
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
            />
        </div>
    );

}
export default Record;
