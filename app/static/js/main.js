/*****************************************************************************************************************/
/*** About PATCH of Table Cell ***********************************************************************************/
/*****************************************************************************************************************/

/**
 * Switch cell data within specified list by changing class of specified tag.
 * Also send http request to PATCH modification of text.
 * @param {Object} obj - object of the tag whose class you want to change
 * @param {String} path - url path to PATCH modification
 * @param {String} fieldName - field name to PATCH modification
 * @param {Object} valueList - list of values used in PATCH
 * @param {Object} classList - list of classes used in html
 * @param {Object} callback - callback function called after input-mode is finished successfully (arg1: obj, arg2: value, arg3: null, arg4-: args)
 * @param {Object} args - arguments (2nd args and later) of callback function (rest parameters)
 */
function SwitchCellClass(obj, path, fieldName, valueList, classList, callback, ...args){
    $.each(classList, function(i,v){
        if($(obj).hasClass(v)){
            var idx_next = (i + 1) % classList.length;
            // update data in database
            var data = {};
            data[fieldName] = valueList[idx_next];
            $.ajax({
                type: 'PATCH',
                url: path,
                data: data,
                async: true
            }).done(function(){
                // update data in html
                $(obj).removeClass(classList[i]);
                $(obj).addClass(classList[idx_next]);
                // call callback function at the end
                callback(obj, valueList[idx_next], null, args);
            }).fail(function(){
            });
            // break loop
            return false;
        }
    });
}



/*****************************************************************************************************************/
/*** About Input-mode/Select-mode of Table Cell (About PATCH) ****************************************************/
/*****************************************************************************************************************/

/**
 * Switch normal-text(eg. <...>aaa</...>) and input-mode(eg. <...><input type="text" value="aaa"></...>).
 * Also send http request to PATCH modification of text.
 * Empty input is arrowed when arrowEmpty is true.
 * @param {Object} obj - object of the tag whose content you want to be switched
 * @param {String} path - url path to PATCH modification
 * @param {String} fieldName - field name to PATCH modification
 * @param {Boolean} arrowEmpty - if empty input is arrowed or not
 * @param {Object} callback - callback function called after input-mode is finished successfully (arg1: obj, arg2: null, arg3: inputVal, arg4-: args)
 * @param {Object} args - arguments (2nd args and later) of callback function (rest parameters)
 */
function SwitchInputMode(obj, path, fieldName, arrowEmpty, callback, ...args){
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
                        // call callback function at the end
                        callback(obj, null, inputVal, args);
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
 * @param {Object} callback - callback function called after select-mode is finished successfully (arg1: obj, arg2: key, arg3: inputVal, arg4-: args)
 * @param {Object} args - arguments (2nd args and later) of callback function (rest parameters)
 */
function SwitchSelectMode(obj, path, fieldName, datalistTagId, callback, ...args){
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
                        // call callback function at the end
                        callback(obj, key, inputVal, args);
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
 * @param {Object} callback - callback function called after song is deleted successfully
 */
function DeleteSong(obj, path, callback){
    // delete data in database
    $.ajax({
        type: 'DELETE',
        url: path,
        async: true
    }).done(function(){
        // delete table line in html
        $(obj).closest("tr").remove();
        // call callback function at the end
        callback();
    });
}

/**
 * Insert one empty song (one table line).
 * Also send http request to Post new song.
 * @param {Object} tableId - id of the table in which you want to insert line
 * @param {String} path - url path to POST
 * @param {Object} callback - callback function called after song is inserted successfully (arg: inserted row)
 */
function InsertSong(tableId, path, callback){
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
        // call callback function at the end
        callback(row);
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



/*****************************************************************************************************************/
/*** About row selection & scroll control ************************************************************************/
/*****************************************************************************************************************/

/**
 * Select row.
 * Select specified row & deselect current selected row if exist.
 * Deselect specified row when the row is already selected.
 * @param {Object} obj - tr-object which you want to be selected
 */
function SelectRow(obj){
    if(!$(obj).hasClass('z-tr-selected')){
        $(obj).closest('table').find('tr.z-tr-selected').removeClass('z-tr-selected');
        $(obj).addClass('z-tr-selected');
    }else{
        $(obj).removeClass('z-tr-selected');
    }
}

/**
 * Select row when key is the key to drive that (V)
 * @param {Object} obj - tr-object which you want to be selected
 */
function InputSelectRow(obj){
    if(event.keyCode === 86){
        SelectRow(obj);
    }
}
