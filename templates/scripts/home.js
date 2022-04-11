$(document).ready(function () {
    // ### 初始化 materializecss 组件 ###
    $('.tooltipped').tooltip({delay: 50});
    // $('.carousel').carousel();
    $('.carousel.carousel-slider').carousel({ full_width: true });

    // 初始化轮播组件
    $(document).ready(function () {
        // $('.slider').slider({ full_width: true });
        $('.slider').slider({ full_width: true, indicators: false });
    });

    // 初始化折叠组件
    // $('.collapsible').collapsible();
    $('.collapsible').collapsible({
        accordion: false,
        onOpen: function (el) {
            // 获取视频 ID
            let obj = $(el[0]).children("div")[0];
            let vid = $(obj).attr('id');
            console.log(vid);
            
            // 获取当前视频序号, 并设置当前视频
            let index = $(el[0]).attr("index");
            // console.log(index);
            currentVideo = listedVideos[index]

            // 当 open 视频折叠页后, 去查询视频详细信息
            selectVideo(vid);
         }, // 回调当开启开启时
        onClose: function (el) { 

         } // 回调当关闭时
    }
    );

    // 初始化字符计数器
    $('input#input_text, textarea#textarea1').characterCounter();

    // 初始化模态
    $('.modal').modal();

    DEFAULT_COOKIE_EXPIRE_TIME = 30;

    uname = '';
    session = '';
    uid = 0;
    currentVideo = null;
    listedVideos = null;

    session = getCookie('session');
    uname = getCookie('username');

    initPage(function () {
        if (listedVideos !== null) {
            currentVideo = listedVideos[0];
            selectVideo(listedVideos[0]['id']);
        }

        $(".video-item").click(function () {
            var self = this.id
            listedVideos.forEach(function (item, index) {
                if (item['id'] === self) {
                    currentVideo = item;
                    return
                }
            });

            selectVideo(self);
        });

        $(".del-video-button").click(function () {
            var id = this.id.substring(4);
            deleteVideo(id, function (res, err) {
                if (err !== null) {
                    Materialize.toast('Failed to delete video resource', 3000, 'rounded')
                    return;
                }
                console.log("del-video-button callback, vid = ", id)
                // 发送一个请求给 scheduler 插入当前 vid 至 video_del_rec 表(等待 scheduler 后续删除)
                addVideoDelRec(id)

                var msg = "Successfully deleted video: " + id;
                Materialize.toast(msg, 3000, 'rounded')
                location.reload();
            });
        });

        $("#submit-comment").on('click', function () {
            var content = $("#comments-input").val();
            postComment(currentVideo['id'], content, function (res, err) {
                if (err !== null) {
                    Materialize.toast('Failed to submit comments', 3000, 'rounded')
                    return;
                }

                if (res === "ok") {
                    var msg = "New comment posted";
                    Materialize.toast(msg, 3000, 'rounded')
                    $("#comments-input").val("");

                    refreshComments(currentVideo['id']);
                }
            });
        });
    });

    // home page event registry
    $("#regbtn").on('click', function (e) {
        $("#regbtn").text('Loading...')
        e.preventDefault()
        registerUser(function (res, err) {
            if (err != null) {
                $('#regbtn').text("Register")
                Materialize.toast('Invalid/duplicate username', 3000, 'rounded')
                return;
            }

            var obj = JSON.parse(res);
            setCookie("session", obj["session_id"], DEFAULT_COOKIE_EXPIRE_TIME);
            setCookie("username", uname, DEFAULT_COOKIE_EXPIRE_TIME);
            $("#regsubmit").submit();
        });
    });

    $("#signinbtn").on('click', function (e) {

        $("#signinbtn").text('Loading...')
        e.preventDefault();
        signinUser(function (res, err) {
            if (err != null) {
                $('#signinbtn').text("Sign In");
                Materialize.toast('Invalid username or pwd', 3000, 'rounded')
                return;
            }

            var obj = JSON.parse(res);
            setCookie("session", obj["session_id"], DEFAULT_COOKIE_EXPIRE_TIME);
            setCookie("username", uname, DEFAULT_COOKIE_EXPIRE_TIME);
            $("#signinsubmit").submit();
        });
    });

    $("#signinhref").on('click', function () {
        $("#regsubmit").hide();
        $("#signinsubmit").show();
    });

    $("#registerhref").on('click', function () {
        $("#regsubmit").show();
        $("#signinsubmit").hide();
    });

    // userhome event register
    $("#upload").on('click', function () {
        Materialize.toast('Upload click', 3000, 'rounded')
        $("#uploadvideomodal").show();
    });


    $("#uploadform").on('submit', function (e) {
        e.preventDefault()
        var vname = $('#vname').val();

        createVideo(vname, function (res, err) {
            if (err != null) {
                Materialize.toast('Failed to upload video', 3000, 'rounded')
                return;
            }

            var obj = JSON.parse(res);
            var formData = new FormData();
            formData.append('file', $('#inputFile')[0].files[0]);

            $.ajax({
                url: 'http://' + window.location.hostname + ':8080/upload/' + obj['id'],
                type: 'POST',
                data: formData,
                //headers: {'Access-Control-Allow-Origin': 'http://127.0.0.1:9000'},
                crossDomain: true,
                processData: false,  // tell jQuery not to process the data
                contentType: false,  // tell jQuery not to set contentType
                success: function (data) {
                    // console.log(data);
                    // $('#uploadvideomodal').hide();
                    location.reload();
                },
                complete: function (xhr, textStatus) {
                    if (xhr.status === 204) {
                        Materialize.toast('Video upload completed', 3000, 'rounded')
                        return;
                    }
                    if (xhr.status === 400) {
                        // $("#uploadvideomodal").hide();
                        Materialize.toast('File is too big', 3000, 'rounded')
                        return;
                    }
                }

            });
        });
    });

    $(".close").on('click', function () {
        $("#uploadvideomodal").hide();
    });

    $("#logout").on('click', function () {
        setCookie("session", "", -1)
        setCookie("username", "", -1)
    });


    $(".video-item").click(function () {
        var url = 'http://' + window.location.hostname + ':9000/videos/' + this.id
        var video = $("#curr-video");
        video[0].attr('src', url);
        video.load();
    });
});

