export interface AppConfig {
  config: {
    delivery_fee: { delivery_fee_amount: number; minimum_cart_amount: number };
    promotion: { discount_code: string; discount_amount: number };
  };
}
