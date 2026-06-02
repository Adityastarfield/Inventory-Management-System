import { create } from "zustand";
import { api } from "./api";

export const useInventoryStore = create((set, get) => ({
  products: [],
  customers: [],
  orders: [],
  isLoading: false,
  error: null,
  async loadAll() {
    set({ isLoading: true, error: null });
    try {
      const [products, customers, orders] = await Promise.all([
        api.getProducts(),
        api.getCustomers(),
        api.getOrders()
      ]);
      set({ products, customers, orders, isLoading: false });
    } catch (error) {
      set({
        isLoading: false,
        error: error?.message || "Unable to load data"
      });
      throw error;
    }
  },
  async createProduct(payload) {
    await api.createProduct(payload);
    await get().loadAll();
  },
  async updateProduct(id, payload) {
    await api.updateProduct(id, payload);
    await get().loadAll();
  },
  async deleteProduct(id) {
    await api.deleteProduct(id);
    await get().loadAll();
  },
  async createCustomer(payload) {
    await api.createCustomer(payload);
    await get().loadAll();
  },
  async deleteCustomer(id) {
    await api.deleteCustomer(id);
    await get().loadAll();
  },
  async createOrder(payload) {
    const result = await api.createOrder(payload);
    await get().loadAll();
    return result;
  },
  async deleteOrder(id) {
    await api.deleteOrder(id);
    await get().loadAll();
  }
}));
