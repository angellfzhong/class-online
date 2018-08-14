
//创建笔记列表
function createNotelist(nodeid, notelist) {
    for (var i = 0; i < notelist.length; i++) {
        var node = document.getElementById(nodeid)
        var nli = document.createElement('li')
        var nlink = document.createElement('a')
        $(nlink).attr('href', '/note/readnote/' + notelist[i]._id)
        $(nlink).attr('target', '_blank')
        $(nlink).html(notelist[i].notetitle)
        $(nli).append(nlink)
        $(node).append(nli)
    }
}

$.get('/note/mynotetitle', function (result) {
    var notelist = result
    createNotelist('mynotelist', notelist)
})

$.get('/note/notetitle', function (result) {
    var notelist = result
    createNotelist('allnotelist', notelist)
})

$('#postbtn').click(function () {
    var content = $('#summernote').summernote('code')
    var title = $('#notetitle').val().trim()
    if(title==''||content ==''){
        return
    }
    $.post('/note/postnote',
        { 'notetitle': title, 'notecontent': content },
        function (result) {
            if (result == '1') {
                $("#tip-back").html('<div class="alert alert-warning">发布成功</div>')
                showTip()
                setTimeout(function () {
                    hideTip()
                    window.location.reload()
                }, 1000)
            }
        })
})