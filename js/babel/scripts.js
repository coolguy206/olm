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
  var currentYear = new Date().getFullYear();
  var otherYear = "";
  var currentMonth = new Date().getMonth();
  var span1Year = "";
  var span2Year = ""; //? FOR TEST YEAR AND MONTH
  // var currentYear = 2024;
  // var currentMonth = 1;

  if (currentMonth > 7) {
    otherYear = currentYear + 1;
    span1Year = currentYear;
    span2Year = currentYear + 1;
  } else {
    otherYear = currentYear - 1;
    span1Year = currentYear - 1;
    span2Year = currentYear;
  } //? SET THE H1 YEARS


  (0, _jquery["default"])('.year1').text(span1Year);
  (0, _jquery["default"])('.year2').text(span2Year);
  var signUpArr = {
    genius: [] // google: []

  }; //? GET SIGNUPS FROM SIGNUP GENIUS

  fetch("".concat(sGBaseURL).concat(sGSignUps).concat(SIGNUP_GENIUS_KEY)).then(function (data) {
    return data.json();
  }).then(function (data) {
    console.log("sign ups");
    console.log(data);
    data.data.map(function (val, i) {
      // console.log(val);
      var startDate = val.startdatestring;
      startDate = new Date(startDate).toDateString();
      var endDate = val.enddatestring;
      endDate = new Date(endDate).toDateString();
      var obj = {
        title: val.title,
        id: val.signupid,
        url: val.signupurl,
        img: val.mainimage,
        startDate: startDate,
        endDate: endDate
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
        // console.log(val.startDate);
        // console.log(val.endDate);
        var start = new Date(val.startDate).toDateString();
        var end = new Date(val.endDate).toDateString();
        console.log("".concat(val.title, " ").concat(start, " - ").concat(end));
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
    return signUpArr;
  })
  /*    
      //? GET GOOGLE SHEETS
      .then((signUpArr) => {
          fetch(`${baseURL}${sheet_id}?key=${GOOGLE_API_KEY}&includeGridData=true`).then((data) => { return data.json() }).then((data) => {
              // console.log(`google sheets`);
              // console.log(data);
  
              data.sheets.map((val, i) => {
                  var obj = {
                      title: val.properties.title,
                      signUps: []
                  }
                  val.data[0].rowData.map((arr, j) => {
                      if (j !== 0) {
                          if (arr.values[0].formattedValue !== undefined) {
                              var d = new Date(arr.values[0].formattedValue).toDateString()
                              var signUpObj = {
                                  date: d,
                                  email: arr.values[1].formattedValue,
                                  name: arr.values[2].formattedValue,
                                  kidname: arr.values[3].formattedValue,
                                  grade: arr.values[4].formattedValue,
                              }
                              obj.signUps.push(signUpObj);
                          }
                      }
                  });
                  signUpArr.google.push(obj);
              });
              // console.log(signUpArr);
              // return signUpArr;
          }).catch((err) => {
              console.log(`oops something went wrong`);
              console.log(err);
              $('.the-error').show();
              $(`.the-form`).hide();
          });;
  
          return signUpArr;
  
      })
  */
  .then(function (signUpArr) {
    console.log("sign up genius data ready to find by emails");
    console.log(signUpArr);
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
          var theEventYear = val.endDate;
          theEventYear = theEventYear.split(' ')[3]; // console.log(theEventYear);

          if (currentYear == theEventYear || otherYear == theEventYear) {
            var theEvent = val.title;
            var theEventURL = val.url;
            var theEventStartDate = val.startDate;
            var theEventEndDate = val.endDate;
            var theEventImg = val.img;
            val.signUps.map(function (arr, j) {
              var thisEmail = arr.email.toLowerCase();
              var thisPhone = arr.phone;

              if (thisPhone == undefined) {
                thisPhone = "";
              }

              if (thisEmail == theEmail1 || thisEmail == theEmail2) {
                var elem = "<li>\n                        <a href=\"".concat(theEventURL, "\" target=\"_blank\">\n                            <img src=\"").concat(theEventImg, "\" alt=\"").concat(theEvent, "\">\n                            <h3 class=\"event-title\">").concat(theEvent, "</h3>\n                        </a>\n                        <h4>Date: ").concat(theEventStartDate, " - ").concat(theEventEndDate, "</h4>\n                        <h4>Email: ").concat(arr.email, "</h4>\n                        <h4>Name: ").concat(arr.firstname, " ").concat(arr.lastname, "</h4>\n                        <h4>Phone: ").concat(thisPhone, "</h4>\n                        <!--<h4>Amount Paid: ").concat(arr.amountpaid, "</h4>-->\n                        <h4 class=\"item\">Item: ").concat(arr.item, "</h4>\n                        <h4 class=\"location\">Location: ").concat(arr.location, "</h4>\n                        <h4>Qty: ").concat(arr.qty, "</h4>\n                        <h4>Comments: ").concat(arr.comments, "</h4>\n                        \n                        <!-- <h4>Child: ").concat(arr.kidname, "</h4>\n                        <h4>Grade: ").concat(arr.grade, "</h4>\n                        <h4>Date: ").concat(arr.date, "</h4> -->\n                    </li>");
                message += elem;
              }
            });
          }
        });
        /*
                        signUpArr.google.map((val, i) => {
                            var theEvent = val.title;
                            val.signUps.map((arr, j) => {
                                var thisEmail = arr.email.toLowerCase();
                                if (thisEmail == theEmail1 || thisEmail == theEmail2) {
                                    // console.log(`match`);
                                    // console.log("🚀 ~ file: scripts.js ~ line 56 ~ $.each ~ thisEmail == theEmail", thisEmail == theEmail1);
                                    // console.log("🚀 ~ file: scripts.js ~ line 56 ~ $.each ~ thisEmail == theEmail", thisEmail == theEmail2);
                                    var elem = `<li>
                                    <h3>${theEvent}</h3>
                                    <h4>Email: ${arr.email}</h4>
                                    <h4>Name: ${arr.name}</h4>
                                    <h4>Child: ${arr.kidname}</h4>
                                    <h4>Grade: ${arr.grade}</h4>
                                    <h4>Date: ${arr.date}</h4>
                                </li>`;
        
                                    message += elem;
        
                                }
                            });
                        })
        */
        //!clear all previous submissions

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
        /*
                        //! add up total points
                        var locationsArr = $('.location');
                        var itemsArr = $('.item');
                        console.log(locationsArr, itemsArr);
                        var pointsCount = [];
                        itemsArr.map((i, val) => {
                            // console.log(val);
                            console.log(val.textContent);
                            if (val.textContent.indexOf('pts') !== -1) {
                                pointsCount.push(val.textContent);
                            }
                        });
        
                        itemsArr.map((i, val) => {
                            // console.log(val);
                            console.log(val.textContent);
                            if (val.textContent.indexOf('pts') !== -1) {
                                pointsCount.push(val.textContent);
                            }
                        });
                        console.log(`pointsCount`);
                        console.log(pointsCount);
        
                        //? DEMONSTRATION EMAILS
                        //cherryrose1010@gmail.com
                        //Vph103@yahoo.com
        
                        //? DEMONSTRATION CODE PUT INTO CONSOLE IN BROWSER
                        //? GET THE POINTS
                        
                        var pointsCount = [];
                        var itemsArr =  document.getElementsByClassName('item');
                        for (i = 0; i < itemsArr.length; i++) {
                            //console.log(itemsArr[i].textContent);
                            var pts = itemsArr[i].textContent.split(' ');
                            for (j = 0; j < pts.length; j++) {
                                //console.log(pts[j]);
                                if (pts[j].indexOf('pts') !== -1) {
                                    pts = Number(pts[j].split('pts')[0]);
                                    pointsCount.push(pts);
                                }
                            }
                            // console.log(pts);
                        }
        
                        //console.log(pointsCount);
        
                        //? DO THE MATH & ADD THE POINTS
                        var theCount = 0;
                        for (i = 0; i < pointsCount.length; i++) {
        
                            theCount += pointsCount[i];
        
                        }
        
                        //console.log(theCount);
                        //? DISPLAY THE TOTAL POINTS
                        document.getElementsByClassName('the-points')[0].children[0].innerHTML = theCount;
                        document.getElementsByClassName('the-points')[0].style.display = 'block';
        */

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
