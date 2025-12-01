// 15_coffeen_signup.js

document.getElementById("signupForm").addEventListener("submit", function (e) {
  e.preventDefault();

  const id = document.getElementById("id").value.trim();
  const email = document.getElementById("email").value.trim();
  const phone = document.getElementById("phone").value.trim();
  const password = document.getElementById("password").value;
  const confirm = document.getElementById("confirm").value;
  const profileName = document.getElementById("profileName").value.trim();
  const preferredArea = document.getElementById("preferredArea").value;

  // 비밀번호 일치 확인
  if (password !== confirm) {
    alert("비밀번호가 일치하지 않습니다.");
    return;
  }

  // 비밀번호 규칙 검사: 4자 이상, 문자+숫자 조합
  const pwRule = /^(?=.*[A-Za-z])(?=.*\\d)[A-Za-z\\d]{4,}$/;
  if (!pwRule.test(password)) {
    alert("비밀번호는 4자 이상이며, 문자와 숫자를 모두 포함해야 합니다.");
    return;
  }

  // 기존 저장 데이터 불러오기
  const stored = JSON.parse(localStorage.getItem("users")) || [];

  // 아이디 중복 체크
  if (stored.find(u => u.id === id)) {
    alert("이미 존재하는 아이디입니다.");
    return;
  }

  const newUser = {
    id,
    password,
    name: profileName,
    email,
    phone,
    preferredArea
  };

  stored.push(newUser);
  localStorage.setItem("users", JSON.stringify(stored));

  alert("회원가입이 완료되었습니다!");

  // signup → login 페이지 이동
  window.location.href = "../login/15_coffeen_login.html";
});
