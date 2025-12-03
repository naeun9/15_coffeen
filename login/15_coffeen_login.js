// 15_coffeen_login.js

const byId = (id) => document.getElementById(id);
const parseStoredUsers = () => {
  const raw = localStorage.getItem("users");
  if (!raw) return [];
  try {
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
};
const matchUser = (users, id, pw) => users.find((u) => u.id === id && u.password === pw);
let seedCache = null;
const loadSeedUsers = async () => {
  if (seedCache) return seedCache;
  try {
    const res = await fetch("./15_coffeen_users.json");
    if (!res.ok) throw new Error(res.statusText);
    const data = await res.json();
    seedCache = Array.isArray(data)
      ? data.map(({ id, password, name, email, phone }) => ({
          id,
          password,
          name,
          email,
          phone
        }))
      : [];
    return seedCache;
  } catch (err) {
    console.warn("기본 사용자 데이터를 불러오지 못했습니다.", err);
    seedCache = [];
    return seedCache;
  }
};

// 로그인 페이지 최초 진입 시 시드 사용자 데이터를 스토리지에 준비
document.addEventListener("DOMContentLoaded", async () => {
  const existing = parseStoredUsers();
  if (existing.length) return;

  try {
    const seeded = await loadSeedUsers("./users.json");
    if (seeded.length) {
      persistUsers(seeded);
    }
  } catch (err) {
    console.warn("초기 사용자 데이터를 불러오지 못했습니다.", err);
  }
});

// 로그인 
byId("loginForm").addEventListener("submit", async function (e) {
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

  const seedUsers = await loadSeedUsers();
  const jsonUser = matchUser(seedUsers, id, pw);
  if (jsonUser) {
    loginSuccess(jsonUser, remember);
  } else {
    alert("아이디 또는 비밀번호가 잘못되었습니다.");
  }
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
