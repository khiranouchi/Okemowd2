/**
 * Show check dialog.
 * Return false if not confirmed.
 */
function ShowCheckDialogRet(message="Do you really submit?", message2=null) {
    if (!confirm(message)) {
        return false;
    } else if (message2 && !confirm(message2)) {
        return false;
    }
    return true;
}
