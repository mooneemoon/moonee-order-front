import React, { useEffect } from 'react';
import { PostRequestPaymentParam } from 'types/api2';
import { usePaymentBridge } from '@bucketplace/payment-bridge-react';
import { useMutation, useQuery } from 'react-query';
import { Form, Button, Card, Input } from 'antd';

import { PaymentForm } from 'types/form';
import { PaymentMethods } from 'components/PaymentMethods';
import { requestPayment, requestPaymentFail } from 'api/order';
import { useNavigate, useParams } from 'react-router-dom';
import { getOrderSheet } from '../api/order';
import styled from '@emotion/styled';

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

export function OrderSheet(): React.ReactElement {
  const { orderId } = useParams<{ orderId: string }>() as { orderId: string };
  const [form] = Form.useForm<PaymentForm>();
  const navigate = useNavigate();

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
        } else {
          // window.location.href = payload.redirectUrl;
          console.log(payload);
          alert(`결제가 실패하였습니다. \n${payload.failMessage}`);
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
    () => getOrderSheet(orderId),
    {
      onSuccess: () => {
        console.log('success');
      },onError: ({ response }) => {
        const error = response.data.error;
        alert(error.message);
        navigate('../');
      },
    }
  );

  useEffect(() => {
    console.log(data);
  }, [data, form]);


  if (!data || isLoading) {
    return (<h3>잠시만 기다려주세요...</h3>);
  }

  const submit = (formData: PaymentForm): void => {
    const { ...restForm } = formData;

    const param = {
      ...MOCK_REQUEST_BODY,
      ...restForm,
      // orderAmount: data.data.data.orderAmount + data.data.data.deliveryFee,
      // paymentAmount: data.data.data.orderAmount + data.data.data.deliveryFee,
      successRedirectUrl: `${window.location.origin}/${formData.orderId}/result`,
      failRedirectUrl: `${window.location.origin}/${formData.orderId}/result/fail`,
    };

    console.log(param);

    mutate(param);
  };

  const orderSheet = data.data.data;

  return (
    <Card title="결제 테스트">
      <Form
        form={form}
        labelCol={{
          span: 5,
        }}
        wrapperCol={{
          span: 15,
        }}
        validateMessages={{
          /* eslint-disable no-template-curly-in-string */
          required: '필수 입력값입니다',
        }}
        layout="horizontal"
        initialValues={{
          userChannelType: 'OHOUSE_GUEST',
          paymentMethodType: 'CARD',
        }}
        size="middle"
        validateTrigger={['onSubmit']}
        onFinish={submit}
      >
        <Form.Item rules={[{ required: true }]} label="주문 ID (orderId)" name="orderId" initialValue={orderSheet.orderId}>
          { orderSheet.orderId }
        </Form.Item>
        <OrderSheetItemGroup>
          <OrderSheetItemTitle>주문 상품</OrderSheetItemTitle>
          { orderSheet.productList.map(product => {
            return (
              <ProductGroup>
                <div>{ `${product.brandName}  |  배송비 : ${product.deliveryFee}원 ` }</div>
                <div>
                  {
                    product.optionList.map(option => {
                      return (
                        <ProductOptionGroup>
                          <img alt={product.thumbnailUrl} src={product.thumbnailUrl} width="50px" />
                          <div>{ `${product.productName} | ${option.optionName}` }</div>
                          <div>{ `${option.totalCost}원   |   ${option.count}개` }</div>
                        </ProductOptionGroup>
                      );
                    })
                  }
                </div>
              </ProductGroup>
            );
          }) }
        </OrderSheetItemGroup>
        <OrderSheetItemGroup>
          <OrderSheetItemTitle>주문자 정보</OrderSheetItemTitle>
          <Form.Item rules={[{ required: true }]} label="주문자 이름" name="userName" initialValue={orderSheet.user ? orderSheet.user.userName : ''}>
            <Input />
          </Form.Item>
          <Form.Item rules={[{ required: true }]} label="주문자 전화번호" name="phone" initialValue={orderSheet.user ? orderSheet.user.phone : ''}>
            <Input />
          </Form.Item>
          <Form.Item rules={[{ required: true }]} label="주문자 이메일" name="email" initialValue={orderSheet.user ? orderSheet.user.email : ''}>
            <Input />
          </Form.Item>
        </OrderSheetItemGroup>
        <OrderSheetItemGroup>
          <OrderSheetItemTitle>배송지 정보</OrderSheetItemTitle>
          <Form.Item rules={[{ required: true }]} label="수령인 이름" name="recipientName" initialValue={orderSheet.delivery ? orderSheet.delivery.recipientName : ''}>
            <Input />
          </Form.Item>
          <Form.Item rules={[{ required: true }]} label="수령인 전화번호" name="recipientPhone" initialValue={orderSheet.delivery ? orderSheet.delivery.recipientPhone : ''}>
            <Input />
          </Form.Item>
          <Form.Item rules={[{ required: true }]} label="배송지 주소 1" name="address" initialValue={orderSheet.delivery ? orderSheet.delivery.address : ''}>
            <Input />
          </Form.Item>
          <Form.Item rules={[{ required: true }]} label="배송지 주소 2" name="extraAddress" initialValue={orderSheet.delivery ? orderSheet.delivery.extraAddress : ''}>
            <Input />
          </Form.Item>
          <Form.Item rules={[{ required: true }]} label="배송지 우편 번호" name="postCode" initialValue={orderSheet.delivery ? orderSheet.delivery.postCode : ''}>
            <Input />
          </Form.Item>
          <Form.Item rules={[{ required: true }]} label="배송 요청 사항" name="deliveryRequest" initialValue={orderSheet.delivery ? orderSheet.delivery.deliveryRequest : ''}>
            <Input />
          </Form.Item>
        </OrderSheetItemGroup>
        <OrderSheetItemGroup>
          <OrderSheetItemTitle>결제 수단</OrderSheetItemTitle>
          <Form.Item rules={[{ required: true }]} label="결제수단">
            <PaymentMethods paymentMethods={orderSheet.paymentMethods} form={form} />
          </Form.Item>
        </OrderSheetItemGroup>
        <OrderSheetItemGroup>
          <OrderSheetItemTitle>결제 금액</OrderSheetItemTitle>
          <Form.Item rules={[{ required: true }]} label="주문 금액" name="orderAmount" initialValue={orderSheet.orderAmount}>{ `${orderSheet.orderAmount}원` }</Form.Item>
          <Form.Item label="상품 금액">{ `${orderSheet.productCost}원` }</Form.Item>
          <Form.Item label="배송비">{ `${orderSheet.deliveryFee}원` }</Form.Item>
          <Form.Item rules={[{ required: true }]} label="포인트 사용" name="pointAmount" initialValue={0}>(-) 0원</Form.Item>
          <Form.Item rules={[{ required: true }]} label="쿠폰 사용" name="couponAmount" initialValue={0}>(-) 0원</Form.Item>
          <Form.Item rules={[{ required: true }]} label="할인 금액" name="promotionAmount" initialValue={0}>(-) 0원</Form.Item>
          <PaymentAmountBox>
            <Form.Item rules={[{ required: true }]} label="결제 금액" name="paymentAmount" initialValue={orderSheet.orderAmount}>{ `${orderSheet.orderAmount}원` }</Form.Item>
          </PaymentAmountBox>
        </OrderSheetItemGroup>
        <Form.Item>
          <Button type="primary" htmlType="submit">결제하기</Button>
        </Form.Item>
      </Form>
      { isProcessing && <h1>결제 진행중!!!!!</h1> }
    </Card>
  );
}

const ProductGroup = styled.div`
  width: 500px;
  color: gray;
  border-bottom: thin solid gray;
  padding: 10px;
  &:last-child {
    border-bottom: none;
  }
`;

const ProductOptionGroup = styled.div`
  width: 450px;
  border: thin solid gray;
  padding: 5px;
  margin-top: 5px;
`;

const OrderSheetItemGroup = styled.div`
  width : 600px;
  border: thin solid gray;
  margin: 5px;
  padding: 5px;
`;

const OrderSheetItemTitle = styled.div`
  border-bottom: thin solid gray;
  font-weight: bold;
  font-size: 15px;
  padding-bottom: 5px;
  margin-bottom: 10px;
`;

const PaymentAmountBox = styled.div`
  border: thin solid gray;
    `;
