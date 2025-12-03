// 15_coffeen_signup.js

const byId = (id) => document.getElementById(id);
const getTrimmedValue = (id) => byId(id).value.trim();
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
const persistUsers = (users) => localStorage.setItem("users", JSON.stringify(users));
let seedCache = null;
const loadSeedUsers = async () => {
  if (seedCache) return seedCache;
  try {
    const res = await fetch("../login/15_coffeen_users.json");
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
    console.warn("초기 사용자 데이터를 불러오지 못했습니다.", err);
    seedCache = [];
    return seedCache;
  }
};

// 초기 사용자 데이터 시드: JSON을 fetch해서 localStorage에 저장
document.addEventListener("DOMContentLoaded", async () => {
  const existing = parseStoredUsers();
  if (existing.length) return;

  try {
    const seeded = await loadSeedUsers();
    if (seeded.length) {
      persistUsers(seeded);
    }
  } catch (err) {
    console.warn("초기 사용자 데이터를 불러오지 못했습니다.", err);
  }
});

document.getElementById("signupForm").addEventListener("submit", function (e) {
  e.preventDefault();

  const id = getTrimmedValue("id");
  const email = getTrimmedValue("email");
  const phone = getTrimmedValue("phone");
  const password = byId("password").value;
  const confirm = byId("confirm").value;
  const profileName = getTrimmedValue("profileName");

  // 비밀번호 일치 확인
  if (password !== confirm) {
    alert("비밀번호가 일치하지 않습니다.");
    return;
  }

  // 비밀번호 규칙 검사: 4자 이상, 영문+숫자 조합
  const pwRule = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{4,}$/;
  if (!pwRule.test(password)) {
    alert("비밀번호는 4자 이상이며, 영문자와 숫자를 모두 포함해야 합니다.");
    return;
  }

  // 전화번호 형식 검사: 000-0000-0000
  const phoneRule = /^\d{3}-\d{4}-\d{4}$/;
  if (!phoneRule.test(phone)) {
    alert("전화번호는 000-0000-0000 형식으로 입력해 주세요.");
    return;
  }

  // 기존 저장 데이터 불러오기
  const stored = parseStoredUsers();

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
    phone
  };

  stored.push(newUser);
  persistUsers(stored);

  // 다음 페이지에서 바로 사용할 수 있도록 프로필 이름을 세션에 전달
  sessionStorage.setItem("signupProfileName", profileName);

  alert("회원가입이 완료되었습니다!");

  // signup → mypage 페이지 이동
  window.location.href = "../mypage/15_coffeen_review.html";
});
