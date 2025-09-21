// script.js
        document.addEventListener('DOMContentLoaded', () => {
            
            // Use the environment variable from Vite's import.meta.env
            const OMDB_API_KEY = import.meta.env.VITE_OMDB_API_KEY; 

            const hamburger = document.querySelector('.hamburger');
            const navLinks = document.querySelector('.nav-links');
            const movieSearchInput = document.getElementById('movie-search');
            const searchButton = document.getElementById('search-btn');
            const clearSearchBtn = document.getElementById('clear-search-btn');
            const movieResultsDiv = document.getElementById('movie-results');
            const loadMoreBtn = document.getElementById('load-more-btn');
            const loader = document.getElementById('loader');
            const movieModal = document.getElementById('movie-modal');
            const modalDetails = document.getElementById('modal-details');
            const closeBtn = document.querySelector('.close-btn');
            const toast = document.getElementById('toast');
            
            let currentPage = 1;
            let currentSearchQuery = '';
            // In-memory object to store reviews for the current session
            const sessionReviews = {};

            // --- Navigation and UI Handlers ---
            hamburger.addEventListener('click', () => {
                navLinks.classList.toggle('active');
            });

            document.querySelectorAll('.nav-links a').forEach(link => {
                link.addEventListener('click', () => {
                    navLinks.classList.remove('active');
                });
            });

            closeBtn.addEventListener('click', () => {
                movieModal.classList.remove('active');
            });

            window.addEventListener('click', (e) => {
                if (e.target === movieModal) {
                    movieModal.classList.remove('active');
                }
            });

            const showToast = (message) => {
                toast.textContent = message;
                toast.classList.add('show');
                setTimeout(() => {
                    toast.classList.remove('show');
                }, 3000);
            };

            // --- API & Data Fetching ---
            const fetchMovies = async (query, page, append = false) => {
                if (query.trim() === '') {
                    movieResultsDiv.innerHTML = '';
                    movieResultsDiv.style.display = 'none';
                    loadMoreBtn.style.display = 'none';
                    return;
                }
                
                movieResultsDiv.style.display = 'grid'; 
                loader.style.display = 'block';
                if (!append) {
                    movieResultsDiv.innerHTML = '';
                    loadMoreBtn.style.display = 'none';
                }

                try {
                    const response = await fetch(`https://www.omdbapi.com/?s=${query}&page=${page}&apikey=${OMDB_API_KEY}`);
                    const data = await response.json();
                    if (data.Response === 'True') {
                        displayMovies(data.Search, movieResultsDiv, append);
                        if (data.totalResults > page * 10) {
                            loadMoreBtn.style.display = 'block';
                        } else {
                            loadMoreBtn.style.display = 'none';
                        }
                    } else if (!append) {
                        movieResultsDiv.innerHTML = `<p style="text-align: center; color: var(--light-text);">No movies found for "${query}".</p>`;
                    }
                } catch (error) {
                    console.error('Error fetching movies:', error);
                    showToast('An error occurred. Please try again.');
                } finally {
                    loader.style.display = 'none';
                }
            };

            const fetchMovieDetails = async (imdbID) => {
                try {
                    const response = await fetch(`https://www.omdbapi.com/?i=${imdbID}&apikey=${OMDB_API_KEY}`);
                    const data = await response.json();
                    if (data.Response === 'True') {
                        displayMovieDetails(data);
                    } else {
                        showToast('Failed to load movie details.');
                    }
                } catch (error) {
                    console.error('Error fetching movie details:', error);
                    showToast('An error occurred. Please try again.');
                }
            };

            const fetchTrendingMovies = async () => {
                const trendingTitles = ['Avengers', 'The Matrix', 'Inception', 'Joker', 'Parasite', 'Dune'];
                const trendingMoviesContainer = document.getElementById('trending-movies');
                trendingMoviesContainer.innerHTML = '';
                for (const title of trendingTitles) {
                    try {
                        const response = await fetch(`https://www.omdbapi.com/?s=${title}&apikey=${OMDB_API_KEY}`);
                        const data = await response.json();
                        if (data.Response === 'True' && data.Search.length > 0) {
                            const firstResult = data.Search[0];
                            displayMovies([firstResult], trendingMoviesContainer, true);
                        }
                    } catch (error) {
                        console.error(`Error fetching trending movie ${title}:`, error);
                    }
                }
            };
            
            const fetchTopRatedMovies = async () => {
                const topRatedTitles = ['The Dark Knight', 'Pulp Fiction', 'The Shawshank Redemption', 'Forrest Gump', 'The Godfather', 'Fight Club'];
                const topRatedMoviesContainer = document.getElementById('top-rated-movies');
                topRatedMoviesContainer.innerHTML = '';
                for (const title of topRatedTitles) {
                    try {
                        const response = await fetch(`https://www.omdbapi.com/?s=${title}&apikey=${OMDB_API_KEY}`);
                        const data = await response.json();
                        if (data.Response === 'True' && data.Search.length > 0) {
                            const firstResult = data.Search[0];
                            displayMovies([firstResult], topRatedMoviesContainer, true);
                        }
                    } catch (error) {
                        console.error(`Error fetching top-rated movie ${title}:`, error);
                    }
                }
            };

            // --- Search & Load More Functionality ---
            searchButton.addEventListener('click', (e) => {
                e.preventDefault();
                currentSearchQuery = movieSearchInput.value;
                currentPage = 1;
                fetchMovies(currentSearchQuery, currentPage);
            });
            
            clearSearchBtn.addEventListener('click', () => {
                movieSearchInput.value = '';
                currentSearchQuery = '';
                movieResultsDiv.innerHTML = '';
                movieResultsDiv.style.display = 'none';
                loadMoreBtn.style.display = 'none';
            });

            movieSearchInput.addEventListener('keypress', (e) => {
                if (e.key === 'Enter') {
                    currentSearchQuery = movieSearchInput.value;
                    currentPage = 1;
                    fetchMovies(currentSearchQuery, currentPage);
                }
            });
            
            movieSearchInput.addEventListener('input', () => {
                if (movieSearchInput.value.length > 0) {
                    clearSearchBtn.style.display = 'block';
                } else {
                    clearSearchBtn.style.display = 'none';
                }
            });


            loadMoreBtn.addEventListener('click', () => {
                currentPage++;
                fetchMovies(currentSearchQuery, currentPage, true);
            });

            // --- Dynamic UI Population ---
            const displayMovies = (movies, container, append = false) => {
                if (!append) {
                    container.innerHTML = '';
                }
                movies.forEach(movie => {
                    const movieCard = document.createElement('div');
                    movieCard.classList.add('movie-card');
                    movieCard.dataset.imdbID = movie.imdbID;
                    movieCard.innerHTML = `
                        <img src="${movie.Poster !== 'N/A' ? movie.Poster : 'https://placehold.co/300x450/333/fff?text=No+Poster'}" alt="${movie.Title} Poster" class="movie-poster">
                        <div class="movie-info">
                            <h3 class="movie-title">${movie.Title}</h3>
                            <p class="movie-year">${movie.Year}</p>
                        </div>
                    `;
                    container.appendChild(movieCard);
                });
            };

            const displayMovieDetails = (movie) => {
                const existingReviews = loadReviews(movie.imdbID);
                const reviewHtml = existingReviews.map(review => `
                    <div class="review-card">
                        <h4>${review.name || 'Anonymous'} - ${'★'.repeat(review.rating)}${'☆'.repeat(5 - review.rating)}</h4>
                        <p>${review.text}</p>
                    </div>
                `).join('');

                modalDetails.innerHTML = `
                    <div class="movie-details-inner">
                        <img src="${movie.Poster !== 'N/A' ? movie.Poster : 'https://placehold.co/300x450/333/fff?text=No+Poster'}" alt="${movie.Title} Poster" class="details-poster">
                        <div class="details-info">
                            <h2>${movie.Title} (${movie.Year})</h2>
                            <p><strong>Genre:</strong> ${movie.Genre}</p>
                            <p><strong>Director:</strong> ${movie.Director}</p>
                            <p><strong>Actors:</strong> ${movie.Actors}</p>
                            <p><strong>Plot:</strong> ${movie.Plot}</p>
                            <p><strong>IMDB Rating:</strong> <span class="rating-stars">${'★'.repeat(Math.round(movie.imdbRating / 2))}${'☆'.repeat(5 - Math.round(movie.imdbRating / 2))}</span> (${movie.imdbRating}/10)</p>
                        </div>
                    </div>
                    <div class="reviews-section">
                        <h3>Your Review</h3>
                        <div class="review-form-container">
                            <form id="review-form">
                                <label for="reviewer-name">Your Name</label>
                                <input type="text" id="reviewer-name" class="name-input" placeholder="Enter your name (optional)">
                                <div class="rating-input">
                                    <input type="radio" id="star5" name="rating" value="5" /><label for="star5" title="5 stars">★</label>
                                    <input type="radio" id="star4" name="rating" value="4" /><label for="star4" title="4 stars">★</label>
                                    <input type="radio" id="star3" name="rating" value="3" /><label for="star3" title="3 stars">★</label>
                                    <input type="radio" id="star2" name="rating" value="2" /><label for="star2" title="2 stars">★</label>
                                    <input type="radio" id="star1" name="rating" value="1" /><label for="star1" title="1 star">★</label>
                                </div>
                                <textarea id="review-text" class="review-textarea" placeholder="Write your review here..."></textarea>
                                <button type="submit" class="submit-btn">Submit Review</button>
                            </form>
                        </div>
                        <h3>Community Reviews</h3>
                        <div class="reviews-list" id="community-reviews">
                            ${existingReviews.length > 0 ? reviewHtml : '<p style="text-align: center; color: var(--light-text);">No reviews yet. Be the first!</p>'}
                        </div>
                    </div>
                `;
                
                const reviewForm = document.getElementById('review-form');
                reviewForm.addEventListener('submit', (e) => {
                    e.preventDefault();
                    const name = document.getElementById('reviewer-name').value;
                    const rating = reviewForm.querySelector('input[name="rating"]:checked');
                    const text = document.getElementById('review-text').value;

                    if (!rating) {
                        showToast('Please select a star rating.');
                        return;
                    }

                    saveReview(movie.imdbID, { name: name, rating: parseInt(rating.value), text: text });
                    showToast('Review saved successfully!');
                    
                    // Clear the form
                    document.getElementById('reviewer-name').value = '';
                    document.getElementById('review-text').value = '';
                    reviewForm.querySelector('input[name="rating"]:checked').checked = false;

                    // Update the reviews list instantly
                    updateCommunityReviews(movie.imdbID);
                });

                movieModal.classList.add('active');
            };
            
            const updateCommunityReviews = (imdbID) => {
                const reviewsList = document.getElementById('community-reviews');
                const reviews = loadReviews(imdbID);
                if (reviews.length > 0) {
                    const reviewHtml = reviews.map(review => `
                        <div class="review-card">
                            <h4>${review.name || 'Anonymous'} - ${'★'.repeat(review.rating)}${'☆'.repeat(5 - review.rating)}</h4>
                            <p>${review.text}</p>
                        </div>
                    `).join('');
                    reviewsList.innerHTML = reviewHtml;
                } else {
                    reviewsList.innerHTML = '<p style="text-align: center; color: var(--light-text);">No reviews yet. Be the first!</p>';
                }
            };
            
            // Event listener for clicking on a movie card to show details
            document.addEventListener('click', (e) => {
                const movieCard = e.target.closest('.movie-card');
                if (movieCard) {
                    const imdbID = movieCard.dataset.imdbID;
                    fetchMovieDetails(imdbID);
                }
            });

            // --- Carousel Functionality ---
            document.querySelectorAll('.carousel-btn').forEach(button => {
                button.addEventListener('click', (e) => {
                    const targetId = e.currentTarget.dataset.target;
                    const container = document.getElementById(targetId);
                    const scrollAmount = container.scrollWidth / container.children.length;

                    if (e.currentTarget.classList.contains('right-btn')) {
                        container.scrollBy({ left: scrollAmount * 4, behavior: 'smooth' });
                    } else {
                        container.scrollBy({ left: -scrollAmount * 4, behavior: 'smooth' });
                    }
                });
            });

            // --- Testimonial Carousel ---
            const testimonials = [
                {
                    text: "Filmorae is my go-to for finding new movies. The reviews from other users are so helpful!",
                    author: "Alex M.",
                    photo: "img/person2.png"
                },
                {
                    text: "A fantastic platform! The interface is clean, and the rating system is simple and effective. I love the interactive elements.",
                    author: "Sarah P.",
                    photo: "img/person1.png"
                },
                {
                    text: "I love the new look! The site is now even more user-friendly and aesthetically pleasing. A great hub for movie lovers.",
                    author: "Michael R.",
                    photo: "img/person3.png"
                }
            ];

            const testimonialDisplay = document.getElementById('testimonial-display');
            const prevButton = document.getElementById('prev-testimonial');
            const nextButton = document.getElementById('next-testimonial');
            let currentTestimonialIndex = 0;

            const updateTestimonial = (index) => {
                const testimonial = testimonials[index];
                testimonialDisplay.innerHTML = `
                    <div class="testimonial-card">
                        <div class="photo-container">
                            <img src="${testimonial.photo}" alt="Photo of ${testimonial.author}">
                        </div>
                        <div class="testimonial-content">
                            <p>"${testimonial.text}"</p>
                            <span class="testimonial-author">- ${testimonial.author}</span>
                        </div>
                    </div>
                `;
            };

            prevButton.addEventListener('click', () => {
                currentTestimonialIndex = (currentTestimonialIndex - 1 + testimonials.length) % testimonials.length;
                updateTestimonial(currentTestimonialIndex);
            });

            nextButton.addEventListener('click', () => {
                currentTestimonialIndex = (currentTestimonialIndex + 1) % testimonials.length;
                updateTestimonial(currentTestimonialIndex);
            });

            updateTestimonial(currentTestimonialIndex); // Initial load

            // --- Session-based Review Storage ---
            const saveReview = (imdbID, review) => {
                if (!sessionReviews[imdbID]) {
                    sessionReviews[imdbID] = [];
                }
                sessionReviews[imdbID].push(review);
            };

            const loadReviews = (imdbID) => {
                return sessionReviews[imdbID] || [];
            };

            // Initial content load
            fetchTrendingMovies();
            fetchTopRatedMovies();
        });