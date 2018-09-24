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
    0: 'C', 1: 'C#', 2: 'D', 3: 'D#', 4: 'E', 5: 'F',
    6: 'F#', 7: 'G', 8: 'G#', 9: 'A', 10: 'A#', 11: 'B'
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


# trans integer value into key name (get '' if key does not exist)
# ...,-2,-1,0,1,2,...,12,13,... corresponds to tone ...,A#-1,B-1,C0,C#0,D0,...,C1,C#1,...
@register.filter
def get_key_name(key_int):
    if key_int is None:
        return ''
    ret = dict_pitch_name[int(key_int) % 12] + str(int(key_int) // 12)
    return ret


# get key_level rank by key_level id
@register.filter
def get_key_level_rank(key_level_id):
    try:
        key_level = KeyLevel.objects.get(id=key_level_id)
        return key_level.rank
    except KeyLevel.DoesNotExist:
        return 999

