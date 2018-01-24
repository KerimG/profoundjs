var context = "dspf";

if (!pui.fileUploadElements) pui.fileUploadElements = [];
if (window.context) context = window.context;

pui.widgets.add({
    /* Field type name of the widget. Must match the "widget" property in designer/Toolbox.js. */
    name: "file upload vog",
    /* Prefix for the id property of a newly added file upload widget; e.g. "FileUploadDND1" becomes the id. */
    newId: "FileUploadVOG",
    /* Appears atop the Properties menu when a widget of this type is selected. */
    menuName: "File Upload vog",
    defaults: {
        /* Default properties for a newly added widget of type "file upload vog". */
        width: "300px",
        height: "252px",
        /* Use the same CSS as "file upload" widget. */
        "css class": "pui-file-upload",
        "size limit": "10",
        "number of files": "1",
        "overwrite files": "false"
    },
	/* Property-setter functions are called when the named property is set or
	 * removed. Each are also called when the page loads or is refreshed ONLY IF
	 * the property is set (unless noted otherwise below).
	 * 
	 * The parameter, parms.design, is true when the page is Visual Designer
	 * and when design mode is On for Genie.
	 * 
	 * I put validation code in the setter functions instead of these handlers. MD.
	 */
    propertySetters: {
        /* The "field type" function calls the widget constructor and render(). */
        "field type": function (parms) {
            parms.dom.innerHTML = '<form class="dropzone"></form>'
            // parms.dom.innerHTML = '<div class="dropzone" id="#my-awesome-dropzone"></div>';            
            // var one = new Dropzone("div.dropzone", { url: "../cgi/newUploader.exe" });

            if (parms.dom["fileUploadVOG"] == null) {

                parms.dom["fileUploadVOG"] = new pui["fileUploadVOG"].FileUpload(parms.dom);
                if (context == "dspf") pui.fileUploadElements.push(parms.dom["fileUploadVOG"]);

            }
        },
        //end field type.

        "auto submit": function (parms) {
            if (parms.design)
                return;
            parms.dom["fileUpload"].setAutoSubmit(parms.value);
        },
        "auto upload": function (parms) {
            if (parms.design)
                return;
            parms.dom["fileUpload"].setAutoUpload(parms.value);
        },
        "number of files": function (parms) {
            if (parms.design)
                return;
            parms.dom["fileUpload"].setFileLimit(parseInt(parms.value, 10));
        },
        "size limit": function (parms) {
            if (parms.design)
                return;
            parms.dom["fileUpload"].setSizeLimit(parseInt(parms.value, 10));
        },
        "target directory": function (parms) {
            if (parms.design)
                return;
            parms.dom["fileUpload"].setTargetDirectory(trim(parms.value));
        },
        "rename to": function (parms) {
            if (parms.design)
                return;
            parms.dom["fileUpload"].setAltName(trim(parms.value));
        },
        "overwrite files": function (parms) {
            if (parms.design)
                return;
            parms.dom["fileUpload"].setOverwrite(parms.value);
        },
        "onupload": function (parms) {
            if (parms.design)
                return;
            parms.dom["fileUpload"].setUploadEvent(parms.newValue);
        },
        // Only called when property is set or removed.
        "disabled": function (parms) {
            if (parms.design)
                return;
            parms.dom["fileUpload"].setDisabled(parms.value);
        }
    }
}); //end of call to pui.widgets.add().


pui.addCustomProperty({
    // property name
    name: "uploaded",

    // optional type of input
    // "long" specifies that the text can be long, and an exta text area prompt box is added
    // other types include: "color", "boolean", "image", "list", "js", "file", and "field"
    type: "boolean",

    // help text appears at the bottom of the properties window
    help: "Specifies the full address to be mapped within Google Maps.",

    // array of widget elements that this property is applicable to
    controls: ["file upload vog"],

    // properties are categorized in the properties window
    // if the specified category doesn't already exist, it will be created
    category: "Field Settings"
});

pui.toolbox.add({
    category: "Custom Widgets",
    widget: "file upload vog",
    text: "File Upload (VOG)",
    icon: "/profoundui/proddata/images/icons/page_white_get.png",
    cls: "widget-node",
    proxyHeight: 252,
    proxyWidth: 300,
    proxyHTML: '<img src="/profoundui/proddata/images/fileuploadDND.png" style="height: 252px; width: 300px;">',
    leaf: true,
    defaults: {}
});


