from django.shortcuts import render, redirect, get_object_or_404
from django.contrib.auth import logout
from django.contrib.auth.decorators import login_required
from django.http import JsonResponse
from django.views.decorators.http import require_POST
from django.views.decorators.csrf import csrf_exempt
import json
from rest_framework import viewsets
from rest_framework import permissions
from rest_framework.decorators import action
from rest_framework.response import Response

from . import models
from . import forms
from . import serializers

class WorkSpaceViewSet(viewsets.ModelViewSet):
    permission_classes = [permissions.IsAuthenticated]
    queryset = models.WorkSpace.objects.all()
    serializer_class = serializers.WorkSpaceSerializer

    def get_queryset(self):
        return models.WorkSpace.objects.filter(owner=self.request.user)

    def perform_create(self, serializer):
        serializer.save(owner=self.request.user)

class DeskViewSet(viewsets.ModelViewSet):
    queryset = models.Desk.objects.all()
    serializer_class = serializers.DeskSerializer

class ListViewSet(viewsets.ModelViewSet):
    queryset = models.List.objects.all()
    serializer_class = serializers.ListSerializer


class CardViewSet(viewsets.ModelViewSet):
    queryset = models.Card.objects.all()
    serializer_class = serializers.CardSerializer

    @action(detail=True, methods=['post'])
    def set_deadline(self, request, pk=None):
        card = self.get_object()
        deadline = request.data.get('deadline')

        if deadline:
            try:
                card.deadline = deadline
                card.save()
                return Response({'status': 'deadline set'})
            except Exception as e:
                return Response({'error': str(e)}, status=400)
        else:
            card.deadline = None
            card.save()
            return Response({'status': 'deadline removed'})

class CheckListViewSet(viewsets.ModelViewSet):
    queryset = models.CheckList.objects.all()
    serializer_class = serializers.CheckListSerializer

class CheckListCardViewSet(viewsets.ModelViewSet):
    queryset = models.CheckListCard.objects.all()
    serializer_class = serializers.CheckListCardSerializer


def temp_wp_page(request, desk_id):
    desk = models.Desk.objects.get(id=desk_id)
    context = {'desk': desk}
    return render(request, 'workspace/desk_settings.html', context)


@login_required
def profile(request):
    workspaces = models.WorkSpace.objects.filter(owner=request.user)
    desks = models.Desk.objects.filter(parent__in=workspaces)
    wpform = forms.AddWorkSpace
    deskform = forms.AddDesk
    context = {'workspaces': workspaces,
               'desks': desks,
               'deskform': deskform,
               'wpform': wpform
               }
    return render(request, 'workspace/profile.html', context)


def desk_view(request, desk_id):
    """
        Основное представление рабочего пространства.
        Отображает все списки, карточки, чек-листы и их пункты для авторизованного пользователя.
        """
    desk = models.Desk.objects.get(id=desk_id)
    if request.user.is_authenticated:
        lists = models.List.objects.filter(parent_id=desk_id)
        cards = models.Card.objects.filter(parent__in=lists)
        checklists = models.CheckList.objects.filter(parent__in=cards)
        clcards = models.CheckListCard.objects.filter(parent__in=checklists)

        list_form = forms.AddList
        card_form = forms.AddCard
        checklist_form = forms.AddCheckList
        item_form = forms.AddClCard

        context = {'lists': lists,
                   'cards': cards,
                   'checklists': checklists,
                   'clcards': clcards,

                   'lform': list_form,
                   'cardform': card_form,
                   'checklistform': checklist_form,
                   'itemform': item_form,

                   'desk': desk
                   }
    else:
        context = {}
    return render(request, 'workspace/nwp.html', context)


def update_deadline(request, card_id):
    try:
        data = json.loads(request.body)
        deadline_str = data.get('deadline')

        card = Card.objects.get(id=card_id)
        if deadline_str:
            from django.utils.dateparse import parse_datetime
            deadline = parse_datetime(deadline_str)
            card.deadline = deadline
            card.save()
            return JsonResponse({'status': 'success'})
        else:
            card.deadline = None
            card.save()
            return JsonResponse({'status': 'success'})
    except Exception as e:
        return JsonResponse({'status': 'error', 'message': str(e)})


def logout_user(request):
    """
    Выход пользователя из системы.
    Перенаправляет на главную страницу после выхода.
    """
    logout(request)
    return redirect('mainpage')

def create_workspace(request):
    if request.method == 'POST':
        form = forms.AddWorkSpace(request.POST)
        if form.is_valid():
            temp = form.save(commit=False)
            temp.owner = request.user
            temp.save()
            return redirect('profile')

    return redirect('profile')


model_mapping = {
    'workspace': models.WorkSpace,
    'desk': models.Desk,
    'list': models.List,
    'card': models.Card,
    'checklist': models.CheckList,
    'item': models.CheckListCard
}
form_mapping = {
    'workspace': forms.AddWorkSpace,
    'desk': forms.AddDesk,
    'list': forms.AddList,
    'card': forms.AddCard,
    'checklist': forms.AddCheckList,
    'item': forms.AddClCard
}

def delete_el(request, el_type, el_id, desk_id=None):
    model = model_mapping.get(el_type)
    element = get_object_or_404(model, id=el_id)
    element.delete()
    if(el_type == 'desk' or el_type == 'workspace'):
        return redirect('profile')
    return redirect('desk', desk_id=desk_id)


def create_el(request, el_type, parent_type, parent_id, desk_id=None):
    parent_model = model_mapping.get(parent_type)
    if request.method == 'POST':
        type_form = form_mapping.get(el_type)
        form = type_form(request.POST)

        if parent_id:
            current_parent_el = get_object_or_404(parent_model, id=parent_id)
            if form.is_valid():
                temp = form.save(commit=False)
                temp.parent = current_parent_el
                temp.save()
                if(el_type == 'desk'):
                    return redirect('profile')
                return redirect('desk', desk_id=desk_id)
    if(el_type == 'desk'):
        return redirect('profile')
    return redirect('desk', desk_id=desk_id)