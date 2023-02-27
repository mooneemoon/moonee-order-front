export interface TossSuccessUrlQuery {
  orderId: string;
  paymentKey: string;
  amount: number;
}

export interface TossFailUrlQuery {
  code: string;
  message?: string;
  orderId: string;
}

