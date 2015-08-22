/**
 * @file    瀑布流组件
 * @author  zhangfengqi zfengqi90@163.com
 */

/**
 * @constructor 构造函数
 * @param {HTMLElement|jQueryObjet} main 瀑布流主容器
 * @param {Object} options 配置参数
 *
 */
function WaterFall(main, options) {
    var me = this;
    options = options || {};

    this.main = $(main);
    this.mainWidth = this.main.get(0).offsetWidth;
    this.brickItemClass = options.brickItemClass || 'brick';
    this.brickWidth = this.main.find('.' + this.brickItemClass).get(0).offsetWidth;
    this.colHeights = [];
    this.ajaxUrl = options.url;
    this.ajaxDataOptions = options.ajaxDataOptions || {
        imgSrc: "src"
    };

    $(window).on('scroll', function () {
        me.loadData(me.ajaxUrl);
    });

    $(window).on('resize', this.throttle(function () {
        // 清空重新获取
        this.colHeights = [];
        this.mainWidth = this.main.get(0).offsetWidth;

        this.adjustPos(true);
    }, 400, 800));

    this.adjustPos();
}

/**
 * 设置数据块的位置
 *
 * @param {boolean} hasAnimate 位置调整是否有动效
 */
WaterFall.prototype.adjustPos = function (hasAnimate) {
    var me = this;
    var brickItem = this.main.find('.' + this.brickItemClass);
    var minHeight;
    var minColIndex;

    if (brickItem) {
        var cols = Math.floor(this.mainWidth / this.brickWidth);

        brickItem.css('position', 'absolute');

        brickItem.each(function (index, item) {
            if (index < cols) {
                $(item).css({
                    top: 0,
                    left: me.brickWidth * index
                });

                me.colHeights.push(item.offsetHeight);
            }
            else {
                // 找到最小高度 & 其所在的列索引值
                me.setPos(item, hasAnimate);
            }

        });
    }
};

/**
 * @inner 设置数据块位置辅助
 *
 * @param {HTMLElement} item 数据块
 * @param {boolean} hasAnimate 是否有动效
 */
WaterFall.prototype.setPos = function (item, hasAnimate) {
    var me = this;
    var minHeight = Math.min.apply(null, this.colHeights);
    var minColIndex = 0;

    for (var i = 0; i < this.colHeights.length; i++) {
        if (this.colHeights[i] === minHeight) {
            minColIndex = i;
            break;
        }
    }

    $(item).css('position', 'absolute');

    if (hasAnimate) {
        $(item).animate({
            top: minHeight,
            left: me.brickWidth * minColIndex
        });
    }
    else {
        $(item).css({
            top: minHeight,
            left: me.brickWidth * minColIndex
        });
    }
    // 更新每列高度值
    this.colHeights[minColIndex] += item.offsetHeight;
    // 调整容器高度
    this.main.css({
        height: Math.max.apply(null, this.colHeights)
    });

    return this;
};


/**
 * 加载数据
 *
 * @param {string} url ajax数据接口
 */
WaterFall.prototype.loadData = function (url) {
    var me = this;
    // 触发条件：最后一张图露出一半时
    var lastBrick = this.main.find('.' + this.brickItemClass).get(-1);
    var lastBrickTop = lastBrick.offsetTop + 0.5 * lastBrick.offsetHeight;
    var trigger = $(document).scrollTop() + document.documentElement.clientHeight;
    if (lastBrick && lastBrickTop < trigger) {
        $.ajax(url, {
            success: function (data) {
                if (data.length > 0) {

                    for (var i = 0; i < data.length; i++) {
                        var src = data[i][me.ajaxDataOptions.imgSrc];
                        var imgNum = data.length;

                        (function (index) {
                            me.getImgSize(src, function (width, height) {

                                me.render(data[index], imgNum, width, height);
                            });

                        })(i);
                    }

                    // me.render(data);
                }
            }
        });

    }

};

/**
 * 获取加载图片的尺寸
 *
 */
WaterFall.prototype.getImgSize = function (src, loadedCb) {
    var imgLoader = new Image();

    imgLoader.onload = function () {
        var width = imgLoader.width;
        var height = imgLoader.height;

        loadedCb && loadedCb(width, height);

        imgLoader = imgLoader.onload = null;
    };

    imgLoader.src = src;
};

/**
 * 单个数据块DOM结构渲染
 *
 * @param {Object} dataItem ajax数据
 */
WaterFall.prototype.render = function (dataItem, imgNum, width, height) {
    var me = this;

    var renderer = this.onRender || function () {
        var tpl = '';

        tpl = ''
        + '<li class="' + me.brickItemClass + '">'
        +   '<a href="' + dataItem.bigPic + '">'
        +       '<img src="' + dataItem.src + '" width="' + width + 'px" height="' + height + 'px" alt="">'
        +   '</a>'
        + '</li>';

        return tpl;
    };

    this.main.append(renderer.call(this));

    // 调整left和top值
    // 避免从头开始设置
    var brickItem = this.main.find('.' + this.brickItemClass);

    me.setPos(brickItem.last().get(0));

    // if (imgNum > 0) {
    //     var startIndex = brickItem.length - imgNum;

    //     for (var i = startIndex; i < brickItem.length; i++) {
    //         // $(brickItem[i]).css('position', 'absolute');
    //         me.setPos(brickItem[i]);
    //     }
    // }

};

/**
 * @inner 函数节流
 *
 * @param {Function} method 要执行的函数
 * @param {number} delay 延迟时间
 * @param {number} mustRunDelay 至少xx秒执行一次
 * @return {Function}
 *
 */
WaterFall.prototype.throttle = function (method, delay, mustRunDelay) {
    var me = this;
    var timer = null;
    var startTime = 0;

    return function () {
        var curTime = +new Date();
        var args = arguments;

        clearTimeout(timer);

        if (!startTime) {
            startTime = curTime;
        }

        if (curTime - startTime > mustRunDelay) {
            method.apply(me, args);
            startTime = curTime;
        }
        else {
            timer = setTimeout(function () {
                method.apply(me, args);
            }, delay);
        }

    };

};
