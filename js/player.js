//播放工具类封装
(function (window) {
    //一个构造函数
    function Player($audio) {
        return new Player.prototype.init($audio);
    }
    Player.prototype = {
        constructor : Player,
        //默认为空
        musicList:[],
        init : function ($audio) {
            //jQuery包装好的对象
            this.$audio = $audio;
            //获取原生
            this.audio = $audio.get(0);
        },
        currentIndex : -1,
        playMusic : function (index,music) {
        //    判断是否是同一首音乐
            //    同一首音乐
            if(this.currentIndex == index){

            //    如果该音乐是暂停就改为播放
                if(this.audio.paused){
                    this.audio.play();
                }else{
                    //播放改为暂停
                    this.audio.pause();
                }
            }else{
                //    不是同一首，就改变audio的sre,并播放
                this.$audio.attr('src',music.link_url);
                this.audio.play();
                this.currentIndex = index;
            }
        },
        //前一首音乐
        preIndex : function () {
            var preIndex = this.currentIndex - 1;
            if(preIndex < 0){
                preIndex = this.musicList.length - 1;
            }
            return preIndex;
        },
        //后一首音乐
        nextIndex : function () {
            var nextIndex = this.currentIndex + 1;
            if(nextIndex > this.musicList.length - 1){
                nextIndex = 0;
            }
            return nextIndex;
        },
    //    从后台删除音乐
        changeMusic : function (index) {
        //    删除对应的数据
            this.musicList.splice(index,1);
        //    判断删除的数据是否是正在播放的音乐的前边的音乐
            if(index < this.currentIndex){
                this.currentIndex -=1;
            }
        },
        musicUpdateTime : function (callBack) {
            var $this = this;
            this.$audio.on('timeupdate',function () {
                //拿到的是秒
                // console.log(player.getMusicDuration(),player.getMusicCurrentTime());
                var duration = $this.audio.duration;
                var currentTime = $this.audio.currentTime;
                var timeStr = $this.formatDate(currentTime,duration);
                // $('.music_progress_time').text(timeStr);
                //调用一下外部传过来的函数,并把参数传给外部函数
                //不能直接用return ,因为其就近原则，要返回给外层的函数
                callBack(currentTime,duration,timeStr);
            });
        },
        //    定义一个格式化时间的方法
        formatDate : function (currentTime,duration) {
            var endMin = parseInt(duration / 60);
            var endSec = parseInt(duration % 60);
            if(endMin < 10){
                endMin = '0'+endMin;
            }
            if(endSec < 10){
                endSec = '0'+endSec;
            }


            var startMin = parseInt(currentTime / 60);
            var startSec = parseInt(currentTime % 60);
            if(startMin < 10){
                startMin = '0'+startMin;
            }
            if(startSec < 10){
                startSec = '0'+startSec;
            }
            return startMin+':'+startSec+' / '+endMin+':'+endSec;
        },
        timeSeekTo :function (value) {
            // console.log(value);
            //当value是无限小数时，为NaN,控制台会报错
            if (isNaN(value))  return;
            this.audio.currentTime = this.audio.duration * value;
        },
        musicVoiceSeekTo : function (value) {
            //取值0~1  0是没有声音
            if (isNaN(value))  return;
            if(value<0 || value >1) return;
            if(value <= 0.2){
                value = 0;
                $('.music_voice_icon').addClass('music_voice_icon2');
            }else{
                $('.music_voice_icon').removeClass('music_voice_icon2');
            }
            this.audio.volume = value;
            console.log(value);

        }

    }
    Player.prototype.init.prototype = Player.prototype;
    //把局部变量变成全句变量
    window.Player = Player;
})(window);