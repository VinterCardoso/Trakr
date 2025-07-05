


export type PaymentMethodCreateInput = {
  paymentMethodName: string;
  paymentMethodType: string;
};  

export type PaymentMethodUpdateInput = {
  paymentMethodName?: string;
  paymentMethodType?: string;
};