let menu = document.querySelector('.menu-icon');
let navbar = document.querySelector('.navbar');
menu.onclick = () => {
    navbar.classList.toggle("open-menu");
    menu.classList.toggle("move");
};
window.onscroll = () =>{
    navbar.classList.remove("open-menu");
    menu.classList.remove("move");
}

const txtElement = ['Muhammad Nabil'];
let count = 0;
let txtIndex = 0;
let currentTxt ='';
let words = '';

(function ngetik(){

    if(count == txtElement.length){
        count = 0;
    }

    currentTxt = txtElement[count];

    words = currentTxt.slice(0, ++txtIndex);
    document.querySelector('.efek-ngetik').textContent = words;

    if(words.length == currentTxt.length){
        count++;
        txtIndex = 0;
    }

    setTimeout(ngetik, 500);

})();

function validate() {
    let name = document.querySelector(".name");
    let email = document.querySelector(".email");
    let msg = document.querySelector(".message");
    let sendBtn = document.querySelector(".send-btn");

    sendBtn.addEventListener("click", (e) => {
        e.preventDefault();
        if (name.value == "" || email.value == "" || msg.value == "") {
            emptyerror();
        } else {
            sendmail(name.value, email.value, msg.value);
            success();
        }
    })
}
validate();

function sendmail (name,email,msg){
    emailjs.send("service_x5omr5j", "template_595xcxk", {
      to_name: email,
      from_name: name,
      message: msg,
    });
}

function emptyerror() {
    swal({
        title: "Gagal Terkirim",
        text: "Belum dikembangkan Nabil!",
        icon: "error",
      });
}
function success() {
    swal({
      title: "Gagal Terkirim",
      text: "Belum dikembangkan Nabil!",
      icon: "error",
    });
}

let header = document.querySelector('header')
window.addEventListener('scroll', () => {
    header.classList.toggle('header-active', window.scrollY > 0);
});

let scrollTop = document.querySelector('.scroll-top')
window.addEventListener('scroll', () => {
    scrollTop.classList.toggle('scroll-active', window.scrollY >= 400);
});