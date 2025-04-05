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
