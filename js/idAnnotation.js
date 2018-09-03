$(function () {
    var idAnnotation = {
        canvas: document.getElementById('canvas'),
        context: '',
        firstPoint: {},
        secondPoint: {},
        thirdPoint: {},
        lastPoint: {},
        idPositive: {},
        idOpposite: {},
        count: 0,
        init: function () {
            this.initCanvas();
            this.checkPositive();
            this.drawLine();
            this.upload();
            this.cancelCheck();
            this.cancelCheckAll();
        },
        // 切换身份证正反面
        checkPositive: function () {
            $('.form-area-operate').on('click', function (event) {
                var $this = $(event.target);
                if ($this.is('.operate-positive')) {
                    $this.addClass('active').siblings().removeClass('active');
                    $('.id-positive').addClass('show').siblings().removeClass('show');
                }
                if ($this.is('.operate-opposite')) {
                    $this.addClass('active').siblings().removeClass('active');
                    $('.id-opposite').addClass('show').siblings().removeClass('show');
                }
            })
        },
        // 初始化canvas
        initCanvas: function () {
            this.canvas.width = $('.annotate-image').width();
            this.canvas.height = $('.annotate-image').height();
            this.context = this.canvas.getContext('2d');
            this.context.lineWidth = 1;
            this.context.strokeStyle = '#32bea6';
        },
        // 画直线
        drawLine: function () {
            var _self = this;
            $('#canvas').on('click', function(event) {
                switch (_self.count) {
                    case 0:
                        _self.firstPoint.x = event.offsetX;
                        _self.firstPoint.y = event.offsetY;
                        _self.context.moveTo(event.offsetX, event.offsetY);
                        break;
                    case 1: 
                        _self.secondPoint.x = event.offsetX;
                        _self.secondPoint.y = event.offsetY;
                        _self.context.lineTo(event.offsetX, event.offsetY);
                        break;
                    case 2: 
                        _self.thirdPoint.x = event.offsetX;
                        _self.thirdPoint.y = event.offsetY;
                        _self.context.lineTo(event.offsetX, event.offsetY);
                        break;
                    case 3:
                        _self.lastPoint.x = event.offsetX;
                        _self.lastPoint.y = event.offsetY;
                        _self.context.lineTo(event.offsetX, event.offsetY);
                        _self.context.lineTo(_self.firstPoint.x, _self.firstPoint.y);
                        break;
                    default:
                        return;
                }
                _self.context.stroke();
                _self.drawArc(event.offsetX, event.offsetY)
                _self.count++;
            })
        },
        // 画圆
        drawArc: function(x, y) {
            this.context.beginPath();
            this.context.arc(x, y, 3, 0, 2*Math.PI);
            this.context.fillStyle = '#32bea6';
            this.context.fill();
            this.context.closePath();
            this.context.stroke();
        },
        
        // 取消当前锚点
        cancelCheck: function () {
            var _self = this;
            $('.cancel-check').on('click', function() {
                _self.initCanvas();
                switch (_self.count) {
                    case 1:
                        _self.firstPoint = {};
                        break;
                    case 2:
                        _self.secondPoint = {};
                        _self.context.moveTo(_self.firstPoint.x, _self.firstPoint.y);
                        _self.context.stroke();
                        _self.drawArc(_self.firstPoint.x, _self.firstPoint.y);
                        break;
                    case 3: 
                        _self.thirdPoint = {};
                        _self.context.moveTo(_self.firstPoint.x, _self.firstPoint.y);
                        _self.context.lineTo(_self.secondPoint.x, _self.secondPoint.y);
                        _self.context.stroke();
                        _self.drawArc(_self.firstPoint.x, _self.firstPoint.y);
                        _self.drawArc(_self.secondPoint.x, _self.secondPoint.y);
                        break;
                    case 4:
                        _self.lastPoint = {};
                        _self.context.moveTo(_self.firstPoint.x, _self.firstPoint.y);
                        _self.context.lineTo(_self.secondPoint.x, _self.secondPoint.y);
                        _self.context.lineTo(_self.thirdPoint.x, _self.thirdPoint.y);
                        _self.context.stroke();
                        _self.drawArc(_self.firstPoint.x, _self.firstPoint.y);
                        _self.drawArc(_self.secondPoint.x, _self.secondPoint.y);
                        _self.drawArc(_self.thirdPoint.x, _self.thirdPoint.y);
                        break;
                    default:
                        return;
                }
                _self.count--;
            })
        },
        // 取消全部锚点
        cancelCheckAll: function() {
            var _self = this;
            $('.cancel-check-all').on('click', function() {
                _self.count = 0;
                _self.initCanvas();
            })
        },
        // 点击上传
        upload: function () {
            var _self = this;
            $('.upload-btn').on('click', function () {
                if($('.id-positive').is('.show')) {
                    _self.idPositive.name = $('.id-name').val();
                    _self.idPositive.sex = $('.id-sex').val();
                    _self.idPositive.race = $('.id-race').val();
                    _self.idPositive.year = $('.id-date-year').val();
                    _self.idPositive.month = $('.id-date-month').val();
                    _self.idPositive.day = $('.id-date-day').val();
                    _self.idPositive.addressFirst = $('.id-address-first').val();
                    _self.idPositive.addressSecond = $('.id-address-second').val();
                    _self.idPositive.addressThird = $('.id-address-third').val();
                    _self.idPositive.number = $('.id-number').val();
                    console.log(_self.idPositive)
                } else {
                    _self.idOpposite.sign = $('.sign-organization').val();
                    _self.idOpposite.date = $('.effecitve-date').val();
                    console.log(_self.idOpposite);
                }
            })
        }
    }
    idAnnotation.init();
})