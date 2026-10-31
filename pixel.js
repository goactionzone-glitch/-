// Meta Pixel: вмикається, лише якщо вказано FB_PIXEL_ID у config.js
(function () {
  if (typeof FB_PIXEL_ID === "undefined" || !FB_PIXEL_ID) return;
  !function(f,b,e,v,n,t,s){if(f.fbq)return;n=f.fbq=function(){n.callMethod?n.callMethod.apply(n,arguments):n.queue.push(arguments)};if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';n.queue=[];t=b.createElement(e);t.async=!0;t.src=v;s=b.getElementsByTagName(e)[0];s.parentNode.insertBefore(t,s)}(window,document,'script','https://connect.facebook.net/en_US/fbevents.js');
  fbq('init', FB_PIXEL_ID);
  fbq('track', 'PageView');
  // Подія покупки: лише на сторінці подяки і лише один раз після реального замовлення
  if (document.body.dataset.page === "thanks") {
    try {
      if (sessionStorage.getItem("orderOk")) {
        fbq('track', 'Purchase', { value: Number(PRICE) || 0, currency: 'UAH', content_name: PRODUCT });
        sessionStorage.removeItem("orderOk");
      }
    } catch (e) {}
  }
})();
