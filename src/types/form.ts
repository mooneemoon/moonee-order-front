import { PostCancelOrderParam, PostCreateOrderSheetParam, PostRequestPaymentParam } from 'types/api';

export type PaymentForm = Pick<
PostRequestPaymentParam,
| 'orderId'
| 'paymentMethod'
| 'paymentPgId'
| 'cardCode'
| 'installmentMonth'
>;

export type ProductForm = Pick<
PostCreateOrderSheetParam,
| 'productId'
| 'productOptionList'
>;

export type CancelOrderForm = Pick<
PostCancelOrderParam,
|'orderId'
|'orderProductOptionId'
| 'reason'
>;
