import React, { useEffect } from 'react';
import { Form, FormInstance, Radio, Select } from 'antd';
import styled from '@emotion/styled';
import { PaymentForm } from '../types/form';
import { GetOrderSheetPaymentMethodCardResultResponse } from '../types/api';

interface CardSelectionProps {
  cards: GetOrderSheetPaymentMethodCardResultResponse[];
  form: FormInstance<PaymentForm>;
}

export function CardSelection({
  cards,
  form,
}: CardSelectionProps): React.ReactElement {
  const selectedCardType = Form.useWatch('cardCode', form);
  const cardType = cards.find((card) => card.cardCode === selectedCardType);

  useEffect(() => {
    form.resetFields(['installmentMonth']);
  }, [form, selectedCardType]);

  return (
    <>
      <Form.Item
        rules={[{ required: true }]}
        name="cardCode"
      >
        <StyledRadioGroup
          onChange={() => {
            form.resetFields(['installmentMonth']);
          }}
          options={cards.map((item) => ({
            label: item.cardName,
            value: item.cardCode,
          }))}
        />
      </Form.Item>
      <Form.Item
        rules={[{ required: true }]}
        label="할부"
        name="installmentMonth"
      >
        <Select disabled={!selectedCardType}>
          { Array.from({ length: 12 }).map((_, index) => {
            const month = index + 1;
            return (
            // eslint-disable-next-line react/no-array-index-key
              <Select.Option key={index} value={month === 1 ? 0 : month}>
                { month === 1 ? '일시불' : `${month}개월 ${cardType?.interestFreeMonths.includes(month) ? '(무이자)' : ''}` }
              </Select.Option>
            );
          }) }
        </Select>
      </Form.Item>
    </>
  );
}

const StyledRadioGroup = styled(Radio.Group)`
  display: grid;
  grid-template-columns: 1fr 1fr 1fr;
`;
