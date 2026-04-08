var jpdbBaseURL = "http://api.login2explore.com:5577";
var jpdbIRL = "/api/irl";
var jpdbIML = "/api/iml";
var dbName = "SCHOOL-DB";
var relationName = "STUDENT-TABLE";
var connToken = "90934797|-31949238904837406|90958187"; // Replace with your actual JPDB Connection Token

// Initial focus on the primary key field when page loads
$("#rollno").focus();

function saveRecNo2LS(jsonObj) {
    var lvData = JSON.parse(jsonObj.data);
    localStorage.setItem("recno", lvData.rec_no);
}

function getRollNoAsJsonObj() {
    var rollno = $("#rollno").val();
    var jsonStr = {
        id: rollno,
    };
    return JSON.stringify(jsonStr);
}

function fillData(jsonObj) {
    saveRecNo2LS(jsonObj);
    var record = JSON.parse(jsonObj.data).record;
    $("#fullname").val(record.name);
    $("#class").val(record.className);
    $("#birthdate").val(record.birthDate);
    $("#address").val(record.address);
    $("#enrollmentdate").val(record.enrollmentDate);
}

function resetForm() {
    $("#rollno").val("");
    $("#fullname").val("");
    $("#class").val("");
    $("#birthdate").val("");
    $("#address").val("");
    $("#enrollmentdate").val("");

    // Disable all fields except Roll No
    $("#rollno").prop("disabled", false);
    $("#fullname").prop("disabled", true);
    $("#class").prop("disabled", true);
    $("#birthdate").prop("disabled", true);
    $("#address").prop("disabled", true);
    $("#enrollmentdate").prop("disabled", true);

    // Disable all buttons
    $("#save").prop("disabled", true);
    $("#update").prop("disabled", true);
    $("#reset").prop("disabled", true);

    $("#rollno").focus();
}

function validateData() {
    var rollno = $("#rollno").val();
    var fullname = $("#fullname").val();
    var className = $("#class").val();
    var birthdate = $("#birthdate").val();
    var address = $("#address").val();
    var enrollmentdate = $("#enrollmentdate").val();

    if (rollno === "") {
        alert("Roll No Missing");
        $("#rollno").focus();
        return "";
    }
    if (fullname === "") {
        alert("Full Name Missing");
        $("#fullname").focus();
        return "";
    }
    if (className === "") {
        alert("Class Missing");
        $("#class").focus();
        return "";
    }
    if (birthdate === "") {
        alert("Birth Date Missing");
        $("#birthdate").focus();
        return "";
    }
    if (address === "") {
        alert("Address Missing");
        $("#address").focus();
        return "";
    }
    if (enrollmentdate === "") {
        alert("Enrollment Date Missing");
        $("#enrollmentdate").focus();
        return "";
    }

    var jsonStrObj = {
        id: rollno,
        name: fullname,
        className: className,
        birthDate: birthdate,
        address: address,
        enrollmentDate: enrollmentdate,
    };
    return JSON.stringify(jsonStrObj);
}

function getStudent() {
    var rollNoJsonObj = getRollNoAsJsonObj();
    var getRequest = createGET_BY_KEYRequest(
        connToken,
        dbName,
        relationName,
        rollNoJsonObj,
    );
    jQuery.ajaxSetup({ async: false });
    var resJsonObj = executeCommandAtGivenBaseUrl(
        getRequest,
        jpdbBaseURL,
        jpdbIRL,
    );
    jQuery.ajaxSetup({ async: true });

    if (resJsonObj.status === 400) {
        // Record does NOT exist: Enable fields for data entry and Enable Save/Reset
        $("#save").prop("disabled", false);
        $("#reset").prop("disabled", false);

        $("#fullname").prop("disabled", false);
        $("#class").prop("disabled", false);
        $("#birthdate").prop("disabled", false);
        $("#address").prop("disabled", false);
        $("#enrollmentdate").prop("disabled", false);

        $("#fullname").focus();
    } else if (resJsonObj.status === 200) {
        // Record DOES exist: Disable Roll No, populate form, Enable Update/Reset
        $("#rollno").prop("disabled", true);
        fillData(resJsonObj);

        $("#update").prop("disabled", false);
        $("#reset").prop("disabled", false);

        $("#fullname").prop("disabled", false);
        $("#class").prop("disabled", false);
        $("#birthdate").prop("disabled", false);
        $("#address").prop("disabled", false);
        $("#enrollmentdate").prop("disabled", false);

        $("#fullname").focus();
    }
}

function saveData() {
    var jsonStrObj = validateData();
    if (jsonStrObj === "") {
        return "";
    }
    var putRequest = createPUTRequest(
        connToken,
        jsonStrObj,
        dbName,
        relationName,
    );
    jQuery.ajaxSetup({ async: false });
    var resJsonObj = executeCommandAtGivenBaseUrl(
        putRequest,
        jpdbBaseURL,
        jpdbIML,
    );
    jQuery.ajaxSetup({ async: true });
    resetForm();
}

function updateData() {
    $("#update").prop("disabled", true);
    var jsonChg = validateData();
    var updateRequest = createUPDATERecordRequest(
        connToken,
        jsonChg,
        dbName,
        relationName,
        localStorage.getItem("recno"),
    );
    jQuery.ajaxSetup({ async: false });
    var resJsonObj = executeCommandAtGivenBaseUrl(
        updateRequest,
        jpdbBaseURL,
        jpdbIML,
    );
    jQuery.ajaxSetup({ async: true });
    resetForm();
}
