from rest_framework import serializers

class SaleItensSerializer(serializers.Serializer):
    ammount =  serializers.IntegerField()
    value = serializers.IntegerField()

    class Meta:
        fields = ('__all__')

class SaleCreateSerializer(serializers.Serializer):
    client = serializers.CharField()
    num_card = serializers.CharField()
    cvv = serializers.CharField()
    itens = SaleItensSerializer(many=True)

    class Meta:
        fields = ('__all__')