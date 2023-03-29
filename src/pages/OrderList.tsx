import React, { useState } from 'react';
import { getOrderList } from '../api/order';
import { useMutation, useQuery } from 'react-query';
import styled from '@emotion/styled';
import { useNavigate } from 'react-router-dom';
import { Button, Select } from 'antd';
import { GetOrderListOrderResponse } from '../types/api';

export interface Filter {
  name: string;
  description: string;
}
const filterType: Filter[] = [
  { name: 'ORDER_COMPLETE', description: '주문완료' },
  { name: 'ORDER_CANCEL', description: '주문취소' },
  { name: 'ORDER_PARTIAL_CANCEL', description: '부분취소' },
];
export function OrderList(): React.ReactElement {
  const navigate = useNavigate();
  const [filter, setFilter] = useState<string|null>(null);
  const [page, setPage] = useState<number|null>(0);
  const [size] = useState<number|null>(5);
  const [orderList, setOrderList] = useState<GetOrderListOrderResponse[]>([]);
  const [moreList, setMoreList] = useState<boolean>(true);
  const loadMore = ():void => {
    loadMoreMutate({ filter: filter, page: page, size: size });
  };

  const changeFilter = (key: string):void => {
    setFilter(key);
    changeFilterMutate({ filter: key, page: 0, size: size });
  };

  const resetFilter = ():void => {
    setFilter(null);
    changeFilterMutate({ filter: null, page: 0, size: size });
  };

  const { mutate: loadMoreMutate } = useMutation(
    getOrderList,
    {
      onSuccess: (data) => {
        setOrderList(orderList.concat(data.data.data));
        setPage((page ? page + 1 : 1));
        setMoreList(data.data.data.length === size);

        console.log(filter + ' ' + page + ' ' + size);
      },
      onError: () => {
        alert('조회에 실패하였습니다');
      },
    }
  );

  const { mutate: changeFilterMutate } = useMutation(
    getOrderList,
    {
      onSuccess: (data) => {
        setOrderList(data.data.data);
        setPage(1);
        setMoreList(data.data.data.length === size);

        console.log(filter + ' ' + page + ' ' + size);
      },
      onError: () => {
        alert('조회에 실패하였습니다');
      },
    }
  );

  const { data, isLoading } = useQuery(
    ['order/list'],
    () => getOrderList({
      filter: filter,
      page: page,
      size: size,
    }),
    {
      onSuccess: (data) => {
        setOrderList(data.data.data);
        setPage((page ? page + 1 : 1));
        setMoreList(data.data.data.length === size);
      },
    }
  );

  if (!data || isLoading) {
    return (<h3>잠시만 기다려주세요...</h3>);
  }

  return (
    <div>
      <div>주문 내역</div>
      <TopAreaGroup>
        <Select
          onChange={changeFilter}
          placeholder="필터"
          value={filter}
        >
          {
            filterType.map(filter => {
              return (
                <Select.Option key={filter.name} text={filter.description}>
                  { filter.description }
                </Select.Option>
              );
            })
          }
        </Select>
        <Button onClick={resetFilter}>필터 제거</Button>
      </TopAreaGroup>
      { orderList && (
        orderList.map(order => {
          return (
            <OrderGroup onClick={() => navigate(`../${order.orderId}/detail`)}>
              <div>{ `주문번호 : ${order.orderId} | ${order.orderedAt}` }</div>
              <Button type="primary">상세 보기</Button>
              { order.orderProductList.map(product => {
                return (
                  <ProductGroup>
                    <div>{ `${product.productName}  |  배송비 : ${product.deliveryCost}원 ` }</div>
                    {
                      product.orderProductOptionList.map(option => {
                        return (
                          <ProductOptionGroup>
                            <div>{ option.optionName }</div>
                            <div>{ `${option.cost * option.count}원   |   ${option.count}개` }</div>
                            <div>{ option.state }</div>
                          </ProductOptionGroup>
                        );
                      })
                    }
                  </ProductGroup>
                );
              }) }
            </OrderGroup>
          );
        })) }
      { moreList && <MoreButton onClick={loadMore}>더보기</MoreButton> }
    </div>
  );
}

const TopAreaGroup = styled.div`
  width: 500px;
  & > div {
    width:30%
  }
`;

const OrderGroup = styled.div`
  width : 600px;
  border: thin solid gray;
  margin: 5px;
  padding: 5px;
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

const MoreButton = styled.div`
  border: 1px solid grey;
  background-color: cadetblue;
  border-radius: 5px;
  width:600px;
  height: 50px;
  display: flex;
  justify-content: center;
  align-items: center;
`;

