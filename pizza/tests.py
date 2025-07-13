from django.test import TestCase
from rest_framework.test import APIClient
from rest_framework import status
from .models import Customer, Pizza, Order, OrderItem
from django.urls import reverse
from django.utils import timezone

# Create your tests here.

class PizzaAPITestCase(TestCase):
    def setUp(self):
        self.client = APIClient()
        self.customer_data = {'email': 'a@example.com', 'phone': '12345'}
        self.pizza_data = {'name': 'Muzzarella'}
        self.pizza2_data = {'name': 'Napolitana'}

    def test_customer_deduplication_and_update(self):
        # Create customer with both fields
        resp = self.client.post('/api/customers/', self.customer_data, format='json')
        self.assertEqual(resp.status_code, status.HTTP_201_CREATED)
        # Try to create with same email, different phone
        resp = self.client.post('/api/customers/', {'email': 'a@example.com', 'phone': '67890'}, format='json')
        self.assertEqual(resp.status_code, status.HTTP_400_BAD_REQUEST)
        # Try to create with same phone, different email
        resp = self.client.post('/api/customers/', {'email': 'b@example.com', 'phone': '12345'}, format='json')
        self.assertEqual(resp.status_code, status.HTTP_400_BAD_REQUEST)

    def test_pizza_name_normalization_and_uniqueness(self):
        resp = self.client.post('/api/pizzas/', self.pizza_data, format='json')
        self.assertEqual(resp.status_code, status.HTTP_201_CREATED)
        # Name should be normalized to lowercase
        pizza = Pizza.objects.get(name='muzzarella')
        self.assertIsNotNone(pizza)
        # Try to add same name with different case
        resp = self.client.post('/api/pizzas/', {'name': 'MUZZARELLA'}, format='json')
        self.assertEqual(resp.status_code, status.HTTP_400_BAD_REQUEST)

    def test_order_creation_scenarios(self):
        # Add pizzas
        pizza_resp1 = self.client.post('/api/pizzas/', self.pizza_data, format='json')
        pizza_resp2 = self.client.post('/api/pizzas/', self.pizza2_data, format='json')
        # Create customer
        customer_resp = self.client.post('/api/customers/', self.customer_data, format='json')
        # 1. Both email and phone, new customer
        order_data = {
            'email': 'c@example.com', 'phone': '54321',
            'items': [{'pizza': 'muzzarella', 'quantity': 2}]
        }
        resp = self.client.post('/api/orders/', order_data, format='json')
        self.assertEqual(resp.status_code, status.HTTP_201_CREATED)
        # 2. Only email, existing customer
        resp = self.client.post('/api/orders/', {
            'email': 'a@example.com',
            'items': [{'pizza': 'muzzarella', 'quantity': 1}]
        }, format='json')
        self.assertEqual(resp.status_code, status.HTTP_201_CREATED)
        # 3. Only phone, existing customer
        resp = self.client.post('/api/orders/', {
            'phone': '12345',
            'items': [{'pizza': 'napolitana', 'quantity': 1}]
        }, format='json')
        self.assertEqual(resp.status_code, status.HTTP_201_CREATED)
        # 4. Only email, non-existing customer
        resp = self.client.post('/api/orders/', {
            'email': 'notfound@example.com',
            'items': [{'pizza': 'muzzarella', 'quantity': 1}]
        }, format='json')
        self.assertEqual(resp.status_code, status.HTTP_400_BAD_REQUEST)
        # 5. Only phone, non-existing customer
        resp = self.client.post('/api/orders/', {
            'phone': '00000',
            'items': [{'pizza': 'muzzarella', 'quantity': 1}]
        }, format='json')
        self.assertEqual(resp.status_code, status.HTTP_400_BAD_REQUEST)
        # 6. Both email and phone, but belong to different customers
        self.client.post('/api/customers/', {'email': 'd@example.com', 'phone': '99999'}, format='json')
        resp = self.client.post('/api/orders/', {
            'email': 'a@example.com', 'phone': '99999',
            'items': [{'pizza': 'muzzarella', 'quantity': 1}]
        }, format='json')
        self.assertEqual(resp.status_code, status.HTTP_400_BAD_REQUEST)

    def test_reports(self):
        # Add pizzas
        self.client.post('/api/pizzas/', self.pizza_data, format='json')
        self.client.post('/api/pizzas/', self.pizza2_data, format='json')
        # Create customer and orders
        self.client.post('/api/customers/', self.customer_data, format='json')
        self.client.post('/api/orders/', {
            'email': 'a@example.com',
            'items': [{'pizza': 'muzzarella', 'quantity': 3}, {'pizza': 'napolitana', 'quantity': 1}]
        }, format='json')
        self.client.post('/api/orders/', {
            'email': 'a@example.com',
            'items': [{'pizza': 'muzzarella', 'quantity': 1}]
        }, format='json')
        # Most sold pizza of the month
        now = timezone.now()
        resp = self.client.get(f'/api/reports/most-sold-pizza/?month={now.month}&year={now.year}')
        self.assertEqual(resp.status_code, status.HTTP_200_OK)
        self.assertEqual(resp.data['pizza'], 'muzzarella')
        # Customer of the year
        resp = self.client.get(f'/api/reports/customer-of-the-year/?year={now.year}')
        self.assertEqual(resp.status_code, status.HTTP_200_OK)
        self.assertEqual(resp.data['email'], 'a@example.com')
