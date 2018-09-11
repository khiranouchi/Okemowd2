from django.shortcuts import render
from django.http.response import HttpResponse

def main(request):
    return HttpResponse("Song list page");
