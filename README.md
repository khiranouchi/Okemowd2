Karaoke Song Management System
============
Website: COMING SOON <br>
Web Application. <br>
You can make song list
and keep song name, artist name, genre, minimum key, maximum key and so on. <br>
You can manage your song list both by html page and by http API.

Requirements
--------
+ Python  3.6.1
+ Django  2.1.1

Install and Run
--------

Install Django with

    pip install django

Make migration with

    python manage.py makemigrations
    python manage.py migrate

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
| ***name_ruby*** | string | song name ruby | less than 129 characters |
| ***artist*** | string | artist name | less than 33 characters |
| ***genre_id*** | integer | genre | must be in the database table "Genre" |
| ***key_level_id*** | integer | type of tone height | must be in the database table "KeyLevel" |
| ***key_min*** | integer | lowest tone's key | 0 corresponds to tone lowlowA |
| ***key_freq_min*** | integer | frequently appeared lowest tone's key | 0 corresponds to tone lowlowA |
| ***key_freq_max*** | integer | frequently appeared highest tone's key | 0 corresponds to tone lowlowA |
| ***key_max*** | integer | highest tone's key | 0 corresponds to tone lowlowA |
| ***rank*** | integer | rank | 1(A) or 2(B) or 3(C) |
| ***link*** | string | link to music or movie | |

***name*** and ***name_ruby*** are neccessary. <br>
Fields can be too few or too many in CSV format.

### Page

**Keyboard Shortcuts**

|Key |Function |
|---|---|
| *Tab* / *L* | Move to the next cell (horizontally) |
| *Shift+Tab* / *H* | Move to the previous cell (horizontally) |
| *Enter* / *J* | Move to the next cell (vertically) |
| *Shift+Enter* / *K* | Move to the previous cell (vertically) |
| *F2* / *Space* / *I* / *A* | Start input-mode of cell |
| *Esc* / *Ctrl+[* | End input-mode of cell |

(The others are TODO)

Dependency
--------
+ tablesorter
  - Copyright (c) 2014 Christian Bach
  - Released under the MIT license
  - https://github.com/christianbach/tablesorter/blob/master/LICENSE
