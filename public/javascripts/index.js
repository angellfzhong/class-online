//显示注册层
function showRegist() {
    $("#cover").fadeIn();
    $("#regist-back").fadeIn();
}
//隐藏注册层
$("#cover").click(function () {
    $("#cover").fadeOut()
    $("#regist-back").fadeOut()
    $("#tip-back").fadeOut()
})
//显示注册提示
function showWarning(text) {
    $("#reg-back").fadeOut()
    $("#regsuccess").fadeIn()
    $("#warning").fadeIn()
    $("#warning").html(text)
}
//显示提示层
function showTip() {
    $("#cover").fadeIn();
    $("#tip-back").fadeIn();
}
//隐藏提示层
function hideTip() {
    $("#cover").fadeOut();
    $("#tip-back").fadeOut();
}

//隐藏错误提示框
function hideWarning() {
    $("#warning").html('')
    $("#warning").fadeOut()
}

$("#userpassword").keydown(function () {
    if ($("#userpassword").val().length >= 4) hideWarning()
})

$("#username").keydown(function () {
    hideWarning()
})

//验证并提交注册信息
$("#registbtn").click(function ($event) {
    if ($("#username").val() == '') {
        $("#warning").html('请输入用户名')
        $("#warning").fadeIn()
        $("#username").focus()
        return
    }
    else if ($("#userpassword").val() == '' || $("#userpassword").val().length < 4) {
        $("#warning").html('请输入4-10位的密码')
        $("#warning").fadeIn()
        $("#userpassword").focus()
        return
    } else {
        //使用formData上传用户资料
        var formData = new FormData()
        var selectimg = document.querySelector("#selectimg")
        formData.append("username", $("#username").val().trim())
        formData.append("password", $("#userpassword").val().trim())
        //用户头像
        formData.append("userimg", selectimg.files[0]);
        $.ajax({
            url: "/regist",
            type: "POST",
            data: formData,
            processData: false,  // 不处理数据
            contentType: false,   // 不设置内容类型
            success: function (result) {
                if (result == "1") {
                    $("#regist-back").html('<div class="alert alert-success">注册成功！将自动跳转</div>')
                    setTimeout(function () {
                        window.location = "/";
                    }, 2000)
                } else if (result == "-1") {
                    showWarning("用户名被占用")
                } else if (result == "-4") {
                    showWarning("请上传100KB以内的图片作为头像")
                }
                else {
                    showWarning("服务器错误，请刷新重试")
                }
            }
        });
    }
});
//重置
function resetForm() {
    hideWarning()
    $("#showimg").html("")
}
//登录
$("#userlogin").click(function () {
    if ($("#uname").val() == "" || $("#upassword").val() == "") {
        $("#tip-back").html('<div class="alert alert-warning">请核对用户名或密码</div>')
        showTip()
        setTimeout(function () {
            window.location = "/";
        }, 2000)
    } else {
        $.post("/login", {
            "username": $("#uname").val(),
            "password": $("#upassword").val()
        }, function (result) {
            if (result == "1") {
                window.location.reload()
            } else if (result == "-1") {
                $("#tip-back").html('<div class="alert alert-warning">用户名不存在</div>')
                showTip()
                setTimeout(function () {
                    hideTip()
                }, 2000)
            } else if (result == "-2") {
                $("#tip-back").html('<div class="alert alert-warning">密码错误</div>')
                showTip()
                setTimeout(function () {
                    hideTip()
                }, 2000)
            }
        })
    }
})
//删除cookie 注销登录
$("#logout").click(function () {
    $.get("/logout", function (result) {
        if (result == "1") {
            document.cookie = "username=; expires=Thu, 01 Jan 1970 00:00:00 GMT" + "; path=/";
            window.location.reload()
        }
    })

})



//进入页面时验证登录
function linkBtn(page) {
    $.get("/checklogin", function (result) {
        if (result == "1") {
            window.location.href = page
        } else {
            $("#tip-back").html('<div class="alert alert-warning">请先登录</div>')
            showTip()
            setTimeout(function () {
                hideTip()
            }, 2000)
        }
    })
}