pui["fileUploadVOG"] = {};

pui["fileUploadVOG"].FileUpload = function (container) {
    Dropzone.autoDiscover = false;
    var me = this;

    var containerId = '#' + container.getAttribute('id');
    var dropzoneForm = 'div' + containerId + ' > .dropzone';
    var submitHandle = null; // Gets a numeric timer id after a submit. Null when not uploading.


    //
    // These are user-modifiable widget properties.
    //
    var autoSubmit = false;     // DSPF only.
    var autoUpload = false;     // Genie only.
    var disabled = false;
    var fileLimit = 1;
    var sizeLimit = 10;
    var targetDirectory = "";
    var altName = "";
    var overwrite = false;
    var allowedTypes = []; // List of accepted MIME file types.
    var sizeLimit = 10;

    // create dropzone area
    this.dropzone = new Dropzone(dropzoneForm, {
        url: '/',
        dictDefaultMessage: "Drop Images or Click here to upload<br><small>2MB of filesize used.</small>",
        uploadMultiple: true,
        parallelUploads: 100,
        maxFilesize: 10,
        maxFiles: 2,
        autoProcessQueue: false,
        headers: {
            'Content-Type': '*/*',
            'Content-type': 'application/x-www-form-urlencoded'
        },
        init: function () {
            //append the data in the formData object.
            this.on("sending", function (file, xhr, formData, e) {
                formData.append('flimit', 1);
                formData.append('slimit', 1);
                formData.append('dir', '/');
                formData.append('overwrite', (overwrite ? "1" : "0"));
                formData.append('file', file);
            });
        }
    });

    /**
	 * this.upload() is called by pui.processUpload() after user clicked a
	 * bound button. If we dropped in files prior to the click, then the
	 * filenames should still be with us. So pui.checkUploads() will send our
	 * data back to the RPG program.
	 * 
	 * @returns {undefined}
	 */
    this.upload = function () {
        var postAction = window.getProgramURL("PUI0009109.PGM");;

        var postURL = postAction + "?AUTH=";

        if (pui["appJob"] && pui["appJob"]["auth"]) {
            postURL += encodeURIComponent(pui["appJob"]["auth"]);
        }

        postURL += "&id=" + encodeURIComponent(containerId);

        console.log('Post URL', postURL)
        console.log('Processing Dropzone Queue', me.dropzone);
        me.dropzone.options.url = postURL;
        me.dropzone.processQueue();
    }

    this.isSubmitting = function () {
        return true;
    }


    /**************************************************************************/
    // Property change handlers. Called upon property change, page load, or 
    // explicitly inside the object.
    this.setAutoSubmit = function (autosub) {
        autoSubmit = (autosub === true || autosub === "true");
    };

    this.setAutoUpload = function (autoup) {
        autoUpload = (autoup === true || autoup === "true");
    };

    this.setFileLimit = function (newLimit) {
        if (newLimit !== null && !isNaN(newLimit)) {
            fileLimit = newLimit;
        }
    };
    this.setSizeLimit = function (newLimit) {
        if (newLimit !== null && !isNaN(newLimit)) {
            sizeLimit = newLimit;
        }
    };

    this.setTargetDirectory = function (value) {
        if (typeof (value) === "string") {
            targetDirectory = value;
            if (targetDirectory.length > 1 && targetDirectory.charAt(targetDirectory.length - 1) === "/") {
                targetDirectory = targetDirectory.substr(0, targetDirectory.length - 1);
            }
        }
    };
    this.setAltName = function (value) {
        if (typeof (value) === "string") {
            altName = value;
        }
    };
    this.setDisabled = function (state) {
        disabled = (state === "true" || state === true);
    };
    this.setOverwrite = function (value) {
        if (value === "true" || value === true) {
            overwrite = value;
        }
    };
    this.setUploadEvent = function (value) {
        uploadEvent = value;
    };
    this.setAllowedTypes = function (types) {
        if (types && types.constructor && types.constructor.toString().indexOf("function Array") !== -1) {
            allowedTypes = types;
        }
    };

    /**************************************************************************/
    //
    // Property fetching methods.
    //

    // Return the targetDirectory.
    this.getTargetDirectory = function () {
        return targetDirectory;
    };

    // Returns an array containing names from selected File objects.
    this.getFileNames = function () {
        var names = [];
        for (var i = 0; i < selectors.length; i++) {
            names.push(selectors[i].name);
        }
        return names;
    };

	/**
	 * Return the number of files dragged into the widget ready for upload.
	 * 
	 * @returns {Number}
	 */
    this.getCount = function () {
        return selectors.length;
    };

    // Return whether 
    this.isSubmitting = function () {
        return (submitHandle !== null);
    };
    this.getError = function () {
        return error;
    };
    this.getId = function () {
        return mainBox.id;
    };
    //
    // These two validation methods must exist because render.js calls them.
    // They aren't used anywhere else in this file, because validation happens
    // on drop instead of on page submit.
    //
    this.validateCount = function () {
        if (this.getCount() > fileLimit) {
            return pui["getLanguageText"]("runtimeMsg", "upload file limit", [fileLimit]);
        }
    };

    this.validateNames = function () {
        var arr = this.getFileNames();
        var used = {};
        for (var i = 0; i < arr.length; i++) {
            if (typeof (used[arr[i]]) !== "undefined") {
                return pui["getLanguageText"]("runtimeMsg", "upload duplicate file");
            }
            used[arr[i]] = true;
        }
    };

    /**
	 * Handle a completed upload. Clear the timeout.
	 * Populate this.error, if necessary.
	 * 
	 * Note: this declaration no longer needs to be this["completeTransaction"]
	 * because it is only called by this widget code, not some external AJAX 
	 * javascript.
	 * 
	 * @param {type} id
	 * @param {Object} responseObj  An object parsed by xhronload().
	 * @returns {undefined}
	 */
    this.completeTransaction = function (id, responseObj) {
        // Quit if no current submit or if transaction id is not current.
        // This indicates completion of transaction that has already been aborted. 
        if (submitHandle === null || id !== transactionId) {
            return;
        }
        clearTimeout(submitHandle);
        abortLink.style.visibility = "hidden";

        if (!responseObj["success"]) {
            if (responseObj["key"]) {
                responseObj["error"] = pui["getLanguageText"]("runtimeMsg", "upload " + responseObj["key"]);
            }
            error = responseObj["error"];
            if (responseObj["key"] === "file limit")
                error = error.replace("&1", fileLimit);
            if (responseObj["key"] === "size limit")
                error = error.replace("&1", sizeLimit);

            // Show the error. for non auto-submit widgets, nothing else will
            // cause the error to appear.
            if (context !== "genie" && !autoSubmit) {
                showError(error);
            }
        }
        else //success.
        {
            // Mark all selectors as done.
            for (var i = 0; i < selectors.length; i++) {
                selectors[i].done = true;
            }
        }

        // Redraw so the table shows success next to each file; otherwise error.
        me.render();
        clearLink.style.display = ""; // show the Clear link.

        submitHandle = null;
        transactionId++;
        if (context === "genie") {
            pui.submitLog(pui.genie.formSubmitted = false);
            pui.hideWaitAnimation(true);
            // Finish here for Genie. 
            // For Rich UI, the result is checked in the 
            // main screen submit processing.
            if (responseObj["success"]) {
                this.doUploadEvent();
            } else {
                showError(responseObj["error"]);
            }
        }
    };
    // end completeTransaction().


	/**
	 * Handle ther user-defined code from the onupload property.
	 * Genie only.
	 */
    this.doUploadEvent = function () {
        if (uploadEvent && uploadEvent.length > 0) {
            var obj = {};
            obj["dir"] = this.getTargetDirectory();
            obj["names"] = this.getFileNames();
            var func = function () {
                eval("var info = arguments[0];");
                try {
                    var func2 = eval(uploadEvent);
                    if (typeof (func2) === "function") {
                        func2(arguments[0]);
                    }
                } catch (e) {
                    showError("onupload Error:\n" + e.message);
                }
            };
            func(obj);
        }
    }; // end doUploadEvent().
}
