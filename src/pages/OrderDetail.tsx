import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useQuery } from 'react-query';
import { getOrderDetail } from '../api/order';
import styled from '@emotion/styled';
import { Button, Select } from 'antd';

const filterType = ['주문완료', '주문취소'];
export function OrderDetail(): React.ReactElement {
  const { orderId } = useParams<{ orderId: string }>() as { orderId: string };
  const [filter, setFilter] = useState<string|null>(null);
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

  const changeFilter = (filterKey: string):void => {
    setFilter(filterKey);
  };

  const resetFilter = ():void => {
    setFilter(null);
  };

  return (
    <div>
      <div>주문 상세 정보</div>
      <div>{ `주문번호 :  ${order.orderId}` }</div>
      <div>{ `주문일자 :  ${order.orderedAt}` }</div>
      <TopAreaGroup>
        <Button onClick={() => navigate('../order/list')}>주문 내역</Button>
        { order.state === '주문 완료' && <CancelButton onClick={() => navigate(`../${orderId}/cancel`)}>전체 취소</CancelButton> }
        <Select
          onChange={changeFilter}
          placeholder="필터"
          value={filter}
        >
          {
            filterType.map(filter => {
              return (
                <Select.Option key={filter} text={filter}>
                  { filter }
                </Select.Option>
              );
            })
          }
        </Select>
        <Button onClick={resetFilter}>필터 제거</Button>
      </TopAreaGroup>
      <OrderItemGroup>
        <div>주문 상품</div>
        { order.productList && order.productList.map(product => {
          return (
            <ProductGroup>
              <div>{ `${product.productName}  |  배송비 : ${product.deliveryFee}원 ` }</div>
              <div>
                {
                  product.optionList.map(option => {
                    return ((filter == null || filter === option.state) && (
                      <ProductOptionGroup>
                        <div>{ option.optionName }</div>
                        <div>{ `${option.cost * option.count}원   |   ${option.count}개` }</div>
                        <div>{ option.state }</div>
                        { option.state === '주문 완료' && <CancelButton onClick={() => navigate(`../${orderId}/${option.orderProductOptionId}/cancel`)}>취소</CancelButton> }
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

const TopAreaGroup = styled.div`
  width: 500px;
  & > div {
    width:30%
  }
`;

const ProductGroup = styled.div`
  width: 500px;
  color: gray;
  border-top: thin solid gray;
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

const CancelButton = styled.div`
  width: 70px;
  border: thin solid gray;
  text-align: center;
  background-color: antiquewhite;
  height:30px;
`;

const OrderItemGroup = styled.div`
  width : 600px;
  border: thin solid gray;
  margin: 5px;
  padding: 5px;
`;
