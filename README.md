# Filmorae: Your Movie Review & Rating Platform 🎬
Filmorae is a modern, responsive web application that allows users to search for movies, view detailed information, and share their reviews. Built as a static site, it leverages the OMDB API to fetch movie data and uses local storage to save user reviews.

---

## ✨ Features

* Movie Search: Instantly search for any movie title using the search bar.

* Trending & Top-Rated Sections: Discover popular and highly-rated movies with pre-populated carousels.

* Dynamic Movie Details: Click on a movie card to view detailed information like plot, director, actors, and ratings.

* User Reviews: Add your own star rating and review for any movie. Reviews are saved locally for the session.

* Responsive Design: Enjoy a seamless experience on both desktop and mobile devices.

* Clean UI: A user-friendly interface with smooth animations and a dark theme.

---

## ⚙️ How It's Built

* **HTML5**: For the semantic structure of the web page.

* **CSS3**: For styling and responsive design.

* **JavaScript (ES6+)**: Powers all the dynamic functionality, including API calls, DOM manipulation, and user interactions.

* **OMDB API**: The primary data source for all movie information.

---

## 🚀 Getting Started

To get a copy of the project up and running on your local machine, follow these simple steps.

### Prerequisites

You need to have **Node.js** and **npm** installed on your system.

### Installation

Clone the repository:

    git clone <your-repository-url>
    
    cd filmorae-movie-reviews

### Install dependencies:

    npm install

### Environment Variables

This project uses an API key to fetch movie data. To keep your key secure, you must add it to a .env file.

* Create a file named .env in the root of your project.

* Add your OMDB API key to the file in the following format:

      VITE_OMDB_API_KEY=your_api_key_here

### Running the Project

To start the local development server:

    npm run dev

Open your browser and navigate to the address shown in your terminal<br>
(usually http://localhost:5173).

---

## 💻 Live Preview
You can see a live version of the project here:

[**Filmorae**]()
--- 

Built with ❤️ by **Govind Chudhari @2025**
