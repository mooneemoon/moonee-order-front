import React, { useEffect } from 'react';
import { CheckboxOptionType, Form, FormInstance, Input, Radio } from 'antd';
import styled from '@emotion/styled';
import { PaymentForm } from '../types/form';
import { CardSelection } from './CardSelection';
import { GetOrderSheetPaymentMethodResultResponse } from '../types/api2';

interface PaymentMethodsProps {
  paymentMethods: GetOrderSheetPaymentMethodResultResponse[];
  form: FormInstance<PaymentForm>;
}

function PaymentMethodsImpl({
  paymentMethods = [],
  form,
}: PaymentMethodsProps): React.ReactElement {
  const selectedMethodType = Form.useWatch('paymentMethodType', form);

  useEffect(() => {
    const selectedMethod = paymentMethods.find((item) => item.paymentMethodType === selectedMethodType);
    if (!selectedMethod) return;

    form.setFieldsValue({
      paymentPgId: selectedMethod.pgId,
      cardCode: undefined,
      installmentMonth: undefined,
    });
  }, [selectedMethodType, paymentMethods, form]);

  const cardMethod = paymentMethods.find((item) => item.paymentMethodType === 'CARD');

  const radioOptions: CheckboxOptionType[] = paymentMethods.map((method) => ({
    label: method.paymentMethodName,
    value: method.paymentMethodType,
  }));

  return (
    <>
      <Form.Item rules={[{ required: true }]} name="paymentMethodType">
        <StyledRadioGroup
          buttonStyle="solid"
          optionType="button"
          options={radioOptions}
        />
      </Form.Item>
      <Form.Item name="paymentPgId" label="Payment PG Id">
        <Input />
      </Form.Item>
      { /* FIXME form이 drill down 하는 depth가 너무 깊다 */ }
      { selectedMethodType === 'CARD' && cardMethod && (<CardSelection cards={cardMethod.cards} form={form} />) }
    </>
  );
}

const StyledRadioGroup = styled(Radio.Group)`
  /* 왜인지 모르지만 zindex가 적용되어 있어 결제창 위로 노출되기 때문에 초기화*/
  .ant-radio-button-wrapper-checked:not(.ant-radio-button-wrapper-disabled) {
    z-index: 0
  }
`;

export const PaymentMethods = React.memo(PaymentMethodsImpl);
