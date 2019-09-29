/*****************************************************************************************************************/
/*** About Input-mode/Select-mode of Table Cell ******************************************************************/
/*****************************************************************************************************************/

/**
 * Switch normal-text(eg. <...>aaa</...>) and input-mode(eg. <...><input type="text" value="aaa"></...>).
 * Also send http request to PATCH modification of text.
 * Empty input is arrowed when arrowEmpty is true.
 * @param {Object} obj - object of the tag whose content you want to be switched
 * @param {String} path - url path to PATCH modification
 * @param {String} fieldName - field name to PATCH modification
 */
function SwitchInputMode(obj, path, fieldName, arrowEmpty=true){
    if(!$(obj).hasClass('input_mode_on')){
        $(obj).addClass('input_mode_on');
        $(obj).html('<input type="text" '
                    + 'onkeydown="InputOnKeyDown(this);InputMoveCell()" '
                    + 'value="'+$(obj).text()+'">'); // use current text as default value
        $($(obj)[0].nodeName + '> input').focus().select().blur(
            // listener which activates when the focus is lost
            function(){
                var inputVal = $(this).val();
                var defaultVal = this.defaultValue;
                // if arrowEmpty==true OR inputted value is not empty
                if(arrowEmpty || inputVal){
                    // update data in database
                    var data = {};
                    data[fieldName] = inputVal;
                    $.ajax({
                        type: 'PATCH',
                        url: path,
                        data: data,
                        async: true
                    }).done(function(){
                        // update text in html
                        $(obj).removeClass('input_mode_on').text(inputVal);
                        // update tablesorter
                        $(obj).closest('table').trigger('updateCell', [$(obj).closest('td'), false]); // [<object of td>, <if resort now>, <callback>]
                    }).fail(function(){
                        // reset default value
                        $(obj).removeClass('input_mode_on').text(defaultVal);
                    });
                // if arrowEmpty==false AND inputted value is empty
                }else{
                    // reset default value
                    $(obj).removeClass('input_mode_on').text(defaultVal);
                }
            }
        )
    }
}

/**
 * Switch normal-text(eg. <...>aaa</...>) and select-mode(eg. <...><input type="text" value="aaa"></...>).
 * Also send http request to PATCH modification of text.
 * Empty input is arrowed.
 * @param {Object} obj - object of the tag whose content you want to be switched
 * @param {String} path - url path to PATCH modification
 * @param {String} fieldName - field name to PATCH modification
 * @param {String} datalistTagId - id of tag of datalist to autocomplete input area
 */
function SwitchSelectMode(obj, path, fieldName, datalistTagId){
    if(!$(obj).hasClass('select_mode_on')){
        $(obj).addClass('select_mode_on');
        $(obj).html('<input type="text" '
                    + 'autocomplete="on" list=' + datalistTagId + ' '
                    + 'onkeydown="InputOnKeyDown(this);InputMoveCell()" '
                    + 'value="'+$(obj).text()+'">'); // use current text as default value
        $($(obj)[0].nodeName + '> input').focus().select().blur(
            // listener which activates when the focus is lost
            function(){
                // check if inputted value is valid (exists in selective list OR empty)
                var inputVal = $(this).val();
                var defaultVal = this.defaultValue;
                var found;
                var key;
                if(inputVal){ // if not empty
                    $.each($('#' + datalistTagId + ' > option'), function(i,val){
                        var tmp = $(val).val();
                        if(inputVal == tmp){
                            found = true;
                            key = $(val).attr('id');
                        }
                    })
                }else{ // if empty
                    found = true;
                    key = null;
                }
                // update value only if inputted value is valid
                if(found){
                    // update data in database
                    var data = {};
                    data[fieldName] = key;
                    $.ajax({
                        type: 'PATCH',
                        url: path,
                        data: data,
                        async: true
                    }).done(function(){
                        // update text in html
                        $(obj).removeClass('select_mode_on').text(inputVal);
                        // update tablesorter
                        $(obj).closest('table').trigger('updateCell', [$(obj).closest('td'), false]); // [<object of td>, <if resort now>, <callback>]
                    }).fail(function(){
                        // reset default value
                        $(obj).removeClass('select_mode_on').text(defaultVal);
                    });
                }else{
                    // reset default value
                    $(obj).removeClass('select_mode_on').text(defaultVal);
                }
            }
        )
    }
}

/**
 * Prevent default role of key.
 */
function PreventDefaultKey(keyCode){
    if(event.keyCode == keyCode){
        event.preventDefault();
    }
}

/**
 * Return true if key is the key to drive switching to input/select mode (F2 / Space / I / A).
 * @param {Object} event - event object
 */
function IsKeyDriveModeOn(event){
    if(event.keyCode === 113 || event.keyCode === 32 || event.keyCode === 73 || event.keyCode === 65){
        return true;
    }
    return false;
}

/**
 * Return true if key is the key to drive switching to normal mode (Esc / Ctrl+[)
 * @param {Object} event - event object
 */
function IsKeyDriveModeOff(event){
    if(event.keyCode === 27 || event.ctrlKey && event.keyCode === 219){
        return true;
    }
    return false;
}

