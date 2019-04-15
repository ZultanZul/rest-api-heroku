// import { CLIENT_RENEG_LIMIT } from "tls";

document.addEventListener('DOMContentLoaded', function(){

    // Setup the CSS placeholder stuff    
    //////////////////////////////////////////


    console.log('init: Materialise');

    var tabs = document.querySelectorAll('.tabs')[0];

    var instance = M.Tabs.init(tabs, {});



    // Find Dom Elements
    ////////////////////////////////////////// 
    const mountNode = document.getElementById("mountNode");
    const updateTabTrigger = document.getElementById('updateTabTrigger');


    // Setup Handlebars
    //////////////////////////////////////////
    
    console.log('StartUp HandleBars');

    const template = document.getElementById("entry-template").innerHTML;        
    //Compile Function
    const templateFn = Handlebars.compile(template);




    // Load the current users from the database
    //////////////////////////////////////////

  let _users = [];

  function loadUsers(){
    fetch('/users', {
        method: 'GET'
    })

    .then(resp => resp.json())
    .then(users => {
        console.log('Users: ', users);
            // Return the HTML string

        _users = users;

        const HTML = templateFn({
            users
        });        
        mountNode.innerHTML = HTML;
    })
  }




  mountNode.addEventListener("click", function(e) {
    if (e.target) {
      const id = e.target.dataset.id;
      console.log("id", id);
      if (e.target.matches("button.edit_btn")) {
        // update
        console.log("update: " + id);
        updateUser(id);

      } else if (e.target.matches("button.delete_btn")) {
        // delete
        console.log("delete: " + id);
        deleteUser(id);
      }
    }
  });








    // Get Values from Create Form
    //////////////////////////////////////////

    const addForm = document.getElementById('addForm');
    addForm.addEventListener('submit', function(e){
      e.preventDefault();

      const nameInput = document.getElementById('name-create');
      const nameValue = nameInput.value;
  
      const emailInput = document.getElementById('email-create');
      const emailValue = emailInput.value;

      const phoneInput = document.getElementById('phone-create');
      const phoneValue = phoneInput.value;

      const typeInput = document.getElementById('type-create');
      const typeValue = typeInput.value;
  
      const avatarInput = document.getElementById('avatar-create');
      const avatarValue = avatarInput.value;


      const data = {
        name: nameValue,
        email: emailValue,
        phone: phoneValue,
        type: typeValue,
        avatar: avatarValue
      };

      console.log(data);

      fetch('/users', {
        method: 'POST',
        body: JSON.stringify(data),
        headers: {
            "Content-Type": "application/json",
        }
      })
      .then(user => {
        this.reset();
        M.toast({html: 'User Saved!', classes: 'success'});
        reloadList();
      })
      .catch(err => {
        console.log('err', err);
        M.toast({html: `Error: ${err.message}`, classes: 'error'});
      });
    });








  // Delete User
  //////////////////////////////////////////

  function deleteUser(id) {

    var prompt = confirm("Are you sure you want to delete this user?");
    if (prompt === true) {
      fetch(`/users/${id}`, {
        method: 'DELETE'
      })
        .then(resp => {
          console.log('resp', resp);
          M.toast({ html: "Car Deleted!", classes: "success" });
          loadUsers();
        })
        .catch(err => {
          console.log('err', err);
          M.toast({ html: `Error: ${err.message}`, classes: "error" });
        });
    }
  }


  






  // Update Form
  //////////////////////////////////////////

  const updateForm = document.getElementById('updateForm');
  updateForm.addEventListener('submit', function(e){
    e.preventDefault();

    const _idInput = document.getElementById('id');
    const _idValue =  _idInput.value;

    const nameInput = document.getElementById('name-update');
    const nameValue = nameInput.value;

    const emailInput = document.getElementById('email-update');
    const emailValue = emailInput.value;

    const phoneInput = document.getElementById('phone-update');
    const phoneValue = phoneInput.value;

    const typeInput = document.getElementById('type-update');
    const typeValue = typeInput.value;

    const avatarInput = document.getElementById('avatar-update');
    const avatarValue = avatarInput.value;


    const data = {
      id: _idValue,
      name: nameValue,
      email: emailValue,
      phone: phoneValue,
      type: typeValue,
      avatar: avatarValue
    };

    console.log(data);


    fetch('/users/'+ data.id, {
      method: 'PUT',
      body: JSON.stringify(data),
      headers: {
          "Content-Type": "application/json",
      }
    })
    .then(user => {
      this.reset();
      M.toast({html: 'User Updated!', classes: 'success'});
      reloadList();
      updateTabTrigger.parentNode.classList.add('disabled');
    })
    .catch(err => {
      console.log('err', err);
      M.toast({html: `Error: ${err.message}`, classes: 'error'});
    });

  });





    // Update User
  //////////////////////////////////////////

  function updateUser(id) {
    updateTabTrigger.parentNode.classList.remove('disabled');
    instance.select('updateTab');
    updateForm.querySelectorAll('#id')[0].value = id;

    const userToUpdate = _users.find(user => {
      return user._id === id;
    });

    console.log(updateForm, userToUpdate);
    populateForm(updateForm, userToUpdate);

  }







  // Reload List when Users deleted, added, or updated.
  //////////////////////////////////////////

  function reloadList() {
    loadUsers();
    instance.select('listTab');
  }








  // Populate Form Function
  //////////////////////////////////////////
  function populateForm(form, data) {
    for (const item in data) {
      const el = form.querySelectorAll(`input[id="${item}-update"]`);
      if (el.length) {
        el[0].value = data[item];
      }
    }
  }






  // Serialize Form to Array - CANT GET THIS TO WORK.
  //////////////////////////////////////////

  function serializeFormToArray (form) {
      var field, l, s = [];      
      if (typeof form === 'object' && form.nodeName === "FORM") {
          var len = form.elements.length;
          for (let i=0; i<len; i++) {
              field = form.elements[i];
              if (field.name && !field.disabled && field.type !== 'file' && field.type !== 'reset' && field.type !== 'submit' && field.type !== 'button') {
                  if (field.type === 'select-multiple') {
                      l = form.elements[i].options.length; 
                      for (let j=0; j<l; j++) {
                          if(field.options[j].selected)
                              s[s.length] = { name: field.name, value: field.options[j].value };
                      }
                  } else if ((field.type !== 'checkbox' && field.type !== 'radio') || field.checked) {
                      if (field.type === 'number') {
                          s[s.length] = { name: field.name, value: Number(field.value) };
                      } else {
                          s[s.length] = { name: field.name, value: field.value };
                      } 
                  } else {
                    let bool = false;
                    if (field.checked) bool = true;
                    s[s.length] = { name: field.name, value: bool }
                  }
              }
          }
      }
      return s;
  };

  


    loadUsers();
});