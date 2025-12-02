// 15_coffeen_login.js

const byId = (id) => document.getElementById(id);
const parseStoredUsers = () => JSON.parse(localStorage.getItem("users")) || [];
const matchUser = (users, id, pw) => users.find((u) => u.id === id && u.password === pw);

// 로그인 이벤트
byId("loginForm").addEventListener("submit", function (e) {
  e.preventDefault();

  const id = byId("login-id").value.trim();
  const pw = byId("login-password").value;
  const remember = byId("remember").checked;

  // localStorage 확인
  const saved = parseStoredUsers();
  const user = matchUser(saved, id, pw);

  if (user) {
    loginSuccess(user, remember);
    return;
  }

  // 외부 JSON
  fetch("15_coffeen_login.json")
    .then((res) => res.json())
    .then((data) => {
      const jsonUser = matchUser(data, id, pw);
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
