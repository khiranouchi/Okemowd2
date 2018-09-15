from django.shortcuts import render, redirect, HttpResponse
from django.views.decorators.csrf import csrf_exempt

from .models import Genre, KeyLevel, Song
from .misc import *


@csrf_exempt
def main(request):
    # get all song (view template)
    if request.method == 'GET':
        d = {
            'song_list': Song.objects.all(),
            'dict_rank_name': dict_rank_name,
        }
        return render(request, 'main.html', d)

    # create new song
    if request.method == 'POST':
        # name has nonnull restriction (also filter empty string here)
        name = request.POST.get('name')
        if name is None or not name:
            return HttpResponse(status=400)

        # genre_id is foreign-key which must exist in table Genre
        genre_id = request.POST.get('genre_id')
        if genre_id is not None:
            if Genre.objects.filter(id=genre_id).first() is None:
                return HttpResponse(status=400)

        # keylevel_id is foreign-key which must exist in table KeyLevel
        key_level_id = request.POST.get('key_level_id')
        if key_level_id is not None:
            if KeyLevel.objects.filter(id=key_level_id).first() is None:
                return HttpResponse(status=400)

        Song.objects.create(
            name = name,
            artist = request.POST.get('artist'),
            genre_id = genre_id,
            key_level_id = key_level_id,
            key_min = request.POST.get('key_min'), #ttt
            key_freq_min = request.POST.get('key_freq_min'),  # ttt
            key_freq_max = request.POST.get('key_freq_max'),  # ttt
            key_max = request.POST.get('key_max'),  # ttt
            rank = request.POST.get('rank'),  #ttt
            link = request.POST.get('link'),
        )
        return redirect('app:main')


@csrf_exempt
def main_entry(request, song_id):
    # get specified song
    if request.method == 'GET':
        pass  # TODO only for API

    # delete specified song
    if request.method == 'DELETE':
        Song.objects.filter(id=song_id).delete()
        return redirect('app:main')

    # modify specified song
    if request.method == 'PATCH':
        pass

    # update or create specified song
    if request.method == 'PUT':
        pass  # TODO only for API

    return redirect('app:main')
