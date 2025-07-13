from rest_framework import serializers
from .models import Customer, Pizza, Order, OrderItem

class CustomerSerializer(serializers.ModelSerializer):
    class Meta:
        model = Customer
        fields = ['id', 'email', 'phone']

    def validate(self, data):
        # Unique validation is handled by model, but can add custom logic if needed
        return data

class PizzaSerializer(serializers.ModelSerializer):
    class Meta:
        model = Pizza
        fields = ['id', 'name']

    def validate_name(self, value):
        # Enforce case-insensitive uniqueness
        if Pizza.objects.filter(name__iexact=value).exists():
            raise serializers.ValidationError('Pizza with this name already exists.')
        return value

class OrderItemSerializer(serializers.ModelSerializer):
    pizza = serializers.SlugRelatedField(slug_field='name', queryset=Pizza.objects.all())

    class Meta:
        model = OrderItem
        fields = ['pizza', 'quantity']

class OrderSerializer(serializers.ModelSerializer):
    customer = CustomerSerializer(read_only=True)
    items = OrderItemSerializer(many=True)
    email = serializers.EmailField(write_only=True, required=False)
    phone = serializers.CharField(write_only=True, required=False)

    class Meta:
        model = Order
        fields = ['id', 'customer', 'created_at', 'items', 'email', 'phone']
        read_only_fields = ['id', 'customer', 'created_at']

    def validate(self, data):
        # At least one of email or phone must be provided
        email = data.get('email')
        phone = data.get('phone')
        if not email and not phone:
            raise serializers.ValidationError('At least one of email or phone must be provided.')
        return data

    def create(self, validated_data):
        # Custom order creation logic will be implemented in the view
        raise NotImplementedError('Order creation logic is handled in the view.') 