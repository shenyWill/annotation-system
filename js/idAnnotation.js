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
        imageScale: 1,
        count: 0,
        init: function () {
            this.initCanvas();
            this.checkPositive();
            this.drawLine();
            this.upload();
            this.cancelCheck();
            this.cancelCheckAll();
            this.nextImage();
            this.lastImage();
            this.automaticRecongition();
            this.disableCheck();
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
            $('#canvas').on('click', function (event) {
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
        drawArc: function (x, y) {
            this.context.beginPath();
            this.context.arc(x, y, 3, 0, 2 * Math.PI);
            this.context.fillStyle = '#32bea6';
            this.context.fill();
            this.context.closePath();
            this.context.stroke();
        },

        // 取消当前锚点
        cancelCheck: function () {
            var _self = this;
            $('.cancel-check').on('click', function () {
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
        cancelCheckAll: function () {
            var _self = this;
            $('.cancel-check-all').on('click', function () {
                _self.count = 0;
                _self.firstPoint = {};
                _self.secondPoint = {};
                _self.thirdPoint = {};
                _self.lastPoint = {};
                _self.initCanvas();
            })
        },
        // 自动识别身份证
        
        // 点击上传
        upload: function () {
            var _self = this;
            $('.upload-btn').on('click', function () {
            	var id = $('.annotate-image').attr('id');
                if ($('.id-positive').is('.show')) {
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
                    _self.idOpposite.firstPoint = _self.firstPoint
                    _self.idOpposite.secondPoint = _self.secondPoint
                    _self.idOpposite.thirdPoint = _self.thirdPoint
                    _self.idOpposite.lastPoint = _self.lastPoint;
                    
                    for (var item in _self.idPositive) {
                        if (!_self.idPositive[item] && item != "addressSecond" && item != "addressThird") {
                        	
                            alert('请填写全部数据');
                            return false;
                        }
                        if ((typeof _self.idPositive[item] == 'object')) {
                            if (!Object.keys(_self.idPositive[item]).length) {
                                alert('请填写全部数据');
                                return false;
                            }
                        }
                    }
                    _self.idPositive.firstPoint.x = _self.firstPoint.x * _self.imageScale;
                    _self.idPositive.firstPoint.y = _self.firstPoint.y * _self.imageScale;
                    _self.idPositive.secondPoint.x = _self.secondPoint.x * _self.imageScale;
                    _self.idPositive.secondPoint.y = _self.secondPoint.y * _self.imageScale;
                    _self.idPositive.thirdPoint.x = _self.thirdPoint.x * _self.imageScale;
                    _self.idPositive.thirdPoint.y = _self.thirdPoint.y * _self.imageScale;
                    _self.idPositive.lastPoint.x = _self.lastPoint.x * _self.imageScale;
                    _self.idPositive.lastPoint.y = _self.lastPoint.y * _self.imageScale;
                    var data = {
                        id: id,
                        temp1: _self.idPositive
                    };
                    _self.handleAjax(data);
                } else {
                    _self.idOpposite.sign = $('.sign-organization').val();
                    if($('.effecitve-date-first').val() && $('.effecitve-date-second').val() && $('.effecitve-date-third').val() && $('.effecitve-date-fouth').val() && $('.effecitve-date-fivth').val() && $('.effecitve-date-sixth').val()) {
                        _self.idOpposite.date = $('.effecitve-date-first').val() + '.' +  $('.effecitve-date-second').val() + '.' + $('.effecitve-date-third').val() + '-' + $('.effecitve-date-fouth').val() + '.' + $('.effecitve-date-fivth').val() + '.' + $('.effecitve-date-sixth').val();
                    } else {
                        alert('请填写全部数据');
                        return false;
                    }
                    _self.idOpposite.firstPoint = _self.firstPoint
                    _self.idOpposite.secondPoint = _self.secondPoint
                    _self.idOpposite.thirdPoint = _self.thirdPoint
                    _self.idOpposite.lastPoint = _self.lastPoint;
                    for (var item in _self.idOpposite) {
                        if (!_self.idOpposite[item]) {
                            alert('请填写全部数据');
                            return false;
                        }
                        if ((typeof _self.idOpposite[item] == 'object')) {
                            if (!Object.keys(_self.idOpposite[item]).length) {
                                alert('请填写全部数据');
                                return false;
                            }
                        }
                    }
                    _self.idPositive.firstPoint.x = _self.firstPoint.x * _self.imageScale;
                    _self.idPositive.firstPoint.y = _self.firstPoint.y * _self.imageScale;
                    _self.idPositive.secondPoint.x = _self.secondPoint.x * _self.imageScale;
                    _self.idPositive.secondPoint.y = _self.secondPoint.y * _self.imageScale;
                    _self.idPositive.thirdPoint.x = _self.thirdPoint.x * _self.imageScale;
                    _self.idPositive.thirdPoint.y = _self.thirdPoint.y * _self.imageScale;
                    _self.idPositive.lastPoint.x = _self.lastPoint.x * _self.imageScale;
                    _self.idPositive.lastPoint.y = _self.lastPoint.y * _self.imageScale;
                    var data = {
                        id: id,
                        temp1: _self.idOpposite
                    };
                    console.log(data);
                    _self.handleAjax(data);
                }
            })
        },
        // 上传ajax
        handleAjax: function (data) {
            var _self = this;
            $.ajax({
                url: '/subscriber/imagelabelInfo/saveLabelImage',
                contentType: 'application/json',
                data: JSON.stringify(data),
                type: 'post',
                success: function (data) {
                    if (Number(data.code) === 0) {
                        _self.clearForm();
                        var img = new Image();
                        img.src = data.imageUrl;
                        img.onload = function () {
                            $('.annotate-image').attr('src',img.src);
                            $('.annotate-image').attr('id', data.id);
                            _self.initCanvas();
                            _self.firstPoint = {};
                            _self.secondPoint = {};
                            _self.thirdPoint = {};
                            _self.lastPoint = {};
                            _self.count = 0;
                            if (img.width > $('.annotate-image').width()) {
                                _self.imageScale = img.width / $('.annotate-image').width();
                            } else {
                                _self.imageScale = 1;
                            }
                        }
                    } else {
                        alert(data.msg);
                    }
                }
            })
        },
        // 废除本张，跳转下一张
        disableCheck: function() {
        	var _self = this;
        	$('.disable-check').on('click', function () {
        		var sureBtn = confirm('确认废除么？');
        		if(!sureBtn) {
        			return;
        		}
        		var id = $('.annotate-image').attr('id');
        		$.ajax({
                    url: '/subscriber/imagelabelInfo/delLabelImage',
                    contentType: 'application/json',
                    data: JSON.stringify({id: id}),
                    type: 'post',
                    success: function (data) {
                        if (Number(data.code) === 0) {
                            _self.clearForm();
                            var img = new Image();
                            img.src = data.imageUrl;
                            img.onload = function () {
                                $('.annotate-image').attr('src',img.src);
                                $('.annotate-image').attr('id', data.id);
                                _self.initCanvas();
                                _self.firstPoint = {};
                                _self.secondPoint = {};
                                _self.thirdPoint = {};
                                _self.lastPoint = {};
                                _self.count = 0;
                                if (img.width > $('.annotate-image').width()) {
                                    _self.imageScale = img.width / $('.annotate-image').width();
                                } else {
                                    _self.imageScale = 1;
                                }
                            }
                        } else {
                            alert(data.msg);
                        }
                    }
                })
        	})
        },
        
        // 清除form
        clearForm: function () {
            $('.id-name').val('');
            $('.id-sex').val('');
//            $('.id-race').val('');
            $('.id-date-year').val('');
            $('.id-date-month').val('');
            $('.id-date-day').val('');
            $('.id-address-first').val('');
            $('.id-address-second').val('');
            $('.id-address-third').val('');
            $('.id-number').val('');
            $('.sign-organization').val('');
            $('.effecitve-date-first').val('');
            $('.effecitve-date-second').val('');
            $('.effecitve-date-third').val('');
            $('.effecitve-date-fouth').val('');
            $('.effecitve-date-fivth').val('');
            $('.effecitve-date-sixth').val('');
        },
        // 重置form
        resetForm: function (data) {
        	this.clearForm();
            data.name && $('.id-name').val(data.name);
            data.sex && $('.id-sex').val(data.sex);
            data.race && $('.id-race').val(data.race);
            data.year && $('.id-date-year').val(data.year);
            data.month && $('.id-date-month').val(data.month);
            data.day && $('.id-date-day').val(data.day);
            data.addressFirst && $('.id-address-first').val(data.addressFirst);
            data.addressSecond && $('.id-address-second').val(data.addressSecond);
            data.addressThird && $('.id-address-third').val(data.addressThird);
            data.number && $('.id-number').val(data.number);
            data.sign && $('.sign-organization').val(data.sign);
            if(data.date) {
            	$('.operate-opposite').addClass('active').siblings().removeClass('active');
                $('.id-opposite').addClass('show').siblings().removeClass('show');
                $('.effecitve-date-first').val(data.date.split('-')[0].split('.')[0]);
                $('.effecitve-date-second').val(data.date.split('-')[0].split('.')[1]);
                $('.effecitve-date-third').val(data.date.split('-')[0].split('.')[2]);
                $('.effecitve-date-fouth').val(data.date.split('-')[1].split('.')[0]);
                $('.effecitve-date-fivth').val(data.date.split('-')[1].split('.')[1]);
                $('.effecitve-date-sixth').val(data.date.split('-')[1].split('.')[2]);
            }
        },
        // 重画canvas
        resetCanvas: function () {
            this.context.moveTo(this.firstPoint.x, this.firstPoint.y);
            this.context.lineTo(this.secondPoint.x, this.secondPoint.y);
            this.context.lineTo(this.thirdPoint.x, this.thirdPoint.y);
            this.context.lineTo(this.lastPoint.x, this.lastPoint.y);
            this.context.lineTo(this.firstPoint.x, this.firstPoint.y);
            this.context.stroke();
            this.drawArc(this.firstPoint.x, this.firstPoint.y);
            this.drawArc(this.secondPoint.x, this.secondPoint.y);
            this.drawArc(this.thirdPoint.x, this.thirdPoint.y);
            this.drawArc(this.lastPoint.x, this.lastPoint.y);
            this.count = 4;
        },
        // 改变张数
        handleImage: function (data) {
            var _self = this;
            $.ajax({
                url: '/subscriber/imagelabelInfo/getImageRecord',
                contentType: 'application/json',
                data: JSON.stringify(data),
                type: 'post',
                success: function (data) {
                    if (Number(data.code) === 0) {
                        var img = new Image();
                        img.src = data.imageUrl;
                        img.onload = function () {
                            $('.annotate-image').attr('src', img.src);
                            $('.annotate-image').attr('id', data.id);
                            _self.initCanvas();
                            _self.resetForm(data.data);
                            if (img.width > $('.annotate-image').width()) {
                                _self.imageScale = img.width / $('.annotate-image').width();
                            } else {
                                _self.imageScale = 1;
                            }
                            if (data.data.firstPoint) {
                            	_self.firstPoint.x = data.data.firstPoint.x / _self.imageScale;
                            	_self.firstPoint.y = data.data.firstPoint.y / _self.imageScale;
                                _self.secondPoint.x = data.data.secondPoint.x / _self.imageScale;
                                _self.secondPoint.y = data.data.secondPoint.y / _self.imageScale;
                                _self.thirdPoint.x = data.data.thirdPoint.x / _self.imageScale;
                                _self.thirdPoint.y = data.data.thirdPoint.y / _self.imageScale;
                                _self.lastPoint.x = data.data.lastPoint.x / _self.imageScale;
                                _self.lastPoint.y = data.data.lastPoint.y / _self.imageScale;
                                _self.resetCanvas();
                            } else {
                            	_self.count = 0;
                            }
                        }
                    } else {
                        alert(data.msg);
                    }
                }
            })
        },
        // 下一张
        nextImage: function () {
            var _self = this;
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
        lastImage: function () {
            var _self = this;
            $('.last-image').on('click', function () {
                var id = $('.annotate-image').attr('id');
                var data = {
                    id: id,
                    recordType: 0
                };
                _self.handleImage(data);
            })
        },
        // 身份证自动填充必要信息
        automaticRecongition: function() {
        	$('.id-number').on('blur', function () {
        		var numberValue = $(this).val().toString();
        		if (numberValue.length == 18) {
        			(!$('.id-date-year').val()) && $('.id-date-year').val(numberValue.substring(6,10));
        			(!$('.id-date-month').val()) && $('.id-date-month').val(numberValue.substring(10,12));
        			(!$('.id-date-day').val()) && $('.id-date-day').val(numberValue.substring(12,14));
        			if (!$('.id-address-first').val()) {
        				var arrName = eval('H_' + numberValue.substring(0,2));
        				var firstAddressStr= get_name1(numberValue.substring(0,2)) + get_name2(arrName[0], numberValue.substring(0,4));
        				$('.id-address-first').val(firstAddressStr)
        			}
        			if(!$('.id-sex').val()) {
        				if (numberValue.substring(16,17) % 2 == 0) {
        					$('.id-sex').val('女');
        				} else {
        					$('.id-sex').val('男');
        				}
        				
        			}
        		}
        	})
        }

    }
    idAnnotation.init();
})

