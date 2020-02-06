/**
 * This function save and update vendor's personal info data in to the database
 * Calling page : users/addedit/vendor/
 */
$("form#personal_info_form .send").click(function(e) {
  //$("form#personal_info_form").submit(function(e) {
    e.preventDefault();
    //alert("sdssd");
    
    let myForm = document.getElementById('personal_info_form');
    let formData = new FormData(myForm);

    var action = $("#personal_info_form").attr('action');

    $.ajax({
      type: "POST",
      url: action,
      data: formData,
      dataType: 'json',
      contentType: 'application/json',
      processData: false,
      contentType: false,
      success: function(data) {
        //console.log(data);
        var obj = JSON.parse(JSON.stringify(data));
        console.log("OOOOOOOOOOOOOO = " + obj);
        // console.log("ID = " + obj.user.id);
        if(obj.success == 'Mobile no already registered') {
          $(".succ_msg, .succ_err").remove();
          $('<div class="succ_err msg"><i class="fa fa-exclamation-triangle" aria-hidden="true"></i>&nbsp;Mobile no already registered!</div>').insertBefore($(".x_content"));
          $("html, body").animate({scrollTop: $("#top").offset().top}, 500);
        } else 
        if(obj.success == 'true') {
          // if (history.pushState) {
          //   var newurl = window.location.protocol + "//" + window.location.host + window.location.pathname + '?para=hello';
          //   window.history.pushState({path:newurl},'',newurl);
          // }
          //$.history.load(window.location.href + "/"+obj.user.id);
          window.history.pushState("", "", window.location.href + "/"+obj.user.id);
          $("form#personal_info_form .vendor_id").val(obj.user.id);
          $(".page-title h3").html = "Update Vendor";
          $(".succ_msg, .succ_err").remove();
          $('<div class="succ_msg msg"><i class="fa fa-exclamation-triangle" aria-hidden="true"></i>&nbsp;Done! Vendor personal info saved!</div>').insertBefore($(".x_content"));
          $("html, body").animate({scrollTop: $("#top").offset().top}, 500);
          $(".send").removeClass("disabled");
        } else {
          $('<div class="succ_err msg"><i class="fa fa-exclamation-triangle" aria-hidden="true"></i>&nbsp;Failed! Something wrong, please try again.</div>').insertBefore($(".x_content"));
          $("html, body").animate({scrollTop: $("#top").offset().top}, 500);
        }
      },
      error:function(error) {
          console.log(error.responseText());
      }
  });
});





/**
 * This function update vendor catgeory and sub-category in to the database
 * Calling page : users/addedit/vendor/
 */
$("form#category_info_form .send").click(function(e) {
  e.preventDefault();
  //var id = $(this).val();
  let myForm = document.getElementById('category_info_form');
  let formData = new FormData(myForm);

  var action = $("#category_info_form").attr('action');

  $.ajax({
    type: "POST",
    url: action,
    data: formData,
    dataType: 'json',
    contentType: 'application/json',
    processData: false,
    contentType: false,
    success: function(data) {
      //console.log(data);
      var obj = JSON.parse(JSON.stringify(data));
      if(obj.success == 'true') {
        $("form#category_info_form .vendor_id").val(obj.user_id);
        $(".page-title h3").html = "Update Vendor";
        $(".succ_msg, .succ_err").remove();
        $('<div class="succ_msg msg"><i class="fa fa-exclamation-triangle" aria-hidden="true"></i>&nbsp;Done! Vendor category info updated!</div>').insertBefore($(".x_content"));
        $("html, body").animate({scrollTop: $("#top").offset().top}, 500);
      } else {
        $('<div class="succ_err msg"><i class="fa fa-exclamation-triangle" aria-hidden="true"></i>&nbsp;Failed! Something wrong, please try again.</div>').insertBefore($(".x_content"));
        $("html, body").animate({scrollTop: $("#top").offset().top}, 500);
      }
    },
    error:function(error) {
        console.log(error);
    }
  });
});





/**
 * This function update vendor catgeory and sub-category in to the database
 * Calling page : users/addedit/vendor/
 */
