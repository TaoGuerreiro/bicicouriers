module.exports = {
    purge: {
      // Learn more on https://tailwindcss.com/docs/controlling-file-size/#removing-unused-css
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
