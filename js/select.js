 var isItemHover = 0;	//	ITEM是否正在HOVER使用，供清楚ONHOVER状态
  var delayTime4Select = null;	//延迟消失下拉框
  var selectUsingObj = "";	//正在使用哪个SELECT，供MOUSE OVER AND OUT时使用
  var selectCloseUsing = 0;	//是否在执行关闭操作	
  var isClickSelectTextObj = 0;	//是否点击了SELECT控件里的输入框
  var employee;
  
  $(document).ready(function(){
  		$(".select :text").click(function(){	//当鼠标点击了.select里面的任何一个输入框，则取消掉[鼠标移出焦点后，自动消失事件]
			isClickSelectTextObj = 1;
		});
		$('.defaultItem').click(function(event){ //鼠标点击[请选择]，弹出下拉框
			if(selectCloseUsing == 1){
				return;
			}
			var parentObj = $(this).parent();
			if(selectUsingObj != "" && selectUsingObj != parentObj.attr("idtag")){
				$("[idtag='"+selectUsingObj+"']").find('ul.select-items').hide();
				$("[idtag='"+selectUsingObj+"']").find('.extraData').hide();
			}
			if(selectUsingObj != ""){	//点击事件[执行关闭SELECT]操作
				clearTimeout(delayTime4Select);
				selectCloseUsing = 1;
				var itemsOBJ = parentObj.find('ul.select-items');;
				itemsOBJ.hide();
				var extraOBJ = $("[idtag='"+selectUsingObj+"']").find(".extraData");
				extraOBJ.hide();
				selectUsingObj = "";
				delayTime4Select = setTimeout(function(){
					selectCloseUsing = 0;
					isClickSelectTextObj = 0;
				},200);
			}else{		//点击事件[执行打开SELECT]操作
				selectUsingObj = parentObj.attr("idtag");
				clearTimeout(delayTime4Select);
				var selectWidth = parentObj.width();	//动态设置ul.items宽度
				var selectHeight = parentObj.height();	//动态设置ul.items的TOP偏移量
				var id = parentObj.attr("idtag");
				var hiddenVal = "";	//隐藏域的值，用来显示选中ITEM项
				var element=$("#"+id);
				if(element.length > 0){
					hiddenVal = $("#"+id).val();
				}
				var itemsOBJ = parentObj.find('ul.select-items');
				itemsOBJ.css("width",selectWidth+11);
				itemsOBJ.css({top:parentObj.offset().top+selectHeight,left:parentObj.offset().left});
				itemsOBJ.show(); //找到ul.items显示
				var extraOBJ = parentObj.find(".extraData");
				if(extraOBJ.length > 0){	//SELECT额外数据DIV存在
					extraOBJ.css("width",selectWidth+1);
					extraOBJ.css({top:parentObj.offset().top+selectHeight+itemsOBJ.height(),left:parentObj.offset().left});
					extraOBJ.show();
				}
				parentObj.find('li').hover(function(){
					isItemHover = 1;
					$(this).addClass('hover');
					$(this).parent().find('li').removeClass('onhover');
				}, function(){
					$(this).removeClass('hover');
				});//li的hover效果
				if(isItemHover == 0){
					itemsOBJ.find("li").each(function(){
						if(hiddenVal == $(this).attr("data-id")){
							$(this).addClass('onhover');
						}
					});
				}
			}
		});
		$('.select,.extraData').mouseover(function(event){
			selectCloseUsing = 0;
		});
		$('.select,.extraData').mouseout(function(event){
			selectCloseUsing = 1;
			var toElement = null;
			if ($.browser.mozilla){	//火狐下不支持toElement
				toElement = event.relatedTarget;
			}else{
				toElement = event.toElement;
			}
			if($(this)[0].contains(toElement)){	//如果是内部元素，则不执行以下代码
				return;
			}
			var itemsOBJ = null;
			if($(this).attr("class") == "select"){
				itemsOBJ = $(this).find('ul.select-items');
			}else{
				itemsOBJ = $(this).parents("div").find('ul.select-items');
			}
			delayTime4Select = setTimeout(function(){
				if(selectCloseUsing == 1 && isClickSelectTextObj == 0){
					itemsOBJ.hide();
					var extraOBJ = $("[idtag='"+selectUsingObj+"']").find(".extraData");
					if (extraOBJ.length > 0) {
						extraOBJ.hide();
					}
					isItemHover = 0;
					selectUsingObj = "";
				}
			},3000);
		});
		$('ul.select-items li').live("click",function(){
			selectCloseUsing = 1;
			var parentDiv = $(this).parents("div");
			parentDiv.find('td').html($(this).html());
			parentDiv.find('td').attr("data-id",$(this).attr("data-id"));
			var id = parentDiv.attr("idtag");
			var element=$("#"+id);
			if(element.length > 0){
				$("#"+id).val($(this).attr("data-id"));
			}else{
			   parentDiv.after('<input type="hidden" id="'+id+'" name="'+id+'" data-id="'+$(this).attr("value")+'"/>');
			   $("#name").val($(this).attr("data-id"));
			}
			parentDiv.find('ul.select-items').hide();
			var extraOBJ = $("[idtag='"+selectUsingObj+"']").find(".extraData");
			if (extraOBJ.length > 0) {
				extraOBJ.hide();
			}
			selectUsingObj = "";
			isItemHover = 0;
			delayTime4Select = setTimeout(function(){
				selectCloseUsing = 0;
				isClickSelectTextObj = 0;
			},200);
		});
	});
	
	//给firefox定义contains()方法，ie下不起作用
	if(typeof(HTMLElement)!="undefined"){
	   HTMLElement.prototype.contains=function(obj){ 
              while(obj!=null&&typeof(obj.tagName)!="undefind"){ //通过循环对比来判断是不是obj的父元素
            　    if(obj==this) return true;
   　　　　        obj=obj.parentNode;
       　　      } 
              return false;
		};  
	}
	
	function closeSelect(obj){
		selectCloseUsing = 1;
		var itemsOBJ = $(obj).parents("div").find('ul.select-items');;
		itemsOBJ.hide();
		var extraOBJ = $("[idtag='"+selectUsingObj+"']").find(".extraData");
		extraOBJ.hide();
		selectUsingObj = "";
		delayTime4Select = setTimeout(function(){
			selectCloseUsing = 0;
			isClickSelectTextObj = 0;
		},200);
	}