function initPage(callback) {
    getUserId(function (res, err) {
        var url = window.location.href;
        // TODO: 暂时只有两个页面，userhome 页面需要检查用户信息，登录/注册页无需
        if (err != null && url.indexOf("userhome") !== -1) {
            Materialize.toast('You must sign in to access this site', 3000, 'rounded')
            return;
        }

        var obj = JSON.parse(res);
        uid = obj['id'];
        listAllVideos(function (res, err) {
            if (err != null) {
                Materialize.toast('Failed to obtain video resources', 3000, 'rounded')
                return;
            }
            var obj = JSON.parse(res);
            listedVideos = obj['videos'];
            obj['videos'].forEach(function (item, index) {
                var ele = `<li class="${index === 0 ? 'active' : ''}" index="${index}">
                            <div class="collapsible-header" id="${item['id']}">
                                <div class="chip">
                                    ${item['name']}
                                </div>
                            </div>
                        </li>`
                // if (index === 0) {
                //     console.log(ele)
                // }
                $("#items").append(ele);
            });
            callback();
        });
    });
}

function setCookie(cname, cvalue, exmin) {
    var d = new Date();
    d.setTime(d.getTime() + (exmin * 60 * 1000));
    var expires = "expires=" + d.toUTCString();
    document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/";
}

function getCookie(cname) {
    var name = cname + "=";
    var ca = document.cookie.split(';');
    for (var i = 0; i < ca.length; i++) {
        var c = ca[i];
        while (c.charAt(0) == ' ') {
            c = c.substring(1);
        }
        if (c.indexOf(name) == 0) {
            return c.substring(name.length, c.length);
        }
    }
    return "";
}

// DOM operations
function selectVideo(vid) {
    var url = 'http://' + window.location.hostname + ':8080/videos/' + vid
    // var video = $("#curr-video");
    $("#curr-video:first-child").attr('src', url);
    $("#curr-video-name").text(currentVideo['name']);
    $("#curr-video-ctime").text(currentVideo['display_ctime']);
    $("#video-owner").text(currentVideo['author']);
    refreshComments(vid);
}

