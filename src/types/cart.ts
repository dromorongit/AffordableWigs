// Cart type definitions

export interface CartItemProduct {
  _id: string;
  name: string;
  slug: string;
  price: number;
  mainImage: string;
  shortDescription?: string;
  category?: {
    name: string;
    slug: string;
  };
  stockQuantity?: number;
}

export interface CartItem {
  product: CartItemProduct;
  quantity: number;
  stylingType: string;
  stylingName: string;
  stylingPrice: number;
}

export interface CartState {
  items: CartItem[];
  subtotal: number;
  stylingTotal: number;
  total: number;
}

export interface CustomerInfo {
  fullName: string;
  phone: string;
  email: string;
  deliveryAddress: string;
  cityOrTown: string;
  regionOrArea: string;
  orderNotes?: string;
}

export interface OrderData {
  customer: CustomerInfo;
  items: CartItem[];
  subtotal: number;
  stylingTotal: number;
  total: number;
  currency: string;
}