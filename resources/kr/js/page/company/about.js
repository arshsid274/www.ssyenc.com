/* about.js */
var About = About || {};

function titleMotion ($section) {
    const $tit = $section.find(".top strong");
    const $p = $section.find(".top p");

    // 이미 실행된 섹션은 패스
    if ($tit.attr('data-animated') === 'true' && $p.attr('data-animated') === 'true') return;

    let title = new SplitText($tit, {
        type: 'lines,words',
        linesClass: '-line',
        wordsClass: '-word'
    });
    let p = new SplitText($p, {
        type: 'lines,words',
        linesClass: '-line',
        wordsClass: '-word'
    });

    gsap.set([$tit, $p], { opacity: 1 });
    gsap.set([$tit.find(".-line"), $p.find(".-line")], { overflow: "hidden" });
    gsap.set($tit.find(".-word"), { yPercent: 100 });
    gsap.set($p.find(".-word"), { yPercent: 100 });

    let tl = gsap.timeline({
        onComplete: function () {
            title.revert();
            p.revert();

            $tit.attr('data-animated', 'true');
            $p.attr('data-animated', 'true');
        }
    });

    tl.to($tit.find(".-word"), {
        yPercent: 0,
        duration: 1,
        ease: Quart.easeOut
    });

    $p.find(".-line").each(function (i, line) {
        const word = line.querySelectorAll('.-word');
        tl.to(word, {
            yPercent: 0,
            duration: 1,
            ease: Quart.easeOut
        }, i * 0.1);
    });
}

