$(document).ready(function(){

	$(function(){
		var navbar = $('.navbar-collapse');

		navbar.on('click', 'a', null, function(){
			navbar.collapse('hide');
		});
	});

		// $('.dropdown-menu li a').on('click', function(){
		// 	$(this).parents('.dropdown').find('.btn').html($(this).text() + ' <span class="caret"></span>');
		// 	$(this).parents('.dropdown').find('.btn').val($(this).data('value'));
		// });

});
