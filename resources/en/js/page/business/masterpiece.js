/* masterpiece.js */
var Masterpiece = Masterpiece || {};

Masterpiece.utils = {
    index: function () {
		var $indexVisual = $(".index_visual");
		var $indexCont = $(".index_cont");
		var $viewBtn = $(".view_type");
		var $anchor = $indexCont.find(".anchor");
		var $h1 = $indexVisual.find("h1");
		var $p = $indexVisual.find("p");

		function getMaskOffsetRelativeToSection() {
			var _maskWrapPerent = $indexCont[0];
			var sectionRect = _maskWrapPerent.getBoundingClientRect();
			var targetRect = $indexVisual.find(".bg_trigger")[0].getBoundingClientRect();
			var sectionHeight = _maskWrapPerent.offsetHeight;
			var sectionWidth = _maskWrapPerent.offsetWidth;

			return {
				"--maskT": ((targetRect.top - sectionRect.top) / sectionHeight * 100).toFixed(5) + "%",
				"--maskR": ((sectionRect.right - targetRect.right) / sectionWidth * 100).toFixed(5) + "%",
				"--maskB": ((sectionRect.bottom - targetRect.bottom) / sectionHeight * 100).toFixed(5) + "%",
				"--maskL": ((targetRect.left - sectionRect.left) / sectionWidth * 100).toFixed(5) + "%"
			};
		}

		// 리스트, 썸네일 보기 버튼
		var viewSticky = gsap.timeline({
			scrollTrigger: {
				trigger: $viewBtn,
				id: "viewBtnTrriger",
				scrub: true,
				// markers: true,
				start: "top top",
				end: "bottom top",
				onEnter: function(){
					if($indexCont.hasClass("list")){
						$viewBtn.addClass("active");
					}
				},
				onLeaveBack: function(){
					if($indexCont.hasClass("list")){
						$viewBtn.removeClass("active");
					}
				}
			}
		});
		viewSticky.fromTo($viewBtn, {
			"--color":"#1C1C1C",
		},{
			"--color":"#fff",
		});

		$viewBtn.find("a").on("click", function(){
			$(this).parent().addClass("active");
			$(this).parent().siblings().removeClass("active");

			if($(this).parent("li").hasClass("list")){
				$indexCont.addClass("list").removeClass("thumbnail");
			} else{
				$indexCont.addClass("thumbnail").removeClass("list");
				$viewBtn.removeClass("active");
			}
			ScrollTrigger.refresh();
			ScrollTrigger.update();
		});

		// 상단 좌우 마스크 모션
		var h1 = new SplitText($h1, {
			type: 'lines,words',
			linesClass: '-line',
			wordsClass: '-word'
		});
		var p = new SplitText($p, {
			type: 'lines,words',
			linesClass: '-line',
			wordsClass: '-word'
		});
		gsap.set($indexCont, {
			...getMaskOffsetRelativeToSection(),
			ease: "none"
		});
		gsap.set([$h1, $p], { 
			opacity:1,
		});
		gsap.set([$h1.find(".-line"), $p.find(".-line")], { 
			overflow:"hidden",
		});
		gsap.set($h1.find(".-word"), { 
			yPercent: 100 
		});
		gsap.set($p.find(".-word"), {
			yPercent: 100 
		});

		var tl = gsap.timeline({
			onComplete: function(){
				h1.revert();
				p.revert();
			}
		})
		.to($h1.find(".-word"), { 
			yPercent: 0, 
			duration: 1, 
			ease: Quart.easeOut 
		});
		$p.find(".-line").each(function(i, line){
			var word = line.querySelectorAll('.-word');
			tl.to(word, { 
				yPercent: 0, 
				duration: 1.6, 
				ease: Quart.easeOut 
			}, i * 0.2 + 0.2);
		});
			
		var indexVisual = gsap.timeline({
			scrollTrigger: {
				trigger: $indexVisual,
				id: "indexVisualTimeline",
				scrub: true,
				// markers: true,
				start: "top top",
				end: "bottom top"
			}
		});
		indexVisual.fromTo($indexCont,{
			...getMaskOffsetRelativeToSection(),
			"--opacity":0,
		},{
			"--maskT": "0%",
			"--maskR": "0%",
			"--maskB": "0%",
			"--maskL": "0%",
			"--opacity":1,
			duration:1,
			ease:"none",
			onComplete:function(){
				if (!$indexCont.hasClass("active")){
					$indexCont.addClass("active");
					$indexCont.find(".cont1").addClass("active");
				}
			},
			onUpdate: function() {
				if ($indexCont.hasClass("active")){
					$indexCont.removeClass("active");
					$indexCont.find(".cont1").removeClass("active");
				}
			}
		});

		// indexCont 마스크 모션
		var indexCont = gsap.timeline({
			scrollTrigger: {
				trigger: $indexCont,
				id: "indexContTimeline",
				scrub: true,
				// markers: true,
				start: "top top",
				end: "bottom bottom"
			}
		});

		$indexCont.find(".cont").not(":nth-of-type(1)").each((index, item) => {
			var itemIndex = index + 1;
			var label = "scene" + (itemIndex) + "-1";
			var nextLabel = "scene" + (itemIndex) + "-2";

			indexCont.addLabel(label)
			.to($indexCont.find(".blank"), {
				opacity: 1,
				duration: 0.5,
				ease: "none",
			}, label)
			.fromTo($(item), {
				"--clip": '100% 0% 0% 0%',
			}, {
				"--clip": '0% 0% 0% 0%',
				duration: 1,
				ease: "none",
				onComplete: function(){
					$(item).addClass("active");
					$anchor.find("li").removeClass("active").eq(itemIndex).addClass("active");
				
				},
				onReverseComplete: function(){
					$(item).removeClass("active");
					$anchor.find("li").removeClass("active").eq(itemIndex - 1).addClass("active");
				},
			}, nextLabel);

			if(itemIndex == $indexCont.find(".cont").not(":nth-of-type(1)").length){
				var finalLabel = "scene" + (itemIndex+1) + "-1";
				indexCont.addLabel(finalLabel);
				indexCont.to($indexCont.find(".blank"), {
					opacity: 0,
					duration: 1,
					ease: "none",
				}, finalLabel);
			}
		});
		
		
		$anchor.find("button").on("click", function(e){
			var _this = $(e.currentTarget);
			var targetIndex = _this.data("index");
			var targetLabel = "scene" + targetIndex + "-1";

			gsap.to(window, {
				scrollTo:  labelToScroll(indexCont, targetLabel), 
				duration: 0.5,
				ease:"none",
			});
		});
		
		function labelToScroll(timeline, label) {
			let st = timeline.scrollTrigger;
			return st.start + (st.end - st.start) * (timeline.labels[label] / timeline.duration()) + 2;
		}
	},
    init: function () {
    }
}

Masterpiece.utils.init();