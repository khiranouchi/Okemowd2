from django.db import models


class Genre(models.Model):
    # id primary_key [made automatically]
    name = models.CharField(max_length=16)

    def __str__(self):
        return self.name


class KeyLevel(models.Model):
    # id primary_key [made automatically]
    rank = models.IntegerField(unique=True)
    name = models.CharField(max_length=16)

    def __str__(self):
        return self.name


class Song(models.Model):
    # id primary_key [made automatically]
    name = models.CharField(max_length=64)
    artist = models.CharField(max_length=32, null=True)
    genre_id = models.ForeignKey(Genre, models.SET_NULL, db_index=True, null=True)
    key_level_id = models.ForeignKey(KeyLevel, models.SET_NULL, db_index=True, null=True)
    key_min = models.IntegerField(null=True)       # 0 corresponds to tone C4
    key_freq_min = models.IntegerField(null=True)  # "
    key_freq_max = models.IntegerField(null=True) # "
    key_max = models.IntegerField(null=True)      # "
    rank = models.IntegerField(null=True)  # 1,2,3,others
    link = models.TextField(null=True)
