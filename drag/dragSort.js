function Drag() {

}
Drag.prototype.init = function(obj,towards,opt) {
	var This = this

	this.obj = obj
	this.par = obj.parentNode
	this.opt = cover({
		'cbDown': function(){},
		'cbMove': function(){},
		'cbUp': function(){}
	},opt)
	this.tow = towards=='width'?'offsetWidth':'offsetHeight'

	this.collect()//执行拖拽前的信息采集
	
	this.obj.onmousedown = function(ev) {
		var ev = ev || window.event
		if (ev.button == 2) {//剔除右键
			return
		}
		This.obj.style.zIndex = '99' //让他在拖拽时能够显示在上面
		This.opt.cbDown()//配置函数执行处
		This.down(ev)
		if (ev.stopPropagation) {
			ev.stopPropagation()
		} else {
			ev.cancelBubble = true
		}
	}
	function cover(obj1,obj2) {//配置参数覆盖
		for (var attr in obj2) {
			obj1[attr] = obj2[attr]
		}
		return obj1
	}
}
Drag.prototype.addDrag = function () {//添加拖拽
	for (var i = 0; i < this.par.children.length; i++) {
		var dragLi = new Drag()
		dragLi.init(this.par.children[i],this.tow,this.opt)
	}
}
Drag.prototype.collect = function () {//采集定位信息，同时兼容非absolute布局
	this.pos = []
	for (var i = 0; i < this.par.children.length; i++) {//采集定位信息，将float布局转为可拖动定位
		this.par.children[i].index = i//添加索引方便操作
		this.pos.push({
			"l": this.par.children[i].offsetLeft,
			"t": this.par.children[i].offsetTop
		})
	};
	if (this.obj.style.position != 'absolute') {//转换为absolute
		for (var i = 0; i < this.par.children.length; i++) {
			this.par.children[i].style.position = 'absolute'
			this.par.children[i].style.margin = '0'
			this.par.children[i].style.left = this.pos[i].l + 'px'
			this.par.children[i].style.top = this.pos[i].t + 'px'
		};
	}
	
}
Drag.prototype.down = function(ev) {
	var This = this
	this.l = ev.clientX - this.obj.offsetLeft
	this.t = ev.clientY - this.obj.offsetTop
	document.onmousemove = function(ev) {
		var ev = ev || window.event
		This.opt.cbMove()//配置函数执行处
		This.move(ev)
	}
	document.onmouseup = function(ev) {
		var ev = ev || window.event
		This.opt.cbUp()//配置函数执行处
		This.up(ev)
	}
}
Drag.prototype.move = function(ev) {
	var This = this

	ev.preventDefault()
	this.obj.style.left = ev.clientX - this.l + 'px'
	this.obj.style.top = ev.clientY - this.t + 'px'

	if (!collCh(this.obj) || This.onoff) { //判断碰撞元素是否存在
		return
	} else {
		this.tmp = collCh()
		sortCh()
	}
	return false
	
	function collCh() {//检测哪个li离拖拽元素最近，返回值为对应的索引
		for (var i = 0; i < This.par.children.length; i++) {
			if (This.obj == This.par.children[i]) {
				continue
			}
			var dis = Math.sqrt(Math.pow(This.obj.offsetLeft - This.par.children[i].offsetLeft, 2) + Math.pow(This.obj.offsetTop - This.par.children[i].offsetTop, 2))
			if (dis < This.obj[This.tow] / 2) {//碰撞检测
				return i
			}
		}
	}

	function sortCh() {//排序
		This.onoff = true
		if (This.obj.index > This.tmp) {
			This.par.insertBefore(This.par.children[This.obj.index], This.par.children[This.tmp])
		} else {
			This.par.insertBefore(This.par.children[This.obj.index], This.par.children[This.tmp + 1])
		}
		setTimeout(function() {
			for (var i = 0; i < This.par.children.length; i++) { //重新添加索引
				This.par.children[i].index = i;
			};
			for (var i = 0; i < This.par.children.length; i++) { //改变后重新安排位置
				if (This.obj == This.par.children[i]) {//当前拖动元素跳出
					continue
				}
				This.par.children[i].style.left = This.pos[i].l + 'px'
				This.par.children[i].style.top = This.pos[i].t + 'px'
			}
			This.onoff = false
		}, 100)
	}
}
Drag.prototype.up = function() {
	var This = this
	this.obj.onmousedown = document.onmousemove = document.onmouseup = null
	this.obj.style.left = this.pos[this.obj.index].l + 'px'//设置当前拖动元素的位置
	this.obj.style.top = this.pos[this.obj.index].t + 'px'
	this.obj.style.zIndex = ''//还原
	this.addDrag() //给拖拽完的加上下次的拖拽
}


