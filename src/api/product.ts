import { productClient } from 'api/client';
import { AxiosPromise } from 'axios';
import {
  GetProductParam,
  GetProductResponse, PostCreateOrderSheetParam,
  PostCreateOrderSheetResponse,
} from '../types/api';

export function getProduct({
  productId,
}: GetProductParam): AxiosPromise<GetProductResponse> {
  return productClient.get<GetProductResponse>(`/products/${productId}`);
}

export function createOrderSheet(param: PostCreateOrderSheetParam): AxiosPromise<PostCreateOrderSheetResponse> {
  return productClient.post<PostCreateOrderSheetResponse>('/orders/sheets', param);
}
