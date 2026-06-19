/**
 * Core Automation Intake & Underwriting Engine
 * Handles dynamic file serialization, document layout assembly, 
 * business rules engine auditing, and automated multi-channel messaging.
 */

function doGet() {
  return HtmlService.createHtmlOutputFromFile('index')
      .setTitle('Enterprise Automation Portal')
      .setXFrameOptionsMode(HtmlService.XFrameOptionsMode.ALLOWALL);
}

function processApplicationPipeline(formObject) {
  if (!formObject || typeof formObject !== 'object') {
    throw new Error("System Interface Failure: Form payload validation mismatch.");
  }
  
  var timestamp = new Date();
  var idUrl = "", payslipUrl = "", contractUrl = "", finalPdfUrl = "", userFolderUrl = "";

  try {
    // SYSTEM CONFIGURATION SCHEMA (Sanitized Environment Variables)
    var CONFIG_DB_ID = "TARGET_SPREADSHEET_SCHEMA_ID";
    var DRIVER_ROOT_DIRECTORY_ID = "TARGET_DRIVE_FOLDER_DIRECTORY_ID"; 
    var EXECUTABLE_TEMPLATE_DOC_ID = "TARGET_DOCUMENT_TEMPLATE_ID";
    
    var ss = SpreadsheetApp.openById(CONFIG_DB_ID);
    var sheet = ss.getSheetByName("INTAKE_DB_LEDGER");
    if (!sheet) { sheet = ss.getSheets()[0]; }
    
    var rootFolder = DriveApp.getFolderById(DRIVER_ROOT_DIRECTORY_ID);

    // 1. Generate Unique Core Application ID Pattern
    var randomSixDigit = Math.floor(100000 + Math.random() * 900000);
    var generatedAppId = "APP-" + randomSixDigit;
    
    // 2. Create Dynamic Isolated Subfolder Target Structure
    var folderName = (formObject.firstName || "Client") + " " + (formObject.lastName || "") + "-document portfolio";
    var userFolder = rootFolder.createFolder(folderName);
    userFolderUrl = userFolder.getUrl();

    // 3. Process Binary Base64 File Multi-Stream Conversions
    if (formObject.nationalIdFile && formObject.nationalIdFileName) {
      var idBlob = Utilities.newBlob(Utilities.base64Decode(formObject.nationalIdFile), "application/pdf", formObject.nationalIdFileName);
      var idDoc = userFolder.createFile(idBlob);
      idUrl = idDoc.getUrl();
    }
    
    if (formObject.payslipFile && formObject.payslipFileName) {
      var payBlob = Utilities.newBlob(Utilities.base64Decode(formObject.payslipFile), "application/pdf", formObject.payslipFileName);
      var payDoc = userFolder.createFile(payBlob);
      payslipUrl = payDoc.getUrl();
    }

    // 4. Document Assembly Engine - Build Live Template Clone
    var copyTitle = "EXECUTED_DIGITAL_CONTRACT_" + generatedAppId;
    var docCopyId = DriveApp.getFileById(EXECUTABLE_TEMPLATE_DOC_ID).makeCopy(copyTitle, userFolder).getId();
    var docFile = DriveApp.getFileById(docCopyId);
    var doc = DocumentApp.openById(docCopyId);
    var body = doc.getBody();

    // 5. Serialize and Token-Replace Scalar Field Form Elements
    body.replaceText("{{AppId}}", generatedAppId);
    body.replaceText("{{Timestamp}}", Utilities.formatDate(timestamp, "GMT+2", "yyyy-MM-dd HH:mm:ss"));
    body.replaceText("{{FirstName}}", formObject.firstName || "");
    body.replaceText("{{LastName}}", formObject.lastName || "");
    body.replaceText("{{Phone}}", formObject.phone || "");
    body.replaceText("{{Email}}", formObject.userEmail || "");
    body.replaceText("{{RequestedAmount}}", formObject.reqAmount || "0");
    body.replaceText("{{RequestedMonths}}", formObject.reqMonths || "0");

    // 6. Inject Complex Analytics Table Directly into Document Stream
    var tableIndex = -1;
    for (var idx = 0; idx < body.getNumChildren(); idx++) {
      var element = body.getChild(idx);
      if (element.getType() == DocumentApp.ElementType.PARAGRAPH) {
        if (element.asParagraph().getText().indexOf("{{AmortizationTable}}") !== -1) {
          tableIndex = idx;
          element.asParagraph().setText(""); 
          break;
        }
      }
    }

    if (tableIndex !== -1 && formObject.scheduleDataJson) {
      try {
        var schedule = JSON.parse(formObject.scheduleDataJson);
        if (schedule && schedule.length > 0) {
          var table = body.insertTable(tableIndex);
          
          var headerStyle = {};
          headerStyle[DocumentApp.Attribute.BACKGROUND_COLOR] = '#1A365D';
          headerStyle[DocumentApp.Attribute.FOREGROUND_COLOR] = '#FFFFFF';
          headerStyle[DocumentApp.Attribute.BOLD] = true;

          var cellStyle = {};
          cellStyle[DocumentApp.Attribute.FONT_SIZE] = 9;

          var headerRow = table.appendTableRow();
          headerRow.appendTableCell("Interval").setAttributes(headerStyle);
          headerRow.appendTableCell("Rate Distribution").setAttributes(headerStyle);
          headerRow.appendTableCell("Balance Mapping").setAttributes(headerStyle);

          for (var r = 0; r < schedule.length; r++) {
            var rowData = schedule[r];
            var row = table.appendTableRow();
            row.appendTableCell(String(rowData.month)).setAttributes(cellStyle);
            row.appendTableCell(Number(rowData.installment).toLocaleString()).setAttributes(cellStyle);
            row.appendTableCell(Number(rowData.balance).toLocaleString()).setAttributes(cellStyle);
          }
        }
      } catch (tableErr) {
        Logger.log("Table Injection Fault: " + tableErr.toString());
      }
    }

    doc.saveAndClose();

    // 7. Render Executed Document to PDF Blob File Object Binary Stream
    var pdfBlob = docFile.getAs("application/pdf");
    pdfBlob.setName(copyTitle + ".pdf");
    var finalPdfDoc = userFolder.createFile(pdfBlob);
    finalPdfUrl = finalPdfDoc.getUrl();

    // 8. Business Rules Engine Routing Logic
    var operationalStatus = "AUTO-APPROVED";
    var infrastructureRemarks = "Meets algorithmic validation architecture.";
    
    if (formObject.productCode && formObject.productCode.toString().toUpperCase().indexOf("SHARE") !== -1) {
      operationalStatus = "REFERRED FOR VERIFICATION";
      infrastructureRemarks = "Complex equity structure flag. Diverted to manual verification queue.";
    }

    var generatedTicketId = "TKT-" + Math.floor(1000 + Math.random() * 9000);

    // 9. Append Data Row Matrix for Structural Logging
    var dataRow = [
      generatedAppId,
      Utilities.formatDate(timestamp, "GMT+2", "yyyy-MM-dd HH:mm:ss"),
      formObject.firstName || "",
      formObject.lastName || "",
      formObject.userEmail || "",
      formObject.phone || "",
      operationalStatus,
      generatedTicketId,
      infrastructureRemarks,
      finalPdfUrl
    ];

    sheet.appendRow(dataRow);
    SpreadsheetApp.flush();
    
    // 10. Multi-Channel Messaging Hub (REST API Webhook Gateway Integration)
    try {
      var customerEmail = formObject.userEmail || "";
      var customerPhone = formObject.phone || "";
      
      if (customerEmail) {
        MailApp.sendEmail(customerEmail, "File Sync Confirmation [" + generatedAppId + "]", "System status: " + operationalStatus);
      }
      
      if (customerPhone) {
        var cleanPhone = customerPhone.toString().replace(/^[0+]+/g, '');
        var apiWebhookUrl = "https://api.externalmsgateway.com/v1/dispatch";
        var secureApiKey = "ENVIRONMENT_VARIABLE_SECRET_BEARER_TOKEN"; 
        
        var apiPayload = {
          "senderId": "SYS_ALERTS",
          "recipient": cleanPhone,
          "body": "Profile " + generatedAppId + " received sync framework. Status: " + operationalStatus,
          "trackingId": "REF-" + generatedAppId
        };
        
        var httpOptions = {
          "method": "post",
          "contentType": "application/json",
          "headers": { "Authorization": "Bearer " + secureApiKey },
          "payload": JSON.stringify(apiPayload),
          "muteHttpExceptions": true
        };
        
        var gatewayCall = UrlFetchApp.fetch(apiWebhookUrl, httpOptions);
        Logger.log("API Gateway Response Code: " + gatewayCall.getResponseCode());
      }
    } catch(notifErr) {
      Logger.log("Messaging Layer Warning: " + notifErr.toString());
    }
    
    try { docFile.setTrashed(true); } catch(e){}
    
    return { status: "SUCCESS", folderUrl: userFolderUrl, pdfUrl: finalPdfUrl };

  } catch (err) {
    throw new Error("Pipeline Fatal Exception: " + err.toString());
  }
}
