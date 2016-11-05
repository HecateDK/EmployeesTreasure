### 数据交互 
现在前端通信技术越来越趋向成熟了，推荐一篇个人觉得挺好的文章 [前端通信进阶](https://segmentfault.com/a/1190000004682473#articleHeader0)  <br>
#### 1、页面之间传递参数
项目中需要把a页面选择的orgid传递给b页面，用于b页面渲染对应orgid的内容，由于浏览器是不会知道a页面和b页面的联系（即使是b页面是点击一个a页面的按钮而打开的），浏览器认为所有页面都是独立的。 <br>
我这里用了比较简单直接的方法，把需要传递的参数拼接到链接后面，这里主要是在a页面跳转到b页面的按钮上绑定一个点击事件 <br>
a页面javascript代码：
```javascript
  $(".report-btn").click(function(e){
		var orgid = $("#orgID").val();
		var values = $.extend({},{storeId:null,startTime:null,finishTime:null,memberName:null,orgId:orgid});
		console.log(values);
		$.ajax({
			type:'post',
			url:'XXX',
			dataType:'jsonp',
			jsonpCallback:'callback',
			data:values,            //把请求参数（包括orgid）发给服务器，服务器就知道在b页面返回对应orgid的相应信息了
			success:function(data){
				window.location.href = 'report.html'+'?'+'orgid'+'='+orgid;
			}
		})
	})
```
b页面：
```javascript
    var url=location.href;
	var tmpl=url.split("?")[1];
	console.log(tmpl);     //b页面可以利用这个参数
```


#### 2、前后端数据交互
效果图: ![](https://github.com/HecateDK/EmployeesTreasure/blob/master/views/5B5F.tmp.jpg) <br>
时间选择那里采用了一个jQuery插件——mobiscroll，效果和体验都不错。  <br>
代码如下：  <br>
```HTML
    <div class="time g-clear">
			<input value="" class="startDate" placeholder="开始日期" readonly="readonly" name="appDate" id="appDate" type="text">
			<input value="" class="endDate" placeholder="结束日期" readonly="readonly" name="endDate" id="endDate" type="text">
		</div>
```
```javascript
        $(function () {
			var currYear = (new Date()).getFullYear();	
			var opt={};
			opt.date = {preset : 'date'};
			opt.datetime = {preset : 'datetime'};
			opt.time = {preset : 'time'};
			opt.default = {
				theme: 'android-ics light', //皮肤样式
		        display: 'modal', //显示方式 
		        mode: 'scroller', //日期选择模式
				dateFormat: 'yyyy-mm-dd',
				lang: 'zh',
				showNow: true,
				nowText: "今天",
		        startYear: currYear - 10, //开始年份
		        endYear: currYear + 10 //结束年份
			};

		  	$("#appDate").mobiscroll($.extend(opt['date'], opt['default']));
		  	$("#endDate").mobiscroll($.extend(opt['date'], opt['default']));
		  	var optDateTime = $.extend(opt['datetime'], opt['default']);
		  	var optTime = $.extend(opt['time'], opt['default']);
		    $("#appDateTime").mobiscroll(optDateTime).datetime(optDateTime);
		    $("#appTime").mobiscroll(optTime).time(optTime);
        });
```


回到正题上，前后端数据交互，这里主要是想要实现用户点击想要查询的开始时间、结束时间已经想要查询的员工则可以把此员工的信息渲染出来。 <br>
###### HTML内容
```HTML
	<div class="report">
		<div class="time g-clear">
			<input value="" class="startDate" placeholder="开始日期" readonly="readonly" name="appDate" id="appDate" type="text">
			<input value="" class="endDate" placeholder="结束日期" readonly="readonly" name="endDate" id="endDate" type="text">
		</div>
		<div class="time g-clear">
			<div idtag="name" class="select">
				<span class="defaultItem"><table><tr><td id="td" data-id="null">所有员工</td></tr></table></span>
				<ul class="select-items">
					<li v-for="Item in Items" data-id='{{ Item.storeId }}'>{{ Item.memberName }}</li>   <!-- v-for 列表渲染 -->
				</ul>
			</div>
			<input class="query" type="submit" value="立即查询">
		</div>
		<div id="reportList" class="reportList">
			<ul>
				<li class="report-list" v-for="Item in Items">
					<div class="items-header">
						<span class="items-time"><em data-id="{{ Item.startTime }}">{{ Item.startTime }}</em>至<em data-id="{{ Item.finishTime }}">{{ Item.finishTime }}</em></span>,
						<span class="items-times">{{ Item.num }}笔</span>
						<span class="items-person">{{ Item.memberName }}</span>
					</div>
					<div class="items-content">
						<span class="items-title">{{ Item.storeName }}</span>
						<span class="items-capital">{{ Item.amount }}元</span>,
						<span class="items-items-score">{{ Item.points }}积分</span>,
						<span class="items-benifit">收益{{ Item.income }}元</span>
						<input id='list-page' type="hidden" value="{{ Item.page }}">
					</div>
				</li>
			</ul>
		</div>
	</div>	
```
###### javascript内容
```javascript
    $(".query").click(function(e){
			var url=location.href;
			var tmpl=url.split("=")[1];     //获取url里的参数
			var startDate = $("#appDate").val();
			var endDate = $("#endDate").val();
			var startdate = (new Date(startDate)).getTime()/1000;           //日期格式转换成时间戳
			var enddate = (new Date(endDate)).getTime()/1000;
			var employee = $("#td").attr("data-id");
			var values = $.extend({},{"startTime":startdate,"finishTime":enddate,"storeId":employee,"orgId":tmpl});   //把需要提交给服务端的数据合并
			console.log(values);
			$.ajax({
				type:'post',
				url:'XXX',
				dataType:'jsonp',
				jsonpCallback:'callback',
				data:values,
				success:function(r){
					console.log(r);
					$(".report-list").remove();               
					var html = ' ';
						html += '<li class="report-list" v-for="Item in Items">';
						html += '<div class="items-header">';
						html += '<span class="items-time">';
						html += '<em data-id="{{ Item.startTime }}">{{ Item.startTime }}';
						html += '</em>';
						html += '至';
						html += '<em data-id="{{ Item.finishTime }}">{{ Item.finishTime }}';
						html += '</em>';
						html += '</span>';
						html += ',';
						html += '<span class="items-times">{{ Item.num }}笔</span>';
						html += '<span class="items-person">{{ Item.memberName }}</span>';
						html += '</div>';
						html += '<div class="items-content">';
						html += '<span class="items-title">{{ Item.storeName }}</span>';
						html += '<span class="items-capital">{{ Item.amount }}元</span>,';
						html += '<span class="items-items-score">{{ Item.points }}积分</span>,';
						html += '<span class="items-benifit">收益{{ Item.income }}元</span>';
						html += '</div>';
						html += '</li>';
						console.log(html);
						$("#reportList ul").append(html);
						var vm = new Vue({                //清除原有数据，根据查询结果重新进行数据渲染
							el:'.report',
							data: function () {
								return {
								};
							}, 
						created:function(){
							var self = this;
							self.$set("Items", r);
						}
					}); 
				}
			});
		});
```