/*$("form#sub_cat_form_artist .send").click(function(e) {vendor-sub-categorycontents-info
  e.preventDefault();

  var vendor_id = $("form#sub_cat_form_artist .vendor_id").val();
  var artist_row_id = $("form#sub_cat_form_artist .artist_row_id").val();
  let myForm = document.getElementById('sub_cat_form_artist');
  let formData = new FormData(myForm);

  var action = $("#sub_cat_form_artist").attr('action');
  //alert(action);
  $.ajax({
    type: "POST",
    url: action,
    data: formData,
    dataType: 'json',
    contentType: 'application/json',
    processData: false,
    contentType: false,
    success: function(data) {
      //console.log(data);
      var obj = JSON.parse(JSON.stringify(data));
      console.log(obj);
      if(obj != '') {
        if(artist_row_id == '') {
          $("form#sub_cat_form_artist .artist_row_id").val(obj.vendor.id);
          $("form#sub_cat_form_artist .vendor_id").val(obj.vendor.vendor_id);
        }
        $(".page-title h3").html = "Update Vendor";
        $(".succ_msg, .succ_err").remove();
        $('<div class="succ_msg msg"><i class="fa fa-exclamation-triangle" aria-hidden="true"></i>&nbsp;Done! Artist / Talent info saved!</div>').insertBefore($(".x_content"));
        $("html, body").animate({scrollTop: $("#top").offset().top}, 500);
      } else {
        $('<div class="succ_err msg"><i class="fa fa-exclamation-triangle" aria-hidden="true"></i>&nbsp;Failed! Something wrong, please try again.</div>').insertBefore($(".x_content"));
        $("html, body").animate({scrollTop: $("#top").offset().top}, 500);
      }
    },
    error:function(error) {
        console.log(error.responseText);
    }
  });
});*/





/**
 * This function update vendor catgeory and sub-category in to the database
 * Calling page : users/addedit/vendor/
 */
$("form#company_info_form .send").click(function(e) {
  e.preventDefault();

  let myForm = document.getElementById('company_info_form');
  let formData = new FormData(myForm);

  var action = $("#company_info_form").attr('action');

  $.ajax({
    type: "POST",
    url: action,
    data: formData,
    dataType: 'json',
    contentType: 'application/json',
    processData: false,
    contentType: false,
    success: function(data) {
      //console.log(data);
      var obj = JSON.parse(JSON.stringify(data));
      console.log(obj);
      //console.log("BBBBBBBBBBBBBBBBBBBBBb " + obj.uploaded_files.company_pan);
      if(obj.success == 'true') {
        $("form#company_info_form .vendor_id").val(obj.user_id);
        ChangeUrl('', obj.user_id);
        $(".page-title h3").html = "Update Vendor";
        $(".succ_msg, .succ_err").remove();
        $('<div class="succ_msg msg"><i class="fa fa-exclamation-triangle" aria-hidden="true"></i>&nbsp;Done! Vendor company profile info updated!</div>').insertBefore($(".x_content"));
        $("html, body").animate({scrollTop: $("#top").offset().top}, 500);
      } else {
        $('<div class="succ_err msg"><i class="fa fa-exclamation-triangle" aria-hidden="true"></i>&nbsp;Failed! Something wrong, please try again.</div>').insertBefore($(".x_content"));
        $("html, body").animate({scrollTop: $("#top").offset().top}, 500);
      }
    },
    error:function(error) {
        console.log(error);
    }
  });
});








/**
 * This function update vendor catgeory and sub-category in to the database
 * Calling page : users/addedit/vendor/
 */
$("form.vendor_sub_category_contents_info").submit(function(e) {
  e.preventDefault();

  var form          = $(this);
  var vendor_id     = form.find('.vendor_id').val();
  var artist_row_id = form.find('.artist_row_id').val();
  var awards_id     = form.find('.awards_id').val();
  var action        = form.attr('action');
  var sub_cat_tab   = form.find('#sub_cat_tab').val();
  var formData      = new FormData($(this)[0]);

  $.ajax({
    type: "POST",
    url: action,
    data: formData,
    dataType: 'json',
    contentType: 'application/json',
    processData: false,
    contentType: false,
    success: function(data) {
      //console.log(data);
      var obj = JSON.parse(JSON.stringify(data));
      //console.log(obj);
      if(obj.success = 'true') {
        if(artist_row_id == '') {
          form.find('.artist_row_id').val(obj.vendor.id);
        } else if(awards_id == '') {
          form.find('.awards_id').val(obj.vendor.awards_id);
        } else if(vendor_id == '') {
          form.find('.vendor_id').val(obj.vendor.awards_id);
        }

        if(sub_cat_tab == "awards_tab") {
          $("."+awards_id+"_awards_location").text();
          $("."+awards_id+"_awards_location").text();
          $("."+awards_id+"_awards_location").text();
        }

        $(".page-title h3").html = "Update Vendor";
        $(".succ_msg, .succ_err").remove();
        $('<div class="succ_msg msg"><i class="fa fa-exclamation-triangle" aria-hidden="true"></i>&nbsp;Done! Artist / Talent info saved!</div>').insertBefore($(".x_content"));
        $("html, body").animate({scrollTop: $("#top").offset().top}, 500);
      } else {
        $('<div class="succ_err msg"><i class="fa fa-exclamation-triangle" aria-hidden="true"></i>&nbsp;Failed! Something wrong, please try again.</div>').insertBefore($(".x_content"));
        $("html, body").animate({scrollTop: $("#top").offset().top}, 500);
      }
    },
    error:function(error) {
        console.log(error.responseText);
    }
  });
});







