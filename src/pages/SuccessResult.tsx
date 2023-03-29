import React from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Button } from 'antd';

export function SuccessResult(): React.ReactElement {
  const { orderId } = useParams<{ orderId: string }>() as { orderId: string };
  const navigate = useNavigate();

  return (
    <div>
      <div>주문이 완료되었습니다</div>
      <Button type="primary" onClick={() => navigate(`../${orderId}/detail`)}>주문 상세</Button>
    </div>
  );
}
