$(function(){
    /*动态响应式轮播图*/
    banner();
    /*初始化tabs页*/
    initTabs();
    /*初始化工具提示*/
    $('[data-toggle="tooltip"]').tooltip()
});
/*动态响应式轮播图*/
function banner(){
    /*
     *1.获取后台的轮播路  图片数据   （ajax）
     *2.需要判断当前的屏幕是移动端和是非移动端  （屏幕的宽度 768px以下都是移动端）
     *3.把后台数据渲染成对应的html字符串 （字符串拼接 & 模板引擎 artTemplate native-template）
     *   underscore 介绍和学习
     *4.把渲染完成的html填充在对应的盒子里面  也就是完成了页面渲染 （渲染到页面当中 .html()）
     *5.在屏幕尺寸改变的时候需要重新渲染页面 (监听页面尺寸的改变 resize)
     *6.在移动端需要 通过手势来控制图片的轮播 左 next 右的 prev  滑动
     * */

    /*申明全局的变量  接受数据  缓存在内存当中*/
    var myData;
    /*1.获取后台的轮播路  图片数据   （ajax）*/
    var getData = function(callback){
        if(myData){
            callback && callback(myData);
            return false;
        }
        /*ajax*/
        $.ajax({
            /*
             * js是被html引用的
             * 发出的请求是相对于html
             * html相对于 index.json  多了一层 js 文件夹
             * 相对路劲的话 还需要加目录
             * */
            url:'js/index.json',
            data:{},
            type:'get',
            dataType:'json',
            success:function(data){
                /*
                * 当我们已经请求成功之后  把数据缓存在内存当中
                * 当下次调用这个方法的时候  去判断内存当中有没有记录这个数据
                * 如果有记录  直接返回内存当中的
                * 如果没有  再做请求
                * */
                myData  = data;
                callback && callback(myData);
            }
        });
    }

    /*渲染的方法*/
    /*
     *2.需要判断当前的屏幕是移动端和是非移动端  （屏幕的宽度 768px以下都是移动端）
     *3.把后台数据渲染成对应的html字符串 （字符串拼接 & 模板引擎 artTemplate native-template）
     *4.把渲染完成的html填充在对应的盒子里面  也就是完成了页面渲染 （渲染到页面当中 .html()）
     * */
    var renderHtml = function(){
        /*获取到数据*/
        getData(function(data){
            /*请求结束  获取数据 完成  之后去干这些事情*/
            /*当前屏幕的宽度*/
            var width = $(window).width();
            /*否是移动端*/
            var isMobile = false;
            if(width < 768 ){
                isMobile = true;/*就说明当前的屏幕是移动端*/
            }
            /*准备需要解析的数据*/
            /*我们需要两个模板*/
            /*点的模板对象*/
            var tempaltePoint = _.template($('#template_point').html());
            /*图片模板对象*/
            var templateImage = _.template($('#template_item').html());
            /*渲染成html字符  解析成html*/
            /*传入数据  根据模板解析  返回html字符*/
            /*{model:data}  传入的数据  名字叫model 数据是data*/
            var pointHtml = tempaltePoint({model:data});
            var imageData = {
                list:data,/*图片数据*/
                isMobile:isMobile/*是不是移动端*/
            };
            var imageHtml = templateImage({model:imageData});
            /*渲染页面*/
            $(".carousel-indicators").html(pointHtml);
            $(".carousel-inner").html(imageHtml);
        });
    }

    /*5.在屏幕尺寸改变的时候需要重新渲染页面 (监听页面尺寸的改变 resize)*/
    $(window).on('resize',function(){
        /*重新渲染*/
        /*
        * 每一次改变的时候都会重启请求数据  非常不合理
        * */
        renderHtml();
    }).trigger('resize');/*trigger('resize');即时执行这个事件 触发这个事件*/

    /*6.在移动端需要 通过手势来控制图片的轮播 左 next 右的 prev  滑动*/
    /*使用jquery完成手势*/
    var startX = 0;
    var moveX =0;
    var distanceX = 0;
    var isMove = false;
    /*绑定事件*/
    $('.wjs_banner').on('touchstart',function(e){
        /*怎么获取到第一个触摸点*/
        /*jquery e 返回的  originalEvent 就是原生js当中的 touchEvent*/
        //console.log(e.originalEvent.touches[0].clientX);
        startX = e.originalEvent.touches[0].clientX;
    });
    $('.wjs_banner').on('touchmove',function(e){
        moveX = e.originalEvent.touches[0].clientX;
        distanceX = moveX-startX;
        isMove = true;
        console.log(distanceX);
    });
    $('.wjs_banner').on('touchend',function(e){
        /*需要有一定的滑动距离才认为它滑动过  必须移动50的距离才认为滑动过*/
        /*判断对应的手势 来控制轮播图的滚动*/
        if(Math.abs(distanceX) > 50 && isMove){
            if(distanceX < 0){
                /*向左滑动  下一张*/
                $('.carousel').carousel('next');/*bootstrap*/
            }else{
                /*向右滑动  上一张*/
                $('.carousel').carousel('prev');/*bootstrap*/
            }
        }

        /*参数重置*/
        startX = 0;
        moveX = 0;
        distanceX = 0;
        isMove = false;
    });

}
/*初始化tabs*/
function initTabs(){
    /*设置父容器的宽度  等于 所有的子容器的宽度 的和*/
    var ul = $('.wjs_product .nav-tabs');
    var lis = ul.find('li');

    var width = 0;

    $.each(lis,function(i,o){
        /*通过width 只获取到了 内容的宽度*/
        /* innerWidth() 内容+内边距*/
        /* outerWidth() 内容+内边距+边框*/
        /* outerWidth(true) 内容+内边距+边框+外边距*/
        width += $(o).innerWidth();
    })
    ul.width(width);

    /*实现在移动端的滑动*/
    itcast.iScroll({
        swipeDom:$('.wjs_product_tabsParent').get(0),
        swipeType:'x',
        swipeDistance:50
    });

}