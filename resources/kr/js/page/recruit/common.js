/* recruit common.js */
var recruit = recruit || {};

recruit.utils = {
    secBanner: function () {
		var $sec = $(".sec_banner");

		var secBanner = gsap.timeline({
			scrollTrigger: {
				trigger: $sec,
				id: "secBannerTimeline",
        		scrub: 1,
				// markers: true,
				start: "top top",
				end: "bottom bottom",
			}
		});

		// section two_wrap 내에 offset 구하고 % 변환
		function getMaskOffsetRelativeToSection() {
			var _maskWrapPerent = $sec.find(".sticky")[0];
			var sectionRect = _maskWrapPerent.getBoundingClientRect();
			var targetRect = $sec.find(".center_blank")[0].getBoundingClientRect();
			var sectionHeight = _maskWrapPerent.offsetHeight;
			var sectionWidth = _maskWrapPerent.offsetWidth;

			return {
				"--sectionMaskT": ((targetRect.top - sectionRect.top) / sectionHeight * 100).toFixed(5) + "%",
				"--sectionMaskR": ((sectionRect.right - targetRect.right) / sectionWidth * 100).toFixed(5) + "%",
				"--sectionMaskB": ((sectionRect.bottom - targetRect.bottom) / sectionHeight * 100).toFixed(5) + "%",
				"--sectionMaskL": ((targetRect.left - sectionRect.left) / sectionWidth * 100).toFixed(5) + "%"
			};
		}

		gsap.set($sec.find("li"),{
			opacity:1
		});
		gsap.fromTo($sec.find("li").not(".img-center").find("img"),{
			y:"100%",
		},{
			y:"0%",
			duration:1,
		})

		secBanner.from($sec.find("li.img-center"), {
			y: "100%",
			duration:1,
		},"scene1")
		.from($sec.find("li").not(".img-center"), {
			y: "150%",
			duration:2.5,
		},"scene2-=1")
		.fromTo($sec, {
			...getMaskOffsetRelativeToSection(),
			"--dimOpacity": "0",
		}, {
			"--sectionMaskT": "0%",
			"--sectionMaskR": "0%",
			"--sectionMaskB": "0%",
			"--sectionMaskL": "0%",
			"--dimOpacity": "1",
			scale:1,
			duration:1,
		},"scene2")
		.to($sec.find("li.img-center").find("img"), {
			scale:1,
			duration:1,
		},"scene2")
		.to($sec.find(".text").find("p"), {
			color:"#fff",
			duration:0.5,
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
		},"scene2")
		.to($sec, {
			duration:0.5,
		},"scene2-blank")
	},
	secTalent: function(){
		var $sec = $(".sec_talent");
		var bxSlider;
		var webOption = {
			minSlides: 5,
			maxSlides: 5,
			slideWidth: "auto",
			slideMargin: "auto",
			infiniteLoop:true,
			ticker: true,
			tickerHover:true,
			speed: 20000
		}
		var mOption = {
			minSlides: 5,
			maxSlides: 5,
			slideWidth: "auto",
			slideMargin: "auto",
			infiniteLoop:true,
			ticker: true,
			tickerHover:false,
			speed: 20000
		}

		 ScrollTrigger.matchMedia({
            "(min-width: 1025px)": function () {
				if (bxSlider) bxSlider.destroySlider();
                bxSlider = $sec.find(".slider_wrap").find('.bxslider').bxSlider(webOption);
            },
			"(max-width: 1024px)": function(){
				if (bxSlider) bxSlider.destroySlider();
                bxSlider = $sec.find(".slider_wrap").find('.bxslider').bxSlider(mOption);
			}
        })
	},
	bannerWrap: function(){
		var $bannerWrap = $(".banner_wrap");

		$bannerWrap.each(function(){
			bgAttachment = gsap.timeline({
				scrollTrigger:{
					trigger:$(this),
					// markers:true,
					scrub:0,
					start:"top bottom",
					end:"bottom top"
				}
			})
			.fromTo($(this),{
				"--bgAttachment":"0",
			},{
				"--bgAttachment":"100%",
				ease:"none"
			})
		});
	},
    init: function () {
    }
}

recruit.utils.init();