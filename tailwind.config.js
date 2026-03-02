/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            colors: {
                category: {
                    1: '#3b82f6', // Goals/Requirements - Blue
                    2: '#10b981', // Nice-to-Have - Green
                    3: '#f59e0b', // Intuitive Discomfort - Amber
                    4: '#ef4444', // Critical Avoidance - Red
                }
            }
        },
    },
    plugins: [],
}
