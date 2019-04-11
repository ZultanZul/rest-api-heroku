document.addEventListener('DOMContentLoaded', function(){

console.log('StartUp HandleBars');

    const template = document.getElementById("entry-template").innerHTML;
        
    //Compile Function
    const templateFn = Handlebars.compile(template);





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