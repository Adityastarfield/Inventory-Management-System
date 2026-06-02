const baseUrl = import.meta.env.VITE_API_BASE_URL || "http://localhost:8000";

async function request(path, options = {}) {
  const res = await fetch(`${baseUrl}${path}`, {
    headers: {
      "Content-Type": "application/json",
      ...(options.headers || {})
    },
    ...options
  });

  if (!res.ok) {
    let message = "Request failed";
    try {
      const data = await res.json();
      // common fields used by FastAPI and other APIs
      if (data?.detail) message = data.detail;
      else if (data?.message) message = data.message;
      else if (data?.error) message = data.error;
      else if (typeof data === "string") message = data;
      // handle Pydantic validation detail arrays
      else if (Array.isArray(data) && data.length > 0) {
        const first = data[0];
        if (first?.msg) message = first.msg;
        else message = JSON.stringify(first);
      }
    } catch (error) {
      message = res.statusText || message;
    }
    throw new Error(message);
  }

  if (res.status === 204) {
    return null;
  }

  return res.json();
}

export const api = {
  getProducts: () => request("/products"),
  createProduct: (payload) =>
    request("/products/", {
      method: "POST",
      body: JSON.stringify(payload)
    }),
  updateProduct: (id, payload) =>
    request(`/products/${id}`, {
      method: "PUT",
      body: JSON.stringify(payload)
    }),
  deleteProduct: (id) =>
    request(`/products/${id}`, { method: "DELETE" }),
  getCustomers: () => request("/customers"),
  createCustomer: (payload) =>
    request("/customers/", {
      method: "POST",
      body: JSON.stringify(payload)
    }),
  deleteCustomer: (id) =>
    request(`/customers/${id}`, { method: "DELETE" }),
  getOrders: () => request("/orders"),
  getOrder: (id) => request(`/orders/${id}`),
  createOrder: (payload) =>
    request("/orders/", {
      method: "POST",
      body: JSON.stringify(payload)
    }),
  deleteOrder: (id) =>
    request(`/orders/${id}`, { method: "DELETE" })
};
