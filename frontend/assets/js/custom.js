var parsed;
$(document).ready(function(){
	$.ajaxSetup({
		crossDomain: true,
		xhrFields: {
			withCredentials: true
		},
		username: 'test',
		password: 'test'
	});

	$('#filename-group').on('click', function() {
		$('#fileToUpload').click();
	});

	$('#fileToUpload').change(function() {
		$('#filename').val($('#fileToUpload').val().replace(/.*[\/\\]/, ''));
		$('#filename-label').html('');
	});

	$("#upload-form").submit(function(evt){
		evt.preventDefault();
		var formData = new FormData($(this)[0]);
		$.ajax({
			url: 'http://localhost:8888/upload',
			type: 'POST',
			data: formData,
			async: false,
			cache: false,
			contentType: false,
			enctype: 'multipart/form-data',
			processData: false,
			beforeSend: function() {
				$('.mdl-spinner').removeClass('hidden');
 			},
			success: function (response) {
				parsed = response;
				$('.mdl-spinner').addClass('hidden');
				$('#parsed-courses').append(`
					<table class="full-width mdl-data-table mdl-js-data-table mdl-data-table--selectable mdl-shadow--2dp">
						<thead>
							<tr>
								<th class="mdl-data-table__cell--non-numeric">Course</th>
								<th class="mdl-data-table__cell--non-numeric" style="text-align:center;">Obligatory</th>
								<th class="mdl-data-table__cell--non-numeric" style="text-align:center;">History</th>
							</tr>
						</thead>
						<tbody id="parsed-courses-body">
						</tbody>
					</table>
				`);
				for(var j = 0; j < response.courseNames.length; j++) {
					var i = j+1;
					$('#parsed-courses-body').append(`
						<tr>
							<td class="mdl-data-table__cell--non-numeric">${response.courseNames[j]}</td>
							<td class="mdl-data-table__cell--non-numeric" style="text-align:center;">
								<input type="checkbox" class="checkbox" id="oblig${i}-box" name="oblig${i}" class="mdl-checkbox__input">
							</td>
							<td class="mdl-data-table__cell--non-numeric">
								<fieldset id="history${i}">
									<input type="radio" id="history${i}-2" value="2" name="history${i}">
									<label for="history${i}-2">Passed</label>
									<input type="radio" id="history${i}-1" value="1" name="history${i}">
									<label for="history${i}-1">Failed</label>
									<input type="radio" id="history${i}-0" value="0" name="history${i}" checked>
									<label for="history${i}-0">New</label>
								</fieldset>
							</td>
						</tr>
					`);
				}
				// console.log(response.courseNames);
				$('#create-btn').removeAttr('disabled');
			}
		});
		return false;
	});
	$("#inputs-form").submit(function(evt){
		evt.preventDefault();
		// formData.parsed = parsed;
		// var formData = new FormData($(this)[0]);
		var formData = $("#inputs-form").serializeArray();
		var data = {}
		// formData.parsed = parsed;

		$.each(formData, function(i, field) {
			data[field.name] = field.value;
		});
		data['parsed'] = parsed;
		// formData.parsed = parsed;
		$.ajax({
			url: 'http://localhost:8888/next',
			type: 'POST',
			data: JSON.stringify(data),
			async: false,
			cache: false,
			contentType: 'application/json',
			processData: false,
			beforeSend: function() {

 			},
			success: function (response) {
				console.log(response);
			}
		})
	});
});
