﻿$(document).ready(function () {
    addPlacehoder("#user-add-dialog");
    createWaitingPopup('user-add-dialog');
    var addUserDialog = new ej.popups.Dialog({
        header: window.TM.App.LocalizationContent.AddUser,
        content: document.getElementById("dialog-container"),
        showCloseIcon: true,
        width: "500px",
        height: "auto",
        isModal: true,
        visible: false,
        closeOnEscape: true,
        animationSettings: { effect: 'Zoom' },
        close: "onUserAddDialogClose",
    });
    addUserDialog.appendTo("#user-add-dialog");

    $.validator.addMethod("isRequired", function (value, element) {
        return !isEmptyOrWhitespace(value);
    }, window.TM.App.LocalizationContent.EnterName);

    $.validator.addMethod("hasWhiteSpace", function (value, element) {
        return hasWhiteSpace(value)
    }, window.TM.App.LocalizationContent.UserNameHasWhiteSpace);

    $.validator.addMethod("isValidUsername", function (value, element) {
        return IsValidUsername(value);
    }, window.TM.App.LocalizationContent.UserNameSpecialCharacterValicator);

    $.validator.addMethod("isValidUsernameLength", function (value, element) {
        return IsValidUsernameLength(value);
    }, window.TM.App.LocalizationContent.UsernameExceeds);

    $.validator.addMethod("isValidEmail", function (value, element) {
        if (value.trim() == "") {
            return true;
        } else {
            return IsEmail(value);
        }
    }, window.TM.App.LocalizationContent.InvalidEmailAddress);

    $.validator.addMethod("isValidName", function (value, element) {
        return IsValidName("name", value)
    }, window.TM.App.LocalizationContent.AvoidSpecailCharacters);

    $.validator.addMethod("additionalSpecialCharValidation", function (value, element) {
        if (/^[a-zA-Z_0-9`~!\$\^()=\-\.\{\} ]+$/.test(value) || value === "") {
            return true;
        }
    }, window.TM.App.LocalizationContent.AvoidSpecailCharacters);

    $("#dialog-container").validate({
        errorElement: 'span',
        onkeyup: function (element, event) {
            if (event.keyCode != 9) {
                isKeyUp = true;
                $(element).valid();
                isKeyUp = false;
            }
            else
                true;
        },
        onfocusout: function (element) { $(element).valid(); },
        rules: {
            "user-name": {
                isRequired: true,
                isValidUsernameLength: true,
                isValidUsername: true
            },
            "email-address": {
                isValidName: true,
                isValidEmail: true
            },
            "first-name": {
                isRequired: true,
                isValidName: true,
                additionalSpecialCharValidation: true
            },
            "last-name": {
                isValidName: true,
                additionalSpecialCharValidation: true
            },
            "user-password": {
                required: true,
                isUserPasswordValid: true
            },
        },
        highlight: function (element) {
            $(element).closest('div').addClass("has-error");
            passwordBoxHightlight(element);
        },
        unhighlight: function (element) {
            passwordBoxUnhightlight(element);
            $(element).closest('div').removeClass('has-error');
            $(element).closest('div').find("span.useradd-validation-messages").html("");
            
        },
        errorPlacement: function (error, element) {
            $(element).closest('div').find("span.useradd-validation-messages").html(error.html()).css("display", "block");
        },
        messages: {
			"email-address": {
                isRequired: window.TM.App.LocalizationContent.EmailValidator
            },
            "username": {
                isRequired: window.TM.App.LocalizationContent.UserNameValidator
            },
            "first-name": {
                isRequired: window.TM.App.LocalizationContent.FirstNameValidator
            },
            "user-password": {
                isValidPassword: window.TM.App.LocalizationContent.EnterPassword
            },
        }
    });

    $.validator.addMethod("isUserPasswordValid", function (value, element) {
        var validateMethods = new Array();
        validateMethods.push(validateUserpassword.p_policy_uppercase);
        validateMethods.push(validateUserpassword.p_policy_lowercase);
        validateMethods.push(validateUserpassword.p_policy_number);
        validateMethods.push(validateUserpassword.p_policy_specialcharacter);
        validateMethods.push(validateUserpassword.p_policy_length);
        passwordPolicyPopover("#new-password", value);
        if ($('#password_policy_rules li>span.su-password-tick').length == $('#password_policy_rules li>span:not(.content)').length) {
            return true;
        }
    }, "");

    $(document).on("keyup", "#dialog-container", function (e) {
        if (e.keyCode == 13) {
            if ($("#cancel-user").is(":focus")) {
                onUserAddDialogClose();
            } else if ($("#add-user").is(":focus")) { e.preventDefault(); }
            else {
                $("input#add-user").trigger("click");
            }
        }
    });

    $(document).on("click", "#create-user", function () {
        $("#add-user").removeAttr("disabled");
        $(".form input[type='text']").val('');
        var usergrid = document.getElementById('user_grid').ej2_instances[0];
        usergrid.clearSelection();
        $("#add-user-in-group").removeClass("show").addClass("hide");
        $(".validation").closest("div").removeClass("has-error");
        $(".useradd-validation-messages").css("display", "none");
    });

    $(document).on("keyup", "#new-password", function () {
        passwordPolicyPopover("#new-password", $("#new-password").val());
        $("#new-password").valid();
    });

    function hasWhiteSpace(value) {
        if (/\s/g.test(value)) {
            return false;
        }
        else {
            return true;
        }
    }
});

function onUserAddDialogClose() {
    document.getElementById("user-add-dialog").ej2_instances[0].hide();
    $("#password_policy_rules").remove();
}

function onUserAddDialogOpen() {
    $("#add-user").removeAttr("disabled");
    $(".dropdown").removeClass("open");
    document.getElementById("user-add-dialog").ej2_instances[0].show();
    $("#new-password").val("");
    $(".show-hide-password").removeClass("su-hide").addClass("su-show");
    $(".e-dialog-icon").attr("title", "Close");
    $(".validation").closest("div").removeClass("has-error");
    $(".useradd-validation-messages").css("display", "none");
    CheckMailSettingsAndNotify(window.TM.App.LocalizationContent.ToSendAccountActivation, $(".validation-message"), "");
}