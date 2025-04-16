document.getElementById("btn-register").onclick = function () {
  let name = document.getElementById("name").value.trim();
  let password = document.getElementById("password").value;
  let email = document.getElementById("email").value;
  let error=document.getElementById("error");
  let success=document.getElementById("success");
//   error.style.display = "none";
//   success.style.display = "none";
if (!email.includes("@gmail.com")) {
  error.innerHTML = `<p>Email phải thuộc tên miền @gmail.com</p>`;
  error.style.display = "block";
  return;
}
if (email === "") {
  error.innerHTML = `<p>Email không được để trống</p>`;
  error.style.display = "block";
  return;
}
  if(name===""){
    error.innerHTML=`<p>Họ và tên không được để trống</p>`;
    error.style.display="block";
    return;
  }
  if (password === "") {
    error.innerHTML = `<p>Mật khẩu không được để trống</p>`;
    error.style.display = "block";
    return;
  }
  if(name===""&&email === ""&&password === ""){
    error.innerHTML = `<p>Không được để trống các ô</p>`;
    error.style.display = "block";
    return;
  }
  if(name===""&&email === ""||name===""&&password===""||email===""&&password===""){
    error.innerHTML = `<p>Không được để trống hai ô còn lại</p>`;
    error.style.display = "block";
    return;
  }
  if (password.length < 8) {
    error.innerHTML = `<p>Mật khẩu phải có tối thiểu 8 ký tự</p>`;
    error.style.display = "block";
    return;
  }
  capitalization=/^[A-Z]/;
  if(!capitalization.test(password)){
    error.innerHTML = `<p>Mật khẩu phải có chứ cái đầu viết hoa</p>`;
    error.style.display = "block";
    return;
  }
  number=/[1-9]$/;
  if(!number.test(password)){
    error.innerHTML = `<p>Mật khẩu phải kết thúc bằng số</p>`;
    error.style.display = "block";
    return;
  }
  let users = JSON.parse(localStorage.getItem("users")) || [];
  // console.log(user);
  for (let i = 0; i < users.length; i++) {
    if (users[i].email === email) {
      error.innerHTML = `<p>Email đã được đăng ký</p>`;
      error.style.display = "block";
      return;
    }
    if (users[i].name === name) {
      error.innerHTML = `<p>Tên đã được đăng ký</p>`;
      error.style.display = "block";
      return;
    }
  }
  const newUser = {
    name: name,
    email: email,
    password: password,
  };
  users.push(newUser);
  localStorage.setItem("users", JSON.stringify(users));
  success.innerHTML=`<p>Đăng ký thành công</p>`;
  success.style.display="block";
  error.style.display="none";
  document.getElementById("name").value = "";
  document.getElementById("email").value = "";
  document.getElementById("password").value = "";
  setTimeout(() => {
    window.location.href = "../pages/sign in.html";
  }, 1000);
};