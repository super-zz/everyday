var cookie = require('common:widget/util/cookie.js'),
  safeCall = require('common:widget/util/safeCall.js');

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
	}else if(!args.filterOption && !args.tableObj){
		throw new Error('[TableFilter Exception]: please checked args[filterOption, tableObj].');
	}

	this.filterOption = args.filterOption || null;

	this.$tableObj = $(args.tableObj).length ? $(args.tableObj) : $('table');
	this.$container = this.$tableObj.find('tbody');
	this.rate = args.rate || '[role="rate"]';
	this.$rate = this.$container.find(this.rate);
	this.originArr = this.$container.find('tr:not('+ this.rate +')');

	this.filterMenuBtn = $(args.filterMenuBtn).length ? args.filterMenuBtn : '[cmd="filter"]';
	this.$filterMenuBtn = $(args.filterMenuBtn).length ? $(args.filterMenuBtn, this.$tableObj) : $('[cmd="filter"]', this.$tableObj);

	this.filterOptAttr = args.filterOptAttr || 'data-filter-option';
	this.$filterOptBtn = $('['+ this.filterOptAttr +']', this.$tableObj);

	this.sortBtn = $(args.sortBtn).length ? $(args.sortBtn) : '[cmd="sort"]';
	this.$sortBtn = $(args.sortBtn).length ? $(args.sortBtn, this.$tableObj) : $('[cmd="sort"]', this.$tableObj);

	this.sortCountAttr = args.sortCountAttr || 'data-counter';
	
	this.sortOrigin;
	this.hasSort = args.hasSort || false;

	this.currentPage;
	this.filterFragment = {};

	this.init();
}

TableFilter.prototype = {
  constructor: TableFilter,
	init: function(){
		safeCall(this.getCurrentPage, null, this);
		
		safeCall(this.bindFilterMenuShowEvent, null, this);
		safeCall(this.bindFilterOptCheckEvent, null, this);
		this.hasSort && safeCall(this.bindSortTableEvent, null, this);
	},
	getCurrentPage: function(){
		var _pathname = location.pathname,
			_pathnameArr = location.pathname.toString().split('/');
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

		safeCall(this.getCookieFilterOption, null, this);
	},
	getCookieFilterOption: function(){
		var self = this,
			_filterOption = {};

		for( var name in self.filterOption){

			if (self.filterOption.hasOwnProperty(name)) {
				var _key = self.currentPage+ '_' +name,
					_cookie = cookie.get(_key);
				if (_cookie) {
					_filterOption[name] = {};
					_filterOption[name].value = +_cookie.split('_')[0];
					_filterOption[name].index = +_cookie.split('_')[1];
				}	
			}
		}
		safeCall(self.initFilterActive, _filterOption, self);
		safeCall(self.changePageFilterOption, _filterOption, self);
	},
	setCookieFilterOption: function(name, value, index){
		var self = this,
			_key = self.currentPage+ '_' +name;
			_value = value+ '_' +index;

		cookie.set(_key, _value);
	},
	changePageFilterOption: function(opt){
		var self = this;

		safeCall(self.optionAssignHas, opt, self);

  	self.filterFragment = $.extend(true, {}, self.originArr);
  	console.log(self.filterOption);
  	for( var name in self.filterOption){
			self.filterOption.hasOwnProperty(name) ?
				safeCall(self.filterOriginData,[name, self.filterOption[name].index], self) : '';
		}

		safeCall(self.renderFilterResult, null, self);
	},
	optionAssignHas: function (opt) {
		var self = this;

		for(var name in self.filterOption){
			opt.hasOwnProperty(name) ? 
				(self.filterOption[name].value = opt[name].value,
				self.filterOption[name].index = opt[name].index)
				: '';
		}
	},
	filterOriginData: function(name, index){
		var self = this,
			_value = self.filterOption[name].value,
			_index = self.filterOption[name].index;

		if (_index == -1 || !+_value) {return;}

		self.filterFragment = self.filterFragment.map(function(i, v){
			if (!!~$(v).find('td').eq(index).attr('data-'+ name).toString().trim().indexOf(self.filterOption[name].value)) {
				return v;
			}
		});
	},
	renderFilterResult: function(){
		var self = this;

		self.$container.html(self.filterFragment);
		self.$rate.length && self.$container.prepend(self.$rate);
		self.$tableObj.show();
	},
	initFilterActive: function(filterOption){
		var self = this;

		for(var _name in filterOption){
			if (filterOption.hasOwnProperty(_name)) {
				var _value = filterOption[_name].value;
					_index = filterOption[_name].index;
				
				if (_index == -1 || !+_value) {continue;}

				$('['+ self.filterOptAttr +'='+ _name +'-'+ _value +']', self.$tableObj)
					.addClass('ding')
					.siblings('p')
					.removeClass('ding')
					.closest('th')
					.addClass('light');
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
	bindFilterMenuShowEvent: function(){
		var self = this;

		self.$filterMenuBtn.click(function(){
			var $this = $(this);
			$this.siblings(self.filterMenuBtn).removeClass('active');
			$this.toggleClass('active');
		});
	},
	bindFilterOptCheckEvent: function(){
		var self = this;

		self.$filterOptBtn.click(function(e){
			e.stopPropagation();

			var $this = $(this),
			$thisTh = $this.closest('th'),
			option = $this.attr(self.filterOptAttr).split('-'),
			_name = option[0],
			_value = option[1],
			_index = $thisTh.get(0).cellIndex;

			if ($thisTh.hasClass('light')) {
				if(_value == 0){
					$thisTh.removeClass('light');
				}
			}else{
				$thisTh.addClass('light');
			}

			$this.addClass('ding')
					 .siblings('p')
					 .removeClass('ding');

			$thisTh.removeClass('active');

  		var _filterOption = {};
			_filterOption[_name] = {};
			_filterOption[_name].value = +_value;
			_filterOption[_name].index = +_index;

  		safeCall(self.setCookieFilterOption, [_name, _value, _index], self);

  		safeCall(self.changePageFilterOption, _filterOption, self);

  		self.hasSort && safeCall(self.resetSortStatus, null, self);
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