$(document).ready(function() {
	var position = [65, 230, 754, 1289];
	// var position = [];
	// $("section").each(function() {
	// 	// console.log($(this).attr(this, "href").offset().top);
	// 	position.push($(this).offset().top)
	// });
	$(".navDot ul li a").click(function() {
		$("html, body").animate({
			scrollTop: $($.attr(this, "href")).offset().top
		}, 500);
		return false;
	});
	$(".navDot ul li a").click(function() {
		$(".navDot ul li a").removeClass("active");
		$(this).addClass("active");
	});
	$(document).scroll(function() {
		var pos = $(document).scrollTop();
		var index;
		for (var i = 0; i < position.length; i++) {
			if (pos <= position[i]) {
				console.log(position[i]);
				index = i;
				break;
			}
			else if (pos > position[3]) {
				index = 3;
				break;
			}
		}
		$(".navDot ul li a").removeClass("active");
		$(".navDot ul li a").eq(index).addClass("active");
	});
	// For smooth scrolling
	$(".navDot ul li a").click(function() {
		$(".navDot ul li a").removeClass("active");
		$(this).addClass("active");
	});
})