var LUO = {
    //导航
    nav:function () {
        var _url = window.location.href;
        var _nav = $(".classification");
        if (_url.indexOf("web") >= 0) {
            _nav.removeClass("active");
            _nav[1].addClass("active");
        } 
    },
	//返回顶部
    go_top:function(){
        $(window).scroll(function() {
            if ($(this).scrollTop() > 200) {
                $('.go-top').fadeIn(200);
            } else {
                $('.go-top').fadeOut(200);
            }
        });

        $('.go-top a').click(function(e) {
            $('html, body').animate({
                scrollTop: 0
            }, 300);
            e.preventDefault();
        })
    }
}

$(function() {
    LUO.nav();
	LUO.go_top();
})