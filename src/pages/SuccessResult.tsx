import React from 'react';
import { useParams } from 'react-router-dom';
import { useQuery } from 'react-query';
import ReactJson, { ReactJsonViewProps } from 'react-json-view';
import { getPaymentApprovalResult } from '../api/payment';

const TypedReactJson = ReactJson as React.FC<ReactJsonViewProps>;

export function SuccessResult(): React.ReactElement {
  const param = useParams<{ orderId: string, requestId: string }>() as { orderId: string, requestId: string };

  const { data, isLoading } = useQuery(
    ['payment/approve/result', param],
    () => getPaymentApprovalResult({
      ...param,
      serviceId: 'DEMO',
    }),
    {
      enabled: !!(param.orderId && param.requestId),
    }
  );

  return (
    <div>
      { isLoading && <h3>잠시만 기다려주세요...</h3> }
      { data && (
        <>
          <h3>주문이 완료되었습니다.</h3>
          <TypedReactJson src={data.data} />
        </>
      ) }
    </div>
  );
}
