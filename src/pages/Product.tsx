import { getProduct } from '../api/product';
import { useQuery } from 'react-query';
import React from 'react';
import { Form, Select } from 'antd';

export function Product(): React.ReactElement {
  const productId = 1;
  const { data, isLoading } = useQuery(
    [],
    () => getProduct({ productId })
  );

  if (!data || isLoading) {
    return (<h3>잠시만 기다려주세요...</h3>);
  }

  return (
    <div>
      { data && (
        <div>
          <img alt={data.data.data.thumbnailUrl} src={data.data.data.thumbnailUrl} width="300px" />
          <div>{ data.data.data.productId }</div>
          <div>{ data.data.data.productName }</div>
          <div>{ data.data.data.brandName }</div>
          <div>{ `${data.data.data.cost}원` }</div>
          <div>{ `배송비 : ${data.data.data.deliveryFee}원` }</div>
          <Select placeholder={data.data.data.optionList.optionTitle}>
            {
              data.data.data.optionList.options.map((option) => {
                return (
                  <Select.Option
                    key={option.optionId}
                    value={option.optionId}
                    isOptionDisabled
                  >
                    { `${option.optionName} (${option.cost}원)` }
                  </Select.Option>
                );
              })
            }
          </Select>
          <Form>
            <Form.Item />
          </Form>
        </div>
      ) }
    </div>
  );
}
