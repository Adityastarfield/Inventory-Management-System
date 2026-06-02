from fastapi import APIRouter
from fastapi import Depends
from fastapi import HTTPException
from fastapi import status

from sqlalchemy.orm import Session

from app.dependencies import get_db

from app.models.customer import Customer
from app.models.order import Order
from sqlalchemy.exc import IntegrityError

from app.models.order import Order

from app.schemas.customer import CustomerCreate

router = APIRouter(
    prefix="/customers",
    tags=["Customers"]
)

@router.post("",
             status_code=status.HTTP_201_CREATED
             )
def create_customer(
        customer: CustomerCreate,
        db: Session = Depends(get_db)
):

    existing = db.query(Customer)\
        .filter(Customer.email == customer.email)\
        .first()

    if existing:
        raise HTTPException(
            status_code=400,
            detail="Email already exists"
        )

    new_customer = Customer(
        full_name=customer.full_name,
        email=customer.email,
        phone=customer.phone
    )

    db.add(new_customer)
    db.commit()
    db.refresh(new_customer)

    return new_customer

@router.get("")
def get_customers(
        db: Session = Depends(get_db)
):
    return db.query(Customer).all()

@router.get("/{customer_id}")
def get_customer(
        customer_id: int,
        db: Session = Depends(get_db)
):

    customer = db.query(Customer)\
        .filter(Customer.id == customer_id)\
        .first()

    if not customer:
        raise HTTPException(
            status_code=404,
            detail="Customer not found"
        )

    return customer

@router.delete("/{customer_id}")
def delete_customer(
        customer_id: int,
        db: Session = Depends(get_db)
):

    customer = db.query(Customer)\
        .filter(Customer.id == customer_id)\
        .first()

    if not customer:
        raise HTTPException(
            status_code=404,
            detail="Customer not found"
        )
    
    existing_orders = db.query(Order).filter(Order.customer_id == customer_id).first()

    if existing_orders:
        raise HTTPException(
            status_code=400,
            detail="Cannot delete this customer — they have existing orders."
        )

    try:
        db.delete(customer)
        db.commit()
        return {"message": "Customer deleted successfully"}
    except IntegrityError:
        db.rollback()
        # Provide a simple, human-readable message rather than raw DB text
        raise HTTPException(
            status_code=400,
            detail="Cannot delete this customer — they are referenced by other records."
        )