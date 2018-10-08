$(function(){
    var invoiceAnnotation = {
        canvas: '',
        invoiceArray:[],
        pointArray:[],
        firstLine:'',
        secondLine:'',
        count: 0,
        selectIndex: -1,
        imageScale: 1,
//        selectArr: [{key:'invoiceCode', value: '发票代码'},{key:'invoiceNum', value: '发票号码'},{key:'invoiceDate', value: '开票日期'},{key:'totalMoney', value: '合计金额'},{key:'totalInvoiceMoney', value: '合计税额'},{key:'allMoney', value: '价税合计'},{key:'checkCode', value: '校验码'}],
        selectArr: [{key:'openDate', value: '开票日期'},{key:'invoiceCode', value: '发票代码'},{key:'invoiceNum', value: '发票号码'},{key:'carSmallMoney', value: '车价合计小写'},{key:'carBigMoney', value: '车价合计大写'}],
        init: function(){
            this.initCanvas();
            this.drawFrame();
            this.selectFrame();
            this.initContent();
            this.deleteFrame();
            this.upload();
            this.deleteAllFrame();
            this.nextImage();
            this.lastImage();
            this.invoiceType();
            this.imageTranstion();
            this.disableCheck();
            this.drawMoveFrame();
            this.frameType();
        },
        // 发票类型
        invoiceType: function() {
            var _self = this;
            $('.ordinary-invoice').off('change')
            $('.ordinary-invoice').on('change',function(){
                if($(this).prop('checked')){
                    _self.selectArr.pop();
                }else {
                    _self.selectArr.push({key:'checkCode', value: '校验码'});
                }
            })
        },
        frameType: function() {
            var _self = this;
            $('.check-frame').off('change');
            $('.check-frame').on('change', function(){
                if(_self.count !=0){
                    alert('请标完当前选框，再切换选框类型');
                    $(this).prop('checked', false);
                };
            })
        },
        // 初始化canvas
        initCanvas: function(){
            this.canvas = document.getElementById('canvas');
            this.canvas.width = $('.annotate-image').width();
            this.canvas.height = $('.annotate-image').height();
            this.canvas =new fabric.Canvas('canvas');
        },
        // 初始化image
        initImage: function() {
            var _self = this;
            $.ajax({
                url: '/subscriber/imagelabelInfoInvoice/imagelabel',
                contentType: 'application/json',
                data: JSON.stringify({}),
                type: 'post',
                success: function(data){
                    var img = new Image();
                    img.src = data.imageUrl;
                    img.onload = function(){
                        _self.scaleImage(img, data.id); 
                        _self.reset();
                        
                    }
                }
            })
        },
        // 转化image扩大和图片
        scaleImage: function(img, id){
        	$('.annotate-image').attr('src', img.src);
        	$('.show-annotate-image').attr('src', img.src);
            $('.annotate-image').attr('id', id);
            // var scaleHeight = img.height / $('.annotate-image').height();
            var scaleWidth = img.width / $('.annotate-image').width();
            // var scaleMax = scaleHeight > scaleWidth ? scaleHeight : scaleWidth;
            this.imageScale = scaleWidth > 1 ? scaleWidth : 1;
            $('.form-area').css({height: $('.annotate-image').height() + 60});
            $('.invoice-annotation').css({height: $('.annotate-image').height() + 160});
        },
        // 画框
        drawFrame: function(){
            var _self = this;
            $('canvas').off('click');
            $('canvas').on('click', function(event){
                if($('.check-frame').prop('checked')) return;
            	var frameNum = 0;
            	_self.canvas.getObjects().forEach(function(item){
            		if(item.path) {
            			frameNum += 1;
            		}
            	})
            	console.log(_self.count);
            	if (frameNum >= _self.selectArr.length) {
            		layer.msg("框达到上限！");
            		return false;
            	}
                _self.pointArray[_self.count] = {x: event.offsetX, y: event.offsetY};
                _self.drawLine();
                _self.count++;
            })
        },
        // 移动鼠标画框
        drawMoveFrame: function(){
            var _self = this;
            $('.upper-canvas').off('mousedown');
            $('.upper-canvas').on('mousedown', function(e){
                if (e.which == 3) {
                    return
                }
                if(!$('.check-frame').prop('checked')) return;
                var frameNum = 0;
            	_self.canvas.getObjects().forEach(function(item){
            		if(item.path) {
            			frameNum += 1;
            		}
            	})
            	console.log(_self.count);
            	if (frameNum >= _self.selectArr.length) {
            		layer.msg("框达到上限！");
            		return false;
            	}
                _self.pointArray[0] = {x: e.offsetX, y: e.offsetY};
                $(document).bind('mouseup', function (event) {
                    $('canvas').unbind('mousemove');
                    $('.tempDiv').unbind('mousemove');
                    $(document).unbind('mouseup');
                    _self.pointArray[1] = {x: e.offsetX, y: event.offsetY};
                    _self.pointArray[2] = {x: event.offsetX, y: event.offsetY};
                    _self.pointArray[3] = {x: event.offsetX, y: e.offsetY};
                    _self.drawRect(_self.pointArray);
                    _self.drawNumCircle(_self.pointArray);
                })
            })
        },
        // 画线
        drawLine: function(){
            var _self = this;
            switch (this.count) {
                case 0:
                _self.zeroCircle = new fabric.Circle({radius: 3, fill: '#0066ff', left: _self.pointArray[0].x-3, top: _self.pointArray[0].y-3})
                _self.canvas.add(_self.zeroCircle);
                break;
                case 1:
                    _self.firstLine = new fabric.Line([_self.pointArray[0].x, _self.pointArray[0].y, _self.pointArray[1].x, _self.pointArray[1].y],{
                        fill: '#0066ff',
                        stroke: '#0066ff'
                    })
                    _self.firstCircle = new fabric.Circle({radius: 3, fill: '#0066ff', left: _self.pointArray[1].x-3, top: _self.pointArray[1].y-3})
                    _self.canvas.add(_self.firstLine);
                    _self.canvas.add(_self.firstCircle);
                break;
                case 2:
                    _self.secondLine = new fabric.Line([_self.pointArray[1].x, _self.pointArray[1].y, _self.pointArray[2].x, _self.pointArray[2].y],{
                        fill: '#0066ff',
                        stroke: '#0066ff'
                    })
                    _self.secondCircle = new fabric.Circle({radius: 3, fill: '#0066ff', left: _self.pointArray[2].x-3, top: _self.pointArray[2].y-3})
                    _self.canvas.add(_self.secondCircle);
                    _self.canvas.add(_self.secondLine);
                break;
                case 3:
                    _self.canvas.remove(_self.firstLine);
                    _self.canvas.remove(_self.secondLine);
                    _self.canvas.remove(_self.zeroCircle);
                    _self.canvas.remove(_self.firstCircle);
                    _self.canvas.remove(_self.secondCircle);
                    _self.drawRect(_self.pointArray);
                    _self.count = -1;
                    _self.drawNumCircle(_self.pointArray);
                    break;
            } 
        },
        // 初始化内容框
        initContent: function() {
            this.$content = $('<div class="form-area-content"><span class="content-index"></span><input type="text" class="content-text"><select class="content-select"></select></div>');
        },
        // 画不规则矩形
        drawRect: function(pointArray) {
            var frameObj = new fabric.Path(
                'M ' + pointArray[0].x + ' ' + pointArray[0].y + 
                'L ' + pointArray[1].x + ' ' + pointArray[1].y + 
                'L ' + pointArray[2].x + ' ' + pointArray[2].y + 
                'L ' + pointArray[3].x + ' ' + pointArray[3].y + 
                ' z'); 
            frameObj.set('fill',null);
            frameObj.set({ strokeWidth: 2, stroke: '#0066ff' });
            this.canvas.add(frameObj);
            frameObj.lockMovementX = true
            frameObj.lockMovementY = true
            frameObj.hasControls = false;
        },
        // 画序列小圆
        drawNumCircle: function(pointArray){
            var objects = this.canvas.getObjects();
            var $div = $('<div class="num-circle">' + objects.length + '</div>');
            $div.css({
                'top': pointArray[0].y -6,
                'left': pointArray[0].x -6
            })
            $('.image-area-annotate').append($div);
            this.drawContent();
        },
        // 增加填充内容框
        drawContent: function() {
            var _self = this;
            var $content = this.$content.clone();
            $content.find('.content-index').html(this.canvas.getObjects().length);
            $('.upload-btn').before($content);
            this.selectArr.forEach(function(value, index){
                if (index+1 == _self.canvas.getObjects().length) {
                    var $option = $('<option value="' + value.key + '" selected="selected">' + value.value + '</option>');
                }else {
                    var $option = $('<option value="' + value.key + '">' + value.value + '</option>');
                }
                $content.find('.content-select').append($option);
            })
            $content.find('.content-text').focus();
        },
        // 选择某个框
        selectFrame: function(){
            var _self = this;
            $('canvas').on('contextmenu', function(event){
                // var pointer = _self.canvas.getPointer(event.originalEvent);
                var objects = _self.canvas.getObjects();
                for(var i= objects.length-1; i>=0; i--){
                    var object = objects[i];
                    
                    if(_self.canvas.containsPoint(event, object)) {
                        _self.canvas.setActiveObject(object);
                        _self.canvas.requestRenderAll();
                        if (object.path) {
                            _self.selectIndex = i;
                        } else {
                            _self.selectIndex = -2;

                        }
                        break;
                    }else {
                        _self.selectIndex = -1;
                    }
                }
                event.preventDefault();
                return false;
            })
        },
        // 删除单个框
        deleteFrame: function() {
            var _self = this;
            $('.cancel-check').off('click')
            $('.cancel-check').on('click', function(){
                if(_self.selectIndex > -1) {
                    var objects = _self.canvas.getObjects();
                    _self.canvas.remove(objects[_self.selectIndex]);
                    $('.form-area-content').eq(_self.selectIndex).remove();
                    $('.num-circle').eq(_self.selectIndex).remove();
                    for(var i=_self.selectIndex; i < objects.length; i++) {
                        $('.form-area-content').eq(i).find('.content-index').html(i+1);
                        $('.num-circle').eq(i).html(i+1);
                    }
                }
                if(_self.selectIndex < -1) {
                    var objects = _self.canvas.getObjects();
                    objects.forEach(function(item) {
                        if(!item.path) {
                            _self.canvas.remove(item);
                        }
                    })
                    _self.count = 0;
                }
            })
        },
        // 删除全部选框
        deleteAllFrame: function(){
            var _self = this;
            $('.cancel-check-all').off('click');
            $('.cancel-check-all').on('click', function(){
                $('.form-area-content').remove();
                $('.num-circle').remove();
                _self.canvas.getObjects().forEach(function(item) {
                    _self.canvas.remove(item);
                })
                _self.count = 0;
            })
        },
        // 重置
        reset: function(){
            $('.form-area-content').remove();
            $('.num-circle').remove();
            this.count = 0;
            this.selectIndex = -1;
            this.invoiceArray = [];
            this.pointArr = [];
            $('.image-area-annotate').append($('#canvas').clone());
            $('.canvas-container').remove();
            this.init();
        },
        // 上传
        upload: function() {
            var _self = this;
            $('.upload-btn').off('click');
            $('.upload-btn').on('click', function(){
                var objects = _self.canvas.getObjects();
                _self.invoiceArray = [];
                var typeArr = [];
                if(objects.length < 1) {
                    alert('请标注内容后提交！');
                    return false;
                }
                if(_self.count != 0) {
                    alert('请将标注线连成框后再提交！');
                    return false;
                }
                objects.forEach(function(item){
                    var invoiceObj = {pointArr:[], content:'', type:''};
                    invoiceObj.pointArr[0] = {x: item.path[0][1] * _self.imageScale, y: item.path[0][2] * _self.imageScale};
                    invoiceObj.pointArr[1] = {x: item.path[1][1] * _self.imageScale, y: item.path[1][2] * _self.imageScale};
                    invoiceObj.pointArr[2] = {x: item.path[2][1] * _self.imageScale, y: item.path[2][2] * _self.imageScale};
                    invoiceObj.pointArr[3] = {x: item.path[3][1] * _self.imageScale, y: item.path[3][2] * _self.imageScale};
                    _self.invoiceArray.push(invoiceObj);
                });
                _self.invoiceArray.forEach(function(item, index){
                    item.content = $('.form-area-content').eq(index).find('.content-text').val();
                    item.type = $('.form-area-content').eq(index).find('.content-select').val();
                    typeArr.push(item.type);
                })
                var id = $('.annotate-image').attr("id");
                var invoiceDate = {id: id, temp1:_self.invoiceArray};
                // 判断是否有重复
                for(var i=0; i < typeArr.length; i++){
                    if(JSON.stringify(typeArr).match(new RegExp(typeArr[i], 'g')).length > 1){
                        alert('请不要选择相同类型！');
                        return false;
                    }
                }
                if(typeArr.length < _self.selectArr.length) {
                    alert('请标注齐全再上传!');
                    return false;
                }
                console.log(invoiceDate)
                _self.handleAjax(invoiceDate);
            })
        },
        handleAjax: function (data) {
            var _self = this;
            $.ajax({
                url: '/subscriber/imagelabelInfoInvoice/saveLabelImage',
                contentType: 'application/json',
                data: JSON.stringify(data),
                type: 'post',
                success: function (data) {
                    if (Number(data.code) === 0) {
                        var img = new Image();
                        img.src = data.imageUrl;
                        img.onload = function () {
                        	_self.scaleImage(img, data.id);
                        	_self.reset();
                        }
                    } else {
                        alert(data.msg);
                    }
                }
            })
        },
        // 下一张
        nextImage: function() {
            var _self = this;
            $('.next-image').off('click');
            $('.next-image').on('click', function () {
                var id = $('.annotate-image').attr('id');
                var data = {
                    id: id,
                    recordType: 1
                };
                _self.handleImage(data);
            })
        },
        // 上一张
        lastImage: function() {
            var _self = this;
            $('.last-image').off('click');
            $('.last-image').on('click', function () {
                var id = $('.annotate-image').attr('id');
                var data = {
                    id: id,
                    recordType: 0
                };
                _self.handleImage(data);
            })
        },
        // 改变张数
        handleImage: function(data) {
            var _self = this;
            $.ajax({
                url: '/subscriber/imagelabelInfoInvoice/getImageRecord',
                contentType: 'application/json',
                data: JSON.stringify(data),
                type: 'post',
                success: function(data) {
                    if(Number(data.code) === 0) {
                        var img = new Image();
                        img.src = data.imageUrl;
                        img.onload = function() {
                            _self.scaleImage(img, data.id);
                            _self.reset();
                            if(!data.data){
                            	return false;
                            }
                            data.data.forEach(function(item){
                                var newPointArr=[];
                                item.pointArr.forEach(function(arrObj){
                                    newPointArr.push({x: arrObj.x / _self.imageScale, y: arrObj.y / _self.imageScale});
                                })
                                _self.drawRect(newPointArr);
                                _self.drawNumCircle(newPointArr);
                                $('.form-area-content').last().find('.content-text').val(item.content);
                                $('.form-area-content').last().find('.content-select').val(item.type);
                            })
                        }
                    }else {
                        alert(data.msg);
                    }
                }
            })
        },
     // 旋转
        imageTranstion: function(){
        	$('.show-annotate-image').off('click');
        	$('.show-annotate-image').on('click', function() {
        		var deg=eval('get'+$(this).css('transform'));//构造getmatrix函数,返回上次旋转度数  
        	     var step=45;//每次旋转多少度  
        	     $(this).css({'transform':'rotate('+(deg+step)%360+'deg)'});  
        	})
        },
     // 废除本张，跳转下一张
        disableCheck: function() {
        	var _self = this;
        	$('.disable-check').off('click');
        	$('.disable-check').on('click', function () {
        		var sureBtn = confirm('确认废除么？');
        		if(!sureBtn) {
        			return;
        		}
        		var id = $('.annotate-image').attr('id');
        		$.ajax({
                    url: '/subscriber/imagelabelInfoInvoice/delLabelImage',
                    contentType: 'application/json',
                    data: JSON.stringify({id: id}),
                    type: 'post',
                    success: function (data) {
                    	if (Number(data.code) === 0) {
                            var img = new Image();
                            img.src = data.imageUrl;
                            img.onload = function () {
                            	_self.scaleImage(img, data.id);
                            	_self.reset();
                            }
                        } else {
                            alert(data.msg);
                        }
                    }
                })
        	})
        },

    }
    invoiceAnnotation.init();
    invoiceAnnotation.initImage();
})



function getmatrix(a,b,c,d,e,f){  
    var aa=Math.round(180*Math.asin(a)/ Math.PI);  
    var bb=Math.round(180*Math.acos(b)/ Math.PI);  
    var cc=Math.round(180*Math.asin(c)/ Math.PI);  
    var dd=Math.round(180*Math.acos(d)/ Math.PI);  
    var deg=0;  
    if(aa==bb||-aa==bb){  
        deg=dd;  
    }else if(-aa+bb==180){  
        deg=180+cc;  
    }else if(aa+bb==180){  
        deg=360-cc||360-dd;  
    }  
    return deg>=360?0:deg;  
    //return (aa+','+bb+','+cc+','+dd);  
}