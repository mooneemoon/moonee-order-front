import { PostRequestPaymentParam } from '@ohouse-payment/type';

export type PaymentForm = Pick<
PostRequestPaymentParam,
| 'userId'
| 'requestId'
| 'orderId'
| 'userChannelType'
| 'paymentMethodType'
| 'paymentPgId'
| 'cardCode'
| 'installmentMonth'
> & {
  expiredAfter: number | null
};
