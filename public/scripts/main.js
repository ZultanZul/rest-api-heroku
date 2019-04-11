// import { CLIENT_RENEG_LIMIT } from "tls";

document.addEventListener('DOMContentLoaded', function(){

    // Setup the CSS placeholder stuff    
    //////////////////////////////////////////


    console.log('init: Materialise');

    var tabs = document.querySelectorAll('.tabs')[0];

    var instance = M.Tabs.init(tabs, {});



    // Setup Handlebars
    //////////////////////////////////////////
    
    console.log('StartUp HandleBars');

    const template = document.getElementById("entry-template").innerHTML;        
    //Compile Function
    const templateFn = Handlebars.compile(template);




    // Get Values from Create Form
    //////////////////////////////////////////

    const form = document.getElementById('addForm');
    form.addEventListener('submit', function(e){
      e.preventDefault();
    
      const nameInput = document.getElementById('name');
      const nameValue = nameInput.value;
  
      const emailInput = document.getElementById('email');
      const emailValue = emailInput.value;

      const phoneInput = document.getElementById('phone');
      const phoneValue = phoneInput.value;

      const typeInput = document.getElementById('type');
      const typeValue = typeInput.value;
  
      const avatarInput = document.getElementById('avatar');
      const avatarValue = avatarInput.value;


      const newUserData = {
        name: nameValue,
        email: emailValue,
        phone: phoneValue,
        type: typeValue,
        avatar: avatarValue
      };

      console.log(newUserData);


      fetch('/users', {
        method: 'POST',
        body: JSON.stringify(newUserData),
        headers: {
            "Content-Type": "application/json",
            // "Content-Type": "application/x-www-form-urlencoded",
        }
      })
      // .then(resp => resp.json())
      .then(cars => {
        M.toast({html: 'User Saved!', classes: 'success'});
      })
      .catch(err => {
        console.log(error);
        M.toast({html: `Error: ${err.message}`, classes: 'error'});
      });


    });


  







    // Load the current users from the database
    //////////////////////////////////////////

    fetch('/users', {
        method: 'GET'
    })

    .then(resp => resp.json())
    .then(users => {
        console.log('Users: ', users);
            // Return the HTML string
        const HTML = templateFn({
            users: users
        });
        const mountNode = document.getElementById("mountNode");
        mountNode.innerHTML = HTML;
    })
});