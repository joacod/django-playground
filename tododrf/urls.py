from django.urls import path
from django.http import HttpResponse

def placeholder_view(request):
    return HttpResponse('TodoDRF App Home')

urlpatterns = [
    path('', placeholder_view, name='tododrf-home'),
] 