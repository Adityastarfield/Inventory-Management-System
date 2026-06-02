import React from "react";

export default function Dashboard({ products, customers, orders, lowStock }) {
  function currency(value) {
    if (Number.isNaN(Number(value))) return "-";
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD"
    }).format(Number(value));
  }

  return (
    <section className="grid cols-3">
      <div className="card stat">
        <span className="pill">Inventory</span>
        <strong>{products.reduce((sum, p) => sum + p.quantity, 0)}</strong>
        <small>Total units in stock</small>
      </div>
      <div className="card stat">
        <span className="pill">Revenue</span>
        <strong>
          {currency(orders.reduce((sum, o) => sum + o.total_amount, 0))}
        </strong>
        <small>Total order value</small>
      </div>
      <div className="card stat">
        <span className="pill warning">Low Stock</span>
        <strong>{lowStock.length}</strong>
        <small>Products with 5 or fewer</small>
      </div>
      <div className="card span-2">
        <div className="card-header">
          <h3>Low Stock Watchlist</h3>
          <span className="pill">Auto refresh</span>
        </div>
        <div className="list">
          {lowStock.length === 0 ? (
            <div className="empty-state">All products are comfortably stocked.</div>
          ) : (
            lowStock.map((product) => (
              <div className="list-item" key={product.id}>
                <div>
                  <strong>{product.name}</strong>
                  <div>
                    <small>SKU {product.sku}</small>
                  </div>
                </div>
                <span className="pill warning">{product.quantity} left</span>
              </div>
            ))
          )}
        </div>
      </div>
      <div className="card">
        <div className="card-header">
          <h3>Recent Orders</h3>
          <span className="pill">Last 5</span>
        </div>
        <div className="list">
          {orders.length === 0 ? (
            <div className="empty-state">No orders yet.</div>
          ) : (
            orders.slice(0, 5).map((order) => (
              <div className="list-item" key={order.id}>
                <div>
                  <strong>Order #{order.id}</strong>
                  <div>
                    <small>Customer ID {order.customer_id}</small>
                  </div>
                </div>
                <span className="pill">{currency(order.total_amount)}</span>
              </div>
            ))
          )}
        </div>
      </div>
    </section>
  );
}
