$(function() {
	$.extend(WorkoutLog, {
		definition: {
			userDefinitions: [],
			create: function() {
				let def = {
					desc: $("#def-description").val(),
					type: $("#def-logtype").val()
				};
				let postData = {definition: def};
				let define = $.ajax({
					type: "POST",
					url: WorkoutLog.API_BASE + "definition",
					data: JSON.stringify(postData),
					contentType: "application/json"
				});

				define.done(function(data) {
					WorkoutLog.definition.userDefinitions.push(data.definition);
					$("#def-description").val("");
					$("#def-logtype").val("");
					$('a[href="#log"]').tab("show");
				});
			},
			fetchAll: function() {
				let fetchDefs = $.ajax({
					type: "GET",
					url: WorkoutLog.API_BASE + "definition",
					headers: {
						"authorization": window.localStorage.getItem("sessionToken")
					}
				})
				.done(function(data) {
					WorkoutLog.definition.userDefinitions = data;
				})
				.fail(function(err) {
					console.log(err);
				});
			}
		}
	});
	$("#def-save").on("click", WorkoutLog.definition.create);
	if (window.localStorage.getItem("sessionToken")) {
		WorkoutLog.definition.fetchAll();
	}
})