import { orderClient } from 'api/client';
import { AxiosPromise } from 'axios';
import {
  GetOrderSheetResponse,
  GetProductParam,
  GetProductResponse,
  PostCreateOrderSheetParam,
  PostCreateOrderSheetResponse,
  PostRequestPaymentFailParam,
  PostRequestPaymentFailResponse,
  PostRequestPaymentParam,
  PostRequestPaymentResponse,
  PostPaymentApprovalParam,
  PaymentApprovalResponse,
  GetOrderDetailParam,
  GetOrderDetailResponse,
  PostCancelOrderParam,
  PostCancelOrderResponse,
  GetOrderListParam, GetOrderListResponse,
} from '../types/api';

export function getProduct({
  productId,
}: GetProductParam): AxiosPromise<GetProductResponse> {
  return orderClient.get<GetProductResponse>(`/products/${productId}`);
}

export function createOrderSheet(param: PostCreateOrderSheetParam): AxiosPromise<PostCreateOrderSheetResponse> {
  return orderClient.post<PostCreateOrderSheetResponse>('/orders/sheets', param);
}

export function getOrderSheet(orderId: string): AxiosPromise<GetOrderSheetResponse> {
  return orderClient.get<GetOrderSheetResponse>(`/orders/${orderId}/sheets`);
}

export function requestPayment(
  param : PostRequestPaymentParam
): AxiosPromise<PostRequestPaymentResponse> {
  return orderClient.post<PostRequestPaymentResponse>(
    `/orders/${param.orderId}/payments:request`,
    param
  );
}

export function requestPaymentFail(
  param : PostRequestPaymentFailParam
): AxiosPromise<PostRequestPaymentFailResponse> {
  return orderClient.post<PostRequestPaymentFailResponse>(
    `/orders/${param.orderId}/payment-processes/${param.paymentId}:fail`,
    param
  );
}

export function approvePayment(
  param : PostPaymentApprovalParam
): AxiosPromise<PaymentApprovalResponse> {
  return orderClient.post<PaymentApprovalResponse>(
    `/orders/${param.orderId}`,
    param
  );
}

export function getOrderList({
  filter, page, size,
} : GetOrderListParam): AxiosPromise<GetOrderListResponse> {
  return orderClient.get<GetOrderListResponse>(
    '/orders',
    {
      params: {
        filter: filter,
        page: page,
        size: size,
      },
    }
  );
}

export function getOrderDetail(
  param : GetOrderDetailParam
): AxiosPromise<GetOrderDetailResponse> {
  return orderClient.get<GetOrderDetailResponse>(`/orders/${param.orderId}`);
}

export function cancelOrder(
  param: PostCancelOrderParam
): AxiosPromise<PostCancelOrderResponse> {
  const url = param.orderProductOptionId ?
    `/orders/${param.orderId}/${param.orderProductOptionId}/cancel`
    : `/orders/${param.orderId}/cancel`;
  console.log(url);
  return orderClient.post<PostCancelOrderResponse>(url, param);
}