function refreshComments(vid) {
    listAllComments(vid, function (res, err) {
        if (err !== null) {
            Materialize.toast('Failed to get comment resources', 3000, 'rounded');
            return;
        }

        var obj = JSON.parse(res);
        $("#comments-history").empty();
        if (obj['comments'] === null) {
            $("#comments-total").text('0');
        } else {
            $("#comments-total").text(obj['comments'].length);
        }
        obj['comments'].forEach(function (item, index) {
            // console.log(item);
            var ele = `<div>
                <strong style="font-size: 16px;">${item['author']}</strong> <span class="gray"
                    style="font-size: 13px;">${item['time']}</span>
                <div class="card-panel black">
                    <span class="grey-text">
                        ${item['content']}
                    </span>
                </div>
            </div>`;
            $("#comments-history").append(ele);
        });
    });
}

// Async ajax methods

// User operations
function registerUser(callback) {
    var username = $("#username").val();
    var pwd = $("#pwd").val();
    var apiUrl = window.location.hostname + ':8080/api';

    if (username == '' || pwd == '') {
        callback(null, err);
    }

    var reqBody = {
        'user_name': username,
        'pwd': pwd
    }

    var dat = {
        'url': 'http://' + window.location.hostname + ':8000/user',
        'method': 'POST',
        'req_body': JSON.stringify(reqBody)
    };


    $.ajax({
        url: 'http://' + window.location.hostname + ':8080/api',
        type: 'post',
        data: JSON.stringify(dat),
        statusCode: {
            500: function () {
                callback(null, "internal error");
            }
        },
        // complete: function (xhr, textStatus) {
        //     if (xhr.status >= 400) {
        //         console.log("2");
        //         callback(null, "Error of Signin");
        //         return;
        //     }
        // }
    }).done(function (data, statusText, xhr) {
        if (xhr.status >= 400) {
            // console.log("3");
            callback(null, "Error of register");
            return;
        }
        // console.log("4");

        uname = username;
        callback(data, null);
    });
}

function signinUser(callback) {
    var username = $("#susername").val();
    var pwd = $("#spwd").val();
    var apiUrl = window.location.hostname + ':8080/api';

    if (username == '' || pwd == '') {
        callback(null, err);
    }

    var reqBody = {
        'user_name': username,
        'pwd': pwd
    }

    var dat = {
        'url': 'http://' + window.location.hostname + ':8000/user/' + username,
        'method': 'POST',
        'req_body': JSON.stringify(reqBody)
    };

    $.ajax({
        url: 'http://' + window.location.hostname + ':8080/api',
        type: 'post',
        data: JSON.stringify(dat),
        statusCode: {
            500: function () {
                callback(null, "Internal error");
            }
        },
        complete: function (xhr, textStatus) {
            if (xhr.status >= 400) {
                callback(null, "Error of Signin");
                return;
            }
        }
    }).done(function (data, statusText, xhr) {
        if (xhr.status >= 400) {
            callback(null, "Error of Signin");
            return;
        }
        uname = username;

        callback(data, null);
    });
}

function getUserId(callback) {
    var dat = {
        'url': 'http://' + window.location.hostname + ':8000/user/' + uname,
        'method': 'GET'
    };

    $.ajax({
        url: 'http://' + window.location.hostname + ':8080/api',
        type: 'post',
        data: JSON.stringify(dat),
        headers: {'X-Session-Id': session},
        statusCode: {
            500: function () {
                callback(null, "Internal Error");
            }
        },
        complete: function (xhr, textStatus) {
            if (xhr.status >= 400) {
                callback(null, "Error of getUserId");
                return;
            }
        }
    }).done(function (data, statusText, xhr) {
        callback(data, null);
    });
}

// Video operations
function createVideo(vname, callback) {
    var reqBody = {
        'author_id': uid,
        'name': vname
    };

    var dat = {
        'url': 'http://' + window.location.hostname + ':8000/user/' + uname + '/videos',
        'method': 'POST',
        'req_body': JSON.stringify(reqBody)
    };

    $.ajax({
        url: 'http://' + window.location.hostname + ':8080/api',
        type: 'post',
        data: JSON.stringify(dat),
        headers: {'X-Session-Id': session},
        statusCode: {
            500: function () {
                callback(null, "Internal error");
            }
        },
        complete: function (xhr, textStatus) {
            if (xhr.status >= 400) {
                callback(null, "Error of Signin");
                return;
            }
        }
    }).done(function (data, statusText, xhr) {
        if (xhr.status >= 400) {
            callback(null, "Error of Signin");
            return;
        }
        callback(data, null);
    });
}

