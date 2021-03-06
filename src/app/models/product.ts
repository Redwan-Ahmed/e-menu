/** A Product Interface which can be called in other files */
export interface Product {
    status?: string;
    orderId?: any;
    key?: string;
    title?: string;
    price?: number;
    category?: string;
    imageUrl?: string;
    id?: any;
    quantity?: number;
    prepTime?: number;
}