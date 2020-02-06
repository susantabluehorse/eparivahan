/* for gallery image/video/audio upload script (sushovan) */
var root = location.protocol + '//' + location.host;
/*$(document).ready(function() {
  $('input[type="file"]').imageuploadify();
})*/

function filetype(){
    var selection = document.getElementById('uploadfile');
    var typeFile = $( 'input[name=media]:checked' ).val() 
    //alert (typeFile);
    for (var i=0; i<selection.files.length; i++) {
        var ext = selection.files[i].name.substr(-3);
        if(typeFile == 'image'){
            if(ext!== "jpg" && ext!== "png")  {
                alert('Please upload jpg,png file');
                $("#uploadfile").val('');
                return false;
            }
        }else if(typeFile == 'video'){
            if(ext!== "mp4")  {
                alert('Please upload mp4 file');
                $("#uploadfile").val('');
                return false;
            }else{
                if($("#uploadfile")[0].files.length > 1) {
                    alert("You can select only 1 file");
                    $("#uploadfile").val('');
                    return false;
                }
            }
        }else{
            if(ext!== "mp3")  {
                alert('Please upload mp3 file');
                $("#uploadfile").val('');
                return false;
            }else{
                if($("#uploadfile")[0].files.length > 1) {
                    alert("You can select only 1 file");
                    $("#uploadfile").val('');
                    return false;
                }
            }
        }
    } 
}

function editfiletype(){
    var selection = document.getElementById('editUpload');
    var typeFile = $( 'input[name=media]:checked' ).val() 
    //alert (typeFile);
    for (var i=0; i<selection.files.length; i++) {
        var ext = selection.files[i].name.substr(-3);
        if(typeFile == 'image'){
            if(ext!== "jpg" && ext!== "png")  {
                alert('Please upload jpg,png file');
                $("#editUpload").val('');
                return false;
            }else{
                if($("#editUpload")[0].files.length > 1) {
                    alert("You can select only 1 file");
                    $("#editUpload").val('');
                    return false;
                }
            }
        }else if(typeFile == 'video'){
            if(ext!== "mp4")  {
                alert('Please upload mp4 file');
                $("#editUpload").val('');
                return false;
            }else{
                if($("#editUpload")[0].files.length > 1) {
                    alert("You can select only 1 file");
                    $("#editUpload").val('');
                    return false;
                }
            }
        }else{
            if(ext!== "mp3")  {
                alert('Please upload mp3 file');
                $("#editUpload").val('');
                return false;
            }else{
                if($("#editUpload")[0].files.length > 1) {
                    alert("You can select only 1 file");
                    $("#editUpload").val('');
                    return false;
                }
            }
        }
    } 
}

/*$("#uploadfile").on("change", function() {
    if($("#uploadfile")[0].files.length > 1) {
        alert("You can select only 1 image");
    }else {
        $("#imageUploadForm").submit();
    }
});*/


$(document).ready(function() {
    $('input[name=media]').change(function(){
        var value = $( 'input[name=media]:checked' ).val();
        if(value === 'image'){
            $('#image_sec').show(); $('#video_sec').hide();    
        }else{
            $('#video_sec').show(); $('#image_sec').hide();
        }
    });
});

/* make clone */
// profile
$(document).ready(function(){
  $(".clone_trigger").click(function () {
      $('.clone').first().clone().insertBefore(".placer");
    $('input.cl:last').val('');
      event.preventDefault();
    });



$(document).on('click','.edit_remove_trigger',function () {
        
         //$(".editclone:last").remove();
         $(this).parents(".editclone").remove();
    
 });
     
    $(document).on('click','.remove_trigger',function () {
     
    if ($(".clone").length != 1) {
        
         $(".clone:last").remove();
          
    }
     
      event.preventDefault();
    });
        
    $('.remove_this_trigger').click(function () {
        if ($(".clone").length != 1) {
            //alert($(this).parent().parent().attr('class'));
            if(confirm("Are you sure you want to delete this?")){
                var el = $(this).parent().parent().parent().parent(); 
                if(el.prev("input[type=hidden]").val() != ''){
                    el.prev("input[type=hidden]").remove();
                }
                el.remove();
            }
            else{
                return false;
            }
        }
        //alert(el.attr('class'));
        //alert($(this).parent().parent().parent().parent().prev("input[type=hidden]").remove());
    });
});

