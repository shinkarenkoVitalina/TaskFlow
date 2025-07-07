from rest_framework import serializers
from .models import WorkSpace, Desk, List, Card, CheckList, CheckListCard

class CheckListCardSerializer(serializers.ModelSerializer):
    class Meta:
        model = CheckListCard
        fields = '__all__'

class CheckListSerializer(serializers.ModelSerializer):
    items = CheckListCardSerializer(many=True, read_only=True)
    class Meta:
        model = CheckList
        fields = '__all__'


class CardSerializer(serializers.ModelSerializer):
    checklists = CheckListSerializer(many=True, read_only=True)

    class Meta:
        model = Card
        fields = '__all__'
        extra_kwargs = {
            'deadline': {'required': False, 'allow_null': True}
        }

class ListSerializer(serializers.ModelSerializer):
    cards = CardSerializer(many=True, read_only=True)
    class Meta:
        model = List
        fields = '__all__'

class DeskSerializer(serializers.ModelSerializer):
    lists = ListSerializer(many=True, read_only=True)
    class Meta:
        model = Desk
        fields = '__all__'

class WorkSpaceSerializer(serializers.ModelSerializer):
    desks = DeskSerializer(many=True, read_only=True)
    class Meta:
        model = WorkSpace
        fields = '__all__'
        extra_kwargs = {
            'owner': {'read_only': True}
        }