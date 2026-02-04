gsap.registerPlugin(ScrollTrigger, DrawSVGPlugin, SplitText, ScrollToPlugin);

var Ssangyong = Ssangyong || {};

var $window = $(window),
	$document = $(document),
	$html = $('html'),
	$body = $('body'),
	$header = $('#header'),
	$footer = $('#footer'),
	$wrap = $('#wrap'),
	$gnbWrap = $header.find(".gnb_wrap"),
	$depth1 = $gnbWrap.find(".depth1"),
	$depth2Wrap = $gnbWrap.find(".depth2_wrap"),
	$menuOpen = $header.find(".menu_open_btn"),
	$menuClose = $header.find(".menu_close_btn"),
    lenis,
    /* touch기능으로 mobile/tablet 판별하여 css에 root var 추가 <-- coarse 터치기기 : fine 웹 */
    windowWidth = window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth,
    isTouchDevice = getComputedStyle(document.documentElement).getPropertyValue("--pointer") == "coarse",
    mediaQuery = window.matchMedia("(min-width: 1025px)");
    tabletMediaQuery = window.matchMedia("(min-width: 768px) and (max-width: 1024px)");
    mobileMediaQuery = window.matchMedia("(max-width: 767px)");
	currentDevice = "";

Ssangyong.utils = {
	/**
	 * Ssangyong.utils.scroll : page scroll plugin
	 **/
	scroll: function () {
		var currentT = 0;

		// scroll 이벤트
		$window.on('scroll', function (e) {
			e.preventDefault();
			var scrollT = $(this).scrollTop();
			
			// scroll상태 체크
			if (scrollT > currentT) {
				$wrap.attr('data-scroll', 'down');
			} else if (scrollT < currentT) {
				$wrap.attr('data-scroll', 'up');
			}

			if(scrollT > 50){
				if ($wrap.attr('data-scroll') === 'down') {
					// $gnbWrap.trigger("mouseleave");
					$header.addClass('active');

				}else{
					$header.removeClass('active');
					$header.addClass('scroll');
				}
			} else{
				$header.removeClass('active');
				$header.removeClass('scroll');
			}

			currentT = scrollT;
		});


		function breakPoint(mediaQuery) {
			if (mediaQuery.matches) {
				if (!lenis) {
					lenis = new Lenis({
						duration: 1,
						// lerp:0.15,
					});
					lenis.on("scroll", ScrollTrigger.update);
					gsap.ticker.add(function (time) {
						lenis.raf(time * 1000);
					});
					gsap.ticker.lagSmoothing(0);

					// 이너 스크롤 바가 없을 때는 속성 삭제
					$("[data-lenis-prevent]").each(function(idx, target){
						if (!(target.scrollHeight > target.clientHeight)) {
							$(target).removeAttr("data-lenis-prevent")
						}
					});
				}
			}
		}

		breakPoint(mediaQuery);
		mediaQuery.addEventListener("change", breakPoint);
	},
	/**
	 * Ssangyong.utils.header : header script
	 **/
	header: function(){
		var webFlag = true;
		var mobileFlag = true;
		var pcEvent, mEvent;

		$(window).on("load resize", function () {
			if(windowWidth > 1024 && !isTouchDevice){
				$wrap.removeClass("header_open");
				$gnbWrap.removeClass("active");
				$depth1.removeClass("active");
				
				clearTimeout(pcEvent);
				pcEvent = setTimeout(function() {
					if(webFlag){
						// clear
						$wrap.removeClass("header_open");
						$gnbWrap.removeClass("active");
						$depth1.removeClass("active");
						$("#wrap:not(.main)").removeClass("intro");

						// event
						$depth1.find("> a").off("click").on("mouseenter focus", function(){
							var headerH = $header.outerHeight();
							var depth2HeightArray = [];

							// 라인 따라다니는 모션이나 gnb의 너비가 벌어짐으로 인하여 좌표가 조금 버벅임
							// var offset = $(this)[0].getBoundingClientRect();
							// var parentOffset = $gnbWrap.find(".inner")[0].getBoundingClientRect();
							// var relativeLeft = offset.left - parentOffset.left;
							
							// gsap.set($gnbWrap,{
							// 	"--getLeft":relativeLeft+"px",
							// 	"--getWidth":offset.width+"px",
							// })
				
							$depth2Wrap.each(function (index, item) {
								var itemHeight = $(item).outerHeight();
				
								if (itemHeight == undefined) {
									depth2HeightArray.push(0);
								} else {
									depth2HeightArray.push(itemHeight);
								}
							});
							var depth2MaxHeight = Math.max.apply(null, depth2HeightArray);
				
							$wrap.addClass("header_open");
							$gnbWrap.addClass("active");
							$gnbWrap.stop().animate({height:headerH + depth2MaxHeight},250, "linear");
							$gnbWrap.find(".gnb").stop().animate({height:headerH + depth2MaxHeight},250, "linear");
						});
						$gnbWrap.off("mouseleave").on("mouseleave", function(){
							var headerH = $header.outerHeight();
				
							$wrap.removeClass("header_open");
							$gnbWrap.removeClass("active");
							$gnbWrap.stop().animate({height: headerH}, 150, "linear", function () {
								$(this).removeAttr('style');
							});
							$gnbWrap.find(".gnb").stop().animate({height: headerH}, 150, "linear", function () {
								$(this).removeAttr('style');
							});
						});

						// 접근성
						$header.find(".dim").on("click", function(){
							$gnbWrap.trigger("mouseleave");
						});
						$depth1.find("> a").on("keydown", function(e) {
							if (e.code === "Tab" && e.shiftKey) {
								if ($(this).parent(".depth1").index() === 0) {
									$gnbWrap.trigger("mouseleave");
								}
							}
						});
						$header.find(".lang_area > button").on("keydown", function(e) {
							if (e.code === "Tab") {
								if (!e.shiftKey) {
									$gnbWrap.trigger("mouseleave");
								}
							}
						});
						$header.find(".lang_area > button").on("keydown", function(e) {
							if (e.code === "Tab" && e.shiftKey) {
								$depth1.find("> a").trigger("mouseenter");
							}
						});
						
						webFlag = false;
						mobileFlag = true;
					}
				},100);

			} else{
				clearTimeout(mEvent);
				mEvent = setTimeout(function() {
					if(mobileFlag){
						// clear
						$wrap.removeClass("header_open");
						$depth1.removeClass("active");
						$gnbWrap.removeClass("active").removeAttr('style');
						$depth1.find("> a").off("keydown");
						$header.find(".banner_area a").off("keydown");
						$header.find(".ss_link").off("keydown");
						$("#wrap:not(.main)").removeClass("intro");
						
						// event
						$header.find(".dim").on("click", function(){
							$menuClose.trigger("click");
						});
						$menuOpen.on("click", function(){
							$wrap.addClass("header_open");
							$gnbWrap.addClass("active");
						});
						$menuClose.on("click", function(){
							$wrap.removeClass("header_open");
							$gnbWrap.removeClass("active");
						});
						$depth1.find("> a").off("mouseenter focus").on("click", function(e){
							e.preventDefault();

							if($(this).parent().hasClass("active")){
								// 열려있을 경우
								$(this).next(".depth2_wrap").stop().slideUp(250, "linear", function () {
									$(this).removeAttr('style');
								});
								$(this).parent().removeClass("active");
							} else{
								// 닫혀있을 경우
								$depth2Wrap.stop().slideUp(300, "linear", function () {
									$(this).removeAttr('style');
									$(this).parents(".depth1").removeClass("on");
								});
								$(this).next(".depth2_wrap").stop().slideDown(250);
								$(this).parent().siblings().removeClass("active");
								$(this).parent().addClass("active");

								// 닫혀있지만 gnbActive로 열려있을 경우http://192.168.100.82:40609/kr/customer/inquiry/faq
								if($(this).parent().hasClass("on")){
									$(this).next(".depth2_wrap").stop().slideUp(250, "linear", function () {
										$(this).removeAttr('style');
										$(this).parent().removeClass("on active");
									});
								} else{

								}
							}
						});
						$gnbWrap.off("mouseleave");
						
						mobileFlag = false;
						webFlag = true;
					}
				},100);
			}
		});
	},
    /**
     * Ssangyong.utils.depthActive : gnb depth 활성화
	 * @param {number} depth1 - depth1 번째
	 * @param {number} depth2 - depth2 번째
	 * @param {number} depth3 - depth3 번째
     **/
	depthActive: function(depth1,depth2,depth3){
		// class는 css에서 웹 모바일 분기를 태우기 위해 header 에 사용하는 active 와 다른 네임(on) 사용

		if(depth1){
			$(".depth1[data-depth='"+depth1+"']").addClass("on");
		}
		if(depth2){
			$(".depth1.on").find(".depth2[data-depth='"+depth2+"']").addClass("on");
		}
		if(depth3){
			$(".depth1.on").find(".depth2.on").find(".depth3[data-depth='"+depth3+"']").addClass("on");
		}
	},
	/**
	 * Ssangyong.utils.lnb : lnb
	 **/
	lnb: function(){
		var $lnb = $(".lnb_wrap");
		var $slide = $lnb.find("ul");

		function breakPoint(mediaQuery) {
			if (mediaQuery.matches) {
				// clear
				$lnb.find(".mobile_btn").off("click");
				$slide.removeAttr('style');
			} else{
				if($lnb.length > 0){
					$lnb.find(".mobile_btn").on("click", function(){
						if($lnb.hasClass("active")){
							$lnb.removeClass("active");
							$slide.stop().slideUp(300, function () {
								$(this).removeAttr('style');
							});
						} else{
							$lnb.addClass("active");
							$slide.stop().slideDown(300);
						}
					});
				}
			}
		}

		breakPoint(mediaQuery);
		mediaQuery.addEventListener("change", breakPoint);
	},
    /**
     * Ssangyong.utils.isMoveStop : 스크롤 멈춤, 재생
	 * @param {boolean} boolean - 정지 true, 시작 false
	 * @param {boolean} overflow - overflow 여부
     **/
    isMoveStop: function (boolean, overflow) {
        if (boolean == true) {
            if (lenis) {
                lenis.stop();
            }
            // body overflow: hidden 일 경우
            if (overflow) {
                $body.addClass("overflow");
            }
        } else {
            if (lenis) {
                lenis.start();
            }
            if (overflow) {
                $body.removeClass("overflow");
            }
        }
    },
	/**
	* Ssangyong.utils.inputEvent : input search 기능 추가
	*/
	inputEvent: function (){
		var $inputArea = $('.input_area');

		if ($inputArea.length > 0) {
			// clean, delete 버튼
			function toggleClearBtn($input) {
				var $btn = $input.closest('.input_area').find('.clear_btn');
				$btn.toggleClass('active', !!$input.val());
			}

			$inputArea.find("input").not("[readonly]").each(function () {
				toggleClearBtn($(this));
			});
			
			$inputArea.find("input").not("[readonly]").on('input', function () {
				toggleClearBtn($(this));
			});

			$inputArea.find(".clear_btn").on('click', function () {
				var $wrap = $(this).closest('.input_area');
				var $input = $wrap.find('input');
				$input.val('').focus();
				toggleClearBtn($input);
			});

			// enter key
			$('.input_area.search').find("input").on("keydown", function(e){
				if(e.code == "Enter" && e.keyCode === 13){
					$(this).closest(".input").find(".search_btn").trigger("click");
				}
			});
		}
	},
	/**
	 * Ssangyong.utils.customSelect : 커스텀 select
	 */
	customSelect: function () {
		var $select = $(".custom_select_area");

		function updateOpenHeight($el) {
			var $parent = $el.closest(".custom_select_area");
			var currentHeight = $el.outerHeight();
			var selectHeight = $parent.find(".select_box").outerHeight();
			var showHeight = currentHeight + selectHeight;
		
			$parent.find(".select").css({"--openHeight": showHeight + "px"});
		}

		// resize 시 재계산
		$(window).on('load resize', function () {
			$select.each(function (idx, el) {
				updateOpenHeight($(el));
			});
		});

		if($select.length > 0){
			$select.each(function (idx, el) {
				var $this = $(el);
				var $parent = $this.closest(".custom_select_area");
				var currentHeight = $this.outerHeight();
				var selectHeight = $parent.find(".select_box").outerHeight();

				updateOpenHeight($this);

				$this.find("ul").attr("tabindex", "-1");
				$this.find("a").attr("tabindex", "-1");

				if (!$parent.hasClass('readonly')) {
					$this.find(".current").on("click", function () {
						var isOpen = $parent.hasClass("active");

						if($(this).closest(".custom_select_area").find("ul").find("li").not(".nodata").length < 1 || !$(this).closest(".custom_select_area").find("ul").find("li").not(".nodata").is(":visible")){
							$(this).closest(".custom_select_area").find("ul").find("li.nodata").show();
						} else{
							$(this).closest(".custom_select_area").find("ul").find("li.nodata").hide();
						}

						updateOpenHeight($this);

						$select.removeClass("active");

						if (!isOpen) {
							$parent.addClass("active");
						}
					});
				}
			});

			$(document).on("click",".custom_select_area ul a", function(){
				var $parent = $(this).closest(".custom_select_area");
				var currentText = $(this).text();
				var idx = $(this).parent().index();

				$parent.find(".current").text(currentText).attr('title', currentText);
				$(this).parent().addClass("active").siblings().not(".nodata").removeClass("active");
				$parent.removeClass("active");
				$parent.find("select").find("option:eq(" + idx + ")").prop("selected", true);
			});

			// 바깥 클릭 시 닫기
			$("body").on("click", function (e) {
				var $target = $(e.target);
				var isCurrent = $target.hasClass("current");
				var isSelectBox = $target.closest("select").length > 0 || $target.closest(".select_box").length > 0;

				if (!isCurrent && !isSelectBox) {
					$select.each(function () {
						var $this = $(this);
						$this.removeClass("active");
					});
				}
			});
		}
	},
	/**
	 * Ssangyong.utils.customFile : custom file
	 */
	customFile:function(){
		var $fileArea = $(".file_area");
		var fileTypes = ['image/gif', 'image/jpeg', 'image/png', 'image/bmp', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', 'application/pdf', 'application/vnd.ms-powerpoint', 'application/vnd.openxmlformats-officedocument.presentationml.presentation', 'application/vnd.ms-excel', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', 'application/zip', 'application/zip', 'application/octet-stream', 'application/x-zip-compressed', 'multipart/x-zip', 'application/x-hwp', 'application/haansofthwp', 'application/vnd.hancom.hwp'];
		var fileLength = 1;

		// 파일 이름 자르기
		function fileName(name, maxLength) {
			if (name.length <= maxLength) return name;
			return name.substring(0, maxLength) + '...';
		}

		if($fileArea.length > 0){
			$(document).on('change', '.attach_file', function () {
				var _this = $(this);
				var _thisInput = _this.closest(".file").find(".input").find("input");
				var val, name, size, type, returnSize;
				if (window.FileReader) {
					var file = $(this)[0].files[0];
					name = file.name;
					size = file.size;
					type = file.type;

					// 파일 형식 유효성
					if ($.inArray(type, fileTypes) === -1) {
						alert("jpg, jpeg, png, doc, ppt, xlsx, xls, hwp, zip 파일만 첨부 가능합니다.");
						_this.val("");
						_thisInput.val("선택된 파일이 없습니다.");
						return;
					}

					// 파일 용량 유효성
					if (size > 5 * 1024 * 1024) {
						alert("최대 5MB까지 업로드 가능합니다.");
						_this.val("");
						_thisInput.val("선택된 파일이 없습니다.");
						return;
					}

					// 용량에 따른 KB, MB 표시
					if (size < 1024 * 1024) {
						var sizeKB = (size / 1024).toFixed(1);
						returnSize = sizeKB + " KB";
					} else {
						var sizeMB = (size / (1024 * 1024)).toFixed(2);
						returnSize = sizeMB + " MB";
					}
				} else {
					name = $(this).val().split("/").pop().split("\\").pop();
				}

				var cutName = fileName(name, 8);
				val = cutName + " ("+returnSize+")";

				_thisInput.val(val);
				_thisInput.closest(".input").find(".delete_btn").addClass("active");
			});

			// 파일첨부 추가
			$(document).on('click','.file_area .btns .add',function(){
				if (fileLength > 2){
					return;
				};
				fileLength++;

				var fileHtml = '';
				fileHtml+= '<div class="file">';
				fileHtml+= '	<div class="input_area">';
				fileHtml+= '		<div class="input">';
				fileHtml+= '			<input type="text" class="file_name" id="write_fileName_'+fileLength+'" name="write_fileName_'+fileLength+'" title="파일첨부명" value="선택된 파일이 없습니다." readonly>';
				fileHtml+= '			<button type="button" class="delete_btn"></button>';
				fileHtml+= '		</div>';
				fileHtml+= '	</div>';
				fileHtml+= '	<div class="file_input">';
				fileHtml+= '		<input type="file" name="write_attachFile_'+fileLength+'" class="attach_file" id="write_attachFile_'+fileLength+'">';
				fileHtml+= '		<label for="write_attachFile_'+fileLength+'" class="btn md">파일선택</label>';
				fileHtml+= '	</div>';
				fileHtml+= '	<div class="btns">';
				fileHtml+= '		<button type="button" class="delete">-</button>';
				fileHtml+= '	</div>';
				fileHtml+= '</div>';
				$fileArea.find(".list").append(fileHtml);
			});

			// 파일첨부 제거
			$(document).on('click','.file_area .btns .delete',function(){
				if (fileLength < 2){
					return;
				};
				fileLength--;
				$(this).closest('.file').remove();
			});
			
			// 파일제거
			$(document).on('click','.file_area .input .delete_btn',function(){
				var _this = $(this);
				var _thisInput = $(this).closest(".file").find(".input").find("input");
				var _thisFile = $(this).closest(".file").find(".file_input").find("input");

				_thisFile.val("");
				_thisInput.val("선택된 파일이 없습니다.");
				_this.removeClass("active");
			});
		}
	},
	/**
	 * Ssangyong.utils.tab : 탭 script
	 */
	tab: function () {
		var $tabArea = $('.tab_container');
		$tabArea.each(function (i, elm) {
			var $list = $(elm).find(".tab_list"), $btnList = $(elm).find(".tab_btn_list"), $contents = $(elm).find(".tab_cont");

			// tab + cont
			$list.find(".tab").each(function (idx, item) {
				$(item).find("a").on("click", function (e) {
					e.preventDefault();
					$(item).attr("title", "선택됨").addClass("active").siblings().attr("title", "").removeClass("active");
					$contents.find(".tabpanel").eq(idx).addClass("active").siblings().removeClass("active");
				});
			});

			// tab btn
			$btnList.find(".tab").each(function (idx, item) {
				$(item).find("a").on("click", function (e) {
					e.preventDefault();
					$(item).attr("title", "선택됨").addClass("active").siblings().attr("title", "").removeClass("active");
				});
			});

		});
	},
	/**
	 * Ssangyong.utils.topBtn - topbtn
	 */
	topBtn: function () {
		$window.on("load", function(){
			var $target = $("#topBtn");

			// 스크롤 탑	
			$target.find(".top").on("click", function () {
				if(lenis){
					lenis.scrollTo(0,600)
				} else{
					$("html, body").animate({scrollTop:0},600);
				}
				return false;
			});

			ScrollTrigger.create({
				trigger: $('body'),
				start: '100px top',
				end: 'top bottom',
				// markers:true,
				endTrigger:$('#footer'),
				onEnter:function(){
					$target.addClass('active');
				},
				onEnterBack:function(){
					$target.removeClass('end');
				},
				onLeaveBack:function(){
					$target.removeClass('active');
				},
				onLeave:function(){
					$target.addClass('end');
				},
				onUpdate:function(self){
					var _degree = self.progress * 100;
					var _progress = Math.floor(_degree);

					gsap.set($target.find(".progress"),{
						drawSVG:_progress+"%",
						ease:"none",
						duration:1,
					})
				},
			});
		});
	},
	/**
     * Ssangyong.utils.horizontalScroll : 가로스크롤
     */
	horizontalScroll: function(target){
		var $this = $(target),
			_this = document.querySelector(target);
			
		$(window).on("load resize", function(){
			$this.each(function(idx, item){
				if(item.clientWidth < item.scrollWidth){
					$(item).addClass("scroll__visible");
		
					// var scrollend;
					$(item).on("scroll", function(e){
						if($(this).scrollLeft() == 0){
							$(this).removeClass("scroll__active");
						} else{
							$(this).addClass("scroll__active");
						}
					});
				} else{
					$(item).removeClass("scroll__visible");
				}
			});
			
		});
	},
	/**
     * Ssangyong.utils.textTickerMotion - 텍스트 ticker
     * @param {jQuery} $target - jquery 선택자
     */
    textTickerMotion: function ($target) {
        $target.each((index, item) => {
            var $thisSec = $(item).closest(".sec");
            var text = $(item).text();
            let tickerHtml = "";

            for (i = 0; i < 2; i++) {
                tickerHtml += "<div class='roller'>";
                tickerHtml += "<span>" + text + "</span><i></i>";
                tickerHtml += "<span>" + text + "</span><i></i>";
                tickerHtml += "<span>" + text + "</span><i></i>";
                tickerHtml += "<span>" + text + "</span><i></i>";
                tickerHtml += "<span>" + text + "</span><i></i>";
                tickerHtml += "</div>";
            }

            $(item).html(tickerHtml);

            var tickerWidth = $(item).find(".roller").width();
            var duration = tickerWidth / 70;

            // section show hide motion control
            ScrollTrigger.create({
                id: "tickerSec_" + $target.closest(".sec").attr("class"),
                trigger: $thisSec,
                // markers:true,
                start: 'top bottom',
                end: 'bottom top',
                onEnter: function () {
                    ticker.play();
                },
                onEnterBack: function () {
                    ticker.play();
                },
                onLeaveBack: function () {
                    ticker.pause();
                },
                onLeave: function () {
                    ticker.pause();
                }
            });
            var ticker = gsap.to($(item).find(".roller"), {
                duration: duration,
                xPercent: -100,
                ease: "none",
                repeat: -1,
                paused: true
            });
        });

    },
    /**
     * Ssangyong.utils.skipNavi - skipNavi
     */
    skipNavi: function () {
        var $target = $("#skipNavi");

        $target.find("a").on("click", function (e) {
			e.preventDefault();
            var thisTarget = $(this).attr("href"),
                targetOffset = $(thisTarget).offset().top;

			if(lenis){
				lenis.scrollTo(targetOffset,100)
			} else{
            	$("html, body").animate({ scrollTop: targetOffset }, 600);
			}
            $(thisTarget).focus();	
        });
    },
    /**
     * Ssangyong.utils.layerEmailPopup - 이메일무단수집거부
     */
	layerEmailPopup:function(){
		var $target = $(".email_popup_btn");
		var $popup = $(".layer_email_popup");
		var $dim = $popup.find(".dim");
		
		$target.on("click", function(){
			$popup.addClass("active");
		});
		$popup.find(".close_btn").on("click", function(){
			$popup.removeClass("active");
		});
		$dim.on("click", function(){
			$popup.find(".close_btn").trigger("click");
		});
	},
    /**
     * Ssangyong.utils.cursor - 마우스 호버 커서 .cursor_wrap 선언
     */
	cursor: function () {
		var $cursorWrap = $(".cursor_wrap");
		var tickerId = null;
		function breakPoint(mediaQuery) {		
			if (mediaQuery.matches) {
				if ($cursorWrap.length > 0) {
					if ($wrap.find(".cursor").length === 0) {
						$wrap.append("<div class='cursor'><span></span></div>");
					}
					var $cursor = $wrap.find(".cursor");
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
						
						// 로딩보다 이벤트 먼저 실행 시 안보이는 이슈
						if($(e.target).closest(".cursor_wrap").length > 0){
							$cursor.addClass("active");
						}
					});
					$cursorWrap.on("mouseenter", function(){
						$cursor.addClass("active");
					});
					$cursorWrap.on("mouseleave", function(){
						$cursor.removeClass("active down");
					});
					$cursorWrap.on("pointerdown", function(){
						$cursor.addClass("down");
					});
					$cursorWrap.on("pointerup", function(){
						$cursor.removeClass("down");
					});
					// 마우스 멈춤 상태 스크롤 시 효과
					$(window).on('scroll', function() {
						if($cursor.hasClass("active")){
							var elem = document.elementFromPoint(mouse.x, mouse.y);
							if (elem) {
								var $closest = $(elem).closest('.cursor_wrap');
								if (!($closest.length)) {
									$cursorWrap.trigger("mouseleave");
								} else{
									$cursorWrap.trigger("mouseenter");
								}
							}
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
					$cursorWrap.data("cursor-active", true);
					$cursorWrap.data("ticker-id", tickerId);
				}
			} else {
				// 커서 제거 및 이벤트 해제
				$window.off("mousemove");
				$cursorWrap.off("mouseenter mouseleave");
		
				if ($cursorWrap.data("cursor-active")) {
					var id = $cursorWrap.data("ticker-id");
					if(id){
						gsap.ticker.remove(id)
					};
					$wrap.find(".cursor").remove();
					$cursorWrap.removeData("cursor-active ticker-id");
				}
			}
		}
		breakPoint(mediaQuery);
		mediaQuery.addEventListener("change", breakPoint);
    },
    /**
     * Ssangyong.utils.subVisual - sub_visual 모션
     */
	subVisual: function(){
		var $subVisual = $(".sub_visual");
		
		if($subVisual.length > 0){
			var $tit = $subVisual.find(".title h2");
			var $p = $subVisual.find(".title").find("p");
			var $span = $subVisual.find(".title").find("span");
			var subVisualTimeline;
			var maskTo;

			function getMaskOffsetRelativeToSection() {
				var _maskWrapPerent = $subVisual.find(".bg_wrap")[0];
				var sectionRect = _maskWrapPerent.getBoundingClientRect();
				var targetRect = $subVisual.find(".bg_trigger")[0].getBoundingClientRect();
				var sectionHeight = _maskWrapPerent.offsetHeight;
				var sectionWidth = _maskWrapPerent.offsetWidth;

				return {
					"--maskT": ((targetRect.top - sectionRect.top) / sectionHeight * 100).toFixed(5) + "%",
					"--maskR": ((sectionRect.right - targetRect.right) / sectionWidth * 100).toFixed(5) + "%",
					"--maskB": ((sectionRect.bottom - targetRect.bottom) / sectionHeight * 100).toFixed(5) + "%",
					"--maskL": ((targetRect.left - sectionRect.left) / sectionWidth * 100).toFixed(5) + "%"
				};
			}

			(function intro(){
				var title = new SplitText($tit, {
					type: 'lines,words',
					linesClass: '-line',
					wordsClass: '-word'
				});
				var p = new SplitText($p, {
					type: 'lines,words',
					linesClass: '-line',
					wordsClass: '-word'
				});

				// js 실행 후 텍스트 활성화
				gsap.set([$tit, $p], { 
					opacity:1,
				});

				gsap.set([$tit.find(".-line"), $p.find(".-line")], { 
					overflow:"hidden",
				});
				gsap.set([$tit.find(".-word"), $p.find(".-word")], { 
					yPercent: 100 
				});

				if($subVisual.hasClass("background")){
					maskTo = gsap.to($subVisual,{
						...getMaskOffsetRelativeToSection(),
						duration:0.9,
					})
				}

				var tl = gsap.timeline({
					onComplete: function(){
						title.revert();
						// p.revert();
						if($span.length > 0){
							span.revert();
						}
					}
				})
				.to($tit.find(".-word"), { 
					yPercent: 0, 
					duration: 1, 
					ease: Quart.easeOut 
				},'scene1')
				$p.find(".-line").each(function(i, line){
					var word = line.querySelectorAll('.-word');
					tl.to(word, { 
						yPercent: 0, 
						duration: 1.6, 
						ease: Quart.easeOut 
					}, i * 0.2 + 0.2);
				});

				if($span.length > 0){
					var span = new SplitText($span, {
						type: 'lines,words',
						linesClass: '-line',
						wordsClass: '-word'
					});

					gsap.set($span, { 
						opacity:1,
					});

					gsap.set($span.find(".-line"), { 
						overflow:"hidden",
					});
					gsap.set($span.find(".-word"), { 
						yPercent: 100 
					});
					
					tl.to($span.find(".-word"), { 
						yPercent: 0, 
						duration: 1, 
						ease: Quart.easeOut 
					},'scene1+=.5')
				}
			})()

			function motion(){
				if($subVisual.hasClass("background")){
					if (subVisualTimeline) {
						subVisualTimeline.scrollTrigger.kill();
						subVisualTimeline.kill();
					}
					gsap.set($subVisual, {
						...getMaskOffsetRelativeToSection(),
						ease: "none"
					});
					subVisualTimeline = gsap.timeline({
						scrollTrigger: {
							trigger: $subVisual,
							id: "subVisualTimeline",
							scrub: true,
							// markers: true,
							start: "top top",
							end: "bottom bottom",
							onUpdate: function(){
								if(maskTo){
									if(maskTo.isActive()){
										maskTo.kill();
										maskTo = null;
									}
								}
							}
						}
					});
					subVisualTimeline.fromTo($subVisual,{
						...getMaskOffsetRelativeToSection(),
						"--opacity":0,
					},{
						"--maskT": "0%",
						"--maskR": "0%",
						"--maskB": "0%",
						"--maskL": "0%",
						"--opacity":1,
						"--y":0,
						force3D: true,
						duration:1,
						ease:"none",
						onStart: function(){
							if($subVisual.find(".bg_wrap").find("video").length > 0){
								$subVisual.find(".bg_wrap").find("video")[0].play();
							}
						},
						onReverseComplete: function(){
							if($subVisual.find(".bg_wrap").find("video").length > 0){
								$subVisual.find(".bg_wrap").find("video")[0].pause();
							}
						}
					},"scene1")

					if($subVisual.find(".breadcrumb_wrap").length > 0){
						subVisualTimeline.to([$subVisual.find(".breadcrumb_wrap li"), $subVisual.find(".breadcrumb_wrap li b")],{
							"--color":"#ccc",
							"--activeColor":"#fff",
							duration:0.3,
							ease: "none"
						},"scene1+=0.7");
					}
					if($subVisual.find(".title").length > 0){
						subVisualTimeline.to([$subVisual.find(".title h2"), $subVisual.find(".title p")],{
							color:"#fff",
							duration:0.4,
							ease: "none"
						},"scene1+=0.4");
					}
					if($subVisual.find(".lnb_wrap").length > 0){
						subVisualTimeline.to($subVisual.find(".lnb_wrap"),{
							"--lineBg1":"#ccc",
							"--lineBg2":"#fff",
							"--color":"#ccc",
							"--activeColor":"#fff",
							duration:0.3,
							ease: "none"
						},"scene1");
					}
				}
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
		}
	},
    /**
     * Ssangyong.utils.tabSearchWrap - btn scroll
     */
	tabSearchWrap: function(){
		var $tabSearchWrap = $(".tab_search_wrap");
		if($tabSearchWrap.find(".tab_area").length > 0){
			Ssangyong.utils.horizontalScroll(".tab_search_wrap .scroll");
			
			$(window).on("load", function(){
				if($tabSearchWrap.find(".scroll").hasClass("scroll__visible")){
					var offsetLeft = $tabSearchWrap.find("li.active").position().left;
					$tabSearchWrap.find(".scroll").animate({scrollLeft: offsetLeft}, 300);
				}
			});
		}
	},
    /**
     * Ssangyong.utils.footer - footer 모션
     */
	footer: function(){
		footerTimeline = gsap.timeline({
			scrollTrigger: {
				trigger: $footer,
				id: "footerTrigger",
				scrub: true,
				// markers: true,
				start: "top bottom",
				end: "bottom bottom",
			}
		})
		.to($footer.find(".footer_inner"),{
			translateY:0,
		})
	},
	/**
     * Ssangyong.utils.dataMotion - 모션 추가 data
     */
    dataMotion: function () {
        if ($("[data-motion]").length > 0) {
            $('[data-motion]').each((idx, item) => {
                ScrollTrigger.create({
                    id: 'dataMotion_' + idx,
                    trigger: $(item),
                    scrub: 0.5,
					start: "top 70%",
					end: "bottom 70%",
                    // markers:true,
                    invalidateOnRefresh: true,
                    onEnter: function(){
						$(item).addClass('active');

						if($(item).hasClass("sec_position")){
							setTimeout(function(){
								$(item).find(".step_wrap").find("i").css({"animation-play-state":"paused"});
							},3000)
						}
					},
                    // onLeaveBack:() => $(item).removeClass('active'),
                })
            });
        }
    },
	/**
     * Ssangyong.utils.boardTypeAccordion - board_list accordion
     */
	boardTypeAccordion: function(){
		if($(".board_list").find(".board_type_accordion").length > 0){
			$(".tbody").find("li").find("a").on("click", function(){
				if($(this).closest("li").hasClass("active")){
					$(this).closest("li").removeClass("active");
					$(this).closest("li").find(".more_area").stop().slideUp(300, function(){
						ScrollTrigger.refresh();
					});
				} else{
					$(".tbody").find("li").removeClass("active");
					$(this).closest("li").addClass("active");

					$(".tbody").find("li").find(".more_area").stop().slideUp(300, function(){
						ScrollTrigger.refresh();
					});
					$(this).closest("li").find(".more_area").stop().slideDown(300, function(){
						ScrollTrigger.refresh();
					});
				}
			});
		}
	},
	/**
     * Ssangyong.utils.boardTypeVideo - board_list video 모션
     */
	boardTypeVideo: function(){
		if($(".board_list").find(".board_type_video").length > 0){
			$(".board_list").find(".board_type_video").find("li").each(function(idx, item){
				ScrollTrigger.create({
					trigger: $(item),
					start: 'top 95%',
					// markers: true,
					onEnter: function(){
						$(item).addClass('active')
					},
					onLeaveBack: function(){
						$(item).removeClass('active')
					}
				});
			});
		}
	},
	/**
     * Ssangyong.utils.boardTypeCard - board_list card 모션
     */
	boardTypeCard: function(){
		if($(".board_list").find(".board_type_card").length > 0){
			$(".board_list").find(".board_type_card").find("li").each(function(idx, item){
				ScrollTrigger.create({
					trigger: $(item),
					start: 'top 95%',
					// markers: true,
					onEnter: function(){
						$(item).addClass('active')
					},
					onLeaveBack: function(){
						$(item).removeClass('active')
					}
				});
			});
		}
	},
	/**
     * Ssangyong.utils.boardBusinessTypeCard - board_list card 모션
     */
	boardBusinessTypeCard: function(){
		if($(".board_list").find(".board_type_business").length > 0){
			$(".board_list").find(".board_type_business").find("li").each(function(idx, item){
				ScrollTrigger.create({
					trigger: $(item),
					start: 'top 95%',
					// markers: true,
					onEnter: function(){
						$(item).addClass('active')
					},
					// onLeaveBack: function(){
					// 	$(item).removeClass('active')
					// }
				});
			});
		}
	},
	/**
     * Ssangyong.utils.layerVideoPopup - 영상 리스트 클릭 시 상세 팝업
     */
	layerVideoPopup:function(){
		var $target = $("[data-video]");
		var $popup = $(".layer_video_popup");
		var $dim = $popup.find(".dim");
		
		$target.on("click", function(){
			var targetUrl = $(this).attr("data-video-url");
			var targetPoster = $(this).attr("data-poster-url")
			var targetTitle = $(this).attr("data-video-title");
			var videoHtml = '';

			videoHtml += '<video controls playsinline autoplay' + (targetPoster ? ' poster="' + targetPoster + '"' : '') + '>';
			videoHtml += '<source src="'+targetUrl+'" type="video/mp4">';
			videoHtml += '</video>';

			$popup.find(".video_area").html(videoHtml);

			if (targetTitle && targetTitle.trim() !== "") {
				$popup.find(".txt_area").show().html("<p>" + targetTitle + "</p>");
			}
			$popup.addClass("active");
		});
		$popup.find(".close_btn").on("click", function(){
			$popup.removeClass("active");

			setTimeout(function(){
				$popup.find(".video_area").html('');
				$popup.find(".txt_area").hide().html('');
			},300);
		});
		$dim.on("click", function(){
			$popup.find(".close_btn").trigger("click");
		});
	},
	/**
     * Ssangyong.utils.showPdf - pdf js
     */
	showPdf: function(pdfPath,fileName){
		 fetch(pdfPath, { method: 'HEAD' })
		.then(response => {
			if (response.ok) {
				var viewerUrl = '/resources/pdfjs/web/viewer.html?file=' + encodeURIComponent(pdfPath);

				if(fileName){
					viewerUrl += "&filename="+encodeURIComponent(fileName);
				}
				window.open(viewerUrl, '_blank');
			} else {
				alert('해당 PDF 파일을 찾을 수 없습니다.');
			}
		})
		.catch(error => {
			console.error('파일 체크 오류:', error);
			alert('PDF를 열 수 없습니다.');
		});
	},
	/**
     * Ssangyong.utils.getCookie - 쿠기값 가져오기
     */
    getCookie: function (cookie_name) {
        var isCookie = false;
        var start, end;
        var i = 0;

        // cookie 문자열 전체를 검색
        while (i <= document.cookie.length) {
            start = i;
            end = start + cookie_name.length;
            // cookie_name과 동일한 문자가 있다면
            if (document.cookie.substring(start, end) == cookie_name) {
                isCookie = true;
                break;
            }
            i++;
        }

        // cookie_name 문자열을 cookie에서 찾았다면
        if (isCookie) {
            start = end + 1;
            end = document.cookie.indexOf(";", start);
            // 마지막 부분이라는 것을 의미(마지막에는 ";"가 없다)
            if (end < start) end = document.cookie.length;
            // cookie_name에 해당하는 value값을 추출하여 리턴한다.
            return document.cookie.substring(start, end);
        }
        // 찾지 못했다면
        return "";
    },
    /**
     * Ssangyong.utils.setCookie - 쿠기값 설정하기
     */
    setCookie: function (name, value, expiredays) {
        var todayDate = new Date();
        todayDate.setDate(todayDate.getDate() + expiredays);
        document.cookie = name + "=" + escape(value) + "; path=/; expires=" + todayDate.toGMTString() + ";";
    },
	/**
	 * Ssangyong.utils.enterkey - 포커스잡기 // 팝업일 경우 팝업내에만 포커스 가능하게
	 */
	enterkey: function ($el) {
		$($el).attr("tabindex", 0).focus();

		$($el).on({
			"keydown": function (e) {
				var focusList = $($el).find('input, a');
				var firstFocus = focusList.eq(0);
				var lastFocus = focusList.eq(focusList.length - 1);

				firstFocus.on({
					'keydown': function (e) {
						if (e.shiftKey && e.keyCode == 9) {
							e.preventDefault();
							$(lastFocus).focus();
						}
					}
				});

				lastFocus.on({
					'keydown': function (e) {
						if (!e.shiftKey && e.keyCode == 9) {
							e.preventDefault();
							$(firstFocus).focus();
						}
					}
				});
			}
		});
	},
	/*
	* Ssangyong.utils.domChange - 브라우저에서 언어 선택 시 길이의 변화가 생기므로 update 함수 선언
	*/
	domChange: function(){
		new ResizeObserver(function(entries) {
		for (const entry of entries) {
			if (entry.target === document.body) {
				requestAnimationFrame(function() {
					ScrollTrigger.update();
					ScrollTrigger.refresh();
				});
			}
		}
		}).observe(document.body);
	},
	/**
	* Ssangyong.utils.debuggerGuide
	*/
   	debuggerGuide: function () {
	   document.addEventListener("keyup", function (e) {
		   // F9
		   if (e.key === "F9") {
			   var $debugger = $("#gridGuide");
			   $debugger.toggleClass("is-active");
		   }
	   });
   	},
	init: function (){
		Ssangyong.utils.scroll();
		Ssangyong.utils.header();
		Ssangyong.utils.lnb();
		Ssangyong.utils.topBtn();
		Ssangyong.utils.inputEvent();
		Ssangyong.utils.customSelect();
		Ssangyong.utils.customFile();
        Ssangyong.utils.skipNavi();
        Ssangyong.utils.layerVideoPopup();
        Ssangyong.utils.layerEmailPopup();
        Ssangyong.utils.cursor();
        Ssangyong.utils.subVisual();
		Ssangyong.utils.footer();
		Ssangyong.utils.dataMotion();
		Ssangyong.utils.tabSearchWrap();
		Ssangyong.utils.domChange();
        // 오픈시 주석
        // Ssangyong.utils.debuggerGuide();
	},
};

$window.on('load resize', function () {
    windowWidth = window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth;
    isTouchDevice = (getComputedStyle(document.documentElement).getPropertyValue("--pointer")) == "coarse";
});

Ssangyong.utils.init();