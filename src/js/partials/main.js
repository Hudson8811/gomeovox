$(document).ready(function() {
    var mySwiper = new Swiper ('.swiper-container', {
        loop: false,
        navigation: {
            nextEl: '.swiper-button-next',
            prevEl: '.swiper-button-prev',
        },
    });


    playedAudio = '';
    playerId = '';

    $('.girl-block .play').click(function () {
        var audio = $(this).siblings('audio')[0];
        if (playedAudio !=audio && playedAudio != ''){
            playedAudio.pause();
            playedAudio.currentTime = 0;
            audio.play();
            playedAudio = audio;
            playerId = audio.closest('.girl-block');
            startBlur();
        } else if (playedAudio === audio){
            playedAudio.pause();
            playedAudio.currentTime = 0;
            playedAudio = '';
        } else if (playedAudio === ''){
            audio.play();
            playedAudio = audio;
            playerId = audio.closest('.girl-block');
            startBlur();
        }

        function startBlur(){
            if (!$(playerId).hasClass('unblur')){
                var refreshIntervalId = setInterval(updateBlur, 1000);
                function updateBlur(){
                    var c = Math.round(playedAudio.currentTime);
                    var d = playedAudio.duration;

                    var blur = (100 - (c/d)*100) / 2;
                    if (blur < 1.5){
                        blur = 0;
                        clearInterval(refreshIntervalId);
                        $(playerId).addClass('unblur');
                    }

                    var filterVal = 'blur('+blur+'px)';
                    console.log($(playerId).find('.blur'));
                    $(playerId).find('.blur')
                        .css('filter',filterVal)
                        .css('webkitFilter',filterVal)
                        .css('mozFilter',filterVal)
                        .css('oFilter',filterVal)
                        .css('msFilter',filterVal);
                }
            }
        }



    });




});


