from django.template.defaulttags import register


# rank name
dict_rank_name = {
    1: 'S',
    2: 'A',
    3: 'B',
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


# trans key into item of dictionary (get '' if key does not exist)
@register.filter
def get_item(dictionary, key):
    item = dictionary.get(key)
    return filter_none(item)


# trans integer value into key name (get '' if key does not exist)
# ...,-2,-1,0,1,2,...,12,13,... corresponds to tone ...,A#-1,B-1,C0,C#0,D0,...,C1,C#1,...
@register.filter
def get_key_name(key_int):
    if key_int is None:
        return ''
    ret = dict_pitch_name[key_int % 12] + str(key_int // 12)
    return ret
