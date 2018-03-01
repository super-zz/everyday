$.fn.tableSearch=function(options){
  var eleInput = this,
    originRate = $(options.originRate), //原始数据(非筛选数据项表头率)用于恢复表格初始状态。
    originData = $(options.originData), //原始数据(筛选数据项)用于恢复表格初始状态。
    t_body = $(options.t_body), //数据容器
    _noData = '<tr><td style="text-align:center" colspan=100>暂无匹配项</td></tr>';

  var TIMELENGTH = 500,
    func = throttle(filterData, TIMELENGTH);

  eleInput.on('input', function(){
    func();
  });

  function throttle(fn, delay){
    var timer = null;
   
    return function(){
      var context = this,
        args = arguments;

      clearTimeout(timer);
      timer = setTimeout(function(){
        fn.apply(context, args);
      }, delay);
    };
  }

  function filterData(){
    var _fragment = document.createDocumentFragment(),
      str =  eleInput.val().trim();

    if (!str) {
      t_body.html('')
            .append(originRate)
            .append(originData);
      return;
    }

    originData.each(function () {
      var _rowEle = $(this).get(0);
      if ($(_rowEle.cells[0]).data('search').toString().indexOf(str) >= 0) {
        _fragment.appendChild(_rowEle);
      }
    })

    t_body.html(_fragment.childElementCount ? _fragment : _noData);
  }
}
