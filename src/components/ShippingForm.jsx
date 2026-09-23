import React from 'react';
import { GOVERNORATES } from '../data/products.js';

export default function ShippingForm({ form, errors, setField }) {
  return (
    <div className="grid gap-3 sm:grid-cols-2">
      <div className="sm:col-span-2">
        <input
          className="input w-full"
          placeholder="الاسم بالكامل"
          value={form.fullName}
          onChange={setField('fullName')}
        />
        {errors.fullName && (
          <p className="mt-1 text-xs text-red-500">{errors.fullName}</p>
        )}
      </div>

      <div>
        <input
          className="input w-full"
          placeholder="رقم التليفون"
          value={form.phone}
          onChange={setField('phone')}
          maxLength={11}
          dir="ltr"
        />
        {errors.phone && (
          <p className="mt-1 text-xs text-red-500">{errors.phone}</p>
        )}
      </div>

      <div>
        <input
          className="input w-full"
          placeholder="رقم بديل (اختياري)"
          value={form.altPhone}
          onChange={setField('altPhone')}
          maxLength={11}
          dir="ltr"
        />
        {errors.altPhone && (
          <p className="mt-1 text-xs text-red-500">{errors.altPhone}</p>
        )}
      </div>

      <div className="sm:col-span-2">
        <select
          className="input w-full"
          value={form.governorate}
          onChange={setField('governorate')}
        >
          {GOVERNORATES.map((g) => (
            <option key={g} value={g}>
              {g}
            </option>
          ))}
        </select>
        {errors.governorate && (
          <p className="mt-1 text-xs text-red-500">{errors.governorate}</p>
        )}
      </div>

      <div className="sm:col-span-2">
        <textarea
          className="input h-24 w-full resize-none"
          placeholder="العنوان بالتفصيل"
          value={form.address}
          onChange={setField('address')}
        />
        {errors.address && (
          <p className="mt-1 text-xs text-red-500">{errors.address}</p>
        )}
      </div>

      <textarea
        className="input h-20 resize-none sm:col-span-2"
        placeholder="ملاحظات إضافية تحبي تقوليها (اختياري)"
        value={form.notes}
        onChange={setField('notes')}
      />
    </div>
  );
}
