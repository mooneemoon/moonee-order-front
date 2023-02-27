import React, { useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import queryString from 'query-string';
import { useMutation } from 'react-query';
import { AxiosError } from 'axios';
import { ErrorResponse, PaymentMethodType, PostPaymentApprovalParam } from '@ohouse-payment/type';

import { approvePayment, issueVirtualAccount } from '../api';

type PaymentSuccessQueryString = Omit<PostPaymentApprovalParam, 'serviceId'> & {
  paymentMethodType?: PaymentMethodType,
};

export function Success(): React.ReactElement {
  const [searchParam] = useSearchParams();
  const navigate = useNavigate();

  const {
    mutate: approveMutate,
    isLoading: isApproveLoading,
    isError: isApproveError,
    error: approveError,
  } = useMutation(
    'payment/approve',
    approvePayment,
    {
      onSuccess: () => {
        navigate('./result');
      },
    }
  );

  const {
    mutate: issueAccountMutate,
    isLoading: isIssueAccountLoading,
    isError: isIssueAccountError,
    error: issueAccountError,
  } = useMutation(
    'payment/approve',
    issueVirtualAccount,
    {
      onSuccess: () => {
        navigate('./result');
      },
    }
  );

  useEffect(() => {
    const { paymentMethodType, ...param } = queryString.parse(searchParam.toString()) as PaymentSuccessQueryString;
    if (paymentMethodType === 'VIRTUAL_ACCOUNT') {
      issueAccountMutate({ ...param, serviceId: 'DEMO' });
    } else {
      approveMutate({ ...param, serviceId: 'DEMO' });
    }

  }, [searchParam, issueAccountMutate, approveMutate]);

  const isLoading = isApproveLoading || isIssueAccountLoading;
  const isError = isApproveError || isIssueAccountError;
  const error = approveError || issueAccountError;

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
