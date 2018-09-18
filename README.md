Karaoke Song Management System
============
You can make song list.
(Detail is TODO)

Requirements
--------
+ Python  3.6.1
+ Django  2.1.1

Install and Run
--------
### Django

Install Django with

    pip install django

Run server with

    python manage.py runserver

and access to `http://localhost:8000/main/`

Usage
--------
### API

**Methods**

|Method |Path |Role |
|---|---|---|
| POST | /main/ | create song |
| GET | /main/ | read all songs |
| PATCH | /main/*song_id*/ | modify specified song |
| DELETE | /main/*song_id*/ | delete specified song |

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




