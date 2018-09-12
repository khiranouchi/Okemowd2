from django.shortcuts import render

def main(request):
    song_list = [  # kari
        { 'id': 1, 'name': 'name1', 'artist': 'artist1', 'genre': 3,'key_level': 4,
          'key_min': -8, 'key_freq_min': -3, 'key_freq_max': 13, 'key_max': 19, 'rank': 2, 'link': "url/html/xxx.yyy" },
        { 'id': 99, 'name': 'name99', 'genre': 0, 'key_level': 1, 'rank': 0 },
    ]

    d = {
        'song_list': song_list,
    }
    return render(request, 'main.html', d)
