//CKEDITOR.replace('itemdescription');

var imgUploadUrl = global.baseUrl + 'item/muban/uploadimg';
var imgDeleteUrl = global.baseUrl + 'item/muban/deleteimg';

$('.excludeship').click(function(){
	if($(this).prop('checked'))
		$(this).parent().children('div').find('input[type=checkbox]').prop('checked',true);
	else
		$(this).parent().children('div').find('input[type=checkbox]').removeAttr('checked');
});

$('#siteid').bind("change",function(){
	$('.category').val('');
	document.a.submit()});
$('#listingtype').bind("change",function(){
	document.a.action="";
	document.a.submit()});
$('#selleruserid').bind("change",function(){
	document.a.action="";
	document.a.submit()});
$('#primarycategory').bind("change",function(){
	if(isNaN($('#primarycategory').val())){
		bootbox.alert('输入的值非类目ID');
		$('#primarycategory').val('');
	}else{
	document.a.action="";
	document.a.submit();
	}});
$('#secondarycategory').bind("change",function(){
	if(isNaN($('#secondarycategory').val())){
		bootbox.alert('输入的值非类目ID');
		$('#secondarycategory').val('');
	}});

//多属性区域加载绑定
$('#addpic').bind('click',function(){
	name=prompt('请输入属性名');
	html = '<tr><th><span class="glyphicon glyphicon-minus"></span></th><th>'+name+'</th><td><input name="picture['+name+'][]" size="80" value=""></td></tr>'
	$('#picture-table').append(html);
})
$('#addrow').bind('click',function(){
	row=$('#variation_table').find('tr:last').clone().find(':input').val('').end();
	row.appendTo('#variation_table');
})
$('.glyphicon-minus').bind('click',function(){
	$(this).parent().parent().remove();
})

