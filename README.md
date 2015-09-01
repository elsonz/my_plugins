# my_plugins
js plugins written by myself

**1. `shakebarNavSpy.js` -- my first plugins** :scream:
  - Created by zfengqi on 2015/4/11.
  - shakebarNavSpy.js can create a "shakebar" under your nav which will follow the cursor during moving on the nav.
  - In "single-page" mode, it can spy on the "shake bar" when scrollTop is increasing.
  - Compatibility: Chrome & FF & Safari & IE7+
  - `demo.html` shows the effect of `shakebarNavSpy.js`
  - ps. you can customize the "shakebar"'s appearance by editing `shakebarNavSpy.css`

**2. RIA-component RIA扬帆任务组件 - 基于jquery**
  - 瀑布流组件 Waterfall.js
  - 图片查看器组件 Slider.js
  - demo.html 为两个组件一起使用的示范案例
  - 具体用法详见js文件中的注释
  - 2015.08.22

  #### 开发中遇到的问题与思考（请指正~）
  1.在开发瀑布流组件的时候，由于采用的是绝对定位的方案，所以先需要获取上面的brick块的高度，然后再添加在其下面。最初的做法是直接获取offsetHeight，并没有为img元素设置高度，导致定位不对。这是由于当时没有搞清楚浏览器的加载顺序以及js的执行顺序导致的。另外在改变浏览器大小时（onresize），在对整个瀑布流做reflow处理时，加入了函数节流的做法，以防止用户不恰当的操作而导致的性能问题。

  2.组件开发时需要体现低耦合，每写一行代码都始终考虑着是否产生一些强耦合的副作用，目前瀑布流组件可以实现用户html模板的自定义以及数据接口的自定义。由于图片放大器组件需要结合瀑布流组件一块使用，而瀑布流是会动态加载图片到DOM当中，因此需要考虑如何去获取动态加载进来的图片数据。

  3.对于这个问题首先设计了两种使用方式，默认是不处理动态加载进来的图片的，而当options.dynamic:true时才进行处理。其次，图片放大器的浮层出现的时候，对body的滚动条进行了隐藏处理，以防止滚屏时触发新的图片加载，这里需要注意的是隐藏了滚动条之后要对失去的宽度做补偿，否则会使得容器中内容向右串。解决方案是参照twitter。http://yujiangshui.com/review-how-to-make-popup-mask-effect/

  4.除了弹窗出现禁止滚屏的处理之外，获取动态加载图片的数据，其实最好的方式应该是用发布订阅模式（如果不对请指正哈），图片放大器组件订阅瀑布流中的事件以达到两组件通讯的目的。而我之前的做法时，在click事件里面做处理，每次click判断是否有新的图片加载进来，有的话存储进来。

  5.另外点击放大当前图片的同时，也做了前后一张图片的预加载处理。
