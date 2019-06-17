from rest_framework import generics
from .serializer import SaleCreateSerializer
from .repository import SalesRepository
from rest_framework.response import Response

# Create your views here.
class SaleCreateView(generics.GenericAPIView):

    def post(self,request,*args,**kwargs):
        serializer = SaleCreateSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        #faz a logica de negocio
        SalesRepository.make_sale(serializer)
        return Response({'status':0,'message':'Sales processed'})