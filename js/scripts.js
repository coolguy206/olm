import $ from "jquery";
// require('dotenv').config()
// console.log(process.env)

// const dotenv = require('dotenv');
// dotenv.config();
// console.log(process.env);

// console.log(process.env)

var GOOGLE_API_KEY = "AIzaSyD-bqqEqVuD1nhHqjozx5VnDAwKMGgpE7c";
//? to test error
// var GOOGLE_API_KEY = "xyz";
var sheet_id = `1-2g3tZj_hjCnSxLquhs3uAAXTm4UZQ8AxDBPCvzKcTE`;
var baseURL = `https://sheets.googleapis.com/v4/spreadsheets/`;
var range = `A:Z`;


var message = ``;

$(document).ready(function () {
    console.log(`page ready`);
    $.get(`${baseURL}${sheet_id}?key=${GOOGLE_API_KEY}&includeGridData=true`, function (data) {

        console.log(`all good`);
        console.log(data);
        $('.the-form').show();

        var theSheets = data.sheets;

        $('form').on('submit', function (e) {
            e.preventDefault();

            //! reset message var
            message = ``;

            //! reset error message & ul
            $('.error-message, ul').hide();

            var theEmail1 = $('input[name="email1"]').val().toLowerCase();
            var theEmail2 = $('input[name="email2"]').val().toLowerCase();
            // console.log("🚀 ~ file: scripts.js ~ line 52 ~ $ ~ theEmail", theEmail1)
            // console.log("🚀 ~ file: scripts.js ~ line 53 ~ $ ~ theEmail", theEmail2)

            //?execute the loop
            $.each(theSheets, function (i, val) {
                // console.log("🚀 ~ file: scripts.js ~ line 43 ~ $.each ~ val", val)

                var theEvent = val.properties.title;
                // console.log("🚀 ~ file: scripts.js ~ line 47 ~ $.each ~ theEvent", theEvent);

                //? loop the rowData to find email
                $.each(val.data[0].rowData, function (j, str) {

                    if (j !== 0) {

                        var thisDate = str.values[0].formattedValue;
                        var thisEmail = str.values[1].formattedValue;
                        var thisName = str.values[2].formattedValue;
                        var thisChild = str.values[3].formattedValue;
                        var thisGrade = str.values[4].formattedValue;
                        // console.log("🚀 ~ file: scripts.js ~ line 53 ~ $.each ~ thisEmail", thisEmail);

                        if (thisEmail !== undefined) {

                            thisEmail = thisEmail.toLowerCase();

                            if (thisEmail == theEmail1 || thisEmail == theEmail2) {
                                // console.log(`match`);
                                // console.log("🚀 ~ file: scripts.js ~ line 56 ~ $.each ~ thisEmail == theEmail", thisEmail == theEmail1);
                                // console.log("🚀 ~ file: scripts.js ~ line 56 ~ $.each ~ thisEmail == theEmail", thisEmail == theEmail2);
                                var elem = `<li>
                                    <h3>${theEvent}</h3>
                                    <h4>Email: ${thisEmail}</h4>
                                    <h4>Name: ${thisName}</h4>
                                    <h4>Child: ${thisChild}</h4>
                                    <h4>Grade: ${thisGrade}</h4>
                                    <h4>Date: ${thisDate}</h4>
                                </li>`;

                                message += elem;

                            }

                        }

                    }

                });

            });

            //!clear all previous submissions
            $('ul').empty();

            if (message !== ``) {

                //?display on page
                $('ul').append(message);
                $('ul').css('display', 'flex');

            } else {

                //!display error message
                $('.error-message').show();

            }

            //! find duplicates and highlight them
            var titles = $('ul h3');
            // console.log("🚀 ~ file: scripts.js ~ line 99 ~ titles", titles)

            for (var i = 0; i < titles.length - 1; i++) {

                if (titles[i + 1].innerHTML == titles[i].innerHTML) {
                    // console.log(`match`);
                    // console.log(titles[i + 1].innerHTML);
                    // console.log(titles[i].innerHTML);

                    $(titles[i + 1]).closest('li').addClass('duplicate');
                    $(titles[i]).closest('li').addClass('duplicate');
                }
            }

        });

        //! if .get fails show the error message to contact developer
    }).fail(function (err) {

        console.log(`something went wrong`);
        // console.log(err);
        $('.the-error').show();

    });

});


