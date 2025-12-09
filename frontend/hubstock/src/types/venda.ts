import { ref } from "vue";

interface MesaItem {
    id: number;
    name: string;
    price: number;
    productId: number;
    quantity: number;
}
interface Mesa {
    id: number;
    items: MesaItem[];
}

const mesas = ref<Mesa[]>([
    { id: 1, items: [] },
    { id: 2, items: [] },
    { id: 3, items: [] },
    { id: 4, items: [{ id: 1001, name: 'Cerveja Pilsen', price: 6.00, productId: 1001, quantity: 2 }] },
    { id: 5, items: [] },
]);

export { type Mesa, type MesaItem, mesas };