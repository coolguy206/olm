"use strict";

var _jquery = _interopRequireDefault(require("jquery"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

// require('dotenv').config()
// console.log(process.env)
// const dotenv = require('dotenv');
// dotenv.config();
// console.log(process.env);
// console.log(process.env)
var GOOGLE_API_KEY = "AIzaSyD-bqqEqVuD1nhHqjozx5VnDAwKMGgpE7c";
var SIGNUP_GENIUS_KEY = "?user_key=KzhGWmcydml5bFRlTHd6bzc4TWRUdz09"; //? to test error
// var GOOGLE_API_KEY = "xyz";
// var SIGNUP_GENIUS_KEY = "xyz";

var sheet_id = "1-2g3tZj_hjCnSxLquhs3uAAXTm4UZQ8AxDBPCvzKcTE";
var baseURL = "https://sheets.googleapis.com/v4/spreadsheets/";
var range = "A:Z";
var sGBaseURL = "https://api.signupgenius.com/v2/k/";
var sGSignUps = "signups/created/all/";
var sGReports = "signups/report/all/";
var message = "";
(0, _jquery["default"])(document).ready(function () {
  console.log("page ready");
  var signUpArr = {
    genius: [],
    google: []
  }; //? GET SIGNUPS FROM SIGNUP GENIUS

  fetch("".concat(sGBaseURL).concat(sGSignUps).concat(SIGNUP_GENIUS_KEY)).then(function (data) {
    return data.json();
  }).then(function (data) {
    console.log("sign ups");
    console.log(data);
    data.data.map(function (val, i) {
      // console.log(val);
      var d = val.startdatestring;
      d = d.split(" ")[0]; // console.log(d);

      var date = new Date(d).toDateString();
      var obj = {
        title: val.title,
        id: val.signupid,
        url: val.signupurl,
        img: val.mainimage,
        date: date
      };
      signUpArr.genius.push(obj); // console.log(obj);
    }); // console.log(`signUpArr`);
    // console.log(signUpArr);

    return signUpArr; //? GET THE REPORTS FROM SIGNUP GENIUS
  }).then(function (signUpArr) {
    signUpArr.genius.map(function (val, i) {
      fetch("".concat(sGBaseURL).concat(sGReports).concat(val.id, "/").concat(SIGNUP_GENIUS_KEY)).then(function (data) {
        return data.json();
      }).then(function (data) {
        console.log(val.title);
        console.log("count: ".concat(data.data.signup.length)); // console.log(`reports`);

        console.log(data); // console.log(`signup`);

        val.signUps = []; // console.log(val);

        data.data.signup.map(function (arr, j) {
          if (arr.email !== "") {
            var obj = {
              amountpaid: arr.amountpaid,
              email: arr.email,
              firstname: arr.firstname,
              lastname: arr.lastname,
              phone: arr.phone,
              item: arr.item,
              comments: arr.comment,
              location: arr.location,
              qty: arr.myqty
            };
            val.signUps.push(obj);
          }
        }); // console.log(val);
      })["catch"](function (err) {
        console.log("oops something went wrong");
        console.log(err);
        (0, _jquery["default"])('.the-error').show();
        (0, _jquery["default"])(".the-form").hide();
      }); // console.log(`outside fetch`);
      // console.log(signUpArr);
    });
    return signUpArr; //? GET GOOGLE SHEETS
  }).then(function (signUpArr) {
    fetch("".concat(baseURL).concat(sheet_id, "?key=").concat(GOOGLE_API_KEY, "&includeGridData=true")).then(function (data) {
      return data.json();
    }).then(function (data) {
      // console.log(`google sheets`);
      // console.log(data);
      data.sheets.map(function (val, i) {
        var obj = {
          title: val.properties.title,
          signUps: []
        };
        val.data[0].rowData.map(function (arr, j) {
          if (j !== 0) {
            if (arr.values[0].formattedValue !== undefined) {
              var d = new Date(arr.values[0].formattedValue).toDateString();
              var signUpObj = {
                date: d,
                email: arr.values[1].formattedValue,
                name: arr.values[2].formattedValue,
                kidname: arr.values[3].formattedValue,
                grade: arr.values[4].formattedValue
              };
              obj.signUps.push(signUpObj);
            }
          }
        });
        signUpArr.google.push(obj);
      }); // console.log(signUpArr);
      // return signUpArr;
    })["catch"](function (err) {
      console.log("oops something went wrong");
      console.log(err);
      (0, _jquery["default"])('.the-error').show();
      (0, _jquery["default"])(".the-form").hide();
    });
    ;
    return signUpArr;
  }).then(function (signUpArr) {
    console.log(signUpArr);
    console.log("all good");
    (0, _jquery["default"])(".the-form").show();
    (0, _jquery["default"])('form').on('submit', function (e) {
      e.preventDefault(); //! reset message var

      message = ""; //! reset error message & ul

      (0, _jquery["default"])('.error-message, ul').hide();
      var theEmail1 = (0, _jquery["default"])('input[name="email1"]').val().toLowerCase();
      var theEmail2 = (0, _jquery["default"])('input[name="email2"]').val().toLowerCase(); // console.log("🚀 ~ file: scripts.js ~ line 52 ~ $ ~ theEmail", theEmail1)
      // console.log("🚀 ~ file: scripts.js ~ line 53 ~ $ ~ theEmail", theEmail2)

      if (theEmail1 !== "" || theEmail2 !== "") {
        //?execute the loop
        signUpArr.genius.map(function (val, i) {
          var theEvent = val.title;
          var theEventURL = val.url;
          var theEventDate = val.date;
          var theEventImg = val.img;
          val.signUps.map(function (arr, j) {
            var thisEmail = arr.email.toLowerCase();
            var thisPhone = arr.phone;

            if (thisPhone == undefined) {
              thisPhone = "";
            }

            if (thisEmail == theEmail1 || thisEmail == theEmail2) {
              var elem = "<li>\n                        <a href=\"".concat(theEventURL, "\" target=\"_blank\">\n                            <img src=\"").concat(theEventImg, "\" alt=\"").concat(theEvent, "\">\n                            <h3 class=\"event-title\">").concat(theEvent, "</h3>\n                        </a>\n                        <h4>Email: ").concat(arr.email, "</h4>\n                        <h4>Name: ").concat(arr.firstname, " ").concat(arr.lastname, "</h4>\n                        <h4>Phone: ").concat(thisPhone, "</h4>\n                        <!--<h4>Amount Paid: ").concat(arr.amountpaid, "</h4>-->\n                        <h4 class=\"item\">Item: ").concat(arr.item, "</h4>\n                        <h4 class=\"location\">Location: ").concat(arr.location, "</h4>\n                        <h4>Qty: ").concat(arr.qty, "</h4>\n                        <h4>Comments: ").concat(arr.comments, "</h4>\n                        \n                        <!-- <h4>Child: ").concat(arr.kidname, "</h4>\n                        <h4>Grade: ").concat(arr.grade, "</h4>\n                        <h4>Date: ").concat(arr.date, "</h4> -->\n                    </li>");
              message += elem;
            }
          });
        });
        signUpArr.google.map(function (val, i) {
          var theEvent = val.title;
          val.signUps.map(function (arr, j) {
            var thisEmail = arr.email.toLowerCase();

            if (thisEmail == theEmail1 || thisEmail == theEmail2) {
              // console.log(`match`);
              // console.log("🚀 ~ file: scripts.js ~ line 56 ~ $.each ~ thisEmail == theEmail", thisEmail == theEmail1);
              // console.log("🚀 ~ file: scripts.js ~ line 56 ~ $.each ~ thisEmail == theEmail", thisEmail == theEmail2);
              var elem = "<li>\n                            <h3>".concat(theEvent, "</h3>\n                            <h4>Email: ").concat(arr.email, "</h4>\n                            <h4>Name: ").concat(arr.name, "</h4>\n                            <h4>Child: ").concat(arr.kidname, "</h4>\n                            <h4>Grade: ").concat(arr.grade, "</h4>\n                            <h4>Date: ").concat(arr.date, "</h4>\n                        </li>");
              message += elem;
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
        } //! add up total points


        var locationsArr = (0, _jquery["default"])('.location');
        var itemsArr = (0, _jquery["default"])('.item');
        console.log(locationsArr, itemsArr);
        var pointsCount = [];
        locationsArr.map(function (i, val) {
          // console.log(val);
          console.log(val.textContent);

          if (val.textContent.indexOf('pts') !== -1) {
            pointsCount.push(val.textContent);
          }
        });
        itemsArr.map(function (i, val) {
          // console.log(val);
          console.log(val.textContent);

          if (val.textContent.indexOf('pts') !== -1) {
            pointsCount.push(val.textContent);
          }
        });
        console.log("pointsCount");
        console.log(pointsCount);
      }
    });
  })["catch"](function (err) {
    console.log("oops something went wrong");
    console.log(err);
    (0, _jquery["default"])('.the-error').show();
    (0, _jquery["default"])(".the-form").hide();
  });
});
//# sourceMappingURL=scripts.js.map
