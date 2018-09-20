/**
 * Switch normal-text(eg. <...>aaa</...>) and input-mode(eg. <...><input type="text" value="aaa"></...>).
 * Also send http request to PATCH modification of text.
 * @param {Object} obj - object of the tag whose content you want to be switched
 * @param {String} path - url path to PATCH modification
 * @param {String} fieldName - field name to PATCH modification
 */
function SwitchInputMode(obj, path, fieldName){
    if(!$(obj).hasClass('input_mode_on')){
        $(obj).addClass('input_mode_on');
        $(obj).html('<input type="text" value="'+$(obj).text()+'">'); // use current text as default value
        $($(obj)[0].nodeName + '> input').focus().blur(
            // listener which activates when the focus is lost
            function(){
                var inputVal = $(this).val();
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
            }
        )
    }
}
