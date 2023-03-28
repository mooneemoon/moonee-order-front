import React, { useEffect } from 'react';
import { useNavigate, useParams, useSearchParams } from 'react-router-dom';
import queryString from 'query-string';
import { useMutation } from 'react-query';
import { AxiosError } from 'axios';
import { ErrorResponse, PaymentMethodType } from 'types/api';

import { approvePayment } from '../api/order';
import { PostPaymentApprovalParam } from '../types/api2';
import { Button } from 'antd';

type PaymentSuccessQueryString = Omit<PostPaymentApprovalParam, 'serviceId'> & {
  paymentMethodType?: PaymentMethodType,
};

export function Success(): React.ReactElement {
  const { orderId } = useParams<{ orderId: string }>() as { orderId: string };
  const [searchParam] = useSearchParams();
  const navigate = useNavigate();

  const goOrderSheet = (): void => {
    navigate(`../${orderId}/order`);
  };

  const {
    mutate,
    isLoading,
    isError,
    error,
  } = useMutation(
    'payment/approve',
    approvePayment,
    {
      onSuccess: (payload) => {
        console.log(payload);
        navigate('./success');
      },
    }
  );

  const errorData = isError && error ? (error as AxiosError<ErrorResponse>).response?.data : null;

  useEffect(() => {
    const { ...param } = queryString.parse(searchParam.toString()) as PaymentSuccessQueryString;
    mutate(param);
  }, [searchParam, mutate]);

  return (
    <>
      { isLoading && <h2>결제 승인중입니다. 잠시만 기다려 주세요</h2> }
      { isError && error && (
        <div>
          <h2>
            <div>결제 실패</div>
            { errorData?.error.message }
          </h2>
          { errorData?.error.code === 'E500' && <Button type="primary" onClick={goOrderSheet}>주문서로 돌아가기</Button> }
        </div>
      ) }
    </>
  );
}