//company
$(document).ready(function(){
  $(".company_more").click(function () {
    $('.companyClone').first().clone().insertBefore(".complacer");
    $('input.cl:last').val('');
      event.preventDefault();
    });

  $(".company_less").click(function () {
    if ($(".companyClone").length != 1) {
         $(".companyClone:last").remove();
    }
      //$('.clone:last').not('.clone:first').remove();
      event.preventDefault();
    });
        
        $('.remove_this_trigger').click(function () {
            var el = $(this).parent();
            el.remove();
        });
        $(document).on('click','.comp_remove_trigger',function () {
            
           if ($(".companyClone").length != 1) {
               
                $(".companyClone:last").remove();
                 
           }
            
             event.preventDefault();
           });
});
//project
$(document).ready(function(){
  $(".project_more").click(function () {
      $('.projectClone').first().clone().insertBefore(".projplacer");
    $('input.cl:last').val('');
      event.preventDefault();
    });

  $(".project_less").click(function () {
    if ($(".projectClone").length != 1) {
         $(".projectClone:last").remove();
    }
      //$('.clone:last').not('.clone:first').remove();
      event.preventDefault();
    });
        
        $('.remove_this_trigger').click(function () {
            var el = $(this).parent();
            el.remove();
        });

        $(document).on('click','.proj_remove_trigger',function () {
            
           if ($(".projectClone").length != 1) {
               
                $(".projectClone:last").remove();
                 
           }
            
             event.preventDefault();
           });
});
var root = location.protocol + '//' + location.host;
//alert(root);
// populate category
// $(document).ready(function() {
//   $.getJSON(root+"/kaizen/json/db.json", function(obj) {
//       $.each(obj.category, function(key, value) {
//           //alert(value);
//           $(".category").append('<option value ="'+key+'">' + value + '</option>');
//       });
//   });
// });
// $(document).ready(function() {
//   $.getJSON(root+"/kaizen/json/db.json", function(obj) {
//       $.each(obj.series, function(key, value) {
//           //alert(value);
//           $(".series").append('<option value ="'+key+'">' + value + '</option>');
//       });
//   });
// });
// $(document).ready(function() {
//   $.getJSON(root+"/kaizen/json/db.json", function(obj) {
//       $.each(obj.sequence, function(key, value) {
//           //alert(value);
//           $(".sequence").append('<option value ="'+key+'">' + value + '</option>');
//       });
//   });
// });
// $(document).ready(function() {
//   $.getJSON(root+"/kaizen/json/db.json", function(obj) {
//       $.each(obj.profiles, function(key, value) {
//           //alert(value);
//           $(".gal_profile").append('<option value ="'+key+'">' + value + '</option>');
//       });
//   });
// });
// $(document).ready(function() {
//   $.getJSON(root+"/kaizen/json/db.json", function(obj) {
//       $.each(obj.projects, function(key, value) {
//           //alert(value);
//           $(".gal_project").append('<option value ="'+key+'">' + value + '</option>');
//       });
//   });
// });
// $(document).ready(function() {
//   $.getJSON(root+"/kaizen/json/db.json", function(obj) {
//       $.each(obj.companies, function(key, value) {
//           //alert(value);
//           $(".gal_company").append('<option value ="'+key+'">' + value + '</option>');
//       });
//   });
// });


// $(document).ready(function() {
//     $.getJSON(root+"/kaizen/json/db.json", function(obj) {
//         $.each(obj.category, function(key, value) {
//             //alert(value);
//             $(".company_cat").append('<option value ="'+key+'">' + value + '</option>');
//         });
//     });
//   });
//   $(document).ready(function() {
//     $.getJSON(root+"/kaizen/json/db.json", function(obj) {
//         $.each(obj.opecType, function(key, value) {
//             //alert(value);
//             $(".opec_cat").append('<option value ="'+key+'">' + value + '</option>');
//         });
//     });
//   });
//   $(document).ready(function() {
//     $.getJSON(root+"/kaizen/json/db.json", function(obj) {
//         $.each(obj.peopleName, function(key, value) {
//             //alert(value);
//             $(".peoplNm").append('<option value ="'+key+'">' + value + '</option>');
//         });
//     });
//   });
//   $(document).ready(function() {
//     $.getJSON(root+"/kaizen/json/db.json", function(obj) {
//         $.each(obj.yearOfStartingOps, function(key, value) {
//             //alert(value);
//             $(".yearOfStartingOp").append('<option value ="'+key+'">' + value + '</option>');
//         });
//     });
//   });
//   $(document).ready(function() {
//     $.getJSON(root+"/kaizen/json/db.json", function(obj) {
//         $.each(obj.projectPhase, function(key, value) {
//             //alert(value);
//             $(".projectPhases").append('<option value ="'+key+'">' + value + '</option>');
//         });
//     });
//   });
//   $(document).ready(function() {
//     $.getJSON(root+"/kaizen/json/db.json", function(obj) {
//         $.each(obj.classified, function(key, value) {
//             //alert(value);
//             $(".classified").append('<option value ="'+key+'">' + value + '</option>');
//         });
//     });
//   });

//  $(document).ready(function() {
//     $.getJSON(root+"/kaizen/json/db.json", function(obj) {
//         $.each(obj.location, function(key, value) {
//             if(value=='location2'){
//                 var loc='selected="selected"';
//                 }else{
//                 var loc='';
//                 }
//                 $(".location").append('<option value ="'+key+'"'+loc+'>' + value + '</option>');
//         });
//     });
//   });

function editpostfiletype(){
    var selection = document.getElementById('editUpload');
    
    for (var i=0; i<selection.files.length; i++) {
        var ext = selection.files[i].name.substr(-3);
        
        if(ext!== "jpg" && ext!== "png")  {
            alert('Please upload jpg,png file');
            $("#editUpload").val('');
            return false;
        }else{
            if($("#editUpload")[0].files.length > 1) {
                alert("You can select only 1 file");
                $("#editUpload").val('');
                return false;
            }
        }
        
    } 
}

/* post slag By '_'  */
$('#postslag').attr('readonly', true);
$("#posttitle").keyup(function(){
    $("#postslag").val($(this).val().replace(/\s+/g, '_').toLowerCase());
});

/* post slug By '-' */
$('#postSlug').attr('readonly', true);
$("#postTitle").keyup(function(){
    $("#postSlug").val($(this).val().replace(/\s+/g, '-').toLowerCase());
});


 //$( "#datepickerAd" ).datepicker();

$("#datepickerAd").datepicker({
  
  onSelect: function(date) {
    $("#asd").datepicker('option', 'minDate', date);
  },

});
var stDate =0;
if($("#datepickerAd") != ""){
  stDate = $("#datepickerAd").val();
}

$("#asd").datepicker({minDate:stDate });

