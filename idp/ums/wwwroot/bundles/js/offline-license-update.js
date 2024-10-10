var licenseKey,getLicenseUrl,licenseToken,offlineLicenseToken;function readFile(e,n){var i,a=new FileReader;a.onload=function(e){i=a.result,n(i)},a.readAsText(e),$("#getFile")[0].value=""}function sendData(e,n){var i,a=!1;try{JSON.parse(e.content),a=!0}catch{$(".validation-error-message").html(window.Server.App.LocalizationContent.LicenseFileCorrupt.format("<a target='_blank' href='"+getLicenseUrl+"'>","</a>")),$(".validation-error-message").removeClass("display-none")}a&&(a=JSON.parse(e.content).unlock_key,i=JSON.parse(e.content).license_token,offlineLicenseToken=JSON.parse(e.content).offline_license_token,licenseToken=i,void 0===(licenseKey=a)||isEmptyOrSpaces(a)?($(".validation-error-message").html(window.Server.App.LocalizationContent.LicenseFileCorrupt.format("<a target='_blank' href='"+getLicenseUrl+"'>","</a>")),$(".validation-error-message").removeClass("display-none")):$.ajax({type:"POST",data:{key:a,tenantType:parseInt($("#tenant-type").val())},url:n,beforeSend:showWaitingPopup("offline-license-update-dialog"),success:function(e){e.Status?(void 0===e.Email||isEmptyOrSpaces(e.Email)||($("#customer-email").html(e.Email),$("#customer-email-container").removeClass("display-none")),void 0===e.SubscriptionId||isEmptyOrSpaces(e.SubscriptionId)||($("#subscription-id-offline").html(e.SubscriptionId),$("#subscription-id-container").removeClass("display-none")),void 0===e.SubscriptionName||isEmptyOrSpaces(e.SubscriptionName)||($("#subscription-name").html(e.SubscriptionName),$("#subscription-name-container").removeClass("display-none")),void 0===e.PlanName||isEmptyOrSpaces(e.PlanName)||($("#plan-name").html(e.PlanName),$("#plan-name-container").removeClass("display-none")),e.IsPerpetualLicense||void 0===e.ExpiryDate||isEmptyOrSpaces(e.ExpiryDate)||($("#expiry-date").html(e.ExpiryDate),$("#expiry-date-container").removeClass("display-none")),void 0===e.TenantStatus||isEmptyOrSpaces(e.TenantStatus)||($("#tenant-status").html(e.TenantStatus),$("#tenant-status-container").removeClass("display-none"),"Active"==e.TenantStatus?$("#tenant-status").addClass("active-status"):"Trial"==e.TenantStatus&&$("#tenant-status").addClass("trial"),e.IsPerpetualLicense&&($("#tenant-status").html("Perpetual"),$("#tenant-status").addClass("active-status"))),$("#license-details").slideDown("slow"),$("#confirm-license").prop("disabled",!1),$(".upload-license-button").attr("disabled",!1)):(e.Status,null!=e.Message&&($("#customer-email-container, #subscription-id-container, #subscription-name-container,#plan-name-container, #expiry-date-container, #tenant-status-container").addClass("display-none"),$("#license-details").slideUp("slow"),e.Message+="<a target='_blank' href='"+getLicenseUrl+"'> here</a>",$(".validation-error-message").html(e.Message),$(".validation-error-message").removeClass("display-none"),$("#confirm-license").prop("disabled",!0),$(".upload-license-button").attr("disabled",!0))),hideWaitingPopup("offline-license-update-dialog")},error:function(){hideWaitingPopup("offline-license-update-dialog")}}))}function uploadLicenseDialogClose(){$("#license-details").slideUp("slow"),$(".validation-error-message").addClass("display-none"),$("#confirm-license").prop("disabled",!0),$("#file-name").val(""),licenseToken=licenseKey="",$("#tenant-type").val(""),document.getElementById("offline-license-update-dialog").ej2_instances[0].hide()}function confirmLicenseUpdate(){void 0===licenseKey||isEmptyOrSpaces(licenseKey)?(hideWaitingPopup("offline-license-update-dialog"),WarningAlert(window.Server.App.LocalizationContent.ManageLicense,window.Server.App.LocalizationContent.LicenseUpdateFailed,result.Message,0)):$.ajax({type:"POST",url:updateLicenseKeyUrl,data:{licenseKey:licenseKey,licenseType:"2",currentUrl:window.location.origin,offlineLicenseToken:offlineLicenseToken,boldLicenseToken:licenseToken},beforeSend:showWaitingPopup("offline-license-update-dialog"),success:function(e){0!=$("#license-selection-container").length?(e.Status?($("#image-parent-container .startup-image").hide().attr("src",serverSetupImageUrl).fadeIn(),$(".startup-content").fadeIn(),$("#license-selection-container").hide(),$("#auth-type-dropdown").removeClass("hide").addClass("show"),$("#system-settings-db-selection-container").slideDown("slow")):(hideWaitingPopup("offline-license-update-dialog"),WarningAlert(window.Server.App.LocalizationContent.ManageLicense,window.Server.App.LocalizationContent.LicenseUpdateFailed,e.Message,0)),uploadLicenseDialogClose()):e.Status?(hideWaitingPopup("offline-license-update-dialog"),SuccessAlert(window.Server.App.LocalizationContent.ManageLicense,window.Server.App.LocalizationContent.LicenseUpdated,7e3),uploadLicenseDialogClose(),setTimeout(function(){window.location.reload(!0)},1e3)):(hideWaitingPopup("offline-license-update-dialog"),WarningAlert(window.Server.App.LocalizationContent.ManageLicense,window.Server.App.LocalizationContent.LicenseUpdateFailed,e.Message,0),uploadLicenseDialogClose())}})}function isEmptyOrSpaces(e){return null===e||null!==e.match(/^ *$/)}function resizeLicenseDialog(){document.getElementById("offline-license-update-dialog").ej2_instances[0].position.X=(window.innerWidth-$("#offline-license-update-dialog").width())/2,document.getElementById("offline-license-update-dialog").ej2_instances[0].position.Y=(window.innerHeight-$("#offline-license-update-dialog").height())/2}$(document).ready(function(){String.prototype.format=function(){for(k in a=this,arguments)a=a.replace("{"+k+"}",arguments[k]);return a},new ejs.popups.Dialog({header:window.Server.App.LocalizationContent.UploadLicense,showCloseIcon:!0,width:"472px",close:uploadLicenseDialogClose,buttons:[{click:function(){uploadLicenseDialogClose()},buttonModel:{content:window.Server.App.LocalizationContent.CancelButton}},{click:function(){confirmLicenseUpdate()},buttonModel:{content:window.Server.App.LocalizationContent.UpdateLicense,isPrimary:!0,cssClass:"upload-license-button"}}],isModal:!0,animationSettings:{effect:"Zoom"},visible:!1}).appendTo("#offline-license-update-dialog"),createWaitingPopup("offline-license-update-dialog"),$(window).resize(function(){resizeLicenseDialog()}),$(document).on("click","#browse-lic, #file-name",function(){$("#getFile").click()}),$('[data-toggle="popover"]').popover(),$(document).on("change","#getFile",function(e){$(".validation-error-message").html(""),$(".validation-error-message").addClass("display-none");var n,i=e.originalEvent.target.files[0].name;"lic"==i.split(".").pop()?($("#file-name").val(i),i=e.originalEvent.target.files[0],n={},showWaitingPopup("offline-license-update-dialog"),readFile(i,function(e){n.content=e,sendData(n,validateLicenseKeyUrl)}),hideWaitingPopup("offline-license-update-dialog")):($("#file-name").val(""),$(".validation-error-message").html(window.Server.App.LocalizationContent.InvalidLicFileFormat),$(".validation-error-message").removeClass("display-none"))}),$(document).on("click","#offline-update-bi, #offline-update-reports, .offline-license-acion, #offline-change-subscription",function(){document.getElementById("offline-license-update-dialog").ej2_instances[0].show(),getLicenseUrl=$(this).attr("data-offlinelicense-url"),$("#tenant-type").val($(this).attr("data-tenant-type")),$("#file-name").val(""),$(".upload-license-button").attr("disabled",!0)})});