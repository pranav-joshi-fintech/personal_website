type Project = {
    title: string;
    description: string;
    githubUrl: string;
    image: string;
    demoUrl: string;
    technologies: string[];
};

export const projects: Project[] = [
    {
        title: "Vimy",
        description: "A global macOS vim emulator for all text fields.",
        githubUrl: "https://github.com/michaeljf07/vimy",
        image: "/project_images/vimy.png",
        demoUrl: "/demos/vimy_demo.mp4",
        technologies: ["C", "CMake", "macOS", "Vim", "Emulator"],
    },
    {
        title: "Japanese <-> English AI Translator for macOS",
        description:
            "A desktop app for translating English <-> Japanese audio and text for macOS built with SwiftUI and Swift.",
        githubUrl: "https://github.com/michaeljf07/mimi",
        image: "/project_images/mimi.png",
        demoUrl: "/project_images/mimi.png",
        technologies: ["SwiftUI", "Swift", "macOS", "Desktop App", "Translation", "Bash"],
    },
    {
        title: "Logstreamer",
        description:
            "A CLI tool for streaming logs from multiple terminals, docker containers, and other sources to a single terminal.",
        githubUrl: "https://github.com/michaeljf07/logstreamer",
        image: "/project_images/logstreamer.png",
        demoUrl: "/project_images/logstreamer.png",
        technologies: ["Go", "CLI", "Terminal", "Supabase", "Docker"],
    },
    {
        title: "Mock API Server for TypeScript",
        description:
            "An npm CLI package for generating mock API servers from TypeScript schema files to streamline the development process.",
        githubUrl: "https://github.com/michaeljf07/Mock-API",
        image: "/project_images/mock_api.png",
        demoUrl: "/demos/mock_api_demo.mp4",
        technologies: ["TypeScript", "API", "Express", "Backend", "CLI", "Web Development", "npm"],
    },
    {
        title: "Sublet Centre",
        description:
            "A web application that connects students looking for sublets with those offering them, featuring search, listings, and user authentication.",
        githubUrl: "https://github.com/michaeljf07/sublet-centre",
        image: "/project_images/sublet-centre.png",
        demoUrl: "/demos/sublet_centre_demo.mp4",
        technologies: [
            "Next.js",
            "TypeScript",
            "Tailwind CSS",
            "Full-Stack",
            "Supabase",
            "Authentication",
        ],
    },
    {
        title: "Forex Stock Predictor",
        description:
            "A machine learning pipeline for predicting forex price movements using technical indicators and market data. Achieved significant accuracy in forecasting currency trends.",
        githubUrl: "https://github.com/michaeljf07/forex-predictor",
        image: "/project_images/forex.png",
        demoUrl: "/demos/forex_demo.mp4",
        technologies: [
            "Python",
            "Pandas",
            "Scikit-learn",
            "Machine Learning",
            "Forex",
            "Data Analysis",
        ],
    },
    {
        title: "Baobab",
        description:
            "A platform designed to make charitable giving simple, transparent, and impactful by directly connecting donors and charities.",
        githubUrl: "https://github.com/michaeljf07/baobab-website",
        image: "/project_images/baobab.png",
        demoUrl: "/demos/baobab_demo.mp4",
        technologies: ["Next.js", "TypeScript", "Tailwind CSS", "Full-Stack", "MongoDB", "Charity"],
    },
    {
        title: "Atari Centipede Remake",
        description:
            "A replica of the classic Atari Centipede game developed using Python and Pygame as the final culminating project for my grade 12 computer science class.",
        githubUrl: "https://github.com/michaeljf07/centipede",
        image: "/project_images/centipede.png",
        demoUrl: "/demos/centipede_demo.mp4",
        technologies: ["Python", "Pygame", "Game Development"],
    },
    {
        title: "Stock Ticker Game",
        description:
            "A Python-based stock trading simulation game built with Pygame; based on the Stock Ticker board game where players buy and sell stocks to maximize their portfolio value.",
        githubUrl: "https://github.com/michaeljf07/Stock-Ticker",
        image: "/project_images/stock_ticker.png",
        demoUrl: "/demos/stock_ticker_demo.mp4",
        technologies: ["Python", "Pygame", "Game Development", "Finance"],
    },
];
