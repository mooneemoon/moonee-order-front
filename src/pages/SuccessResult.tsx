import React from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Button } from 'antd';

export function SuccessResult(): React.ReactElement {
  const { orderId } = useParams<{ orderId: string }>() as { orderId: string };
  const navigate = useNavigate();
  const goOrderDetail = (): void => {
    navigate(`../${orderId}/detail`);
  };
  // const { data, isLoading } = useQuery(
  //   ['payment/approve/result', param],
  //   () => getPaymentApprovalResult({
  //     ...param,
  //     serviceId: 'DEMO',
  //   }),
  //   {
  //     enabled: !!(param.orderId && param),
  //   }
  // );

  return (
    // <div>
    //   { isLoading && <h3>잠시만 기다려주세요...</h3> }
    //   { data && (
    //     <>
    //       <h3>주문이 완료되었습니다.</h3>
    //       <TypedReactJson src={data.data} />
    //     </>
    //   ) }
    // </div>
    <div>
      <div>주문이 완료되었습니다</div>
      <Button type="primary" onClick={goOrderDetail}>주문 상세</Button>
    </div>
  );
}
