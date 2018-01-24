
exports.activationGroup = "*CALLER";

function puiuplexit(fileInfo, allow, errorMsg) {
    pjs.define("fileInfo", { type: 'data structure', likeDS: 'fileinfo_t', refParm: fileInfo });
    pjs.define("allow", { type: 'integer', length: 5, decimals: 0, refParm: allow });
    pjs.define("errorMsg", { type: 'char', length: 256, refParm: errorMsg });

    // *********************************************************************************************
    // *
    // Description: Profound UI File Upload Widget Exit Program                                 *
    // *
    // Usage notes:                                                                *
    // *
    // See documentation here:                                                     *
    // *
    // http://www.profoundlogic.com/docs/display/PUI/Security                      *
    // *
    // The original copy of this source member in the product installation library *
    // should NOT be used directly, as this will be replaced on each update to     *
    // Profound UI.                                                                *
    // *
    // Instead, you should copy the source member to a source file in another      *
    // library and work from there.                                                *
    // *
    // Compile as PUIUPLEXIT in Profound UI product library using CRTBNDRPG.       *
    // *
    // Your compiled program object will NEVER be replaced by Profound UI update.  *
    // *
    // *********************************************************************************************

    // DS template for FileInfo parameter.
    pjs.define("fileinfo_t", {
        type: 'data structure', qualified: true, based: 'Template', elements: {
            "widgetId": { type: 'char', length: 256 },
            "directory": { type: 'char', length: 256 },
            "name": { type: 'char', length: 256 },
            "type": { type: 'char', length: 256 },
            "size": { type: 'unsigned integer' },
            "exists": { type: 'boolean' }
        }
    });

    // Do not change the prototype.

    // Do not change the procedure interface.

    // The current user can be retrieved this way.
    pjs.define("psds", {
        type: 'data structure', qualified: true, statusDS: true, elements: {
            "currentUser": { type: 'char', from: 358, to: 367 }
        }
    });


    // console.log(fileInfo);
    // console.log(fileinfo_t);
    // For example...

    // 1. Allow only plain text files up to 10MB...

    // 2. Allow writing files only into /tmp, do not overwrite
    // existing files.

    allow = 0;

    //if ((fileInfo.type).rtrim() === 'text/plain' && fileInfo.size <= 10485760) {
    //
    //  if ((fileInfo.directory).rtrim() === '/tmp') {
    //
    //    allow = 1;
    //  }
    //}
    //else if (((fileInfo.type).substr(0, 10)).rtrim() === 'image/jpeg') {

    allow = 1;
    //}

    flags["LR"] = true;
}

exports.run = puiuplexit;

exports.parms = [
    { type: 'data structure', likeDS: 'fileinfo_t' },
    { type: 'integer', length: 5, decimals: 0 },
    { type: 'char', length: 256 }
]
