
var Kanatis = function(opt) {
	var self = this;
	self.init(opt);
}

Kanatis.Const = {
		'TASK_STATUS': {
			'TODO': {
				'headColor': 'bgDred',
				'bodyColor': 'bgLred',
			},
		},
		'LS_KEY': {
			'TASK':		'Kanatis_taskData',	
		}
}

Kanatis.prototype = {
	taskSeq: '00000',
	timerFlg: false,
	taskCounter: {
				'TODO' : 0,
				'DOING' : 0,
				'DONE' : 0
	},
	updateTaskFlg: false,
	init: function (opt) {
		var self = this;
		
        self.showHowTo(self);
		self.setTask();
		self.setCounter();
		self.setEventListener();
		
		//メニュータイトルアニメーション処理
		$('.formTitle').hover(
			function() {
				$('img', this).slideUp('fast', 'easeOutExpo');
				$('p', this).slideDown('fast', 'easeOutExpo');
			}
			,function() {
				$('img', this).slideDown('fast', 'easeOutExpo');
				$('p', this).slideUp('fast', 'easeOutExpo');
			}
		);
	},
	setEventListener: function() {
		var self = this;
		//タスク追加処理
		$(document).delegate('#addTaskBtn','click', function(){ self.addTask(); });
		//タスク削除処理
		$(document).delegate('.taskDeleteBtn','click', function(){ self.deleteTask(this); });
		//コメント追加処理
		$(document).delegate('.addTaskCommentBtn','click', function(){ self.addTaskComment(this); });
		//コメント削除処理
		$(document).delegate('.commentDeleteBtn','click', function(){ self.deleteTaskComment(this); });
		//コメント欄開閉処理
		$(document).delegate('.toggleComment','click', function(){ self.toggleComment(this); });
		$(document).delegate('#showCommentBtn','click', function(){ self.showCommentAll(); });
		$(document).delegate('#hideCommentBtn','click', function(){ self.hideCommentAll(); });
		//絞り込み処理
		$('#condCategory').change(function(){ self.condTask('category') });
		$('#condLimitTo').keydown(function(e){ if (e.keyCode === 13) { self.condTask('limitTo'); } });
		$(document).delegate('#condLimitTo','blur', function(){ self.condTask('limitTo'); });
		//sort処理
		$('input[name="sortType"]:radio').change(function(){ self.sortTask(); });
		$(document).delegate('#ascBtn,#descBtn','click', function(){ self.sortTaskOrder(this); });
		//タスクデータ変更処理
		$(document).delegate('.taskTotalTime, .taskTodayTime, .projectName, .ticketId, .taskYoteiTime, .taskTitle, .taskCategory, .taskLimit','click blur', function(){ self.updateTaskData(this); });
		$(document).delegate('.taskTotalTime, .taskTodayTime, .projectName, .ticketId, .taskYoteiTime, input.taskTitle, input.taskCategory, input.taskLimit','keydown', function(e){
			if (e.keyCode === 13) {
				self.updateTaskData(this); } 
			});
		//タスク保存処理
		$(window).on("beforeunload",function(e){ self.saveTask(); });
		
		$(document).delegate('.taskHead','click', function(){toggleTimer(this)});
		$(document).delegate('.downloadCsv','click', function(){ self.downloadCsv(self); });
		$(document).delegate('#howToBtn','click', function(){ self.showModal('#howToSection'); });
		$(document).delegate('.closeModal, .wall','click', function(){ self.closeModal('.modal'); });
		$(document).delegate('#resetTodayTimeBtn','click', function(){ self.resetTodayTime(this); });
	},
	resetTodayTime: function(self) {
		if (window.confirm('今日の作業時間をリセットし、累計時間に加算しても宜しいですか？')) {
			$.each($('.task:not(#taskObj, .dummy)'), function() {
				$('.taskTotalTime', this).text();
				$('.taskTotalTime', this).text($('.taskTodayTime', this).text());
				$('.taskTodayTime', this).text('00:00:00');
			});
		}
	},
    showHowTo: function() {
		if (localStorage.get('isFirst') === null) {
            this.showModal('#howToSection');
            localStorage.set('isFirst', true);
           
        }
        setTimeout(function(){
            	$('#slider3').bxSlider({ pager: true });
        }, 140);
    },
    showModal: function(target) {
		$(target).fadeIn(150);
		$('.wall').fadeIn(150);
		$('header, #taskSection, #menu').addClass('blur');        
    },
	closeModal: function(target) {
		$(target).fadeOut(100);
		$('.wall').fadeOut(100);
		$('header, #taskSection, #menu').removeClass('blur');
	},
	downloadCsv: function(self) {
    	
		var taskData = [];
		taskData.push('id,プロジェクト,ユーザ,チケットＩＤ,稼働時間,コメント,行動,日付');
		var today = Date.getCurrentDate('/', false);
		$.each($('.task:not(#taskObj, .dummy)'), function() {
			var taskTodayTime = $('.taskTodayTime',this).text();
			var times = taskTodayTime.split(':');
			var hun = parseInt(times[1]);
			var hunMap = {};
			var Z60 = Math.abs(60 - hun);
			var Z45 = Math.abs(45 - hun);
			var Z30 = Math.abs(30 - hun);
			var Z15 = Math.abs(15 - hun);
			var Z00 = Math.abs(0 - hun);
			hunMap[Z60] = 60;
			hunMap[Z45] = 45;
			hunMap[Z30] = 30;
			hunMap[Z15] = 15;
			hunMap[Z00] = 0;
			var hunKinjichi = Math.min.apply(null, [Z60,Z45,Z30,Z15,Z00]);
			var taskTimeForRedmine = (parseInt(times[0]*60) + hunMap[hunKinjichi]) / 60;
			if (taskTimeForRedmine === 0) {
				return true;//continueと同じ
			}
			
			var task = [
			            	'',//id は空にしておく
							$('.projectName',this).text(),
							$('.sagyosha',this).text(),
							$('.ticketId',this).text(),
							taskTimeForRedmine,
							'',//commentここか？
							$('.taskCostCode option:selected', this).text(),
							today,
							];
			taskData.push(task.join(','));
			}
		);
		
		$('#csvSection pre').text(taskData.join('\n'));
        self.showModal('#csvSection');		
	},
	getSortableOption: function(){
		var self = this;
		return {
					items: '.task',
					revert: 40,
					opacity: 0.7,
					stop: function(event, ui) { self.updateTaskStatus(event, ui); }
				};
	},
	addTask: function() {
		var self = this;
		
		var taskTitle = $('#newTaskTitle').val();
		var taskCostCode = $('#taskCostCode > option:selected').val();
		var taskYoteiTime = $('#taskYoteiTime').val();
		var ticketID = $('#ticketID').val();
		var sagyosha = $('#sagyosha').val();
		var projectName = $('#projectName').val();
		
		if (
				taskTitle === '' || taskCostCode === '' || taskYoteiTime === ''
			) {
			return false;
		}
		
		var $taskDiv = $('#taskObj').clone(true);
		
		self.taskSeq = ('0000' + ++self.taskSeq).slice(-5);
		$taskDiv.attr('id', self.taskSeq);
		
		$('.taskId',$taskDiv).text(self.taskSeq);
		$('.ticketId',$taskDiv).text(ticketID);
		$('.taskTitle',$taskDiv).text(taskTitle);
		$('.taskCostCode',$taskDiv).val(taskCostCode);
		$('.taskYoteiTime',$taskDiv).text(taskYoteiTime);
		$('.projectName',$taskDiv).text(projectName);
		$('.sagyosha',$taskDiv).text(sagyosha);
		
		$('#taskBox_TODO').prepend($taskDiv);
		$taskDiv.toggle('middle', 'easeOutExpo');
		
		//requiredによるポップアップ表示対策
		setTimeout(function() {
			$('#newTaskTitle').val('');
			$('#newTaskCategory').val('');
		}, 5);
		
		//focusをカテゴリへ
		$('#newTaskCategory').focus();
		
	},
	addTaskComment: function(elem) {
		var self = this;
		
		var comment = $(elem).siblings('.commentTextarea').val();
		if (comment === '') {
			return false;
		}
		
		var $commentDiv = $('#commentObj').clone(true);
		$commentDiv.attr('id', '');
		
		$('.date', $commentDiv).text(Date.getCurrentDate('/', true));
		$('.commentBody', $commentDiv).text(comment);
		
		$(elem).parents('.commentForm').siblings('.commentBox').append($commentDiv);
		$commentDiv.toggle('fast', 'easeOutExpo');
//		$commentDiv.parents('.task').css("opacity", "0.4").css("filter", "alpha(opacity=40)").fadeTo("slow", 1.0);
		
		$(elem).siblings('input[type="text"]').focus();
		$(elem).siblings('.commentTextarea').val('');
	},
	deleteTask: function(elem) {
		var self = this;
		if (confirm('削除しますか。') === false) {
			return false;   
		}
		
		var deleteTaskStatus = $(elem).parents('.taskBox').attr('data-status');
		$('#counter_' + deleteTaskStatus).text(--self.taskCounter[deleteTaskStatus]);
		
		var removeTarget = $(elem).parents('.task');
		removeTarget.hide('middle', 'easeOutExpo', function(){ removeTarget.remove(); });
		
	},
	deleteTaskComment: function(elem) {
		$(elem).parent().remove();
	},
	updateTaskStatus: function(event, ui) {
		var self = this;
		
		var taskObj = ui.item;
		var fromTaskStatusName = $(taskObj).attr('data-status');
		var toTaskStatusName = $(taskObj).parents('.taskBox').attr('data-status');
		
		$('#counter_' + fromTaskStatusName).text(--self.taskCounter[fromTaskStatusName]);
		$('#counter_' + toTaskStatusName).text(++self.taskCounter[toTaskStatusName]);
		
		$(taskObj).attr('data-status', toTaskStatusName);
		$(taskObj).css('opacity', 1.0);
		$('.taskHead', taskObj).attr('class', 'taskHead red');
		$('.taskBody', taskObj).attr('class', 'taskBody red');
	},
	updateTaskData: function(elem) {
		var self = this;
		var prevClass = $(elem).attr('class');
		
		if (self.updateTaskFlg === true && event.type === 'keydown') {
			var prevTitle = $(elem).val();
			if (prevTitle === '') {
				return false;
			}
			self.updateTaskFlg = false;
			$(elem).parent().append('<span class="' + prevClass + '">' + prevTitle + '</span>');
			$(elem).remove();
		} else if (self.updateTaskFlg === false && elem.tagName === 'SPAN') {
			self.updateTaskFlg = true;
			var prevTitle = $(elem).text();
			$(elem).parent().append('<input class="' + prevClass + '" required type="text" value="' + prevTitle + '">');
			$(elem).siblings('input[type="text"]').focus();
			$(elem).remove();
		}
	},
	toggleComment: function(elem) {
		$(elem).parents('.task').find('.taskBody').toggle('fast', 'easeOutExpo');
		
	},
	showCommentAll: function() {
		$.each($('.taskBody'), function() {
			$(this).show('middle', 'easeOutExpo');
		});
	},
	hideCommentAll: function() {
		$.each($('.taskBody'), function() {
			$(this).hide('middle', 'easeOutExpo');
		});
	},
	saveTask: function() {
		var self = this;
		var saveData = {'task': {}, 'counter': {}};
		$.each($('.task:not(#taskObj, .dummy)'), function() {
			var taskId = $(this).attr('id');
			saveData.task[taskId] = {
							'title' : $('.taskTitle',this).text(),
							'costCode': $('.taskCostCode option:selected', this).val(),
							'yoteiTime' : $('.taskYoteiTime',this).text(),
							'totalTime' : $('.taskTotalTime',this).text(),
							'todayTime' : $('.taskTodayTime',this).text(),
							'projectName' : $('.projectName',this).text(),
							'ticketId' : $('.ticketId',this).text(),
							'sagyosha' : $('.sagyosha',this).text()
						}
			
			var commentData = [];
			$.each($(('.comment'), this), function(){
				commentData.push({
							'body' : $('.commentBody', this).text(),
							'date' : $('.date', this).text()
 						}
				);
			});
			saveData.task[taskId].comment = commentData;
		});
		
		saveData.counter.taskSeq = self.taskSeq;

		localStorage.set(Kanatis.Const.LS_KEY.TASK, saveData);
	},
	setCounter: function() {
		var self = this;
		var taskData = localStorage.get(Kanatis.Const.LS_KEY.TASK);
		if (taskData === null) {
			return false;
		}
		
		self.taskSeq = taskData.counter.taskSeq;
		var counterKeys = Object.keys(self.taskCounter);
		for(var i = 0; i < counterKeys.length; i++) {
			$('#counter_' + counterKeys[i]).text(taskData.counter[counterKeys[i]]);
			self.taskCounter[counterKeys[i]]= taskData.counter[counterKeys[i]];
			
		}
	},
	setTask: function() {
		var self = this;
		var taskData = localStorage.get(Kanatis.Const.LS_KEY.TASK);
		if (taskData === null) {
			return false;
		}
		
		var taskKeys = Object.keys(taskData.task);
		taskKeys.sort();
		for (var i = 0; i < taskKeys.length; i++) {
			var oneTaskData = taskData.task[taskKeys[i]];
			var taskDiv = $('#taskObj').clone(true);
			$('.taskId',taskDiv).text(taskKeys[i]);
			$(taskDiv).attr('id', taskKeys[i]);
			$('.taskTitle', taskDiv).text(oneTaskData.title);
			$('.taskCostCode', taskDiv).val(oneTaskData.costCode);
			$('.taskYoteiTime', taskDiv).text(oneTaskData.yoteiTime);
			$('.taskTotalTime', taskDiv).text(oneTaskData.totalTime);
			$('.taskTodayTime', taskDiv).text(oneTaskData.todayTime);
			$('.projectName', taskDiv).text(oneTaskData.projectName);
			$('.ticketId', taskDiv).text(oneTaskData.ticketId);
			$('.sagyosha', taskDiv).text(oneTaskData.sagyosha);
			
			$('.taskHead', taskDiv).attr('class', 'taskHead bgDred');
			$('.taskBody', taskDiv).attr('class', 'taskBody bgLred'); 
			
			for (var j = 0; j < oneTaskData.comment.length; j++) {
				var $commentDiv = $('#commentObj').clone(true);
				$commentDiv.attr('id', '');
				$commentDiv.css('display', 'block');
				$('.commentBody', $commentDiv).text(oneTaskData.comment[j].body);
				$('.date', $commentDiv).text(oneTaskData.comment[j].date);
				$('.commentBox', taskDiv).append($commentDiv);
			}
			
			$(taskDiv).css('display', 'block');
			$('#taskBox_TODO').prepend(taskDiv);

		}
	},
	condTask: function(type) {
		var self = this;
		var taskDataList = $('.task').not('.dummy').not('#taskObj');
		
		var counter = {
				'TODO': 0,
				'DOING': 0,
				'DONE': 0
		}
		
		var doCondTask = function() {
			return {
				category: function() {
					var selectedCategory = $('#condCategory option:selected').text();
					for (var i = 0; i < taskDataList.length; i++) {
						var taskData = taskDataList[i];
						if (selectedCategory === 'ALL' || $('.taskCategory', taskData).text() === selectedCategory) {
							counter[$(taskData).attr('data-status')]++;
							$(taskData).css('display', 'block');
						} else {
							$(taskData).css('display', 'none');
						}
					}
				},
				limitTo: function() {
					var limitTo = $('#condLimitTo').val();
					for (var i = 0; i < taskDataList.length; i++) {
						var taskData = taskDataList[i];
						if ($('.taskLimit', taskData).text() < limitTo) {
							counter[$(taskData).attr('data-status')]++;
							$(taskData).css('display', 'block');
						} else {
							$(taskData).css('display', 'none');
						}
					}
				}
			}
		}();
			
		doCondTask[type]();
		
		$('#counter_TODO').text(counter.TODO);
		$('#counter_DOING').text(counter.DOING);
		$('#counter_DONE').text(counter.DONE);
	},
	sortTask: function() {
		var sortTypeMap = {
				'1': 'taskCategory',
				'2': 'taskLimit',
				'3': 'taskId'
		}
		var sortClass = sortTypeMap[$('input:radio[name="sortType"]:checked').val()];
		var orderType = $('#orderSwitch p[data-switch="on"]').text();
		var sortJoken = function(a, b) {
			var a = $('.' + sortClass, a).text();
			var b = $('.' + sortClass, b).text();
			if (orderType === 'ASC') {
				if (a > b)  return 1;
			    if (a < b)  return -1;
			} else {
				if(a > b)  return -1;
				if(a < b)  return 1;
			}
		    return 0;
		};
		
		var statusKeys = Object.keys(Kanatis.Const.TASK_STATUS);
		for(var i = 0; i < statusKeys.length; i++) {
			var sortedObj = $($('.task[data-status="' + statusKeys[i] + '"]').not('.dummy').not('#taskObj')).sort(sortJoken);
			var taskBox = $('#taskBox_' + statusKeys[i]);
			$(taskBox).children('.task').not('.dummy').detach();
			$(taskBox).prepend(sortedObj);
		}
	},
	sortTaskOrder: function(elem) {
		var self = this;
		$(elem).attr('class', 'fl bgDgray')
				.attr('data-switch', 'on')
				.css('opacity', '1')
				.unbind("mouseenter")
				.unbind("mouseleave");
		
		$(elem).siblings()
				.attr('class', 'fl bgLgray')
				.attr('data-switch', 'off')
		$(elem).siblings().hover(function(){ $(this).css('opacity', '0.7') }
					, function(){ $(this).css('opacity', '1') }
		);
		self.sortTask();
	}
}

