Karaoke Song Management System
============
You can make song list.
(Detail is TODO)

Requirements
--------
+ Python  3.6.1
+ Django  2.1.1
+ django-method-override  1.0.3

Install and Run
--------

Install Django and django-method-override with

    pip install django
    pip install django-method-override

Run server with

    python manage.py runserver

and access to `http://localhost:8000/main/`

Usage
--------
### API

**Methods**

|Method |Path |Role |Type(Request) |Type(Response)
|---|---|---|---|---|
| POST | /main/ | create song | 'text/csv' or normal | others |
| GET | /main/ | read all songs | - | 'text/csv' or others |
| DELETE | /main/ | delete all songs | - | (no content) |
| GET | /main/*song_id*/ | read specified song | - | others |
| PATCH | /main/*song_id*/ | modify specified song | normal | (no content) |
| DELETE | /main/*song_id*/ | delete specified song | - | (no content) |

(The others are TODO)

**Fields**

|Field name |Type |Detail |Rule |
|---|---|---|---|
| ***name*** | string | song name | less than 65 characters |
| ***artist*** | string | artist name | less than 33 characters |
| ***genre_id*** | integer | genre | must be in the database table "Genre" |
| ***key_level_id*** | integer | type of tone height | must be in the database table "KeyLevel" |
| ***key_min*** | integer | lowest tone's key | 0 corresponds to tone C0 |
| ***key_freq_min*** | integer | frequently appeared lowest tone's key | 0 corresponds to tone C0 |
| ***key_freq_max*** | integer | frequently appeared highest tone's key | 0 corresponds to tone C0 |
| ***key_max*** | integer | highest tone's key | 0 corresponds to tone C0 |
| ***rank*** | integer | rank | 1(A) or 2(B) or 3(C) |
| ***link*** | string | link to music or movie | |

Song name is neccessary. <br>
Fields can be too few or too many in CSV format.

### Page

**Keyboard Shortcuts**

|Key |Function |
|---|---|
| *Tab* | Move to the next cell |
| *Shift+Tab* | Move to the previos cell |
| *F2* / *Space* / *I* / *A* | Start input-mode of cell |
| *Esc* / *Ctrl+[* | End input-mode of cell |

(The others are TODO)



