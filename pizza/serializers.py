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

class PizzaNameField(serializers.Field):
    def to_internal_value(self, value):
        try:
            pizza = Pizza.objects.get(name__iexact=value)
            return pizza
        except Pizza.DoesNotExist:
            raise serializers.ValidationError(f'Pizza "{value}" does not exist.')
    
    def to_representation(self, value):
        return value.name if value else None

class OrderItemSerializer(serializers.ModelSerializer):
    pizza = PizzaNameField()

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
        
        # Check if items is present and not empty
        items = data.get('items')
        if not items:
            raise serializers.ValidationError('Items field is required and cannot be empty.')
        
        return data

    def create(self, validated_data):
        email = validated_data.pop('email', None)
        phone = validated_data.pop('phone', None)
        items_data = validated_data.pop('items')
        customer = None
        from .models import Customer
        # Customer matching/creation logic
        if email and phone:
            email_qs = Customer.objects.filter(email=email)
            phone_qs = Customer.objects.filter(phone=phone)
            if not email_qs.exists() and not phone_qs.exists():
                customer = Customer.objects.create(email=email, phone=phone)
            elif email_qs.exists() and not phone_qs.exists():
                customer = email_qs.first()
                customer.phone = phone
                customer.save()
            elif not email_qs.exists() and phone_qs.exists():
                customer = phone_qs.first()
                customer.email = email
                customer.save()
            elif email_qs.first().id == phone_qs.first().id:
                customer = email_qs.first()
            else:
                raise serializers.ValidationError('Email and phone belong to different customers.')
        elif email:
            try:
                customer = Customer.objects.get(email=email)
            except Customer.DoesNotExist:
                raise serializers.ValidationError('Customer with this email does not exist.')
        elif phone:
            try:
                customer = Customer.objects.get(phone=phone)
            except Customer.DoesNotExist:
                raise serializers.ValidationError('Customer with this phone does not exist.')
        order = Order.objects.create(customer=customer)
        for item in items_data:
            OrderItem.objects.create(order=order, pizza=item['pizza'], quantity=item['quantity'])
        return order 