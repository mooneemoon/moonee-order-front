import { orderClient } from 'api/client';
import { AxiosPromise } from 'axios';
import {
  GetOrderSheetResponse,
  GetProductParam,
  GetProductResponse, PostCreateOrderSheetParam,
  PostCreateOrderSheetResponse,
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