/**
 * Move focus on table cell vertically when key is the key to drive that (Enter / Shift+Enter)
 * Used also in input-tag in SwitchInputMode()/SwitchSelectMode()
 */
function InputMoveCell(){
    if(event.keyCode === 13){
        var obj = event.target; // object currently focused
        obj.blur(); // (necessary when used in input-tag)
        obj = $(obj).closest("td"); // <td> object which contains object currently focused (x.closest() includes x itself)
        if(event.shiftKey){
            $("td", $(obj).parent().prevAll(':visible:first')).eq($(obj).index()).focus();
        }else{
            $("td", $(obj).parent().nextAll(':visible:first')).eq($(obj).index()).focus();
        }
    }
}

/**
 * Move focus on table cell vertically when key is the key to drive that (H / L / K / J)
 * Not used in input-tag in SwitchInputMode()/SwitchSelectMode()
 */
function InputMoveCellVim(){
    if(event.keyCode === 72 || event.keyCode === 76 || event.keyCode === 75 || event.keyCode === 74){
        var obj = event.target; // object currently focused
        obj = $(obj).closest("td"); // <td> object which contains object currently focused (x.closest() includes x itself)
        if(event.keyCode === 72){
            $(obj).prevAll(':visible:first').focus();
        }else if(event.keyCode === 76){
            $(obj).nextAll(':visible:first').focus();
        }else if(event.keyCode === 75){
            $("td", $(obj).parent().prevAll(':visible:first')).eq($(obj).index()).focus();
        }else{
            $("td", $(obj).parent().nextAll(':visible:first')).eq($(obj).index()).focus();
        }
    }
}

/**
 * Function used in input-tag in SwitchInputMode()/SwitchSelectMode()
 * @param {Object} obj - object of input-tag
 */
function InputOnKeyDown(obj){
    if(IsKeyDriveModeOff(event)){
        var parent = $(obj).parents('td');
        obj.blur();
        parent.focus();
    }
    event.stopPropagation();
}



/*****************************************************************************************************************/
/*** About Insert/Delete of Table Line ***************************************************************************/
/*****************************************************************************************************************/

/**
 * Delete one song (one table line).
 * Also send http request to DELETE the song.
 * @param {Object} obj - child object of the tr-object which you want to be deleted
 * @param {String} path - url path to DELETE
 */
function DeleteSong(obj, path){
    // delete data in database
    $.ajax({
        type: 'DELETE',
        url: path,
        async: true
    }).done(function(){
        // delete table line in html
        $(obj).closest("tr").remove();
        // update tablesorter (if not do this, reappear deleted rows when sort)
        $('#table_song_list').trigger('update');
    });
}

/**
 * Insert one empty song (one table line).
 * Also send http request to Post new song.
 * @param {Object} tableId - id of the table in which you want to insert line
 * @param {String} path - url path to POST
 */
function InsertSong(tableId, path){
    var songId;
    // insert data in database and get song-id
    $.ajax({
        type: 'POST',
        url: path,
        data: {'name': '(new_song)', 'name_ruby': '(new_song)'},
        async: true
    }).done(function(content){
        var row = $(content);
        // insert table line in html
        $('#' + tableId + ' tbody').append(row);
        $('#button_insert_error_message').html('');
        // update tablesorter
        $('#' + tableId).trigger('addRows', [row, false]); // [<object of added tr>, <if resort now>]
    }).fail(function(jqXHR, textStatus, errorThrown){
        $('#button_insert_error_message').html('failed');
	});
}



/*****************************************************************************************************************/
/*** About Filter Table Column/Row *******************************************************************************/
/*****************************************************************************************************************/

/**
 * Switch visibility of table column.
 * Also send http request to save visibility state in cookie (when path is not null).
 * @param {Boolean} isSwitchOn - true: make visible / false: make invisible
 * @param {String} targetColumnClass - class of column(td) which you want to switch visibility
 * @param {String} path - url path to POST
 * @param {String} targetColumnKey - key of column (for cookie)
 */
function FilterVisibleColumn(isSwitchOn, targetColumnClass, path=null, targetColumnKey=null){
    var data = {};
    if(isSwitchOn){
        $('.' + targetColumnClass).css('display', 'table-cell');
        data[targetColumnKey] = 1;
    }else{
        $('.' + targetColumnClass).css('display', 'none');
        data[targetColumnKey] = 0;
    }
    // save visibility state of target column in cookie
    if(path){
        $.ajax({
            type: 'POST',
            url: path,
            data: data,
            async: true
        })
    }
}

/**
 * Switch visibility of table row.
 * Support multiple filter(reason) to manage visibility (by switching visibility with adding/removing class).
 * @param {Boolean} isSwitchOn - true: make visible / false: make invisible
 * @param {String} targetRowClass - class of row(tr) which you want to switch visibility
 * @param {String} reasonClass - class to distinguish multiple filter(reason)
 */
function FilterVisibleRow(isSwitchOn, targetRowClass, reasonClass){
    if(isSwitchOn){
        $('.' + targetRowClass).removeClass(reasonClass);
    }else{
        $('.' + targetRowClass).addClass(reasonClass);
    }
}
