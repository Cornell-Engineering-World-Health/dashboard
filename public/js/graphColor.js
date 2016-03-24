$.fn.axisColor = function(color, textAlso) {
  var chart = $(this);
  chart.find('.axis path').css("stroke", color);
  chart.find('.axis line').css("stroke", color);
  if(textAlso) {
    chart.find('.axis .tick text').css("fill", color);
  }
}