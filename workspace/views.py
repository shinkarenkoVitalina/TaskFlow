from django.shortcuts import render, redirect, get_object_or_404
from django.contrib.auth import logout
from django.contrib.auth.decorators import login_required
from . import models
from . import forms


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

                   'desk_id': desk_id
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