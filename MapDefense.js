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

  Fx.schedule(function(){
    MD.badGuy.setPosition(
      S.interpolate(MD.badGuy.position, MD.path[1], this.elapsed)
    )
  }, 1000);

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

var Creep = Class.extend({
  init: function(position){
     this.marker = new google.maps.Marker({ position: position, map:MD.map, icon:'roach.png'});
  },
  position: function(){
    return this.marker.getPosition();
  },
  setPosition: function(point){
    this.marker.setPosition(point);
  }
});
