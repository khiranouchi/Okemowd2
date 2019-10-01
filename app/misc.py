from django.template.defaulttags import register


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

# tone range
range_tone = range(0, 73)


# trans None into ''
@register.filter
def filter_none(item):
    if item is None:
        return ''
    return item


# trans None into string '' (for tablesorter's sortValue)
@register.filter
def filter_none_sv(item):
    if item is None:
        return "''"
    return item


# trans key into item of dictionary (get '' if key does not exist)
@register.filter
def get_item(dictionary, key):
    if key is None:
        return ''
    return dictionary.get(int(key))


# trans key into item of dictionary (get string '' if key does not exist) (for tablesorter's sortValue)
@register.filter
def get_item_sv(dictionary, key):
    if key is None:
        return "''"
    return dictionary.get(int(key))


# trans integer value into key name (get '' if key does not exist)
# ...,-1,0,1,2,...,12,13,... corresponds to tone ...,lowlowlowG#,lowlowA,lowlowA#,lowlowB,...,lowA,lowA#,...
@register.filter
def get_key_name(key_int):
    if key_int is None:
        return ''

    # calculate tone level name
    level = int(key_int) // 12
    if level <= 1:
        level_name = 'low' * (2 - level)
    elif level == 2:
        level_name = 'mid1'
    elif level == 3:
        level_name = 'mid2'
    else:
        level_name = 'hi' * (level - 3)

    ret = level_name + dict_pitch_name[int(key_int) % 12]
    return ret

