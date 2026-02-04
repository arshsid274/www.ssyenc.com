/* group.js */
var Group = Group || {};

Group.utils = {
    sec01: function() {
		var $sec = $(".sec01");
		var $txt1 = $sec.find(".step1");
		var oneMotion;
		
		var introTimeline = gsap.timeline({
			scrollTrigger: {
				trigger: $sec.find(".blank"),
				id: "sec01introTimeline",
				scrub: true,
				// markers: true,
				start: "top center",
				end: "top top",
			}
		});
		introTimeline.to($txt1.find("b"),{
			width:"100%",
			duration:1,
			stagger:1,
			onComplete:function(){
				if (!$sec.find(".bg_wrap").hasClass("active")){
					$sec.find(".bg_wrap").addClass("active");
					$sec.find(".step1").addClass("active");
				}
			},
			onUpdate: function() {
				if ($sec.find(".bg_wrap").hasClass("active")){
					$sec.find(".bg_wrap").removeClass("active");
					$sec.find(".step1").removeClass("active");
				}
			}
		})

		var motionTimeline = gsap.timeline({
			scrollTrigger: {
				trigger: $sec,
				id: "sec01motionTimeline",
				scrub: true,
				// markers: true,
				start: "top top",
				end: "bottom bottom",
			}
		});
		motionTimeline.to($sec,{
			duration:0.5,
		}).fromTo($txt1,{
			x:"0",
			autoAlpha:1,
		},{
			x:"-100%",
			autoAlpha:0,
			duration:0.3,
		},"scene1")
		.fromTo($sec,{
			"--progress":"50%",
			duration:1,
		},{
			"--progress":"0%",
			onComplete:function(){
				if (!$sec.hasClass("active")){
					$sec.addClass("active");
				}
			},
			onUpdate: function() {
				if ($sec.hasClass("active")){
					$sec.removeClass("active");
				}
			}
		},"scene1")
		.to($sec,{
			duration:0.3
		},"scene-blank")
	},
	sec02: function(){
		var $sec = $(".sec02");
		var lottieArray = new Array();

		$sec.find(".icon_area").find("li").each(function(idx,target){
			var lottieA = lottie.loadAnimation({
				container: document.getElementById('lottie'+(idx+1)),
				path: "/resources/kr/images/company/group/sec02_icon"+(idx+1)+".json",
				renderer: "svg",
				loop: false,
				autoplay: false,
			});
			lottieA.setSpeed(1.5);
			lottieArray.push(lottieA)
		});

		ScrollTrigger.create({
			id: 'sec03Lottie',
			trigger: $sec.find(".icon_area"),
			scrub: 0.5,
			start: "top 70%",
			end: "bottom 70%",
			// markers:true,
			invalidateOnRefresh: true,
			onEnter: function(){
				lottieArray.forEach(function(target, idx){
					setTimeout(function(){
						target.play();
					},700)
				})
			}
		})

		var MotionEvent,
            endVal;

		function titTriggerResize(){

			clearTimeout(MotionEvent);
			MotionEvent = setTimeout(function(){
				ScrollTrigger.matchMedia({
					"(min-width: 1025px)": function () {
						
						ScrollTrigger.getAll().forEach(st => {
							if(st.vars.id == 'titSticky'){
								st.kill();
							}
						});

						endVal = Number($sec.find(".box:last-child").css('padding-top').split('px')[0] / 5);

						// left title sticky
						var myTrigger = ScrollTrigger.create({
							id:'titSticky',
							trigger: $sec.find(".left"),
							pin:true,
							start: 'top top',
							invalidateOnRefresh: true,
							endTrigger:$sec.find(".box:last-child"),
							end: 'top '+ endVal+'px',
							// markers:true,
						});
					}
				})
			},100);
		};

		$(window).on("load resize", function(){
			setTimeout(function(){
				if(windowWidth > 1024 && !isTouchDevice){
					titTriggerResize();
				} 
			},10)
		});

	},
	sec03: function(){
		var $sec = $(".sec03");
		var $circleWrap = $sec.find(".circle_wrap");
		var $circle = $circleWrap.find("circle");
		var $dots = $circleWrap.find(".dot");
		var $progress = $sec.find(".progress");

		Ssangyong.utils.textTickerMotion($sec.find(".ticker"));

		var introTimeline = gsap.timeline({
			scrollTrigger:{
				trigger:$sec.find(".blank"),
				// markers:true,
				scrub:0,
				start:"top top",
				end:"bottom bottom"
			}
		})
		.to($sec,{
			onComplete:function(){
				if (!$sec.hasClass("active")){
					$sec.addClass("active");
				}
			},
			onUpdate: function() {
				if ($sec.hasClass("active")){
					$sec.removeClass("active");
				}
			}
		})

		var motionTimeline = gsap.timeline({
			scrollTrigger:{
				trigger:$sec,
				// markers:true,
				scrub:true,
				start:"top top",
				end:"bottom bottom"
			}
		})
		$sec.find(".cont").each(function(idx,target){
			var $this = $(target);

			if(!$this.hasClass("cont1")){
				motionTimeline.to($this,{
					duration:1,
					ease:"none",
					onComplete:function(){
						if (!$this.hasClass("active")){
							$this.addClass("active");
							$this.prev().addClass("active_end");

							gsap.to($circle,{
								drawSVG:(25*idx)+"%",
								duration:0.5,
								onStart: function(){
									// 연혁 1번 start
									if(idx == 1){
										$dots.find("i").eq(idx-1).addClass("active");
										$sec.find(".progress").addClass("active");
									}
								},
								onComplete: function(){
									$dots.find("i").eq(idx).addClass("active");
								}
							})
							gsap.to($progress.find(".drag"),{
								height:(25*idx)+"%",
								duration:0.5,
								onStart: function(){
									$progress.find(".current").text("0"+idx);
								},
							})

							if(idx == 1){
								$sec.addClass("active_end");
							}

							// mobile dot
							$sec.find(".progress").find(".mobile").find("li").removeClass("active").eq(idx).addClass("active");
						}
					},
					onUpdate: function() {
						if ($this.hasClass("active")){
							$this.removeClass("active");
							$this.prev().removeClass("active_end");

							gsap.to($circle,{
								drawSVG:25*(idx-1)+"%",
								duration:0.5,
								onStart: function(){
									$dots.find("i").eq(idx).removeClass("active");
								},
								onComplete: function(){
									if(idx == 1){
										$dots.find("i").eq(idx-1).removeClass("active");
									}
								},
							})
							gsap.to($progress.find(".drag"),{
								height:25*(idx-1)+"%",
								duration:0.5,
								onStart: function(){
									$progress.find(".current").text("0"+(idx-1));
								},
							})

							// 연혁 1번 end
							if(idx == 1){
								$sec.removeClass("active_end");
								$sec.find(".progress").removeClass("active");
							}
							
							// mobile dot
							$sec.find(".progress").find(".mobile").find("li").removeClass("active").eq(idx-1).addClass("active");
						}
					}
				})
				.to($this,{
					duration:1,
					ease:"none",
				})
			}
		});
	},
	sec04: function(){
		var $sec = $(".sec04");
		var $videoView = $sec.find(".video_area");
		var iframe = document.createElement("div");
		iframe.id = "youtube-video";

		$videoView.find(".video").empty().append(iframe);
		
		function onPlayerReady(event){
			$videoView.find(".bg").on("click", function(){
				$(this).addClass("active");
				event.target.playVideo();
			})
		}

		$(window).on("load", function(){
			var player = new YT.Player('youtube-video', {
				videoId: "FuBbt-njqRg",
				playerVars: {
					rel: 0 
				},
				events: {
					"onReady" : onPlayerReady,
				}
			});
		});
	},
	sec05: function(){
		$sec = $(".sec05");

		var bgAttachment = gsap.timeline({
			scrollTrigger:{
				trigger:$sec,
				// markers:true,
				scrub:0,
				start:"top bottom",
				end:"bottom top"
			}
		})
		.fromTo($sec,{
			"--bgAttachment":"0",
		},{
			"--bgAttachment":"100%",
			ease:"none"
		})
	},
	groupPopup: function(){
		$popup = $(".group_layer_popup");

		$("[data-group-popup]").on("click", function(e){
			var title, desc, img, year;

			if($(e.target).closest(".sec").hasClass("sec02")){
				title = $(this).find(".title").html();
				desc = $(this).find(".desc").html();
				img = $(this).find("img").attr("src");
				year = "";
				$popup.find("span").hide();
			} else{
				title = $(this).closest(".cont").find(".txt").find("strong").html();
				desc = $(this).closest(".cont").find(".txt").find("p").html();
				img = $(this).closest(".cont").find(".bg").find("img").attr("src");
				year = $(this).closest(".cont").find(".year_txt.left").find("p").html() + "-" + $(this).closest(".cont").find(".year_txt.right").find("p").html();

				if($(this).closest(".cont").find(".year_txt.left").find("p").html()){
					$popup.find("span").html(year);
					$popup.find("span").show();
				} else{
					$popup.find("span").hide();
				}
			}
			$popup.find("img").attr("src",img);
			$popup.find("strong").html(title);
			$popup.find("p").html(desc);
			$popup.addClass("active");
		});

		$popup.find(".close_btn").on("click", function(){
			$popup.removeClass("active");
			
			setTimeout(function(){
				$popup.find("img").attr("src","");
				$popup.find("strong").html("");
				$popup.find("p").html("");
			},400);
		});
	},
	init: function(){
		Group.utils.sec01();
		Group.utils.sec02();
		Group.utils.sec03();
		Group.utils.sec04();
		Group.utils.sec05();
		Group.utils.groupPopup();
	}
}
Group.utils.init();