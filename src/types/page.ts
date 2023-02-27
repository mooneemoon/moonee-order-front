import { PaymentMethodType, PGProviderType } from './api';

export interface PaymentPageRouteParam {
  paymentId: string;
  pgProviderType: PGProviderType;
}

export interface PaymentReadyPageRouteParam extends PaymentPageRouteParam {
  paymentToken: string;
  paymentMethodType: PaymentMethodType;
}

export interface PaymentPayPageRouteParams extends PaymentPageRouteParam {
  paymentToken: string;
}

