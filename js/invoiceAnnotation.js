$(function(){
    var invoiceAnnotation = {
        canvas: '',
        invoiceArray:[],
        pointArray:[],
        firstLine:'',
        secondLine:'',
        count: 0,
        init: function(){
            this.initCanvas();
            this.drawFrame();
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
            $('canvas').on('click', function(event){
                _self.pointArray[_self.count] = {x: event.offsetX, y: event.offsetY};
                _self.drawLine();
                console.log(_self.count)
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
                    var frameObj = new fabric.Path(
                        'M ' + _self.pointArray[0].x + ' ' + _self.pointArray[0].y + 
                        'L ' + _self.pointArray[1].x + ' ' + _self.pointArray[1].y + 
                        'L ' + _self.pointArray[2].x + ' ' + _self.pointArray[2].y + 
                        'L ' + _self.pointArray[3].x + ' ' + _self.pointArray[3].y + 
                        ' z');
                        frameObj.set('fill',null);
                        frameObj.set({ strokeWidth: 3, stroke: '#0066ff' });
                    _self.canvas.add(frameObj);
                    _self.invoiceArray.push(frameObj);
                    _self.count =-1;
                    break;
            } 
        }
    }
    invoiceAnnotation.init();
})