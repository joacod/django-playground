from rest_framework import generics, status
from rest_framework.views import APIView
from rest_framework.response import Response
from django.db.models import Sum, Count
from django.utils import timezone
from .models import Customer, Pizza, Order, OrderItem
from .serializers import CustomerSerializer, PizzaSerializer, OrderSerializer

# POST /api/customers/
class CustomerCreateView(generics.CreateAPIView):
    queryset = Customer.objects.all()
    serializer_class = CustomerSerializer

# POST /api/orders/
class OrderCreateView(APIView):
    def post(self, request):
        serializer = OrderSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        email = serializer.validated_data.get('email')
        phone = serializer.validated_data.get('phone')
        items_data = serializer.validated_data.get('items')

        customer = None
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
                return Response({'detail': 'Email and phone belong to different customers.'}, status=400)
        elif email:
            try:
                customer = Customer.objects.get(email=email)
            except Customer.DoesNotExist:
                return Response({'detail': 'Customer with this email does not exist.'}, status=400)
        elif phone:
            try:
                customer = Customer.objects.get(phone=phone)
            except Customer.DoesNotExist:
                return Response({'detail': 'Customer with this phone does not exist.'}, status=400)

        # Create order and items
        order = Order.objects.create(customer=customer)
        for item in items_data:
            pizza = Pizza.objects.get(name__iexact=item['pizza'])
            OrderItem.objects.create(order=order, pizza=pizza, quantity=item['quantity'])
        return Response(OrderSerializer(order).data, status=201)

# GET, POST /api/pizzas/
class PizzaListCreateView(generics.ListCreateAPIView):
    queryset = Pizza.objects.all()
    serializer_class = PizzaSerializer

    def create(self, request, *args, **kwargs):
        # Enforce case-insensitive uniqueness
        name = request.data.get('name', '').lower()
        if Pizza.objects.filter(name__iexact=name).exists():
            return Response({'detail': 'Pizza with this name already exists.'}, status=400)
        return super().create(request, *args, **kwargs)

# DELETE /api/pizzas/{name}/
class PizzaDeleteView(APIView):
    def delete(self, request, name):
        try:
            pizza = Pizza.objects.get(name__iexact=name)
            pizza.delete()
        except Pizza.DoesNotExist:
            pass  # Do nothing if not found
        return Response(status=204)

# GET /api/reports/most-sold-pizza/?month=&year=
class MostSoldPizzaView(APIView):
    def get(self, request):
        month = int(request.query_params.get('month', timezone.now().month))
        year = int(request.query_params.get('year', timezone.now().year))
        items = OrderItem.objects.filter(
            order__created_at__year=year,
            order__created_at__month=month
        ).values('pizza__name').annotate(total=Sum('quantity')).order_by('-total')
        if not items:
            return Response({'detail': 'No sales found.'}, status=404)
        top = items[0]
        return Response({'pizza': top['pizza__name'], 'total': top['total']})

# GET /api/reports/customer-of-the-year/?year=
class CustomerOfTheYearView(APIView):
    def get(self, request):
        year = int(request.query_params.get('year', timezone.now().year))
        orders = Order.objects.filter(created_at__year=year)
        customers = orders.values('customer__id', 'customer__email', 'customer__phone').annotate(order_count=Count('id')).order_by('-order_count')
        if not customers:
            return Response({'detail': 'No customers found.'}, status=404)
        top = customers[0]
        return Response({
            'email': top['customer__email'],
            'phone': top['customer__phone'],
            'orders': top['order_count']
        })
