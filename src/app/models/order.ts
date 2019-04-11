import { Product } from '../models/product'
/** An Order Interface which contains the Product Interface (stored in the product array (product?: Product[];)).
 * This interface can be called in other files */
export interface Order {
    id?: any;
    status?: string;
    orderId?: any;
    day?: string;
    dateCreated?: any;
    product?: Product[];
}