/**
 * This function save new and update existing awards and achievements data into the table 
 * Calling page : users/addedit/vendor/
 */
$("form.vendor_awards_achievements_info, form.vendor_work_history_info").submit(function(e) {
  e.preventDefault();

  var form            = $(this);
  var sub_cat_tab     = form.find('#sub_cat_tab').val();
  var awards_id       = form.find('.awards_id').val();
  var work_history_id = form.find('.work_history_id').val();
  //var album_id        = form.find('.album_id').val();
  var action          = form.attr('action');
  var btn_text        = form.find('.send').text();
  var formData        = new FormData($(this)[0]);

  $.ajax({
    type: "POST",
    url: action,
    data: formData,
    dataType: 'json',
    contentType: 'application/json',
    processData: false,
    contentType: false,
    success: function(data) {
      var obj = JSON.parse(JSON.stringify(data));
      
      if(obj.success = 'true') {
        if(sub_cat_tab == "awards_tab") {
            if(awards_id == '') {
              form.find('.awards_id').val(obj.awards.awards_id);
              form.find('.vendor_id').val(obj.awards.vendor_id);
            }

            if(btn_text == 'Save') {
                /*Remove the no record found row befor displying newly added data to the list*/
                $("tr#oc-nrf").remove();
                /*Display the just created new awards and achievements row in the list*/
                $('<tr><td>1</td><td class="'+obj.awards.awards_id+'_awards_title">'+obj.awards.awards_title+'</td><td class="'+obj.awards.awards_id+'_awards_location">'+obj.awards.awards_location+'</td><td class="'+obj.awards.awards_id+'_awards_date">'+obj.awards.awards_date+'</td><td><a class="btn btn-info btn-xs oc-btn-edit" id="'+obj.awards.awards_id+'"><i class="fa fa-pencil"></i> Edit </a><a id="delete" href="#" class="btn btn-danger btn-xs" onclick="return(confirm("Do you really want to delete?"));"><i class="fa fa-trash-o"></i> Delete </a></td></tr>').insertAfter($("tr.insert-after"));
            } else if(btn_text == 'Update') {
                $("."+obj.awards.awards_id+"_awards_title").html(obj.awards.awards_title);
                $("."+obj.awards.awards_id+"_awards_location").html(obj.awards.awards_location);
                $("."+obj.awards.awards_id+"_awards_date").html(obj.awards.awards_date);
            }
        } else if(sub_cat_tab == "work_history_tab") {
            if(work_history_id == '') {
              form.find('.work_history_id').val(obj.work_history.work_history_id);
              form.find('.vendor_id').val(obj.work_history.vendor_id);
            }

            //alert(btn_text);
            if(btn_text == 'Save') {
                /*Remove the no record found row befor displying newly added data to the list*/
                $("tr#oc-nrf").remove();
                /*Display the just created new awards and achievements row in the list*/
                $('<tr><td>1</td><td class="'+obj.work_history.work_history_id+'_project_name">'+obj.work_history.project_name+'</td><td class="'+obj.work_history.work_history_id+'_project_location">'+obj.work_history.project_location+'</td><td class="'+obj.work_history.work_history_id+'_about_project">'+obj.work_history.about_project+'</td><td class="'+obj.work_history.work_history_id+'_project_date">'+obj.work_history.project_date+'</td><td><a class="btn btn-info btn-xs oc-btn-edit" id="'+obj.work_history.work_history_id+'"><i class="fa fa-pencil"></i> Edit </a><a id="delete" href="#" class="btn btn-danger btn-xs" onclick="return(confirm("Do you really want to delete?"));"><i class="fa fa-trash-o"></i> Delete </a></td></tr>').insertAfter($("tr.insert-after"));
            } else if(btn_text == 'Update') {
                $("."+obj.work_history.work_history_id+"_project_name").html(obj.work_history.project_name);
                $("."+obj.work_history.work_history_id+"_project_location").html(obj.work_history.project_location);
                $("."+obj.work_history.work_history_id+"_about_project").html(obj.work_history.about_project);
                $("."+obj.work_history.work_history_id+"_project_date").html(obj.work_history.project_date);
            }
        }


        /*Change the serial number of the list when new entry is inserted in the list*/
        $(".serial_no").each(function() {
          if($(this).text() != '1') {
            $(this).text(parseInt($(this).text()) + 1);
          }  
        });

        /*Change the button value from "Save" to "Update" when new entry is created.*/
        $(form.find(".send").text("Update"));

        $(".succ_msg, .succ_err").remove();
        $('<div class="succ_msg msg"><i class="fa fa-exclamation-triangle" aria-hidden="true"></i>&nbsp;Done! Artist / Talent info saved!</div>').insertBefore($(".x_content"));
        $("html, body").animate({scrollTop: $("#top").offset().top}, 500);
      } else {
        $('<div class="succ_err msg"><i class="fa fa-exclamation-triangle" aria-hidden="true"></i>&nbsp;Failed! Something wrong, please try again.</div>').insertBefore($(".x_content"));
        $("html, body").animate({scrollTop: $("#top").offset().top}, 500);
      }
    },
    error:function(error) {
        console.log(error.responseText);
    }
  });
});







