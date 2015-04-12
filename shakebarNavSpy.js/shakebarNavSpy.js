/**
 * ===============================
 * shakebarNavSpy.js
 * Created by zfengqi on 2015/4/11.
 * ===============================
 * shakebarNavSpy.js can create a "shake bar" under your nav
 * which will follow the cursor during moving on the nav.
 * In "single-page" mode, it can spy on the "shake bar" when scrollTop is increasing.
 *
 * Compatibility: Chrome FF Safari IE7+
 *
 * API
 * new ShakeNav(parentUl, [options]); // 只需实例化ShakeNav，并传入对应参数,options可选
 * parentUl: the UlElement used to be navigation // 作为导航栏的Ul
 *
 * options: {mode: "single-page"||"default", startAt:num, offset:num}
 *
 * options.mode: "single-page"  or left blank by default. // 指定模式，或者不传
 * In "single-page" mode, it can spy on the "shake bar" when scrollTop is increasing.
 *
 * options.startAt: the "shake bar"'s position at the beginning [0, navLi.length-1]
 * // “橡皮条”的起始位置，在第n项底下，从0开始
 *
 * options.offset: for "single-page" mode, pixels to offset from top when calculating position of scroll.
 * // 滚动时相对顶端的偏移量
 * ===============================
 */

function ShakeNav (parentUl, options) {
    var shakebarLi = '<li class="shakeBar"></li>',
        that = this;
    this.ul = jQuery(parentUl);

    this.getLi = function(){
        return shakebarLi;
    };

    options = options || {};
    options.startAt = options.startAt || 0;
    this.mode = options.mode = options.mode || "default";
    options.offset = options.offset>0 ? options.offset : 0;

    if(options.startAt>=0 && options.startAt<this.ul.children().length-1) {
        this.startAt = options.startAt;
    } else {
        this.startAt = 0;
    }

    this.offset = options.offset;


    if(options.mode == "single-page"){
        this.startAt = 0;
        this.singlePageClick();
        jQuery(window).scroll(function(){
            that.shakeDuringScroll();
        });
    }

    this.init();

}

ShakeNav.prototype = {
    constructor: ShakeNav,

    init: function(){
        this.createDOM();
        this.mouseoverHandle();
    },

    createDOM: function(){
        var aLi = this.ul.children();
        if(this.ul) {
            this.ul.append(this.getLi());
            this.ul.children('.shakeBar').css('left', aLi[this.startAt].offsetLeft);
        }
    },

    mouseoverHandle: function(){
        var that = this,
            bar = this.ul.find('li.shakeBar').get(0),
            aLi = this.ul.children();

        this.ul.hover(function(){}, function(){
            if(that.mode == "single-page"){
                that.shake(bar, "left", aLi[that.shakeDuringScroll()].offsetLeft);
            } else {
                that.shake(bar, "left", aLi[that.startAt].offsetLeft); // 可能有问题
            }
        });

        for(var i=0; i<aLi.length-1; i++){
            aLi[i].onmouseover = function(){
                that.shake(bar, "left", this.offsetLeft);
            };
        }

    },

    getPos: function(){
        var target = jQuery(".section_shsh"),
            section = target.children('[id]'),
            that = this,
            tempPos,
            result = [0];

        for(var i=1; i<section.length; i++){
            tempPos = jQuery(section[i]).offset().top - that.offset;
            result.push(tempPos);
        }
        return result;
    },

    singlePageClick: function(){
        var aLi = this.ul.children('[class!="shakebar"]'),
            pos = this.getPos();

        for(var i=0; i<aLi.length; i++) {
            (function(index){
                aLi[i].onclick = function(){
                    jQuery("html,body").animate({scrollTop: pos[index]}, 1000);
                };
            })(i);
        }


    },

    shakeDuringScroll: function(){
        var scrollTop = jQuery(document).scrollTop(),
            posArr = this.getPos(),
            bar = this.ul.find('li.shakeBar').get(0),
            aLi = this.ul.children();
            document.title = scrollTop;
            //console.log(posArr);

        //if(scrollTop<posArr[0]){
        //    this.shake(bar, "left", aLi[0].offsetLeft);}

        if(scrollTop>=posArr[posArr.length-1]){
            this.shake(bar, "left", aLi[posArr.length-1].offsetLeft);
            return posArr.length-1;
        }

        for(var i=0; i<posArr.length-1; i++){
             if(scrollTop >= posArr[i] && scrollTop < posArr[i+1]){
                this.shake(bar, "left", aLi[i].offsetLeft);
                return i;
            }
        }

    },

    shake: function(obj, name, end){
        // 由于要从上一次的终点开始运动，所以用属性保存上一次的speed和cur
        if(this.startAt){
            obj.speed = obj.speed || 0;
            obj.cur = obj.cur || this.ul.children()[this.startAt].offsetLeft;
        } else {
            obj.speed = obj.speed || 0;
            obj.cur = obj.cur || 0;

        }

        clearInterval(obj.timer);
        obj.timer = setInterval(function(){

            obj.speed += (end - obj.cur)/5;
            obj.speed *= 0.7;
            obj.cur += obj.speed;

            if (Math.round(obj.cur) == end && Math.round(obj.speed) == 0) {
                clearInterval(obj.timer);
            }

            obj.style[name] = Math.round(obj.cur) + 'px';


        }, 20);
    }

};