var timerTmp = null;
function toggleTimer(self){
  if ($(self).attr('data-active') !== 'true'){
    myStart=new Date();  // スタート時間を退避
    TodayTimeStr = $(self).parents('.task').find('.taskTodayTime').text();
    
    $('.taskTodayTime').css('font-size', '').css('color', '').css('letter-spacing', '');;
    $('.taskHead').css('background-color', '');
    $('.sashWrap').hide(300);
    $('.taskHead').attr('data-active', 'false');
    
    $('.taskTodayTime', self).css('font-size', '30px').css('color', 'rgb(252, 248, 143)').css('letter-spacing', '5px');
    $(self).css('background-color', 'rgb(243, 127, 127)');
    $('.sashWrap',self).show(300);
    $(self).attr('data-active', 'true');
    
    if (TodayTimeStr) {
    	var times = TodayTimeStr.split(':');
    	var startTime = myStart.getTime() - parseInt(times[0]*60*60*1000) - parseInt(times[1]*60*1000) - parseInt(times[2]*1000); // 通算ミリ秒計算
    } else {
    	var startTime = myStart.getTime();
    }
    clearInterval(timerTmp); 
    timerTmp = setInterval(function() {myDisp($(self).parents('.task').find('.taskTodayTime'), startTime)},1000);
  }else{                 // Stopボタンを押した
    myDisp();
    $('.taskTodayTime', self).css('font-size', '').css('color', '').css('letter-spacing', '');
    $(self).css('background-color', '');
    $('.sashWrap',self).hide(300);
    $(self).attr('data-active', 'false');
    clearInterval(timerTmp); 
  }
}

function myDisp(target, startTime){
    stopDate = new Date();  // 経過時間を退避
    time = stopDate.getTime() - startTime;
    hour = Math.floor(time / (60 * 60 * 1000)); // '時間'取得
    time = time - (hour * 60 * 60 * 1000);
    minute = Math.floor(time / (60 * 1000)); // '分'取得
    time = time - (minute * 60 * 1000);
    second = Math.floor(time / 1000); // '秒'取得
    $(target).text(hour.get0FillStr(2) + ":" 
    				+ minute.get0FillStr(2) + ":"  
    				+ second.get0FillStr(2));
}