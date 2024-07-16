document.addEventListener('DOMContentLoaded', function () {
    // 视频 ID 列表
    var videoIds = ['foregroundVideoContainer', 'backgroundVideo', 'opening', 'introVideo'];

    // 每个视频的源文件映射
    var videoSources = {
        'foregroundVideoContainer': {
            webm: 'scene.webm',
            mov: 'scene.mov'
        },
        'backgroundVideo': {
            webm: 'resturant.webm',
            mov: 'resturant.mov'
        },
        'opening': {
            webm: 'opening.webm',
            mov: 'opening.mov'
        },
        'introVideo': {
            webm: 'next.webm',
            mov: 'next.mov'
        },
    };

    // 处理每个视频的函数
    function handleVideoFormat(videoId) {
        var video = document.getElementById(videoId);
        if (!video) {
            console.error(`Video element with ID '${videoId}' not found.`);
            return;
        }
        
        if (typeof video.canPlayType !== 'function') {
            console.error(`Element with ID '${videoId}' is not a valid video element.`);
            return;
        }

        var sources = videoSources[videoId];
        if (!sources) {
            console.error(`No sources defined for video element with ID '${videoId}'.`);
            return;
        }

        // 优先检查 mov 格式支持
        if (video.canPlayType('video/quicktime')) {
            video.src = sources.mov;
        } else if (video.canPlayType('video/webm; codecs="vp9, opus"')) {
            // 检查 webm 格式支持
            video.src = sources.webm;
        } else {
            console.log('No supported video format found for video:', videoId);
        }

        video.load();
        video.play();
    }

    // 处理所有视频
    videoIds.forEach(function (videoId) {
        handleVideoFormat(videoId);
    });
});
