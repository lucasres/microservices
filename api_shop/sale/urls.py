from django.urls import path
from .views import SaleCreateView

urlpatterns = [
    path('',SaleCreateView.as_view(),name='create-sale')
]