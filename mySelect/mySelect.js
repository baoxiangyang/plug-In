(function ($) {
	/* 说明：
		$('.mySelect').mySelect([num]) //初始化，num存在时，指定超过num个选项后，显示侧边栏下拉。为空时显示所有选项
		$('.mySelect').mySelect(value[,str][,true]) str不存在时，获取选择值，存在时设置该选项为选中选项，true存在时 在设置选项是会触发change事件
		$('.mySelect').mySelect('insert','<li data-value="">sdfsdf</li>') 插入选项,插入前会默认清空原有选项
		$('.mySelect').mySelect('reset',[,true]) 重置第一个选项选中。ture存在时在重置后 会吃饭change事件
		$('.mySelect').mySelect('getText') 获取选中项的text文本
		禁用 在.mySelect 添加myDisabled class
		html 结构
		<div class="mySelect">
			<div class="mySelect_show">
				<span class="down"> </span>
				<p></p>
			</div>
			<div class="mySelect_listDown">
				<ul class="mySelect_list">
					<li data-value="1">水电费</li>
					<li data-value="2">水电费</li>
					<li data-value="3">水电费水电费水电费水电费水电费</li>
					<li data-value="4">水电费</li>
					<li data-value="5">水电费</li>
					<li data-value="6">水电费</li>
					<li data-value="7">水电费</li>
					<li data-value="8">水电费</li>		
				</ul>
				<div class="pull-down" style="display:none"></div>		
			</div>
		</div>
	*/
	var height = 32,
		speed = 10;//滚动速度 
	var methods = {
		init: function (num) { //初始函数
			var number = num || 0;
			$(this).each(function () {
				if($(this).data('init') == 'true'){ //阻止多次初始
					return false;
				}
				$(this).data('init', 'true');
				$(this).data('number', num || 0);
				$(this).mySelect('reset');
				setWidth.call($(this));
				//设置下拉高度
				if (number && $(this).find('li').length > number) {
					$(this).find('.mySelect_listDown').height(number * height);
					setPullHeight.call($(this));
				} else {
					$(this).find('.mySelect_listDown').height($(this).find('li').length * height);
				}
				//点击select
				$(this).on('click', '.mySelect_show', function (event) {
					var self = $(this).parents('.mySelect'), listDown = self.find('.mySelect_listDown'),
						number = self.data('number');
					if (self.hasClass('myDisabled')) {
						return false;
					}
					if (listDown.css('display') == 'none') {
						setDown(self, 0);
						//点击展开时先隐藏其他mySelect
						$('.mySelect').each(function () {
							showOrHide($(this), null, 'hide');
						});
						showOrHide($(this).parents('.mySelect'), event, 'show');
						//判断是否显示侧下拉条
						if (number && self.find('li').length > number) {
							self.find('.pull-down').css('display', 'block');
						} else {
							self.find('.pull-down').css('display', 'none');
						}
					} else {
						showOrHide($(this).parents('.mySelect'), event, 'hide');
					}
					event.stopPropagation();
					return false;
				});
				//点击下拉框
				$(this).on('click', 'li', function (event) {
					if($(this).hasClass('myDisabled')){
						return false;
					}
					var mySelect_showDom = $(this).parents('.mySelect').find('p');
					showOrHide($(this).parents('.mySelect'), null, 'hide');
					if (!($(this).data('value') == mySelect_showDom.data('value') && $(this).text() == mySelect_showDom.text())) {
						mySelect_showDom.data('value', $(this).data('value'));
						mySelect_showDom.text($(this).text());
						$(this).parents('.mySelect').trigger("change");
					}
					event.stopPropagation()
				});
				//下拉条滚动事件
				$(this).on('mousewheel DOMMouseScroll', '.mySelect_listDown', function (event) {
					var wheel = 0;
					if (event.originalEvent.wheelDelta) {
						wheel = -event.originalEvent.wheelDelta / speed;
					} else {
						wheel = event.originalEvent.detail || event.originalEvent.deltaY * 3;
						console.log(wheel);
					}
					var scrollbars = $(this).parents('.mySelect').find('.pull-down'),
						downHight = $(this).height() - scrollbars.height(),
						num = scrollbars.position().top + wheel;
					if (scrollbars.css('display') == 'none') {
						return false;
					}
					if (wheel < 0) {
						if (num < 0) {
							num = 0;
						}
					} else {
						if (num > downHight) {
							num = downHight;
						}
					}
					setDown($(this).parents('.mySelect'), num);
					event.stopPropagation()
					return false;
				});
				//下拉条鼠标按下
				$(this).on('mousedown', '.pull-down', function (event) {
					if ($(this).css('display') == 'none') {
						return false;
					}
					var self = $(this).parents('.mySelect'),
						downHight = self.find('.mySelect_listDown').height() - self.find('.pull-down').height(),
						downTop = event.clientY - $(this).position().top;
					//下拉条鼠标移动
					$(document).on('mousemove', function (event) {
							var num = event.clientY - downTop;
							if (num <= 0) {
								num = 0
							};
							if (num >= downHight) {
								num = downHight;
							}
							//$(this).find('.pull-down').css('top', num);
							setDown(self, num);
						event.stopPropagation();
						return false;
					});
					//下拉条鼠标抬起
					$(document).on('mouseup', function (event) {
						$(this).off('mousemove mouseup');
						event.stopPropagation();
						return false;
					});
					event.stopPropagation();
					return false;
				})
			});
			return $(this);
		},
		insert: function (html,bool) { //插入html
			$(this).each(function(){
				var ulDom = $(this).find('.mySelect_listDown'), listDiv = $(this).find('.mySelect_list'),
						number = $(this).data('number');
				ulDom.removeAttr('style');
				$(this).find('p').removeAttr('style');
				listDiv.html(html || '');
				$(this).mySelect('reset');
				if (number && $(this).find('li').length > number) {
					ulDom.height(number * height);
					$(this).find('.mySelect_listDown').height(number * height);
				} else {
					ulDom.height($(this).find('li').length * height);
				}
				setWidth.call($(this));
				setPullHeight.call($(this));
				if(bool === true){
					$(this).trigger("change");
				}
			})
			return $(this);
		},
		value: function (val,bool) { //取值
			if (val) {
				$(this).each(function(){
					var li = $(this).find('li[data-value=' + val + ']').eq(0);
					if (li.length) {
						$(this).find('.mySelect_show p').data('value', val).text(li.text())
						if(bool === true){
							$(this).trigger("change");
						}
					} else {
						$.error('value option is not find');
					}
				})
				return $(this);
			} else {
				var value = $(this).eq(0).find('p').data('value');
				if(value === null || value === undefined){
					return value;
				}else{
					return value.toString();
				}
			}
		},
		getText: function () {
			return $(this).eq(0).find('p').text();
		},
		reset: function (bool) { //重置,自动选择第一个li
			$(this).each(function(index, el) {
				var firstLi = $(this).find('li').eq(0);
				$(this).find('p').data('value', firstLi.data('value'));
				$(this).find('p').text(firstLi.text());
				if(bool === true){
					$(this).trigger("change");
				}
			});
			return $(this);
		}
	};

	function setWidth() { //设置下拉宽度和显示宽度一样
		$(this).find('.mySelect_listDown').css('display', 'block');
		var maxWidth = 0, liDom = $(this).find('li'),
			mySelect_showDom = $(this).find('p');
		liDom.each(function () {
			if ($(this).width() > maxWidth) {
				maxWidth = $(this).width();
			}
		});
		maxWidth += 1;
		$(this).find('.mySelect_listDown').css('display', 'none');
		var mySelect_showWidth = mySelect_showDom.width();
		if (mySelect_showWidth > maxWidth) {
			mySelect_showDom.width(mySelect_showWidth);
		} else {
			mySelect_showDom.width(maxWidth);
		}
		liDom.parents('.mySelect_listDown').width(mySelect_showDom.parents('.mySelect_show').outerWidth());
	}
	function setPullHeight() { //设置导航条高度
		var scrollbars = $(this).find('.pull-down'), 
				number = $(this).data('number');
				liLenth = $(this).find('li').length;
		if (liLenth <= number) {
			return false;
		}
		if (liLenth - number < number) {
			scrollbars.height((2 * number - liLenth ) * height);
		} else {
			scrollbars.height((1 / (liLenth - number + 1)).toFixed(4) * number * height);
		}
	}

	function setDown(dom, num) { //修改下拉条位置及下拉条位置改变时，修改选项位置
		var scrollbars = dom.find('.pull-down'),
			listDiv = dom.find('.mySelect_list'),
			ulHeight = dom.find('.mySelect_listDown').height();
		scrollbars.css('top', num || 0);
		var scale = parseInt(scrollbars.css('top')) / (ulHeight - scrollbars.height());
		listDiv.css('top', -scale * (listDiv.height() - ulHeight));
	}

	function showOrHide(dom, event, type) { //下拉列表显示隐藏，及显示方式
		var widthHeight = $(window).height(),
			ulDom = dom.find('.mySelect_listDown');
		if (type == 'show') {
			ulDom.css({top: 'initial', bottom: 'initial'});
			if (!(widthHeight - event.screenY > ulDom.height() || event.screenY < ulDom.height())) {
				ulDom.css('bottom', height);
			}
			dom.css('z-index','1005');
			//显示下拉列表
			ulDom.slideDown('fast');
			//改变三角方向
			dom.find('span').removeClass().addClass('up');
		} else {
			ulDom.slideUp('fast',function(){
				dom.css('z-index','0');
			}).end().find('span').removeClass().addClass('down');
		}
	}
	//点击不是mySelect的地方收起mySelect
	$(document).click(function (event) {
		if (!$(event.target).parents('.mySelect').length) {
			$('.mySelect').each(function () {
				showOrHide($(this), null, 'hide');
			})
		}
	});
	$.fn.mySelect = function (method) {
		if (methods[method]) {
			return methods[method].apply(this, Array.prototype.slice.call(arguments, 1));
		} else if (typeof method === 'number' || !method) {
			return methods.init.apply(this, arguments);
		} else {
			$.error('Method' + method + 'does not exist on jQuery.mySelect');
		}
	}
})(jQuery);