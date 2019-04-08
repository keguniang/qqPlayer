$(function () {

    //    0、自定义滚动条
    $(".content_list").mCustomScrollbar();

    //获取audio标签元素
    var $audio = $('audio');
    var player = new Player($audio);
    var progress;
    var voiceProgress;
    var lyric;

    // 1、加载音乐列表
    getPlayerList();
    function getPlayerList() {
        //加载本地文件
        //调用jQuery的静态方法
        $.ajax({
            //告诉ajax从那个地方加载文件
            url : './source/musiclist.json',
            //加载文件的类型
            dataType : 'json',
            //加载成功调用函数,把加载的数据通过参数传输
            success: function (data) {
                player.musicList = data;
                // console.log(data);
                //    3.1 遍历获取到的数据，创建每一条音乐
                $.each(data,function (index,ele) {
                    //创建一个新的方法来创建一条音乐
                    var $item  = creatMusicItem(index,ele);
                    $('.content_list ul').append($item);
                });
                initMusicInfo(data[0]);
                initMusicLyric(data[0]);
            },
            //加载失败调用函数
            error:function (e) {
                console.log(e);
            }
        });
    };
    //2、初始化歌曲信息
    function initMusicInfo(music) {
        //获取对应的元素
        var $musicImage = $('.song_info_pic img');
        var $musicName = $('.song_info_name a');
        var $musicSinger = $('.song_info_singer a');
        var $musicAblum = $('.song_info_ablum a');
        var $musicProgressName = $('.music_progress_name');
        var $musicProgressTime = $('.music_progress_time');
        var $musicBg = $('.mask_bg');

    //    给对应的元素赋值
        $musicImage.attr('src',music.cover);
        $musicName.text(music.name);
        $musicSinger.text(music.singer);
        $musicAblum.text(music.ablum);
        $musicProgressName.text(music.name+' / '+music.singer);
        $musicProgressTime.text('00:00 / '+music.time);
        $musicBg.css('background','url("'+music.cover+'")');
    }

    //3.初始化歌词信息
    function initMusicLyric(music) {
        lyric = new Lyric(music.link_lrc);
        var $lyricContainer = $('.song_lyric');
        //清空上一首音乐的歌词
        $lyricContainer.html('');
        lyric.loadLyric(function () {
        //    创建歌词列表
            $.each(lyric.lyrics,function (index,ele) {
                var $item = $('<li>'+ele+'</li>');
                $lyricContainer.append($item);
            })
        });
    }
    
    //4.初始化进度条
    initProgress();
    function initProgress() {
        //获取进度条元素
        var $progressBar = $('.music_progress_bar');
        var $progressLine = $('.music_progress_line');
        var $progressDot = $('.music_progress_dot');
        progress = new Progress($progressBar,$progressLine,$progressDot);

        progress.progressClick(function (value) {
            player.timeSeekTo(value);
        });
        progress.progressMove(function (value) {
            player.timeSeekTo(value);
        });

        //音量进度条的拖拽
        //获取进度条元素
        var $voiceBar = $('.music_voice_bar');
        var $voiceLine = $('.music_voice_line');
        var $voiceDot = $('.music_voice_dot');
        voiceProgress = new Progress($voiceBar,$voiceLine,$voiceDot);

        voiceProgress.progressClick(function (value) {
            player.musicVoiceSeekTo(value);
        });
        voiceProgress.progressMove(function (value) {
            player.musicVoiceSeekTo(value);
        });
    }
    //5.初始化事件监听
    initEvents();
    function initEvents(){
        //    1、监听歌曲的移入移除事件
//    事件名不能用hover
        $('body').delegate('.list_music','mouseenter',function () {
            //    鼠标移入事件
            //    显示子菜单
            $(this).find('.list_menu').stop().fadeIn(100);
            $(this).find('.list_time a').stop().fadeIn(100);
            //    隐藏时长
            $(this).find('.list_time span').stop().fadeOut(100);
        });

        $('body').delegate('.list_music','mouseleave',function () {
            //    鼠标移入事件
            //    隐藏子菜单
            $(this).find('.list_menu').stop().fadeOut(100);
            $(this).find('.list_time a').stop().fadeOut(100);
            //    显示时长
            $(this).find('.list_time span').stop().fadeIn(100);
        });

//   2、监听复选框的点击事件
        $('body').delegate('.list_check','click',function () {
            $(this).toggleClass('list_checked');
        });

//    3.监听子菜单播放按钮的点击事件
        $('body').delegate('.list_menu_play','click',function () {
            var $item = $(this).parents('.list_music');
            // console.log($item.get(0).index);
            // console.log($item.get(0).music);
            //3.1 切换播放按钮
            $(this).toggleClass('list_menu_play2');
            //3.2 复原其他的播放图标
            $item.siblings().find('.list_menu_play').removeClass('list_menu_play2');

            //    3.3 播放按钮的同步
            if($(this).attr('class').indexOf('list_menu_play2') != -1){
                //    当前子菜单播放按钮是播放状态
                $('.music_play').addClass('music_play2');
            }else{
                $('.music_play').removeClass('music_play2');
            }
            //3.4 切换序号的状态
            $item.find('.list_number').toggleClass('list_number2');
            //排他
            $item.siblings().find('.list_number').removeClass('list_number2');

        //    3.5播放音乐
            player.playMusic($item.get(0).index,$item.get(0).music);
        //    3.6 切换歌曲信息
            initMusicInfo($item.get(0).music);
            //    3.7 切换歌词信息
            initMusicLyric($item.get(0).music);
        });

    //    4.监听底部控制区域播放按钮的点击
        $('.music_play').click(function () {
            $(this).toggleClass('music_play2');
            //判断有没有播放给过音乐
            if(player.currentIndex == -1){
            //    没有播放过音乐,就自动播放第一首音乐
                /*
                * $('.list_music')找到所有的li
                * $('.list_music').eq(0)找到第一个li
                * */
                $('.list_music').eq(0).find('.list_menu_play').trigger('click');
            }else{
                //    已经播放过音乐
                $('.list_music').eq(player.currentIndex).find('.list_menu_play').trigger('click');
            }
        });
    //    5.监听底部控制区域上一首按钮的点击
        $('.music_pre').click(function () {
            $('.list_music').eq(player.preIndex()).find('.list_menu_play').trigger('click');
        });
    //    6.监听底部控制区域下一首按钮的点击
        $('.music_next').click(function () {
            $('.list_music').eq(player.nextIndex()).find('.list_menu_play').trigger('click');
        });
        //7、监听删除按钮的点击（动态创建的，需要事件委托）
        $('body').delegate('.list_menu_del','click',function () {
            //找到被点击的音乐
            var $item = $(this).parents('.list_music');
            //判断删除的音乐是不是正在播放的音乐
            if($item.get(0).index == player.currentIndex){
            //    是正在播放的就播放下一个,相当于触发下一个播放按钮
                $('.music_next').trigger('click');
            }
            $item.remove();
        //    后台的数据也要删掉
        //    $item.get(0)拿到原生的li
            player.changeMusic($item.get(0).index);
        //    重新排序
            $('.list_music').each(function (index,ele) {
                ele.index = index;
                $(ele).find('.list_number').text(index+1);
            });
        });
        //8、监听模式按钮的点击
         $('.music_mode').on('click',function () {
             $('.music_mode').toggleClass('music_mode2');
         });

        //9、监听喜欢按钮的点击
        $('.music_fav').click(function () {
            $(this).toggleClass('music_fav2');
        });
        //10、监听纯净按钮的点击
        $('.music_only').click(function () {
            $(this).toggleClass('music_only2');
        });
    //    11.监听播放的进度
        player.musicUpdateTime(function (currentTime,duration,timeStr) {
            //同步时间
            $('.music_progress_time').text(timeStr);
        //    同步进度条
        //    计算播放比例
            var value = (currentTime / duration) * 100;
            progress.setProgress(value);
        //    实现歌词的同步
           var index =  lyric.currentIndex(currentTime);
           var $item = $('.song_lyric li').eq(index);
           $item.addClass('current');
           $item.siblings().removeClass('current');


           // if(index < 0) return;
           // 为了让正在播放的歌词显示在中间
            if(index < 3) return;
           //让歌词滚动
           $('.song_lyric').css({
               marginTop : (-index+3) * 30
           });

        });
    //    12.监听声音按钮的点击
        $('.music_voice_icon').click(function () {
            //图标的切换
            $(this).toggleClass('music_voice_icon2');
            if($(this).attr('class').indexOf('music_voice_icon2') != -1){
            //    变为没有声音
                player.musicVoiceSeekTo(0);
                $('.music_voice_dot').css({
                    left : 0
                });
                $('.music_voice_line').css({
                    width : 0
                });
            }else{
            //    变为有声音
                player.musicVoiceSeekTo(1);
            }
        });
        //13.监听清空列表的点击
        $('.empty').click(function () {
            $('.content_list').remove();
        });
        //    14、删除按钮的点击
        $('.del').click(function () {
            // console.log($('.list_music'));
            var $item = $('.list_checked').parents('.list_music');
            // console.log($item);
            $.each($item,function (index,ele) {
                var res = $(ele).find('.list_number').text()-1;
                // console.log(res);

            //    判断删除的音乐包不包含正在播放的音乐
            //    有个bug，就是不能连着删除正在播放的下一首
                if(res == player.currentIndex){
                    // alert('a');
                    $('.music_next').trigger('click');
                };

                $item.remove();
                //删除后台数据
                player.changeMusic(res);
                //    重新排序
                $('.list_music').each(function (index,ele) {
                    ele.index = index;
                    $(ele).find('.list_number').text(index+1);
                });


            });
        });

    };

    //创建一条音乐
    function creatMusicItem(index,music){

        var $item = $('<li class="list_music">\n' +
            '                            <div class="list_check"><i></i></div>\n' +
            '                            <div class="list_number">'+(index+1)+'</div>\n' +
            '                            <div class="list_name">'+music.name+'\n' +
            '                                <div class="list_menu">\n' +
            '<!--                                    鼠标悬停会显示文字，所以加上title属性-->\n' +
            '                                    <a href="javascript:;" title="播放" class="list_menu_play"></a>\n' +
            '                                    <a href="javascript:;" title="添加"></a>\n' +
            '                                    <a href="javascript:;" title="下载"></a>\n' +
            '                                    <a href="javascript:;" title="分享"></a>\n' +
            '                                </div>\n' +
            '                            </div>\n' +
            '                            <div class="list_singer">'+music.singer+'</div>\n' +
            '                            <div class="list_time">\n' +
            '                                <span>'+music.time+'</span>\n' +
            '                                <a href="javascript:;" title="删除" class="list_menu_del"></a>\n' +
            '                            </div>\n' +
            '                        </li>');
        $item.get(0).index = index;
        $item.get(0).music= music;
        // console.log($item1);

        return $item;

    };

});