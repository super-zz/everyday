var safeCall = require('common:widget/util/safeCall.js');

var OPTION_VALUE = 0;
var OPTION_INDEX = -1;

function sortTableCel(obj, index, reserved){
  obj.sort(function (row1, row2) {
	var result,
      value1 = getCellVal(row1, index),
      value2 = getCellVal(row2, index);

    return value1 - value2;
  });

  return (reserved && reserved == 1) ? obj : Array.prototype.slice.call(obj).reverse();
};

function getCellVal(row, colIndex) {
  var $cell = $(row.cells[colIndex]);
  return $.trim($cell.attr('data-sort'));
};

function TableFilter(args){
	if (!args) {
		throw new Error('[TableFilter Exception]: No exist args.');
	}else if(!args.tableObj){
		throw new Error('[TableFilter Exception]: please checked args[tableObj].');
	}

	this.filterOption = args.filterOption || new Object();

	this.$tableObj = $(args.tableObj).length ? $(args.tableObj) : $('table');
	this.$container = this.$tableObj.find('tbody');
	this.rate = args.rate || '[role="rate"]';
	this.$rate = this.$container.find(this.rate);
	this.originArr = this.$container.find('tr:not('+ this.rate +')');

	this.filterMenuBtn = $(args.filterMenuBtn).length ? args.filterMenuBtn : '[cmd="filter"]';
	this.$filterMenuBtn = $(args.filterMenuBtn).length ? $(args.filterMenuBtn, this.$tableObj) : $('[cmd="filter"]', this.$tableObj);

	this.filterOptAttr = args.filterOptAttr || 'data-filter-option';
	this.filterContainer = args.filterContainer || '[data-filter]';

	this.checkFilter = args.checkFilter || 'data-checkfilter';
	this.$checkFilterBtn = $('['+ this.checkFilter +']', this.$tableObj);

	this.sortBtn = $(args.sortBtn).length ? $(args.sortBtn) : '[cmd="sort"]';
	this.$sortBtn = $(args.sortBtn).length ? $(args.sortBtn, this.$tableObj) : $('[cmd="sort"]', this.$tableObj);
	this.sortCountAttr = args.sortCountAttr || 'data-counter';
	this.sortOrigin;
	this.hasSort = args.hasSort || false;

	this.currentPage;
	this.filterFragment = {};

	this.nodata = '<td colspan="100" style="text-align:center">当前筛选项暂无数据</td>'
	this.init();
}

