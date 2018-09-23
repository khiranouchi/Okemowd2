
def get_constants(request):
    return {
        'STR_SONG_PROPERTY': {
            'ID': '',
            'NAME': 'Song Title',
            'ARTIST': 'Artist',
            'GENRE': 'Genre',
            'KEY_LEVEL': 'Key Level',
            'KEY_MIN': 'Lowest',
            'KEY_FREQ_MIN': 'Lowest(freq)',
            'KEY_FREQ_MAX': 'Highest(freq)',
            'KEY_MAX': 'Highest',
            'RANK': 'Rank',
            'LINK': 'Sound Link',
        },
        'STR_BUTTON_LABEL': {
            'ADD_EMPTY_SONG': 'Add Song',
            'IMPORT_AND_EXPORT': 'Import and Export',
            'IMPORT_APPEND': 'Import(Append)',
            'IMPORT_REPLACE': 'Import(Replace)',
            'EXPORT': 'Export',
            'IMPORT_APPEND_SUBMIT': 'Append',
            'IMPORT_REPLACE_SUBMIT': 'Replace',
            'EXPORT_COPY': 'Copy',
        }
    }
