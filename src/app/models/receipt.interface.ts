export interface Item {
  name: string;
  price: number;
  quantity: number;
  total: number;
}

export interface Receipt {
  uuid?: string; // Added for unique identification
  date?: string;
  seller: {
    name: string;
    taxNumber: string;
    total: number;
  };
  items: Item[]; // Changed to be an array of Item objects
}
