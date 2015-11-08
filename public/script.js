//console.log('debug');

var table = '<table class="table table-striped table-hover">' +
        '<thead>' +
            '<tr>' +
                '<th>Recept neve</th>' +
                '<th>Étel típusa</th>' +
                '<th>Beküldés ideje</th>' +
                '<th>Műveletek</th>' +
            '</tr>'    +
        '</thead>' +
        '<tbody>' +
            
        '</tbody>' +
    '</table>';

$('table').each(function () {
    //console.log('alma');
    var successTable = $(table);
    
    $(this).find('tr.text-success').each(function () {
        successTable.find('tbody').append($(this));
    });
   
    successTable.appendTo('div.container');
    $(this).hide();
});

$('#addbutton').on('click', function (event) {
    event.preventDefault();
    $('#messages').fadeOut(300, function () {
        $(this).html('');
        // console.log($('#foodName').val());
        //  console.log($('#ingredients').val());
        //   console.log($('#preparation').val());
        //   console.log($('#foodType').val());
        $.post('/add', {
        foodName: $('#foodName').val(),
        ingredients: $('#ingredients').val(),
        preparation: $('#preparation').val(),
        foodType: $('#foodType').val() 
    })
    .done(function (response) {
        for (var type in response) {
            //console.log(response);
            response[type].forEach(function (error) {
                $('#messages')
                    .prepend($('<div class="alert alert-' + (type == 'error' ? 'danger' : type) + '">' + 
                    '<button type="button" class="close" data-dismiss="alert">×</button>' +
                    error + 
                    '</div>'));
            });
        }
        $('#messages').fadeIn(300);
    })
    .fail(function (errors) {
        var err = errors.responseJSON;
        for (var type in err) {
            //console.log(err);
            err[type].forEach(function (error) {
                $('#messages')
                    .prepend($('<div class="alert alert-' + (type == 'error' ? 'danger' : type) + '">' + 
                    '<button type="button" class="close" data-dismiss="alert">×</button>' +
                    error + 
                    '</div>'));
            });
        }
        $('#messages').fadeIn(300);
    });
    }); 
    
});

$('#alterButton').on('click', function (event) {
    event.preventDefault();
    $('#messages').fadeOut(300, function () {
        $(this).html('');
        // console.log($('#foodName').val());
        //  console.log($('#ingredients').val());
        //   console.log($('#preparation').val());
        //   console.log($('#foodType').val());
        $.post('/alter', {
        foodName: $('#foodName').val(),
        ingredients: $('#ingredients').val(),
        preparation: $('#preparation').val(),
        foodType: $('#foodType').val(),
        id: $('#id').val()
    })
    .done(function (response) {
        for (var type in response) {
            //console.log(response);
            response[type].forEach(function (error) {
                $('#messages')
                    .prepend($('<div class="alert alert-' + (type == 'error' ? 'danger' : type) + '">' + 
                    '<button type="button" class="close" data-dismiss="alert">×</button>' +
                    error + 
                    '</div>'));
            });
        }
        $('#messages').fadeIn(300);
    })
    .fail(function (errors) {
        var err = errors.responseJSON;
        for (var type in err) {
            //console.log(err);
            err[type].forEach(function (error) {
                $('#messages')
                    .prepend($('<div class="alert alert-' + (type == 'error' ? 'danger' : type) + '">' + 
                    '<button type="button" class="close" data-dismiss="alert">×</button>' +
                    error + 
                    '</div>'));
            });
        }
        $('#messages').fadeIn(300);
    });
    }); 
    
});

$('.details').on('click', function (event) {
    event.preventDefault();
    console.log('debug');
    var href = $(this).attr('href');
    $.get('modal')
        .done(function (data) {
            var modal = $(data).modal({show: false});
            modal.appendTo('#modals');
            //console.log();
            $.get(href)
                .done(function (data) {
                    modal.find('.modal-body').html($(data));
                    modal.find('a[href="/list"]').click(function(event){
                        event.preventDefault();
                        modal.modal('hide');
                    });
                    modal.modal('show');
                });
        });
});