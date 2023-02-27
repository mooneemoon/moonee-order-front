export type PGProviderType =
  | 'TOSSPAYMENTS'
  | 'KCP'
  | 'IAMPORT'
  | 'NAVER'
  | 'PAYCO'
  | 'KAKAO'
  | 'TOSS'
  | 'TEST_PG';

export type PaymentMethodType =
 | 'CARD'
 | 'VIRTUAL_ACCOUNT'
 | 'PHONE'
 | 'NAVER_PAY'
 | 'KAKAO_PAY';

export type PGMethodCode = 'TOSSPAYMENTS_V1';

export type PGRequestType = 'URL' | 'SDK';

export type IncomeTaxDeductionType = 'CULTURE' | 'BASIC';

export type CurrencyType = 'KRW';

export type FailType = 'USER_CANCEL' | 'ERROR';

export type ItemType = 'PRODUCT' | 'ETC_FEE' | 'DELIVERY_FEE';

export type TaxType = 'TAX' | 'TAX_FREE';

export type PaymentProcessState = 'REQUEST' | 'READY' | 'APPROVAL' | 'APPROVAL_ERROR';

export type CancelProcessState = 'REQUEST' | 'IN_PROGRESS' | 'COMPLETE' | 'ERROR' | 'READY_REPROCESSING';

export type ServiceId = 'DEMO';

export type CardKindType = 'CHECK' | 'CREDIT' | 'GIFT';

export type CardOwnerType = 'PERSON' | 'CORPORATION';

export type UserChannelType =
  | 'OHOUSE_USER' // 오늘의집 사용자
  | 'OHOUSE_GUEST' // 오늘의집 비회원
  | 'SHOP_USER'; // 판매자

export type RiskCategoryType = 'NORMAL';

export type InterestFreeFeeBearer = 'CARD_COMPANY';

export interface ErrorResponse {
  code: string;
  message: string;
  detailMessage: string;
}

export interface VirtualAccount {
  virtualAccountNumber: string;
  bankCode: string;
  bankName: string;
  accountHolder: string;
  expiryAt: string;
}

export interface PaymentPG {
  pgProviderType: PGProviderType;
  pgMethodCode: string;
  pgVersion: string;
  pgRequestType: PGRequestType;
  pgServiceKey: string;
  pgPublicKey: string;
}

export interface PaymentCard {
  pgCardCode: string;
  cardCode: string;
  installmentMonth: number;
}

export interface ApprovedPaymentCard extends PaymentCard {
  cardName: string;
  cardNumber: string;
  cardApprovalNumber: string;
  cardKindType: CardKindType;
  cardOwnerType: CardOwnerType;
  interestFreeFeeBearer: InterestFreeFeeBearer;
  interestFree: boolean;
}

export interface GetPaymentReadyResponse {
  paymentId: string;
  paymentMethodType: PaymentMethodType;
  orderTitle: string;
  paymentAmount: number;
  payerName: string;
  payerEmail: string;
  payerPhoneNo: string;
  taxFreeAmount: number;
  currencyType: CurrencyType;
  incomeTaxDeductionType: IncomeTaxDeductionType;
  expiryAt: string;
  paymentPg: PaymentPG;
  paymentCard: PaymentCard;
  paymentAuthUrl: string | null;
}

export interface PatchPaymentSuccessParam {
  paymentId: string;
  pgPaymentId?: string;
  pgOrderId?: string;
  pgPaymentAmount?: number;
  pgToken?: string;
  pgExtraData?: Record<string, any>;
}

export interface PatchPaymentSuccessResponse {
  redirectUrl?: string;
  paymentId: string;
  orderId: string;
  requestId: string;
  paymentMethodType: PaymentMethodType;
  authenticationToken: string;
}

export interface PatchPaymentFailParam {
  failType: FailType;
  paymentId: string;
  pgErrorMessage?: string;
  pgOrderId?: string;
}

export interface PatchPaymentFailResponse {
  redirectUrl?: string;
  paymentId: string;
  orderId: string;
  failType: FailType;
  failCode: string;
  failMessage: string;
}

export interface PaymentItem {
  itemType: ItemType;
  itemName: string;
  itemAmount: number;
  itemReferenceId: string;
  itemProductId: string;
  itemOptionId: string;
  sellingCompanyId: number;
  taxType: TaxType;
}

export interface PostRequestPaymentBody {
  serviceId: ServiceId;
  apiKey: string;
  orderTitle: string;
  userChannelType: UserChannelType;
  userId: string;
  orderAmount: number;
  paymentAmount: number;
  pointAmount: number;
  couponAmount: number;
  promotionAmount: number;
  paymentMethodType: PaymentMethodType;
  paymentPgId: string;
  cardCode?: string;
  installmentMonth?: number;
  successRedirectUrl?: string;
  failRedirectUrl?: string;
  items: PaymentItem[];
  couponIds: string[];
  promotionIds: string[];
  payerName: string;
  payerEmail: string;
  payerPhoneNo: string;
  clientIp: string;
  userAgent: string;
  expiryAt: string | null;
  requestAt: string;
  riskCategoryType: RiskCategoryType;
  incomeTaxDeductionType: IncomeTaxDeductionType;
}

