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
        init: function(){
            this.initCanvas();
            this.drawFrame();
            this.selectFrame();
            this.initContent();
            this.deleteFrame();
            this.upload();
            this.deleteAllFrame();
            this.nextImage();
        },
        // 初始化canvas
        initCanvas: function(){
            this.canvas = document.getElementById('canvas');
            this.canvas.width = $('.annotate-image').width();
            this.canvas.height = $('.annotate-image').height();
            this.canvas =new fabric.Canvas('canvas');
        },
        // 画框
        drawFrame: function(){
            var _self = this;
            $('canvas').off('click');
            $('canvas').on('click', function(event){
                _self.pointArray[_self.count] = {x: event.offsetX, y: event.offsetY};
                _self.drawLine();
                _self.count++;
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
            this.$content = $('<div class="form-area-content"><span class="content-index"></span><input type="text" class="content-text"></div>');
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
            var $content = this.$content.clone();
            $content.find('.content-index').html(this.canvas.getObjects().length);
            $('.upload-btn').before($content);
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
                objects.forEach(function(item){
                    var invoiceObj = {pointArr:[], content:''};
                    invoiceObj.pointArr[0] = {x: item.path[0][1] * _self.imageScale, y: item.path[0][2] * _self.imageScale};
                    invoiceObj.pointArr[1] = {x: item.path[1][1] * _self.imageScale, y: item.path[1][2] * _self.imageScale};
                    invoiceObj.pointArr[2] = {x: item.path[2][1] * _self.imageScale, y: item.path[2][2] * _self.imageScale};
                    invoiceObj.pointArr[3] = {x: item.path[3][1] * _self.imageScale, y: item.path[3][2] * _self.imageScale};
                    _self.invoiceArray.push(invoiceObj);
                });
                _self.invoiceArray.forEach(function(item, index){
                    item.content = $('.form-area-content').eq(index).find('.content-text').val();
                })
                _self.reset();              
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
        // 改变张数
        handleImage: function(data) {
            var _self = this;
            $.ajax({
                url: '/subscriber/imagelabelInfo/getImageRecord',
                contentType: 'application/json',
                data: JSON.stringify(data),
                type: 'post',
                error: function(data) {
                    if(Number(data.code) !== 0) {
                        _self.reset();
                        data = [
                            {pointArr:[{x: 217, y:76},{x:281, y:74},{x:292, y:146}, {x:237, y:147}], content: 1},
                            {pointArr:[{x: 337, y:72},{x:429, y:85},{x:430, y:163}, {x:312, y:172}], content: 2},
                            {pointArr:[{x: 515, y:69},{x:573, y:79},{x:554, y:168}, {x:463, y:190}], content: 3}
                        ];
                        var img = new Image();
                        img.src = '../img/4.jpg';
                        img.onload = function() {
                            var scaleHeight = img.height / $('.annotate-image').height();
                            var scaleWidth = img.width / $('.annotate-image').width();
                            var scaleMax = scaleHeight > scaleWidth ? scaleHeight : scaleWidth;
                            _self.imageScale = scaleMax > 1 ? scaleMax : 1;
                            $('.annotate-image').attr('src', img.src);
                            $('.annotate-image').attr('id', data.id);
                            data.forEach(function(item){
                                var newPointArr=[];
                                item.pointArr.forEach(function(arrObj){
                                    newPointArr.push({x: arrObj.x / _self.imageScale, y: arrObj.y / _self.imageScale});
                                })
                                _self.drawRect(newPointArr);
                                _self.drawNumCircle(newPointArr);
                                $('.form-area-content').last().find('.content-text').val(item.content);
                            })
                        }
                    }else {
                        alert(data.msg);
                    }
                }
            })
        }

    }
    invoiceAnnotation.init();
})