import { Product } from '../models/product'

export interface Order {
    id?: any;
    status?: string;
    orderId?: any;
    day?: string;
    dateCreated?: any;
    product?: Product[];
}