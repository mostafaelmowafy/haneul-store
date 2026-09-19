// نفس الـ regex المستخدم في richDescription.jsx لتلوين أسطر الأسعار،
// بس هنا بنستخدمه عشان نطلع منه "اختيارات" قابلة للاختيار (زي: عبوة واحدة، أو عرض 2+1).
const OFFER_PRICE_REGEX = /(\d[\d,]*)\s*(?:ج)?\s*(?:بدل|يدل)\s*(\d[\d,]*)\s*ج/;

function extractQty(beforeText) {
  if (/2\s*\+\s*1/.test(beforeText)) return 3;

  const specialOffer = beforeText.match(/عرض خاص عدد\s*(\d+)/);
  if (specialOffer) return parseInt(specialOffer[1], 10);

  return 1;
}

function cleanLabel(beforeText) {
  const cleaned = beforeText.replace(/^سعر\s*/, "").replace(/بسعر$/, "").trim();
  return cleaned || "قطعة واحدة";
}

// بيرجع array فيها كل اختيارات الأسعار الموجودة في وصف المنتج
// (زي: [{ label: 'العبوة', qty: 1, price: 249, oldPrice: 310, isBundle: false }, ...])
export function parseOfferOptions(description) {
  if (!description) return [];

  const options = [];

  description.split("\n").forEach((line) => {
    const match = line.match(OFFER_PRICE_REGEX);
    if (!match) return;

    const [fullMatch, newPriceStr, oldPriceStr] = match;
    const before = line.slice(0, match.index).trim();
    const after = line.slice(match.index + fullMatch.length).trim();

    const price = parseInt(newPriceStr.replace(/,/g, ""), 10);
    const oldPrice = parseInt(oldPriceStr.replace(/,/g, ""), 10);
    const qty = extractQty(before);
    const isBundle = /(2\s*\+\s*1|عرض|اشتر)/.test(before);

    options.push({
      key: `${qty}-${price}`,
      label: cleanLabel(before),
      qty,
      price,
      oldPrice,
      isBundle,
      note: after,
    });
  });

  return options;
}

// بيشيل من الوصف أي سطر فيه سعر (عشان الأسطر دي هتتعرض كاختيارات منفصلة
// بدل ما تتكرر تاني جوه فقرة الوصف العادية)
export function stripOfferLines(description) {
  if (!description) return "";
  return description
    .split("\n")
    .filter((line) => !OFFER_PRICE_REGEX.test(line))
    .join("\n");
}