TableFilter.prototype = {
  constructor: TableFilter,
	init: function(){
		if (!this.originArr.length) {
      this.$container.html('<tr><td colspan="100" style="text-align:center">暂无数据</td></tr>');
			this.$tableObj.show();
			return;
		}
		safeCall(this.getCurrentPage, null, this);

		safeCall(this.bindFilterMenuShowEvent, null, this);

		safeCall(this.bindCheckfilterEvent, null, this);
		this.hasSort && safeCall(this.bindSortTableEvent, null, this);
	},
	//get pathname
	getCurrentPage: function(){
		var _pathname = location.pathname,
			_pathnameArr = _pathname.toString().split('/');
			_pathnameArr.shift();
		//特殊处理【我的课程下学员与数据整体与章节公用一个pathname的情况】
		if (_pathname == '/assistantdesk/course/student') {
			var _searchArr = location.search.slice(1).split('&');
			  _flag = false;

			$.each(_searchArr, function(i, v) {
				if (!!~v.toString().indexOf('lessonId') && !!v.split('=')[1]) {
					_flag = true;
				}
			});

			_pathnameArr.push(_flag ? 'lesson' : 'whole');
		}
		this.currentPage = _pathnameArr.join('-');

		safeCall(this.getStorage, null, this);
	},
	//get localstorage filter options.
	getStorage: function(){
		var self = this,
			_filterOption = {};

		for( var key in window.localStorage){
			var _index = key.indexOf(self.currentPage);

			if (!!~_index) {
				var _filtername = key.slice((_index+self.currentPage.toString().length+1), key.toString().length);

				_filterOption[_filtername] = {};
				_filterOption[_filtername].value = window.localStorage[key].split('_')[0];
				_filterOption[_filtername].index = window.localStorage[key].split('_')[1];

			}
		}

		safeCall(self.initStoragePageCheck, _filterOption, self);
		safeCall(self.changePageFilterOption, _filterOption, self);
	},
	setStorage: function(filterOption){
		var self = this;

		for( var name in filterOption){
			if(filterOption.hasOwnProperty(name)){
				var _key = self.currentPage+ '_' +name,
				 _value = filterOption[name].value+ '_' + filterOption[name].index;

				window.localStorage.setItem(_key, _value);
			}
		}
	},
	changePageFilterOption: function(opt){
		var self = this;

		safeCall(self.optionAssignHas, opt, self);

  	self.filterFragment = $.extend(true, {}, self.originArr);

  	for( var name in self.filterOption){
			self.filterOption.hasOwnProperty(name) ?
				safeCall(self.filterOriginData,[name, self.filterOption[name].index], self) : '';
		}

		safeCall(self.renderFilterResult, null, self);
	},
	optionAssignHas: function (opt) {
		var self = this;

		Object.assign(self.filterOption, opt);
	},
	//filter data
	filterOriginData: function(name, index){
		var self = this,
			_key = name.split('-')[0],
			_keyindex = name.split('-')[1],
			_value = self.filterOption[name].value,
			_index = self.filterOption[name].index;

		if (!+_value) {return;}

		self.filterFragment = self.filterFragment.map(function(i, v){
			if (!!~$(v).find('td').eq(index).attr('data-'+ _key).toString().trim().indexOf(_keyindex)) {
				return v;
			}
		});
	},
	renderFilterResult: function(){
		var self = this;

		self.filterFragment.length
			? self.$container.html(self.filterFragment)
			: self.$container.html(self.nodata);

		self.$rate.length && self.$container.prepend(self.$rate);
		self.$tableObj.show();
	},
	initStoragePageCheck: function(filterOption){
		var self = this;

		for(var _name in filterOption){
			if (filterOption.hasOwnProperty(_name)) {
				var _value = filterOption[_name].value;
					_index = filterOption[_name].index;

				if (+_value) {
					var _inputELe = $('input[value="'+_name+'"]'),
						_th = _inputELe.closest('th');
					
					_inputELe.get(0).checked = true;

					if(!_th.hasClass('light')){
						_th.addClass('light');
					}
				}
			}
		}
	},
	resetSortStatus: function(selector){
		var self = this;

		self.$tableObj.find(self.sortBtn).not(selector).each(function(i, v){
			$(v).attr(self.sortCountAttr, 0)
				  .removeClass('asc desc');
		});
	},
	//set filter options of one filterContainer, it will be reset or normal filter.
	setOption: function(target, reset){
		var self = this,
			_filterOption = {},
			$target = $(target),
		  _index = $target.closest('th').get(0).cellIndex,
		  isActive = false;

		$target
			.parents(self.filterContainer)
			.find('['+self.filterOptAttr+']')
			.each(function(i, v){
				var _input = $(v).find('input').get(0);

				if (!!reset) {
					_input.checked = 0;
				}

				_filterOption[_input.value] = {};
				_filterOption[_input.value].value = _input.checked ? 1 : 0;
				_filterOption[_input.value].index = _index;

				if ( _input.checked) {
					isActive = true;
				}
			});
			
			$target.closest('th')[isActive?'addClass':'removeClass']('light');

		safeCall(self.setStorage, _filterOption, self);
		safeCall(self.changePageFilterOption, _filterOption, self);
	},
	bindFilterMenuShowEvent: function(){
		var self = this;

		self.$filterMenuBtn.click(function(e){
			if (e.target.tagName.toLocaleLowerCase()!='th') {return;}
			
			var $this = $(this);
			$this.siblings(self.filterMenuBtn).removeClass('active');
			$this.toggleClass('active');
		});
	},
	//check or reset click event
	bindCheckfilterEvent: function(){
		var self = this;

		self.$checkFilterBtn.click(function(e) {
			e.stopPropagation();
			var _this = $(this);

			safeCall(self.setOption, [this, +_this.attr(self.checkFilter)], self);

			_this.closest(self.filterMenuBtn).trigger('click');
		});
	},
	bindSortTableEvent: function(){
		var self = this;

		self.$sortBtn.click(function(){
			var $this = $(this),
				$sortTr = self.$tableObj.find('tbody tr:not('+ self.rate +')'),
				index = $this.get(0).cellIndex,
				flag = parseInt($this.attr(self.sortCountAttr));

				if (flag == 0) {
					self.sortOrigin = $.extend( true, {}, $sortTr)
					safeCall(self.resetSortStatus, $this.get(0), self);
				};

				flag += 1;
		    $this.attr(self.sortCountAttr, flag);

		    switch (flag % 3) {
		      case 0:
		        $this.attr('class', 'sort');

		        self.$container.html(self.sortOrigin);
		        break;
		      case 1:
		        $this.attr('class', 'sort asc');

		        self.$container.html(sortTableCel($sortTr, index, 1));
		        break;
		      case 2:
		        $this.attr('class', 'sort desc');

		        self.$container.html(sortTableCel($sortTr, index, 2));
		        break;
		    }

		    self.$rate.length && self.$container.prepend(self.$rate);
		});
	}
}

module.exports = TableFilter;