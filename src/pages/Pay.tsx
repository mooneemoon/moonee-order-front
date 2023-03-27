import React, { useEffect } from 'react';
import { PostRequestPaymentParam } from 'types/api2';
import { usePaymentBridge } from '@bucketplace/payment-bridge-react';
import { useMutation, useQuery } from 'react-query';
import { Form, Button, Card, Input } from 'antd';

import { PaymentForm } from 'types/form';
import { PaymentMethods } from 'components/PaymentMethods';
import { requestPayment, requestPaymentFail } from 'api/order';
import { useParams } from 'react-router-dom';
import { getOrderSheet } from '../api/order';
import ReactJson, { ReactJsonViewProps } from 'react-json-view';

/**
 * 서버에서 사용하는 날짜 포맷. UTC가 아닌 로컬시간으로 보내야 함.
 * 결제쪽은 모든 시간을 KST 기준으로 저장하고 활용하기 때문에, 서버에 보내는 날짜 또한 KST로 보내주어야 하고,
 * Demo이외의 다른 서비스에서는 이런 케이스가 존재하지 않을 예정
 */

const MOCK_REQUEST_BODY: PostRequestPaymentParam = {
  orderId: '',
  paymentMethodType: 'CARD',
  paymentPgId: '',
  orderAmount: 100000,
  paymentAmount: 100000,
  pointAmount: 0,
  couponAmount: 0,
  promotionAmount: 0, // payment
  userName: 'moonee',
  phone: '',
  email: '', // user
  recipientName: '',
  recipientPhone: '',
  address: '',
  extraAddress: '',
  postCode: '', // delivery
  successRedirectUrl: '',
  failRedirectUrl: '',
};

export function Pay(): React.ReactElement {
  const { orderId } = useParams<{ orderId: string }>() as { orderId: string };
  const [form] = Form.useForm<PaymentForm>();

  const { doPaymentProcess, isProcessing } = usePaymentBridge({
    onFail: (payload) => {
      if (payload.redirectUrl) {
        requestPaymentFail({
          orderId: Number(orderId),
          paymentId: payload.paymentId,
          paymentFailType: payload.failType,
        });

        if (payload.failType === 'USER_CANCEL') {
          alert('결제를 취소하였습니다.');
        } else if (payload.failType === 'ERROR') {
          alert('결제가 실패하였습니다.');
        } else {
          window.location.href = payload.redirectUrl;
        }
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
      onSuccess: ({ data: { data: { paymentAuthUrl } } }) => {
        console.log(paymentAuthUrl);
        if (!paymentAuthUrl) {
          alert('결제요청이 불가능한 상태입니다.');
          return;
        }
        doPaymentProcess(paymentAuthUrl);
      },
    }
  );

  const { data, isLoading } = useQuery(
    ['order/sheet'],
    () => getOrderSheet(orderId)
  );

  useEffect(() => {
    console.log(data);
    // form.setFieldsValue({
    //   orderId: data?.data.data.orderId || 1,
    // });
  }, [data, form]);


  if (!data || isLoading) {
    return (<h3>잠시만 기다려주세요...</h3>);
  }

  const submit = (formData: PaymentForm): void => {
    const { ...restForm } = formData;

    const param = {
      ...MOCK_REQUEST_BODY,
      ...restForm,
      orderAmount: data.data.data.orderAmount + data.data.data.deliveryFee,
      paymentAmount: data.data.data.orderAmount + data.data.data.deliveryFee,
      pointAmount: 0,
      couponAmount: 0,
      promotionAmount: 0,
      successRedirectUrl: `${window.location.origin}/${formData.orderId}/result`,
      failRedirectUrl: `${window.location.origin}/${formData.orderId}/result/fail`,
    };

    mutate(param);
  };

  const TypedReactJson = ReactJson as React.FC<ReactJsonViewProps>;

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
        <Form.Item rules={[{ required: true }]} label="주문 ID (orderId)" name="orderId" initialValue={data.data.data.orderId}>
          <Input disabled />
        </Form.Item>
        <Form.Item rules={[{ required: true }]} label="주문자 이름" name="userName" initialValue={data.data.data.user ? data.data.data.user.userName : ''}>
          <Input />
        </Form.Item>
        <Form.Item rules={[{ required: true }]} label="주문자 전화번호" name="phone" initialValue={data.data.data.user ? data.data.data.user.phone : ''}>
          <Input />
        </Form.Item>
        <Form.Item rules={[{ required: true }]} label="주문자 이메일" name="email" initialValue={data.data.data.user ? data.data.data.user.email : ''}>
          <Input />
        </Form.Item>
        <Form.Item rules={[{ required: true }]} label="수령인 이름" name="recipientName" initialValue={data.data.data.delivery ? data.data.data.delivery.recipientName : ''}>
          <Input />
        </Form.Item>
        <Form.Item rules={[{ required: true }]} label="수령인 전화번호" name="recipientPhone" initialValue={data.data.data.delivery ? data.data.data.delivery.recipientPhone : ''}>
          <Input />
        </Form.Item>
        <Form.Item rules={[{ required: true }]} label="배송지 주소 1" name="address" initialValue={data.data.data.delivery ? data.data.data.delivery.address : ''}>
          <Input />
        </Form.Item>
        <Form.Item rules={[{ required: true }]} label="배송지 주소 2" name="extraAddress" initialValue={data.data.data.delivery ? data.data.data.delivery.extraAddress : ''}>
          <Input />
        </Form.Item>
        <Form.Item rules={[{ required: true }]} label="배송지 우편 번호" name="postCode" initialValue={data.data.data.delivery ? data.data.data.delivery.postCode : ''}>
          <Input />
        </Form.Item>
        <Form.Item rules={[{ required: true }]} label="배송 요청 사항" name="deliveryRequest" initialValue={data.data.data.delivery ? data.data.data.delivery.deliveryRequest : ''}>
          <Input />
        </Form.Item>
        <Form.Item rules={[{ required: true }]} label="결제수단">
          <PaymentMethods paymentMethods={data.data.data.paymentMethods} form={form} />
        </Form.Item>
        <Form.Item>
          <Button type="primary" htmlType="submit">결제하기</Button>
        </Form.Item>
      </Form>
      <TypedReactJson src={data.data.data.productList} />
      { isProcessing && <h1>결제 진행중!!!!!</h1> }
    </Card>
  );
}