/**
 * Upload images and videos from the gallery tab
 */
$("form#sub_cat_form_gallery").submit(function(e) {
    e.preventDefault();
    var form = $(this);
    var vendor_id = form.find('#vendor_id').val();
    var album_id        = form.find('.album_id').val();
    var action          = form.attr('action');
    var btn_text        = form.find('.send').text();

    if(vendor_id != '') {
      $(".overlay").css('display','block');
      var action = form.attr('action');
      let formData = new FormData(form[0]);

      $.ajax({
        type: "POST",
        url: action,
        data: formData,
        dataType: 'json',
        contentType: 'application/json',
        processData: false,
        contentType: false,
        success: function(data) {
          $(".overlay").css('display','none');
          $(".oc-add-btn").trigger('click');
          var obj = JSON.parse(JSON.stringify(data));
          //console.log("OOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOO " + obj.album.id);
          if(obj.success == 'true') {
            $(".succ_msg, .succ_err, #tr_"+vendor_id).remove();
            $('<div class="succ_msg msg"><i class="fa fa-exclamation-triangle" aria-hidden="true"></i>&nbsp;Done! Files uploaded successfully.</div>').insertBefore($(".x_content"));
            $("html, body").animate({scrollTop: $("#top").offset().top}, 500);
            if(album_id == '') {
              form.find('.album_id').val(obj.album.id);
            }
              //alert(btn_text);
            if(btn_text == 'Save') {
              /*Remove the no record found row befor displying newly added data to the list*/
              $("tr#oc-nrf").remove();
              /*Display the just created new awards and achievements row in the list*/
              $('<tr><td>1</td><td class="'+obj.album.id+'_album_name">'+obj.album.album_name+'</td><td class="'+obj.album.id+'_createdAt">'+obj.album.createdAt+'</td><td class="'+obj.album.id+'_status">'+obj.album.status+'</td><td><a class="btn btn-info btn-xs oc-btn-edit" id="'+obj.album.id+'" data-for="gallery_tab"><i class="fa fa-pencil"></i> Edit </a><a id="delete" href="#" class="btn btn-danger btn-xs" onclick="return(confirm("Do you really want to delete?"));"><i class="fa fa-trash-o"></i> Delete </a></td></tr>').insertAfter($("tr.insert-after"));
            } else if(btn_text == 'Update') {
                $("."+obj.album.id+"_album_name").html(obj.album.album_name);
            }
          } else {
            $('<div class="succ_err msg"><i class="fa fa-exclamation-triangle" aria-hidden="true"></i>&nbsp;Failed! Something wrong, please try again.</div>').insertBefore($(".x_content"));
            $("html, body").animate({scrollTop: $("#top").offset().top}, 500);
          }
        },
        error:function(error) {
            $(".overlay").css('display','none');
            $(".oc-add-btn").trigger('click');
            console.log(error);
        }
      });
    
    }
});







