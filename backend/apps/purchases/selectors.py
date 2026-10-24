from .models import Purchase

def get_customer_purchases(customer):
"""
Return purchases belonging to the specified customer.
"""
return (
Purchase.objects.filter(customer=customer)
.select_related("package", "customer")
.order_by("-created_at")
)

def get_purchase_by_reference(reference, customer):
"""
Retrieve a purchase by its reference while ensuring
that it belongs to the specified customer.
"""
return get_customer_purchases(customer).filter(
reference=reference
).first()
