$(document).ready(function(){
	$.ajax({
		type:'post',
		url:"XXX",
		data:'data',
		dataType:'json',
		success:function(result){
			if(!result || result.errcode != '0'){
				return false;
			}
			
		}
	})
});