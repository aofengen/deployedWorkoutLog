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
				let history = WorkoutLog.log.workouts;
				history.sort(function(a, b){
					return a.id - b.id;
				});
				let len = history.length;
				let lis = "";
				for (let i = 0; i < len; i++) {
					lis += "<li class='list-group-item'>" +
					history[i].date + " - " + 
					history[i].def + " (" +
					history[i].int + ")" + " - " +
					history[i].result + " " +
					//pass the log.id into the button's id attribute
					"<div class='pull-right'>" +
						"<button id='" + history[i].id + "' class='update'><b>Edit</b></button>" +
						"<button id='" + history[i].id + "' class='remove'><b>Remove</b></button>" +
					"</div></li>";
				}
				$("#history-list").children().remove();
				$("#history-list").append(lis);
			},
			create: function() {
				let itsLog = {
					date: $("#log-date").val(),
					desc: $("#log-description").val(),
					result: $("#log-result").val(),
					def: $("#log-definition option:selected").text(),
					int: $("#log-intensity option:selected").text()
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
					$("#log-date").val("");
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
				console.log(getLog);
				getLog.done(function(data){
					$('a[href="#update-log"]').tab("show");
					$('#update-date').val(data.date);
					$('#update-result').val(data.result);
					$('#update-description').val(data.desc);
					$('#update-id').val(data.id);
					$('#update-intensity').val(data.int);
				});
			},
			updateWorkout: function() {
				$("#update").text("Update");
				let updateLog = {
					date: $('#update-date').val(),
					id: $('#update-id').val(),
					desc: $("#update-description").val(),
					result: $("#update-result").val(),
					def: $("#update-definition option:selected").text(),
					int: $("#update-intensity option:selected").text()
				}
				for (let i = 0; i < WorkoutLog.log.workouts.length; i++) {
					if(WorkoutLog.log.workouts[i].id == updateLog.id) {
						WorkoutLog.log.workouts.splice(i, 1);
						break;
					}
				}
				updateLog.id = Number.parseInt(updateLog.id, 10);
				WorkoutLog.log.workouts.push(updateLog);
				let updateLogData = {log: updateLog};
				let updater = $.ajax({
					type: "PUT",
					url: WorkoutLog.API_BASE + "log",
					data:JSON.stringify(updateLogData),
					contentType: "application/json"
				});
				updater.done(function(data) {
					WorkoutLog.log.setHistory;
					console.log(WorkoutLog.log.workouts);
					$("#update-date").val("");
					$("#update-description").val("");
					$("#update-result").val("");
					$('a[href="#history"]').tab("show");
				});
				updater.fail(function() {
					alert("Failed to update.");
				})
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
					alert("Failed to delete.");
					console.log("nope. you didn't delete it.");
				});
			},
			compareWorkouts: function() {
				let history = WorkoutLog.log.workouts;
				history.sort(function(a, b){
					return a.id - b.id;
				});
				let sortV = $("#compare-definition option:selected").text();
				let len = history.length;
				let compare = [];
				for (let i = 0; i < len; i++){
					if (history[i].def === sortV) {
						compare.push(history[i]);
					}
				}
				compare.sort(function(a ,b) {
					return b.int - a.int; 
				});
				let lis = "";
				for (let i = 0; i < compare.length; i++) {
					if (i >= 5) {
						break;
					} else {
						lis += "<li class='list-group-item'>" +
							(i+1) + ". " +
							compare[i].date + " - " +
							compare[i].def + " (" +
							compare[i].int + ")" + " - " +
							compare[i].result + ": " +
							compare[i].desc +
							"</li>";
					}
				}
				$("#compare-list").children().remove();
				$("#compare-list").append(lis);
			},
			// clearHOF: function() {
			// 	$("#compare-list").children().remove();
			// },
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
	//bind button events
	$("#log-save").on("click", WorkoutLog.log.create);
	$("#log-update").on("click", WorkoutLog.log.updateWorkout);
	$("#history-list").delegate('.update', 'click', WorkoutLog.log.getWorkout);
	$("#history-list").delegate('.remove', 'click', WorkoutLog.log.delete);
	$("#compareBtn").on('click', WorkoutLog.log.compareWorkouts);
	// $("#compare").on('click', WorkoutLog.log.clearHOF);

	if (window.localStorage.getItem("sessionToken")) {
		WorkoutLog.log.fetchAll();
	}
});