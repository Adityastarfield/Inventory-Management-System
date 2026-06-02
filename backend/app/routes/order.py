from fastapi import APIRouter
from fastapi import Depends
from fastapi import HTTPException
from fastapi import status

from sqlalchemy.orm import Session

from app.dependencies import get_db

from app.models.customer import Customer
from app.models.product import Product
from app.models.order import Order
from app.models.order_item import OrderItem

from sqlalchemy.exc import IntegrityError

from app.schemas.order import OrderCreate

router = APIRouter(
    prefix="/orders",
    tags=["Orders"]
)

@router.post(
        "",
        status_code=status.HTTP_201_CREATED
        )
def create_order(
        request: OrderCreate,
        db: Session = Depends(get_db)
):

    customer = db.query(Customer)\
        .filter(Customer.id == request.customer_id)\
        .first()

    if not customer:
        raise HTTPException(
            status_code=404,
            detail="Customer not found"
        )

    total_amount = 0

    order = Order(
        customer_id=request.customer_id,
        total_amount=0
    )

    db.add(order)
    db.commit()
    db.refresh(order)

    for item in request.items:

        product = db.query(Product)\
            .filter(Product.id == item.product_id)\
            .first()

        if not product:
            raise HTTPException(
                status_code=404,
                detail=f"Product {item.product_id} not found"
            )

        # inventory validation

        if product.quantity < item.quantity:
            raise HTTPException(
                status_code=400,
                detail=f"Insufficient stock for {product.name}"
            )

        amount = product.price * item.quantity

        total_amount += amount

        # stock deduction

        product.quantity -= item.quantity

        order_item = OrderItem(
            order_id=order.id,
            product_id=product.id,
            quantity=item.quantity,
            price=product.price
        )

        db.add(order_item)

    order.total_amount = total_amount

    db.commit()

    return {
        "order_id": order.id,
        "total_amount": total_amount
    }

@router.get("")
def get_orders(
        db: Session = Depends(get_db)
):
    return db.query(Order).all()

@router.get("/{order_id}")
def get_order(
        order_id: int,
        db: Session = Depends(get_db)
):

    order = db.query(Order)\
        .filter(Order.id == order_id)\
        .first()

    if not order:
        raise HTTPException(
            status_code=404,
            detail="Order not found"
        )

    # Prevent deleting orders that still have order items
    existing_items = db.query(OrderItem).filter(OrderItem.order_id == order_id).first()
    if existing_items:
        raise HTTPException(
            status_code=400,
            detail="Cannot delete this order — it has related order items."
        )

    items = db.query(OrderItem)\
        .filter(OrderItem.order_id == order_id)\
        .all()

    return {
        "order": order,
        "items": items
    }

@router.delete("/{order_id}")
def delete_order(
        order_id: int,
        db: Session = Depends(get_db)
):

    order = db.query(Order)\
        .filter(Order.id == order_id)\
        .first()

    if not order:
        raise HTTPException(
            status_code=404,
            detail="Order not found"
        )

    try:
        db.delete(order)
        db.commit()
        return {"message": "Order deleted"}
    except IntegrityError:
        db.rollback()
        raise HTTPException(
            status_code=400,
            detail="Cannot delete this order — it has related order items."
        )