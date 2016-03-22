$(function() {
  Vue.filter('dateFormat',  function(value) {
    if (!value) {
      return;
    }
    return value.substring(0,10);
  });

  var app = new Vue({
    el: '#app',
    data: {
      colorList: [
        '#D3FFC9', //緑
        '#FFD5B3', //オレンジ
        '#F9DCFF', //紫
        '#C9D8FF', //青
        '#B3ECFF', //水色
        '#ECFFD3', //黄緑
        '#FFD7E7', //赤
        '#FFEBB4', //黄色
      ],
      isNew: true,
      tasks: [],
      sortKey: '',
      filterKey: '',
      detailIndex: 0,
      detail: {
        id: '0',
        title: '',
        body: '',
        fromUser: '',
        toUser: '',
        count: 1,
        insertDate: ''
      }
    },
    created: function() {
      var self = this;
      self.setCardList();
    },
    methods: {
      setCardList: function() {
        var self = this;
        self.ajax(
          'GET',
          'http://localhost:3000/cards.json',
          null,
          function(data) {
            self.tasks = data;
            $.each(self.tasks, function() {
              this.color = self.getColor();
            });
            self.setCardEvent();
          },
          function(data) {
          },
          null
        );
      },
      addTask: function(){
        var self = this;
        var newTask = self.tasks[-1]; //-1に新規タスクのtmpデータをいれている
        var params = {
          'card[title]' : newTask.title,
          'card[body]' : newTask.body,
          'card[fromUser]' : newTask.fromUser,
          'card[toUser]' : newTask.toUser,
          'card[count]' : 1
        };
        self.tasks.$remove(self.tasks[-1]); // 新規タスクのtmpデータ削除
        self.ajax(
          'POST',
          'http://localhost:3000/cards.json',
          params,
          function(data) {
            self.tasks.unshift(
              {
                'id' : data.id,
                'title' : data.title,
                'body' : data.body,
                'fromUser' : data.fromUser,
                'toUser' : data.toUser,
                'count' : data.count,
                'created_at' : data.created_at,
                'color' : self.getColor()
              }
            );
            self.setCardEventNew();
            $('main').removeClass('blur');
            $('.ui.basic.modal').modal('hide');
          },
          function(data) {
          },
          null
        );
      },
      updateTask: function(elem) {
        var self = this;
        var updateTask = self.tasks[self.detailIndex]; //-1に新規タスクのtmpデータをいれている
        var params = {
          'card[title]' : updateTask.title,
          'card[body]' : updateTask.body,
          'card[fromUser]' : updateTask.fromUser,
          'card[toUser]' : updateTask.toUser,
          'card[count]' : updateTask.count
        };
        self.ajax(
          'PUT',
          'http://localhost:3000/cards/' + updateTask.id + '.json',
          params,
          function(data) {
            self.closeDetail();
          },
          function(data) {
          },
          null
        );
      },
      closeDetail: function() {
        $('main').removeClass('blur');
        $('.ui.basic.modal').modal('hide');
      },
      incrementCount: function() {
        var self = this;
        self.tasks[self.detailIndex].count++;
      },
      deleteTask: function(id, task) {
        if(window.confirm("削除してもよろしいですか？") == false){
          return false;
        }
        var self = this;
        self.tasks.$remove(task);
        self.ajax(
          'DELETE',
          'http://localhost:3000/cards/' + id + '.json',
          null,
          function(data) {
            self.showToast('タスクを削除しました');
          },
          function(data) {

          },
          null
        );
      },
      showDetail: function(index, isNew) {
        var self = this;
        self.detailIndex = index;
        self.isNew = isNew;
        $('.ui.basic.modal').modal('show');
        $('body').find('input, textarea').blur();
      },
      doneTask: function(elem) {
        elem.isDone = true;
      },
      sortBy: function(key) {
        this.sortKey = key;
        this.isReverse[key] = !this.isReverse[key]
      },
      showToast: function(msg) {
      },
      ajax(method, url, params, cbSuccess, cbFailed, context) {
        $.ajax({
          type: method,
          url: url,
          data: params,
          context : context
        }).done(cbSuccess).fail(cbFailed);
      },
      getColor: function() {
        return this.colorList[Math.floor(Math.random() * this.colorList.length)];
      },
      setCardEventNew: function(){
        var self = this;
        setTimeout(function(){
          $($('.task .body')[0]).css('background-color', self.getColor());
          $('.task:not(.go)').addClass('go'); //カード表示アニメーション発火
        }, 700);
      },
      setCardEvent() {
        var self = this;
        setTimeout(function(){
          $.each($('.task'), function() {
            $('.body', this).css('background-color', self.getColor());
          });
          $('.task:not(.go)').addClass('go'); //カード表示アニメーション発火
        }, 700);
      },
    }
  });
});
