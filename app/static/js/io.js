/**
 * Switch I/O Mode: Import(Append) / Import(Replace) / Export.
 * Change active button and visible elements.
 * @param {Object} obj - object of the switch-button into whose mode you want to be switched
 */
function SwitchIoMode(obj){
    var activeId = $(obj).attr('id');
    var activeClass = $(obj).attr('name');
    // change active button
    $('#' + activeId).siblings().removeClass('active');
    $('#' + activeId).addClass('active');
    // change visible textarea and submit/copy button
    $('.' + activeClass).siblings().hide();
    $('.' + activeClass).show();
}
