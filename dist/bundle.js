$(function(){let o=function(o,t){return{API_BASE:"https://cool-aarons-api.herokuapp.com/api/",setAuthHeader:function(t){window.localStorage.setItem("sessionToken",t),o.ajaxSetup({headers:{Authorization:t}})}}}(jQuery);$(".nav-tabs a[data-toggle='tab']").on("click",function(o){let t=window.localStorage.getItem("sessionToken");if($(this).hasClass("disabled")&&!t)return o.preventDefault(),!1}),$('a[data-toggle="tab"]').on("shown.bs.tab",function(t){let e=$(t.target).attr("href");"#log"===e&&o.log.setDefinitions("log"),"#update-log"===e&&o.log.setDefinitions("update"),"#history"===e&&o.log.setHistory()});let t=window.localStorage.getItem("sessionToken");t&&o.setAuthHeader(t),window.WorkoutLog=o}),$(function(){$.extend(WorkoutLog,{definition:{userDefinitions:[],create:function(){let o={definition:{desc:$("#def-description").val(),type:$("#def-logtype").val()}};$.ajax({type:"POST",url:WorkoutLog.API_BASE+"definition",data:JSON.stringify(o),contentType:"application/json"}).done(function(o){WorkoutLog.definition.userDefinitions.push(o.definition),$("#def-description").val(""),$("#def-logtype").val(""),$('a[href="#log"]').tab("show")})},fetchAll:function(){$.ajax({type:"GET",url:WorkoutLog.API_BASE+"definition",headers:{authorization:window.localStorage.getItem("sessionToken")}}).done(function(o){WorkoutLog.definition.userDefinitions=o}).fail(function(o){console.log(o)})}}}),$("#def-save").on("click",WorkoutLog.definition.create),window.localStorage.getItem("sessionToken")&&WorkoutLog.definition.fetchAll()}),$(function(){$.extend(WorkoutLog,{log:{workouts:[],setDefinitions:function(o){let t,e=WorkoutLog.definition.userDefinitions,i=e.length;for(let o=0;o<i;o++)t+="<option value='"+e[o].id+"'>"+e[o].description+"</option>";$("#"+o+"-definition").children().remove(),$("#"+o+"-definition").append(t)},setHistory:function(){let o=WorkoutLog.log.workouts,t=o.length,e="";for(let i=0;i<t;i++)e+="<li class='list-group-item'>"+o[i].def+" ("+o[i].int+") - "+o[i].result+" <div class='pull-right'><button id='"+o[i].id+"' class='update'><b>U</b></button><button id='"+o[i].id+"' class='remove'><b>X</b></button></div></li>";$("#history-list").children().remove(),$("#history-list").append(e)},create:function(){let o={desc:$("#log-description").val(),result:$("#log-result").val(),def:$("#log-definition option:selected").text(),int:$("#log-intensity option:selected").text()};console.log(o);let t={log:o};$.ajax({type:"POST",url:WorkoutLog.API_BASE+"log",data:JSON.stringify(t),contentType:"application/json"}).done(function(o){WorkoutLog.log.workouts.push(o),$("#log-description").val(""),$("#log-result").val(""),$('a[href="#history"]').tab("show")})},getWorkout:function(){let o={id:$(this).attr("id")};logID=o.id;let t={log:o},e=$.ajax({type:"GET",url:WorkoutLog.API_BASE+"log/"+logID,data:JSON.stringify(t),contentType:"application/json"});console.log(e.data),e.done(function(o){$('a[href="#update-log"]').tab("show"),$("#update-result").val(o.result),$("#update-description").val(o.description),$("#update-id").val(o.id),$("#update-intensity").val(o.int)})},updateWorkout:function(){$("#update").text("Update");let o={id:$("#update-id").val(),desc:$("#update-description").val(),result:$("#update-result").val(),def:$("#update-definition option:selected").text(),int:$("#update-intensity option:selected").text()};o.id=Number.parseInt(o.id,10);for(let t=0;t<WorkoutLog.log.workouts.length;t++){WorkoutLog.log.workouts[t].id==o.id&&WorkoutLog.log.workouts.splice(t,1);break}WorkoutLog.log.workouts.sync(),WorkoutLog.log.workouts.sort(function(o,t){return o.id-t.id}),console.log(WorkoutLog.log.workouts);let t={log:o},e=$.ajax({type:"PUT",url:WorkoutLog.API_BASE+"log",data:JSON.stringify(t),contentType:"application/json"});e.done(function(o){$("#update-description").val(""),$("#update-result").val(""),WorkoutLog.log.setHistory,$('a[href="#history"]').tab("show")}),e.fail(function(){alert("Failed to update."),console.log("Failed to update")})},delete:function(){let o={id:$(this).attr("id")},t={log:o},e=$.ajax({type:"DELETE",url:WorkoutLog.API_BASE+"log",data:JSON.stringify(t),contentType:"application/json"});$(this).closest("li").remove();for(var i=0;i<WorkoutLog.log.workouts.length;i++)WorkoutLog.log.workouts[i].id==o.id&&WorkoutLog.log.workouts.splice(i,1);e.fail(function(){alert("Failed to delete."),console.log("nope. you didn't delete it.")})},fetchAll:function(){$.ajax({type:"GET",url:WorkoutLog.API_BASE+"log",headers:{authorization:window.localStorage.getItem("sessionToken")}}).done(function(o){WorkoutLog.log.workouts=o}).fail(function(o){console.log(o)})}}}),$("#log-save").on("click",WorkoutLog.log.create),$("#log-update").on("click",WorkoutLog.log.updateWorkout),$("#history-list").delegate(".update","click",WorkoutLog.log.getWorkout),$("#history-list").delegate(".remove","click",WorkoutLog.log.delete),window.localStorage.getItem("sessionToken")&&WorkoutLog.log.fetchAll()}),$(function(){$.extend(WorkoutLog,{signup:function(){let o=$("#su_username").val(),t=$("#su_password").val();if(""===o||""===t)$("#su_error").text("Please enter a username and password").show();else{let e={user:{username:o,password:t}};$.ajax({type:"POST",url:WorkoutLog.API_BASE+"user",data:JSON.stringify(e),contentType:"application/json"}).done(function(o){o.sessionToken&&(WorkoutLog.setAuthHeader(o.sessionToken),WorkoutLog.definition.fetchAll(),WorkoutLog.log.fetchAll()),$("#signup-modal").modal("hide"),$(".disabled").removeClass("disabled"),$(".hidden").removeClass("hidden"),$(".tab1").show(),$("#logoutTab").text("Logout"),$("#defineTab").text("Define"),$("#logTab").text("Log"),$("#historyTab").text("View History"),$("#su_username").val(""),$("#su_password").val(""),$('a[href="#define"]').tab("show")}).fail(function(){$("#su_error").text("There was an issue with sign up").show()})}},login:function(){let o=$("#li_username").val(),t=$("#li_password").val();if(""===o||""===t)$("#li_error").text("Please enter a username and password").show();else{let e={user:{username:o,password:t}};$.ajax({type:"POST",url:WorkoutLog.API_BASE+"login",data:JSON.stringify(e),contentType:"application/json"}).done(function(o){o.sessionToken&&(WorkoutLog.setAuthHeader(o.sessionToken),WorkoutLog.definition.fetchAll(),WorkoutLog.log.fetchAll()),$("#login-modal").modal("hide"),$(".disabled").removeClass("disabled"),$(".hidden").removeClass("hidden"),$(".tab1").show(),$("#logoutTab").text("Logout"),$("#defineTab").text("Define"),$("#logTab").text("Log"),$("#historyTab").text("View History"),$("#li_username").val(""),$("#li_password").val(""),$('a[href="#define"]').tab("show")}).fail(function(){$("#li_error").text("Unable to login.").show()})}},logout:function(){window.localStorage.getItem("sessionToken")&&window.localStorage.removeItem("sessionToken"),$(".tab1").hide().addClass("disabled")}}),$("#login").on("click",WorkoutLog.login),$("#signup").on("click",WorkoutLog.signup),$("#logoutTab").on("click",WorkoutLog.logout)});
//# sourceMappingURL=maps/bundle.js.map
