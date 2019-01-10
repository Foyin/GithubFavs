$(function() { 
  // Initialize variables
  var $window = $(window);
  var $button = $('button');
  var $searchField = $('input');
  var $searchButton = $("#searchBtn");
  var $favButton = $("#favBtn");
  var $repoTable = $("#repoTable");
  var $mainPage = $('.main.page');
  var $searchTab = $('.searchTab');
  var $favTab = $('.favTab');
  var $favBody = $('#favBody');
  var reposjson;

  $favTab.toggle(); 
  $mainPage.show();
  $searchTab.show();
  $searchField.focus();


  $favButton.click(function (key) {
	$favTab.fadeIn("slow");
  });

  /*Check if input field is empty every second
  setInterval(function(){
	if (!$searchField.val()){
		$repoTable.children().remove();

	}
  }
  ,1000);
  */

  $(".close").click(function(){
  	$(this).parent().parent().fadeOut();
  });

  function SlideUPremove(){ 
    $(this).slideUp(150, function() {
        $(this).remove(); 
    });
  }

  function main(){
  	$("#repoTable > .listItem").remove();
  	$("#repoTable > .dropDownMenu").remove();
  	$("#backgroundMessage").remove();

	/*$(".listItem").fadeTo(1000, 0.01, SlideUPremove);
  	$(".dropDownMenu").fadeTo(1000, 0.01, SlideUPremove);
  	$("#backgroundMessage").fadeTo(1000, 0.01, SlideUPremove);*/
		        
	$.when(
		$.getJSON("https://api.github.com/search/repositories?q="+$searchField.val()+"&sort=stars&order=desc",    function(data) {
			reposjson = data;
		})  
	).then(function() {
		if (reposjson) {
			if(reposjson.items.length === 0){alert("No such repository exists");}
			for (i = 0; i < reposjson.items.length; i++) {
				$repoTable.append("<button class=listItem>" + reposjson.items[i].name +"</button>"+
				                  "<div class=dropDownMenu>"+
						  "<p><b>" + "Description: </b>" + reposjson.items[i].description +"</p>" +
				                  "<p><b>" + "Language: </b>"+ reposjson.items[i].language +"</p>" +
				                  "<p><b>" + "Size: </b>" + reposjson.items[i].size +"KB</p>" +
				                  "<p><b>" + "Number of forks: </b>" + reposjson.items[i].forks +"</p>" +
				                  "<p><b>" + "Watchers: </b>" + reposjson.items[i].watchers +"</p>" +
				                  "<p><b>" + "Repository Score: </b>" + reposjson.items[i].score +"</p>" +
				                  "<p><b>" + "Date created: </b>" + reposjson.items[i].created_at.substring(0,10) +"</p>" +
				                  "<p><a href=https://github.com/" + reposjson.items[i].full_name +" target=_blank>Visit Repository</a></p><button class=addFav><span class=tooltiptext>Add To Favourites</span></button></div>").hide().fadeIn();
				$(".addFav").addClass("fas fa-star");
				$(".addFav").addClass("tooltip");
			  }
			$(".listItem").click(function(){
				$(this).next().toggle("slow");
			});

			$(".addFav").click(function(){
				var $listItem = $(this).parent().prev();
				var $itemInfo = $(this).parent();
				//var $favItemID = $favBody.find($("#"+ $itemInfo.attr('id'))).attr('id');
				//var $favItemName = $('#' + $favItemID).prev().text();
				
				$favBody.append($listItem.clone(true, true));
				$favBody.append($itemInfo.clone(true, true).toggle());
				$("#favBody .dropDownMenu .addFav").remove();
				$("#favBody .dropDownMenu").append("<button class=removeFav></button>");
				$("#favBody .removeFav").addClass("far fa-trash-alt");
				$('#favBody button').removeDuplicates();
				$('#favBody div').removeDuplicates();

				$(".removeFav").click(function(){
					$(this).parent().prev().remove();
					$(this).parent().remove();
				});
			});

			  
		}
		else {
			console.log("Error JSON file not found");
		}
	    
	   });


  }

  $searchButton.click(main);
  $searchField.keypress(function (key) {
	if (key.which == 13) {
		main();  
  	}
  });

});

(function($) {
  
  $.fn.removeDuplicates = function() {
	var $original = $([]);

	this.each(function(i, el) {
		var $el = $(el),
			isDuplicate;

		$original.each(function(i, orig) {
			if (el.isEqualNode(orig)) {
				isDuplicate = true;
				$el.remove();
			}
		});

		if (!isDuplicate) {
			$original = $original.add($el);
		}
	});

	return $original;
  };
}(jQuery));
