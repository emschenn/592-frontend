var x;
var phase = 0;
var data = {
    "type": null,
    "縣市": null,
    "地區": [],
    "房數": null,
    "格局": [],
    "預算": [0, 50000],
    "其他": []
};
var SERVER_URL = 'http://localhost:8080';

$(document).ready(function() {
    otheroption();
    $(".region--more").hide(700);
    x = $(document).height();
    console.log(x);
    $('[data-toggle="tooltip"]').tooltip();
    //changePage(2);
    //showlist(1, "https://www.ptt.cc/bbs/graduate/index.html", "https://q-cf.bstatic.com/images/hotel/max1024x768/135/135321167.jpg", "dsadsa", "323");
    if (sessionStorage.hasOwnProperty("user")) {
        $("#topage1").addClass("hidden");
        $("#topage2").removeClass("hidden");
        $("#logout").removeClass("hidden");
    }
})


/* phase0 */
$("#rent").click(function() {
    $(".page:nth-of-type(2)").removeClass("hidden");
    $("#rent-form").removeClass("hidden");
    $("#sell-form").addClass("hidden");
    pageScroll(x);
    data["type"] = "rent";
    phase = 1;
    console.log("rent");
})
$("#sell").click(function() {
    $(".page:nth-of-type(2)").removeClass("hidden");
    $("#sell-form").removeClass("hidden");
    $("#rent-form").addClass("hidden");
    pageScroll(x);
    data["type"] = "sell";
    phase = 1;
    console.log("sell");
})



/* phase1-form */

$(".region select").on("change", function() {
    console.log(this.value);
    data["縣市"] = this.value;
    regionmore(this.value);
});

$(".cat select").on("change", function() {
    console.log(this.value);
    data["房數"] = this.value;
    catmore(this.value);
});

function catmore(n) {
    var cat;
    $(".cat--more").html('');
    if (n == 1) {
        cat = ['套房', '雅房'];
    } else {
        cat = ['整層', '整棟'];
    }
    for (i = 0; i < cat.length; i++) {
        $(".cat--more").append(addOption('cat', i + 1, cat[i]));
    }
    $(".cat--more").show(700);
}

function otheroption() {
    var other = ['有車位', '有陽台', '有廚房', '可開伙', '可養寵', '電梯'];
    for (i = 0; i < other.length; i++) {
        $(".other").prepend(addOption('other', i + 1, other[i]));
    }
}

function regionmore(n) {
    $(".region--more").html('');
    $(".region--more").hide();
    if (n == '台南') {
        var tainan = ['永康區', '東區', '北區', '中西區', '安平區', '仁德區', '善化區', '新市區', '南區', '安南區', '新營區', '歸仁區', '麻豆區', '柳營區', '安定區', '佳里區', '新化區', '學甲區'];
        for (i = 0; i < tainan.length; i++) {
            $(".region--more").append(addOption('region', i + 1, tainan[i]));
        }
        $(".region--more").slideDown(700);
    }
}

function addOption(t, i, n) {
    return '<div class="form-check form-check-inline"> <input class="form-check-input" name="' + t + '" type="checkbox" id="' + t + i + '" value="' + n + '"> <label class="form-check-label" for="' + t + i + '">' + n + '</label></div>'
}

$(function() {
    $(".slider-range").slider({
        step: 500,
        range: true,
        min: 2000,
        max: 50000,
        values: [3000, 5000],
        slide: function(event, ui) {
            $("#money-from").val($(".slider-range").slider("values", 0));
            $("#money-to").val($(".slider-range").slider("values", 1));
        }
    });
});

$("#money-from").change(function() {
    $(".slider-range").slider("option", "values", [$("#money-from").val(), $("#money-to").val()]);
});

$("#money-to").change(function() {
    $(".slider-range").slider("option", "values", [$("#money-from").val(), $("#money-to").val()]);
});

$(".other .form-check input[type='text']").change(function() {
    if (data["type"] == "rent")
        $("#rent-otheropt").attr("value", $("#rent-otheropt-input").val());
    else
        $("#sell-otheropt").attr("value", $("#sell-otheropt-input").val());

});

$(".search-submit").click(function() {
    // showlist(0, "google.com", "", "dsadsa", 0);
    console.log($('.other .form-check-input:checked').val());
    $(".page:nth-of-type(3)").removeClass("hidden");
    pageScroll(2 * x);
    var r = [],
        c = [],
        o = [];
    $.each($("input[name='region']:checked"), function() {
        r.push($(this).val());
    });
    $.each($("input[name='cat']:checked"), function() {
        c.push($(this).val());
    });
    $.each($("input[name='other']:checked"), function() {
        o.push($(this).val());
    });
    data["地區"] = r;
    data["格局"] = c;
    data["其他"] = o;
    if (data["type"] == "rent") {
        data["預算"][0] = $("#money-from").val();
        data["預算"][1] = $("#money-to").val();
    } else {
        data["預算"][0] = $("#money").val();
    }
    phase = 2;
    console.log(data);
    $(".page .result").html("");
    

    for (var i = 0; i < 8; i++) {
        showlist(0, faker.internet.url(), faker.image.city(), faker.lorem.paragraph(), 0);
    }


    /*
    $.ajax({
        url: SERVER_URL + "/search",
        type: "POST",
        data: {
            data
        },
        success: function(res) {
            console.log("search success");
            console.log(res);
            for (var i = 0; i < res.length; i++) {
                showlist(0, res[i].link, res[i].image, res[i].description, 0);
            }
        },
        error: function(err) {
            console.log(err);
        }
    });
    */
});

