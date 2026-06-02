import { useEffect, useMemo, useState } from "react";
import { useFieldArray, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { api } from "./api";
import { useInventoryStore } from "./store";
import { toast } from "react-toastify";
import Dashboard from "./sections/Dashboard";
import ProductsSection from "./sections/Products";
import CustomersSection from "./sections/Customers";
import OrdersSection from "./sections/Orders";

const tabs = ["Dashboard", "Products", "Customers", "Orders"];

const productSchema = z.object({
  name: z.string().min(1, "Name is required"),
  sku: z.string().min(1, "SKU is required"),
  price: z.coerce.number().positive("Price must be greater than 0"),
  quantity: z.coerce.number().min(0, "Quantity must be 0 or more")
});

const customerSchema = z.object({
  full_name: z.string().min(1, "Full name is required"),
  email: z.string().email("Enter a valid email"),
  phone: z.string().min(7, "Phone number looks too short")
});

const orderSchema = z.object({
  customer_id: z.coerce.number().min(1, "Customer is required"),
  items: z
    .array(
      z.object({
        product_id: z.coerce.number().min(1, "Product is required"),
        quantity: z.coerce.number().min(1, "Quantity must be at least 1")
      })
    )
    .min(1, "Add at least one item")
});

function currency(value) {
  if (Number.isNaN(Number(value))) {
    return "-";
  }
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD"
  }).format(Number(value));
}

export default function App() {
  const {
    products,
    customers,
    orders,
    isLoading,
    error,
    loadAll,
    createProduct,
    updateProduct,
    deleteProduct,
    createCustomer,
    deleteCustomer,
    createOrder,
    deleteOrder
  } = useInventoryStore();

  const [activeTab, setActiveTab] = useState("Dashboard");
  const [orderDetails, setOrderDetails] = useState(null);
  const [editingProductId, setEditingProductId] = useState(null);
  

  const lowStock = useMemo(
    () => products.filter((product) => product.quantity <= 5),
    [products]
  );

  const productForm = useForm({
    resolver: zodResolver(productSchema),
    defaultValues: { name: "", sku: "", price: "", quantity: "" }
  });

  const customerForm = useForm({
    resolver: zodResolver(customerSchema),
    defaultValues: { full_name: "", email: "", phone: "" }
  });

  const orderForm = useForm({
    resolver: zodResolver(orderSchema),
    defaultValues: {
      customer_id: "",
      items: [{ product_id: "", quantity: 1 }]
    }
  });

  const orderItems = useFieldArray({
    control: orderForm.control,
    name: "items"
  });

  useEffect(() => {
    loadAll().catch((loadError) => {
      toast.error(loadError.message);
    });
  }, [loadAll]);

  useEffect(() => {
    if (error) {
      toast.error(error);
    }
  }, [error]);

  function showMessage(message, type = "success") {
    let text = message;
    if (typeof message === "object") {
      text = message?.message || message?.detail || JSON.stringify(message);
    }
    if (!text) text = String(message);
    if (type === "error") toast.error(text);
    else toast.success(text);
  }

  async function handleProductSubmit(values) {
    try {
      if (editingProductId) {
        await updateProduct(editingProductId, values);
        showMessage("Product updated.");
      } else {
        await createProduct(values);
        showMessage("Product added.");
      }
      productForm.reset();
      setEditingProductId(null);
    } catch (submitError) {
      showMessage(submitError, "error");
    }
  }

  async function handleCustomerSubmit(values) {
    try {
      await createCustomer(values);
      showMessage("Customer added.");
      customerForm.reset();
    } catch (submitError) {
      showMessage(submitError, "error");
    }
  }

  async function handleOrderSubmit(values) {
    try {
      const result = await createOrder(values);
      showMessage(`Order #${result.order_id} created.`);
      orderForm.reset({
        customer_id: "",
        items: [{ product_id: "", quantity: 1 }]
      });
      setOrderDetails(null);
    } catch (submitError) {
      showMessage(submitError, "error");
    }
  }

  async function handleDeleteProduct(id, name, sku) {
    try {
      await deleteProduct(id);
      showMessage(`Deleted product ${name} (${sku}).`);
    } catch (deleteError) {
      showMessage(deleteError, "error");
    }
  }

  async function handleDeleteCustomer(id, fullName) {
    try {
      await deleteCustomer(id);
      showMessage(`Deleted customer ${fullName}.`);
    } catch (deleteError) {
      showMessage(deleteError, "error");
    }
  }

  async function handleDeleteOrder(id, amount) {
    try {
      await deleteOrder(id);
      showMessage(`Deleted order #${id} — ${currency(amount)}`);
      setOrderDetails(null);
    } catch (deleteError) {
      showMessage(deleteError, "error");
    }
  }

  async function handleLoadOrder(id) {
    try {
      const data = await api.getOrder(id);
      setOrderDetails(data);
    } catch (loadError) {
      showMessage(loadError, "error");
    }
  }

  return (
    <div className="app">
      <header className="hero">
        <div className="hero-copy">
          <span className="eyebrow">Inventory OS</span>
          <h1>Run products, customers, and orders with clarity.</h1>
          <p>
            A focused control center for stock, orders, and customer data. Keep
            inventory clean, prevent stockouts, and capture every sale.
          </p>

        </div>
        <div className="hero-panel">
          <div className="stat-card">
            <span>Total orders</span>
            <strong>{orders.length}</strong>
          </div>
          <div className="stat-card">
            <span>Products</span>
            <strong>{products.length}</strong>
          </div>
          <div className="stat-card">
            <span>Customers</span>
            <strong>{customers.length}</strong>
          </div>
        </div>
      </header>

      {/* toasts handled by react-toastify */}

      <nav className="tabs">
        {tabs.map((tab) => (
          <button
            key={tab}
            className={tab === activeTab ? "active" : ""}
            onClick={() => setActiveTab(tab)}
            type="button"
          >
            {tab}
          </button>
        ))}
      </nav>

      {activeTab === "Dashboard" && (
        <Dashboard products={products} customers={customers} orders={orders} lowStock={lowStock} />
      )}

      {activeTab === "Products" && (
        <ProductsSection
          productForm={productForm}
          products={products}
          editingProductId={editingProductId}
          setEditingProductId={setEditingProductId}
          handleProductSubmit={handleProductSubmit}
          handleDeleteProduct={handleDeleteProduct}
        />
      )}

      {activeTab === "Customers" && (
        <CustomersSection
          customerForm={customerForm}
          customers={customers}
          handleCustomerSubmit={handleCustomerSubmit}
          handleDeleteCustomer={handleDeleteCustomer}
        />
      )}

      {activeTab === "Orders" && (
        <OrdersSection
          orderForm={orderForm}
          orderItems={orderItems}
          products={products}
          customers={customers}
          orders={orders}
          orderDetails={orderDetails}
          handleOrderSubmit={handleOrderSubmit}
          handleLoadOrder={handleLoadOrder}
          handleDeleteOrder={handleDeleteOrder}
        />
      )}
    </div>
  );
}
