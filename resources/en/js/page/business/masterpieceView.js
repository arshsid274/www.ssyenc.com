/* MasterpieceView.js */
var MasterpieceView = MasterpieceView || {};

function titleMotion ($section) {
	const $tit = $section.find(".top strong");
	const $p = $section.find(".top p");

	// 이미 실행된 섹션은 패스
	if (
		$tit.attr('data-animated') === 'true' &&
		($p.length === 0 || $p.attr('data-animated') === 'true')
	) return;

	let title = new SplitText($tit, {
		type: 'lines,words',
		linesClass: '-line',
		wordsClass: '-word'
	});

	let p;
	if ($p.length) {
		p = new SplitText($p, {
			type: 'lines,words',
			linesClass: '-line',
			wordsClass: '-word'
		});
	}

	gsap.set($tit, { opacity: 1 });
	if ($p.length) gsap.set($p, { opacity: 1 });

	gsap.set($tit.find(".-line"), { overflow: "hidden" });
	if ($p.length) gsap.set($p.find(".-line"), { overflow: "hidden" });

	gsap.set($tit.find(".-word"), { yPercent: 100 });
	if ($p.length) gsap.set($p.find(".-word"), { yPercent: 100 });

	let tl = gsap.timeline({
		onComplete: function () {
			title.revert();
			$tit.attr('data-animated', 'true');

			if ($p.length) {
				p.revert();
				$p.attr('data-animated', 'true');
			}
		}
	});

	tl.to($tit.find(".-word"), {
		yPercent: 0,
		duration: 1,
		ease: Quart.easeOut
	});

	if ($p.length) {
		$p.find(".-line").each(function (i, line) {
			const word = line.querySelectorAll('.-word');
			tl.to(word, {
				yPercent: 0,
				duration: 1,
				ease: Quart.easeOut
			}, i * 0.1);
		});
	}
}
MasterpieceView.utils = {
	secVisual: function () {
		const $secVisual = $('.sec_visual');
		let tl_visual = gsap.timeline({
			scrollTrigger: {
				trigger: $secVisual,
				start: "top 100%",
				end: "bottom bottom"
			}
		})
			.to($secVisual.find('.line'), {
				width: '100%',
				duration: 1,
				ease: "sine.out"
			})
			.to($secVisual.find('h2'), {
				webkitClipPath: 'inset(0% 0% 0% 0%)',
				clipPath: 'inset(0% 0% 0% 0%)',
				duration: 0.8,
				delay: -0.8
			}, 'once')
			.to($secVisual.find('.box_cont'), {
				webkitClipPath: 'inset(0% 0% 0% 0%)',
				clipPath: 'inset(0% 0% 0% 0%)',
				duration: 0.8,
				delay: -0.8
			}, 'once')
	},

	secTypography: function () {
		const $secTypography = $('.sec_typography');
		const $video = $secTypography.find('video');
		let tl_landmark = gsap.timeline({
			scrollTrigger: {
				trigger: $secTypography,
				// scrub: true,
				// markers:true,
				start: "top center",
				end: "bottom bottom",
			}
		})
			.to($secTypography.find('.front'), {
				webkitClipPath: 'inset(0% 0% 0% 0%)',
				clipPath: 'inset(0% 0% 0% 0%)',
				duration: 1,
				ease: "sine.out"
			})
			.to($secTypography.find('.front'), {
				opacity: 0.08,
				filter: 'blur(5px)',
				duration: 1,
			}, '< +0.8')
			.to($secTypography.find('.front .sub'), {
				opacity: 0,
				duration: 1,
			}, '< +0.3')
			.to($secTypography.find('.front .sub'), {
				opacity: 0,
				duration: 1,
			}, '< +0.2')
			.to($secTypography.find('.back .img_wrap'), {
				webkitClipPath: 'inset(0% 0% 0% 0%)',
				clipPath: 'inset(0% 0% 0% 0%)',
				duration: 0.8,
				onComplete: (e) => {
					$video[0].play();
					$secTypography.find('.back .img_wrap .center_txt').addClass("active");
				}
			}, '<')
			.to($secTypography.find('.back .up'), {
				y: '-155',
				duration: 0.8
			}, 'once')
			.to($secTypography.find('.back .down'), {
				y: '155',
				duration: 0.8
			}, 'once')
			.to($secTypography.find('.back .text_wrap'), {
				y: 0,
				opacity: 1,
				duration: 0.8
			}, 'once')
	},

	secClass: function () {
		const $secClass = $('.sec_class');
		const video = $secClass.find(".bg").find('video');
		const img = $secClass.find(".bg").find(".swiper-container");

		let bgSlider = new Swiper(img, {
			effect: 'fade',
			fadeEffect: {
				crossFade: true
			},
			autoplay: {
				delay: 2000,
				disableOnInteraction: false,
				enabled: false
			},
			speed: 1000,
			slidesPerView: 1,
			observer: true,
			observeParents: true,
			touchRatio: false,
		});

		let tl_class = gsap.timeline({
			scrollTrigger: {
				trigger: $secClass,
				start: "top bottom",
				end: "bottom bottom",
				// markers:true,
				onEnter: () => {
					titleMotion($secClass);

					if(video.length > 0){
						video[0].play();
					} else if(img.length > 0){
						bgSlider.autoplay.start();
					}
				}
			}
		});
	},

	secLandmark: function () {
		const $secLandmark = $('.sec_landmark');
		let tl_landmark = gsap.timeline({
			scrollTrigger: {
				trigger: $secLandmark,
				start: "top 60%",
				end: "bottom bottom",
				// markers:true,
				onEnter: () => {
					titleMotion($secLandmark);
					$secLandmark.addClass('active');
				}
			}
		});
	},

	secStructure: function () {
		const $secStructure = $('.sec_structure');

		var $inSwiper = $secStructure.find(".in_swiper"),
			inSwiperArray = [];

		let tl_Structure = gsap.timeline({
			scrollTrigger: {
				trigger: $secStructure,
				start: "top 80%",
				end: "bottom bottom",
				onEnter: () => {
					$secStructure.addClass('active');
					setTimeout(() => {
						titleMotion($secStructure);
						$secStructure.addClass('contActive');
						inSwiper();
						inSwiperArray[0].autoplay.start();
					}, 380)
				}
			}
		});

		

		function inSwiper(){
			$inSwiper.each(function (idx, target) {
				if($(target).find('.swiper-slide').length > 1){
					var inSwiper = new Swiper(target, {
						effect:"fade",
						loop: true,
						speed: 500,
						observer: true,
						observeParents: true,
						touchRatio: false,
						nested: true,
						autoplay: {
							delay: 3000,
							disableOnInteraction: false,
						},
					});
					inSwiperArray.push(inSwiper);
					inSwiperArray[idx].autoplay.stop();
				}
			});
		};

		const $swiperTemplate = $secStructure.find('.swiperTemplate');
		const $swiperImg = $secStructure.find('.swiperImg');
		const speed = 600;
		let progressTimeline;
		let imgSwiper = new Swiper($swiperImg, {
			effect: 'fade',
			fadeEffect: {
				crossFade: true
			},
			speed: speed,
			slidesPerView: 1,
			observer: true,
			observeParents: true,
			touchRatio: false,
			on: {
				init: function () {
					scaleDownBgImage();
				},
				slideChangeTransitionStart: function () {
					scaleDownBgImage();
				},
				slideChangeTransitionEnd:function(){
					var idx = this.realIndex;
					$.each(inSwiperArray, function (i, swiper) {
						if (i === idx) {
							swiper.autoplay.start();
						} else {
							swiper.autoplay.stop();
						}
					});
				}
			}
		})

		let structureSwiper = new Swiper($swiperTemplate, {
			slidesPerView: 1,
			// loop: true,
			speed: speed,
			observer: true,
			observeParents: true,
			touchRatio: false,
			thumbs: {
				swiper: imgSwiper
			},
			pagination: {
				el: $swiperTemplate.find('.swiper-pagination'),
				type: 'bullets',
				renderBullet: function (index, className) {
					return ' <div class="' + className + '" role="button" tabindex="0"><div class="rail"><div class="fill"></div></div></div>';
				},
				clickable: true
			},
			navigation: {
				nextEl: $swiperTemplate.find('.swiper-button-next'),
				prevEl: $swiperTemplate.find('.swiper-button-prev')
			},
			breakpoints: {
				1024: {
					touchRatio: 1,
				},
			},
		})

		$('.side').on('click', function () {
			const isLeft = $(this).hasClass('left');
			if (isLeft) {
				structureSwiper.slidePrev();
				imgSwiper.slidePrev();
			} else {
				structureSwiper.slideNext();
				imgSwiper.slideNext();
			}
		});

		// 이미지 스케일 효과
		function scaleDownBgImage() {
			gsap.fromTo($swiperImg.find(".swiper-slide-active").find(".img_wrap"), speed / 100, {
				scale: 1.4,
				rotation: 0.1
			}, {
				scale: 1,
				rotation: 0,
				ease: Power2.inOut,
			});
		}
    },

    secTechnology: function () {
        // Technology swiper
        const $secTechnology = $('.sec_technology');
        const $techSwiper = $secTechnology.find('.swiper');
		const $line = $secTechnology.find('.bg_line_wrap');

		ScrollTrigger.matchMedia({
			"(min-width: 1025px)": function () {
				let tl_tech = gsap.timeline({
					defaults: { duration: 0.6, ease: "linear" },
					scrollTrigger: {
						trigger: $secTechnology,
						start: "top center",
						end: "bottom bottom"
					}
				})
					.to($line.find('.first'), {
						height: '100%',
						opacity: 0.2
					})
					.to($line.find('.second'), {
						width: '100%',
						opacity: 0.2
					}, '<0.4')
					.call(() => {
						titleMotion($secTechnology);
						$secTechnology.addClass('active');
					}, null, 'once')

					.to($line.find('.third'), {
						width: '100%',
						height: '100%',
						opacity: 0.2,
					}, 'once');
			},

			"(max-width: 1024px)": function () {
				gsap.timeline({
					scrollTrigger: {
						trigger: $secTechnology,
						start: "top center",
						onEnter: () => {
							titleMotion($secTechnology);
							$secTechnology.addClass('active');
						}
					}
				});
			}
		});

        let technologySwiper = new Swiper($techSwiper, {
            slidesPerView: 'auto',
            observer: true,
            observeParents: true,
            pagination: {
                el: $techSwiper.find('.swiper-pagination'),
                type: 'bullets',
            },
            scrollbar: {
                el: $techSwiper.find('.swiper-scrollbar')
            },
        })
    },

	secAwards: function () {
		const $secAwards = $('.sec_awards');
		let tl_awards = gsap.timeline({
			scrollTrigger: {
				trigger: $secAwards,
				start: "top 60%",
				end: "bottom bottom",
				onEnter: () => {
					titleMotion($secAwards);
					$secAwards.addClass('active');
				}
			}
		});

		const $item = $secAwards.find('.item');
		const $itemSwiper = $item.find('.swiper');

		if($itemSwiper.find(".swiper-slide").length > 1){
			const swiper = new Swiper($itemSwiper, {
				slidesPerView: 1,
				effect: 'fade',
				fadeEffect: {
					crossFade: true
				},
				autoplay: {
					delay: 2000,
					disableOnInteraction: false,
				},
				speed: 1000,
				loop: true,
				observer: true,
				observeParents: true,
				pagination: {
					el: $itemSwiper.find('.swiper-pagination'),
					type: 'bullets',
					clickable: true
				},
			});
		}
	},

    secBanner: function () {
        // 하단 배너 parallax
        const $secBanner = $('.sec_paging_banner');
        const $prev = $secBanner.find('.prev');
        const $next = $secBanner.find('.next');
        const $prevBg = $prev.find('.parallax-bg');
        const $nextBg = $next.find('.parallax-bg');

        gsap.to($prevBg, {
            y: "-60%",
            ease: "none",
            scrollTrigger: {
                trigger: $secBanner,
                start: "top bottom",
                end: "bottom top",
                scrub: 0,
                duration: 1,
            }
        });

        gsap.to($nextBg, {
            y: "60%",
            ease: "none",
            scrollTrigger: {
                trigger: $secBanner,
                start: "top bottom",
                end: "bottom top",
                scrub: 0,
                duration: 1,
            }
        });
    },

    init: function () {
        MasterpieceView.utils.secVisual();
        MasterpieceView.utils.secTypography();
        MasterpieceView.utils.secClass();
        MasterpieceView.utils.secStructure();
        MasterpieceView.utils.secLandmark();
        MasterpieceView.utils.secTechnology();
        MasterpieceView.utils.secAwards();
        MasterpieceView.utils.secBanner();
    }
}

MasterpieceView.utils.init();