import React from "react";

export default function CustomersSection({ customerForm, customers, handleCustomerSubmit, handleDeleteCustomer }) {
  return (
    <section className="grid cols-2">
      <div className="card">
        <div className="card-header">
          <h3>Add Customer</h3>
          <span className="pill">CRM</span>
        </div>
        <form className="form" onSubmit={customerForm.handleSubmit(handleCustomerSubmit)}>
          <div className="field">
            <label>Full name</label>
            <input {...customerForm.register("full_name")} placeholder="Ari Patel" />
            <span className="field-error">{customerForm.formState.errors.full_name?.message}</span>
          </div>
          <div className="field">
            <label>Email</label>
            <input type="email" {...customerForm.register("email")} placeholder="ari@email.com" />
            <span className="field-error">{customerForm.formState.errors.email?.message}</span>
          </div>
          <div className="field">
            <label>Phone</label>
            <input {...customerForm.register("phone")} placeholder="+1 555 991 234" />
            <span className="field-error">{customerForm.formState.errors.phone?.message}</span>
          </div>
          <button className="primary" type="submit">Save customer</button>
        </form>
      </div>
      <div className="card">
        <div className="card-header">
          <h3>Customers</h3>
          <span className="pill">{customers.length} total</span>
        </div>
        <div className="list">
          {customers.length === 0 ? (
            <div className="empty-state">No customers yet.</div>
          ) : (
            customers.map((customer) => (
              <div className="list-item" key={customer.id}>
                <div>
                  <strong>{customer.full_name}</strong>
                  <div>
                    <small>{customer.email}</small>
                  </div>
                </div>
                <div className="actions">
                  <button className="danger" type="button" onClick={() => handleDeleteCustomer(customer.id, customer.full_name)}>Delete</button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </section>
  );
}
