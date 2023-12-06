
import daisyui from 'daisyui';
import typography from '@tailwindcss/typography';
import forms from '@tailwindcss/forms';
import defaultTheme from 'tailwindcss/defaultTheme';
import plugin from 'tailwindcss/plugin';

/** @type {import('tailwindcss').Config}*/
const config = {
	content: ['./src/**/*.{html,js,svelte,ts}'],

	theme: {
		extend: {
			fontFamily: {
				kumbhSans: ['"NotoSansThai"', ...defaultTheme.fontFamily.sans]
			}
		}
	},

	plugins: [forms, typography, daisyui,
		plugin(function ({ matchUtilities, theme }) {
			matchUtilities(
				{
					'bg-gradient': (angle) => ({
						'background-image': `linear-gradient(${angle}, var(--tw-gradient-stops))`,
					}),
				},
				{
					// values from config and defaults you wish to use most
					values: Object.assign(
						theme('bgGradientDeg', {}), // name of config key. Must be unique
						{
							10: '10deg', // bg-gradient-10
							15: '15deg',
							20: '20deg',
							25: '25deg',
							30: '30deg',
							45: '45deg',
							60: '60deg',
							90: '90deg',
							120: '120deg',
							135: '135deg',
							220: '220deg',
							320: '320deg',
						}
					)
				}
			)
		})],
	daisyui: {
		themes: ["emerald"],
	},


};

module.exports = config;
