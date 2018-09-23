import csv

from django.shortcuts import render, HttpResponse, reverse
from django.views.decorators.csrf import csrf_exempt

from .models import Genre, KeyLevel, Song
from .misc import *


@csrf_exempt
def main(request):
    # get all song
    if request.method == 'GET':
        if request.META.get('HTTP_ACCEPT') == 'text/csv':
            response = HttpResponse(content_type='text/csv')
            writer = csv.writer(response)
            for song in Song.objects.all():
                writer.writerow(song.values())
            return response
        else:
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
            try:
                Genre.objects.get(id=genre_id)
            except Genre.DoesNotExist:
                return HttpResponse(status=400)

        # keylevel_id is foreign-key which must exist in table KeyLevel
        key_level_id = request.POST.get('key_level_id')
        if key_level_id is not None:
            try:
                KeyLevel.objects.get(id=key_level_id)
            except KeyLevel.DoesNotExist:
                return HttpResponse(status=400)

        song = Song.objects.create(
            name = name,
            artist = request.POST.get('artist'),
            genre_id = genre_id,
            key_level_id = key_level_id,
            key_min = request.POST.get('key_min'),
            key_freq_min = request.POST.get('key_freq_min'),
            key_freq_max = request.POST.get('key_freq_max'),
            key_max = request.POST.get('key_max'),
            rank = request.POST.get('rank'),
            link = request.POST.get('link'),
        )

        song_list = [song]
        path_list = reverse('app:main_entry', args=[song.id])
        d = {
            'song_and_path_list': zip(song_list, path_list),
            'dict_rank_name': dict_rank_name,
        }
        return render(request, 'song_table_line.html', d, status=201)

    return HttpResponse(status=501)


@csrf_exempt
def main_entry(request, song_id):
    # get specified song
    if request.method == 'GET':
        try:
            song = Song.objects.get(id=song_id)
        except Song.DoesNotExist:
            return HttpResponse(status=404)
        song_list = [song]
        path_list = [reverse('app:main_entry', args=[song.id])]
        d = {
            'song_and_path_list': zip(song_list, path_list),
            'dict_rank_name': dict_rank_name,
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
        except Song.DoesNotExist:
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


@csrf_exempt
def main_io(request):
    if request.method == 'GET':
        d = {
            'path': reverse('app:main'),
        }
        return render(request, 'io.html', d)

    return HttpResponse(status=501)
