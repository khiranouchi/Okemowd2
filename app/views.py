from django.shortcuts import render, HttpResponse, reverse
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

        song = Song.objects.create(
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

        return HttpResponse(status=201, content_type='application/json', content='{"song_id":' + str(song.id) + '}')

    return HttpResponse(status=501)


@csrf_exempt
def main_entry(request, song_id):
    # get specified song
    if request.method == 'GET':
        song = {
            'id': song_id,
        }
        d = {
            'song': song,
            'path': reverse('app:main_entry', args=[song_id]),
        }
        return render(request, 'song_table_line.html', d)

    # delete specified song
    if request.method == 'DELETE':
        Song.objects.filter(id=song_id).delete()
        return HttpResponse(status=204)

    # modify specified song (update only columns specified)
    if request.method == 'PATCH':
        try:
            song = Song.objects.get(id=song_id)
        except song.DoesNotExist:
            return HttpResponse(status=404)
        for key, value in request.PATCH.items():
            # set None if value is empty
            if not value:
                value = None

            if key == 'name':
                song.name = value
            elif key == 'artist':
                song.artist = value
            elif key == 'genre_id':
                song.genre_id = value
            elif key == 'key_level_id':
                song.key_level_id = value
            elif key == 'key_min':
                song.key_min = value
            elif key == 'key_freq_min':
                song.key_freq_min = value
            elif key == 'key_freq_max':
                song.key_freq_max = value
            elif key == 'key_max':
                song.key_max = value
            elif key == 'rank':
                song.rank = value
            elif key == 'link':
                song.link = value
            song.save()

        return HttpResponse(status=204)

    # update or create specified song (update all columns)
    if request.method == 'PUT':
        pass  # TODO only for API

    return HttpResponse(status=501)
