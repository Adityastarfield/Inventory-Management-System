import React from "react";

export default function OrdersSection({
  orderForm,
  orderItems,
  products,
  customers,
  orders,
  orderDetails,
  handleOrderSubmit,
  handleLoadOrder,
  handleDeleteOrder
}) {
  function currency(value) {
    if (Number.isNaN(Number(value))) return "-";
    return new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(Number(value));
  }

  return (
    <section className="grid cols-2">
      <div className="card">
        <div className="card-header">
          <h3>Create Order</h3>
          <span className="pill">Orders</span>
        </div>
        <form className="form" onSubmit={orderForm.handleSubmit(handleOrderSubmit)}>
          <div className="field">
            <label>Customer</label>
            <select {...orderForm.register("customer_id")}>
              <option value="">Select customer</option>
              {customers.map((customer) => (
                <option key={customer.id} value={customer.id}>{customer.full_name}</option>
              ))}
            </select>
            <span className="field-error">{orderForm.formState.errors.customer_id?.message}</span>
          </div>
          <div className="order-items">
            {orderItems.fields.map((field, index) => (
              <div className="order-item" key={field.id}>
                <div className="field">
                  <label>Product</label>
                  <select {...orderForm.register(`items.${index}.product_id`)}>
                    <option value="">Select product</option>
                    {products.map((product) => (
                      <option key={product.id} value={product.id}>{product.name} ({product.quantity} in stock)</option>
                    ))}
                  </select>
                  <span className="field-error">{orderForm.formState.errors.items?.[index]?.product_id?.message}</span>
                </div>
                <div className="field">
                  <label>Quantity</label>
                  <input type="number" min="1" {...orderForm.register(`items.${index}.quantity`)} />
                  <span className="field-error">{orderForm.formState.errors.items?.[index]?.quantity?.message}</span>
                </div>
                <button className="ghost" type="button" onClick={() => orderItems.remove(index)} disabled={orderItems.fields.length === 1}>Remove</button>
              </div>
            ))}
          </div>
          <span className="field-error">{orderForm.formState.errors.items?.message}</span>
          <div className="actions">
            <button className="ghost" type="button" onClick={() => orderItems.append({ product_id: "", quantity: 1 })}>Add item</button>
            <button className="primary" type="submit">Create order</button>
          </div>
        </form>
      </div>
      <div className="card">
        <div className="card-header">
          <h3>Orders</h3>
          <span className="pill">{orders.length} total</span>
        </div>
        <div className="list">
          {orders.length === 0 ? (
            <div className="empty-state">No orders yet.</div>
          ) : (
            orders.map((order) => (
              <div className="list-item" key={order.id}>
                <div>
                  <strong>Order #{order.id}</strong>
                  <div>
                    <small>Customer ID {order.customer_id}</small>
                  </div>
                  <div>
                    <small>{currency(order.total_amount)}</small>
                  </div>
                </div>
                <div className="actions">
                  <button className="ghost" type="button" onClick={() => handleLoadOrder(order.id)}>View</button>
                  <button className="danger" type="button" onClick={() => handleDeleteOrder(order.id, order.total_amount)}>Delete</button>
                </div>
              </div>
            ))
          )}
        </div>

        {orderDetails ? (
          <div className="card nested">
            <div className="card-header">
              <h3>Order #{orderDetails.order.id} details</h3>
              <span className="pill">Items</span>
            </div>
            <div className="list">
              {orderDetails.items.map((item) => (
                <div className="list-item" key={item.id}>
                  <div>
                    <strong>Product ID {item.product_id}</strong>
                    <div>
                      <small>Qty {item.quantity}</small>
                    </div>
                  </div>
                  <span className="pill">{currency(item.price)}</span>
                </div>
              ))}
            </div>
          </div>
        ) : null}
      </div>
    </section>
  );
}
