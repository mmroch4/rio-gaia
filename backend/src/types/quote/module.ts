/* Entity: Quote */

export type ModuleQuote = {
  id: string;
  status: string;
  draft_order_id: string;
  order_change_id: string;
  cart_id: string;
  customer_id: string;
  custom_details?: string | null;
  shipping_cost?: number | null;
  created_at: string;
  updated_at: string;
};

export type ModuleCreateQuote = {
  draft_order_id: string;
  order_change_id: string;
  cart_id: string;
  customer_id: string;
  custom_details?: string;
};

export type ModuleUpdateQuote = {
  id: string;
  status?: string;
  shipping_cost?: number | null;
};

/* Entity: Message */

export type ModuleCreateQuoteMessage = {
  text: string;
  quote_id: string;
  admin_id?: string;
  customer_id?: string;
  item_id?: string | null;
};

export type ModuleQuoteMessage = {
  id: string;
  text: string;
  quote_id: string;
  admin_id: string;
  customer_id: string;
  item_id: string;
};
