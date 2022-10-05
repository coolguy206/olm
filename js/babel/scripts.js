"use strict";

var _jquery = _interopRequireDefault(require("jquery"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

// require('dotenv').config()
// console.log(process.env)
// const dotenv = require('dotenv');
// dotenv.config();
// console.log(process.env);
// console.log(process.env)
var GOOGLE_API_KEY = "AIzaSyD-bqqEqVuD1nhHqjozx5VnDAwKMGgpE7c"; //? to test error
// var GOOGLE_API_KEY = "xyz";

var sheet_id = "1-2g3tZj_hjCnSxLquhs3uAAXTm4UZQ8AxDBPCvzKcTE";
var baseURL = "https://sheets.googleapis.com/v4/spreadsheets/";
var range = "A:Z";
var message = "";
(0, _jquery["default"])(document).ready(function () {
  console.log("page ready");

  _jquery["default"].get("".concat(baseURL).concat(sheet_id, "?key=").concat(GOOGLE_API_KEY, "&includeGridData=true"), function (data) {
    console.log("all good");
    console.log(data);
    (0, _jquery["default"])('.the-form').show();
    var theSheets = data.sheets;
    (0, _jquery["default"])('form').on('submit', function (e) {
      e.preventDefault(); //! reset message var

      message = ""; //! reset error message & ul

      (0, _jquery["default"])('.error-message, ul').hide();
      var theEmail1 = (0, _jquery["default"])('input[name="email1"]').val().toLowerCase();
      var theEmail2 = (0, _jquery["default"])('input[name="email2"]').val().toLowerCase(); // console.log("🚀 ~ file: scripts.js ~ line 52 ~ $ ~ theEmail", theEmail1)
      // console.log("🚀 ~ file: scripts.js ~ line 53 ~ $ ~ theEmail", theEmail2)
      //?execute the loop

      _jquery["default"].each(theSheets, function (i, val) {
        // console.log("🚀 ~ file: scripts.js ~ line 43 ~ $.each ~ val", val)
        var theEvent = val.properties.title; // console.log("🚀 ~ file: scripts.js ~ line 47 ~ $.each ~ theEvent", theEvent);
        //? loop the rowData to find email

        _jquery["default"].each(val.data[0].rowData, function (j, str) {
          if (j !== 0) {
            var thisDate = str.values[0].formattedValue;
            var thisEmail = str.values[1].formattedValue;
            var thisName = str.values[2].formattedValue;
            var thisChild = str.values[3].formattedValue;
            var thisGrade = str.values[4].formattedValue; // console.log("🚀 ~ file: scripts.js ~ line 53 ~ $.each ~ thisEmail", thisEmail);

            if (thisEmail !== undefined) {
              thisEmail = thisEmail.toLowerCase();

              if (thisEmail == theEmail1 || thisEmail == theEmail2) {
                // console.log(`match`);
                // console.log("🚀 ~ file: scripts.js ~ line 56 ~ $.each ~ thisEmail == theEmail", thisEmail == theEmail1);
                // console.log("🚀 ~ file: scripts.js ~ line 56 ~ $.each ~ thisEmail == theEmail", thisEmail == theEmail2);
                var elem = "<li>\n                                    <h3>".concat(theEvent, "</h3>\n                                    <h4>Email: ").concat(thisEmail, "</h4>\n                                    <h4>Name: ").concat(thisName, "</h4>\n                                    <h4>Child: ").concat(thisChild, "</h4>\n                                    <h4>Grade: ").concat(thisGrade, "</h4>\n                                    <h4>Date: ").concat(thisDate, "</h4>\n                                </li>");
                message += elem;
              }
            }
          }
        });
      }); //!clear all previous submissions


      (0, _jquery["default"])('ul').empty();

      if (message !== "") {
        //?display on page
        (0, _jquery["default"])('ul').append(message);
        (0, _jquery["default"])('ul').css('display', 'flex');
      } else {
        //!display error message
        (0, _jquery["default"])('.error-message').show();
      } //! find duplicates and highlight them


      var titles = (0, _jquery["default"])('ul h3'); // console.log("🚀 ~ file: scripts.js ~ line 99 ~ titles", titles)

      for (var i = 0; i < titles.length - 1; i++) {
        if (titles[i + 1].innerHTML == titles[i].innerHTML) {
          // console.log(`match`);
          // console.log(titles[i + 1].innerHTML);
          // console.log(titles[i].innerHTML);
          (0, _jquery["default"])(titles[i + 1]).closest('li').addClass('duplicate');
          (0, _jquery["default"])(titles[i]).closest('li').addClass('duplicate');
        }
      }
    }); //! if .get fails show the error message to contact developer
  }).fail(function (err) {
    console.log("something went wrong"); // console.log(err);

    (0, _jquery["default"])('.the-error').show();
  });
});
//# sourceMappingURL=scripts.js.map
