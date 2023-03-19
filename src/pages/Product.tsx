import { createOrderSheet, getProduct } from '../api/order';
import { useMutation, useQuery } from 'react-query';
import React from 'react';
import { Form, Select, Button } from 'antd';

import { ProductForm } from 'types/form';
import { SelectedOptionList } from '../components/SelectedOptionList';
import {
  PostCreatedOrderSheetSelectedOptionParam,
  PostCreateOrderSheetParam,
} from '../types/api2';
import { useNavigate } from 'react-router-dom';

export function Product(): React.ReactElement {
  const [form] = Form.useForm<ProductForm>();
  const navigate = useNavigate();

  const productId = 1;

  const { data, isLoading } = useQuery(
    [],
    () => getProduct({ productId })
  );

  const { mutate } = useMutation(
    createOrderSheet,
    {
      onSuccess: ({ data: { data: { orderId } } }) => {
        navigate('./' + orderId + '/order');
      },
    }
  );

  form.setFieldsValue({
    productId: productId,
  });

  if (!data || isLoading) {
    return (<h3>잠시만 기다려주세요...</h3>);
  }
  const handleSelectOption = (selectedOptionId : number) : void => {
    const productOptions = form.getFieldValue('productOptions') ?? [];
    const flag = productOptions.find((option : PostCreatedOrderSheetSelectedOptionParam) =>
      option.optionId === selectedOptionId) != null;

    if (flag) {
      productOptions.forEach((option : PostCreatedOrderSheetSelectedOptionParam) => {
        if (option.optionId === selectedOptionId) {
          option.count = option.count + 1;
        }
      });
    } else {
      productOptions.push({
        optionId: selectedOptionId,
        count: 1,
      });
    }

    form.setFieldsValue({
      productOptions: productOptions,
    });
  };
  const submit = (formData: ProductForm): void => {
    const param: PostCreateOrderSheetParam = {
      productId: formData.productId,
      productOptions: formData.productOptions,
    };
    mutate(param);
  };

  return (
    <div>
      { data && (
        <div>
          <img alt={data.data.data.thumbnailUrl} src={data.data.data.thumbnailUrl} width="300px" />
          <div>{ data.data.data.productName }</div>
          <div>{ data.data.data.brandName }</div>
          <div>{ `${data.data.data.cost}원` }</div>
          <div>{ `배송비 : ${data.data.data.deliveryFee}원` }</div>
          <Select placeholder={data.data.data.optionList.optionTitle} onChange={handleSelectOption}>
            {
              data.data.data.optionList.options.map((option) => {
                return (
                  <Select.Option
                    key={option.optionId}
                    value={option.optionId}
                  >
                    { `${option.optionName} (${option.cost}원)` }
                  </Select.Option>
                );
              })
            }
          </Select>
          <Form
            form={form}
            onFinish={submit}
          >
            <Form.Item name="productId">{ data.data.data.productId }</Form.Item>
            <SelectedOptionList form={form} />
            <Form.Item>
              <Button type="primary" htmlType="submit">구매하기</Button>
            </Form.Item>
          </Form>
        </div>
      ) }
    </div>
  );
}

