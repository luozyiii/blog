var LUO = {
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
	LUO.go_top();
})