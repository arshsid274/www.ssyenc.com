/* main.js */
var main = main || {};
var lenis;

main.utils = {
	/**
	 * main.utils.mainPopup() - 메인팝업
     * @param {string} el - 해당 팝업 엘리먼트
	 */
    mainPopup: function(el){
        var $el = $(el),
			$swiperContainer = $el.find(".swiper-container"),
			popupMultipleLen = $el.find(".swiper-slide").length,
			$btnMultipleClose = $el.find(".btn_close"),
			popupSwiper;

		function breakPoint(mediaQuery) {
			if (mediaQuery.matches) {
				if($swiperContainer.hasClass("swiper-container-initialized")){
					popupSwiper.destroy();
					$el.find(".swiper-pagination").removeClass("active");
				}
			} else {
				if (popupMultipleLen > 1) {
					popupSwiper = new Swiper($swiperContainer, {
						slidesPerView: 'auto',
						observer: true,
						observeParents: true,
						pagination: {
							el: ".swiper-pagination",
							clickable: true,
						},
					});
					$el.find(".swiper-pagination").addClass("active");
				}
			}
		}
		breakPoint(mediaQuery);
		mediaQuery.addEventListener("change", breakPoint);

		function popupMultipleOpen(el) {
			$(el).addClass("open");
		}
		function popupMultipleClose() {
			$el.removeClass("open");
		}

        if(popupMultipleLen > 0){
            if (Ssangyong.utils.getCookie("mainPopupCheck") !== "no") {
                popupMultipleOpen(".main_popup");
				setTimeout(function(){
					Ssangyong.utils.enterkey(".main_popup");
				},200);
            } else{
                $el.hide();
            }
        } else{
            $el.remove();
        }

		$btnMultipleClose.on("click", function () {
			var popupId = $(this).closest(".main_popup").attr("id");

			// setCookie
			if ($el.find("input[name='todayPopupClose']").prop("checked")) {
				Ssangyong.utils.setCookie(popupId + "Check", "no", 1); // 하루 쿠키 적용(마지막 인자값이 날자임)
			}

			popupMultipleClose();
		});

    },
	visual: function(){
		var $sec = $(".main_visual"),
			$introWrap = $sec.find(".intro_wrap"),
			$sliderWrap = $sec.find(".slider_wrap"),
			$slidePaging = $sliderWrap.find(".pagination"),
			$slideMoveBtn = $sec.find(".move_btn").find("a"),
			$ssyOn = $(".ssy_on"),
			$ssyBtn = $ssyOn.find(".ssy_on_btn"),
			speed = 1000,
			scaleTween;

		var progressTimeline, visualSwiper;


		// intro motion
		var $splitTxtWrap = $introWrap.find(".title_wrap").find("p");
		var $step1Txt = $introWrap.find(".title_wrap").find("p.step1");
		var $step2Txt = $introWrap.find(".title_wrap").find("p.step2");

		// $splitTxtWrap.each(function() {
		// 	var el = this;
		// 	var nodes = Array.from(el.childNodes);

		// 	nodes.forEach(function(node){
		// 		if (node.nodeType === 3) {
		// 			var replaced = node.textContent.replace(/\S/g, "<span>$&</span>");
		// 			var spanWrapper = document.createElement("span");
		// 			spanWrapper.innerHTML = replaced;
		// 			el.replaceChild(spanWrapper, node);
					
		// 			while (spanWrapper.firstChild) {
		// 				el.insertBefore(spanWrapper.firstChild, spanWrapper);
		// 			}
		// 			el.removeChild(spanWrapper);
		// 		}
		// 	});
		// });

		if(window.location.search.split("intro=")[1] == "false"){
			$("#wrap.main").removeClass("intro");
		} else{
			gsap.set($sec, {
				...getMaskOffsetRelativeToSection(),
				ease: "none",
				onComplete:function(){
					setTimeout(function(){
						$sec.addClass("active-1");
						gsap.to($step1Txt.find("span"),{
							delay:0.2,
							opacity:1,
							x:0,
							scaleX:1,
							duration:1,
							ease: 'power2.out',
							stagger: 0.025,
							onComplete: function(){
								setTimeout(function(){
									gsap.to($step1Txt,{
										autoAlpha:0,
										duration:0.5,
										ease: 'power2.out',
									});
									gsap.to($step2Txt,{
										autoAlpha:1,
										duration:0.5,
										ease: 'power2.out',
										onComplete: function(){
											gsap.to($step2Txt.find("span"),{
												delay:0.2,
												opacity:1,
												x:0,
												scaleX:1,
												duration:1,
												ease: 'power2.out',
												stagger: 0.025,
												onComplete: function(){
													setTimeout(function(){
														$sec.addClass("active-2");
													},400);
													setTimeout(function(){
														$("#wrap.main").removeClass("intro");
													},1200);
												}
											});
										}
									});
								},600);
							}
						});
					},100)
				}
			});
		}

		$(".intro_skip_btn").on("click", function(){
			var params = new URLSearchParams(window.location.search);
			params.set('intro', 'false');
			var newUrl = `${window.location.pathname}?${params.toString()}`;
			window.history.pushState(null, '', newUrl);

			$sec.addClass("active-2");
			setTimeout(function(){
				$("#wrap.main").removeClass("intro");
			},800);
		});
		
		$(window).on("load", function(){
			visualSlide();
		});

		function getMaskOffsetRelativeToSection() {
			var _maskWrapPerent = $sec.find(".intro_wrap")[0];
			var sectionRect = _maskWrapPerent.getBoundingClientRect();
			var targetRect = $sec.find(".intro_wrap").find(".mask_blank")[0].getBoundingClientRect();
			var sectionHeight = _maskWrapPerent.offsetHeight;
			var sectionWidth = _maskWrapPerent.offsetWidth;

			return {
				"--maskT": ((targetRect.top - sectionRect.top) / sectionHeight * 100).toFixed(5) + "%",
				"--maskR": ((sectionRect.right - targetRect.right) / sectionWidth * 100).toFixed(5) + "%",
				"--maskB": ((sectionRect.bottom - targetRect.bottom) / sectionHeight * 100).toFixed(5) + "%",
				"--maskL": ((targetRect.left - sectionRect.left) / sectionWidth * 100).toFixed(5) + "%"
			};
		}
		
		// 슬라이드
		function visualSlide(){
			visualSwiper = new Swiper($sliderWrap, {
				loop: true,
				simulateTouch: false,
				touchRatio: 0,
				speed: speed,
				parallax: true,
				pagination: {
					el: $slidePaging,
					clickable: true,
					renderBullet: function (index, className) {
						return' <div class="' + className + '" role="button" tabindex="0"><div class="rail"><div class="fill"></div></div></div>';
					}
				},
				on: {
					init: function() {
						txtMotion();
					},
					slideChangeTransitionStart: function(){
						progressPagination();
					},
					slideChangeTransitionEnd: function(swiper){
						txtMotion();
						// 이미지 타입
						if($sliderWrap.find(".swiper-slide-active").find(".bg").length > 0){
							scaleDownBgImage();
						}
					}
				},
				breakpoints: {
					1024: {
						// 데스크탑 이하
						allowTouchMove: true,
						simulateTouch: true,
						touchRatio: 1
					}
				}
			});
	
			// 슬라이드 실행 함수
			function progressPagination(){
				var bullet = $sec.find('.swiper-pagination-bullet').find('.fill'),
					activeBullet = $sec.find('.swiper-pagination-bullet-active').find('.fill'),
					activeBefore = $sec.find('.swiper-pagination-bullet-active').prevAll().find('.fill');
	
				if(progressTimeline){
					progressTimeline.kill();
				}
				setTimeout(function() {
					var video = $sliderWrap.find(".swiper-slide").find("video"),
						activeVideo = $sliderWrap.find(".swiper-slide-active").find("video"),
						initVideo = activeVideo.length == 0 ? $(".swiper-slide").eq(0).find("video") : activeVideo,
						initBullet = activeBullet.length == 0 ? $sec.find('.swiper-pagination-bullet').eq(0).find('.fill') : activeBullet;
	
					if(windowWidth > 1024){
						if($sliderWrap.find(".swiper-slide-active").find(".web").hasClass("bg_wrap")){
							imgVideoCheck('img')
						} else{
							imgVideoCheck('video')
						}
					} else{
						if($sliderWrap.find(".swiper-slide-active").find(".mobile").hasClass("bg_wrap")){
							imgVideoCheck('img')
						} else{
							imgVideoCheck('video')
						}
					}

					function imgVideoCheck(is){
						if(is == "img"){
							duration = speed;
							bullet.css({"width":"0"});
							progressTimeline = gsap.timeline()
							.fromTo(initBullet, duration/100, {
								width:"0",
							},{
								width:'100%', 
								ease: "none",
								onComplete: function(){
									visualSwiper.slideNext(1000);
								}
							});
						} else{
							duration = parseInt(initVideo.get(0).duration);
							video.trigger("pause");
							initVideo.get(0).currentTime = 0;

							if($slideMoveBtn.attr('data-play') == 'pause'){
								initVideo.trigger("pause");
							} else{
								initVideo.trigger("play");
							}

							bullet.css({"width":"0"});
							progressTimeline = gsap.timeline()
							.fromTo(initBullet, duration , {
								width:"0",
							},{
								width:'100%', 
								ease: "none",
								onComplete: function(){
									visualSwiper.slideNext(1000);
								}
							});
						}
					}
					initVideo.off("ended").on("ended", function(){
						visualSwiper.slideNext(1000);
					});
				}, 10);
			};

			// 이미지 스케일 효과
			function scaleDownBgImage(){
				// 이전 트윈 중단
				if (scaleTween) {
					scaleTween.kill();
				}
				gsap.set($sliderWrap.find(".swiper-slide").find(".bg"), {
					scale:1.3, 
					duration:0,
				});
				scaleTween = gsap.fromTo($sliderWrap.find(".swiper-slide-active").find(".bg"), speed/100, {
					scale:1.3, 
				}, {
					scale:1,
					ease:Power2.inOut,
				});
			};
	
			// 텍스트 모션
			function txtMotion(){
				$sliderWrap.find('.swiper-slide').removeClass("active");
				$sliderWrap.find('.swiper-slide-active').addClass("active");
	
				gsap.set($sliderWrap.find('.swiper-slide').find(".txt"), {
					opacity:0
				});
				gsap.to($sliderWrap.find('.swiper-slide.active').find(".txt"), {
					opacity:1
				});
			};
			
			setTimeout(function(){
				slideTrigger();
			},10)
		};

		// video trigger
		function slideIs(is){
			if(is == 'play'){
				var $video = $sliderWrap.find(".swiper-slide-active").find("video").get(0);
				if ($video && $video.paused) {
					// video
					$video.play().catch(() => {});
					progressTimeline.play();
				} else{
					// bg
					progressTimeline.play();
				}
			} else if(is == 'pause'){
				var $video = $sliderWrap.find(".swiper-slide-active").find("video").get(0);
				if ($video && !$video.paused) {
					// video
					$video.play();
					setTimeout(function(){
						$video.pause();
						progressTimeline.pause();
					},100)
				} else{
					// bg
					progressTimeline.pause();
				}
			}
		}
		function slideTrigger(){
			ScrollTrigger.create({
				id:'mainVisualSlideTrigger',
				trigger: $sec,
				// markers:true,
				invalidateOnRefresh: true,
				onEnter: function(){
					slideIs('play');
				},
				onLeave: function(){
					slideIs('pause');
					if($ssyOn.hasClass("active")){
						$ssyOn.find(".ssy_on_btn").trigger("click");
					}
				},
				onEnterBack: function(){
					slideIs('play');
				},
				onLeaveBack: function(){
					slideIs('pause');
					if($ssyOn.hasClass("active")){
						$ssyOn.find(".ssy_on_btn").trigger("click");
					}
				},
			});
		}
		(function ssyOn(){
			ssyonSwiper = new Swiper($ssyOn.find(".slide .swiper-container"), {
				direction: "vertical",
				autoHeight: true,
				slidesPerView: 'auto',
				loop: true,
				speed: 800,
				autoplay: {
					delay: 2000,
					disableOnInteraction: false,
				},
			});

			$ssyBtn.on("click", function(){
				if($ssyOn.hasClass("active")){
					$sec.find(".blur").removeClass("active");
					$ssyOn.removeClass("active");
					$ssyOn.find(".bot").stop().slideUp(300);
				} else{
					$sec.find(".blur").addClass("active");
					$ssyOn.addClass("active");
					$ssyOn.find(".bot").stop().slideDown(300);
				}
			});
			$ssyBtn.on("mouseenter", function(){
				$ssyOn.addClass("hover");
			}).on("mouseleave", function(){
				$ssyOn.removeClass("hover");
			});
			$sec.find(".blur").on("click", function(){
				$ssyBtn.trigger("click");
			});
		})();
		
	},
	business: function(){
		var $sec = $(".sec_business");
		var $listArea = $sec.find(".list_area");
		var $slider = $listArea.find(".swiper-container");
		var swiper;
		var oneMotion;
		var tl;
		
		function webMotion(){
			if($slider.hasClass("swiper-container-initialized")){
				swiper.destroy();
			}
			mouseMoveSlider();
		}
		function introMotion(){
			var $slides = $sec.find('.swiper-slide');
			var $wrapper = $sec.find('.swiper-wrapper');
			var wrapperOffset = $wrapper.offset();
			var wrapperWidth = $wrapper.outerWidth();
			var wrapperHeight = $wrapper.outerHeight();
			var centerX = wrapperOffset.left + wrapperWidth / 2;
			var centerY = wrapperOffset.top + wrapperHeight / 2;
			
			if (tl) {
				tl.scrollTrigger.kill();
				tl.kill();
			}
			tl = gsap.timeline({
				scrollTrigger: {
					trigger: $sec,
					id: "sec_business_intro",
					// markers: true,
					toggleActions: "play none none none",
					start: "top center",
					end: "bottom center",
					onEnter: function(){
						$sec.addClass("active");
					}
				},
				onComplete:function(){
					$sec.removeClass("intro");
				}
			})
			.to($sec.find(".bg_area").find(".progress"),{
				drawSVG:"100%",
				duration:1,
			},"scene1")

			$slides.each(function (i, el) {
				var $el = $(el);
				var elOffset = $el.offset();
				var elWidth = $el.outerWidth();
				var elHeight = $el.outerHeight();

				var elCenterX = elOffset.left + elWidth / 2;
				var elCenterY = elOffset.top + elHeight / 2;

				var deltaX = centerX - elCenterX;
				var deltaY = centerY - elCenterY;
				var direction = Math.random() < 0.5 ? -1 : 1;	
				var rotate = direction * (i * 3);

				gsap.set($el, {
					x: deltaX,
					y: deltaY,
					rotate:rotate,
					scale:0.9,
					"z-index":  $slides.length - i, 
				});

				tl.to($el, {
					rotate:0,
					duration: 0.5,
					ease:"power3.inOut",
				},"scene2");
				tl.to($el, {
					x: 0,
					y: 0,
					scale:1,
					duration: 1,
					ease:"power3.inOut",
					onComplete: function(){
						if(i == $slides.length-1){
							// 마지막 한번만 실행 
							if(swiper){
								// 모바일만
								$sec.find(".tit_area").find("li").removeClass("active").eq(0).addClass("active");
								$sec.find(".tit_area").find("strong").addClass("active");
							}
						}
					}
				},"scene3");
			});
		}
		function mobileMotion(){
			$listArea.off("mousemove");
			$slider.find(".swiper-slide").off("mouseenter");
			swiperInit();
		}
		function mouseMoveSlider(){
			var $sliderWrapper = $slider.find('.swiper-wrapper');
			var sliderScrollWidth = $sliderWrapper[0].scrollWidth;
			var listAreaWidth = $listArea.width();
			var move;

			var maxTranslateX = sliderScrollWidth - listAreaWidth;
			if (maxTranslateX < 0){
				maxTranslateX = 0;
			}

			// 기준 구간 설정 (맨 왼쪽, 맨 오른쪽 까지 가지 않아도 처음과 끝으로 이동될 수 있게)
			var leftLimit = listAreaWidth * 0.4;
			var rightLimit = listAreaWidth * 0.6;

			$listArea.off("mousemove").on('mousemove', function (e) {
				var offsetX = e.pageX - $listArea.offset().left;
				var translateX;

				if (offsetX <= leftLimit) {
					// 왼쪽 끝
					translateX = 0;
				} else if (offsetX >= rightLimit) {
					// 오른쪽 끝
					translateX = -maxTranslateX;
				} else {
					// 중간 구간 (leftLimit ~ rightLimit)를 0~1 비율로 매핑
					var ratio = (offsetX - leftLimit) / (rightLimit - leftLimit);
					translateX = -maxTranslateX * ratio;
				}

				if(move){
					move.kill();
				}
				move = gsap.to($sliderWrapper,{
					transform: 'translateX(' + translateX + 'px)',
					duration:0.3,
				})
			});
			$slider.find(".swiper-slide").on("mouseenter", function(){
				var idx = $(this).index();

				$sec.find(".tit_area").find("li").removeClass("active").eq(idx).addClass("active");
				$sec.find(".tit_area").find("strong").addClass("active");
			});
			$slider.on("mouseleave", function(){
				$sec.find(".tit_area").find("li").removeClass("active");
				$sec.find(".tit_area").find("strong").removeClass("active");
			});
		}
		function swiperInit(){
			var $slider = $listArea.find(".swiper-container");

			swiper = new Swiper($slider, {
				slidesPerView: "auto",
				breakpoints: {
					1024: {
						slidesPerView: 1,
						spaceBetween: 24,
					},
				},
				pagination: {
					el: $slider.next(".swiper-pagination"),
					clickable: true,
				},
				on: {
					slideChangeTransitionEnd: function(){
						$sec.find(".tit_area").find("li").removeClass("active").eq(swiper.activeIndex).addClass("active");
						$sec.find(".tit_area").find("strong").addClass("active");
					}
				},
			});
		};

		// resize
		function breakPoint(mediaQuery) {
            if (mediaQuery.matches) {
                oneMotion = true;
            } else{
                oneMotion = true;
            }
        }
        breakPoint(mediaQuery);
        mediaQuery.addEventListener("change", breakPoint);

		$(window).on("load resize", function () {
			setTimeout(() => {
                if(windowWidth > 1024 && !isTouchDevice){
                    // 웹 1025
                    webMotion();
                } else if(windowWidth > 1024 && isTouchDevice){
                    // 웹+ 1024이상 태블릿
                    if(oneMotion){
                        mobileMotion();
                        oneMotion = false;
                    }
                } else if(windowWidth < 1025){
                    // 모바일 1024
                    if(oneMotion){
                        mobileMotion();
                        oneMotion = false;
                    }
                }
            },10)
        });
		$(window).on("load", function(){
			setTimeout(() => {
				introMotion();
            },20)
		})
	},
	masterPiece: function(){
		var $sec = $(".sec_masterpiece");
		var $outSwiper = $sec.find(".out_swiper");
		var $inSwiper = $sec.find(".in_swiper");
		var introTimeline, outSwiper, inSwiperArray = [];
		var speed = 6000;
		var tickerId = null;
		var clickFlag = true;

		// outSwiper
		outSwiper = new Swiper($outSwiper, {
			// loop: true,
    		centeredSlides: true,
			loopedSlides: 1,
			speed: 1000,
			parallax: true,
			observer: true,
			observeParents: true,
			// touchRatio: 0,
			// simulateTouch: false,
			// noSwiping: true,
			pagination: {
				el: $outSwiper.find(".out_swiper_paging .progress"),
				clickable: true,
				renderBullet: function (index, className) {
					return '<div class="' + className + '" role="button" tabindex="0"><div class="rail"><div class="fill"></div></div></div>';
				}
			},
			on: {
				init: function () {
					inSwiper();
					customCursor();
				},
				slideChangeTransitionStart: function () {
					clickFlag = false;
				},
				slideChangeTransitionEnd: function () {
					var activeIndex = this.realIndex;

					clickFlag = true;
				},
			}
		});

		function inSwiper(){
			$inSwiper.each(function (idx, target) {
				var inSwiper = new Swiper(target, {
					effect:"fade",
					loop: true,
					speed: 500,
					observer: true,
					observeParents: true,
					nested: true,
					autoplay: {
						delay: 1500,
						disableOnInteraction: false,
					},
					pagination: {
						el: $(target).next(".in_swiper_paging"),
						clickable: true,
					},
				});
				inSwiperArray.push(inSwiper);
			});
		};

		function customCursor(){
			$sec.append("<div class='custom_cursor'><span></span></div>");
			var $cursor = $sec.find(".custom_cursor");
			var speed = 0.3;
			var pos = { x: window.innerWidth / 2, y: window.innerHeight / 2 };
			var mouse = { x: pos.x, y: pos.y };
			var xSet = gsap.quickSetter($cursor, "left", "px");
			var ySet = gsap.quickSetter($cursor, "top", "px");

			gsap.set($cursor, { xPercent: -50, yPercent: -50 });

			$document.on("pointermove", function(e){
				e.preventDefault();
				mouse.x = e.clientX;
				mouse.y = e.clientY;
			});

			// left
			$sec.find(".out-slide:not(:first-child)").find(".cont_area").find(".left").on("mouseenter", function(e){
				var title = $outSwiper.find(".swiper-slide-prev").find(".tit_area").find("strong").html();
				$(this).addClass("hover");
				$cursor.find("span").html(title);
				$cursor.addClass("active left");
			}).on("mouseleave", function(){
				$(this).removeClass("hover");
				$cursor.removeClass("active left");
			});
			// left 자식요소 a
			$sec.find(".cont_area").find(".left").find("a").on("mouseenter", function(e){
				$cursor.removeClass("active");
			}).on("mouseleave", function(){
				if (!($(this).closest(".out-slide").is(":first-child"))) {
					$cursor.addClass("active");
				}
			});
			$sec.find(".cont_area").find(".left").on("click", function(e){
				if(clickFlag){
					if(!$(e.target).closest(".btn").length > 0){
						outSwiper.slidePrev();
					}
				}
			});
			$sec.find(".out_swiper_paging").find(".prev").on("click", function(){
				if(clickFlag){
					outSwiper.slidePrev();
				}
			});

			// right
			$sec.find(".out-slide:not(:last-child)").find(".cont_area").find(".right").on("mouseenter", function(){
				var title = $outSwiper.find(".swiper-slide-next").find(".tit_area").find("strong").html();
				$(this).addClass("hover");
				$cursor.find("span").html(title);
				$cursor.addClass("active right");
			}).on("mouseleave", function(){
				$(this).removeClass("hover");
				$cursor.removeClass("active right");
			});
			// right 자식요소 a
			$sec.find(".cont_area").find(".right").find("a").on("mouseenter", function(e){
				$cursor.removeClass("active");
			}).on("mouseleave", function(){
				if (!($(this).closest(".out-slide").is(":last-child"))) {
					$cursor.addClass("active");
				}
			});
			$sec.find(".cont_area").find(".right").on("click", function(){
				if(clickFlag){
					outSwiper.slideNext();
				}
			});
			$sec.find(".out_swiper_paging").find(".next").on("click", function(){
				if(clickFlag){
					outSwiper.slideNext();
				}
			});
			
			tickerId = function () {
				var dt = 1.0 - Math.pow(1.0 - speed, gsap.ticker.deltaRatio());
				pos.x += (mouse.x - pos.x) * dt;
				pos.y += (mouse.y - pos.y) * dt;
				xSet(pos.x);
				ySet(pos.y);
			};
			gsap.ticker.add(tickerId);

			// mediaQuery 상태를 저장
			$sec.data("cursor-active", true);
			$sec.data("ticker-id", tickerId);
		}

		function introMotion(){
			// if (introTimeline) {
			// 	introTimeline.scrollTrigger.kill();
			// 	introTimeline.kill();
			// }
			introTimeline = gsap.timeline({
				scrollTrigger: {
					trigger: $sec,
					id: "sec_business_intro",
					// markers: true,
					toggleActions: "play none none none",
					start: "top center",
					end: "bottom center",
				},
				onComplete:function(){
					$sec.removeClass("intro");
				}
			})
		}
		
		$(window).on("load", function(){
			setTimeout(() => {
				introMotion();
            },20)
		})
		
		var flag;
		$(window).on("load resize", function(){
			if(windowWidth > 1024){
				$outSwiper.find(".in_swiper").removeAttr("style");

				setTimeout(() => {
					$outSwiper.find(".in_swiper").each(function(){
						var width = $(this).width();
						var height = $(this).height();
						$(this).css("width", Math.floor(width+1));
						$(this).css("height", Math.floor(height));
					})

					flag = true;
				},100)
			} else{
				if(flag){
					$outSwiper.find(".in_swiper").removeAttr("style");
					flag = false;
				}
			}
		});
	},
	global: function(){
		gsap.timeline({
			scrollTrigger: {
				trigger: $(".main_visual"),
				id: "globe_trigger_start",
				// markers: true,
				toggleActions: "play none none none",
				start: "bottom center",
				end: "bottom center",
			},
			onComplete:function(){
				var script = document.createElement("script");
				script.src = "/resources/kr/js/plugin/globe.gl.js";
				document.body.appendChild(script);
				fetchGlobe();
			}
		})

		function fetchGlobe(){
			fetch('/kr/main/businessData')
			.then(response => {
				if (!response.ok) {
					throw new Error('Network response was not ok');
				}
				return response.json();
			})
			.then(data => {
				const section = document.querySelector(".sec_project");
				const container = section.querySelector('#globe');
				const globe = new Globe(container,{
					animateIn:false,
				});
				const movingTime = 1000; // 이동 시간
				const maxDistance = 300; // 최대 값
				const minDistance = 200; // 최소 값
				const boxBtn = section.querySelectorAll(".box");

				let clickAble = false;
				let globeWidth = container.getBoundingClientRect().width;
				let globeHeight = container.getBoundingClientRect().height;

				// 지구 값 set
				// 줌 휠 막기
				globe.controls().enableZoom = false;
				
				// 사이즈
				globe.controls().minDistance = minDistance;
				globe.controls().maxDistance = maxDistance; 

				// globe 이미지 생성
				globe.globeImageUrl('/resources/kr/images/main/globe/globe_70.jpg');

				// 시작지점
				globe.pointOfView({
					lat:-7.5153539672681,
					lng:127.1035010124817,
				});
				globe.width(globeWidth);
				globe.height(globeHeight);
				globe.backgroundColor('rgba(255,255,255,0)');

					// 자동 회전 여부
				globe.controls().autoRotate = true;
				// 음수, 양수에 따라 방향 전환
				globe.controls().autoRotateSpeed = 3;

				// 지구 주변 그라디언트rgba(36, 69, 127, 0.80) 
				globe.atmosphereColor(0xFFFFFF);
				globe.atmosphereAltitude(0.1);

				
				// 네트워크
				const networkData = data.globalNetwork;
				const networkLength = networkData.reduce((acc, cur) => {
					const type = cur.type;
					acc[type] = (acc[type] || 0) + 1;
					return acc;
				}, {});

				const networkBranches = section.querySelector('.branches');
				const networkSubsidiaries = section.querySelector('.subsidiaries');

				networkBranches.innerText = networkLength["branches"];
				networkSubsidiaries.innerText = networkLength["subsidiaries"];

				
				// 프로젝트
				const overseasData = data.projectMap[0];
				const domesticData = data.projectMap[1];
				const countries = overseasData.country;
				const continentCoords = [
					{ lat: 35.300275, lng: 110.608861, tit: "Asia" },
					{ lat: 27.480986, lng: 75.715803, tit: "Middle East" },
					{ lat: 52.749594, lng: 12.242692, tit: "Europe" },
					{ lat: 9.032659,  lng: 20.325600, tit: "Africa" },
					{ lat: -19.808044, lng: 134.236194, tit: "Oceania" },
					{ lat: 39.808536, lng: -102.743187, tit: "America" }
				];

				// 대륙별 나라 정리
				let continentMap = {};
				$.each(countries,function(index,country) {
					let continent = country.continent;

					if (!continentMap[continent]) {
						continentMap[continent] = [];
					}
					continentMap[continent].push(country);
				});

				// continentMap + 좌표 조합
				const projectData = Object.keys(continentMap).map(function(continentName) {
					let coord = continentCoords.find(function(c) {
						return c.tit === continentName;
					});

					const overseasList = continentMap[continentName];
					const isAsia = continentName.toLowerCase() === 'asia';
					let domesticListLength = 0;
					if(isAsia){
						$.each(domesticData.region,function(index,region) {
							domesticListLength=domesticListLength+region.list.length;
						});
					}

					// 대륙별 나라가 가지고 있는 프로젝트 개수 
					const overseasTotalLength = overseasList.reduce(function(total, item) {
						return total + (item.list ? item.list.length : 0);
					}, 0);

					return {
						continent: continentName,
						lat: coord ? coord.lat : null,
						lng: coord ? coord.lng : null,
						list: overseasList,
						length: overseasTotalLength + domesticListLength
					};
				});

				
				const projectMapOverseas = section.querySelector('.overseas');
				const projectMapDomestic = section.querySelector('.domestic');

				// 해외 데이터 countries 안에 list 총 개수 합산
				let totalListCount = 0;
				$.each(countries,function(index,country) {
					if (country.list && Array.isArray(country.list)) {
						totalListCount += country.list.length;
					}
				});

				projectMapOverseas.innerText = totalListCount;
				let regionListLength = 0;
				$.each(domesticData.region,function(index,region) {
					regionListLength=regionListLength+region.list.length;
				});
				projectMapDomestic.innerText = regionListLength;
				
				// click
				boxBtn.forEach(box => {
					box.addEventListener("mouseenter", (e) => {
						if (windowWidth > 1023) {
							boxEnter(e);
						}
					});

					box.addEventListener("mouseleave", (e) => {
						if (windowWidth > 1023) {
							boxLeave(e);
						}
					});
				});

				function boxEnter(e) {
					const parentEl = e.target.closest(".box");
					const title = parentEl.querySelector(".top").querySelector("p").textContent;

					document.querySelectorAll(".box").forEach(box => box.classList.remove("active"));
					parentEl.classList.add("active");
					parentEl.querySelector("a").classList.remove("white");

					if(title == "Network"){
						globe.htmlElementsData(networkData)
						.htmlElement(c => networkView(c));
					} else if(title =="Project Map"){
						globe.htmlElementsData(projectData)
						.htmlElement(c => projectMapView(c));
					}
				}
				function boxLeave(e){
					const parentEl = e.target.closest(".box");
					const title = parentEl.querySelector(".top").querySelector("p").textContent;
					
					parentEl.classList.remove("active");
					parentEl.querySelector("a").classList.add("white");

					if(title == "Network"){
						globe.htmlElementsData([])
						.htmlElement([]);
					} else if(title =="Project Map"){
						globe.htmlElementsData([])
						.htmlElement([]);
					}
				}

				function networkView(data){
					// 본사 제외 나타내기
					if(!(data.type == "headoffice")){
						const el = document.createElement('div');
						let innerHtml;
						innerHtml = `
							<div class="country_area active">
								<p>${data.country}</p>
								<i><img src="/resources/kr/images/main/globe/spot.png" alt=""></i>
							</div>
						`;
						
						el.innerHTML = innerHtml;
						return el;
					}
				}

				function projectMapView(data){
					const el = document.createElement('div');
					let innerHtml;

					innerHtml = `
						<div class="continent_area active">
							<div class="txt_area">
								<p class="tit">${data.continent}</p>
								<p class="num">${data.length}</p>
							</div>
							<div class="round">
								<i></i>
								<i></i>
								<i></i>
								<i></i>
							</div>
						</div>
					`;

					el.innerHTML = innerHtml;
					return el;
				}

				// 모션
				globe.onGlobeReady(()=>{
					ScrollTrigger.matchMedia({
						"(min-width: 1025px)": function() {
							gsap.set(globe.scene().scale,{
								x:1.5,
								y:1.5,
								z:1.5,
							});
							gsap.set(globe.scene().rotation,{
								y:-5,
							});
							gsap.set(globe.scene().position, {
								y:-5,
								duration:1,
							});

							// timeline
							let globeTimeline = gsap.timeline({
								scrollTrigger: {
									trigger: section,
									id: "globeTriggerPC",
									scrub: true,
									// markers: true,
									start: "top bottom",
									end: "bottom bottom",
								}
							})
							.to(globe.scene().scale, {
								x: 1,
								y: 1,
								z: 1,
								duration:1,
							},'scene1')
							.to(globe.scene().rotation, {
								y:0,
								duration:1,
							},'scene1')
							.to(globe.scene().position, {
								y:-50,
								duration:1,
							},'scene1')
						},
						"(min-width:768px) and (max-width: 1024px)": function() {
							gsap.set(globe.scene().scale,{
								x:1,
								y:1,
								z:1,
							});
							gsap.set(globe.scene().rotation,{
								y:-5,
							});
							gsap.set(globe.scene().position, {
								y:50,
								duration:1,
							});

							// timeline
							let globeTimeline = gsap.timeline({
								scrollTrigger: {
									trigger: section,
									id: "globeTriggerT",
									scrub: true,
									// markers: true,
									start: "top bottom",
									end: "center center",
								}
							})
							.to(globe.scene().scale, {
								x: 0.7,
								y: 0.7,
								z: 0.7,
								duration:1,
							},'scene1')
							.to(globe.scene().rotation, {
								y:0,
								duration:1,
							},'scene1')
							.to(globe.scene().position, {
								y:0,
								duration:1,
							},'scene1')
						},
						"(max-width: 767px)": function() {
							gsap.set(globe.scene().scale,{
								x:1,
								y:1,
								z:1,
							});
							gsap.set(globe.scene().rotation,{
								y:-5,
							});
							gsap.set(globe.scene().position, {
								y:50,
								duration:1,
							});

							// timeline
							let globeTimeline = gsap.timeline({
								scrollTrigger: {
									trigger: section,
									id: "globeTriggerM",
									scrub: true,
									// markers: true,
									start: "top bottom",
									end: "center center",
								}
							})
							.to(globe.scene().scale, {
								x: 0.5,
								y: 0.5,
								z: 0.5,
								duration:1,
							},'scene1')
							.to(globe.scene().rotation, {
								y:0,
								duration:1,
							},'scene1')
							.to(globe.scene().position, {
								y:0,
								duration:1,
							},'scene1')
						},
					});
				});

				// 반응형 
				window.addEventListener('resize', () => {
					globeWidth = container.getBoundingClientRect().width;
					globeHeight = container.getBoundingClientRect().height;
					globe.width(globeWidth);
					globe.height(globeHeight);
				});
			})
			.catch(error => {
				console.error('Fetch error:', error);
			});
		}
	},
	recruit: function(){
		var $sec = $(".sec_recruit");

		recruitTimeline = gsap.timeline({
			scrollTrigger: {
				trigger: $sec,
				id: "recruitTrigger",
				scrub: true,
				start: "top 80%",
				end: "bottom 80%",
				onEnter: function(){
					$sec.addClass("active");	
				}
			}
		})
		recruitLink = gsap.timeline({
			scrollTrigger: {
				trigger: $sec.find(".link_area"),
				id: "recruitLinkTrigger",
				scrub: true,
				start: "top 80%",
				end: "bottom 80%",
				onEnter: function(){
					$sec.find(".link_area").addClass("active");	
				}
			}
		})
	},
	init: function(){
		main.utils.mainPopup(".main_popup");
		main.utils.visual();
		main.utils.business();
		main.utils.masterPiece();
		main.utils.recruit();
		main.utils.global();
	}
}
main.utils.init();