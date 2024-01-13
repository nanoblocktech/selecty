Setup

```js
	$selector = $('selecty').Selecty();
	
	$selector.on('selecty:created', function () {
		console.log("created");
	}).on('selecty:opening', function () {
		console.log("Opening");
	}).on('selecty:open', function () {
		console.log("Open");
	}).on("selecty:select", function(e, data) {
		console.log(data.value, data.text);
	}).on("selecty:closing",function(){
		console.log("closing");
	}).on("selecty:close",function(){
		console.log("Close");
	});
```


Public methods
```js
	$selector.Selecty('open');
	$selector.Selecty('close');
	$selector.Selecty('destroy');
	$selector.Selecty('add', "key", "Value");
	$selector.Selecty('remove', "key");
```


Options 

```js
{
 	dropdownParent: $('body'),
	theme: 'full',
	width: '100%',
	multiple: false,
	dropdownCssClass: '',
	selectionCssClass: '',
	title: '',
	closeText: 'Close',
	placeholder: 'Option',
	template: function (option) {
		return option.text;
	},
	initialOptions: []
}
```
