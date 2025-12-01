// 15_coffeen_login.js

// 로그인 이벤트
document.getElementById("loginForm").addEventListener("submit", function (e) {
  e.preventDefault();

  const id = document.getElementById("login-id").value.trim();
  const pw = document.getElementById("login-password").value;
  const remember = document.getElementById("remember").checked;

  // localStorage 확인
  const saved = JSON.parse(localStorage.getItem("users")) || [];
  let user = saved.find(u => u.id === id && u.password === pw);

  if (user) {
    loginSuccess(user, remember);
    return;
  }

  // 외부 JSON
  fetch("15_coffeen_login.json")
    .then(res => res.json())
    .then(data => {
      const jsonUser = data.find(u => u.id === id && u.password === pw);
      if (jsonUser) {
        loginSuccess(jsonUser, remember);
      } else {
        alert("아이디 또는 비밀번호가 잘못되었습니다.");
      }
    });
});

// 로그인 성공 함수
function loginSuccess(user, remember) {
  if (remember) {
    localStorage.setItem("loggedInUser", user.name);
  } else {
    sessionStorage.setItem("loggedInUser", user.name);
  }

  alert(`${user.name}님 환영합니다!`);
  window.location.href = "../main/15_coffeen_Main.html";
}
