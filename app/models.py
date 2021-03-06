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
    name_ruby = models.CharField(max_length=128)
    artist = models.CharField(max_length=32, null=True)
    genre = models.ForeignKey(Genre, models.SET_NULL, db_index=True, null=True)
    key_level = models.ForeignKey(KeyLevel, models.SET_NULL, db_index=True, null=True)
    key_min = models.IntegerField(null=True)       # 0 corresponds to tone lowlowA
    key_freq_min = models.IntegerField(null=True)  # "
    key_freq_max = models.IntegerField(null=True) # "
    key_max = models.IntegerField(null=True)      # "
    rank = models.IntegerField(null=True)  # 1,2,3,others
    link = models.TextField(null=True)
    note = models.TextField(null=True)
    check = models.BooleanField(default=False)

    def values(self):
        return [self.name, self.name_ruby, self.artist, self.genre_id, self.key_level_id,
                self.key_min, self.key_freq_min, self.key_freq_max, self.key_max, self.rank, self.link,
                self.note, self.check]

    @staticmethod
    def number_of_fields():
        return 13  # 13 is the number of fields!!!
