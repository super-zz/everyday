jSmart.prototype.registerPlugin(
	'modifier',
	'phone_mix',
	function (uname, mix) {
  var mix_str = (mix && mix.length == 1 ? mix+mix+mix+mix : mix) || '****';
  return (uname ? uname.substr(0, 11).replace(/(\d{1,3})(\d{1,4})(\d{1,4})/, function () {
    return arguments[1] + mix_str + arguments[3];
  }) : '');
});