from django.contrib import admin
from .models import Customer, Pizza, Order, OrderItem

admin.site.register(Customer)
admin.site.register(Pizza)
admin.site.register(Order)
admin.site.register(OrderItem)
