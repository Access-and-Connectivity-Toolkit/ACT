(function () {
	const StoreKey = "bcat";
	
	let bcatResponses = localStorage.getItem(StoreKey);   
	if (bcatResponses) {
		let resp = JSON.parse(bcatResponses);
		populateResponses(resp);
	}

	function populateResponses(formArray) {
		$.each(formArray, function(i, val){
			let name = val.name;
			let value = val.value;
			var $el = $('[name="'+ name +'"]'),
				type = $el.attr('type');
			
			switch(type){
				case 'checkbox':
				case 'radio':
					$el.filter('[value="'+value+'"]').attr('checked', 'checked');
					break;
				default:
					$el.val(value);
			}
		});
	}

	// Work around for now - should not need this...
	$(":submit").on("click", function() {
		storeResponses();
	});
	
	function storeResponses() {
		let form = $("#assessment").serializeArray();
		localStorage.setItem(StoreKey, JSON.stringify(form)); 
	}
	
	setInterval(storeResponses, 5000); //this is set to 5 seconds right now, but should be configurable on keystone app startup
})();




