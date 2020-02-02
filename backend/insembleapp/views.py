from django.shortcuts import render  # noqa


def index(request):
    return render(request, 'insembleapp/index.html')

