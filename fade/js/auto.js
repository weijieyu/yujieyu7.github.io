function auto($obj,interT,fadeT,$title,$click) {//轮播图
	var iNow = 0
	var timer 
	auto()
	function auto() {
		timer = setInterval(function() {//自动执行
			change()
		}, interT)
	}
	function change(reduce) {//变化函数
		$obj.eq(iNow).attr('class', 'Nowshow').fadeOut(fadeT)
		if (!reduce && iNow == $obj.size() - 1) {
			iNow = 0
		} else if (reduce && iNow == 0) {
			iNow = $obj.size() - 1
		} else {
			reduce?iNow--:iNow++
		}
		$obj.eq(iNow).attr('class', 'Nextin').fadeIn(fadeT)
		$title.attr('class', '')
		$title.eq(iNow).attr('class', 'now')
	}
	$obj.on('mouseover',function(){//移入停止，移出继续
		clearInterval(timer)
	}).on('mouseout',function(){
		auto()
	})	
	$click.eq(0).click(function(){//点击后退按钮
		clearInterval(timer)
		change(true)
		auto()
	})
	$click.eq(1).click(function(){//点击前进按钮
		clearInterval(timer)
		change()
		auto()
	})
	$title.on('mouseover',function(){//移入移出小圆点
		var lNum = $(this).index()
		clearInterval(timer)
		$obj.eq(iNow).attr('class', 'Nowshow').fadeOut(fadeT)
		$obj.eq(lNum).attr('class', 'Nextin').fadeIn(fadeT)//图片淡入
		$title.attr('class', '')//相关span
		$title.eq(lNum).attr('class', 'now')
		iNow = lNum
	}).on('mouseout',function(){
		auto()
	})
}