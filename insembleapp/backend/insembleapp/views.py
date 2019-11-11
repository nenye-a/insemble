from django.shortcuts import render  # noqa


def index(request):
    return render(request, 'insembleapp/index.html')

# def analytics(rerquest):
#     return render(request, '')