/* phase2-list */

$(".fa-heart").hover(function() {
    $(this).toggleClass("fas");
    $(this).toggleClass("white");

    $(this).toggleClass("far");
    $(this).toggleClass("orange");
});

$(".page .fa-heart").click(function() {
    event.stopPropagation();
    var url = $(this).parent().parent().attr('href');
    var img = $(this).parent().siblings(".col-lg-4").children("img").attr('src');
    var des = $(this).siblings(".result-row--item").children(".col").text();
    $(this).parent().parent().hide('fade', 700, function() {
        $(this).remove();
    });
    console.log(img);
    console.log(des);
    console.log(url);
    /*
    if (sessionStorage.hasOwnProperty("user")) {
        $.ajax({
            url: SERVER_URL + "/list/add",
            type: "POST",
            data: {
                description: des,
                link: url,
                image: img
            },
            success: function(res) {
                console.log("add success");

            },
            error: function(err) {
                console.log(err);
            }
        });
    }
    */
});





function showMYlist() {
    $(".mypage .result").html("");
    console.log("ss");
    showlist(1, faker.internet.url(), faker.image.city(), faker.lorem.paragraph(), "1");
    showlist(1, faker.internet.url(), faker.image.city(), faker.lorem.paragraph(), "2");
    showlist(1, faker.internet.url(), faker.image.city(), faker.lorem.paragraph(), "3");

    /*
    $.ajax({
        url: SERVER_URL + "/list",
        type: "GET",
        data: {},
        success: function(res) {
            console.log(res);
            for (var i = 0; i < res.length; i++) {
                showlist(1, res[i].link, res[i].image, res[i].description, res[i]._id);
            }
        },
        error: function(err) {
            console.log(err);
        }
    });
    */
}

function showlist(n, link, img, des, id) {

    //$('[data-toggle="tooltip"]').tooltip();
    if (n == 0) {
        var hearthover = ""
        if (!sessionStorage.hasOwnProperty("user")) hearthover = "欲收藏請先登入";
        else hearthover = "收藏";
        var item = '<div class="row result-row " id="' + link + '" onclick="javascript:gotolink(this.id)" >' +
            '<div class="col-lg-4"> <div class="img-container"> <img src="' + img + '"> </div> </div>' +
            '<div class="col-lg-8 ">' +
            '<i class="far white fa-heart"  data-toggle="tooltip" data-placement="right" title="' + hearthover + '"></i>' +
            '<div class="row result-row--item "> <div id="r-other " class="col">' + des +
            '</div></div></div></div>';
        $(".page .result").append(item);
    } else {
        var item = '<div class="row result-row " id="' + link + '" onclick="javascript:gotolink(this.id)" >' +
            '<div class="col-lg-4"> <div class="img-container"> <img src="' + img + '"> </div> </div>' +
            '<div class="col-lg-8 "> ' +
            '<i class="fas white fa-heart"  data-toggle="tooltip" data-placement="right" id="' + id + '" title="移除收藏 "></i>' +
            '<div class="row result-row--item "> <div id="r-other " class="col">' + des +
            '</div></div></div></div>';
        $(".mypage .result").append(item);
    }
    $('[data-toggle="tooltip"]').tooltip();
    $(".fa-heart").hover(function() {
        $(this).toggleClass("fas");
        $(this).toggleClass("white");
        $(this).toggleClass("far");
        $(this).toggleClass("orange");
    });
    $(".page .fa-heart").click(function() {
        event.stopPropagation();
        var url = $(this).parent().parent().attr('id');
        var img = $(this).parent().parent().children(".col-lg-4").children(".img-container").children("img").attr('src');
        var des = $(this).siblings(".result-row--item").children(".col").text();
        console.log(img);
        console.log(des);
        console.log(url);
        /*
        if (sessionStorage.hasOwnProperty("user")) {
            $.ajax({
                url: SERVER_URL + "/list/add",
                type: "POST",
                data: {
                    description: des,
                    link: url,
                    image: img
                },
                success: function(res) {
                    console.log("add success");
                },
                error: function(err) {
                    console.log(err);
                }
            });
        }
        */
    });
    $(".mypage .fa-heart").click(function() {
        event.stopPropagation();
        var id = $(this).attr("id");
        console.log("id= " + id);
        var s = 0;
        var a = $(this).parent().parent();
        
        s = 1;
        a.hide('fade', 500, function() {
            console.log("remove!");
        });
        console.log("delete success");
        /*
        $.ajax({
            url: SERVER_URL + "/list/" + id,
            type: "DELETE",
            data: {},
            success: function(res) {
                // $(this).parent().parent().hide('fade', 500, function() {
                //     $(this).remove();
                // });
                s = 1;
                a.hide('fade', 500, function() {
                    console.log("remove!");
                });
                console.log("delete success");
            },
            error: function(err) {
                console.log(err);
            }
        });
        */
        if (s == 1) a.remove();
    });
}



