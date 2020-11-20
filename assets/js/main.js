$(document).ready(function(){
	$('[data-bs-tooltip]').tooltip();
});

(function($) {
  "use strict";
  $('a.js-scroll-trigger[href*="#"]:not([href="#"])').click(function() {
    if (location.pathname.replace(/^\//, '') == this.pathname.replace(/^\//, '') && location.hostname == this.hostname) {
      var target = $(this.hash);
      target = target.length ? target : $('[name=' + this.hash.slice(1) + ']');
      if (target.length) {
        $('html, body').animate({
          scrollTop: target.offset().top
        }, 1000, "easeInOutExpo");
        return false;
      }
    }
  });
})(jQuery);

String.prototype.toRGB = function() {
    var hash = 0;
    if (this.length === 0) return hash;
    for (var i = 0; i < this.length; i++) {
        hash = this.charCodeAt(i) + ((hash << 5) - hash);
        hash = hash & hash;
    }
    var rgb = [0, 0, 0];
    for (var i = 0; i < 3; i++) {
        var value = (hash >> (i * 8)) & 255;
        rgb[i] = value;
    }
    return `rgb(${rgb[0]}, ${rgb[1]}, ${rgb[2]})`;
}

var searchType = "anime";
function select(type) {
	$('#type-menu strong a.active').removeClass('active');
    $('#type-menu strong a#btn-'+type).addClass('active');
    searchType=type;
}

$("#search-field").on('keyup', function (e) {
    if (e.key === 'Enter' || e.keyCode === 13) {
    	search()
    }
});
$('#submit-btn').click(function() {
    search()
});

function search() {
	var query = document.getElementById('search-field').value;
	if (query.length <3) {
    	alert("Please input at least 3 characters.")
    	return
	}

	var request = new XMLHttpRequest()
	if (searchType == "hentai") {
		request.open('GET', 'https://api.jikan.moe/v3/search/anime?q='+query+'&rated=rx', true)

	} else if (searchType == "vn") {
		request.open('GET', 'https://api.jikan.moe/v3/search/'+searchType+'?q='+query, true)

	} else {
		request.open('GET', 'https://api.jikan.moe/v3/search/'+searchType+'?q='+query, true)
	}

	request.onload = function () {
		var data = JSON.parse(this.response)

		if (request.status >= 200 && request.status < 400) {
      $('#result-list').empty();

	    for (i in data.results) {
        if (i >= 20) { break; }
        if (searchType == "anime" || searchType == "hentai") {
          resultUrl = data.results[i].url;
          resultImg = data.results[i].image_url;
          resultTitle = data.results[i].title;
          resultType = data.results[i].type;
          if (data.results[i].score.toFixed(1) == "0.0") {
            resultScore = "N/A";
          } else {
            resultScore = data.results[i].score.toFixed(1);
          }
          if (data.results[i].synopsis == "") {
            resultDesc = data.results[i].synopsis;
          } else {
            resultDesc = data.results[i].synopsis;
          }
          if (data.results[i].start_date == null) {
            resultSubtitle = "??? — " + data.results[i].episodes + " episodes — " + data.results[i].score + "</em>⭐<em>";
          } else if (data.results[i].airing == true) {
            resultSubtitle = "Airing (" + data.results[i].start_date.substring(0,4) + ") — " + data.results[i].episodes + " episodes — " + resultScore + "</em>⭐<em>";
          } else {
            resultSubtitle = data.results[i].start_date.substring(0,4) + " — " + data.results[i].episodes + " episodes — " + resultScore + "</em> ⭐<em>";
          }

        } else if (searchType == "manga") {
          resultUrl = data.results[i].url;
          resultImg = data.results[i].image_url;
          resultTitle = data.results[i].title;
          resultType = data.results[i].type;
          if (data.results[i].score.toFixed(1) == "0.0") {
            resultScore = "N/A";
          } else {
            resultScore = data.results[i].score.toFixed(1);
          }
          if (data.results[i].synopsis == "") {
            resultDesc = data.results[i].synopsis;
          } else {
            resultDesc = data.results[i].synopsis;
          }
          if (data.results[i].start_date == null) {
            resultSubtitle = "??? — " + data.results[i].volumes + " volumes — " + resultScore + "</em> ⭐<em>";
          } else {
            resultSubtitle = data.results[i].start_date.substring(0,4) + " — " + data.results[i].volumes + " volumes — " + resultScore + "</em> ⭐<em>";
          }

        } else if (searchType == "character") {
          resultUrl = data.results[i].url;
          resultImg = data.results[i].image_url;
          resultTitle = data.results[i].name;
          if (data.results[i].alternative_names.length <= 0) {
            resultSubtitle = "No alternative name";
          } else {
            resultSubtitle = "Alt names: " + data.results[i].alternative_names.join(', ');
          }

          // data.results[i].anime.sort(function(a, b) {
          //     return a.data.results[i].anime.mal_id > b.data.results[i].anime.mal_id;
          // });
          // data.results[i].manga.sort(function(a, b) {
          //     return a.data.results[i].manga.mal_id > b.data.results[i].manga.mal_id;
          // });

          if (jQuery.isEmptyObject(data.results[i].anime)) {
            resultType = "Manga";
            typea = "";
            typem = "";
          } else if (jQuery.isEmptyObject(data.results[i].manga)) {
            resultType = "Anime";
            typea = "";
            typem = "";
          } else if (!jQuery.isEmptyObject(data.results[i].anime) && !jQuery.isEmptyObject(data.results[i].manga)) {
            resultType = "Anime — Manga";
            typea = " <a style='color:grey; font-weight:normal;'>(anime)</a>";
            typem = " <a style='color:grey; font-weight:normal;'>(manga)</a>";
          } else {
            resultType = "Anime / Manga";
            typea = " <a style='color:grey; font-weight:normal;'>(anime)</a>";
            typem = " <a style='color:grey; font-weight:normal;'>(manga)</a>";
          }
          resultDesc = "";

          for (j in data.results[i].anime) {
            resultDesc += "<a href='"+data.results[i].anime[j].url+"' target='_blank'>"+data.results[i].anime[j].name+"</a>"+typea+"<br>";
          }
          if (!jQuery.isEmptyObject(data.results[i].anime) && !jQuery.isEmptyObject(data.results[i].manga)) {
            resultDesc += "<span class='br'></span>";
          }
          for (j in data.results[i].manga) {
            resultDesc += "<a href='"+data.results[i].manga[j].url+"' target='_blank'>"+data.results[i].manga[j].name+"</a>"+typem+"<br>";
          }

        } else if (searchType == "vn") {
          resultUrl = data.results[i].url;
          resultImg = data.results[i].image_url;
          resultTitle = data.results[i].title;
          resultType = data.results[i].type;
          resultSubtitle = data.results[i].episodes + " episodes";
          resultDesc = data.results[i].synopsis;

        }

    		$('#result-list').append(`
                      <div class="col-12 col-sm-6 col-md-4 col-lg-12 result-item" id="result-${i}">
                          <div class="result-container">
                              <a class="result-img" target="_blank" href="${resultUrl}">
                                  <img class="img-fluid" src="${resultImg}" width="48" height="48" loading="lazy">
                              </a>
                              <p class="result-info">
                                  <a href="${resultUrl}" target="_blank">${resultTitle}</a>
                                  <span><em>${resultSubtitle}</em></span>
                                  <span class="text-dark">${resultDesc}</span>
                              </p>
                              <a class="bg-dark open-website" target="_blank" data-toggle="tooltip" data-bs-tooltip="" data-placement="left" href="${resultUrl}" title="View more">
                                  <i class="fas fa-external-link-alt"></i>
                              </a>
                              <span class="border-dark result-type" style="background-color:${resultType.toRGB()}">${resultType}</span>
                          </div>
                      </div>
    			`).hide().fadeIn(400);
	    }

      $('[data-bs-tooltip]').tooltip();
      $('#portfolio').fadeIn(700);
      $('html, body').animate({
          scrollTop: $("#portfolio").offset().top
      }, 1200);
		} else {
	    	alert('An error happened...')
		}
	}

	request.send()
}