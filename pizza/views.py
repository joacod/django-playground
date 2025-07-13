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
        order = serializer.save()
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
