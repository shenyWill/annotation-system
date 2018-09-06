var prefix = "/subscriber/imagelabelInfo"
var requestObj = {};
$(function () {
    load();
});

function load() {
    var $ul = $('.attr-nav');
    var $mask = $('.attr-mask');
    var initLeft = parseFloat($('.people-img').offset().left); // 图片距离顶部距离
    var initTop = parseFloat($('.people-img').offset().top); // 图片距离左边距离   

    // 画矩形方阵
    $('.people-img').bind('mousedown', function (e) {
        if (e.which == 3) {
            return
        }
        var posx = e.clientX;
        var posy = e.clientY;
        var $div = $(`<div class="tempDiv" time="${+new Date()}"></div>`);
        $div.css({
            left: e.clientX + "px",
            top: e.clientY + "px"
        })
        $('body').append($div);

        $('.people-img,.tempDiv').bind('mousemove', function (ev) {
            $div.css({
                left: Math.min(ev.clientX, posx) + "px",
                top: Math.min(ev.clientY, posy) + "px",
                width: Math.abs(posx - ev.clientX) + "px",
                height: Math.abs(posy - ev.clientY) + "px"
            })
        })

        $(document).bind('mouseup', function (event) {
            $('.people-img').unbind('mousemove');
            $('.tempDiv').unbind('mousemove');
            $(document).unbind('mouseup');
            if (parseFloat($div.width()) > 5 && parseFloat($div.height()) > 5) {
                $ul.css({
                    top: event.clientY,
                    left: event.clientX,
                })
                $mask.show();
            } else {
                $div.remove();
            }
        })
    })

    // 修改属性配置
    $('.config-btn').on('click', function () {
        $ul.html('');
        $('[name="configAttr"]:checked').each((index, ele) => {
            let name = $(ele).attr('label');
            let value = $(ele).attr('value');
            let $li = $(`<li class="attr-list" val="${value}">${name}</li>`);
            $ul.append($li)
        });
    })
    $('.config-btn').trigger('click');

    // 选择每个方阵属性
    $('.attr-nav').on('click', function (event) {
        let $this = $(event.target);
        let configAtrr = $this.attr('val');
        let $tempDiv = $('.tempDiv').last()
        for (let i in requestObj) {
            if (i == configAtrr) {
                alert("不能重复标记相同属性！")
                $tempDiv.remove();
                $mask.hide();
                return;
            }
        }
        let startSpotLeft = parseFloat($tempDiv.css('left')) - initLeft;
        let startSpotTop = parseFloat($tempDiv.css('top')) - initTop;
        let startSpot = {
            left: startSpotLeft,
            top: startSpotTop
        }; // 起始点
        let endSpot = {
            left: startSpotLeft + parseFloat($tempDiv.width()),
            top: startSpotTop + parseFloat($tempDiv.height())
        }; // 结束点
        let time = $tempDiv.attr('time');
        $('.attr-nav').hide();

        // 填写属性信息
        $('.attr-form').show();
        $('.attr-btn').off('click');
        $('.attr-btn').on('click',function(){
            let attrInfo = $('.attr-info').val();
            let attrTitle = $this.text();
            let $detailKey = $(`<span class="detail-key">${attrTitle}: </span>`);
            let $detailValue = $(`<span class="detail-value"> ${attrInfo}</span>`);
            
            $('.annot-detail').append($detailKey).append($detailValue)
            console.log(attrInfo)
            requestObj[configAtrr] = {
                startSpot: startSpot,
                endSpot: endSpot,
                time: time,
                attrInfo:attrInfo,
            }
            $('.attr-info').val('')
            $('.attr-form').hide();
            $('.attr-nav').show()
            $mask.hide();
        })
 

    })

    // 清除所有标记
    $('.remove-btn').on('click', function () {
        $('.tempDiv').remove();
        requestObj = {};
    })

    // 鼠标右击清除当前标记
    $(document).on('contextmenu', '.tempDiv', function (event) {
        let $this = $(event.target);
        let thisTime = $this.attr('time')
        
        event.preventDefault();
        $('.remove-nav').css({
            top: event.clientY,
            left: event.clientX,
        })
        $('.remove-mask').show();
        $('.remove-mask').off('click')
        $('.remove-mask').on('click', function (e) {
            $('.remove-mask').hide();
            if ($(e.target).is('.remove-list')) {
                $this.remove();
                for (let i in requestObj) {
                    if (requestObj[i].time == thisTime) {
                        delete requestObj[i]
                    }
                }
                console.log(requestObj)
            }
        })
    })
    // 保存到后端，前往下一页
    $('.success-btn').on('click', nextImage)
}


function nextImage() {
	console.log(requestObj);
	let imageIdValue = $('#imageId').val();
	requestObj.imageId = imageIdValue;
	$.ajax({
		url : prefix+"/getImage",
		type : "post",
		data : {
			'requestData' : JSON.stringify(requestObj)
		},
		success : function(r) {
			if (r.code==0) {
				$('.people-img').attr("src",r.imageUrl);
				$('#imageId').attr("value",r.id);
				$('.annot-detail').html('');
				$('.remove-btn').trigger('click')
				//reLoad();
			}else{
				layer.msg(r.msg);
			}
		}
	});
}