/**
 * This function returns sub category list based on the selecton of category
 * Calling page : users/addedit/vendor/
 */
$("#vendor_category").change(function() {
    var id = $(this).val();
    var str = '{"data":{"category_id":'+id+'}}';

    $.ajax({
    type: "POST",
    url: "http://localhost:3301/api/v1/getAllSubCategory",
    data: str,
    dataType: 'json',
    contentType: 'application/json',
    success: function(data) {
      if(data != '') {
        var obj = JSON.parse(JSON.stringify(data));
        var str = '<option value="">Choose...</option>';
        for (var i = 0; i < obj.data.subCategorydetail.length; i++) {
            str = str + '<option value="'+obj.data.subCategorydetail[i].id+'">'+obj.data.subCategorydetail[i].title+'</option>';
        }
        $('#vendor_sub_category').html(str);
      }
    }
  });
});




/**
 * Load existing particular award or achievement data from the list into the form for updating
 */
$(document).on("click", "a.oc-btn-edit", function() {
  var tab = $(this).attr('data-for');
  if(tab == 'awards_tab') {

      var awards_id = $(this).attr('id');
      var awards_title = $("."+awards_id+"_awards_title").text();
      var awards_location = $("."+awards_id+"_awards_location").text();
      var awards_date = $("."+awards_id+"_awards_date").text();

      $("form#sub_cat_form_awards .awards_id").val(awards_id);
      $("form#sub_cat_form_awards #awards_title").val($.trim(awards_title));
      $("form#sub_cat_form_awards #awards_location").val($.trim(awards_location));
      $("form#sub_cat_form_awards #awards_date").val($.trim(awards_date));
      $("form#sub_cat_form_awards .send").html("Update");
      $("html, body").animate({scrollTop: $("#top").offset().top}, 500);

  } else if(tab == 'work_tab') {

      var work_history_id = $(this).attr('id');
      var project_name = $("."+work_history_id+"_project_name").text();
      var project_location = $("."+work_history_id+"_project_location").text();
      var project_date = $("."+work_history_id+"_project_date").text();
      var about_project = $("."+work_history_id+"_about_project").text();

      $("form#sub_cat_form_work_history .work_history_id").val(work_history_id);
      $("form#sub_cat_form_work_history #project_name").val($.trim(project_name));
      $("form#sub_cat_form_work_history #project_location").val($.trim(project_location));
      $("form#sub_cat_form_work_history #project_date").val($.trim(project_date));
      $("form#sub_cat_form_work_history #about_project").val($.trim(about_project));
      $("form#sub_cat_form_work_history .send").html("Update");
      $("html, body").animate({scrollTop: $("#top").offset().top}, 500);
  } else if(tab == 'gallery_tab') {

    var album_id = $(this).attr('id');
    var album_name = $("."+album_id+"_album_name").text();
    alert(album_name);

    $("form#sub_cat_form_gallery .album_id").val(album_id);
    $("form#sub_cat_form_gallery #album_name").val($.trim(album_name));
    $("form#sub_cat_form_gallery .send").html("Update");
    $("html, body").animate({scrollTop: $("#top").offset().top}, 500);
}
});






/**
 * Reset the form and set the value of the H_id field to null and set the button text to "Save"
 */
$(".oc-add-btn").click(function() {
    var form_id = $(this).attr("data-form");
    $("#"+form_id+" #H_id").val('');
    $("#"+form_id+" button.send").html('Save');
    $("#"+form_id).trigger('reset');
});






/**
 * Scroll down or up the page at the point of the list
 */
$(".oc-list-btn").click(function() {
  var selector = $(this).attr('data-for');
  $("html, body").animate({scrollTop: $('.'+selector).offset().top}, 500);
});





/**
 * Delete record from the table as well as from the display list also
 */
