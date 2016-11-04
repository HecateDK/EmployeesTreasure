$(document).ready(function(){
	$.ajax({
		type:'post',
		url:"http://10.90.90.36:8888/sjygb_user/session",
		data:'data',
		dataType:'json',
		success:function(result){
			if(!result || result.errcode != '0'){
				return false;
			}
			
		}
	})
});