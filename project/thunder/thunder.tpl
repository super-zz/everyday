<!--
 * describe
 * 	1-5级小闪电级别 
 * css
 * 	样式可直接复写.thunder
 * 引用方式
 * 	$thunderActiveNum = 2   被激活等级
 * 	$noDescribe = true      是否不显示等级描述
 * 	widget name="pc-work-station-fis:widget/common-ui/thunder/thunder.tpl" 
 -->

<section class="thunder color-{%$thunderActiveNum%}">
	{%if !$noDescribe%}
		<em>{%$thunderActiveNum%}级</em>	
	{%/if%}
	{%section name=starnum start=0 loop=5 step=1%}
		<svg 
		version="1.1" 
		xmlns="http://www.w3.org/2000/svg" 
		xmlns:xlink="http://www.w3.org/1999/xlink" 
		x="0px" 
		y="0px"
	 	viewBox="0 0 12 12" 
	 	xml:space="preserve" 
	 	class="{%if $smarty.section.starnum.index < $thunderActiveNum%}light{%/if%}">
			<g>
				<polygon points="10,5 6.551,5 9,0 4.714,0 2,7 4.429,7 3,12 	"/>
			</g>
		</svg>
	{%/section%}
</section>