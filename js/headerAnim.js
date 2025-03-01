var c = document.getElementById('c'),
    ctx = c.getContext('2d'),
    cw, ch,
    fixedSize = {width:1600, height:1000, ratio:0.625},
    srcImgs = ['s0_bg0.jpg', 's0_bg1.png', 's0_bg3.png', 's0_bg2.png', 's0_mg1.png', 's0_mg2.png', 's0_fg1.png', 's0_fog.png', 's0_fog.png', 's0_fog.png'],
    offscreen = false,
    layers = [],
    Layer = function(img){ //console.log(img.id)

      this.img = img;
      this.index = img.id;
      this.x = this.y = 0;
      this.opacity = this.scale = 1;
      this.mag = (touchOnly)? 1 : 1.08;
      this.width = img.width;
      this.height = img.height;
      this.top = 0;
      this.left = 0;
      if (img.id==0) {this.top=360} // horizon line
      if (img.id==7) {this.top=60; this.left=50} //fog pt1
      if (img.id==8) {this.top=250; this.left=-350} //fog pt2
      if (img.id==9) {this.top=220; this.left=280} //fog pt3
      
      this.mouseDelta = img.id;
      if (img.id>7) this.mouseDelta*=2;
      this.mx = this.my = 0;
      
      this.draw = function(){ //console.log('drawing')
        if (!touchOnly) {
          this.mx += (gsap.utils.interpolate(11*this.mouseDelta, -11*this.mouseDelta, mousePos.x/cw) - this.mx) * 0.035;
          this.my += (gsap.utils.interpolate(3.5*this.mouseDelta, -4*this.mouseDelta, mousePos.y/cw) - this.my) * 0.035;          
        }
        ctx.translate( c.width/2+this.left+this.x+this.mx, c.height/2+this.top+this.y+this.my );
        ctx.globalAlpha = this.opacity;
        ctx.drawImage(img, -this.width*this.scale*this.mag/2, -this.height*this.scale*this.mag/2, this.width*this.scale*this.mag, this.height*this.scale*this.mag);
        ctx.translate( -c.width/2-this.left-this.x-this.mx, -c.height/2-this.top-this.y-this.my );
      }
    }       

c.width = fixedSize.width;
c.height = fixedSize.height;
window.onresize = updateHeaderAnimSize;

function updateHeaderAnimSize(){
  cw = gsap.getProperty('#s0','width');
  ch = gsap.getProperty('#s0','height');

  if (ch / cw < fixedSize.ratio) gsap.set('#s0_cDiv', {transformOrigin:'0 0', scale:(cw*fixedSize.ratio)/fixedSize.height});
  else gsap.set('#s0_cDiv', {transformOrigin:'0 0', scale:(ch/fixedSize.ratio)/fixedSize.width});
  
  var data = document.getElementById('s0_cDiv').getBoundingClientRect();
  gsap.set('#s0_cDiv', { x:cw/2-data.width/2,  y:ch/2-data.height/2 });
}


for (var i=0; i<srcImgs.length; i++){ //load image layers
  var img = new Image();
  img.id = i;
  img.src = 'img/'+srcImgs[i];
  img.onload = makeLayer;
}


function makeLayer(e){
  layers.push( new Layer(e.currentTarget) );// add new Layer to layers array
  layers.sort(function(a,b){ return (a.img.id>b.img.id) ? 1:-1; });// sort layers to maintain correct z-stacking
  if (layers.length==srcImgs.length) initHeaderAnim(); // init once all layers are loaded
}


function initHeaderAnim(){

  updateHeaderAnimSize();
  
  gsap.ticker.add( function(){ 
    if (offscreen || activeItem) return; //don't render while offscreen or when a workDetail is active
    ctx.clearRect(0, 0, 1600, 1000);    
    for (var i=0; i<layers.length; i++) layers[i].draw();
  });

  gsap.timeline({defaults:{ease:'power4'}})    
    .from(layers[0],      {duration:1.8, scale:4, x:-100, y:500, ease:'power3'}, 0)
    .from(layers[1],      {duration:1.5, scale:5, x:-700}, 0.1)
    .from(layers[3],      {duration:1.4, scale:5, x:-450}, 0.25)
    .from(layers[2],      {duration:1.3, scale:4.5, x:400}, 0.3)
    .from(layers[4],      {duration:1.0, scale:4}, 0.5)
    .from(layers[5],      {duration:1.0, scale:4}, 0.6)
    .from(layers[6],      {duration:0.8, scale:4}, 0.7)    
    .from(layers[8],      {duration:0.8, scale:5}, 0.7) //fog pt2
    .from(layers[9],      {duration:0.8, scale:4}, 0.6) //fog pt3
    .to('.cloudMask',     {duration:1.5, y:-380, ease:'power2.inOut'}, 0.7)
    .to('#s0_svg_reel',   {duration:1, opacity:0.7, ease:'power2.inOut'}, 1.3)
    // .timeScale(0.75)

    .call(function(){
      var s0TL = gsap.timeline({paused:true, defaults:{duration:1, ease:'none'}})
            .to(layers[0],    {scale:1.15, x:-30, y:50}, 0)
            .to(layers[1],    {scale:1.2,  x:-80, y:18}, 0)
            .to(layers[3],    {scale:1.2,  x:-20, y:20}, 0)
            .to(layers[2],    {scale:1.2,  x:85,  y:10}, 0)
            .to(layers[4],    {scale:1.4,  x:-40, y:-15}, 0)
            .to(layers[5],    {scale:1.5,  x:40,  y:-60}, 0)
            .to(layers[6],    {scale:1.8,  x:0,   y:-100}, 0)
            .to(layers[7],    {scale:1.6,  x:0,   y:100}, 0)
            .to(layers[8],    {scale:1.6,  x:-90, y:-90}, 0)
            .to(layers[9],    {scale:1.5,  x:300, y:-200}, 0)
            .to('.lockup, .reel_btn',    {opacity:0, ease:'power1.in', duration:0.5}, 0)            

        ScrollTrigger.create({
          trigger:'#s0',
          start:'top top',
          end:'bottom top',
          onUpdate:function(s){
            offscreen = !!(s.progress>0.92);
            gsap.to(s0TL, {duration:0.9, ease:'expo', progress:s.progress}); }
        });

        if (!touchOnly){

        }
    })  

}