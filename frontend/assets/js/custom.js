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
			success: function (response) {
				// alert(response);
			}
		});
		return false;
	});
});
