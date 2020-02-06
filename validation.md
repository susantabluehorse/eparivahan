req.checkBody('slag', 'Slag name required').notEmpty();
req.checkBody("email", "Enter a valid email address.").isEmail();

 req.checkBody({

        'username': {
            notEmpty: true,
            errorMessage: 'Username is required'
        },

        'email': {
            notEmpty: true,
            isEmail: {
                errorMessage: 'Invalid Email Address'
            },
            errorMessage: 'Email is required'
        },

        'password': {
            notEmpty: true,
            errorMessage: 'Password is required'
        },

        'password_confirmation': {
            notEmpty: true,
            errorMessage: 'Password Confirmation is required'
        }

    });
    
    
        
req.checkBody(  
  "leader_mobile_no", 
  "Enter a valid UK phone number.").isMobilePhone("en-GB");
  
req.checkBody(
  "team_twitter", 
   "Enter a valid Twitter URL").optional().matches("http://twitter.com/*");
   
   req.checkBody(  
  "contestant_count",
  "Contestant count must be a number and one that is divisible by 2"
).isNumber().isDivisibleBy(2);



req.checkBody(  
  "page_color", 
  "Page colour must be a valid hex color"
).isHexColor();

req.checkBody(  
  "page_color_accent",
  "Page colour accent must be a valid hex color").isHexColor();
  
  
  # req.checkBody('username', 'Username already in use').isUsernameAvailable();
