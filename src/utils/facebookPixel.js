// كود Facebook Pixel الأساسي بس — من غير أي events مخصصة، لأن الـ events هتتضاف من Meta.
// الفرق الوحيد: الـ Pixel ID مش مكتوب هنا في الكود، ده بيتقرأ في كل مرة من
// npoint.io، عشان لو حبيتي تغيّري الـ ID تقدري من نفس الصفحة على npoint.io
// من غير ما تلمسي كود المشروع خالص أو تعملي Deploy جديد.

const NPOINT_URL = 'https://api.npoint.io/efac509b842bb5920571';

let fbqScriptLoaded = false;

function loadFbqScript() {
  if (fbqScriptLoaded || typeof window === 'undefined') return;
  fbqScriptLoaded = true;

  /* eslint-disable */
  !(function (f, b, e, v, n, t, s) {
    if (f.fbq) return;
    n = f.fbq = function () {
      n.callMethod ? n.callMethod.apply(n, arguments) : n.queue.push(arguments);
    };
    if (!f._fbq) f._fbq = n;
    n.push = n;
    n.loaded = true;
    n.version = '2.0';
    n.queue = [];
    t = b.createElement(e);
    t.async = true;
    t.src = v;
    s = b.getElementsByTagName(e)[0];
    s.parentNode.insertBefore(t, s);
  })(
    window,
    document,
    'script',
    'https://connect.facebook.net/en_US/fbevents.js',
  );
  /* eslint-enable */
}

// بتتنادى مرة واحدة لما الموقع يفتح: بتجيب الـ Pixel ID من npoint.io،
// وتحمّل سكريبت الـ Pixel وتعمل init + أول PageView.
export async function initFacebookPixel() {
  try {
    const res = await fetch(NPOINT_URL);
    const data = await res.json();
    const pixelId = data.pixelId;

    if (!pixelId) {
      console.warn(
        'مفيش pixelId في بيانات npoint.io — تأكدي إنك حاطة { "pixelId": "..." } جوه الـ JSON على npoint.io',
      );
      return;
    }

    loadFbqScript();
    window.fbq('init', pixelId);
    window.fbq('track', 'PageView');
  } catch (err) {
    console.error('تعذّر تحميل إعدادات Facebook Pixel من npoint.io:', err);
  }
}

// بتتنادى مع كل تنقل بين الصفحات جوه الموقع (بما إن الموقع SPA وموقع الصفحة
// مش بيعمل ريفرش كامل، لازم نبعت PageView يدوي مع كل تنقل).
export function trackPageView() {
  if (typeof window !== 'undefined' && window.fbq) {
    window.fbq('track', 'PageView');
  }
}
