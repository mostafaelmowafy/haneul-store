import React from 'react';
import { Star } from 'lucide-react';

function StarRow({ rating }) {
  return (
    <div className="flex items-center gap-0.5">
      {Array.from({ length: 5 }).map((_, i) => (
        <Star
          key={i}
          className={`h-4 w-4 ${
            i < rating
              ? 'fill-amber-400 text-amber-400'
              : 'fill-transparent text-brand-border'
          }`}
        />
      ))}
    </div>
  );
}

export default function Reviews({ reviews = [] }) {
  const average =
    reviews.length > 0
      ? (reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length).toFixed(1)
      : null;

  return (
    <div className="mt-16">
      <div className="mb-6 flex items-center justify-between">
        <h2 className="font-display text-xl text-brand-primaryDark">
          آراء العملاء
        </h2>
        {average && (
          <div className="flex items-center gap-2 text-sm text-brand-text">
            <StarRow rating={Math.round(Number(average))} />
            <span className="font-semibold">{average}</span>
            <span className="text-brand-muted">
              ({reviews.length} {reviews.length === 1 ? 'تقييم' : 'تقييمات'})
            </span>
          </div>
        )}
      </div>

      {reviews.length === 0 ? (
        <p className="rounded-xl border border-dashed border-brand-border bg-brand-light/60 p-5 text-center text-sm text-brand-muted">
          لسه مفيش تقييمات على المنتج ده. كوني أول واحدة تجرّبي وتقيّمي 🌿
        </p>
      ) : (
        <div className="space-y-4">
          {reviews.map((review, i) => (
            <div
              key={i}
              className="rounded-xl border border-brand-border bg-brand-surface p-4"
            >
              <div className="mb-2 flex items-center justify-between">
                <p className="text-sm font-semibold text-brand-text">
                  {review.name}
                </p>
                <StarRow rating={review.rating} />
              </div>
              <p className="text-sm leading-relaxed text-[#4A4A42]">
                {review.text}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
