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
                    + 'onkeydown="TableTdInputOnKeyDown(this)" '
                    + 'value="'+$(obj).text()+'">'); // use current text as default value
        $($(obj)[0].nodeName + '> input').focus().blur(
            // listener which activates when the focus is lost
            function(){
                var inputVal = $(this).val();
                // if arrowEmpty==true OR inputted value is not empty
                if(arrowEmpty || inputVal){
                    // update text in html
                    $(obj).removeClass('input_mode_on').text(inputVal);
                    // update data in database
                    var data = {};
                    data[fieldName] = inputVal;
                    $.ajax({
                        type: 'PATCH',
                        url: path,
                        data: data,
                        async: true
                    });
                // if arrowEmpty==false AND inputted value is empty
                }else{
                    // reset default value
                    $(obj).removeClass('input_mode_on').text(this.defaultValue);
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
                    + 'onkeydown="TableTdInputOnKeyDown(this)" '
                    + 'value="'+$(obj).text()+'">'); // use current text as default value
        $($(obj)[0].nodeName + '> input').focus().blur(
            // listener which activates when the focus is lost
            function(){
                // check if inputted value is valid (exists in selective list OR empty)
                var inputVal = $(this).val();
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
                    // update text in html
                    $(obj).removeClass('select_mode_on').text(inputVal);
                    // update data in database
                    var data = {};
                    data[fieldName] = key;
                    $.ajax({
                        type: 'PATCH',
                        url: path,
                        data: data,
                        async: true
                    });
                }else{
                    // reset default value
                    $(obj).removeClass('select_mode_on').text(this.defaultValue);
                }
            }
        )
    }
}

/*
 * Return true if key is the key to drive switching to input/select mode (F2 / Space / I / A).
 * @param {Object} event - event object
 */
function IsKeyDriveModeOn(event){
    if(event.keyCode === 113 || event.keyCode === 32 || event.keyCode === 73 || event.keyCode === 65){
        return true;
    }
    return false;
}

/*
 * Return true if key is the key to drive switching to normal mode (Esc / Ctrl+[)
 * @param {Object} event - event object
 */
function IsKeyDriveModeOff(event){
    if(event.keyCode === 27 || event.ctrlKey && event.keyCode === 219){
        return true;
    }
    return false;
}