export interface PostRequestPaymentParam extends PostRequestPaymentBody {
  orderId: string;
  requestId: string;
}

export interface PostRequestPaymentProcessResponse {
  paymentId: string;
  paymentProcessState: PaymentProcessState;
  paymentAuthUrl: string | null; // paymentProcessState = REQUEST인 경우만 전달
}

export interface GetPaymentMethodParam {
  serviceId: ServiceId;
  itemProductIds: string[];
}

export interface PaymentMethodCard {
  cardName: string;
  cardCode: string;
  interestFreeMonths: number[];
}

export interface PaymentMethod {
  paymentMethodType: PaymentMethodType;
  paymentMethodName: string;
  pgId: string;
  minimumAmount: string;
  maxAmount: string;
  benefits: string[];
  notices: string[];
  cards: PaymentMethodCard[];
  available: boolean;
  cashReceiptIssuable: boolean;
}

export interface GetPaymentMethodResponse {
  paymentMethods: PaymentMethod[];
}

export interface GetPaymentApprovalResultParam {
  orderId: string;
  requestId: string;
  serviceId: ServiceId;
}

export interface GetPaymentCancelResultParam {
  orderId: string;
  requestId: string;
  serviceId: ServiceId;
}

export interface PostPaymentApprovalParam {
  paymentId: string;
  orderId: string;
  serviceId: ServiceId;
  authenticationToken: string;
}

export type PostVirtualAccountIssuance = PostPaymentApprovalParam;

export interface PaymentApprovalResponse {
  paymentId: string;
  orderId: string;
  paymentMethodType: PaymentMethodType;
  transactionId: string;
  transactionAt: string;
  requestId: string;
  orderAmount: number;
  paymentAmount: number;
  pointAmount: number;
  couponAmount: number;
  promotionAmount: number;
  userChannelType: UserChannelType;
  userId: string;
  orderTitle: string;
  payerName: string;
  payerEmail: string;
  payerPhoneNo: string;
  incomeTaxDeductionType: IncomeTaxDeductionType;
  riskCategoryType: RiskCategoryType;
  paymentCard: ApprovedPaymentCard;
  items: PaymentItem[];
}

export interface IssueVirtualAccountResponse {
  virtualAccount: VirtualAccount;
  paymentId: string;
  orderId: string;
  requestId: string;
  orderAmount: number;
  paymentAmount: number;
  pointAmount: number;
  couponAmount: number;
  promotionAmount: number;
}

export interface PaymentApprovalResultCommon {
  orderId: string;
  paymentId: string;
  paymentProcessState: string;
}

export interface PaymentApprovalErrorResult extends PaymentApprovalResultCommon {
  errorResponse?: ErrorResponse;
}

export interface PaymentApprovalResult extends PaymentApprovalResultCommon {
  approvalResponse?: PaymentApprovalResponse;
}

export interface PaymentIssueVirtualAccountResult extends PaymentApprovalResultCommon {
  virtualAccount?: VirtualAccount;
}

export type GetPaymentApprovalResultResponse =
  | PaymentApprovalResult
  | PaymentIssueVirtualAccountResult
  | PaymentApprovalErrorResult;

export interface CancelPaymentRequestItem {
  itemType: ItemType;
  itemAmount: number;
  itemReferenceId: string;
}

export interface PaymentCancel {
  paymentId: string;
  serviceId: ServiceId;
  orderId: string;
  requestId: string;
  cancelAmount: number;
  cancelReason: string;
  // 취소하려는 아이템 목록 (주문 상품, 배송비 등)
  cancelItems: CancelPaymentRequestItem[];
  // 취소로 인해 추가적으로 발생한 결제 아이템 목록 (추가 배송비 등)
  additionalPaymentItems: PaymentItem[];
}

export interface PostPaymentCancelParam extends PaymentCancel {
  clientIp: string;
}

export interface PostPaymentCancelResponse extends Omit<PaymentCancel, 'cancelReason'> {
  transactionId: string;
  transactionAt: string;
  paymentAmount: number;
  pointAmount: number;
  couponAmount: number;
  promotionAmount: number;
}

export interface GetPaymentCancelResponse {
  orderId: string;
  paymentId: string;
  cancelProcessStatus: CancelProcessState;
  cancelPaymentResponse: PostPaymentCancelResponse;
  errorResponse: ErrorResponse;
}
