$(function() {
	$.extend(WorkoutLog, {
		log: {
			workouts: [],

			setDefinitions: function(type) {
				let defs = WorkoutLog.definition.userDefinitions;
				let len = defs.length;
				let opts;
				for (let i = 0; i < len; i++) {
					opts += "<option value='" + defs[i].id +"'>" + defs[i].description + "</option>";
				}
					$("#" + type + "-definition").children().remove();
					$("#" + type + "-definition").append(opts);
			},
			setHistory: function() {
				console.log(WorkoutLog.log.workouts);
				let history = WorkoutLog.log.workouts;
				let len = history.length;
				let lis = "";
				console.log(history);
				for (let i = 0; i < len; i++) {
					lis += "<li class='list-group-item'>" + 
					history[i].def + " - " +
					history[i].result + " " +
					//pass the log.id into the button's id attribute
					"<div class='pull-right'>" +
						"<button id='" + history[i].id + "' class='update'><b>U</b></button>" +
						"<button id='" + history[i].id + "' class='remove'><b>X</b></button>" +
					"</div></li>";
				}
				$("#history-list").children().remove();
				$("#history-list").append(lis);
			},
			create: function() {
				let itsLog = {
					desc: $("#log-description").val(),
					result: $("#log-result").val(),
					def: $("#log-definition option:selected").text()
				};
				console.log(itsLog)
				let postData = {log: itsLog};
				let logger = $.ajax({
					type: "POST",
					url: WorkoutLog.API_BASE + "log",
					data: JSON.stringify(postData),
					contentType: "application/json"
				});
				logger.done(function(data) {
					WorkoutLog.log.workouts.push(data);
					$("#log-description").val("");
					$("#log-result").val("");
					$('a[href="#history"]').tab("show");
				});
			},
			getWorkout: function() {
				let thisLog = {id: $(this).attr("id")};
				logID = thisLog.id;
				let updateData = {log: thisLog};
				let getLog = $.ajax({
					type: "GET",
					url: WorkoutLog.API_BASE + "log/" + logID,
					data: JSON.stringify(updateData),
					contentType: "application/json"
				});
				getLog.done(function(data){
					$('a[href="#update-log"]').tab("show");
					$('#update-result').val(data.result);
					$('#update-description').val(data.description);
					$('#update-id').val(data.id);
				});
			},
			updateWorkout: function() {
				$("#update").text("Update");
				let updateLog = {
					id: $('#update-id').val(),
					desc: $("#update-description").val(),
					result: $("#update-result").val(),
					def: $("#update-definition option:selected").text()
				};
				for (let i = 0; i < WorkoutLog.log.workouts.length; i++) {
					if(WorkoutLog.log.workouts[i].id == updateLog.id) {
						WorkoutLog.log.workouts.splice(i, 1);
					}
				}
				WorkoutLog.log.workouts.push(updateLog);
				let updateLogData = {log: updateLog};
				let updater = $.ajax({
					type: "PUT",
					url: WorkoutLog.API_BASE + "log",
					data:JSON.stringify(updateLogData),
					contentType: "application/json"
				});
				updater.done(function(data) {
					$("#update-description").val("");
					$("#update-result").val("");
					$('a[href="#history"]').tab("show");
				});
			},
			delete: function() {
				let thisLog = {
					//this is the button on the li
					//.attr(id) targets the value of the id attribute of button
					id: $(this).attr("id")
				};
				let deleteData = {log: thisLog};
				let deleteLog = $.ajax({
					type: "DELETE",
					url: WorkoutLog.API_BASE + "log",
					data: JSON.stringify(deleteData),
					contentType: "application/json"
				});
				//removes list item
				//references button then grabs closest li
				$(this).closest("li").remove();
				//deletes item out of workouts array
				for (var i = 0; i < WorkoutLog.log.workouts.length; i++) {
					if (WorkoutLog.log.workouts[i].id == thisLog.id) {
						WorkoutLog.log.workouts.splice(i, 1);
					}
				}
				deleteLog.fail(function() {
					console.log("nope. you didn't delete it.");
				});
			},
			fetchAll: function() {
				let fetchDefs = $.ajax({
					type: "GET",
					url: WorkoutLog.API_BASE + "log",
					headers: {
						"authorization": window.localStorage.getItem("sessionToken")
						}
				})
				.done(function(data) {
					WorkoutLog.log.workouts = data;
				})
				.fail(function(err) {
					console.log(err);
				});
			}
		}
	});
	//click the button and create or delete a log entry
	$("#log-save").on("click", WorkoutLog.log.create);
	$("#log-update").on("click", WorkoutLog.log.updateWorkout);
	$("#history-list").delegate('.update', 'click', WorkoutLog.log.getWorkout);
	$("#history-list").delegate('.remove', 'click', WorkoutLog.log.delete);
	if (window.localStorage.getItem("sessionToken")) {
		WorkoutLog.log.fetchAll();
	}
});