!(function(){
var tplString = '\
<div id="subtitles-mask" >\
	<div class="borders">\
      <div class="center" data-action="move"></div>\
      <div class="cube topleft" data-action="topleft"></div>\
      <div class="cube topcenter" data-action="top"></div>\
      <div class="cube topright" data-action="topright"></div>\
      <div class="cube centerleft" data-action="left"></div>\
      <div class="cube centerright" data-action="right"></div>\
      <div class="cube bottomleft" data-action="bottomleft"></div>\
      <div class="cube bottomcenter" data-action="bottom"></div>\
      <div class="cube bottomright" data-action="bottomright"></div>\
      <div class="line top" data-action="top"></div>\
      <div class="line right" data-action="right"></div>\
      <div class="line bottom" data-action="bottom"></div>\
      <div class="line left" data-action="left"></div>\
  </div>\
</div>'
var $tpl = $(tplString)
var windowWidth = $(window).width()
var windowHeight = $(window).height()

var opt = {
    oriwidth: 600, // 初始化宽度
    oriheight: 30, // 初始化高度
    left: ((windowWidth-600)/2), // 左边位置 
    top: (windowHeight-100), // 右边位置
    mode: "auto", // 变化模式，ratio 等比 auto 自由模式
    onMove: function() {}, // 每次移动调用
    onMouseUp: function() {} // 结束裁剪调用
}

$tpl.css({
	left:opt.left,
	top:opt.top,
	width:opt.oriwidth,
	height:opt.oriheight
})

$('body').append($tpl)

var $this = $tpl
var $borders = $this.find('.borders ')

// 控制组 
var $cube_topleft = $(this).find('.cube.topleft')
var $cube_topcenter = $(this).find('.cube.topcenter')
var $cube_topright = $(this).find('.cube.topright')
var $cube_centerleft = $(this).find('.cube.centerleft')
var $cube_centerright = $(this).find('.cube.centerright')
var $cube_bottomleft = $(this).find('.cube.bottomleft')
var $cube_bottomcenter = $(this).find('.cube.bottomcenter')
var $cube_bottomright = $(this).find('.cube.bottomright')
var $line_top = $(this).find('.line.top')
var $line_right = $(this).find('.line.right')
var $line_bottom = $(this).find('.line.bottom')
var $line_left = $(this).find('.line.left')

var current_data = {
    width: opt.oriwidth,
    height: opt.oriheight,
    left: opt.left,
    top: opt.top
}

// 鼠标坐标
var startX = 0,
    startY = 0,
    changeX = 0,
    changeY = 0
// 容器尺寸
var ori_img_width = null
var ori_img_height = null
var isOpened = false

window.showMask = function(params){
		if(!isOpened){
			init()
		}
    	$this.css($.extend({
    		display:'block'
    	},params))
    }
    
    window.closeMask = function(){
    	$this.css({display:'none'})
    }

function init() {
		isOpened = true
		ori_img_width = $(window).width()
		ori_img_height = $(window).height()

    bindEvent()
    updateData()
}

function bindEvent() {
    $borders.bind('mousedown', function(event) {
        var event = event || window.event
        event.preventDefault()
        startX = event.clientX
        startY = event.clientY

        var action = $(event.target).data("action")
        var fun = null
        eval("fun = " + action)

        function mousemove(event) {
            var event = event || window.event
            changeX = event.clientX - startX
            changeY = event.clientY - startY
            startX = event.clientX
            startY = event.clientY

            if (opt.mode === "ratio") {
                if($.inArray(action,['top', 'right', 'bottom', 'left']) !== -1){
                    return false
                }
            }
            if (typeof fun === "function") {
                if (fun()) {
                    updateData()
                }
            }
        }

        function mouseup() {
            var event = event || window.event
            $(document).unbind("mousemove", mousemove)
            $(document).unbind("mouseup", mouseup)
            if (typeof opt.onMouseUp === "function") {
                opt.onMouseUp.call(this, current_data)
            }
        }
        $(document).bind("mousemove", mousemove)
        $(document).bind("mouseup", mouseup)

        return false
    })
}

function updateData() {
	console.log(current_data)
    $this[0].style.width = current_data.width + "px"
    $this[0].style.height = current_data.height + "px"
    $this[0].style.top = current_data.top + "px"
    $this[0].style.left = current_data.left + "px"

    if (typeof opt.onMove === "function") {
        opt.onMove.call(this, current_data)
    }
}

function move() {
    var nx = $this[0].offsetLeft + changeX
    var ny = $this[0].offsetTop + changeY
    nx = (nx > 0) ? ((nx > (ori_img_width - current_data.width)) ? ori_img_width - current_data.width : nx) : 0
    ny = (ny > 0) ? ((ny > (ori_img_height - current_data.height)) ? ori_img_height - current_data.height : ny) : 0
    current_data.left = nx
    current_data.top = ny

    return true
}

function top() {
    var oy = $this[0].offsetTop
    var ny = oy
    var nh = (ny + changeY) <= 0 ? ny + $this[0].offsetHeight : $this[0].offsetHeight + (-changeY)
    var ny = (ny + changeY) <= 0 ? 0 : ny + changeY

    if (nh > opt.oriheight) {
        current_data.top = ny
        current_data.height = nh
        return true
    }
}

function right() {
    var nx = $this[0].offsetLeft
    var nw = $this[0].offsetWidth + changeX
    nw = (nw < opt.oriwidth) ? opt.oriwidth : nw

    console.log((nx + nw),ori_img_width)
    if ((nx + nw) <= ori_img_width) {
        current_data.width = nw
        return true
    }
}

function bottom() {
    var ny = $this[0].offsetTop
    var nh = $this[0].offsetHeight + changeY
    nh = (nh < opt.oriheight) ? opt.oriheight : nh
    if ((ny + nh) <= ori_img_height) {
        current_data.height = nh
        return true
    }
}

function left() {
    var ox = $this[0].offsetLeft
    var nx = ox
    var nw = (ox + changeX) <= 0 ? ox + $this[0].offsetWidth : $this[0].offsetWidth + (-changeX)
    var ox = (ox + changeX) <= 0 ? 0 : ox + changeX

    if (nw > opt.oriwidth) {
        current_data.left = ox
        current_data.width = nw
        return true
    }
}

function topleft() {
    if (opt.mode === "ratio") {
        changeY = changeX
    }
    return top() && left()
}

function topright() {
    if (opt.mode === "ratio") {
        changeY = -changeX
    }
    return top() && right()
}

function bottomleft() {
    if (opt.mode === "ratio") {
        changeY = -changeX
    }
    return bottom() && left()
}

function bottomright() {
    if (opt.mode === "ratio") {
        changeY = changeX
    }
    return bottom() && right()
}

})()