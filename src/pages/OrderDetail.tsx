import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useQuery } from 'react-query';
import { getOrderDetail } from '../api/order';
import styled from '@emotion/styled';
import { Select } from 'antd';

const stateList = ['주문 완료', '주문 취소'];
export function OrderDetail(): React.ReactElement {
  const { orderId } = useParams<{ orderId: string }>() as { orderId: string };
  const [selectedFilterKey, setSelectedFilterKey] = useState<string|null>(
    null
  );
  const navigate = useNavigate();

  const { data, isLoading } = useQuery(
    ['order/detail'],
    () => getOrderDetail({
      orderId: Number(orderId),
    })
  );

  if (!data || isLoading) {
    return (<h3>잠시만 기다려주세요...</h3>);
  }

  const order = data.data.data;

  const filter = (filterKey: string):void => {
    console.log(filterKey);
    setSelectedFilterKey(filterKey);
  };
  const cancel = ():void => {
    navigate(`../${orderId}/cancel`);
  };
  const cancelOption = (orderProductOptionId: number):void => {
    navigate(`../${orderId}/${orderProductOptionId}/cancel`);
  };

  return (
    <div>
      <div>주문 상세 정보</div>
      <div>{ `주문번호 :  ${order.orderId}` }</div>
      <div>{ `주문일자 :  ${order.orderedAt}` }</div>
      <div>
        <CancelButton onClick={cancel}>전체 취소</CancelButton>
        <Select onChange={filter} placeholder="필터">
          {
            stateList.map(state => {
              return <Select.Option key={state} text={state}>주문 완료</Select.Option>;
            })
          }
        </Select>
      </div>
      <OrderItemGroup>
        <div>주문 상품</div>
        { order.orderProductList.map(product => {
          return (
            <ProductGroup>
              <div>{ `${product.productName}  |  배송비 : ${product.deliveryCost}원 ` }</div>
              <div>
                {
                  product.orderProductOptionList.map(option => {
                    return ((selectedFilterKey == null || selectedFilterKey === option.state) && (
                      <ProductOptionGroup>
                        <div>{ option.optionName }</div>
                        <div>{ `${option.cost * option.count}원   |   ${option.count}개` }</div>
                        <div>{ option.state }</div>
                        { option.state === '주문 완료' && <CancelButton onClick={() => cancelOption(option.orderProductOptionId)}>취소</CancelButton> }
                      </ProductOptionGroup>
                    )
                    );
                  })
                }
              </div>
            </ProductGroup>
          );
        }) }
      </OrderItemGroup>
      <OrderItemGroup>
        <div>배송지 정보</div>
        <div>{ `받는 사람 : ${order.recipientName}` }</div>
        <div>{ `연락처 | ${order.recipientPhone}` }</div>
        <div>{ `주소 | (${order.postCode}) ${order.deliveryAddress} ${order.deliveryExtraAddress}` }</div>
        <div>{ `배송 메모 | ${order.deliveryRequest}` }</div>
      </OrderItemGroup>
      <OrderItemGroup>
        <div>주문자 정보</div>
        <div>{ `주문자 | ${order.userName} (회원번호 : ${order.userId})` }</div>
        <div>{ `연락처 : ${order.userPhone}` }</div>
        <div>{ `이메일 : ${order.userEmail}` }</div>
      </OrderItemGroup>
      <OrderItemGroup>
        <div>결제 정보</div>
        <div>{ `주문 금액 | ${order.paymentCost + order.promotionCost + order.point}` }</div>
        <div>{ `할인 금액 | (-) ${order.promotionCost}원` }</div>
        <div>{ `포인트 | (-) ${order.point}원` }</div>
        <div>{ `결제 금액 | ${order.paymentCost}원` }</div>
        <div>{ `결제 방법 | ${order.paymentMethod}` }</div>
        <div>{ order.paymentMethod === 'CARD' && `카드 코드 | ${order.cardCode}` }</div>
        <div>{ order.paymentMethod === 'CARD' && `할부 개월 수 | ${order.installmentMonth}개월` }</div>
      </OrderItemGroup>
    </div>
  );
}

const ProductGroup = styled.div`
  width: 500px;
  color: gray;
  border-top: thin solid gray;
  border-bottom: thin solid gray;
  padding: 10px
`;

const ProductOptionGroup = styled.div`
  width: 450px;
  border: thin solid gray;
  padding: 5px;
  margin-top: 5px;
`;

const CancelButton = styled.div`
  width: 70px;
  border: thin solid gray;
  text-align: center;
`;

const OrderItemGroup = styled.div`
  width : 600px;
  border: thin solid gray;
  margin: 5px;
  padding: 5px;
`;
