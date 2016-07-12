(function ($) {
	/* 说明：
		$('.mySelect').mySelect([num]) //初始化，num存在时，指定超过num个选项后，显示侧边栏下拉。为空时显示所有选项
		$('.mySelect').mySelect(value[,str]) str不存在时，获取选择值，存在时设置该选项为选中选项
		$('.mySelect').mySelect('insert','<li value="">sdfsdf</li>') 插入选项,插入前会默认清空原有选项
		$('.mySelect').mySelect('reset') 重置第一个选项选中
		$('.mySelect').mySelect('getText') 获取选中项的text文本
		禁用 在.mySelect 添加myDisabled class
		html 结构
		<div class="mySelect">
			<div class="mySelect_show" >
				<span class="down"> </span>
				<p value=""></p>
			</div>
			<ul style="display:none">
				<div class="mySelect_list">
					<li value="11">水电费</li> 
					<li value="22">水电费</li>                        	
				</div>
			<div class="pull-down" style="display:none"></div>			
			</ul>
		</div>
	*/
	var height = 32,
		speed = 10;//滚动速度 
	var methods = {
		init: function (num) { //初始函数
			var number = num || 0;
				keyDown = false; //鼠标是否按下
			$(this).each(function () {
				$(this).data('number', num || 0);
				$(this).mySelect('reset');
				setWidth.call($(this));
				//设置下拉高度
				if (number && $(this).find('li').length > number) {
					$(this).find('ul').height(number * height);
					setPullHeight.call($(this));
				} else {
					$(this).find('ul').height($(this).find('li').length * height);
				}
				//点击select
				$(this).on('click', '.mySelect_show', function (event) {
					var self = $(this).parents('.mySelect'), ulDom = self.find('ul'),
						number = self.data('number');
					if (self.hasClass('myDisabled')) {
						return false;
					}
					if (ulDom.css('display') == 'none') {
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
					var mySelect_showDom = $(this).parents('.mySelect').find('p');
					showOrHide($(this).parents('.mySelect'), null, 'hide');
					if (!($(this).attr('value') == mySelect_showDom.attr('value') && $(this).text() == mySelect_showDom.text())) {
						mySelect_showDom.attr('value', $(this).attr('value'));
						mySelect_showDom.text($(this).text());
						$(this).parents('.mySelect').trigger("change");
					}
					event.stopPropagation()
				});
				//下拉条滚动事件
				$(this).on('mousewheel DOMMouseScroll', 'ul', function (event) {
					var wheel = 0;
					if (event.originalEvent.wheelDelta) {
						wheel = -event.originalEvent.wheelDelta / speed;
					} else {
						wheel = event.originalEvent.detail;
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
						downHight = self.find('ul').height() - self.find('.pull-down').height(),
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
		insert: function (html) { //插入html
			var ulDom = $(this).find('ul'), listDiv = $(this).find('.mySelect_list'),
					number = $(this).parents('.mySelect').data('number');
			listDiv.removeAttr('style');
			$(this).find('p').removeAttr('style');
			listDiv.html(html || '');
			$(this).mySelect('reset');
			if (number && $(this).find('li').length > number) {
				ulDom.height(number * height);
				$(this).find('ul').height(number * height);
			} else {
				ulDom.height($(this).find('li').length * height);
			}
			setWidth.call($(this));
			return $(this);
		},
		value: function (val) { //取值
			if (val) {
				var li = $(this).find('li[value=' + val + ']').eq(0);
				if (li.length) {
					$(this).find('.mySelect_show p').attr('value', val).text(li.text())
				} else {
					$.error('value option is not find');
				}
				return $(this);
			} else {
				return $(this).find('p').attr('value');
			}
		},
		getText: function () {
			return $(this).find('p').text();
		},
		reset: function (obj) { //重置,自动选择第一个li
			var firstLi = $(this).find('li').eq(0);
			if (obj && obj.text) {
				$(this).find('p').attr('value', obj.value);
				$(this).find('p').text(obj.text);
			} else {
				$(this).find('p').attr('value', firstLi.attr('value') || '');
				$(this).find('p').text(firstLi.text());
			}
			return $(this);
		}
	};

	function setWidth() { //设置下拉宽度和显示宽度一样
		$(this).find('ul').css('display', 'block');
		var maxWidth = 0, liDom = $(this).find('li'),
			mySelect_showDom = $(this).find('p');
		liDom.each(function () {
			if ($(this).width() > maxWidth) {
				maxWidth = $(this).width();
			}
		});
		$(this).find('ul').css('display', 'none');
		var mySelect_showWidth = mySelect_showDom.width();
		if (mySelect_showWidth > maxWidth) {
			mySelect_showDom.width(mySelect_showWidth);
		} else {
			mySelect_showDom.width(maxWidth);
		}
		liDom.parents('.mySelect_list').width(mySelect_showDom.parents('.mySelect_show').outerWidth());
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
			ulHeight = dom.find('ul').height();
		scrollbars.css('top', num || 0);
		var scale = parseInt(scrollbars.css('top')) / (ulHeight - scrollbars.height());
		listDiv.css('top', -scale * (listDiv.height() - ulHeight));
	}

	function showOrHide(dom, event, type) { //下拉列表显示隐藏，及显示方式
		var widthHeight = $(window).height(),
			ulDom = dom.find('ul');
		if (type == 'show') {
			ulDom.css({top: 'initial', bottom: 'initial'});
			if (!(widthHeight - event.screenY > ulDom.height() || event.screenY < ulDom.height())) {
				ulDom.css('bottom', height);
			}
			//显示下拉列表
			ulDom.slideDown('fast');
			//改变三角方向
			dom.find('span').removeClass().addClass('up');
		} else {
			dom.find('ul').slideUp('fast').end().find('span').removeClass().addClass('down');
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
			return methods[method].apply(this.eq(0), Array.prototype.slice.call(arguments, 1));
		} else if (typeof method === 'number' || !method) {
			return methods.init.apply(this, arguments);
		} else {
			$.error('Method' + method + 'does not exist on jQuery.mySelect');
		}
	}
})(jQuery);