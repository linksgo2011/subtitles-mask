var buttonOpen = document.getElementById('open')
var buttonClose = document.getElementById('close')
var inputOpacity = document.getElementById('input_opacity')

buttonOpen.addEventListener('click',function(event){
	var inputOpacityValue = Number(inputOpacity.value)
	// if(isNaN(inputOpacityValue)){
	// 	alert('The value must be 0-1,like 0.6')
	// 	return ;
	// }
	chrome.tabs.executeScript({
    code: 'showMask({opacity:'+inputOpacityValue+'})'
  })
})

buttonClose.addEventListener('click',function() {
	chrome.tabs.executeScript({
    code: 'closeMask()'
  })
})

