/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.tsx',
    './components/**/*.tsx'
  ],
  theme: {
    fontFamily: {
      'sans': ['Inter']
    },
    extend: {
      animation: {
        'spin-fast': 'spin .7s linear infinite'
      },
      colors: {
        'primary': '#7C52BF',
        'gray': '#878787',
        'light-gray': '#D2D2D2',
        'input-bg': '#F8F8F8'
      },
      spacing: {
        '0': '0rem',
        '1': '1rem',
        '2': '2rem',
        '3': '3rem',
        '4': '4rem',
        '5': '5rem',
        '6': '6rem',
        '7': '7rem',
        '8': '8rem',
        '9': '9rem',
        '10': '10rem',
        '11': '11rem',
        '12': '12rem',
        '13': '13rem',
        '14': '14rem',
        '15': '15rem',
        '16': '16rem',
        '17': '17rem',
        '18': '18rem',
        '19': '19rem',
        '20': '20rem',
        '21': '21rem',
        '22': '22rem',
        '23': '23rem',
        '24': '24rem',
        '25': '25rem',
        '26': '26rem',
        '27': '27rem',
        '28': '28rem',
        '29': '29rem',
        '30': '30rem',
        '31': '31rem',
        '32': '32rem',
        '33': '33rem',
        '34': '34rem'
      },
      boxShadow: {
        'normal': '1px 1px 4px rgba(0, 0, 0, 0.2)'
      }
    },
  },
  plugins: [],
}
