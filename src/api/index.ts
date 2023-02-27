import { client } from 'api/client';
import { AxiosPromise } from 'axios';
import {
  GetPaymentApprovalResultParam,
  GetPaymentApprovalResultResponse,
  GetPaymentCancelResponse,
  GetPaymentCancelResultParam,
  GetPaymentMethodParam,
  GetPaymentMethodResponse,
  IssueVirtualAccountResponse,
  PaymentApprovalResponse,
  PostPaymentApprovalParam,
  PostPaymentCancelParam,
  PostPaymentCancelResponse,
  PostRequestPaymentParam,
  PostRequestPaymentProcessResponse,
  PostVirtualAccountIssuance,
} from '@ohouse-payment/type';
import queryString from 'query-string';

export function requestPayment(
  param: PostRequestPaymentParam
): AxiosPromise<PostRequestPaymentProcessResponse> {
  return client.post<PostRequestPaymentProcessResponse>(
    '/v1/inhouse/payments:request',
    param
  );
}

export function approvePayment(
  { paymentId, ...body }: PostPaymentApprovalParam
): AxiosPromise<PaymentApprovalResponse> {
  return client.post<PaymentApprovalResponse>(
    `/v1/inhouse/payments/${paymentId}:approval`,
    body
  );
}

export function issueVirtualAccount(
  { paymentId, ...body }: PostVirtualAccountIssuance
): AxiosPromise<IssueVirtualAccountResponse> {
  return client.post<IssueVirtualAccountResponse>(
    `/v1/inhouse/payments/${paymentId}:virtual-account-issuance`,
    body
  );
}

export function getPaymentMethods(
  param: GetPaymentMethodParam
): AxiosPromise<GetPaymentMethodResponse> {
  const query = queryString.stringify(param);
  return client.get<GetPaymentMethodResponse>(`/v1/inhouse/payment-methods?${query}`);
}

export function getPaymentApprovalResult({
  requestId,
  orderId,
  serviceId,
}: GetPaymentApprovalResultParam): AxiosPromise<GetPaymentApprovalResultResponse> {
  return client.get<GetPaymentApprovalResultResponse>(`/v1/inhouse/orders/${orderId}/payment-requests/${requestId}?serviceId=${serviceId}`);
}

export function cancelPayment({ paymentId, ...body }: PostPaymentCancelParam): AxiosPromise<PostPaymentCancelResponse> {
  return client.post<PostPaymentCancelResponse>(`/v1/inhouse/payments/${paymentId}:cancel`, body);
}

export function getPaymentCancelResult({
  requestId,
  orderId,
  serviceId,
}: GetPaymentCancelResultParam): AxiosPromise<GetPaymentCancelResponse> {
  return client.get<GetPaymentCancelResponse>(`/v1/inhouse/orders/${orderId}/cancel-requests/${requestId}?serviceId=${serviceId}`);
}
