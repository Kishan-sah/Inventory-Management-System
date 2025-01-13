export interface Products {
  id: number;
  productId: string;
  date: string;
  name: string;
  quantity: number;
  subCategory: string;
  mrp: number;
  threshold: number;
  category: string;
  discount:number;
}

export interface item {
  list: Products[];
  errormessage: string;
}
