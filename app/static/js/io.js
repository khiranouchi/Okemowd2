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

/**
 * Load csv of export textarea by sending http request to GET all song data.
 * @param {String} textareaId - id of the export textarea
 * @param {String} path - url path to GET
 */
function LoadExportCsv(textareaId, path){
    $.ajax({
        type: 'GET',
        url: path,
        headers: { Accept: "text/csv" },
        async: true
    }).done(function(content){
        $('#' + textareaId).val(content);
    }).fail(function(jqXHR, textStatus, errorThrown){
        $('#' + textareaId).val('Failed loading.');
	});
}

/**
 * POST multiple songs from imported csv.
 * If trunc is true, DELETE all existing songs before POST. <- TODO
 * @param {String} textareaId - id of the import textarea
 * @param {String} path - url path to POST
 * trunc <- TODO
 */
function SaveImportCsv(textareaId, path, trunc=false){
    $.ajax({
        type: 'POST',
        url: path,
        headers: { 'Content-Type': "text/csv" },
        data: $('#' + textareaId).val(),
        async: true
    }).done(function(content){
        $('#button_submit_error_message').html('succeed');
    }).fail(function(jqXHR, textStatus, errorThrown){
        $('#button_submit_error_message').html('failed');
	});
}
