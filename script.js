const API_URL = "https://gauoispa.onrender.com"; // Backend Render

async function login() {
  const user = document.getElementById("username").value;
  const pass = document.getElementById("password").value;

  try {
    const res = await fetch(`${API_URL}/users`);
    const data = await res.json();
    const rows = data.values;

    const headers = rows[0];
    const usernameIndex = headers.indexOf("Username");
    const passwordIndex = headers.indexOf("Password");

    let isValid = false;

    for (let i = 1; i < rows.length; i++) {
      if (rows[i][usernameIndex] === user && rows[i][passwordIndex] === pass) {
        isValid = true;
        break;
      }
    }

    if (isValid) {
      alert("✅ Đăng nhập thành công");
    } else {
      alert("❌ Sai tài khoản hoặc mật khẩu");
    }
  } catch (err) {
    alert("❌ Không kết nối được server");
  }
}

async function saveData() {
  const payload = {
    name: document.getElementById("name").value,
    phone: document.getElementById("phone").value,
    service: document.getElementById("service").value,
    amount: document.getElementById("amount").value,
    staff: document.getElementById("staff").value,
    shift: document.getElementById("shift").value,
    note: document.getElementById("note").value,
    commission: document.getElementById("commission").value,
    tour: document.getElementById("tour").value,
    email: document.getElementById("email").value,
  };

  try {
    const res = await fetch(`${API_URL}/add`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    const result = await res.json();
    alert("✅ Lưu thành công");
  } catch (err) {
    alert("❌ Không kết nối được server");
  }
}
