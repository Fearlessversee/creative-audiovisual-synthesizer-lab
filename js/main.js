var touchOnly,
	activeItem, //string that matches workItem id with project slug
	activeItemIndex, // stores the index of the project details object in workDetails array
	workDetails = [],	
	scrollPos = 0,
	mousePos = {x:0, y:0},
	logoTL,
	workDetailSTs = []; // place to store ScrollTrigger references, so they can be killed when necessary


$(window).on('load', function(){

  // Load headerAnim.js
  var headerAnim = document.createElement('script');
  headerAnim.setAttribute('src','js/headerAnim.js');
  document.head.appendChild(headerAnim);


  // Load project data + make work items
  $.getJSON('data/projects.xjson', function(projectData){

  	$.each(projectData, function(i, f) { //populate work items
		f.index = i;
		workDetails.push(f);		
		$('.workGroup'+f.cat+' .thumbs').append(
			'<div id="'+f.slug+'" class="workItem">'+
			    '<a href="/?project='+f.slug+'" class="workImg workImgCat'+f.cat+'">'+
		          
		          '<div class="workImgBg" style="background:'+f.bg+';background-size:cover"></div>'+
		          '<div class="workImgFg" style="background-image:url('+f.fg+')"></div>'+
		      
		          '<div class="workThumbTxt" style="color:'+f.txtColor+'">'+
		            '<div class="workTitle">'+f.project+'</div>'+
		            '<div class="workClient">for '+f.client+'</div>'+
		          '</div>'+
		        '</a>'+
		    '</div>'
		);
	});

	
	
	touchOnly = !!('ontouchstart' in window);

	if (touchOnly){ 
	  	gsap.set('.main',     {position:'absolute'});
	  	gsap.set('.scroller', {display:'none'}); // No inertia scroll on "touch-only" devices because they pretty much all have it by default
	}
	else {
		$(window).on('mousemove', function(e){
			mousePos.x = e.clientX;
			mousePos.y = e.clientY;
		});

		$(window).on('resize', updateScrollerHeight);
		updateScrollerHeight();

	  	function updateScrollerHeight(){ //console.log( 'Updated Scroller Height: '+gsap.getProperty('.main', 'height'))
			gsap.set('.scroller', {height:gsap.getProperty('.main', 'height')});
	  	}

		gsap.set('.main', { width:'100.5%', y:-window.scrollY }); //this fixes issues: 'width' prevents a sliver on left edge, and 'y' in case page is reloaded at a scrollY greater than 0

		ScrollTrigger.create({ //inertia scroll
			id:'smoothST',
			trigger:'.scroller',
			start:'top bottom',
			end:'bottom bottom',
			onUpdate:function(s){ gsap.to('.main', { duration:0.7, ease:'power3', y:-window.scrollY }) }
		});

		makeWorkThumbSTs();
	}


	


	// Intial settings + fade in
	gsap.timeline()
		.set('.vidHoverBtn', 				{display:'block', position:'fixed', top:0, left:0, scale:0, autoAlpha:0, xPercent:-50, yPercent:-50, pointerEvents:'none'})
		.set('.prevBtnTxt, .nextBtnTxt', 	{y:-9, rotation:0.05, opacity:0})
		.set('.workTitle, .workClient', 	{x:-900})
		.to('body', 						{duration:0.4, opacity:1, ease:'power1.inOut'}, 0)

	$('.detailsContact').append( $('#s3')[0].innerHTML );


  // Intial settings + fade in
	$('#s0_svg_reel').on('mouseover', function(){
		gsap.fromTo('.reel_icon_fill', {scale:0.75, transformOrigin:'50%'},{scale:1, attr:{opacity:1}, ease:'expo'})
		gsap.to('.reel_icon', {attr:{opacity:0}, ease:'expo'})
		gsap.to('#s0_svg_reel', {opacity:0.9, ease:'expo'})
	});

	$('#s0_svg_reel').on('mouseout', function(){
		gsap.to('.reel_icon_fill', {attr:{opacity:0}, scale:0.75, ease:'expo'})
		gsap.to('.reel_icon', {attr:{opacity:1}, ease:'expo'})
		gsap.to('#s0_svg_reel', {opacity:0.7, ease:'expo'})
	});

	$('#s0_svg_reel').on('click', function(){ // show reel
		gsap.timeline()
				.fromTo('.curtain',	{top:'100vh', background:'#111'}, {duration:0.4, ease:'power2.inOut', top:0}, 0)
				.to('.logo',				{duration:0.4, autoAlpha:0, ease:'power2.inOut'}, 0)
				.to('.reel',				{autoAlpha:1, ease:'power2.inOut', onComplete:function(){ $('.reel video')[0].play() }})
	});

	$('.reel svg').on('click', function(){ // hide reel
		$('.reel video')[0].pause();
		gsap.timeline()
				.to('.reel',		{duration:0.3, autoAlpha:0})
				.to('.curtain', {duration:0.4, top:'-100vh', ease:'power3.in'}, '-=.2')
				.to('.logo',		{duration:0.4, autoAlpha:1, ease:'power2.inOut'}, '-=.2')
	});

	
	// Logo un-build
	logoTL = gsap.timeline({paused:true})
	    .to('.pt1',     	{duration:1, drawSVG:'100% 100%', ease:'sine.inOut'}, 0)
	    .to('.pt2',     	{duration:1, drawSVG:'100% 100%', ease:'sine.inOut'}, 0)
	    .to('.logoShape',	{duration:0.1, opacity:0, ease:'sine'}, '-=0.15');

	ScrollTrigger.create({ 
		id:'logoST',
		trigger:'.main',
		start:'top top',
		end:'120px top',
		onUpdate:function(s){ gsap.to(logoTL, {duration:0.4, progress:s.progress}) }
	});


	// About section build
	var s1_split = new SplitText('.s1_split', {type:'words'});
	gsap.set([s1_split.words,'.s1_body'], {autoAlpha:0});

	ScrollTrigger.create({
		id:'aboutST',
		trigger:'#s1',
		start:'top center',
		onEnter:function(){
			gsap.to([s1_split.words,'.s1_body'], {duration:0.3, ease:'power2.inOut', y:0, rotation:0.1, autoAlpha:1, stagger:0.1});
		},
	    onLeaveBack:function(){
	    	gsap.to([s1_split.words,'.s1_body'],  {autoAlpha:0, ease:'power1.inOut', duration:0.5})
	    }
	})
	


	if (getParameterByName('project')) { 
		$(workDetails).forEach(function(o,i){
			if ( o.slug == getParameterByName('project') ) {

				activeItem = o.slug; //console.log('Work Detail: '+o.slug);
				populateWorkDetail();
				scrollPos = 0;

				gsap.set('.logo', {cursor:'pointer'});
				$('.logo, .homeBtn').on('click', function(e){ hideDetails(true); }); // Logo + Home icon close work details
				$(window).on('keyup', function(e){ if (e.keyCode==27) hideDetails(true); }); // ...Esc key does too

				gsap.timeline()
					.set('.curtain', 			{top:0, background:'#111'})
					// .set('.contactBtn',			{autoAlpha:0})
					.set('.main',   			{y:0})
					.set(window,    			{scrollTo:0})
					.set('section, .topBar',	{display:'none'})
					.set('.detail', 			{visibility:'visible', top:0, y:0, position:'relative', background:'rgba(25,25,25,1)'})
					.set('.detail .mainCol', 	{visibility:'visible'})
					.to('.curtain', 			{duration:0.4, ease:'power3.in', top:'-100vh'})
					.fromTo('.detail .introFg', {scale:1.2, rotation:0.05},	{duration:0.6, ease:'expo', scale:1, rotation:0}, '-=0.1')
					.fromTo('.logo', 			{autoAlpha:0, scale:0.6, rotation:0.05}, {duration:0.3, autoAlpha:1, scale:1, rotation:0, ease:'back'}, '-=0.5')
			}
		});

		if (!activeItem) window.history.pushState({'page':'home'}, '', window.location.origin); // just in case a project param is invalid
	}



	
	ScrollTrigger.create({ // parallax on the work detail intro img
		id:'workDetailIntro',
	    trigger:'.intro',
	    start:'top top',
	    end:'bottom top',
	    onUpdate:function(s){ 
	    	gsap.to('.intro', 			{ duration:0.3, opacity:1-s.progress})
	    	if (touchOnly){
		    	gsap.to('.introFg', 	{ duration:0.05, ease:'none', y:function(){return innerHeight/2*s.progress}})
		    	gsap.to('.downArrow', 	{ duration:0.05, ease:'none', y:function(){return innerHeight/3*s.progress}})
		    } else {
		    	gsap.to('.introFg', 	{ duration:0.7, ease:'power3', y:function(){return innerHeight/2*s.progress}})
		    	gsap.to('.downArrow', 	{ duration:0.7, ease:'power3', y:function(){return innerHeight/3*s.progress}})
		    }
	    }
    });


	if (!touchOnly){ // no mouse over/out on mobile
		$('.workImg').on('mouseenter', function(e){			
			var $t = $(e.currentTarget);
			gsap.fromTo($t.children('.workThumbTxt').children('.workTitle'), {rotation:0.05, x:-900}, {duration:0.4, rotation:0, x:1, ease:'power2.inOut'})
			gsap.fromTo($t.children('.workThumbTxt').children('.workClient'), {rotation:0.05, x:-800}, {duration:0.4, rotation:0, x:1, ease:'power4.inOut'})
			gsap.to($t.children('.workImgFg'), {duration:0.3, opacity:0.1, scale:0.8, rotation:0.05, ease:'sine'});
		});

		$('.workImg').on('mouseleave', function(e){
		  	var $t = $(e.currentTarget);		  	
			gsap.to($t.children('.workThumbTxt').children('.workTitle'), {duration:0.4, rotation:0.05, x:-900, ease:'power2.inOut'})
			gsap.to($t.children('.workThumbTxt').children('.workClient'), {duration:0.4, rotation:0.05, x:-800, ease:'power3.inOut'})
			gsap.to($t.children('.workImgFg'), {duration:0.3, opacity:1, scale:1, rotation:0, ease:'power4.inOut'});
		} );

		$('.prevBtn, .nextBtn').on('mouseenter', function(e){
			gsap.to($(e.currentTarget).children('div'), {duration:0.4, opacity:1, y:0, rotation:0, ease:'expo'})
		});

		$('.prevBtn, .nextBtn').on('mouseleave', function(e){
			gsap.to($(e.currentTarget).children('div'), {duration:0.4, opacity:0, y:-9, rotation:0.05, ease:'power1.inOut'})
		});
	} else {
		gsap.set('.workImgFg', {opacity:1}); // workImg shown on mobile
		gsap.set('.workThumbTxt', {opacity:0}); // workThumbTxt hidden on mobile 
	}

	$('.workImg').on('click', function(e){
		e.preventDefault();
		activeItem = $(e.currentTarget).parent()[0].id;
		window.history.pushState({'page':activeItem}, '', window.location.origin+'?project='+activeItem);
		showDetails();
	});


	
	$('.prevBtn').on('click', function(){ changeWorkDetail(false) });
	$('.nextBtn').on('click', function(){ changeWorkDetail(true) });

	$('.downArrow').on('click', function(){ gsap.to(window, {scrollTo:innerHeight}) } );




	function showDetails(fromBrowser) { //console.log('Show Details')

		populateWorkDetail();

		scrollPos = window.scrollY; // Save scroll position for when we return

		gsap.set('.logo', {cursor:'pointer'});
		$('.logo, .homeBtn').on('click', function(e){ hideDetails(true); }); // Logo + Home icon close work details
		$(window).on('keyup', function(e){ if (e.keyCode==27) hideDetails(true); }); // Esc key does too

		if (fromBrowser && touchOnly) { // no curtain transition if hiding triggered by browser nav on mobile
			gsap.timeline()
				// .set('.contactBtn',			{autoAlpha:0})
				.set('.detail', 			{visibility:'visible', top:0, y:0, position:'relative', background:'rgba(25,25,25,1)'}) 
				.set(window,    			{scrollTo:0})
				.set('section, .topBar',	{display:'none'})
				.set('.detail .mainCol', 	{visibility:'visible'})
				
			ScrollTrigger.getById('workDetailIntro').enable();

		} else { // animate curtain transition...

			if (!touchOnly) {
				ScrollTrigger.getById('smoothST').disable();
			}

			gsap.timeline()
				.fromTo('.curtain', 		{top:'100vh', background:'#111'}, {duration:0.4, ease:'power2.inOut', top:0}, 0)
				// .to('.contactBtn',			{duration:0.4, autoAlpha:0, ease:'power2.inOut'}, 0)
				.set('.detail', 			{visibility:'visible', top:0, y:0, position:'relative', background:'rgba(25,25,25,1)'}) 
				.set('.main',   			{y:0})
				.set(window,    			{scrollTo:0})
				.set('section, .topBar',	{display:'none'})
				.set('.detail .mainCol', 	{visibility:'visible'})
				.add(function() {
					if (!touchOnly){
						killWorkThumbSTs();
						updateScrollerHeight();				
						ScrollTrigger.getById('smoothST').enable();						
					}				  	
				  	ScrollTrigger.getById('workDetailIntro').enable();				  	
				})
				.to('.curtain', 			{duration:0.4, ease:'power3.in', top:'-100vh'})
				.fromTo('.detail .introFg', {scale:1.2, rotation:0.05},	{duration:0.6, ease:'expo', scale:1, rotation:0}, '-=0.1')
				.fromTo('.logo', 			{autoAlpha:0, scale:0.6, rotation:0.05}, {duration:0.3, autoAlpha:1, scale:1, rotation:0, ease:'back'}, '-=0.5')
			// .fromTo('.downArrow', { y:-50, rotation:0.05}, {duration:0.6, autoAlpha:1, y:0, rotation:0, ease:'back.out(2)'}, '-=0.2')
		}
	};


	function populateWorkDetail(){ //console.log('Populate Work Details')
		
		$(workDetails).forEach(function(o,i){
			if ( o.slug == activeItem ) activeItemIndex = o.index; //find the active item's object in work details array
		});

		var o = workDetails[activeItemIndex];

		gsap.set('.introBg', {background:o.bg})
		gsap.set('.introBg', {backgroundSize:'cover'})// Safari work-around: for some reason background-size gets ignored if it's defined in the same set() as background
		gsap.set('.introFg', {y:0, background:'url('+o.fg+') no-repeat center'})
		
		// Text areas
		$('.title').html( o.project );
		$('.client').html( 'for '+o.client );
		$('.workTxt3').html( o.deliverables );
		$('.workTxt4').html( o.notes );
		gsap.set('.arrowShape', {attr:{stroke:o.txtColor}});

		// Label prev + next buttons
		if ( o.index>0 ) $('.prevBtnTxt').html( workDetails[o.index-1].project );
		else $('.prevBtnTxt').html( workDetails[workDetails.length-1].project );

		if ( o.index<workDetails.length-1 ) $('.nextBtnTxt').html( workDetails[o.index+1].project );
		else $('.nextBtnTxt').html( workDetails[0].project );
		
		// External project link
		(o.link) ? gsap.set('.linkBtn', {autoAlpha:1, attr:{'href':o.link}, text:function(){ return (o.linkLabel)?o.linkLabel:'View' }}) : gsap.set('.linkBtn', {autoAlpha:0});
		
		// Media contents (all videos at this point)
		for (var i=1; i<10; i++){ 
			if (o['item'+i]){
				var item = JSON.parse(o['item'+i].replace(/'/g, '"'));
				var info = item.info;
				if (touchOnly) info = '<div style="position:absolute;right:0"><svg viewBox="0 0 15 15" fill="none" xmlns="http://www.w3.org/2000/svg" width="23" height="18"><path class="replayIcon" d="M7.5 14.5A7 7 0 013.17 2M7.5.5A7 7 0 0111.83 13m-.33-3v3.5H15M0 1.5h3.5V5" stroke="currentColor"></path></svg></div><div style="text-align:left;">'+item.info+'</div>';
				
				if (item.file.substr(-3)=='mp4') { //add new vid-box
					$('.media').append(
					'<div class="vid-box">'+
					    '<video playsinline muted autoplay class="vid" style="width:100%;max-width:'+item.w+'px;max-height:"'+item.h+'px;">'+
					      '<source src="vid/'+item.file+'" type="video/mp4">'+
					    '</video>'+
					    '<div class="info" style="width:'+item.w+'px">'+info+'</div>'+
					  '</div>'
					);
				}

				// if (item.file.substr(-4)=='html') { //add iframe
				// 	$('.media').append( '<div><iframe style="border:none;overflow:hidden" width="'+item.w+'" height="'+item.h+'" src="'+item.file+'"></iframe></div>' );
				// }
			}
		}

		// Video behavior (ScrollTrigger & replay mouse-follower)
		$('.vid-box').forEach(function(vidBox,i){
			var v = $(vidBox).children()[0],
			    info = $(vidBox).children()[1];

			$(v).on('canplay', function(){
				if (!touchOnly) updateScrollerHeight();
				ScrollTrigger.refresh();
			})
			v.pause();
			gsap.set(vidBox, 	{opacity:0.25});
			gsap.set(info, 		{opacity:0});
			  
			ScrollTrigger.create({
			  	id:'vid'+i,
			    trigger:v,
			    start:'top center',
			    end:'100px top',
			    onEnter:function(){ playVid(v, false, info); },
			    onLeave:function(){ pauseVid(v, false, info); },
			    onEnterBack:function(){ playVid(v, true, info); },			    
			    onLeaveBack:function(){ pauseVid(v, true, info); }
			})

			workDetailSTs.push('vid'+i); //keep a record of all the video scrollTriggers so they can be killed later
			
			if (!touchOnly) { // don't listen for mousemove/leave events on mobile
				
				$(v).on('mousemove', function(e){
					gsap.set('.vidHoverBtn', {x:mousePos.x, y:mousePos.y});
					var bool = !!($(e.currentTarget).parent().css('opacity')==1);
					gsap.set('.vidHoverReplay', {opacity:function(){ return (bool)? 1:0; }});
					gsap.set('.vidHoverUp', {opacity:function(){
						if (bool) return 0;
						else return (mousePos.y<window.innerHeight/2)? 1:0;
					}});
					gsap.set('.vidHoverDown', {opacity:function(){
						if (bool) return 0;
						else return (mousePos.y>window.innerHeight/2)? 1:0;
					}});
					gsap.to('.vidHoverBtn',  		{duration:0.2, scale:1, autoAlpha:0.35 });
					gsap.set('body', 				{cursor:'none'});
				});

				$(v).on('mouseleave', function(e){ 
					gsap.to('.vidHoverBtn',  		{duration:0.2, scale:0, autoAlpha:0});
					gsap.set('body', 			{cursor:'auto'});
				});
			}
			else { // but do make the info + replay icon clickable...
				$(info).on('click', function(e){ 
					v.currentTime = 0;
					v.play();
					gsap.fromTo('.replayIcon', {rotation:-180, transformOrigin:'50% 50%'},{rotation:0, duration:0.5, ease:'back.inOut(3)'});
				});				
			}

			$(v).on('click', function(e){
				if ( $(v).parent().css('opacity')<0.9 ){ //move to active position so the video will play
					gsap.to(window, { duration:0.4, scrollTo:$(v).offset().top-(window.innerHeight*.1) });					
				} else { //restart video
					v.currentTime = 0;
					v.play();
					gsap.fromTo('.vidHoverBtn', {rotation:360},{rotation:0, duration:0.5});
					if (touchOnly) gsap.fromTo('.replayIcon', {rotation:-180, transformOrigin:'50% 50%'}, {rotation:0, duration:0.5, ease:'back.inOut(3)'});
				}
			});
		
		});
	}


	function playVid(vid,back,info){ //console.log()
	  vid.play();
	  gsap.to([$(vid).parent()[0], $(vid).parent().children()[1]], {duration:0.3, opacity:1});
	}


	function pauseVid(vid,back,info){
	  vid.pause();
	  gsap.to($(vid).parent()[0], {duration:0.3, opacity:0.25});
	  gsap.to($(vid).parent().children()[1], {duration:0.3, opacity:0});
	}
	


	function changeWorkDetail(next,fromBrowser){ //console.log('Change Work Details',next,fromBrowser)
		
		$('.vid-box video').off();
		$('.vid-box .info').off();
		
		$.each(workDetailSTs, function(i){ ScrollTrigger.getById('vid'+i).kill() }); //remove video ScrollTriggers, then empty array of refs
		workDetailSTs = [];

		gsap.timeline()
			.set('body', 				{cursor:'auto'})
			.to('.detail',  			{duration:0.5, ease:'sine.in', y:-200}, 0)
			.fromTo('.curtain', 		{top:'100vh'}, {duration:0.5, ease:'power2.inOut', top:0}, 0)
			.set(window,    			{scrollTo:0})
			.set('.main, .detail',		{y:0})
			.add(function() {
				
				$('.media').html('');
				
				if (!fromBrowser){ // activeItem is updated in popstate handler (for browser forward/back), so just need to do this when changing via prev/next project btns
					if (next) activeItemIndex = (activeItemIndex<workDetails.length-1) ? activeItemIndex+=1 : 0;
					else activeItemIndex = (activeItemIndex>0) ? activeItemIndex-=1 : workDetails.length-1;					
					activeItem = workDetails[activeItemIndex].slug;
					window.history.pushState({'page':activeItem}, '', window.location.origin+'?project='+activeItem);
				}
				populateWorkDetail(true);

				if (!touchOnly) updateScrollerHeight();
				ScrollTrigger.refresh();
			})
			.set('.detail .introFg', 	{scale:1.2, rotation:0.05})
			.to('.curtain', 			{duration:0.3, ease:'power2.in', top:'-100vh'})			
			.to('.detail .introFg',		{duration:0.5, ease:'expo', scale:1, rotation:0}, '-=0.1')
			// .fromTo('.close', 			{autoAlpha:0, scale:0.6, rotation:0.05}, {duration:0.3, autoAlpha:1, scale:1, rotation:0, ease:'back'}, '-=0.4')
	}



	function hideDetails(fromDetail, fromBrowser) {

		if (fromDetail) window.history.pushState({'page':'home'}, '', window.location.origin);

		gsap.set('.logo', {cursor:'auto'});
		$('.logo').off();
		$(window).off('keyup');
		$('.vid-box video').off();
		$('.vid-box .info').off();
		
		$.each(workDetailSTs, function(i){ ScrollTrigger.getById('vid'+i).kill() }); //remove video ScrollTriggers, then empty array of refs
		workDetailSTs = [];

		ScrollTrigger.getById('workDetailIntro').disable();
		
		gsap.set('body', 		{cursor:'auto'})
		gsap.set('.vidHoverBtn',	{scale:0, autoAlpha:0, overwrite:true})				
		
		if (fromBrowser && touchOnly) { // no curtain transition if hiding triggered by browser nav on mobile
			gsap.timeline()
				.set('.detail .mainCol',	{visibility:'hidden'})
				.set('.detail', 			{visibility:'hidden', position:'absolute' })
				.set('section, .topBar',	{display:'block', onComplete:updateScrollerHeight })
				.set(window,    			{scrollTo:scrollPos})
				.add(function(){ $('.media').html(''); })

				.fromTo('.logo', {autoAlpha:0}, {autoAlpha:1, ease:'expo.in'}, 0.1)
				// .fromTo('.contactBtn', {autoAlpha:0}, {autoAlpha:1, ease:'expo.in'}, 0.1)
		}
		else { // animate curtain to take us home!
			
			if (!touchOnly) {
				ScrollTrigger.getById('smoothST').disable();
			}

			gsap.timeline()
				.to('.detail',  			{duration:0.3, ease:'none', y:-200}, 0)
				.fromTo('.curtain', 		{top:'100vh', transformOrigin:'0 0'}, {duration:0.3, ease:'sine', top:0}, 0)
				.set('.detail .mainCol',	{visibility:'hidden'})
				.set('.detail', 			{visibility:'hidden', position:'absolute' })
				.set('section, .topBar',	{display:'block', onComplete:updateScrollerHeight })
				.set(window,    			{scrollTo:scrollPos})				
				.add(function() {
					$('.media').html('');
					updateHeaderAnimSize();
					if (!touchOnly) {
						gsap.set('.main', {y:-scrollPos})						
						ScrollTrigger.getById('smoothST').enable();
						makeWorkThumbSTs();
						// ScrollTrigger.update();
					}
				})
				.to('.curtain', 			{duration:0.6, ease:'power4.in', top:'-100vh'})
				.to('.logo',				{autoAlpha:1, ease:'expo.in'}, '-=0.3')//.to('.logo, .contactBtn',	{autoAlpha:1, ease:'expo.in'}, '-=0.3')
		}

		activeItem = '';
	}



	function makeWorkThumbSTs(){

		ScrollTrigger.create({
			id:'workThumbs1',
			trigger:'.workGroup1 .thumbs',
			start:'top bottom',
			end:'bottom top',
			onUpdate:function(s){ console.log('workThumbs1',s.progress)
				if (window.innerWidth<800) gsap.set('.workImgCat1', {y:0});
				else {
					gsap.to('.workImgCat1', {y:function(i){
						return (i%2==0) ? gsap.utils.interpolate(200, -260, s.progress) : gsap.utils.interpolate(90, -100, s.progress);
					}});
				}
			}
		})
		
		ScrollTrigger.create({
			id:'workThumbs2',
			trigger:'.workGroup2 .thumbs',
			start:'top bottom',
			end:'bottom top',
			onUpdate:function(s){ //console.log('workThumbs2',s.progress)
				if (window.innerWidth<800) gsap.set('.workImgCat2', {y:0});
				else {
					gsap.to('.workImgCat2', {y:function(i,t){
						return (i%2==0) ? gsap.utils.interpolate(200, -300, s.progress) : gsap.utils.interpolate(90, -120, s.progress);
					}});
				}
			}
		})

		ScrollTrigger.create({
			id:'workThumbs3',
			trigger:'.workGroup3 .thumbs',
			start:'top bottom',
			end:'bottom top',
			onUpdate:function(s){ //console.log('workThumbs3',s.progress)
				if (window.innerWidth<800) gsap.set('.cpThumb', {y:0});
				else gsap.to('.cpThumb', {y:function(i){ return gsap.utils.interpolate(95, -80, s.progress) }});
			}
		})
	}


	function killWorkThumbSTs(){
		ScrollTrigger.getById('workThumbs1').kill();
		ScrollTrigger.getById('workThumbs2').kill();
		ScrollTrigger.getById('workThumbs3').kill();
		gsap.set('.cpThumb, .workImgCat1, .workImgCat2', {y:0})
	}





	// Handle Back + Forward browser navigation
	window.onpopstate = function(e){
		if ( getParameterByName('project') ) {
			activeItem = getParameterByName('project');
			if (gsap.getProperty('.detail', 'visibility')=='hidden') showDetails(true);
			else changeWorkDetail(null,true);
		} else {
			if ( gsap.getProperty('.detail', 'visibility')!='hidden' ) hideDetails(false, true);
		}
	}

  });	
});



// HELPER FUNCTIONS
function getParameterByName(name) {
    name = name.replace(/[\[\]]/g, "\\$&");
    var regex = new RegExp("[?&]" + name + "(=([^&#]*)|&|#|$)"),
        results = regex.exec(window.location.href);
    if (!results) return null;
    if (!results[2]) return '';
    return decodeURIComponent(results[2].replace(/\+/g, " "));
}