function listAllVideos(callback) {
    var dat = {
        'url': 'http://' + window.location.hostname + ':8000/user/' + uname + '/videos',
        'method': 'GET',
        'req_body': ''
    };

    $.ajax({
        url: 'http://' + window.location.hostname + ':8080/api',
        type: 'post',
        data: JSON.stringify(dat),
        headers: {'X-Session-Id': session},
        statusCode: {
            500: function () {
                callback(null, "Internal error");
            }
        },
        complete: function (xhr, textStatus) {
            if (xhr.status >= 400) {
                callback(null, "Error of Signin");
                return;
            }
        }
    }).done(function (data, statusText, xhr) {
        if (xhr.status >= 400) {
            callback(null, "Error of Signin");
            return;
        }
        callback(data, null);
    });
}

function deleteVideo(vid, callback) {
    var dat = {
        'url': 'http://' + window.location.hostname + ':8000/user/' + uname + '/videos/' + vid,
        'method': 'DELETE',
        'req_body': ''
    };

    $.ajax({
        url: 'http://' + window.location.hostname + ':8080/api',
        type: 'post',
        data: JSON.stringify(dat),
        headers: {'X-Session-Id': session},
        statusCode: {
            500: function () {
                callback(null, "Internal error");
            }
        },
        complete: function (xhr, textStatus) {
            if (xhr.status >= 400) {
                callback(null, "Error of Signin");
                return;
            }
        }
    }).done(function (data, statusText, xhr) {
        if (xhr.status >= 400) {
            callback(null, "Error of Signin");
            return;
        }
        callback(data, null);
    });
}

// Comments operations
function postComment(vid, content, callback) {
    var reqBody = {
        'author_id': uid,
        'content': content
    }

    var dat = {
        'url': 'http://' + window.location.hostname + ':8000/videos/' + vid + '/comments',
        'method': 'POST',
        'req_body': JSON.stringify(reqBody)
    };

    $.ajax({
        url: 'http://' + window.location.hostname + ':8080/api',
        type: 'post',
        data: JSON.stringify(dat),
        headers: {'X-Session-Id': session},
        statusCode: {
            500: function () {
                callback(null, "Internal error");
            }
        },
        complete: function (xhr, textStatus) {
            if (xhr.status >= 400) {
                callback(null, "Error of Signin");
                return;
            }
        }
    }).done(function (data, statusText, xhr) {
        if (xhr.status >= 400) {
            callback(null, "Error of Signin");
            return;
        }
        callback(data, null);
    });
}

function listAllComments(vid, callback) {
    var dat = {
        'url': 'http://' + window.location.hostname + ':8000/videos/' + vid + '/comments',
        'method': 'GET',
        'req_body': ''
    };

    $.ajax({
        url: 'http://' + window.location.hostname + ':8080/api',
        type: 'post',
        data: JSON.stringify(dat),
        headers: {'X-Session-Id': session},
        statusCode: {
            500: function () {
                callback(null, "Internal error");
            }
        },
        complete: function (xhr, textStatus) {
            if (xhr.status >= 400) {
                callback(null, "Error of Signin");
                return;
            }
        }
    }).done(function (data, statusText, xhr) {
        if (xhr.status >= 400) {
            callback(null, "Error of Signin");
            return;
        }
        callback(data, null);
    });
}

// TODO: 待测试
function addVideoDelRec(vid) {
    console.log("vid = " + vid)
    var dat = {
        'url': 'http://' + window.location.hostname + ':9001/video-delete-record/' + vid,
        'method': 'GET',
        'req_body': ''
    };

    $.ajax({
        url: 'http://' + window.location.hostname + ':8080/api',
        type: 'post',
        data: JSON.stringify(dat),
        headers: {'X-Session-Id': session},
        statusCode: {
            500: function () {
            }
        },
        complete: function (xhr, textStatus) {
        }
    }).done(function (data, statusText, xhr) {
    });
}