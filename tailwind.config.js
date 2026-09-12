/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        // الألوان مستخرجة من هوية "Clean Korea" (image_1.png)
        brand: {
          bg: '#F7F4EC', // خلفية كريمية
          surface: '#FFFFFF',
          border: '#E4DFCF',
          text: '#2B2B26',
          muted: '#6B6B62',
          light: '#EFEADA',
          primary: '#3E6B4E', // أخضر أساسي
          primaryDark: '#2C4F3A', // أخضر غامق (أزرار / فوتر)
          primaryDarker: '#233F2F',
          accent: '#7C9A63', // أخضر فاتح للتفاصيل
          danger: '#C0483D', // أحمر تراكوتا لبادچ الخصم
          navy: '#1F2937', // أزرق داكن للهوية
        },
      },
      fontFamily: {
        display: ["'Reem Kufi'", 'sans-serif'],
        body: ["'Tajawal'", 'sans-serif'],
      },
    },
  },
  plugins: [],
};
