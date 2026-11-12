/** @type {import('tailwindcss').Config} */
module.exports = {
    // NOTE: Update this to include the paths to all files that contain Nativewind classes.
    content: ['./src/**/*.{js,jsx,ts,tsx}'],
    presets: [require('nativewind/preset')],
    theme: {
        extend: {
            fontFamily: {
                'PixelifySans-Bold': 'PixelifySans-Bold',
                'PixelifySans-Medium': 'PixelifySans-Medium',
                'PixelifySans-Regular': 'PixelifySans-Regular',
                'PixelifySans-SemiBold': 'PixelifySans-SemiBold'
            }
        }
    },
    plugins: [
        require('tailwindcss/plugin')(({ addVariant }) => {
            addVariant('reduce-motion', '@media (prefers-reduced-motion)');
        })
    ]
};
