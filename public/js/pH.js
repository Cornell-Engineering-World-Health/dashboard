var color_scheme = ["#ED3A1D",
                    "#F18D22",
                    "#F8F110",
                    "#D3F51C",
                    "#98D333",
                    "#6CC342",
                    "#49B65A",
                    "#2C9B59",
                    "#22B486",
                    "#0999B9",
                    "#4D6AA6",
                    "#3F3F59",
                    "#5E576A",
                    "#6C4968",
                    "#46314B"];
$.fn.createPH = function(width, height, pH) {
  var chart = $(this);
  chart.css("background-color", "#FFFF99");
  var inner = '<span class="pH-left"></span><span class="pH-reading"></span><span class="pH-right"></span>';
  chart.append(inner);
  var new_pH = Math.floor(pH);
  chart.height(height);
  chart.width(width);

  var unit = width / 15;
  chart.children('.pH-left').width(new_pH * unit);
  chart.children('.pH-reading').width(unit);
  chart.children('.pH-right').width((14 - new_pH) * unit);
  chart.children('.pH-reading').css("background-color", color_scheme[new_pH]);
}

$.fn.updatePH = function(pH) {
  var chart = $(this);
  var new_pH = Math.floor(pH);

  var unit = chart.width() / 15;
  chart.children('.pH-left').width(new_pH * unit);
  chart.children('.pH-reading').width(unit);
  chart.children('.pH-right').width((14 - new_pH) * unit);
  chart.children('.pH-reading').css("background-color", color_scheme[new_pH]);
}
