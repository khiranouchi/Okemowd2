from django.shortcuts import render

def main(request):
    d = {
    }
    return render(request, 'main.html', d)
