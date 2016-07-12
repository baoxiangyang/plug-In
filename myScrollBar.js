(function($){
	/*
		说明：
		$('.xxx').myScrollBar({ //初始化
			showHeight：'xxpx' 显示高度必填
			color: 'xx' 滚动条颜色,可不填 默认#B3B3B3，
			width：'xxpx' 滚动条width，可不填，默认5px,
			direction: 'right' 滚动条显示位置，可不填，默认right。选项值 left，right
		})
		$('.xxx').myScrollBar('update') //当内容改变时，更新滚动条高度和位置方法
	*/
	var methods = {
		init: function(obj){
			if(!obj.showHeight){
				$.error('showHeight is not undefined');
				return false;
			}
			obj.width = obj.width || '5px';
			obj.color = obj.color || '#B3B3B3';
			obj.direction = obj.direction || 'right';
			showHeight = obj.showHeight;
			$(this).each(function(){
				$(this).css({position: 'relative', height: showHeight, overflow: 'hidden'}).wrapInner('<div class="_myScroll" style="position:absolute;" />');
				$(this).append('<div class="_scrollbar" style="cursor:pointer;position:absolute;top:0;'+obj.direction+':0;background-color:'+obj.color+';width:'+ obj.width +';"></div>');
				_setHeight.call($(this));
				$(this).on('mousewheel DOMMouseScroll', function(event){
					var _scrollbar = $(this).find('._scrollbar'),wheel = 0,
						scrollHeight = $(this).height() - _scrollbar.height();
					if (event.originalEvent.wheelDelta) {
						wheel = -event.originalEvent.wheelDelta / 12;
					} else {
						wheel = event.originalEvent.detail;
					}
					var nubmer = _scrollbar.position().top + wheel;
					if(wheel < 0){
						if (nubmer < 0) {
							nubmer = 0;
						}
					}else{
						if(nubmer > scrollHeight){
							nubmer = scrollHeight;
						}
					}
					_scrollbar.css('top',nubmer);
					var _myScroll = $(this).find('._myScroll');
					_myScroll.css('top',-nubmer/scrollHeight * (_myScroll.height() - $(this).height()));
					event.stopPropagation();
					return false;
				})
				$(this).on('mousedown' ,'._scrollbar', function(event){
					if ($(this).css('display') == 'none') {
						return false;
					}
					var downTop = event.clientY - $(this).position().top, parentDiv = $(this).parent(),
						scrollHeight = parentDiv.height() -$(this).height(), self = $(this);
					$(document).on('mousemove', function(event){
						var nubmer = event.clientY - downTop;
						if (nubmer < 0) {
							nubmer = 0;
						}
						if(nubmer > scrollHeight){
							nubmer = scrollHeight;
						}
						self.css('top',nubmer);
						var _myScroll = parentDiv.find('._myScroll');
						_myScroll.css('top',-nubmer/scrollHeight * (_myScroll.height() - parentDiv.height()));
						event.stopPropagation();
						return false;
					})
					$(document).on('mouseup', function (event) {
						$(this).off('mousemove mouseup');
						event.stopPropagation();
						return false;
					});
					event.stopPropagation();
					return false;
				})
			});
		},
		update:function(){
			_setHeight.call($(this));
		}
	}
	function _setHeight(){
		var absDom = $(this).children('._myScroll'), 
			absDomHeight = absDom.outerHeight(),
			scrollbar = $(this).children('._scrollbar'),
			visibleHeight = $(this).height();
		if(absDomHeight > visibleHeight){
			scrollbar.css('display','block');
		}else{
			scrollbar.css({display:'none', top:'0'});
			return false;
		}
		var scrollbarHeight = visibleHeight * visibleHeight / absDomHeight;
		scrollbar.height(scrollbarHeight);
		var scrollbarTop = -parseInt(absDom.css('top'))/(absDomHeight - visibleHeight) * (visibleHeight - scrollbarHeight);
		scrollbar.css('top', scrollbarTop);
	}
	$.fn.myScrollBar = function(method){
		if(methods[method]){
			return methods[method].apply(this.eq(0), Array.prototype.slice.call(arguments, 1));
		}else if(typeof method === 'object'){
			return methods.init.apply(this, arguments);
		}else{
			$.error('Method' + method + 'does not exist on jQuery.myScrollBar');
		}
	}
})(jQuery)