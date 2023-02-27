import React, { useEffect, useMemo } from 'react';
import { useQuery } from 'react-query';
import { CheckboxOptionType, Form, FormInstance, Input, Radio } from 'antd';
import { GetPaymentMethodParam } from '@ohouse-payment/type';
import styled from '@emotion/styled';
import { getPaymentMethods } from '../api';
import { PaymentForm } from '../types/form';
import { CardSelection } from './CardSelection';

interface PaymentMethodsProps {
  itemProductionIds: string[];
  form: FormInstance<PaymentForm>;
}

function PaymentMethodsImpl({
  itemProductionIds,
  form,
}: PaymentMethodsProps): React.ReactElement {
  const selectedMethodType = Form.useWatch('paymentMethodType', form);

  const paymentMethodParam: GetPaymentMethodParam = {
    itemProductIds: itemProductionIds,
    serviceId: 'DEMO',
  };

  const { data, isLoading } = useQuery(
    ['paymentMethod', paymentMethodParam],
    () => getPaymentMethods(paymentMethodParam)
  );

  useEffect(() => {
    const selectedMethod = data?.data.paymentMethods.find((item) => item.paymentMethodType === selectedMethodType);
    if (!selectedMethod) return;

    form.setFieldsValue({
      paymentPgId: selectedMethod.pgId,
      cardCode: undefined,
      installmentMonth: undefined,
    });
  }, [selectedMethodType, data?.data.paymentMethods, form]);

  const cardMethod = useMemo(() => data?.data.paymentMethods.find((item) => item.paymentMethodType === 'CARD'), [data?.data.paymentMethods]);

  if (!data || isLoading) return <p>결제수단 불러오는 중</p>;

  const radioOptions: CheckboxOptionType[] = data.data.paymentMethods.map((method) => ({
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
