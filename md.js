/*
MD = {
  path: [],
  myOrigin: new google.maps.LatLng(39.952335,-75.163789),
  badGuyOrigin: new google.maps.LatLng(39.94925, -75.17076),
};

DirectionsService = new google.maps.DirectionsService();
DirectionsDisplay = new google.maps.DirectionsRenderer();

//math
S = google.maps.geometry.spherical;

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
}

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


LL = google.maps.LatLng;


Crafty.c("MapTween", {
  init: function(){
    this.bind('draw', function(obj){
      this._draw(obj.cxt, obj.pos);
    });
  },

	tween: function(props, duration) {
		var prop,
			old = {},
      step = {},
			startFrame = Crafty.frame(),
			endFrame = startFrame + duration;
      stepSize = 1 / duration;

		//store the old properties
		for(prop in props) {
			old[prop] = this['_'+prop];
			step[prop] = (props[prop] - old[prop]) / duration;
		}

		this.bind("enterframe", function d(e) {
			if(e.frame >= endFrame) {
				this.unbind("enterframe", d);
				return;
			}

      this.latlng = S.interpolate(old.latlng, props.latlng, 1 / (endFrame - e.frame));
		});

		return this;
	},

  _draw: function(context, position){
  }


});

var player = Crafty.e("2D, player, MapTween").attr({latlng: new LL(39.952335,-75.163789)});
var badGuy = Crafty.e("2D, badGuy, MapTween").attr({latlng: new LL(39.94925, -75.17076)});
badGuy.tween({latlng: MD.path[1]}, 200);
*/

LL = google.maps.LatLng;
S = google.maps.geometry.spherical;

window.onload = function(){
  Crafty.init(800, 640);
  Crafty.canvas();

  Crafty.MAP = null;

  Crafty.directions = new google.maps.DirectionsService();
  Crafty.directionsDisplay = new google.maps.DirectionsRenderer();

  Crafty.c("Map", {
    map: null,
    mapOptions: { /* this should go in like the color method on the color componenet*/
      zoom: 16,
      center: new LL(39.952335,-75.163789),
      mapTypeId: google.maps.MapTypeId.ROADMAP,
      disableDefaultUI: true,
      disableDoubleClickZoom: true,
      mapTypeControl: false
    },
    init: function(){
            this.addComponent("2D, DOM");
            this.w = 800;
            this.h = 640;
            this.map = new google.maps.Map(this._element, this.mapOptions);
            //set the global map
            Crafty.MAP = this.map;

            return this;
          }
  });

  //*
  Crafty.c("Mappable", {
    _latlng: null,
    latlng: function(value){
              if(!value)
                return this._latlng;
              this._latlng = value;
              this.trigger('change');
            },
    moveTo: function(newPos, duration){
              var oldPos = this._latlng,
                  startFrame = Crafty.frame(),
                  endFrame = startFrame + duration;

              this.bind('enterframe', function d(e){
                if(e.frame >= endFrame) {
                  this.unbind("enterframe", d);
                  return;
                }
                this.latlng(S.interpolate(oldPos, newPos, (e.frame - startFrame)/duration));
              })
            }
  });
  //*/

  Crafty.c("MapMarker", {
    _marker: null,
    init: function(){
            this.addComponent('Mappable');
            this._marker = new google.maps.Marker;
            this._marker.setMap(Crafty.MAP);
            this.bind('change', function(){
              this._marker.setPosition(this._latlng);
            });
          },
  });

  /*
  Crafty.c("Creep", {
    init: function(){
            this.addComponent("Sprite");
          }
  });
  //*/
//new LL(39.94925, -75.17076));
  Crafty.e("Map");
  badGuy = Crafty.e("MapMarker");
}