/* login-reg page */
$("#reg").click(function() {
    $(".loginpage input").val("");
    $("#reg").addClass("choose");
    $("#login").removeClass("choose");
    $("#login-form").addClass("hidden");
    $("#reg-form").removeClass("hidden");
})

$("#login").click(function() {
    $(".loginpage input").val("");

    $("#login").addClass("choose");
    $("#reg").removeClass("choose");
    $("#reg-form").addClass("hidden");
    $("#login-form").removeClass("hidden");
})

$("#reg-submit").click(function() {
    var valid = 0;
    console.log($("#reg-user").val());
    console.log($("#reg-pwd").val());
    if ($("#reg-user").val() == "") {
        $("#reg-user").addClass("is-invalid")
        valid = 1;
    }
    if ($("#reg-pwd").val() == "") {
        $("#reg-pwd").addClass("is-invalid")
        valid = 1;
    }
    if ($("#reg-email").val() == "" || !(/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test($("#reg-email").val()))) {
        $("#reg-email").addClass("is-invalid")
        valid = 1;
    }
    if (valid == 0) {
        //$('#reg-modal').modal('show');
        console.log("register -send post request");
        
        $('#reg-modal').modal('show');
        console.log("register success");
        /*
        $.ajax({
            url: SERVER_URL + "/user/register",
            type: "POST",
            data: {
                username: $("#reg-user").val(),
                password: $("#reg-pwd").val(),
                email: $("#reg-email").val()
            },
            success: function(res) {
                $('#reg-modal').modal('show');
                console.log("register success");
            },
            error: function(err) {
                console.log(err);
            }
        });
        */
    }
})
$(".modal-body button").click(function() {
    $("#login").click();
});

$("#login-submit").click(function() {
    var valid = 0;
    console.log($("#login-user").val());
    console.log($("#login-pwd").val());
    if ($("#login-user").val() == "") {
        $("#login-user").addClass("is-invalid")
        valid = 1;
    }
    if ($("#login-pwd").val() == "") {
        $("#login-pwd").addClass("is-invalid")
        valid = 1;
    }
    if (valid == 0) {
        console.log("login -send post request");
        
        changePage(0);
        sessionStorage.user = $("#login-user").val();
        $("#topage1").addClass("hidden");
        $("#topage2").removeClass("hidden");
        $("#logout").removeClass("hidden");
        console.log("login success");
        /*
        $.ajax({
            url: SERVER_URL + "/user/login",
            type: "POST",
            data: {
                username: $("#login-user").val(),
                password: $("#login-pwd").val()
            },
            success: function(res) {
                changePage(0);
                sessionStorage.user = $("#login-user").val();
                $("#topage1").addClass("hidden");
                $("#topage2").removeClass("hidden");
                $("#logout").removeClass("hidden");
                console.log("login success");
            },
            error: function(err) {
                console.log(err);
            }
        });
        */
    }
})

$(".loginpage input").change(function() {
    if ($(this).val() != "")
        $(this).removeClass("is-invalid");
})

$("#logout").click(function() {
    $("#topage1").removeClass("hidden");
    $("#topage2").addClass("hidden");
    $("#logout").addClass("hidden");
    changePage(0);
    
    sessionStorage.removeItem('user');
    console.log("logout success");
    changePage(0);
    /*
    $.ajax({
        url: SERVER_URL + "/user/logout",
        type: "POST",
        data: {},
        success: function(res) {
            sessionStorage.removeItem('user');
            console.log("logout success");
            changePage(0);
        },
        error: function(err) {
            console.log(err);
        }
    });
    */
});



function gotolink(url) {
    console.log(url);
    //  console.log($(this).children("url").text());
    window.open(url);
};


function pageScroll(x) {
    $('body,html').animate({ scrollTop: x }, 800);
}

function changePage(n) {
    if (n == 0) { //home page
        $(".page:nth-of-type(1)").removeClass("hidden");
        if (phase == 1)
            $(".page:nth-of-type(2)").removeClass("hidden");
        if (phase == 2) {
            $(".page:nth-of-type(2)").removeClass("hidden");
            $(".page:nth-of-type(3)").removeClass("hidden");
        }
        $(".loginpage").addClass("hidden");
        $(".mypage").addClass("hidden");
        $("body").css("background-color", "rgb(240, 238, 236)");

    } else if (n == 1) { //login page
        $(".page").addClass("hidden");
        $(".loginpage").removeClass("hidden");
        $(".mypage").addClass("hidden");
        $("#reg").click();

    } else if (n == 2) { //list page
        $(".page").addClass("hidden");
        $(".loginpage").addClass("hidden");
        $(".mypage").removeClass("hidden");
        $("body").css("background-color", "white");
        showMYlist();
    }
}