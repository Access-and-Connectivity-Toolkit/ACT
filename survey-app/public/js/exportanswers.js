var exporter = exporter || (function() {

	$( "#exportBtn" ).click(function() {
		var queryUrl = '/api/export/csv?teamId=' + currentTeamId;
		
		$.ajax({
			method: 'POST',
			url: queryUrl,
			success: function(data){
				console.debug('success!', data);
				downloadCSV({ filename: currentTeamName + '.csv', data: data})
			},
			error: function(xhr, desc, err){
				console.error('error', err);
			}
		});
		
	});

	//csv export directly from https://halistechnology.com/2015/05/28/use-javascript-to-export-your-data-as-csv/

	function convertArrayOfObjectsToCSV(args) {
		var result, ctr, keys, columnDelimiter, lineDelimiter, data;

		data = args.data || null;
		if (data == null || !data.length) {
			return null;
		}

		columnDelimiter = args.columnDelimiter || ',';
		lineDelimiter = args.lineDelimiter || '\n';

		keys = Object.keys(data[0]);

		result = '';
		result += keys.join(columnDelimiter);
		result += lineDelimiter;

		data.forEach(function(item) {
			ctr = 0;
			keys.forEach(function(key) {
				if (ctr > 0) result += columnDelimiter;

				result += item[key];
				ctr++;
			});
			result += lineDelimiter;
		});

		return result;
	}

	function downloadCSV(args) {
		var data, filename, link;
		
		var csv = convertArrayOfObjectsToCSV({
			data: args.data
		});
		if (csv == null) return;

		filename = args.filename || 'export.csv';

		if (!csv.match(/^data:text\/csv/i)) {
			csv = 'data:text/csv;charset=utf-8,' + csv;
		}
		data = encodeURI(csv);

		link = document.createElement('a');
		link.setAttribute('href', data);
		link.setAttribute('download', filename);
		link.click();
	}
	
})();
