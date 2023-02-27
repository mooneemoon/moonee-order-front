import React from 'react';
import * as querystring from 'query-string';
import styled from '@emotion/styled';

interface FailSearchParam {
  orderId: string;
  paymentId: string;
  failCode: string;
  failMessage: string;
  failType: string;
}

export function Fail(): React.ReactElement {
  const param = querystring.parse(window.location.search) as unknown as FailSearchParam;

  return (
    <Wrapper>
      { Object.entries(param).map(([key, value]) => (
        <h2 key={key}>
          { key }
          :
          { value }
        </h2>
      )) }
    </Wrapper>
  );
}

const Wrapper = styled.div`
  text-align: center;
  padding-top: 300px;
`;
