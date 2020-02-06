
function preView()  {
    var fileInput = document.getElementById('profile_picture');
    var filePath = fileInput.value;
    var allowedExtensions = /(\.jpg|\.jpeg|\.png)$/i;
    if(!allowedExtensions.exec(filePath)){
        alert('Please upload file having extensions .jpeg/.jpg/.png  only.');
        fileInput.value = '';
        return false;
    }else{
        //Image preview
        if (fileInput.files && fileInput.files[0]) {
        var reader = new FileReader();             
            reader.onload = function(){
            var output = document.getElementById('preview');
            output.src = reader.result;
            };
            reader.readAsDataURL(event.target.files[0]);
        
        };
    }
}
  

 
function blockChar(e){
    var k;
    document.all ? k = e.keyCode : k = e.which;
    return (k >= 48 && k <= 57);
}


    
function ValidateEmail() 
{
        var $email = $('form input[name="email'); //change form to id or containment selector
    var re = /[A-Z0-9._%+-]+@[A-Z0-9.-]+.[A-Z]{2,4}/igm;
    if ($email.val() == '' || !re.test($email.val()))
    {
        alert('Please enter a valid email address.');
        return false;
    }
}


function filladdress(f) {
    if(f.checkadd.checked == true) {
    f.current_address.value = f.address.value;       
    }
    if(f.checkadd.checked == false) {
    f.current_address.value = null; 

    }
}

function ValidatePan() 
    {
        var $pan_no = $('form input[name="pan_no'); //change form to id or containment selector
    var re = /[A-Za-z]{5}\d{4}[A-Za-z]{1}/igm;
    if ($pan_no.val() == '' || !re.test($pan_no.val()))
    {
        alert('Please enter a valid pan no.');
        return false;
    }
}



