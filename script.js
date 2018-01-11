L.MyHash = function(map, options) {
  L.Hash.call(this, map, options);
};

L.MyHash.prototype = L.Util.create(L.Hash.prototype);
L.MyHash.prototype.constructor = L.MyHash;

L.Util.extend(L.MyHash.prototype, {
  parseHash: function(hash) {
    console.log('parseHash: ' + hash);
    var parsed = L.Hash.prototype.parseHash.call(this, hash);
    console.log('parseHash: ' + JSON.stringify(parsed));
    return parsed;
  },

  formatHash: function(map) {
    var formatted = L.Hash.prototype.formatHash.call(this, map);
    console.log('formatHash: ' + formatted);
    return formatted;
  },

  update: function() {
    L.Hash.prototype.update.call(this);
    console.log('update');
  }
});

L.myHash = function(map, options) {
  return new L.MyHash(map, options);
};

var EPSG_3301 = new L.Proj.CRS('EPSG:3301', '+proj=lcc +lat_1=59.33333333333334 +lat_2=58 +lat_0=57.51755393055556 +lon_0=24 +x_0=500000 +y_0=6375000 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs', {
  resolutions: [4000, 2000, 1000, 500, 250, 125, 62.5, 31.25, 15.625, 7.8125, 3.90625, 1.953125, 0.9765625, 0.48828125, 0.244140625, 0.122070313, 0.061035156, 0.030517578, 0.015258789],
  origin: [40500, 5993000],
  bounds: L.bounds([40500, 5993000], [1064500, 7017000])
});

// http://bl.ocks.org/emacgillavry/1a654b76d35deceb9bec
EPSG_3301.distance = L.CRS.Earth.distance;
EPSG_3301.R = 6378137;

var map = new L.Map('map', {
  center: [58.71, 25.23],
  zoom: 3,
  crs: EPSG_3301
});

map.attributionControl.setPrefix('Maa-amet');

var aluskaart = new L.TileLayer('http://tiles.maaamet.ee/tm/s/1.0.0/kaart/{z}/{x}/{-y}.png', {
  maxZoom: 13,
  minZoom: 2,
  zIndex: 1
}).addTo(map);

var fotokaart = new L.TileLayer('http://tiles.maaamet.ee/tm/s/1.0.0/foto/{z}/{x}/{-y}.png', {
  maxZoom: 13,
  // minZoom: 2,
  zIndex: 1
});

var kataster = L.WMS.overlay("http://kaart.maaamet.ee/wms/alus-geo", {
  'transparent': true,
  'srs': 'EPSG_3301',
  'format': 'image/png',
  'layers': 'TOPOYKSUS_6569,TOPOYKSUS_7793',
  maxZoom: 13,
  minZoom: 11
});
kataster.setOpacity(0.8);

var hybriid = new L.TileLayer('proxy.php?url=http://tiles.maaamet.ee/tm/s/1.0.0/hybriid/{z}/{x}/{-y}.png', {
  maxZoom: 13,
  zIndex: 2
});

L.control.layers({
  "Kaart": aluskaart,
  "Foto": fotokaart
}, {
  "Hübriid": hybriid,
  "Kataster (z11+)": kataster
}).addTo(map);

var layerHashKeys = {
  'alus': aluskaart,
  'foto': fotokaart,
  'hybriid': hybriid,
  'kataster': kataster
};
L.myHash(map, layerHashKeys);
