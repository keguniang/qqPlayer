//进度条工具类封装
(function (window) {
    //一个构造函数
    function Progress($progressBar,$progressLine,$progressDot) {
        return new Progress.prototype.init($progressBar,$progressLine,$progressDot);
    }
    Progress.prototype = {
        constructor : Progress,
        //默认为空
        musicList:[],
        init : function ($progressBar,$progressLine,$progressDot) {
            this.$progressBar = $progressBar;
            this.$progressLine = $progressLine;
            this.$progressDot = $progressDot;
        },
        //拖拽的时候不回闪
        isMove : false,
        //滚动条点击
        progressClick:function (callBack) {
            //$this 只是个变量名，加$是为说明其是个jquery对象。
            /*
            * 谁调用的方法，this就是谁。index.js中,是progress.progressClick();
            * 是progress调的，所以this就是progress
            * */
            var $this = this;
        //    监听背景的点击
            this.$progressBar.click(function (event) {
            //    获取背景距离
                var normalLeft = $(this).offset().left;
                // console.log(normalLeft);
            //    获取点击的位置距离窗口的位置
                var eventLeft = event.pageX;
                // console.log(eventLeft);
                var offset = eventLeft - normalLeft;
                var width = $this.$progressBar.width();
                if(offset >= 0 && offset <= width){
                    //    设置前景的宽度
                    //如果这里直接用this,将会变成是progress，获取不到$progressLine
                    $this.$progressLine.css('width',offset);
                    $this.$progressDot.css('left',offset);
                }

            //    计算进度条的比例
                var value = (eventLeft - normalLeft) / $(this).width() ;
                callBack(value);
            })
        },
    //    滚动条拖拽
        progressMove:function (callBack) {
        //    1监听鼠标的按下事件
            var $this = this;
            //    获取背景距离
            var normalLeft = this.$progressBar.offset().left;
            var barWidth = this.$progressBar.width();
            // console.log(normalLeft);
            var eventLeft;
            this.$progressBar.mousedown(function () {
                $this.isMove = true;
                //    2监听鼠标的移动事件
                $(document).mousemove(function (event) {
                    //    获取点击的位置距离窗口的位置
                    eventLeft = event.pageX;
                    var offset = eventLeft - normalLeft;
                    // console.log(offset);
                    if(offset >= 0 && offset <= barWidth){
                        //    设置前景的宽度
                        //如果这里直接用this,将会变成是progress，获取不到$progressLine
                        $this.$progressLine.css('width',offset);
                        $this.$progressDot.css('left',offset);
                    };

                });
            });

        //    3监听鼠标的抬起事件
        //    document不加引号！！
            $(document).mouseup(function () {
                $(document).off('mousemove');
                $this.isMove = false;
                //    计算进度条的比例
                var value = (eventLeft - normalLeft) / barWidth;
                // console.log(value);
                callBack(value);
            });
        },
    //    同步进度条和点
        setProgress : function (value) {
            if(this.isMove) return;
            if(value < 0 || value > 100){
                return;
            }
            this.$progressLine.css({
                width : value+'%'
            });
            this.$progressDot.css({
                left : value+'%'
            });
        }
    }
    Progress.prototype.init.prototype = Progress.prototype;
    //把局部变量变成全句变量
    window.Progress = Progress;
})(window);