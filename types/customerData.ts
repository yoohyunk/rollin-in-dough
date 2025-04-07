export interface Address {
  address_line_1?: string;
  locality?: string;
  administrative_district_level_1?: string;
  postal_code?: string;
}
export interface CustomerData {
  given_name: string;
  family_name: string;
  email_address: string;
  phone_number: string;
  address: Address;
}

export interface UpdateCustomerRequestBody {
  customer_id: string;
  given_name?: string;
  family_name?: string;
  email_address?: string;
  phone_number?: string;
  address?: Address;
}

export interface CatalogItem {
  id: string;
  type: string;
  imageData?: { url: string };
  created_at?: string;
  itemData?: {
    name: string;
    description: string;
    imageIds: string[];
    variations: {
      id: string;
      itemVariationData?: {
        priceMoney?: {
          amount: number;
          currency: string;
        };
      };
    }[];
  };
}

export interface CartItem {
  product: {
    id: string;
    variationId: string;
  };
  quantity: number;
}

export interface DisplayCartItem {
  product: {
    id: string;
    variationId: string;
    name: string;
    price: number;
    imageUrl: string;
    description: string;
  };
  quantity: number;
}

export interface Order {
  orderId: string;
  createdAt: string;
  orderStatus: string;
  lineItems: LineItems[];
  totalPrice: { amount: number; currency: string };
  totalTax: { amount: number; currency: string };
  serviceCharges: {
    name: string;
    amountMoney: { amount: number; currency: string };
    totalMoney: { amount: number; currency: string };
  }[];
}

export interface LineItems {
  quantity: number;
  catalogObjectId: string;
  basePriceMoney: { amount: string; currency: string };
  name: string;
  imageUrl: string;
}

export interface Cookie {
  name: string;
  quantity: number;
}

export interface PastOrder {
  id: string;
  createdAt: string;
  lineItems: Cookie[];
  orderStatus: string;
  totalPrice: { amount: number; currency: string };
}
