import React, { useEffect, useState } from 'react';
import { Modal, Form, Input, DatePicker, message } from 'antd';
import { useDispatch } from 'react-redux';
import { productsInfo } from '../../store/features/portfolioSlice';
import { addProduct } from "../../store/features/portfolioSlice"
import dayjs, { Dayjs } from 'dayjs';


const { Item: FormItem } = Form;

interface AddEntryModalProps {
  visible: boolean;
  onCancel: () => void;
  onAdd: (values: any) => void;
  item_id: string | null;
  portfolio_id: string | null;
}
interface ProductInfoResponse {
  data: {
    item_name: string;
    item_type: string;
    currency: string;
  };
}

const AddEntryModal: React.FC<AddEntryModalProps> = ({ visible, onCancel, onAdd, item_id, portfolio_id }) => {
  const [form] = Form.useForm();
  const dispatch = useDispatch();
  const [itemName, setItemName] = useState<string>('');
  const [itemType, setItemType] = useState<string>('');
  const [currency, setCurrency] = useState<string>('');

  useEffect(() => {
    if (item_id) {
      dispatch(productsInfo({ item_id }) as any)
        .then((action: any) => {
          if (productsInfo.fulfilled.match(action)) {
            const payload = action.payload as ProductInfoResponse;
            const { item_name, item_type, currency } = payload.data;
            setItemName(item_name);
            setItemType(item_type);
            setCurrency(currency);
          } else {
            message.error('Failed to fetch product information');
          }
        })
        .catch(() => message.error('Failed to fetch product information'));
    }
  }, [dispatch, item_id]);


  const handleOk = async () => {
    try {
      const values = await form.validateFields();
      const { quantity, date, price } = values;
      const buy_date = date.format('YYYY-MM-DD');

      // addProduct thunk
      dispatch(addProduct({
        portfolio_id,
        item_id,
        item_name: itemName,
        item_type: itemType,
        amount: quantity,
        buy_date,
        price,
        currency
      }) as any)
      .then(() => {
        message.success('Product added successfully');
        form.resetFields();
        onCancel(); 
      })
      .catch(() => message.error('Failed to add product'));

    } catch (error) {
      console.error("Validation Failed:", error);
    }
  };

  const disabledDate = (current: Dayjs) => {
    return current && current > dayjs().endOf('day');
  };

  return (
    <Modal
      title="Add Entry"
      visible={visible}
      onCancel={onCancel}
      onOk={handleOk}
    >
      <Form form={form} layout="vertical">
        {portfolio_id && (
          <FormItem label="Portfolio ID">
            <Input value={portfolio_id} readOnly />
          </FormItem>
        )}
        {item_id && (
          <FormItem label="Item ID">
            <Input value={item_id} readOnly />
          </FormItem>
        )}
        <FormItem
          name="quantity"
          label="Quantity"
          rules={[{ required: true, message: 'Please input the quantity!' }]}
        >
          <Input placeholder="Quantity" />
        </FormItem>
        <FormItem
          name="date"
          label="Date"
          rules={[{ required: true, message: 'Please select the date!' }]}
        >
          <DatePicker  disabledDate={disabledDate} />
        </FormItem>
        <FormItem
          name="price"
          label="Price"
        >
          <Input placeholder="Price"  />
        </FormItem>
      </Form>
    </Modal>
  );
};

export default AddEntryModal;
