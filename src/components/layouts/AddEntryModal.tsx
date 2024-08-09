import React, { useEffect, useState } from 'react';
import { Modal, Form, Input, DatePicker, message, Row, Col  } from 'antd';
import { useDispatch } from 'react-redux';
import { change_add_item, productsInfo, set_active_key } from '../../store/features/portfolioSlice';
import { addProduct, getProductHistoryPrice } from "../../store/features/portfolioSlice"
import dayjs, { Dayjs } from 'dayjs';
import { useAppDispatch } from '../../store/hooks';
import item from "../pages/Item";

const { Item: FormItem } = Form;

interface AddEntryModalProps {
  visible: boolean;
  onCancel: () => void;
  onAdd: (values: any) => void;
  item_id: string | null;
  portfolio_id: string | null;
  onAddSuccess: () => void;
}
interface ProductInfoResponse {
  data: {
    item_name: string;
    item_type: string;
    currency: string;
    current_price: number | null;
    current_rate: number | null;
    history_price: number;
  };
}

interface OpenPriceResponse {
  data: {
    price:number;
  };
}

const AddEntryModal: React.FC<AddEntryModalProps> = ({ visible, onCancel, onAdd, item_id, portfolio_id,onAddSuccess }) => {
  const [form] = Form.useForm();
  const dispatch = useDispatch();
  const [itemName, setItemName] = useState<string>('');
  const [itemType, setItemType] = useState<string>('');
  const [currency, setCurrency] = useState<string>('');
  const [current_price, setCurrencyPrice] = useState<number | null>(null);
  const [current_rate, setCurrencyRate] = useState<number | null>(null);
  const [history_price, setHistoryPrice] = useState<number>(0);
  const [selectedDate, setSelectedDate] = useState<Dayjs | null>(null);
  const sliceDispatch=useAppDispatch();
  useEffect(() => {
    if (item_id) {
      dispatch(productsInfo({ item_id }) as any)
        .then((action: any) => {
          if (productsInfo.fulfilled.match(action)) {
            const payload = action.payload as ProductInfoResponse;
            const { item_name, item_type, currency, current_price, current_rate} = payload.data;
            setItemName(item_name);
            setItemType(item_type);
            setCurrency(currency);
            setCurrencyPrice(current_price);
            setCurrencyRate(current_rate);
          } else {
            message.error('Failed to fetch product information');
          }
        })
        .catch(() => message.error('Failed to fetch product information'));
    }
  }, [dispatch, item_id]);

  useEffect(() => {
    const date = selectedDate;
    if (date && item_id) {
      const buy_date = date.format('YYYY-MM-DD');
      dispatch(getProductHistoryPrice({ item_id, buy_date }) as any)
        .then((action: any) => {
          if (getProductHistoryPrice.fulfilled.match(action)) {
            const payload = action.payload as OpenPriceResponse;
            const { price } = payload.data;
            form.setFieldsValue({price});
            setHistoryPrice(price);
          } else {
            message.error('Failed to fetch historical price');
          }
        })
        .catch(() => message.error('Failed to fetch historical price'));
    }
  }, [dispatch, selectedDate , item_id]);

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
        message.success('Product added successfully.');
        form.resetFields();
        onCancel();
        onAddSuccess();
      })
      .catch(() => message.error('Failed to add product'));

    } catch (error) {
      console.error("Validation Failed:", error);
    }
  };

  const disabledDate = (current: Dayjs) => {
    return current && current > dayjs().endOf('day');
  };

const handleDateChange = (date: Dayjs | null) => {
  setSelectedDate(date)
};

const formatRate = (rate: number) => {
  return `${(rate * 100).toFixed(2)}%`;
};

const getCurrencySymbol = (currency: string) => {
  switch (currency) {
    case 'USD': return '$';
    case 'EUR': return '€';
    case 'GBP': return '£';
    case 'JPY': return '¥';
    default: return currency;
  }
};

return (
  <Modal
    title="Add Entry"
    visible={visible}
    onCancel={onCancel}
    onOk={handleOk}
  >
    <Form form={form} layout="vertical"
      onValuesChange={(changedValues) => {
        if (changedValues.date) {
          handleDateChange(changedValues.date);
        }
      }}>
      <Row gutter={16}>
        <Col span={8}>
          <FormItem label="Item ID">
            <Input value={item_id ?? ''} readOnly />
          </FormItem>
        </Col>
        <Col span={8}>
          <FormItem label="Current Price">
            <Input
              value={current_price != null ? `${getCurrencySymbol(currency)}${current_price}` : getCurrencySymbol(currency)}
              readOnly
              disabled={current_price == null}
              style={{
                color: current_price == null ? 'grey' : 'black',
                cursor: current_price == null ? 'not-allowed' : 'default'
              }}
            />
          </FormItem>
        </Col>
        <Col span={8}>
        <FormItem label="Current Rate">
          <Input
            value={current_rate != null ? formatRate(current_rate) : ''}
            readOnly
            disabled={current_rate == null}
            style={{
              color: current_rate == null ? 'grey' : (current_rate < 0 ? 'red' : 'green'),
              cursor: current_rate == null ? 'not-allowed' : 'default'
            }}
          />
        </FormItem>
      </Col>
      </Row>
      {portfolio_id && (
        <FormItem label="Portfolio ID">
          <Input value={portfolio_id ?? ''} readOnly />
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
        <DatePicker disabledDate={disabledDate} />
      </FormItem>
      <FormItem
        name="price"
        label="Price"
      >
        <Input placeholder="Price" />
      </FormItem>
    </Form>
  </Modal>
);
};

export default AddEntryModal;
