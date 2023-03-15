import { PostCreateOrderSheetParam, PostRequestPaymentParam } from 'types/api2';

export type PaymentForm = Pick<
PostRequestPaymentParam,
| 'orderId'
| 'paymentMethodType'
| 'paymentPgId'
| 'cardCode'
| 'installmentMonth'
>;

export type ProductForm = Pick<
PostCreateOrderSheetParam,
| 'productId'
| 'productOptions'
>;
