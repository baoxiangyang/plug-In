/*
*id:相对定位节点的id(滑动节点的父div)
*className:有left 或 top 过渡属性的class
orient：滑动方向。 ture 为垂直方向，false为水平方向。不填默认为flase
num：滑动多少px后，产生切换。不填默认为30px
*/
function slipeEvent(id,className,orient,num){
	this._getInformation(id,className,orient,num);//获取基本信息
	this._setStyle();//设置高度和宽度
	this.touchEvent()//绑定事件
}
slipeEvent.prototype = {
	_getInformation:function(id,className,orient,num){ //获取基本信息
		this.parent = document.querySelector(id);
		this.className = className;
		this.orient = orient || false; // true 垂直;flase 水平
		this.slipeNum = num || 30;
		var  _parentStyle= window.getComputedStyle(this.parent,null);
		this._slipeDiv = this.parent.firstElementChild;
		this._parentWidth = parseFloat(_parentStyle.getPropertyValue('width'));
		this._parentHeight = parseFloat(_parentStyle.getPropertyValue('height'));	
	},
	_getSlipeChild:function(){//获取滑动子节点
		var _child = this._slipeDiv.childNodes,arr = [];
		for(var i = 0; i<_child.length;i++){
			if(_child[i].nodeType !=3 && _child[i].nodeType != 8){
				arr.push(_child[i]);
			}
		}
		return arr;
	},
	_setStyle:function(){//设置滑动子节点的宽度和高度
		this.arrDiv = this._getSlipeChild();
		this.arrDiv.forEach(function(item){
			item.style.width = 	this._parentWidth+"px";
			item.style.height = this._parentHeight+"px";
			if(this.orient){
				this._slipeDiv.style.width = this._parentWidth+"px";
				this._slipeDiv.style.height = this._parentHeight * this.arrDiv.length+"px";	
			}else{
				this._slipeDiv.style.width = this._parentWidth * this.arrDiv.length+"px";
				this._slipeDiv.style.height = this._parentHeight+"px";	
			}
		}.bind(this))	
	},
	touchEvent:function(){
		var startCoordinate,moveCoordinate,number,_number,
			orient = this.orient ? 'top' : 'left',
			wOrH = this.orient ? this._parentHeight : this._parentWidth
			_slipeDivWorH = wOrH * (this.arrDiv.length - 1);
		//触摸开始时执行
		this._slipeDiv.addEventListener('touchstart',function(event){
			var touch = event.targetTouches[0];
			number = parseFloat(window.getComputedStyle(this._slipeDiv,null).getPropertyValue(orient)) || 0;
			_number = number;
			startCoordinate = this._orientType(touch);
			moveCoordinate = startCoordinate;
			this._slipeDiv.classList.remove(this.className)
			event.preventDefault()
		}.bind(this),false);
		//触摸移动时执行
		this._slipeDiv.addEventListener('touchmove',function(event){
			var touch = event.targetTouches[0];
			speed = this._orientType(touch) - moveCoordinate;
			moveCoordinate = this._orientType(touch);
			_number += speed;
			if(moveCoordinate - startCoordinate > 0){
				if(_number >= this.slipeNum){
					_number = this.slipeNum;
				}
			}else{
				if(_number <= -_slipeDivWorH - this.slipeNum){
					_number = -_slipeDivWorH - this.slipeNum;
				}
			}
			this._slipeDiv.style[orient] = _number + "px";
			event.preventDefault()	
		}.bind(this),false)
		//触摸移动时执行
		this._slipeDiv.addEventListener('touchend',function(event){
			if(Math.abs(moveCoordinate - startCoordinate) > this.slipeNum){
				if(moveCoordinate - startCoordinate > 0){
					this._slipeDiv.style[orient] = (number + wOrH) > 0 ? 0 : (number + wOrH)+"px";
				}else{
					this._slipeDiv.style[orient] = ((number - wOrH) < -_slipeDivWorH ? -_slipeDivWorH :　(number - wOrH)) +"px";
				}
			}else{
				this._slipeDiv.style[orient] = number + "px";	
			}
			this._slipeDiv.classList.add(this.className)
			event.preventDefault()	
		}.bind(this),false)	
	},
	_orientType:function(obj){
		if(this.orient){
			return obj.pageY;
		}else{
			return obj.pageX;
		}
	}
}