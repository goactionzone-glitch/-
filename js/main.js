const IMGS = [
  "img/photo-01.jpg",
  "img/photo-02.jpg",
  "img/photo-03.jpg",
  "img/photo-04.jpg",
  "img/photo-05.jpg",
  "img/photo-06.jpg",
  "img/photo-07.jpg",
  "img/photo-08.jpg",
  "img/photo-09.jpg",
  "img/photo-10.jpg",
  "img/photo-11.jpg",
  "img/photo-12.jpg",
  "img/photo-13.jpg",
  "img/photo-14.jpg",
  "img/photo-15.jpg"
];
const big = document.getElementById("big"), th = document.getElementById("th");
IMGS.forEach((src,i)=>{
  const b = document.createElement("button");
  b.type="button"; b.setAttribute("aria-label","Фото "+(i+1));
  b.innerHTML = `<img src="${src}" alt="">`;
  b.onclick = () => show(i);
  th.appendChild(b);
});
function show(i){
  big.src = IMGS[i];
  [...th.children].forEach((b,j)=>b.setAttribute("aria-pressed", j===i));
}
show(0);
if (PRICE){ const p=document.getElementById("price"); p.hidden=false; p.innerHTML = PRICE+" грн<small>за комплект</small>"; }

const form = document.getElementById("f"), msg = document.getElementById("msg"), btn = document.getElementById("btn");
form.addEventListener("submit", async e => {
  e.preventDefault(); msg.className = "";
  if (document.getElementById("hp").value) return;
  if (!form.checkValidity()){ msg.className="err"; msg.textContent="Заповніть ім'я, телефон, місто та відділення Нової пошти."; return; }
  if (SHEET_URL.startsWith("ВСТАВТЕ")){ msg.className="err"; msg.textContent="Не підключено Google Sheets: вставте URL у SHEET_URL."; return; }
  btn.disabled = true; btn.textContent = "Надсилаємо…";
  const q = new URLSearchParams(location.search);
  const body = new URLSearchParams({
    name: form.name.value.trim(), phone: form.phone.value.trim(),
    city: form.city.value.trim(), branch: form.branch.value.trim(),
    product: PRODUCT, price: PRICE, source: q.get("utm_source") || "", page: location.href
  });
  try{
    await fetch(SHEET_URL, {method:"POST", mode:"no-cors", body});
    try { sessionStorage.setItem("orderOk", "1"); } catch (e) {}
    location.href = "thanks.html";
    return;
  }catch(err){ msg.className="err"; msg.textContent="Не вдалося надіслати. Спробуйте ще раз."; }
  btn.disabled = false; btn.textContent = "Замовити пристрій";
});
