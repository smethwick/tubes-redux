/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{html,js,svelte,ts}'],
  theme: {
    extend: {
      typography: (theme) => ({
        DEFAULT: {
          css: {
            'h3, h2': {
              fontWeight: 500,
              fontStretch: '50%',
            }
          },
        }
      }),

      fontFamily: {
        'serif': ["Roboto SerifVariable", "Roboto Serif", "Georgia", "Baskerville", "serif"]
      },

    },
  },
  plugins: [
    require('@tailwindcss/forms'),
    require('@tailwindcss/typography'),
  ],
}
