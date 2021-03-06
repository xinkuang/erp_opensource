<?php
use yii\helpers\Html;
use yii\helpers\Url;
use eagle\modules\order\models\OdOrder;
use eagle\modules\order\models\OdOrderShipped;
use eagle\modules\carrier\apihelpers\CarrierApiHelper;
use eagle\modules\order\helpers\EnsogoOrderInterface;


?>
<br>
<form action="<?=Url::to(['/order/ensogo-order/signshippedsubmit'])?>" method="post">
<?php if (count($orders)):foreach ($orders as $order):?>
<div class="alert alert-dismissible" role="alert"  style="border:1px solid #d9effc;">
  <button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">&times;</span></button>
  <?php $odship=OdOrderShipped::find()->where(['order_id'=>$order->order_id,'status'=>0])->orderBy('id DESC')->one();?>
  	<table class="table table-bordered" style="border:0px;">
  		<tr style="background-color: #f4f9fc;font-size:12px;">
  			<td colspan="4">
  				订单号:<b><?=$order->order_source_order_id?><?=Html::input('hidden','order_id[]',$order->order_id)?></b>
  				<?php if (count($order->queueships)):?>
					<span style="background-color:#fff8d9"><font color="red">!</font>该订单在标记发货队列中已处理或未处理,如果不希望重复标记,您可以取消该订单</span>
				 <?php endif;?>
  		</td></tr>
  		<tr>
  			<td>收件人：<?=$order->consignee?></td>
  			<td>运单号<?=Html::input('',"tracknum[$order->order_id]",@$odship->tracking_number,['size'=>10])?></td>
  			<td>查询网址<?=Html::input('',"trackurl[$order->order_id]",strlen(@$odship->tracking_link)?$odship->tracking_link:'http://www.17track.net',['size'=>30])?></td>
  			<td>运输服务
  			<?php if (isset($odship->shipping_method_code)){
				$method = $odship->shipping_method_code;
			}else{
				if (!empty($order->default_shipping_method_code)){
					$method=CarrierApiHelper::getServiceCode($order->default_shipping_method_code,$order->order_source);
				}else{
					$method = $order->order_source_shipping_method;
				}
			}?>
			<?php   
			$tracker_provider_list  = EnsogoOrderInterface::getShippingCodeNameMap();
			?>
			<?=Html::dropDownList("shipmethod[$order->order_id]",$method,$tracker_provider_list,['prompt'=>'运输服务','style'=>'width:150px;','id'=>'carrier_code',])?>
  			</td>
  		</tr>
  		<tr>
  		<td colspan="4">发货留言<?=Html::input('',"message[$order->order_id]",'',['size'=>200])?></td>
  		</tr>	
  	</table>
</div>
<?php endforeach;endif;?>
<center><?=Html::submitButton('标记发货',['class'=>'btn btn-success'])?>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
<?=Html::button('取消',['class'=>'btn','onclick'=>'window.close();'])?>
</center>
</form>