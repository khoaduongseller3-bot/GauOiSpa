// Thay URL này bằng Render backend của bạn
const BASE_URL = "https://gauoispa.onrender.com";

document.getElementById("loginForm").addEventListener("submit", async (e) => {
  e.preventDefault();

  const username = document.getElementById("username").value;
  const password = document.getElementById("password").value;

  try {
    const res = await fetch(`${BASE_URL}/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ username, password })
    });

    const data = await res.json();

    if (data.success) {
      alert("Đăng nhập thành công!");
      window.location.href = "dashboard.html"; // ví dụ sau login vào trang này
    } else {
      alert("Sai tài khoản hoặc mật khẩu!");
    }
  } catch (err) {
    console.error("Lỗi kết nối:", err);
    alert("Không kết nối được server!");
  }
});
