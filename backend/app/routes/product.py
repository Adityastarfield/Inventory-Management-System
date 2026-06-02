from fastapi import APIRouter
from fastapi import Depends
from fastapi import HTTPException
from fastapi import status

from sqlalchemy.orm import Session

from app.dependencies import get_db
from app.models.product import Product
from app.schemas.product import ProductCreate
from app.schemas.product import ProductUpdate
from sqlalchemy.exc import IntegrityError

router = APIRouter(
    prefix="/products",
    tags=["Products"]
)

@router.post(
        "",
        status_code=status.HTTP_201_CREATED
        )
def create_product(
        product: ProductCreate,
        db: Session = Depends(get_db)
):

    existing = db.query(Product)\
        .filter(Product.sku == product.sku)\
        .first()

    if existing:
        raise HTTPException(
            status_code=400,
            detail="SKU already exists"
        )

    new_product = Product(
        name=product.name,
        sku=product.sku,
        price=product.price,
        quantity=product.quantity
    )

    db.add(new_product)
    db.commit()
    db.refresh(new_product)

    return new_product

@router.get("")
def get_products(
        db: Session = Depends(get_db)
):

    return db.query(Product).all()

@router.get("/{product_id}")
def get_product(
        product_id: int,
        db: Session = Depends(get_db)
):

    product = db.query(Product)\
        .filter(Product.id == product_id)\
        .first()

    if not product:
        raise HTTPException(
            status_code=404,
            detail="Product not found"
        )

    return product

@router.put("/{product_id}")
def update_product(
        product_id: int,
        request: ProductUpdate,
        db: Session = Depends(get_db)
):

    product = db.query(Product)\
        .filter(Product.id == product_id)\
        .first()

    if not product:
        raise HTTPException(
            status_code=404,
            detail="Product not found"
        )
    
    existing = db.query(Product).filter(
    Product.sku == request.sku,
    Product.id != product_id
    ).first()

    if existing:
        raise HTTPException(
            status_code=400,
            detail="SKU already exists"
        )

    product.name = request.name
    product.sku = request.sku
    product.price = request.price
    product.quantity = request.quantity

    db.commit()
    db.refresh(product)

    return product

@router.delete("/{product_id}")
def delete_product(
        product_id: int,
        db: Session = Depends(get_db)
):

    product = db.query(Product)\
        .filter(Product.id == product_id)\
        .first()

    if not product:
        raise HTTPException(
            status_code=404,
            detail="Product not found"
        )

    try:
        db.delete(product)
        db.commit()
        return {"message": "Product deleted successfully"}
    except IntegrityError:
        db.rollback()
        raise HTTPException(
            status_code=400,
            detail="Cannot delete this product — it is associated with existing order items."
        )