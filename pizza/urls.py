from django.urls import path
from .views import (
    CustomerCreateView,
    OrderCreateView,
    PizzaListCreateView,
    PizzaDeleteView,
    MostSoldPizzaView,
    CustomerOfTheYearView,
)

urlpatterns = [
    path('customers/', CustomerCreateView.as_view()),
    path('orders/', OrderCreateView.as_view()),
    path('pizzas/', PizzaListCreateView.as_view()),
    path('pizzas/<str:name>/', PizzaDeleteView.as_view()),
    path('reports/most-sold-pizza/', MostSoldPizzaView.as_view()),
    path('reports/customer-of-the-year/', CustomerOfTheYearView.as_view()),
] 