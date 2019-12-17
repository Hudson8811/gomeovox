$(document).ready(function() {

    function shuffle(arr){
        var j, temp;
        for(var i = arr.length - 1; i > 0; i--){
            j = Math.floor(Math.random()*(i + 1));
            temp = arr[j];
            arr[j] = arr[i];
            arr[i] = temp;
        }
        return arr;
    }

    function detectIE() {
        var ua = window.navigator.userAgent;

        var msie = ua.indexOf('MSIE ');
        if (msie > 0) {
            return true;
        }

        var trident = ua.indexOf('Trident/');
        if (trident > 0) {
            var rv = ua.indexOf('rv:');
            return true;
        }

        return false;
    }


    function loadGirls(){
        $.getJSON('test.json', function(data) {
            girls = data.girls;
            girlsCount = girls.length;
            if( girlsCount%2 ) girls.pop();
            shuffle(girls);

            for (var i = 0; i < girlsCount-1; i++) {
                var $out = '';
                $out+= '<div class="swiper-slide"><div class="girls">';
                var imgIe = '';
                var bgImg = '';
                if (detectIE()){
                    imgIe = '<svg><image x="0" y="0" width="100%" height="100%" preserveAspectRatio="xMinYMin slice" xmlns:xlink="http://www.w3.org/1999/xlink" xlink:href="'+girls[i].image+'" filter="url(#blur-effect'+i+')"></image><filter id="blur-effect'+i+'"><fegaussianblur stddeviation="20" color-interpolation-filters="sRGB"></fegaussianblur></filter></svg>';
                } else {
                    bgImg = girls[i].image;
                }

                $out+= '<div class="left-girl girl-block" data-id="'+i+'"><div class="img"><div class="image blur" style="background-image: url('+bgImg+')">'+imgIe+'</div><div class="likes"></div><button class="like" value="'+girls[i].name+'" onclick="vote(this);"><svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px"  viewBox="0 0 510 510" style="enable-background:new 0 0 510 510;" xml:space="preserve"><g><path d="M255,489.6l-35.7-35.7C86.7,336.6,0,257.55,0,160.65C0,81.6,61.2,20.4,140.25,20.4c43.35,0,86.7,20.4,114.75,53.55C283.05,40.8,326.4,20.4,369.75,20.4C448.8,20.4,510,81.6,510,160.65c0,96.9-86.7,175.95-219.3,293.25L255,489.6z"/></g></svg></button></div><div class="flex-row"><div class="left"><div class="name"><span>'+girls[i].name+'</span></div><div class="age"><span>'+girls[i].age+'</span></div></div><button class="play"></button><audio><source src="'+girls[i].sound+'" type="audio/mp3" ></audio></div></div>';

                i++;

                imgIe = '';
                bgImg = '';
                if (detectIE()){
                    imgIe = '<svg><image x="0" y="0" width="100%" height="100%" preserveAspectRatio="xMinYMin slice" xmlns:xlink="http://www.w3.org/1999/xlink" xlink:href="'+girls[i].image+'" filter="url(#blur-effect'+i+')"></image><filter id="blur-effect'+i+'"><fegaussianblur stddeviation="20" color-interpolation-filters="sRGB"></fegaussianblur></filter></svg>';
                } else {
                    bgImg = girls[i].image;
                }

                $out+= '<div class="right-girl girl-block" data-id="'+i+'"><div class="img"><div class="image blur" style="background-image: url('+bgImg+')">'+imgIe+'</div><div class="likes"></div><button class="like" value="'+girls[i].name+'" onclick="vote(this);"><svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px"  viewBox="0 0 510 510" style="enable-background:new 0 0 510 510;" xml:space="preserve"><g><path d="M255,489.6l-35.7-35.7C86.7,336.6,0,257.55,0,160.65C0,81.6,61.2,20.4,140.25,20.4c43.35,0,86.7,20.4,114.75,53.55C283.05,40.8,326.4,20.4,369.75,20.4C448.8,20.4,510,81.6,510,160.65c0,96.9-86.7,175.95-219.3,293.25L255,489.6z"/></g></svg></button></div><div class="flex-row"><div class="left"><div class="name"><span>'+girls[i].name+'</span></div><div class="age"><span>'+girls[i].age+'</span></div></div><button class="play"></button><audio><source src="'+girls[i].sound+'" type="audio/mp3" ></audio></div></div>';

                $out+= '</div></div>';

                $('.slider .swiper-wrapper').append($out);
            }

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
                playerId = $(this).closest('.girl-block');
                if (typeof refreshIntervalId != 'undefined') clearInterval(refreshIntervalId);
                if (playedAudio !=audio && playedAudio != ''){
                    playedAudio.pause();
                    playedAudio.currentTime = 0;
                    audio.play();
                    playedAudio = audio;
                    startBlur();
                } else if (playedAudio === audio){
                    playedAudio.pause();
                    playedAudio.currentTime = 0;
                    playedAudio = '';
                } else if (playedAudio === ''){
                    audio.play();
                    playedAudio = audio;
                    startBlur();
                }

                function startBlur(){

                    if (!$(playerId).hasClass('unblur')){
                        refreshIntervalId = setInterval(updateBlur, 500);
                        function updateBlur(){
                            var c = Math.round(playedAudio.currentTime);
                            var d = playedAudio.duration;

                            if (!detectIE()) {
                                var blur = (100 - (c / d) * 100) / 2;
                                if (blur < 1.5) {
                                    blur = 0;
                                    clearInterval(refreshIntervalId);
                                    $(playerId).addClass('unblur');
                                }

                                var filterVal = 'blur(' + blur + 'px)';
                                $(playerId).find('.blur')
                                    .css('filter', filterVal)
                                    .css('webkitFilter', filterVal)
                                    .css('mozFilter', filterVal)
                                    .css('oFilter', filterVal)
                                    .css('msFilter', filterVal);
                            } else {
                                var blur = (100 - (c / d) * 100) / 5;
                                if (blur < 1.5) {
                                    blur = 0;
                                    clearInterval(refreshIntervalId);
                                    $(playerId).addClass('unblur');
                                }

                                var dataId = $(playerId).data('id');
                                var blurF = document.querySelector("#blur-effect"+dataId),
                                    blurFilter = blurF.firstElementChild;
                                blurFilter.setAttribute("stdDeviation",blur);
                            }
                        }
                    }
                }



            });
        });
    }
    loadGirls();

});



function vote(elem) {
    event.preventDefault();
    var name = $(elem).val();
    $(elem).closest('.img').addClass('liked');
    $(elem).closest('.girls').find('.likes').html('25555').show();
    $(elem).closest('.girls').find('.like').hide();


    //тут отправка данных и получение даных о количестве голосов
}