//模块操作页面加载
//1.点击保存，显示输入范本名区域
$('.profile_save').click(function(){
	//获取当前操作的是哪个模块
	var p = $(this).parent().parent();
	var type = p.attr('id'); 
	//显示输入范本名区域
	$('#'+type+' .save_name_div').show();
});
//2.点击范本名后的确定，进行模块数据保存
$('.profile_save_btn').click(function(){
	$.showLoading();
	//获取当前操作的是哪个模块
	var p = $(this).parent().parent().parent();
	var type = p.attr('id'); 
	var save_name = $('#'+type+' .save_name').val();
	//整理该模块的form值，进行序列化
	var p2 = $(this).parent().parent().parent();
	var val = p2.find('input[type=text],input:checked,select,textarea').serialize();
	val=val.replace(/%5B%5D/g,'----').replace(/%5B/g,'\\\\').replace(/%5D/g,'//').replace(/----/g,'[]');
	//ajax入库
	val += '&save_name='+save_name+'&type='+type;
	$.post(global.baseUrl+'listing/ebaymuban/profilesave',val,function(r){
		$.hideLoading(); 
		var _r = eval('('+r+')');
        if (_r.ack == 'success'){
            $('#'+type+'_profile').append('<option value="'+_r.id+'">'+save_name+'</option>');
            bootbox.alert('操作已成功');
            $('#'+type+' .save_name_div').hide();
        }else if(_r.ack == 'failure'){
        	bootbox.alert(_r.msg);
        }
        
    });
	
});
//删除模块范本
$('.profile_del').click(function(){
	var p = $(this).parent().parent();
	var type = p.attr('id'); 
    var select_id=type+"_profile";
    var profile=$('#'+type+'_profile').val();
    if(profile.length == 0){
        bootbox.alert('请先选择要删除的范本！');
        return false;
    };
    bootbox.confirm("你确定要删除此范本吗？",function (res){
    	if(res == true){
	    	$.showLoading();
	        $.post(global.baseUrl+'listing/ebaymuban/profiledel',{'id':profile},function(r){
	            var _r = eval('('+r+')');
	            $.hideLoading(); 
	            if (_r.ack == 'success'){
	                $('#'+select_id+' option[value='+profile+']').remove();
	                bootbox.alert('操作已成功');
	            }else if(_r.ack == 'failure'){
	                bootbox.alert(_r.msg);
	            }
	            return false;
	        });
    	}
    });
});
//加载范本数据
$('.profile_load').click(function(){
	var p = $(this).parent().parent();
    var type=p.attr('id');
    var profile=$('#'+type+'_profile').val();
    if(profile.length == 0){
    	bootbox.alert('请先选择您要载入的范本！');
        return;
    }
    $.showLoading();
    $.get(global.baseUrl+'listing/ebaymuban/profileload',{'id':profile} ,function(r){
        var d=$.parseJSON(r);
        p.find(':checkbox').removeAttr('checked').trigger('change');
        for (k in d)
		{
            var name=k.replace(/\\\\/g,'\\[').replace(/\/\//g,'\\]');
            if ($.isArray(d[k]))
			{
            	if(name.indexOf("ShipToLocation") > 0){
                	$('input[name='+name+'\\[\\]]').removeAttr('disabled');
                	if($.inArray('Worldwide',d[k])){
                		$('input[name='+name+'\\[\\]]').removeAttr('checked');
                   	}
				}
            	if(name.indexOf("ExcludeShipToLocation") > 0){
            		$('#changeexclude').text(d[k]);
            	}
                for (j in d[k])
				{
                    if(d[k][j].length >0)
					{
                        $('input[name='+name+'\\[\\]][value="'+d[k][j].replace('/','\\/')+'"]').prop('checked','checked').trigger('change');
                    }
                }
            }
			else
			{
				if($('input[name='+name+']').is('input[type=checkbox]'))
				{
                    $('input[name='+name+']').prop('checked','checked').trigger('change');
                }
				
				if($('input[name='+name+']').is('input[type=radio]'))
				{
					$('input[name='+name+']').removeAttr('checked');
					$('input[name='+name+'][value="'+d[k].replace('/','\\/')+'"]').prop('checked','checked').trigger('change');
//					if(d[k] == 'false')
//					{
//						$("#buyer_n").prop('checked', 'checked');
//					}
//					else if(d[k] == 'true')
//					{
//						$("#buyer_y").prop('checked', 'checked');
//					}
                }
				else
				{
					$('input[name='+name+']').val(d[k]).trigger('change');	
				}
                $('select[name='+name+']').val(d[k]).trigger('change');
                $('textarea[name='+name+']').val(d[k]).trigger('change');
            }
            if(name=='shippingset'){
            	$('div[id^=shippingservice]').show();
                $('div[id^=inshippingservice]').show();
            }
        }
        $('#'+type+'_profile').val(profile);
        $.hideLoading();
        bootbox.alert('加载成功');
    });
});

//处理页面右侧快捷栏的css显示
function showscrollcss(str){
	var _eqtmp = new Array;
	_eqtmp['account'] = 0;
	_eqtmp['siteandspe'] = 1;
	_eqtmp['titleandprice'] = 2;
	_eqtmp['picanddesc'] = 3;
	_eqtmp['shippingset'] = 4;
	_eqtmp['returnpolicy'] = 5;
	_eqtmp['buyerrequire'] = 6;
	_eqtmp['plusmodule'] = 7;
	//全部为默认黑
	$('.left_pannel p a').css('color','#333');
	$('.left_pannel p a').eq(_eqtmp[str]).css('color','rgb(165,202,246)');
	return false;
}
function doaction(str){
	$('#a').bootstrapValidator('validate');
	if($('#a').data('bootstrapValidator').isValid()==false){
		return false;
	}
	$('#act').val(str);
//	if($("#a").form('validate')==true){
		if(str=='verify'){
			$('#a').attr('target','_blank');
		}else{
			$('#a').attr('target','_self');
		}
		document.a.submit();
		document.a.target="";
	    document.a.action="";
		$("#act").attr("value","");
//	}
}

//重复刊登检测
function checkitem(){
	$('#a').bootstrapValidator('validate');
	if($('#a').data('bootstrapValidator').isValid()==false){
		alert('请检查必填字段');return false;
	}
	$.showLoading();
	if($('#itemtitle').val().length==0){$.hideLoading();bootbox.alert('请填写刊登标题');return false;}
	if($('#selleruserid').val().length==0){$.hideLoading();bootbox.alert('请选择刊登账号');return false;}
	$.post(global.baseUrl+'listing/ebaymuban/checkrepeatmuban',{itemtitle:$('#itemtitle').val(),sku:$('#sku').val(),selleruserid:$('#selleruserid').val()},function(data){
		$.hideLoading();
		if(data!=''){
			bootbox.alert('该刊登范本的'+data+'线上已有相同的刊登,请注意重复刊登');
		}else{
			bootbox.alert('该刊登范本可以安全使用');
		}
	});
}
//预览模板的刊登效果
function preview(){
	$('#a').bootstrapValidator('validate');
	if($('#a').data('bootstrapValidator').isValid()==false){
		return false;
	}
	//if (typeof(KE.g['itemdescription'].iframeDoc) == 'object'){
    //    $('#itemdescription').val(KE.util.getData('itemdescription'));
    //}
    //$('#itemdescription').val(KE.util.getData('itemdescription'));
    document.a.target="_blank";
    document.a.action=global.baseUrl+"listing/ebaymuban/preview";
    document.a.submit();
    document.a.target="";
    document.a.action="";
    $("#act").attr("value","");

}
//加载Ebay店铺分类
//function loadStoreCategory(selleruserid){
//	if(typeof(selleruserid)!='undefined'){
//	$.ajax({
//		type: 'get',
//		url:global.baseUrl+"listing/ebaystorecategory/data?selleruserid="+selleruserid,
//		//data: {keys: selleruserid},
//		cache: false,
//		dataType:'json',
//		beforeSend: function(XMLHttpRequest){
//		},
//		success: function(data){
//			$('#storecategoryid').combotree('loadData', convertTree(data));
//			$('#storecategory2id').combotree('loadData', convertTree(data));
//		},
//		error: function(XMLResponse){
//			bootbox.alert('eBay店铺类目加载失败！');
//		}
//	});	}
//}
//组织Ebay店铺分类数据 返回json对象
function convertTree(rows){
    nodes = [];  
   // 得到顶层节点
   for(var i = 0; i< rows.length; i++){  
       var row = rows[i];  
       if (row.category_parentid==0){  
           nodes.push({  
               id:row.categoryid,  
               text:row.category_name
           });  
       }  
   }  
     
   var toDo = [];  
   for(var i = 0; i < nodes.length; i++){  
       toDo.push(nodes[i]);  
   }  
   while(toDo.length){  
       var node = toDo.shift();    // 父节点 
       // 得到子节点 
       for(var i=0; i<rows.length; i++){  
           var row = rows[i];  
           if (row.category_parentid == node.id){  
        	   var child = {id:row.categoryid,text:row.category_name};  
               if (node.children){  
                   node.children.push(child);  
               } else {  
                   node.children = [child];  
               }  
               toDo.push(child);  
           }  
       }  
   }
   return nodes;
}
//切换Ebay账号时触发自动加载店铺类目
//$('#selleruserid').change(function(){
//	loadStoreCategory($(this).val());
//})
//页面加载完自动加载店铺类目
$(function(){
	$('#a').attr('target','_self');
	$("#act").attr("value","");
//	var selleruserid = $('#selleruserid').val();
//	loadStoreCategory(selleruserid);
});

//标题长度
function inputbox_left(inputId,limitLength,text){
    var o=document.getElementById(inputId);
    if(text==undefined){
        left=limitLength-o.value.length;
    }else{
        left=limitLength-text.length;
    }
    $('#length_'+inputId).html(left);
    if(left>=0){
        $('#length_'+inputId).css({'color':'green'});
    }else{
        $('#length_'+inputId).css({'color':'red'});
    }
}

function showihc(){
	if($('#shippingdetails_shippingdomtype').val()=='Calculated'||$('#shippingdetails_shippinginttype').val()=='Calculated'){
		$('#ihc').show();
	}else{
		$('#ihc').hide();
	}
}
function doshow(){
//	id=$('#tmp').val();
//	newid=parseInt(id)+1;
//	if(id<=3){
//		$('#shippingservice_'+id).show();
//		$('#tmp').val(newid);
//	}
	var id = 4-($('.shipping:hidden').length);
	$('#shippingservice_'+id).show();
}
function dohide(){
	id=$('#tmp').val();
	newid=parseInt(id)-1;
	if(id>1){
		$('#shippingservice_'+(id-1)).hide();
		$('#tmp').val(newid);
	}
}
function do2show(){
//	id=$('#intmp').val();
//	newid=parseInt(id)+1;
//	if(id<=4){
//		$('#inshippingservice_'+id).show();
//		$('#intmp').val(newid);
//	}
	var id = 5-($('.inshipping:hidden').length);
	$('#inshippingservice_'+id).show();
}
function do2hide(){
	id=$('#intmp').val();
	newid=parseInt(id)-1;
	if(id>0){
		$('#inshippingservice_'+(id-1)).hide();
		$('#intmp').val(newid);
	}
}
function hideshipping(obj){
	$(obj).parent().hide();
}
//删除文件上传框
function delImgUrl_input(imgdiv) {
	
	// 点击删除前判断是否已经有图片上传 如果有 进行删除
//	var status = $(imgdiv).parent().children('input[type="text"]').attr(
//			'status');
//	var urlPath = $(imgdiv).parent().children('img').attr('src');
//	if (status == 1) {
//		if(confirm('确认删除吗?')){
//			$.ajax({
//				url : imgDeleteUrl,
//				type : 'post',
//				data : {
//					urlpath : urlPath
//				},
//				success : function(data) {
//					if (data) {
//						$(imgdiv).parent().empty();
//					} else {
//						showmsg('错误', '操作失败,请重试', 1000);
//					}
//				}
//			})
//		}
//	} else {
		$(imgdiv).parent().empty();
//		$(imgdiv).parent().children('img').attr('src','');
//		$(imgdiv).parent().children('input[type="text"]').val('');
//	}
}
//图片编辑再加一张图片
function Addimgurl_input(src) {
	if (typeof (src) == 'undefined') {
		src = '';
	}
	$('#divimgurl')
			.append(
					"<div><img src='"
							+ src
							+ "' width='50' height='50'> <input type='text' class='iv-input' id='imgurl"
							+ (Math.random() * 10000).toString()
									.substring(0, 4)
							+ "' name='imgurl[]' size='60'  onblur='javascript:imgurl_input_blur(this)' value="
							+ src
							+ "> <input class='iv-btn btn-search' type='button' value='删除' onclick='delImgUrl_input(this)'> <input class='iv-btn btn-search' type='button' value='本地上传' onclick='javascript:localimgup(this)' ><input class='iv-btn btn-search' type='button' value='上传到ebay' onclick='UploadSiteHostedPictures(this)' ></div>");
}
//本地上传图片
function imgurl_input_blur(obj) {
	var t = $(obj).val();
	$(obj).parent().children('img').attr('src', t);
}

//本地上传图片
function localimgup(obj){
	var tmp='';
	$('#img_tmp').unbind('change').on('change',function(){
		$.showLoading();
		$.uploadOne({
		     fileElementId:'img_tmp', // input 元素 id
			 //当获取到服务器数据时，触发success回调函数 
			 //data: 上传图片的原图和缩略图的amazon图片库链接{original:... , thumbnail:.. } 
			 onUploadSuccess: function (data){
				 $.hideLoading();
		    	 tmp = data.original;
		    	 $(obj).parent().children('input[type="text"]').val(tmp);
		    	 $(obj).parent().children('img').attr('src',tmp);
		     },
		     		     
		     // 从服务器获取数据失败时，触发error回调函数。  
		     onError: function(xhr, status, e){
		    	 $.hideLoading();
				 alert(e);
		     }
		});
	});
	$('#img_tmp').click();
}
//$('#btn-uploader').click(function(){
//	$.uploadOne({
//	     fileElementId:'img_tmp', // input 元素 id
//		 //当获取到服务器数据时，触发success回调函数 
//		 //data: 上传图片的原图和缩略图的amazon图片库链接{original:... , thumbnail:.. } 
//		 onUploadSuccess: function (data){
//	    	 bootbox.alert(data);
//	     },
//	     		     
//	     // 从服务器获取数据失败时，触发error回调函数。  
//	     onError: function(xhr, status, e){
//	    	 $.hideLoading();
//			 bootbox.alert(xhr);
//	     }
//	});
//});
//
$('#btn-uploader').batchImagesUploader({
	localImageUploadOn : true,   
    fromOtherImageLibOn: false , 
	imagesMaxNum : 5,
	fileMaxSize : 500 , 		
	fileFilter : ["jpg","jpeg","gif","pjpeg","png"],
	maxHeight : 100, 		maxWidth : 100,
//	initImages : existingImages, 
	fileName: 'product_photo_file',
    onUploadFinish : function(imagesData , errorInfo){
    	if(errorInfo){
    		bootbox.alert(errorInfo);
    	}else{
	    	for(var i in imagesData){
	    		var url = imagesData[i].original;
	    		Addimgurl_input(url);
	    	}
    	}
    	$('.mutiuploader').hide();
    },
    onDelete : function(data){
	}
	
});
//图片上传到ebay
function UploadSiteHostedPictures(obj) {
	bootbox.alert('请确认上传的eBay账号为您页尾选中的eBay账号,否则容易导致账号关联');
	var status = $(obj).parent().children('input[type="text"]');
	var urlPath = $(obj).parent().children('img').attr('src');
	var selleruserid = $('#selleruserid').val();
	if (status.val()=="") {
		bootbox.alert('请选择需要上传的图片');
		return;
	}
	$.showLoading();
	$.post(global.baseUrl + 'listing/ebaymuban/uploadimg',{img:urlPath,selleruserid:selleruserid},function(data){
		$.hideLoading();
		if(data.status){
			status.val(data.data);
			$(obj).parent().children('img').attr('src',data.data);
			bootbox.alert("上传成功");
		}else{
			bootbox.alert(data.data);
		}
	},"json");
}

//设置店铺类目
function doset(ca){
	var Url=global.baseUrl +'listing/ebaystorecategory/mubansetstorecategory';
	$.ajax({
        type : 'post',
        cache : 'false',
        data : {selleruserid : $('#selleruserid').val(),cid:ca},
		url: Url,
        success:function(response) {
        	$('#categorysetModal .modal-content').html(response);
        	$('#categorysetModal').modal('show');
        }
    });
}

//搜索ebay刊登类目
//type:primary:主类目；second：次类目
function searchcategory(typ){
	var Url=global.baseUrl +'listing/ebaymuban/searchcategory';
	$.ajax({
        type : 'get',
        cache : 'false',
        data : {siteid:$('#siteid').val(),typ:typ},
		url: Url,
        success:function(response) {
        	$('#searchcategoryModal .modal-content').html(response);
        	$('#searchcategoryModal').modal('show');
        }
    });
}
//页面滚动到指定位置
function goto(str){
	$('html,body').animate({scrollTop:$('#'+str).offset().top}, 800);
}

//批量上传图片的触发
function mutiupload(){
	$('#btn-uploader').click();
	$('.mutiuploader').show();
}