About.utils = {
    groupTrigger: function () {
        const $triggerGroup = $('#triggerGroup');
        const $secEnc = $('.sec_enc');
        const $secQuality = $('.sec_quality');
        const $video = $secQuality.find('video');
		let parallaxTrigger;
        let tl_group;
        let oneMotion;

        function getMaskOffsetRelativeToSection() {
            var _maskWrapPerent = $secQuality.find(".clip_wrap")[0];
            var sectionRect = _maskWrapPerent.getBoundingClientRect();
            var targetRect = $secQuality.find(".offset")[0].getBoundingClientRect();
            var sectionHeight = _maskWrapPerent.offsetHeight;
            var sectionWidth = _maskWrapPerent.offsetWidth;

            return {
                "--maskT": ((targetRect.top - sectionRect.top) / sectionHeight * 100).toFixed(5) + "%",
                "--maskR": ((sectionRect.right - targetRect.right) / sectionWidth * 100).toFixed(5) + "%",
                "--maskB": ((sectionRect.bottom - targetRect.bottom) / sectionHeight * 100).toFixed(5) + "%",
                "--maskL": ((targetRect.left - sectionRect.left) / sectionWidth * 100).toFixed(5) + "%"
            };
        }
        function motion() {
			if(parallaxTrigger){
				parallaxTrigger.kill();
				tl_group.kill();
			}

			parallaxTrigger = gsap.timeline({
                scrollTrigger: {
                    trigger: $triggerGroup.find(".parallax_trigger"),
                    start: 'top bottom',
                    end: 'bottom top',
					// markers:true,
                    scrub: true,
                }
            })
			.to($triggerGroup,{
				"--parallax":"0%",
				duration:1,
				ease:"none",
			})

            tl_group = gsap.timeline({
                scrollTrigger: {
                    trigger: $triggerGroup,
                    start: 'top 30%',
                    end: 'bottom bottom',
					// markers:true,
                    scrub: 0.3,
                }
            })
			.to($secEnc.find('.circle_bg'), {
				opacity: 1,
				duration: 0.3,
				onEnter: () => {
					$secEnc.addClass('active');
					setTimeout(() => {
						$video[0].play();
					}, 70)
				}
			})

            ScrollTrigger.matchMedia({
                "(min-width: 1025px)": function () {
                    tl_group
                        .to($secEnc.find('.row_wrap'), {
                            y: '-100%',
                            duration: 2,
                            ease: 'none',
                            delay: 0.3
                        })
                }
            })

            tl_group
                .to($secQuality, {y: 0, duration: 1, ease: 'none',
                    onStart: function () {
                        setTimeout(() => {titleMotion($secQuality)}, 300)
                    }
                }, '< +0.3')
                .to($secEnc.find('.dim'), {opacity: 1, duration: 1, ease: 'none'}, '< -0.5')
                .to($secQuality.find('.clip_wrap'), {
                    y: 0,
                    duration: 1,
                    delay: 1.15,
                    onEnter() {
                        $secQuality.addClass('active');
                    }
                }, '<')
                .fromTo($secQuality.find('.clip_mask'), {
                    ...getMaskOffsetRelativeToSection(),
                    "--opacity": 0,
                }, {
                    "--maskT": "0%",
                    "--maskR": "0%",
                    "--maskB": "0%",
                    "--maskL": "0%",
                    "--opacity": 1,
                    "--round": 0,
                    duration: 1,
                    ease: "none",
                }, "scene1")
                .to($secQuality.find('.left'), {left: '-50%', duration: 1}, "scene1")
                .to($secQuality.find('.right'), {right: '-50%', duration: 1}, "scene1")
                .to($secQuality.find('.txt_box'), {opacity: 1, top: '50%', duration: 0.8, ease: 'linear'}, '< +0.7');
        }

        function breakPoint(mediaQuery) {
            if (mediaQuery.matches) {
                oneMotion = true;
            } else{
                oneMotion = true;
            }
        }
        breakPoint(mediaQuery);
        mediaQuery.addEventListener("change", breakPoint);

        $(window).on("load resize", () => {
            setTimeout(() => {
                if(windowWidth > 1024 && !isTouchDevice){
                    // 웹 1025
                    motion();
                } else if(windowWidth > 1024 && isTouchDevice){
                    // 웹+ 1024이상 태블릿
                    if(oneMotion){
                        motion();
                        oneMotion = false;
                    }
                } else if(windowWidth < 1025){
                    // 모바일 1024
                    if(oneMotion){
                        motion();
                        oneMotion = false;
                    }
                }
            },10)
        });
    },

    secPortfolio: function () {
        const $secPortfolio = $('.sec_portfolio');
        const $progress = $secPortfolio.find('.progress');
        const $current = $progress.find('.current');
        const $drag = $progress.find('.drag');
        const $cards = $secPortfolio.find('.card');

        const displayIndex = 1;
        $current.text(String(displayIndex).padStart(2, '0'));
        const heightPercent = (displayIndex / $cards.length) * 100;
        $drag.css('height', `${heightPercent}%`);

        let swiperInitialized = false;
        function initSwiper() {
            new Swiper('.titleSwiper .swiper', {
                slidesPerView: 1,
                autoplay: {
                    delay: 1000,
                    disableOnInteraction: false
                },
                speed: 600,
                loop: true,
                observer: true,
                observeParents: true,
                touchRatio: false,
                allowTouchMove: false,
            });
        }

        let tl_portfolio = gsap.timeline({
            defaults: { duration: 1 },
            scrollTrigger: {
                trigger: $secPortfolio,
                start: 'top 20%',
                end: 'bottom bottom',
                scrub: 0.5,
                onEnter: () => {
                    $secPortfolio.addClass('active');
                    if (!swiperInitialized) {
                        setTimeout(() => {
                            initSwiper();
                            swiperInitialized = true;
                        }, 100)
                    }
                }
            }
        })
            // 상단 영역 처리
            .to($secPortfolio.find('.top'), {y: '-150%', duration: 0.7}, '>+1')
            .to($secPortfolio.find('.portfolio'), {
                top: window.innerWidth > 769 ? '40%' : '42%',
            }, '> -0.3');

        $cards.each(function (i, el) {
            const $card = $(el);
            const topValue = `${i * 4.5}%`;
            const scaleValue = 0.86 + (i * 0.04);
            const opacityValue = (i + 1) * 0.2;
            const displayIndex = i + 1;

            tl_portfolio
                .to($card, { top: topValue }, '<')
                .to($card, {
                    scale: scaleValue,
					onComplete:function(){
						if (!$card.hasClass("active")){
							$card.addClass("active");
						}
					},
					onUpdate: function() {
						if ($card.hasClass("active")){
							$card.removeClass("active");
						}
					}
                }, '=-0.2')
                .call(() => {
                    $current.text(String(displayIndex).padStart(2, '0'));
                    const heightPercent = (displayIndex / $cards.length) * 100;
                    $drag.css('height', `${heightPercent}%`);
                }, null, '>-0.4')
        });
    },

    secWonder: function () {
        const $secWonder = $('.sec_wonder');
        let tl_wonder = gsap.timeline({
            scrollTrigger: {
                trigger: $secWonder,
                start: 'top 20%',
                end: 'bottom bottom',
                onEnter: () => {
                    titleMotion($secWonder);
                    $secWonder.addClass('active');
                }
            }
        })

        /* youtube */
        const $videoView = $secWonder.find(".video_area");
        let iframe = document.createElement("div");
        iframe.id = "youtube-video";

        $videoView.find(".video").empty().append(iframe);
        function onPlayerReady(event){
            $videoView.find(".bg").on("click", function(){
                $(this).addClass("active");
                event.target.playVideo();
            })
        }

        $(window).on("load", function(){
            let player = new YT.Player('youtube-video', {
                videoId: "pjNUzC7eL5g",
                playerVars: {
                    rel: 0
                },
                events: {
                    "onReady" : onPlayerReady,
                }
            });
        });
    },

    secBusiness: function () {
        const $secBusiness = $('.sec_business');
        const $item1 = $secBusiness.find('.item1 .bg');
        const $item2 = $secBusiness.find('.item2 .bg');
        ScrollTrigger.matchMedia({
            "(min-width: 1025px)": function () {
                gsap.to($item1, {
                    y: "-60%",
                    ease: "none",
                    scrollTrigger: {
                        trigger: $secBusiness,
                        start: "top bottom",
                        end: "bottom top",
                        scrub: true,
                        duration: 1,
                    }
                });

                gsap.to($item2, {
                    y: "60%",
                    ease: "none",
                    scrollTrigger: {
                        trigger: $secBusiness,
                        start: "top bottom",
                        end: "bottom top",
                        scrub: true,
                        duration: 1,
                    }
                });
            }
        })
    },

    init: function () {
        About.utils.groupTrigger();
        About.utils.secPortfolio();
        About.utils.secWonder();
        About.utils.secBusiness();
    }
}

About.utils.init();