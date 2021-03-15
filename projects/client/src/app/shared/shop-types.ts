


export interface Timestamp {
  nanoseconds: number;
  seconds: number;
}

////////////////// Customer Types //////////////////


export interface Customer {
  customerId: string;
  stripeCustomerId?: string;
  emailAddress: string;
  billingAddress?: Address;
  shippingAddress?: Address;
  differentShippingAddress?: boolean;
  anonymousUser: boolean;
  source?: Source;
  createdAt: Timestamp;
  openOrder?: OpenOrder;
}

export interface OpenOrder {
  orderId: string;
  createdAt: any;
  orderState: 'open' | 'processing' | 'complete';
}

////////////////// Order Types //////////////////


export interface Order {
  orderType: 'online' | 'store';
  orderId?: string;
  customerId?: string;
  createdAt: Timestamp;
  orderState: 'open' | 'processing' | 'complete' | 'refund' | 'error';
  orderedItems: CartItem[];
  refunds: Refund[];
  totalPrice: number;
  discount?: number;
  storeOrder?: StoreOrder;
  onlineOrder?: OnlineOrder;
}


export interface StoreOrder {
  paidAt?: any;
  paymentMethod?: string;
}


export interface OnlineOrder {
  itemsReserved: boolean;
  orderPaid: boolean;
  orderShipped: boolean;
  orderConfirmationSent: boolean;
  shippingConfirmationSent: boolean;
  trackingCode: string;
  returnTrackingCode: string;
  billingAddress: Address;
  shippingAddress: Address;
  paymentIntent: PaymentIntent;
}


export interface Refund {
  refundedItems: CartItem[];
  createdAt: Timestamp;
  paymentRefunded?: boolean;
  refundData?: RefundData;
}


export interface Address {
  name: string;
  lastName: string;
  street: string;
  streetNumber: number | null;
  zip: number | null;
  city: string;
}



////////////////// Product Types //////////////////

export interface Image {
  w300: string;
  w450: string;
  w600: string;
  w750: string;
  w900: string;
  w1200: string;
  w1500: string;
}

export interface InventoryItem {
  productName: string;
  productId: string;
  itemId: string;
  variant: string;
  subVariant: string;
  amount: number;
  price: number;
  image: Image;
}

export interface Product {
  productName: string;
  productId: string;
  shortDescription: string;
  description: string;
  price: number;
  images: Image[];
}





////////////////// Cart Types //////////////////


export interface CartItem extends InventoryItem {
  amountInCart: number;
}


export interface Cart {
  priceTotal: number;
  amountTotal: number;
  cartItems: CartItem[];
}




////////////////// Stripe Payment Types //////////////////

export interface Charge {
  id: string;
  amount: number;
  amount_refunded: number;
  refunds: {
    data: RefundData[]
  }
}

export interface Source {
  client_secret: string;
  created: number;
  currency: string;
  id: string;
  owner: {
    address: string | null;
    email: string | null;
    name: string | null;
    phone: string | null;
    verified_address: string | null;
    verified_email: string | null;
    verified_name: string | null;
    verified_phone: string | null;
  };
  sepa_debit?: {
    bank_code: string | null;
    country: string | null;
    fingerprint: string;
    last4: string;
    mandate_reference: string;
  };
  card?: Card;
  status?: string;
  redirect?: {
    status: string;
    url: string;
  };
  three_d_secure?: {
    authenticated: boolean;
  };
}


export interface SourceResponse {
  source?: Source;
  error?: Error;
}


export interface Error {
  type: string;
  charge: string;
  message?: string;
  code?: string;
  decline_code?: string;
  param?: string;
}


type brandType = 'Visa' | 'American Express' | 'MasterCard' | 'Discover' | 'JCB' | 'Diners Club' | 'Unknown';
type checkType = 'pass' | 'fail' | 'unavailable' | 'unchecked';
type fundingType = 'credit' | 'debit' | 'prepaid' | 'unknown';
type tokenizationType = 'apple_pay' | 'android_pay';

export interface Card {
  id: string;
  object: string;
  address_city?: string;
  address_country?: string;
  address_line1?: string;
  address_line1_check?: checkType;
  address_line2?: string;
  address_state?: string;
  address_zip?: string;
  address_zip_check?: checkType;
  brand: brandType;
  country: string;
  currency?: string;
  cvc_check?: checkType;
  dynamic_last4: string;
  exp_month: number;
  exp_year: number;
  fingerprint: string;
  funding: fundingType;
  last4: string;
  metadata: any;
  name?: string;
  tokenization_method?: tokenizationType;
  three_d_secure?: 'required' | 'recommended' | 'optional' | 'not_supported';
}



export interface PaymentIntent {
  id: string;
  amount: number;
  amount_capturable: number;
  amount_received: number;
  canceled_at: number;
  cancelation_reason: string;
  capture_method: 'automatic' | 'manual';
  client_secret: string;
  confirmation_method: 'secret' | 'publishable';
  created: number;
  charges: {data: Charge[]};
  currency: string;
  customer: string;
  description?: string;
  next_action: string;
  receipt_email: string;
  source: string;
  status:
    | 'requires_payment_method'
    | 'requires_action'
    | 'processing'
    | 'requires_authorization'
    | 'requires_capture'
    | 'canceled'
    | 'succeeded';
}


export interface RefundData {
  id: string;
  object: string;
  amount: number;
  balance_transaction: string;
  charge: string;
  created: number;
  currency: string;
  metadata?: any;
  reason?: string;
  receipt_number?: string;
  source_transfer_reversal?: string;
  status: string;
  transfer_reversal?: string;
}

export interface HandleCardAction {
  paymentIntent: PaymentIntent;
  error: Error;
}





