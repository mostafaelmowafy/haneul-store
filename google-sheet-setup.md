# ربط فورم الأوردرات بجوجل شيت

الشيت بتاعك:
https://docs.google.com/spreadsheets/d/1-8s3MC-j73-muxYAA2FZydZPJWzPvZ7WkNJXfH78IBI/edit?gid=0#gid=0

اتبعي الخطوات دي بالظبط (مرة واحدة بس):

## 1. افتحي الشيت، وحطي صف العناوين (لو لسه معملتوش)
في أول صف، اكتبي العناوين دي بالترتيب:

```
التاريخ | الاسم بالكامل | رقم الهاتف | رقم بديل | المحافظة | العنوان | ملاحظات | المنتجات | الإجمالي الفرعي | الشحن | الإجمالي
```

## 2. افتحي محرر الأكواد
من نفس الشيت: **Extensions (الإضافات) → Apps Script**

هتفتحلك صفحة كود فاضية، امسحي أي كود موجود واستبدليه بالكود ده بالكامل:

```javascript
function doPost(e) {
  try {
    var sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
    var data = JSON.parse(e.postData.contents);

    sheet.appendRow([
      new Date(),
      data.fullName || '',
      data.phone || '',
      data.altPhone || '',
      data.governorate || '',
      data.address || '',
      data.notes || '',
      data.products || '',
      data.subtotal || '',
      data.shipping || '',
      data.total || '',
    ]);

    // نجبر عمودي رقم الهاتف والرقم البديل (C و D) إنهم يتكتبوا كنص عادي
    // عشان الصفر اللي في أول الرقم (زي 01111111111) ميضيعش.
    var lastRow = sheet.getLastRow();
    var phoneRange = sheet.getRange(lastRow, 3, 1, 2); // العمودين C و D
    phoneRange.setNumberFormat('@');
    phoneRange.setValues([[String(data.phone || ''), String(data.altPhone || '')]]);

    return ContentService
      .createTextOutput(JSON.stringify({ result: 'success' }))
      .setMimeType(ContentService.MimeType.JSON);
  } catch (err) {
    return ContentService
      .createTextOutput(JSON.stringify({ result: 'error', message: err.toString() }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}
```

احفظي (Ctrl+S) وسمّي المشروع أي اسم (مثلاً "استقبال الأوردرات").

## 3. اعملي Deploy كـ Web App
- من فوق على اليمين: **Deploy → New deployment**
- من أيقونة الترس ⚙️ بجانب "Select type" اختاري **Web app**
- **Execute as**: Me (حسابك إنتِ)
- **Who has access**: Anyone
- دوسي **Deploy**
- أول مرة هيطلب منك تصريح صلاحيات (Authorize access) — وافقي بحسابك، وممكن يظهر تحذير "Google hasn't verified this app"، دوسي **Advanced → Go to ... (unsafe)** وكمّلي، ده طبيعي لأنه سكريبت إنتِ اللي عملاه.
- هيديكي **Web app URL** يشبه:
  `https://script.google.com/macros/s/AKfycb.../exec`
- انسخي اللينك ده.

## 4. حطي اللينك في المشروع
افتحي ملف `src/pages/Checkout.jsx`، ودوري على السطر ده فوق:

```javascript
const GOOGLE_SHEET_WEBAPP_URL = "PASTE_YOUR_APPS_SCRIPT_WEB_APP_URL_HERE";
```

واستبدلي القيمة باللينك اللي نسختيه، يبقى شكله كده:

```javascript
const GOOGLE_SHEET_WEBAPP_URL = "https://script.google.com/macros/s/AKfycb.../exec";
```

احفظي، وارفعي المشروع تاني (Deploy). من دلوقتي أي طلب يتعمل هيتسجل سطر جديد في الشيت أوتوماتيك.

## ملاحظة مهمة
لو عدّلتي كود Apps Script بعد كده (زي ترتيب الأعمدة)، لازم تعملي **Deploy → Manage deployments → ✏️ (Edit) → New version → Deploy** عشان التعديل يتفعّل — تعديل الكود لوحده من غير Deploy جديد مش بيتطبق على اللينك الشغال.

## لو رقم الهاتف بيظهر من غير الصفر اللي في الأول
جوجل شيت بيحوّل أي حقل شكله رقم لـ"رقم" تلقائيًا، فبيشيل الصفر اللي في الأول (زي ما حصل مع "01111111111" وبقت "1111111111"). الكود الجديد فوق بيحل المشكلة دي أوتوماتيك لأي طلب جديد (بيجبر عمودي رقم الهاتف والرقم البديل إنهم يتكتبوا كنص). عشان الحل يشتغل:

1. انسخي الكود الجديد فوق وحطيه في Apps Script بدل القديم.
2. اعملي **Deploy → Manage deployments → ✏️ (Edit) → New version → Deploy** عشان التعديل يتفعّل.
3. لو عايزة تصلّحي الصفوف القديمة اللي اتسجلت قبل كده: حددي عمودي C وD، من فوق **Format → Number → Plain text**، وبعدين ارجعي اكتبي الرقم تاني وحطي علامة أبستروف (') قبله زي كده: `'01111111111` — العلامة دي مش هتظهر في الشيت، وبتقول لجوجل شيت "ده نص مش رقم".
