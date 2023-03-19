import {
  PaymentMethodType, PaymentProcessState,
} from './api';
import { PaymentFailType } from '@bucketplace/payment-bridge-core';

export interface GetProductParam {
  productId: number;
}

export interface GetProductResponse {
  data : ProductResponse;
}

export interface ProductResponse {
  productId: number;
  productName: string;
  brandName: string;
  cost: number;
  deliveryFee: number;
  thumbnailUrl: string;
  optionList: ProductOptionListResponse;
}

export interface ProductOptionListResponse {
  optionTitle: string;
  options: ProductOptionResponse[];
}

export interface ProductOptionResponse {
  optionId: number;
  optionName: string;
  stock: number;
  cost:number;
}

export interface PostCreateOrderSheetParam {
  productId: number;
  productOptions: PostCreatedOrderSheetSelectedOptionParam[];
}

export interface PostCreatedOrderSheetSelectedOptionParam {
  optionId: number;
  count: number;
}

export interface PostCreateOrderSheetResponse {
  result: string;
  data : PostCreateOrderSheetResultResponse;
}

export interface PostCreateOrderSheetResultResponse {
  orderId : number;
}

export interface GetOrderSheetResponse {
  data: GetOrderSheetResultResponse;
}

export interface GetOrderSheetResultResponse {
  orderId: number;
  orderAmount: number;
  deliveryFee: number;
  productList: GetOrderSheetProductResultResponse[];
  user: GetOrderSheetUserResultResponse;
  delivery: GetOrderSheetDeliveryResultResponse;
  paymentMethods: GetOrderSheetPaymentMethodResultResponse[];
}

export interface GetOrderSheetProductResultResponse {
  productName: string;
  brandName: string;
  deliveryFee: number;
  thumbnailUrl: string;
  optionList: GetOrderSheetProductOptionResultResponse[];
}

export interface GetOrderSheetProductOptionResultResponse {
  optionName: string;
  totalCost: number;
  count: number;
}

export interface GetOrderSheetUserResultResponse {
  userName: number;
  phone: string;
  email: string;
}

export interface GetOrderSheetDeliveryResultResponse {
  recipientName: string;
  recipientPhone: string;
  address: string;
  extraAddress: string;
  postCode: string;
  deliveryRequest: string;
}

export interface GetOrderSheetPaymentMethodResultResponse {
  paymentMethodType: string;
  paymentMethodName: string;
  pgId: string;
  isCashReceiptIssuable: boolean;
  minAmount: number;
  maxAmount:number;
  cards: GetOrderSheetPaymentMethodCardResultResponse[];
}

export interface GetOrderSheetPaymentMethodCardResultResponse {
  cardName: string;
  cardCode: string;
  installmentMinAmount: number;
  interestFreeMonths: number[];
}

export interface PostRequestPaymentParam {
  orderId: string;
  paymentMethodType: PaymentMethodType;
  paymentPgId: string;
  cardCode?: string;
  installmentMonth?: number;
  orderAmount: number;
  paymentAmount: number;
  promotionAmount: number;
  pointAmount: number;
  couponAmount: number; // payment
  userName: string;
  phone: string;
  email: string; // user
  recipientName: string;
  recipientPhone: string;
  address: string;
  extraAddress: string;
  postCode: string;
  deliveryRequest?: string;
  successRedirectUrl?: string;
  failRedirectUrl?: string;
  // items: PaymentItem[];
  // couponIds: string[];
  // promotionIds: string[];
}

export interface PostRequestPaymentResponse {
  data: PostRequestPaymentDataResponse;
}

export interface PostRequestPaymentDataResponse {
  paymentId: string;
  paymentProcessState: PaymentProcessState;
  paymentAuthUrl: string | null; // paymentProcessState = REQUEST인 경우만 전달
  orderRequestId: number;
}

export interface PostRequestPaymentFailParam {
  orderId: number;
  paymentId: string;
  paymentFailType: PaymentFailType;
}

export interface PostRequestPaymentFailResponse {
  result: string;
  error: string | null;
}
