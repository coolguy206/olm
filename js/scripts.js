import $ from "jquery";
// require('dotenv').config()
// console.log(process.env)

// const dotenv = require('dotenv');
// dotenv.config();
// console.log(process.env);

// console.log(process.env)

var GOOGLE_API_KEY = "AIzaSyD-bqqEqVuD1nhHqjozx5VnDAwKMGgpE7c";
var SIGNUP_GENIUS_KEY = `?user_key=V0FzMkxZcmVOZlVnclZMVEl6dGhWQT09`;

//? to test error
// var GOOGLE_API_KEY = "xyz";
// var SIGNUP_GENIUS_KEY = "xyz";

var sheet_id = `1-2g3tZj_hjCnSxLquhs3uAAXTm4UZQ8AxDBPCvzKcTE`;
var baseURL = `https://sheets.googleapis.com/v4/spreadsheets/`;
var range = `A:Z`;

var sGBaseURL = `https://api.signupgenius.com/v2/k/`;
var sGSignUps = `signups/created/all/`;
var sGReports = `signups/report/all/`;


var message = ``;

$(document).ready(function () {
    console.log(`page ready`);

    var signUpArr = {
        genius: [],
        google: []
    };

    //? GET SIGNUPS FROM SIGNUP GENIUS
    fetch(`${sGBaseURL}${sGSignUps}${SIGNUP_GENIUS_KEY}`).then((data) => { return data.json() }).then((data) => {
        // console.log(data);

        data.data.map((val, i) => {
            // console.log(val);
            var d = val.startdatestring;
            d = d.split(` `)[0];
            // console.log(d);
            var date = new Date(d).toDateString();
            var obj = {
                title: val.title,
                id: val.signupid,
                url: val.signupurl,
                img: val.mainimage,
                date: date
            }
            signUpArr.genius.push(obj);
            // console.log(obj);
        });
        // console.log(`signUpArr`);
        // console.log(signUpArr);

        return signUpArr;

        //? GET THE REPORTS FROM SIGNUP GENIUS
    }).then((signUpArr) => {
        signUpArr.genius.map((val, i) => {
            fetch(`${sGBaseURL}${sGReports}${val.id}/${SIGNUP_GENIUS_KEY}`).then((data) => { return data.json() }).then((data) => {
                // console.log(`reports`);
                // console.log(data);
                // console.log(`signup`);

                val.signUps = [];
                // console.log(val);
                data.data.signup.map((arr, j) => {
                    if (arr.email !== ``) {
                        var obj = {
                            amountpaid: arr.amountpaid,
                            email: arr.email,
                            firstname: arr.firstname,
                            lastname: arr.lastname,
                            phone: arr.phone,
                            item: arr.item,
                            comments: arr.comment
                        }
                        val.signUps.push(obj);
                    }
                });
                // console.log(val);
            }).catch((err) => {
                console.log(`oops something went wrong`);
                console.log(err);
                $('.the-error').show();
                $(`.the-form`).hide();
            });
            // console.log(`outside fetch`);
            // console.log(signUpArr);
        });

        return signUpArr;

        //? GET GOOGLE SHEETS
    }).then((signUpArr) => {
        fetch(`${baseURL}${sheet_id}?key=${GOOGLE_API_KEY}&includeGridData=true`).then((data) => { return data.json() }).then((data) => {
            console.log(`google sheets`);
            console.log(data);

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

    }).then((signUpArr) => {
        console.log(signUpArr);
        console.log(`all good`);
        $(`.the-form`).show();

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

            if (theEmail1 !== `` || theEmail2 !== ``) {

                //?execute the loop
                signUpArr.genius.map((val, i) => {
                    var theEvent = val.title;
                    var theEventURL = val.url;
                    var theEventDate = val.date;
                    var theEventImg = val.img;

                    val.signUps.map((arr, j) => {
                        var thisEmail = arr.email.toLowerCase();
                        if (thisEmail == theEmail1 || thisEmail == theEmail2) {
                            var elem = `<li>
                        <a href="${theEventURL}" target="_blank">
                            <img src="${theEventImg}" alt="${theEvent}">
                            <h3>${theEvent}</h3>
                        </a>
                        <h4>Email: ${arr.email}</h4>
                        <h4>Name: ${arr.firstname} ${arr.lastname}</h4>
                        <h4>Amount Paid: ${arr.amountpaid}</h4>
                        <h4>Item: ${arr.item}</h4>
                        <h4>Comments: ${arr.comments}</h4>
                        <h4>Phone: ${arr.phone}</h4>
                        <!-- <h4>Child: ${arr.kidname}</h4>
                        <h4>Grade: ${arr.grade}</h4>
                        <h4>Date: ${arr.date}</h4> -->
                    </li>`;

                            message += elem;
                        }
                    });
                });

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
            }


        });

    }).catch((err) => {
        console.log(`oops something went wrong`);
        console.log(err);
        $('.the-error').show();
        $(`.the-form`).hide();
    });


});



