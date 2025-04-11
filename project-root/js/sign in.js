document.getElementById("btn-login").onclick = function () {
  let email = document.getElementById("email").value.trim();
  let password = document.getElementById("password").value.trim();
  let errorDiv = document.getElementsByClassName("lack error")[0];
  let successDiv = document.getElementsByClassName("lack success")[0];
  let wrongDiv = errorDiv.getElementsByClassName("wrong")[0];

  errorDiv.style.display = "none";
  successDiv.style.display = "none";

  let users = JSON.parse(localStorage.getItem("user")) || [];

  if (email === "" && password === "") {
    errorDiv.style.display = "block";
    wrongDiv.innerHTML = `<p>Email và Mật khẩu không được để trống</p>`;
    return;
  }

  if (email === "") {
    errorDiv.style.display = "block";
    wrongDiv.innerHTML = `<p>Email không được để trống</p>`;
    return;
  }

  if (password === "") {
    errorDiv.style.display = "block";
    wrongDiv.innerHTML = `<p>Mật khẩu không được để trống</p>`;
    return;
  }

  let loggedInUser = null;
  for (let i = 0; i < users.length; i++) {
    if (users[i].email === email && users[i].password === password) {
      loggedInUser = users[i];
      break;
    }
  }

  if (!loggedInUser) {
    errorDiv.style.display = "block";
    wrongDiv.innerHTML = `<p>Email hoặc Mật khẩu không tồn tại</p>`;
    return;
  }

  localStorage.setItem("loggedInUser", JSON.stringify(loggedInUser));
  successDiv.style.display = "flex";
  wrongDiv.innerHTML = `<p>Đăng nhập thành công</p>`;
  setTimeout(() => {
    window.location.href = "./home.html";
  }, 1000);
};

// Lấy phần tử biểu tượng "x" (dấu đóng)
const closeErrorIcon = document.getElementById("icon");

// Thêm sự kiện onclick để ẩn ô báo lỗi
closeErrorIcon.onclick = function () {
  const errorDiv = document.getElementsByClassName("lack error")[0];
  errorDiv.style.display = "none";
};