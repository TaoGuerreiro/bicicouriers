const colors = require('tailwindcss/colors.js')


module.exports = {
    purge: {
      enabled: false,
      content: [
        'app/views/**/*.html.erb',
        'app/components/**/*.html.erb',
        './app/config/initializers/**/*.rb',
        './app/javascript/**/*.js'
      ]
    },
    darkMode: false, // or 'media' or 'class'
    theme: {
      scale: {
        '101': '1.01',
        '102': '1.02',
        '0': '0',
        '25': '.25',
        '50': '.5',
        '75': '.75',
        '90': '.9',
        '95': '.95',
        '100': '1',
        '105': '1.05',
        '110': '1.1',
        '125': '1.25',
        '150': '1.5',
        '200': '2',
      },
      minHeight: {
         '96': '24rem',
         '64': '16rem',
      },
      minWidth: {
        '96': '24rem',
        '64': '16rem',
        '72': '18rem',
      },
      extend: {
        animation: {
          'spin-slow': 'spin 3s linear infinite',
        },
        backgroundImage: theme => ({
          'bridge-image': "url('../../assets/images/story/story-image.png')",
          'bridge-large-image': "url('../../assets/images/velo-sur-pont-nantes.png')"
         }),
        colors: {
          'blue-bici': '#153A7E',
          'blue-bici-dark': '#001E56',
          'pink-bici': '#FF016C',
          'pink-bici-dark': '#D8005A',
          'yellow-bici': '#FFCC00',
          orange: colors.orange,
        },
      },
    },
    variants: {
      extend: {
        borderStyle: ['hover', 'focus'],
        fontWeight: ['hover', 'focus'],
        rotate: ['active', 'group-hover'],
        transform: ['group-hover'],
        transformOrigin: ['group-hover'],
      },
    },
    plugins: [],
  }
