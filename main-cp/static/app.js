    var i = 0;
    var url = "http://192.168.1.108:8080/?action=stream";
    var urlToPost = '/controlit';

    var jsUpdate = function() {
        document.image.src = url + "&" + (i++);
    }

    jQuery(document).ready(function($) {

        console.log('app loaded');

        jsUpdate();

        //buttons to work
        $('input[type="button"]').each(function() {
            $(this).click(function(event) {
                $.post(urlToPost, {
                    buttonPress: $(this).val()
                }, function() {
                    console.log('post sent');
                })
            });
        });

        //keyboard to work
        $(document).keypress(function(event) {
            var code = event.which || event.keyCode;
            if (code == 37) { //left
                $('input[value="Left"]').trigger('click');
            } else if (code == 38) { //up
                $('input[value="Foward"]').trigger('click');
            } else if (code == 39) { //right
                $('input[value="Right"]').trigger('click');
            } else if (code == 40) { //down
                $('input[value="Back"]').trigger('click');
            }
        });
    });
