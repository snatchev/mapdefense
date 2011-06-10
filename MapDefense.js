MD = {
  path: [],
  myOrigin: new google.maps.LatLng(39.952335,-75.163789),
  badGuyOrigin: new google.maps.LatLng(39.94925, -75.17076),
};

DirectionsService = new google.maps.DirectionsService();
DirectionsDisplay = new google.maps.DirectionsRenderer();

//math
S = google.maps.geometry.spherical;

Fx = {
  frame: 0,
  tickRate: 30,
  elapsed: 0.0,
  duration: 0,
  timeSinceLastFPS: 0,
  framesSinceLastFPS: 0,
  frameRate: 0,
  //scheduledAnimations: [],
  schedule: function(func, duration){
    this.scheduledAnimation = func;
    this.duration = duration;
    this.scheduleAt = new Date().getTime();
    setInterval(this.tick, duration / this.tickRate);
    if(this.elapsed >= 1.0)
      clearInterval();
  },

  moveTo: function(obj, from, to, duration){
  },

  tick: function() {
    var sec = (new Date().getTime() - this.timeSinceLastFPS) / 1000;
    this.framesSinceLastFPS++;
    var fps = this.framesSinceLastFPS / sec;

    if (sec > 0.5) {
      this.timeSinceLastFPS = new Date().getTime();
      this.framesSinceLastFPS = 0;
      this.frameRate = fps;
    }

    this.elapsed = (this.scheduledAt + this.duration) / this.timeSinceLastFPS;
    this.scheduledAnimation.call(this);
    this.frame++;
  }

};

function initialize(){

  var myOptions = {
     zoom: 16,
     center: MD.myOrigin,
     mapTypeId: google.maps.MapTypeId.ROADMAP
  };

  MD.map = new google.maps.Map(document.getElementById("map_canvas"), myOptions);
  DirectionsDisplay.setMap(MD.map);

  MD.homeBase = new google.maps.Marker({
        position: MD.myOrigin,
        map: MD.map});
  //MD.badGuyMarker = new google.maps.Marker({ position: MD.badGuyOrigin, map:MD.map, icon:'roach.png'});

  MD.badGuy = new Creep(new google.maps.LatLng(39.94925, -75.17076));

  DirectionsService.route({origin: MD.badGuy.position(), destination: MD.myOrigin, travelMode: google.maps.TravelMode.WALKING}, function(result, status){
      if(status == google.maps.DirectionsStatus.OK){
        DirectionsDisplay.setDirections(result);
      }
      MD.path = result.routes[0].overview_path;
    });

  /*
  Fx.schedule(function(){
    MD.badGuy.setPosition(
      S.interpolate(MD.badGuy.position, MD.path[1], this.elapsed)
    )
  }, 1000);
  */
}



/*
function tick(){
  var latlng = S.interpolate(MD.path[leg], MD.path[leg+1], (frame / 1000));
  MD.badGuyMarker.setPosition(latlng);
  frame++;
  if(frame % 1000 == 0){
    leg += 1;
  }
  if(leg == MD.path.length){
    leg = 0;
  }
}*/

/******************************/
S2.FX.Operators.Position = Class.create(S2.FX.Operators.Base, {
  initialize: function($super, effect, object, options) {
    $super(effect, object, options);
    this.start = object.position();
    this.end = this.options.position;
  },
  setup: function(){
     console.log('setup called');
  },

  valueAt: function(position) {
    return S.interpolate(this.start, this.end, position);
  },

  applyValue: function(value){
    this.object.setPosition(value);
  }
});

S2.FX.Entity = Class.create(S2.FX.Base, {
  /**
   *  new S2.FX.Element(element[, options])
   *  - element (Object | String): DOM element or element ID
   *  - options (Number | Function | Object): options for the effect.
   *
   *  See [[S2.FX.Base]] for a description of the `options` argument.
  **/
  initialize: function($super, element, options) {
    this.element = element
    this.operators = [];
    return $super(options);
  },

  /**
   *  S2.FX.Element#animate(operator[, args...]) -> undefined
   *  - operator (String): lowercase name of an [[S2.FX.Operator]]
   *
   *  Starts an animation by using a [[S2.FX.Operator]] on the element
   *  that is associated with the effect.
   *  
   *  The rest of the arguments are passed to Operators' constructor.
   *  This method is intended to be called in the `setup` instance method
   *  of subclasses, for example:
   *
   *      // setup method from S2.FX.Style
   *      setup: function() {
   *        this.animate('style', this.element, { style: this.options.style }); 
   *      }
  **/
  animate: function() {
    var args = $A(arguments), operator =  args.shift();
    operator = operator.charAt(0).toUpperCase() + operator.substring(1);
    this.operators.push(new S2.FX.Operators[operator](this, args[0], args[1] || {}));
  },


  update: function(position) {
    for (var i = 0, operator; operator = this.operators[i]; i++) {
      operator.render(position);
    }
  }
});


/******************************/

var Creep = Class.create({
  initialize: function(position){
     this.marker = new google.maps.Marker({ position: position, map:MD.map, icon:'roach.png'});
  },
  position: function(){
    return this.marker.getPosition();
  },
  setPosition: function(point){
    this.marker.setPosition(point);
  }
});

/*
var c = new S2.FX.Entity(MD.badGuy);
c.animate('position', c.element, {position: MD.path[1]})
c.play()

*/
