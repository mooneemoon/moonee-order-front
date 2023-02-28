import { productClient } from 'api/client';
import { AxiosPromise } from 'axios';
import { GetProductParam, GetProductResponse } from '../types/api';

export function getProduct({
  productId,
}: GetProductParam): AxiosPromise<GetProductResponse> {
  return productClient.get<GetProductResponse>(`/products/${productId}`);
}