$(document).on('click', '.oc_delete_btn', function() {

  var confirmation = confirm("Are you sure to delete this record?");
  if(confirmation) {
    var id = $(this).attr('delete-row');
    if(id != '') {
      var form = $("#delete_form_"+id);
      var action = form.attr('action');
      let formData = new FormData(form[0]);

      $.ajax({
        type: "POST",
        url: action,
        data: formData,
        dataType: 'json',
        contentType: 'application/json',
        processData: false,
        contentType: false,
        success: function(data) {
          var obj = JSON.parse(JSON.stringify(data));
          if(obj.success == 'true') {
            $(".oc-add-btn").trigger('click');
            $(".succ_msg, .succ_err, #tr_"+id).remove();
            $('<div class="succ_msg msg"><i class="fa fa-exclamation-triangle" aria-hidden="true"></i>&nbsp;Deleted! Record deleted successfully.</div>').insertBefore($(".x_content"));
            $("html, body").animate({scrollTop: $("#top").offset().top}, 500);
          } else {
            $('<div class="succ_err msg"><i class="fa fa-exclamation-triangle" aria-hidden="true"></i>&nbsp;Failed! Something wrong, please try again.</div>').insertBefore($(".x_content"));
            $("html, body").animate({scrollTop: $("#top").offset().top}, 500);
          }
        },
        error:function(error) {
            console.log(error);
        }
      });
    
    }
  }

});








/**
 * dynamic question 
 */
$(document).ready(function () {
  $("#save").click(function () {  
      // var id = $(this).val();
      var question = $("#question").val();
      //alert(id);
      //var str = '{"data":{"category_id":'+id+'}}';
      var answer_type = $("#answer_type").val();
      var no_of_options = $("#no_of_options").val();
      var status = $("#status").val();


      $.ajax({
        type: "POST",
        url: "/admin/dynamic-question/get-html",
        data: {question:question, answer_type : answer_type, no_of_options : no_of_options, status : status},
        success: function(data) {
          $("#result-box").html(data);
        },
        error:function(error) {
          console.log(error.responseText);
        }
      });
  });
});


// $("#answer_type").change(function() {
//     var id = $(this).val();
//     var question = $("#question").val();
//     //alert(id);
//     //var str = '{"data":{"category_id":'+id+'}}';
//     var answer_type = $(this).val();


//     $.ajax({
//       type: "POST",
//       url: "get-html",
//       data: {question:question, answer_type : answer_type},
//       success: function(data) {
//         $("#result-box").html(data);
//       },
//       error:function(error) {
//         console.log(error.responseText);
//       }
//     });
// });











/*$('.oc-upload-btn').click(function (e) {
  e.preventDefault();
  var action_url = $("#sub_cat_form_gallery").attr("action");
  //alert(action_url);
  $('#sub_cat_form_gallery').ajaxForm({
      target: '#outputImage',
      url: action_url,
      beforeSubmit: function () {
          alert("BS");
          $("#outputImage").hide();
          if($("#uploadImage").val() == "") {
             $("#outputImage").show();
             $("#outputImage").html("<div class='error'>Choose a file to upload.</div>");
             return false; 
          }

          $("#progressDivId").css("display", "block");
          var percentValue = '0%';

          $('#progressBar').width(percentValue);
          $('#percent').html(percentValue);
      },
      uploadProgress: function (event, position, total, percentComplete) {

          var percentValue = percentComplete + '%';
          $("#progressBar").animate({
              width: '' + percentValue + ''
          }, {
              duration: 5000,
              easing: "linear",
              step: function (x) {
                percentText = Math.round(x * 100 / percentComplete);
                  $("#percent").text(percentText + "%");
                if(percentText == "100") {
                     $("#outputImage").show();
                }
              }
          });
      },
      error: function (response, status, e) {
          alert('Oops something went.');
      },
      
      complete: function (xhr) {
          if (xhr.responseText && xhr.responseText != "error")
          {
              $("#outputImage").html(xhr.responseText);
          }
          else{  
               $("#outputImage").show();
                $("#outputImage").html("<div class='error'>Problem in uploading file.</div>");
                $("#progressBar").stop();
          }
      }
  });
});*/



var current_path = window.location.href;
function ChangeUrl(page, url_part) {
  if (typeof (history.pushState) != "undefined") {
      //var obj = { Page: page, Url: url_part };
      //window.history.pushState("object or string", "Title", "new url");
      window.history.replaceState(null, null, current_path + '/' + url_part);
  } else {
      alert("Browser does not support HTML5.");
  }
}



    

