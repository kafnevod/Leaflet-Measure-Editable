(function(L, undefined) {
  L.Measure = L.Measure || {};

  /**
   Класс инструмента для измерения координат.
   */
  L.Measure.Polygon = L.Polygon.extend({
    includes: [ L.Measure.Mixin, L.Measure.Mixin.Polygon ],

    /*
     Метод для получения маркеров инструмента редактирования, имеющих метки
     @param {Object} editor Инструмент редактирования
     @returns {Object[]} Массив помеченных маркеров инструмента редактирования.
     */
    _labelledMarkers: function(editor) {
      var latlngs = editor.getLatLngs()[0];
      var markers = [];
      markers.push(latlngs[0].__vertex);
      return markers;
    },

    /*
     Метод для получения маркеров инструмента редактирования, не имеющих меток
     @param {Object} editor Инструмент редактирования
     @returns {Object[]} Массив не помеченных маркеров инструмента редактирования.
     */
    _unlabelledMarkers: function(editor) {
      var latlngs = editor.getLatLngs()[0];
      var markers = [];
      for(var i = 1, len = latlngs.length; i < len; i++) {
        markers.push(latlngs[i].__vertex);
      }
      return markers;
    },

    /**
     Метод для получения текстового описания результатов измерений.
     @param {Object} e Аргументы метода.
     @param {Object} e.layer Слой с геометрией, представляющей производимые измерения.
     @param {Object} e.latlng Точка геометрии, для которой требуется получить текстовое описание измерений.
     @returns {String} Содержимое метки
     */
    _getLabelContent: function(layer, latlng, eventLatlng) {
      var latlngs = layer.editor.getLatLngs()[0].slice();
      if (eventLatlng) {
        for (var index=0; index < latlngs.length && !latlngs[index].equals(eventLatlng); index++);
        if (index === latlngs.length) {
          latlngs.push(eventLatlng);
        }
      }
      var distance = 0;
      var inc = 0;
      var currentInc = 0;
      for(var i = 1; i < latlngs.length; i++) {
        var prevLatLng = latlngs[i - 1];
        var currentLatLng = latlngs[i];
        currentInc = L.Measure.getDistance({
          latlng1: prevLatLng,
          latlng2: currentLatLng
        });
        distance += currentInc;
      }
      var ret = '<b>Периметр: ' + L.Measure.getMeasureText({
      value: distance,
      dimension: 1
    }) + '</b>';
      return ret;
    },

    _getMeasurelabelContext: function(layer, latlng) {
      var latlngs = layer.editor.getLatLngs()[0].slice();
      if (latlng) {
        for (var index=0; index < latlngs.length && !latlngs[index].equals(latlng); index++);
        if (index === latlngs.length) {
          latlngs.push(latlng);
        }
      }
      var ret = 'Площадь: ' + L.Measure.getAreaText({latlngs: latlngs});
      ret = '<b>' + ret + '</b>';
      return ret;
    },

    /**
    Метод обновления основного лейбла измеряемого объекта
    @param {Object} layer Редактируемый слой.
    */
    _updateMeasureLabel: function(layer, e) {
      var areaText = this._getMeasurelabelContext(layer, e.latlng);
      var center;
      var latlngs = layer.editor.getLatLngs()[0];
      if (latlngs.length ==2) {
        center = L.latLng((latlngs[0].lat + latlngs[1].lat)/2, (latlngs[0].lng + latlngs[1].lng)/2);
      } else {
        center = layer.getCenter();
      }

      this._showLabel(layer, areaText, center);
    },

  });

  /**
   Фабричный метод для создания экземпляра инструмента измерения координат.
   */
  L.Measure.polygon = function(map, options) {
    return new L.Measure.Polygon(map, options);
  };

})(L);
