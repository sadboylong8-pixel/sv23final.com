export interface ProductInterface {
    id: string;
    name: string;
    barcode: string;
    category_id: string;
    image_url: string;
    sell_price: number;
    status: boolean;
    ingredients: [];
}