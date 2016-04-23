    var i = 0;
    var url = "http://192.168.1.108:8080/?action=stream";
    var urlToPost = '/controlit';

    var jsUpdate = function() {
        document.image.src = url + "&" + (i++);
    }

    jQuery(document).ready(function($) {

        console.log('app loaded');

        jsUpdate();

        $('input[type="button"]').each(function() {
            $(this).click(function(event) {
                $.post(urlToPost, {
                    buttonPress: $(this).val()
                }, function() {
                    console.log('post sent');
                })
            });
        });
    });
