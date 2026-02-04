/* projectMap.js */
var projectMap = projectMap || {};

projectMap.utils = {
	scrollBar: function(){
		$(".sec_project").find("[data-scroll]").each(function(idx, target){
			var axis = $(target).data("scroll");
			
			$(target).mCustomScrollbar({
				theme: "minimal-dark",
				axis: axis,
				scrollInertia: 400,
				moveDragger: true,
				mouseWheel: {
					enable: true,
					deltaFactor: 50
				},
				advanced: {
					updateOnBrowserResize: true,
					updateOnContentResize: true,
					autoExpandHorizontalScroll: true
				},
			})
			// 스크롤 offset 이동
			if(axis == 'x'){
				if($(target).find(".active").length > 0){
					$(target).scrollLeft($(target).find(".active").position().left);
				}
			}
		});
	},
    project: function () {
		fetch('/kr/main/businessData')
		.then(response => {
			if (!response.ok) {
				throw new Error('Network response was not ok');
			}
			return response.json();
		})
		.then(data => {
			var $section = $(".sec_project");
			var $container = $section.find('#globe');
			var $title = $section.find(".title");
			var $menuArea = $section.find(".menu_area");
			var $startBtn = $title.find(".start_btn");

			var overseaData = data.projectMap[0];
			var overseasCountryList = [];
			$.each(overseaData.country, function(i, item){
				overseasCountryList.push(item);
			});
			var overseasCountryListHtml = [];
			var $overseasWrap = $section.find(".overseas_wrap");
			var $overseasCountryListDom = $overseasWrap.find(".country_list");
			var $overseasitemListDom = $overseasWrap.find(".item_list");
			var clickAble = false;
			var menuAreaFlag = true;

			var domesticData = data.projectMap[1];
			// var domesticRegionList = domesticData.region;
			var domesticRegionList = [];
			$.each(domesticData.region, function(i, item){
				domesticRegionList.push(item);
			});
			var domesticRegionListHtml = [];
			var $domesticWrap = $section.find(".domestic_wrap");
			var $domesticRegionListDom = $domesticWrap.find(".region_list");
			var $domesticitemListDom = $domesticWrap.find(".item_list");

			var globe = new Globe($container[0],{
				animateIn:false,
			});
			var map = $("#map");

			var maxDistance = 300; // 최대 값
			var minDistance = 200; // 최소 값

			var globeWidth = $container[0].getBoundingClientRect().width;
			var globeHeight = $container[0].getBoundingClientRect().height;

			// 지구 값 set
			// 줌 휠 막기
			globe.controls().enableZoom = false;
			
			// 사이즈
			globe.controls().minDistance = minDistance;
			globe.controls().maxDistance = maxDistance; 

			// globe 이미지 생성
			globe.globeImageUrl('/resources/kr/images/main/globe/globe.jpg');

			// 시작지점
			globe.pointOfView({
				lat:16.091280,
				lng:127.929509,
				altitude:2,
			});
			
			globe.width(globeWidth);
			globe.height(globeHeight);
			globe.backgroundColor('rgba(255,255,255,0)');

			// 자동 회전 여부
			globe.controls().autoRotate = true;
			// 음수, 양수에 따라 방향 전환
			globe.controls().autoRotateSpeed = -1;

			// 지구 주변 그라디언트rgba(36, 69, 127, 0.80) 
			globe.atmosphereColor(0xFFFFFF);
			globe.atmosphereAltitude(0.1);
		
			//// globe ready
			globe.onGlobeReady(()=>{
				//// set globe
				gsap.set($container.find(".scene-container"),{y:"100%"})
				gsap.set(globe.scene().scale,{x:2, y:2, z:2});
				gsap.set(globe.scene().position, {y:-100});
				gsap.set(globe.scene().rotation, {y:-10});

				// start
				// 돌려줘야 좌표가 html 마커상에 생성됨 (그래야 이벤트 바인딩 가능)
				gsap.to(globe.scene().rotation,{
					y:0,
					duration:1.5,
					ease: Quart.easeOut 
				});
				gsap.to($container.find(".scene-container"),{
					y:"50%",
					duration:1,
					ease: Quart.easeOut 
				});

				//// start text
				var $strong = $title.find("strong");
				var $p = $title.find("p");
				var $btn = $title.find("a");

				// SplitText 설정
				var strongMotion = new SplitText($strong, {
					type: 'lines,words',
					linesClass: '-line',
					wordsClass: '-word'
				});
				var pMotion = new SplitText($p, {
					type: 'lines,words',
					linesClass: '-line',
					wordsClass: '-word'
				});

				// 텍스트 초기 상태 세팅
				gsap.set([$strong, $p], {opacity:1});
				gsap.set([$strong.find(".-line"), $p.find(".-line")], {overflow:"hidden"});
				gsap.set($strong.find(".-word"), {yPercent: 100});
				gsap.set($p.find(".-word"), {yPercent: 100});
				gsap.set($btn,{opacity:0, yPercent:50});

				// 타임라인 생성
				var tl = gsap.timeline({
					onComplete: function(){
						strongMotion.revert();
						pMotion.revert();
					}
				})
				.to($strong.find(".-word"), { 
					yPercent: 0, 
					duration: 1, 
					ease: Quart.easeOut 
				},"scene1")
				.to($btn, { 
					yPercent: 0, 
					duration: 1, 
					opacity:1,
					ease: Quart.easeOut 
				},"scene1");
				$p.find(".-line").each(function(i, line){
					var word = $(line).find('.-word');
					tl.to(word, { 
						yPercent: 0, 
						duration: 1.6, 
						ease: Quart.easeOut 
					}, i * 0.2);
				});
				
				overseas();
				domestic();
				projectMap.utils.scrollBar();

				// 반응형 
				window.addEventListener('resize', () => {
					globeWidth = $container[0].getBoundingClientRect().width;
					globeHeight = $container[0].getBoundingClientRect().height;
					globe.width(globeWidth);
					globe.height(globeHeight);
				});
			});

			// 회전 멈춤, 재생
			function rotateState(boolean){
				globe.controls().autoRotate = boolean;
			};

			//// start button
			$startBtn.on("click", function(e){
				// class active
				$(this).closest(".title").addClass("active");
				$menuArea.addClass("active");
				$overseasWrap.addClass("active");
				$overseasWrap.find(".list_area").addClass("active");

				// remove
				setTimeout(function (){
					$(".title").remove();
					clickAble = true;
				},700);
				// spot show
				
				// globe move
				gsap.to($container.find(".scene-container"),{
					x:"-20%",
					y:"5%",
					duration:1.4,
					ease:"expo.out"
				})
				gsap.to(globe.scene().scale,{
					x:1,
					y:1,
					z:1,
					duration:1.4,
					ease:"expo.out"
				});
				gsap.to(globe.scene().position, {
					y:0,
					duration:1.4,
					ease:"expo.out"
				});
			});

			//// 좌측 menu click
			$menuArea.find("a.btn").on("click", function(){
				// 연속 클릭 방지
				if(menuAreaFlag){
					menuAreaFlag = false;
					$(this).addClass("active");
					$(this).siblings().not(".list_btn").removeClass("active");

					if($(this).hasClass("overseas_btn")){
						//// 해외 프로젝트 클릭

						// 전체 버튼이 클릭되어 있는지 여부에 따라 초기화
						if(!$domesticRegionListDom.find("li.all").hasClass("active")){
							$domesticRegionListDom.find("li.all").find("a").trigger("click");
						}

						$domesticWrap.addClass("hidden");
						$domesticWrap.find(".list_area").removeClass("active");

						setTimeout(function(){
							// container 위치 이동
							gsap.to($container.find(".scene-container"),{
								y:"5%",
								duration:0.2,
								ease:"expo.out"
							})

							// globe 축소
							gsap.to(globe.scene().scale,{
								x:1,
								y:1,
								z:1,
								duration:1,
								ease:"expo.out"
							});

							// globe 정지
							rotateState(true);
							
							$overseasWrap.removeClass("hidden");
							$overseasWrap.find(".list_area").addClass("active");

							setTimeout(function(){
								menuAreaFlag = true;
							},1000)
						},1000)

					} else{
						//// 국내 프로젝트 클릭

						// 전체 버튼이 클릭되어 있는지 여부에 따라 초기화
						if($overseasCountryListDom.find("li.all").hasClass("active")){
							// 클릭되어 있다면 대한민국 좌표만 이동
							globe.pointOfView({
								lat:37.565327,
								lng:126.875291,
								altitude:2,
							},1000);
						} else{
							// 그렇지 않다면 전체버튼 클릭(전체버튼에 대한민국 좌표이동 포함)
							$overseasCountryListDom.find("li.all").find("a").trigger("click");
						}

						// globe 정지
						rotateState(false);

						setTimeout(function(){
							// container 위치 이동
							gsap.to($container.find(".scene-container"),{
								y:"0",
								duration:0.2,
								ease:"expo.out"
							})
							// globe 확대
							gsap.to(globe.scene().scale,{
								x:2,
								y:2,
								z:2,
								duration:1,
								ease:"expo.out"
							});

							$overseasWrap.addClass("hidden");
							$overseasWrap.find(".list_area").removeClass("active");

							setTimeout(function(){
								$domesticWrap.removeClass("hidden");
								$domesticWrap.find(".list_area").addClass("active");

								menuAreaFlag = true;
							},1000)
						},1000)
					}
				}
			});

			//// 해외 section
			function overseas(){
				// 지구 생성
				globe.htmlElementsData(overseasCountryList)
				.htmlElement(c => globeView(c));

				// 국가 리스트 생성
				overseasCountryList.forEach(function(item, i){
					var html = '';
					html += '<li>';
					html += '	<a href="javascript:void(0);" data-number="'+item.number+'">'+item.krName+'</a>'
					html += '</li>';

					overseasCountryListHtml.push(html);
				});

				$overseasCountryListDom.append(overseasCountryListHtml.join(''));

				// 국가 리스트 클릭
				$(document).on("click", ".overseas_wrap .country_list a", function(){
					// 좌표 찍히고 나서 클릭할 수 있게
					if(clickAble){
						if(!$(this).parent().hasClass("active")){
							// 상단 리스트 가로 스크롤
							$(this).parents(".scroll").mCustomScrollbar('scrollTo', $(this).parent().position().left);	
													
							// 하단 리스트 세로 스크롤 맨위로
							$(this).closest(".list_area").find(".bot").find(".list").find(".scroll").scrollTop(0)

							// country_area remove
							$(".country_area[data-number]").removeClass("active");

							if($(this).parent().hasClass("all")){
								// 전체
								renderAllList();
							} else{
								// 국가
								var number = $(this).data("number");
								var selectedItem = overseasCountryList.find(function(item) {
									return item.number == number;
								});

								var enName = selectedItem.enName;
								var flag = selectedItem.flag;

								listTitle(enName + '<img src="' + flag + '" alt="">');

								if (selectedItem && selectedItem.list && selectedItem.list.length > 0) {
									// 초기화
									$overseasitemListDom.html("");

									// 생성
									listLength(selectedItem.list.length);
									renderCountryList(selectedItem, $overseasitemListDom);
								} else {
									$overseasitemListDom.html('<p>해당 국가의 프로젝트가 없습니다.</p>');
								}

								// globe 회전 멈춤
								rotateState(false);

								//country_area active
								$(".country_area[data-number="+number+"]").addClass("active");

								// 클릭 좌표 이동
								globe.pointOfView({
									lat:selectedItem.lat,
									lng:selectedItem.lng,
									altitude:1.5,
								},1000);

							}

							$(this).parent().addClass("active").siblings().removeClass("active");
						}
					}
				});

				// 아이템 클릭
				$(document).on("click", ".overseas_wrap .item_list .more_btn", function(){
					var number = $(this).parents(".box").data("number");
					var $getCountry = $(".country_area[data-number="+number+"]");
					var lat = $getCountry.data("lat");
					var lng = $getCountry.data("lng");

					$(this).parents(".box").addClass("active");
					$(this).parents(".box").siblings().removeClass("active");

					$(this).closest(".item_list").find(".desc").hide();
					$(this).closest(".item_list").find(".btn_wrap").hide();

					$(this).parents(".box").find(".desc").stop().show();
					$(this).parents(".box").find(".btn_wrap").stop().show();

					$(".country_area[data-number]").removeClass("active");
					$getCountry.addClass("active");

					// 클릭 리스트 스크롤 이동
					$(this).closest(".scroll").animate({"scrollTop":$(this).closest(".scroll").scrollTop() + $(this).parent().position().top},300);

					// 지구 크기 조정
					if($overseasCountryListDom.find("li.all").hasClass("active")){
						globe.pointOfView({
							lat:lat,
							lng:lng,
							altitude:2,
						},600);
					}
				});

				// 나라 좌표 찍기
				function globeView(data){
					const el = document.createElement('div');
					let innerHtml;

					innerHtml = `
						<div class="country_area" data-number="${data.number}" data-lat="${data.lat}" data-lng="${data.lng}">
							<p>${data.krName}</p>
							<i><img src="/resources/kr/images/main/globe/spot.png" alt=""></i>
						</div>
					`;
					
					el.innerHTML = innerHtml;
					el.style.transition = '0.05s';
					el.style['pointer-events'] = 'auto';
					el.style.cursor = 'pointer';

					el.querySelectorAll(".country_area")[0].addEventListener("mouseenter",(e) => {
						el.querySelector(".country_area").classList.add("hover");
					});
					el.addEventListener("mouseleave",(e) => {
						el.querySelector(".country_area").classList.remove("hover");
					});
					el.onclick = (e) => {
						// 회전 정지
						var number = $(e.target).closest(".country_area").data("number");
						$overseasCountryListDom.find("a[data-number="+number+"]").trigger("click");
					};
					return el;
				}				

				// 전체 클릭
				function renderAllList() {
					var mergedLength = 0;

					listTitle("Main Project");
					// 초기화
					$overseasitemListDom.html("");

					overseasCountryList.forEach(function (item) {
						if (Array.isArray(item.list) && item.list.length > 0) {
							mergedLength += item.list.length;
							renderCountryList(item, $overseasitemListDom);
						}
					});

					if (mergedLength > 0) {
						listLength(mergedLength);
					} else {
						$overseasitemListDom.html('<p>등록된 프로젝트가 없습니다.</p>');
					}

					// globe 회전 재생
					rotateState(true);
					
					// 클릭 좌표 이동
					globe.pointOfView({
						lat:37.565327,
						lng:126.875291,
						altitude:2,
					},1000);
				}
				
				// 국가별 아이템 불러오기
				function renderCountryList(countryItem, $targetContainer) {
					var htmlList = [];

					countryItem.list.forEach(function (item) {
						var tagHtml = '';

						if(item.tag){
							item.tag.forEach(function (tag) {
								var cls = (tag.type === "2") ? ' class="type2"' : '';
								tagHtml += '<li' + cls + '>' + tag.name + '</li>';
							});
						}

						var html = '';
						html += '<div class="box" data-number="'+countryItem.number+'">';
						if(tagHtml){
						html += '  <ul>' + tagHtml + '</ul>';
						}
						html += '  <a href="javascript:void(0);" class="more_btn">더 보기</a>';
						if(item.img){
							html += '  <div class="img_area">';
							html += '    <img src="' + item.img + '" alt="">';
							html += '  </div>';
						}
						if(item.title){
						html += '  <strong>' + item.title + '</strong>';
						}
						html += '  <div class="desc">';
						if(item.completionDate){
							html += '    <dl>';
							html += '      <dt>준공일</dt>';
							html += '      <dd>';
							html += '      	<p>' + item.completionDate;
							html += '      	</p>';
							html += '      </dd>';
							html += '    </dl>';
						}
						if(item.award){
							html += '    <dl>';
							html += '      <dt>수&nbsp;&nbsp;&nbsp;&nbsp;상</dt>';
							html += '      <dd><p>' + item.award.replace(/,/g, '<br>') + '</p></dd>';
							html += '    </dl>';
						}
						html += '  </div>';
						html += '  <div class="btn_wrap">';
						html += '    <div class="btns">';
						if(item.moreLink){
							html += '      <a href="'+item.moreLink+'" target="_blank" title="새 창으로 바로가기">자세히 보기</a>';
						}
						if(item.masterpieceLink){
							html += '      <a href="'+item.masterpieceLink+'" target="_blank" title="새 창으로 바로가기">마스터피스 보기</a>';
						}
						html += '    </div>';
						html += '  </div>';
						html += '</div>';

						htmlList.push(html);
					});

					$targetContainer.append(htmlList.join(''));
					gsap.fromTo($targetContainer.find(".box"),{
						opacity:0,
						y:"30%",
					},{
						opacity:1,
						y:"0",
						stagger: 0.2,
						duration:0.4,
					});
				}

				// 개수
				function listLength(count) {
					$overseasWrap.find(".count").text(count);
					gsap.fromTo($overseasWrap.find(".count"),{
						y:"100%",
					},{
						y:"0",
						duration:0.5,
					});
				}

				// 타이틀
				function listTitle(title) {
					$overseasWrap.find(".name").html(title);
					gsap.fromTo($overseasWrap.find(".name"),{
						opacity:0,
					},{
						opacity:"1",
						duration:0.5,
					});
				}

				// 기본 세팅
				renderAllList();
			}

			//// 국내 section
			function domestic(){
				// 지역 좌표 생성
				regionView(domesticRegionList);

				// 지역 리스트 생성
				domesticRegionList.forEach(function(item, i){
					var html = '';
					html += '<li>';
					html += '	<a href="javascript:void(0);" data-number="'+item.number+'">'+item.krName+'</a>'
					html += '</li>';

					domesticRegionListHtml.push(html);
				});

				$domesticRegionListDom.append(domesticRegionListHtml.join(''));

				// 지역 리스트 클릭
				$(document).on("click", ".domestic_wrap .region_list a", function(){
					if(!$(this).parent().hasClass("active")){
						// 상단 리스트 가로 스크롤
						$(this).parents(".scroll").mCustomScrollbar('scrollTo', $(this).parent().position().left);	
												
						// 하단 리스트 세로 스크롤 맨위로
						$(this).closest(".list_area").find(".bot").find(".list").find(".scroll").scrollTop(0)

						// region_area remove
						$(".region_area[data-number]").removeClass("active");

						if($(this).parent().hasClass("all")){
							// 전체
							renderAllList();
						} else{
							// 국가
							var number = $(this).data("number");
							var selectedItem = domesticRegionList.find(function(item) {
								return item.number == number;
							});

							var enName = selectedItem.enName;

							listTitle(enName);

							if (selectedItem && selectedItem.list && selectedItem.list.length > 0) {
								// 초기화
								$domesticitemListDom.html("");

								// 생성
								listLength(selectedItem.list.length);
								renderRegionList(selectedItem, $domesticitemListDom);
							} else {
								$domesticitemListDom.html('<p>해당 국가의 프로젝트가 없습니다.</p>');
							}

							//region_area active
							map.find(".region_area").removeClass("show");
							$(".region_area[data-number="+number+"]").addClass("show active");
						}

						$(this).parent().addClass("active").siblings().removeClass("active");
					}
				});

				// 지역 내 아이템 클릭
				$(document).on("click", ".domestic_wrap .item_list .more_btn", function(){
					var number = $(this).parents(".box").data("number");
					var $getCountry = $(".region_area[data-number="+number+"]");

					$(this).parents(".box").addClass("active");
					$(this).parents(".box").siblings().removeClass("active");

					$(this).closest(".item_list").find(".desc").hide();
					$(this).closest(".item_list").find(".btn_wrap").hide();

					$(this).parents(".box").find(".desc").stop().show();
					$(this).parents(".box").find(".btn_wrap").stop().show();

					$(".region_area[data-number]").removeClass("active");
					$getCountry.addClass("active");

					// 클릭 리스트 스크롤 이동
					$(this).closest(".scroll").animate({"scrollTop":$(this).closest(".scroll").scrollTop() + $(this).parent().position().top},300);
				});

				// 지도 좌표 찍기
				function regionView(data){
					data.forEach(function(item, i){
						let innerHtml;
						innerHtml = `
							<div class="region_area" data-number="${item.number}" style="--left:${item.lat}; --top:${item.lng};">
								<p>${item.krName}</p>
								<i><img src="/resources/kr/images/main/globe/spot.png" alt=""><div class="spot"><span></span><span></span><span></span><span></span></div></i>
							</div>
						`;
						map.append(innerHtml);
					});
					
					$(document).on("mouseenter",".region_area", function(){
						$(this).addClass("hover");
					});
					$(document).on("mouseleave",".region_area", function(){
						$(this).removeClass("hover");
					});
					$(document).on("click",".region_area", function(e){
						var number = $(e.target).closest(".region_area").data("number");
						$domesticRegionListDom.find("a[data-number="+number+"]").trigger("click");
					});
				}

				// 전체 클릭
				function renderAllList() {
					var mergedLength = 0;

					listTitle("Main Project");
					// 초기화
					$domesticitemListDom.html("");
					
					domesticRegionList.forEach(function (item) {
						if (Array.isArray(item.list) && item.list.length > 0) {
							mergedLength += item.list.length;
							renderRegionList(item, $domesticitemListDom);
						}
					});

					if (mergedLength > 0) {
						listLength(mergedLength);						
						map.find(".region_area").addClass("show");
					} else {
						$domesticRegionListDom.html('<p>등록된 프로젝트가 없습니다.</p>');
					}
				}
				
				// 지역별 아이템 불러오기
				function renderRegionList(regionItem, $targetContainer) {
					var htmlList = [];

					regionItem.list.forEach(function (item) {
						var tagHtml = '';

						if(item.tag){
							item.tag.forEach(function (tag) {
								var cls = (tag.type === "2") ? ' class="type2"' : '';
								tagHtml += '<li' + cls + '>' + tag.name + '</li>';
							});
						}

						var html = '';
						html += '<div class="box" data-number="'+regionItem.number+'">';
						if(tagHtml){
						html += '  <ul>' + tagHtml + '</ul>';
						}
						html += '  <a href="javascript:void(0);" class="more_btn">더 보기</a>';
						if(item.img){
							html += '  <div class="img_area">';
							html += '    <img src="' + item.img + '" alt="">';
							html += '  </div>';
						}
						if(item.title){
						html += '  <strong>' + decodeUrl(item.title) + '</strong>';
						}
						html += '  <div class="desc">';
						if(item.completionDate){
							html += '    <dl>';
							html += '      <dt>준공일</dt>';
							html += '      <dd>';
							html += '      	<p>' + item.completionDate;
							html += '      	</p>';
							html += '      </dd>';
							html += '    </dl>';
						}
						if(item.award){
							html += '    <dl>';
							html += '      <dt>수&nbsp;&nbsp;&nbsp;&nbsp;상</dt>';
							html += '      <dd><p>' + item.award.replace(/,/g, '<br>') + '</p></dd>';
							html += '    </dl>';
						}
						html += '  </div>';
						html += '  <div class="btn_wrap">';
						html += '    <div class="btns">';
						if(item.moreLink){
							html += '      <a href="'+item.moreLink+'" target="_blank" title="새 창으로 바로가기">자세히 보기</a>';
						}
						if(item.masterpieceLink){
							html += '      <a href="'+item.masterpieceLink+'" target="_blank" title="새 창으로 바로가기">마스터피스 보기</a>';
						}
						html += '    </div>';
						html += '  </div>';
						html += '</div>';

						htmlList.push(html);
					});

					$targetContainer.append(htmlList.join(''));
					gsap.fromTo($targetContainer.find(".box"),{
						opacity:0,
						y:"30%",
					},{
						opacity:1,
						y:"0",
						stagger: 0.2,
						duration:0.4,
					});
				}

				// 개수
				function listLength(count) {
					$domesticWrap.find(".count").text(count);
					gsap.fromTo($domesticWrap.find(".count"),{
						y:"100%",
					},{
						y:"0",
						duration:0.5,
					});
				}

				// 타이틀
				function listTitle(title) {
					$domesticWrap.find(".name").html(title);
					gsap.fromTo($domesticWrap.find(".name"),{
						opacity:0,
					},{
						opacity:"1",
						duration:0.5,
					});
				}

				// 기본 세팅
				renderAllList();
			}
		})
		.catch(error => {
			console.error('Fetch error:', error);
		});
	},
	mobile: function(){
		var $section = $(".sec_mobile");
		var $container = $section.find('.m_globe');
		var $title = $section.find(".title");
		var globe = new Globe($container[0],{
			animateIn:false,
		});

		var maxDistance = 240; // 최대 값
		var minDistance = 100; // 최소 값

		var globeWidth = $container[0].getBoundingClientRect().width;
		var globeHeight = $container[0].getBoundingClientRect().height;

		// 지구 값 set
		// 줌 휠 막기
		globe.controls().enableZoom = false;
		
		// 사이즈
		globe.controls().minDistance = minDistance;
		globe.controls().maxDistance = maxDistance; 
		

		// globe 이미지 생성
		globe.globeImageUrl('/resources/kr/images/main/globe/globe.jpg');

		// 시작지점
		globe.pointOfView({
			lat:10.091280,
			lng:127.929509,
			altitude:2,
		});
		
		globe.width(globeWidth);
		globe.height(globeHeight);
		globe.backgroundColor('rgba(255,255,255,0)');

		// 자동 회전 여부
		globe.controls().autoRotate = true;
		// 음수, 양수에 따라 방향 전환
		globe.controls().autoRotateSpeed = -1;

		// 지구 주변 그라디언트rgba(36, 69, 127, 0.80) 
		globe.atmosphereColor(0xFFFFFF);
		globe.atmosphereAltitude(0.1);

		globe.onGlobeReady(()=>{
			//// set globe
			gsap.set($container.find(".scene-container"),{y:"100%"})
			gsap.set(globe.scene().scale,{x:0.81, y:0.81, z:0.81});
			gsap.set(globe.scene().position, {y:20});
			gsap.set(globe.scene().rotation, {y:-5});

			gsap.to($container.find(".scene-container"),{
				y:"80%",
				duration:1,
				ease: Quart.easeOut 
			});
			// gsap.to(globe.scene().position, {
			// 	y:-200,
			// 	duration:1.4,
			// 	ease:"expo.out"
			// });
			gsap.to(globe.scene().rotation, {
				y:0,
				duration:1.4,
				ease:"expo.out"
			});

			//// start text
			var $strong = $title.find("strong");
			var $p = $title.find("p");
			var $span = $title.find("span");
			var $btn = $title.find("a");

			// SplitText 설정
			var strongMotion = new SplitText($strong, {
				type: 'lines,words',
				linesClass: '-line',
				wordsClass: '-word'
			});
			var pMotion = new SplitText($p, {
				type: 'lines,words',
				linesClass: '-line',
				wordsClass: '-word'
			});
			var spanMotion = new SplitText($span, {
				type: 'lines,words',
				linesClass: '-line',
				wordsClass: '-word'
			});

			// 텍스트 초기 상태 세팅
			gsap.set([$strong, $p, $span], {opacity:1});
			gsap.set([$strong.find(".-line"), $p.find(".-line"), $span.find(".-line")], {overflow:"hidden"});
			gsap.set([$strong.find(".-word"), $p.find(".-word"), $span.find(".-word")], {yPercent: 100});
			gsap.set($btn,{opacity:0, yPercent:50});

			// 타임라인 생성
			var tl = gsap.timeline({
				onComplete: function(){
					strongMotion.revert();
					pMotion.revert();
					spanMotion.revert();
				}
			})
			.to($strong.find(".-word"), { 
				yPercent: 0, 
				duration: 1, 
				ease: Quart.easeOut 
			},"scene1")
			.to($btn, { 
				yPercent: 0, 
				duration: 1, 
				opacity:1,
				ease: Quart.easeOut 
			},"scene1");
			$p.find(".-line").each(function(i, line){
				var word = $(line).find('.-word');
				tl.to(word, { 
					yPercent: 0, 
					duration: 1.6, 
					ease: Quart.easeOut 
				}, i * 0.2);
			});
			$span.find(".-line").each(function(i, line){
				var word = $(line).find('.-word');
				tl.to(word, { 
					yPercent: 0, 
					duration: 1.6, 
					ease: Quart.easeOut 
				}, i * 0.2);
			});
			
			window.addEventListener('resize', () => {
				globeWidth = $container[0].getBoundingClientRect().width;
				globeHeight = $container[0].getBoundingClientRect().height;
				globe.width(globeWidth);
				globe.height(globeHeight);
			});
		});

	},
	reload:function(){
        var flag = true;
        var initialWindowSize = $(window).width();
    
        $(window).resize(function() {
            var currentWindowSize = $(window).width();
    
            if(flag){
                if ((initialWindowSize <= 1024 && currentWindowSize > 1024) || (initialWindowSize > 1024 && currentWindowSize <= 1024)) {
                    location.reload();
                    flag = false;
                }
            }
        });
    },
    init: function () {
		projectMap.utils.reload();

		$(window).on("load", function () {
			if(windowWidth > 1024 && !isTouchDevice){
				projectMap.utils.project();
				$(".sec_mobile").remove();

			} else{
				projectMap.utils.mobile();
				$(".sec_project").remove();
			}
		});
    }
}
projectMap.utils.init();