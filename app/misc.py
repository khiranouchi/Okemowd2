from django.template.defaulttags import register

from .models import KeyLevel


# rank name
dict_rank_name = {
    1: 'A',
    2: 'B',
    3: 'C',
}

# pitch name
dict_pitch_name = {
    0: 'A', 1: 'A#', 2: 'B', 3: 'C', 4: 'C#', 5: 'D',
    6: 'D#', 7: 'E', 8: 'F', 9: 'F#', 10: 'G', 11: 'G#'
}


# trans None into ''
@register.filter
def filter_none(item):
    if item is None:
        return ''
    return item


# trans None into -999 (item should be int)
@register.filter
def filter_none_min(item_int):
    if item_int is None:
        return -999
    return item_int


# trans key into item of dictionary (get '' if key does not exist)
@register.filter
def get_item(dictionary, key):
    if key is None:
        return ''
    return dictionary.get(int(key))


# trans key into item of dictionary (get -999 if key does not exist)
@register.filter
def get_item_int(dictionary, key):
    if key is None:
        return 999
    return dictionary.get(int(key))


# trans integer value into key name (get '' if key does not exist)
# ...,-2,-1,0,1,2,...,12,13,... corresponds to tone ...,G-1,G#-1,A0,A#0,B0,...,A1,A#1,...
@register.filter
def get_key_name(key_int):
    if key_int is None:
        return ''
    ret = dict_pitch_name[int(key_int) % 12] + str(int(key_int) // 12)
    return ret

