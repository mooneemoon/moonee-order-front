import React, { useMemo } from 'react';
import { PostRequestPaymentParam } from 'types/api';
import { usePaymentBridge } from '@bucketplace/payment-bridge-react';
import { useMutation } from 'react-query';
import { addMinutes, format } from 'date-fns';
import { Form, Select, Input, Button, Card } from 'antd';

import { PaymentForm } from 'types/form';
import { PaymentMethods } from 'components/PaymentMethods';
import { requestPayment } from 'api/payment';
import { useLocation } from 'react-router-dom';

/**
 * 서버에서 사용하는 날짜 포맷. UTC가 아닌 로컬시간으로 보내야 함.
 * 결제쪽은 모든 시간을 KST 기준으로 저장하고 활용하기 때문에, 서버에 보내는 날짜 또한 KST로 보내주어야 하고,
 * Demo이외의 다른 서비스에서는 이런 케이스가 존재하지 않을 예정
 */
const SERVER_DATE_FORMAT = 'yyyy-MM-dd\'T\'HH:mm:ss';

const MOCK_REQUEST_BODY: PostRequestPaymentParam = {
  requestId: '',
  orderId: '',
  serviceId: 'DEMO',
  apiKey: 'f1a6109a-9889-4459-8bcf-0b1295ef791a',
  orderTitle: '에어팟 외 1건',
  userChannelType: 'OHOUSE_GUEST',
  userId: '11111111',
  orderAmount: 100000,
  paymentAmount: 100000,
  pointAmount: 0,
  couponAmount: 0,
  promotionAmount: 0,
  paymentMethodType: 'CARD',
  paymentPgId: '',
  successRedirectUrl: '',
  failRedirectUrl: '',
  items: [
    {
      itemType: 'PRODUCT',
      itemName: '아이패드',
      itemAmount: 100000,
      itemReferenceId: '10667',
      itemProductId: '260084',
      itemOptionId: '833492',
      sellingCompanyId: 1,
      taxType: 'TAX',
    },
  ],
  couponIds: [
    'string',
  ],
  promotionIds: [
    'string',
  ],
  payerName: '홍길동',
  payerEmail: 'dummy@bucketplace.net',
  payerPhoneNo: '010-1234-1234',
  clientIp: '127.0.0.1',
  userAgent: window.navigator.userAgent,
  expiryAt: null,
  requestAt: format(new Date(), SERVER_DATE_FORMAT),
  riskCategoryType: 'NORMAL',
  incomeTaxDeductionType: 'BASIC',
};

export function Pay(): React.ReactElement {
  const location = useLocation();
  const orderId = location.pathname.split('/')[1];
  console.log(location.pathname.split('/')[1]);

  const [form] = Form.useForm<PaymentForm>();
  const { doPaymentProcess, isProcessing } = usePaymentBridge({
    onFail: (payload) => {
      if (payload.redirectUrl) {
        // failRedirectUrl을 정의한 경우 값이 넘어옵니다.
        window.location.href = payload.redirectUrl;
      }
    },
    onSuccess: (payload) => {
      if (payload.redirectUrl) {
        // successRedirectUrl울 정의한 경우 값이 넘어옵니다.
        window.location.href = payload.redirectUrl;
      }
    },
    onError: ({ errorCode, message }) => alert(`[${errorCode}] ${message}`),
  });

  const { mutate } = useMutation(
    requestPayment,
    {
      onSuccess: ({ data: { paymentAuthUrl } }) => {
        if (!paymentAuthUrl) {
          alert('결제요청이 불가능한 상태입니다.');
          return;
        }
        doPaymentProcess(paymentAuthUrl);
      },
    }
  );

  const itemIds = useMemo(() => MOCK_REQUEST_BODY.items.map((item) => item.itemProductId), []);

  const submit = (formData: PaymentForm): void => {
    const { expiredAfter, ...restForm } = formData;

    let param = {
      ...MOCK_REQUEST_BODY,
      ...restForm,
      successRedirectUrl: `${window.location.origin}/${formData.orderId}/${formData.requestId}/success`,
      failRedirectUrl: `${window.location.origin}/${formData.orderId}/${formData.requestId}/fail`,
    };

    if (expiredAfter) {
      param = {
        ...param,
        expiryAt: format(addMinutes(new Date(), expiredAfter), SERVER_DATE_FORMAT),
      };
    }

    mutate(param);
  };

  return (
    <Card title="결제 테스트">
      <Form
        form={form}
        labelCol={{
          span: 5,
        }}
        wrapperCol={{
          span: 10,
        }}
        validateMessages={{
          /* eslint-disable no-template-curly-in-string */
          required: '필수 입력값입니다',
        }}
        layout="horizontal"
        initialValues={{
          orderAmount: 100000,
          userChannelType: 'OHOUSE_GUEST',
          paymentMethodType: 'CARD',
        }}
        size="middle"
        validateTrigger={['onSubmit']}
        onFinish={submit}
      >
        <Form.Item rules={[{ required: true }]} label="유저 채널 타입 (useChannelType)" name="userChannelType">
          <Select>
            <Select.Option value="OHOUSE_GUEST">오늘의집 비회원 (OHOUSE_GUEST)</Select.Option>
            { /* <Select.Option value="OHOUSE_USER">오늘의집 사용자 (OHOUSE_USER)</Select.Option> */ }
            { /* <Select.Option value="SHOP_USER">판매자 (SHOP_USER)</Select.Option> */ }
          </Select>
        </Form.Item>
        { /* <Form.Item */ }
        { /*  rules={[{ required: true }]} */ }
        { /*  label="UserId ID(userId)" */ }
        { /*  name="userId" */ }
        { /* > */ }
        { /*  <Input /> */ }
        { /* </Form.Item> */ }
        <Form.Item rules={[{ required: true }]} label="요청 ID(requestId)" name="requestId">
          <Input />
        </Form.Item>
        <Form.Item rules={[{ required: true }]} label="주문 ID (orderId)" name="orderId">
          <Input />
        </Form.Item>
        <Form.Item label="결제 유효 시간 (분)" name="expiredAfter">
          <Input type="number" />
        </Form.Item>
        <Form.Item rules={[{ required: true }]} label="결제수단">
          <PaymentMethods itemProductionIds={itemIds} form={form} />
        </Form.Item>
        <Form.Item>
          <Button type="primary" htmlType="submit">테스트</Button>
        </Form.Item>
      </Form>
      { isProcessing && <h1>결제 진행중!!!!!</h1> }
    </Card>
  );
}
