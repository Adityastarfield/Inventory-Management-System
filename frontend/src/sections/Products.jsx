import React from "react";

export default function ProductsSection({
  productForm,
  products,
  editingProductId,
  setEditingProductId,
  handleProductSubmit,
  handleDeleteProduct
}) {
  return (
    <section className="grid cols-2">
      <div className="card">
        <div className="card-header">
          <h3>{editingProductId ? "Edit Product" : "Add Product"}</h3>
          <span className="pill">Inventory</span>
        </div>
        <form className="form" onSubmit={productForm.handleSubmit(handleProductSubmit)}>
          <div className="field">
            <label>Product name</label>
            <input {...productForm.register("name")} placeholder="Premium Coffee Beans" />
            <span className="field-error">{productForm.formState.errors.name?.message}</span>
          </div>
          <div className="field">
            <label>SKU / Code</label>
            <input {...productForm.register("sku")} placeholder="COF-100" />
            <span className="field-error">{productForm.formState.errors.sku?.message}</span>
          </div>
          <div className="grid cols-2">
            <div className="field">
              <label>Price</label>
              <input type="number" step="0.01" min="0" {...productForm.register("price")} placeholder="15.00" />
              <span className="field-error">{productForm.formState.errors.price?.message}</span>
            </div>
            <div className="field">
              <label>Quantity</label>
              <input type="number" min="0" {...productForm.register("quantity")} placeholder="50" />
              <span className="field-error">{productForm.formState.errors.quantity?.message}</span>
            </div>
          </div>
          <div className="actions">
            <button className="primary" type="submit">{editingProductId ? "Update" : "Add"}</button>
            {editingProductId ? (
              <button className="ghost" type="button" onClick={() => { setEditingProductId(null); productForm.reset(); }}>
                Cancel
              </button>
            ) : null}
          </div>
        </form>
      </div>
      <div className="card">
        <div className="card-header">
          <h3>Products</h3>
          <span className="pill">{products.length} total</span>
        </div>
        <div className="table">
          <div className="table-header">
            <span>Name</span>
            <span>SKU</span>
            <span>Price</span>
            <span>Qty</span>
            <span>Actions</span>
          </div>
          {products.length === 0 ? (
            <div className="empty-state">No products yet.</div>
          ) : (
            products.map((product) => (
              <div className="table-row" key={product.id}>
                <span>{product.name}</span>
                <span className="pill">{product.sku}</span>
                <span>{new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(product.price)}</span>
                <span>{product.quantity}</span>
                <span className="actions">
                  <button className="ghost" type="button" onClick={() => {
                    setEditingProductId(product.id);
                    productForm.reset({ name: product.name, sku: product.sku, price: product.price, quantity: product.quantity });
                  }}>Edit</button>
                  <button className="danger" type="button" onClick={() => handleDeleteProduct(product.id, product.name, product.sku)}>Delete</button>
                </span>
              </div>
            ))
          )}
        </div>
      </div>
    </section>
  );
}
