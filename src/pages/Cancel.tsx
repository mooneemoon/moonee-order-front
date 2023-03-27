import React from 'react';
import { useParams } from 'react-router-dom';
// import { PaymentApprovalResponse } from '../types/api2';
// import * as querystring from 'query-string';
// import styled from '@emotion/styled';

export function Cancel(): React.ReactElement {
  const { orderId, orderProductOptionId } = useParams<{
    orderId: string, orderProductOptionId?: string,
  }>() as { orderId: string, orderProductOptionId?: string };
  return (
    <div>
      <div>취소</div>
      <div>{ orderId }</div>
      <div>{ orderProductOptionId }</div>
    </div>
  );
  // return (
  //   <Wrapper>
  //     { Object.entries(param).map(([key, value]) => (
  //       <h2 key={key}>
  //         { key }
  //         :
  //         { value }
  //       </h2>
  //     )) }
  //   </Wrapper>
  // );
}

// const Wrapper = styled.div`
//   text-align: center;
//   padding-top: 300px;
// `;
