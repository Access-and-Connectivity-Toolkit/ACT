var localStorageStuff = localStorageStuff || (function () {
	const StoreKey = "bcat";
	let dbAnswers = {};

	return {
		setOldAnswers: (answers) => {
			dbAnswers = answers;
		},
		runUpdates: () => runUpdates()
	}

	function runUpdates() {
		let bcatResponses = localStorage.getItem(StoreKey); 
		let resp = {};  
		if (bcatResponses) {
			resp = JSON.parse(bcatResponses);
		}
		populateResponses(resp);

		console.log(dbAnswers);

		setInterval(storeResponses, 10000); // this should be configurable on keystone app startup

		// Work around for now - should not need this...?
		$(":submit").on("click", function() {
			storeResponses();
		});
	}

	// Populates with answers from localStorage or db, whichever is newer
	function populateResponses(formArray) {
		let form = $("#assessment").serializeArray();
		let moduleId = form.find(_ => _.name === "moduleId");

		const covered = new Set();

		if (formArray[moduleId.value]) {
			const timestamp = formArray[moduleId.value].time;

			$.each(formArray[moduleId.value].form, function(i, val) {
				let name = val.name;
				let value = val.value;

				let prev = dbAnswers.find(_ => _.questionId == name);
				
				// Use db answer if it's newer
				if (prev) {
					console.log(Date.parse(prev.updatedAt));
					console.log(timestamp);
					if (Date.parse(prev.updatedAt) > timestamp) {
						console.log("updating");
						name = prev.questionId;
						value = prev.answer;
					}
				}

				// Skip this one when looping over rest from db
				covered.add(name);

				setAnswer(name, value);
			});
		}

		console.log(Object.keys(dbAnswers));

		// Get the rest of the db answers if they're for fields not covered...
		for (const answer of Object.keys(dbAnswers)) {
			const curr = dbAnswers[answer];

			if (!curr) continue;
			const name = curr.questionId;
			if (covered.has(name)) continue;
			const value = curr.answer;

			setAnswer(name, value);
		}
	}

	function setAnswer(name, value) {
		if (value.constructor === Array) {
			for (let i = 0; i < value.length; i++) {
				_setAnswer(name, value[i]);
			}
		} else {
			_setAnswer(name, value);
		}
	}

	function _setAnswer(name, value) {
		if (value) {
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
		}
	}
	
	function storeResponses() {
		let ans = localStorage.getItem(StoreKey);
		let form = $("#assessment").serializeArray();

		if (ans) {
			ans = JSON.parse(ans);
		} else {
			ans = {};
		}

		let moduleId = form.find(_ => _.name === "moduleId");
		ans[moduleId.value] = {form: form, time: Date.now()};
		
		localStorage.setItem(StoreKey, JSON.stringify(ans));
	}
})();