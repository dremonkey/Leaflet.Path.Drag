"use strict";if(L.Browser.svg){L.Path.include({_resetTransform:function(){this._container.setAttributeNS(null,"transform","")},_applyTransform:function(t){this._container.setAttributeNS(null,"transform","matrix("+t.join(" ")+")")}})}else{L.Path.include({_resetTransform:function(){if(this._skew){this._skew.on=false;this._container.removeChild(this._skew);this._skew=null}},_applyTransform:function(t){var i=this._skew;if(!i){i=this._createElement("skew");this._container.appendChild(i);i.style.behavior="url(#default#VML)";this._skew=i}var a=t[0].toFixed(8)+" "+t[1].toFixed(8)+" "+t[2].toFixed(8)+" "+t[3].toFixed(8)+" 0 0";var n=Math.floor(t[4]).toFixed()+", "+Math.floor(t[5]).toFixed()+"";var r=this._container.style;var o=parseFloat(r.left);var s=parseFloat(r.top);var e=parseFloat(r.width);var h=parseFloat(r.height);if(isNaN(o))o=0;if(isNaN(s))s=0;if(isNaN(e)||!e)e=1;if(isNaN(h)||!h)h=1;var _=(-o/e-.5).toFixed(8)+" "+(-s/h-.5).toFixed(8);i.on="f";i.matrix=a;i.origin=_;i.offset=n;i.on=true}})}"use strict";L.Handler.PathDrag=L.Handler.extend({initialize:function(t){this._path=t;this._matrix=null;this._startPoint=null;this._dragStartPoint=null},addHooks:function(){this._path.on("mousedown",this._onDragStart,this);L.DomUtil.addClass(this._path._container,"leaflet-path-draggable")},removeHooks:function(){this._path.off("mousedown",this._onDragStart,this);L.DomUtil.removeClass(this._path._container,"leaflet-path-draggable")},moved:function(){return this._path._dragMoved},_onDragStart:function(t){this._startPoint=L.point(t.containerPoint);this._dragStartPoint=L.point(t.containerPoint.x,t.containerPoint.y);this._matrix=[1,0,0,1,0,0];this._path._map.on("mousemove",this._onDrag,this).on("mouseup",this._onDragEnd,this);this._path._dragMoved=false},_onDrag:function(t){var i=t.containerPoint.x;var a=t.containerPoint.y;var n=i-this._startPoint.x;var r=a-this._startPoint.y;if(!this._path._dragMoved&&(n||r)){this._path._dragMoved=true;this._path.fire("dragstart")}this._matrix[4]+=n;this._matrix[5]+=r;this._startPoint.x=i;this._startPoint.y=a;this._path._applyTransform(this._matrix);this._path.fire("drag");L.DomEvent.stop(t.originalEvent)},_onDragEnd:function(t){this._path._resetTransform();this._transformPoints();this._path._map.off("mousemove",this._onDrag,this).off("mouseup",this._onDragEnd,this);this._path.fire("dragend",{distance:Math.sqrt(L.LineUtil._sqDist(this._dragStartPoint,t.containerPoint))});this._matrix=null;this._startPoint=null;this._dragStartPoint=null},_transformPoints:function(t){var t=this._matrix;var i=t[0];var a=t[1];var n=t[2];var r=t[3];var o=t[4];var s=t[5];var e=this._path;var h=this._path._map;var _=[];var l,f,g,d;function p(t){var e=t.x;var h=t.y;t.x=i*e+n*h+o;t.y=a*e+r*h+s;return t}if(e._originalPoints){for(l=0,g=e._originalPoints.length;l<g;l++){e._latlngs[l]=h.layerPointToLatLng(p(e._originalPoints[l]))}}else if(e._point){e._latlng=h.layerPointToLatLng(p(e._point))}if(e._holes){for(l=0,g=e._holes.length;l<g;l++){for(f=0,d=e._holes[l].length;f<d;f++){e._holes[l][f]=h.layerPointToLatLng(p(e._holePoints[l][f]))}}}e._updatePath()}});(function(){var t=L.Path.prototype._initEvents;L.Path.prototype._initEvents=function(){t.call(this);if(this.options.draggable){if(this.dragging){this.dragging.enable()}else{this.dragging=new L.Handler.PathDrag(this);this.dragging.enable()}}else if(this.dragging){this.dragging.disable()}}})();