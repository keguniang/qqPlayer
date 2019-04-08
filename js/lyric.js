//歌词工具类封装
(function (window) {
    //一个构造函数
    function Lyric(path) {
        return new Lyric.prototype.init(path);
    }
    Lyric.prototype = {
        constructor : Lyric,
        //默认为空
        musicList:[],
        init : function (path) {
            this.path = path;
        },
        //保存所有的时间
        times : [],
        //保存所有的歌词
        lyrics : [],
        // length : [],
        index : -1,

        loadLyric : function (callBack) {
            var $this = this;
            $.ajax({
                //告诉ajax从那个地方加载文件
                url : $this.path,
                //加载文件的类型
                dataType : 'text',
                //加载成功调用函数,把加载的数据通过参数传输
                success: function (data) {
                    // console.log(data);
                    //为什么不在这里进行解析，而是另外写一个方法？
                    /*在面向对象的思想中，尽量保证方法的单一性，就是一个方法就做一件事情*/
                    $this.parseLyric(data);
                    //加载成功后执行回调函数
                    callBack();
                },
                //加载失败调用函数
                error:function (e) {
                    console.log(e);
                }
            });

        },
        parseLyric : function(data) {
            var $this = this;
            // 一定要清空上一首歌曲的歌词和时间
            $this.times = [];
            $this.lyrics = [];
            //用换行符分割
            var array = data.split('\n');
            // console.log(array);
        //    取出时间，通过正则表达式
        //     [00:00.92]
        //     var timeReg = /\[\d*:\d*\.\d*\]/;
        //    ()作用:把（）内的内容也取出来
            var timeReg = /\[(\d*:\d*\.\d*)\]/;
        //    遍历取出每一条歌词
            $.each(array,function (index,ele) {
                //处理歌词，这个应该放在上边，否则会把空字符串的事件存在times[]中
                var lyric = ele.split(']')[1];
                //排除空字符串，歌词长度为1，就是空字符串
                if(lyric.length == 1) return true;
                $this.lyrics.push(lyric);
                //可以发现空的字符串长度为1
                // $this.length.push(lyric.length);

                // console.log(ele);
                //处理时间
                var res = timeReg.exec(ele);

                /*因为前五行是没有时间的，所以返回null
                *return true;
                * 相当于continue,继续执行下一次循环
                * 在打印，就没有null了*/
                if(res == null) return true;
                // console.log(res);
                var timeStr = res[1];//00:00.92
                // console.log(timeStr);
            //    时间是与currentTime匹配的，所以要把分钟换成秒
                var res2 = timeStr.split(':');
                var min = parseInt(res2[0]) * 60;
                var sec = parseFloat(res2[1]);
                //toFixed()保留两位小数,返回值是字符串
                var sum = min +sec;
                // console.log(typeof sum);
                var time =parseFloat((min + sec).toFixed(2));
                // console.log(time);
                $this.times.push(time);

            });
            // console.log($this.times);
            // console.log($this.lyrics);
            // console.log($this.length);

        },
        currentIndex : function (currentTime) {
            // var $this = this;
            if(currentTime >= this.times[0]){
                // console.log(currentTime);
                // console.log(this.times[0]);
                this.index++;
                // console.log(this.index);
                // shift()删除并返回数组的第一个元素
                this.times.shift();
            }
            return this.index;
        }
    }
    Lyric.prototype.init.prototype = Lyric.prototype;
    //把局部变量变成全句变量
    window.Lyric = Lyric;
})(window);