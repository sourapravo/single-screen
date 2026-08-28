const PASSWORD_SHA256="c5fb4aa51a116d3b1f9891ce5ad437ebd19643c880b15aa11e7f5fd7fc8e3cab";
const form=document.getElementById("login-form");
const input=document.getElementById("passphrase");
const error=document.getElementById("error");
const toggle=document.getElementById("toggle-password");

async function sha256(text){
 const data=new TextEncoder().encode(text);
 const hash=await crypto.subtle.digest("SHA-256",data);
 return Array.from(new Uint8Array(hash)).map(b=>b.toString(16).padStart(2,"0")).join("");
}
toggle.addEventListener("click",()=>{
 const show=input.type==="text";
 input.type=show?"password":"text";
 toggle.setAttribute("aria-pressed",String(!show));
 toggle.setAttribute("aria-label",show?"Show passphrase":"Hide passphrase");
 input.focus();
});
form.addEventListener("submit",async e=>{
 e.preventDefault(); error.textContent="";
 const value=input.value;
 if(!value){error.textContent="Please enter the passphrase.";return}
 if(await sha256(value)===PASSWORD_SHA256){
   sessionStorage.setItem("phdNotebookAccess","granted");
   location.href="notebook.html";
 }else{error.textContent="Incorrect passphrase";input.select();}
});
