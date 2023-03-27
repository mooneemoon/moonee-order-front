import React, { useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import queryString from 'query-string';
import { useMutation } from 'react-query';
import { AxiosError } from 'axios';
import { ErrorResponse, PaymentMethodType } from 'types/api';

import { approvePayment } from '../api/order';
import { PostPaymentApprovalParam } from '../types/api2';

type PaymentSuccessQueryString = Omit<PostPaymentApprovalParam, 'serviceId'> & {
  paymentMethodType?: PaymentMethodType,
};

export function Success(): React.ReactElement {
  const [searchParam] = useSearchParams();
  const navigate = useNavigate();

  const {
    mutate,
    isLoading,
    isError,
    error,
  } = useMutation(
    'payment/approve',
    approvePayment,
    {
      onError: (payload) => {
        console.log(payload);
        navigate('./fail');
      },
      onSuccess: (payload) => {
        console.log(payload);
        navigate('./success');
      },
    }
  );

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
            ERROR!!
            { (error as AxiosError<ErrorResponse>).response?.data.message }
          </h2>
          <h3>
            { (error as AxiosError<ErrorResponse>).response?.data.detailMessage }
          </h3>
        </div>
      ) }
    </>
  );
}
