from django.shortcuts import render, redirect, get_object_or_404
from django.contrib.auth import logout
from . import models
from . import forms


def temp(request):
    """
    Основное представление рабочего пространства.
    Отображает все списки, карточки, чек-листы и их пункты для авторизованного пользователя.
    """
    if request.user.is_authenticated:
        lists = models.List.objects.filter(list_user=request.user)
        cards = models.Card.objects.filter(parent__in=lists)
        checklists = models.CheckList.objects.filter(parent__in=cards)
        clcards = models.CheckListCard.objects.filter(parent__in=checklists)

        list_form = forms.AddList
        card_form = forms.AddCard
        cl_form = forms.AddCheckList
        cl_card_form = forms.AddClCard

        context = {'lists': lists,
                   'cards': cards,
                   'checklists': checklists,
                   'clcards': clcards,

                   'lform': list_form,
                   'cardform': card_form,
                   'clform': cl_form,
                   'clcardform': cl_card_form
                   }
    else:
        # Если пользователь не авторизован - пустой контекст
        context = {}
    return render(request, 'workspace/nwp.html', context)


def logout_user(request):
    """
    Выход пользователя из системы.
    Перенаправляет на главную страницу после выхода.
    """
    logout(request)
    return redirect('main_page')


def create_list(request):
    if request.method == 'POST':
        form = forms.AddList(request.POST)
        if form.is_valid():
            temp = form.save(commit=False) # Создаем объект List, но не сохраняем его в базу данных
            temp.list_user = request.user
            temp.save()
            return redirect('workspace')

    return redirect('workspace')


model_mapping = {
    'workspace': '',
    'desk': '',
    'list': models.List,
    'card': models.Card,
    'checklist': models.CheckList,
    'checklist_item': models.CheckListCard
}
form_mapping = {
    'workspace': '',
    'desk': '',
    'list': forms.AddList,
    'card': forms.AddCard,
    'checklist': forms.AddCheckList,
    'checklist_item': forms.AddClCard
}

def delete_el(request, el_type, el_id):
    model = model_mapping.get(el_type)
    element = get_object_or_404(model, id=el_id)
    element.delete()
    return redirect('workspace')


def create_el(request, el_type, parent_type, parent_id):
    parent_model = model_mapping.get(parent_type)
    if request.method == 'POST':
        type_form = form_mapping.get(el_type)
        form = type_form(request.POST)

        if parent_id:
            current_parent_el = get_object_or_404(parent_model, id=parent_id)
            if form.is_valid():
                temp = form.save(commit=False)  # Создаем объект List, но не сохраняем его в базу данных
                temp.parent = current_parent_el
                temp.save()
                return redirect('workspace')

    return redirect('workspace')