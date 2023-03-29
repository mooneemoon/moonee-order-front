import { PaymentFailType } from '@bucketplace/payment-bridge-core';

export type PaymentMethodType =
    | 'CARD'
    | 'VIRTUAL_ACCOUNT'
    | 'PHONE'
    | 'NAVER_PAY'
    | 'KAKAO_PAY';

export type PaymentProcessState = 'REQUEST' | 'READY' | 'APPROVAL' | 'APPROVAL_ERROR';

export interface ErrorResponse {
  code: string;
  message: string;
  detailMessage: string;
  error: ErrorData;
}

export interface ErrorData {
  code: string;
  message: string;
  data:string;
}

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
  productOptionList: PostCreatedOrderSheetSelectedOptionParam[];
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
  productCost: number;
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
  paymentMethod: string;
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
  paymentMethod: PaymentMethodType;
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
  requestId: number;
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

export interface PostPaymentApprovalParam {
  paymentId: string;
  orderId: string;
  requestId: string;
  authenticationToken: string;
}

export interface PaymentApprovalResponse {
  result: string;
  error: string | null;
}

export interface GetOrderListParam {
  filter: string | null;
  page: number | null;
  size: number | null;
}

export interface GetOrderListResponse {
  data: GetOrderListOrderResponse[];
  result: string;
  error: string | null;
}

export interface GetOrderListOrderResponse {
  orderId: number;
  userId: number;
  productCost: number;
  deliveryCost: number;
  paymentCost: number;
  point: number;
  promotionCost: number;
  paymentId: string;
  userName: string;
  userPhone: string;
  userEmail: string;
  deliveryAddress: string;
  deliveryExtraAddress: string;
  deliveryPostCode: string;
  deliveryRequest: string | null;
  state: string;
  orderProductList: GetOrderListOrderProductResponse[];
  orderedAt: string;
}

export interface GetOrderListOrderProductResponse {
  orderProductId: number;
  productId: number;
  productName: string;
  deliveryCost: number;
  orderProductOptionList: GetOrderListOrderProductOptionResponse[];
}

export interface GetOrderListOrderProductOptionResponse {
  orderProductOptionId: number;
  optionId: number;
  optionName: string;
  count: number;
  cost: number;
  state:string;
}

export interface GetOrderDetailParam {
  orderId: number;
}

export interface GetOrderDetailResponse {
  result: string;
  error: string | null;
  data: GetOrderResponse;
}

export interface GetOrderResponse {
  orderId: number;
  userId: number;
  userName: string;
  userPhone: string;
  userEmail: string;
  deliveryAddress: string;
  deliveryExtraAddress: string;
  postCode: string;
  recipientName: string;
  recipientPhone: string;
  deliveryRequest: string | null;
  paymentMethod:string;
  paymentCost: number;
  point: number;
  promotionCost: number;
  cardCode: string | null;
  installmentMonth: number | null;
  approvalAt: Date;
  orderProductList: GetOrderProductResponse[];
  state: string;
  orderedAt: Date;
}

export interface GetOrderProductResponse {
  orderProductId: number;
  productId: number;
  productName: string;
  deliveryCost: number;
  orderProductOptionList: GetOrderProductOptionResponse[];
}

export interface GetOrderProductOptionResponse {
  orderProductOptionId: number;
  optionId: number;
  optionName: string;
  count: number;
  cost: number;
  totalCost: number;
  state: string;
}

export interface PostCancelOrderParam {
  orderId: number;
  orderProductOptionId: number | null;
  reason: string;
}

export interface PostCancelOrderResponse {
  result: string;
  error: string | null;
}
