// Daily puzzle data - indexed by date
const PUZZLE_DATA = {
    "2026-08-13": {
        id: "2026-08-13",
        title: "Inception",
        year: 2010,
        cast: [
            {
                billing: 10,
                name: "Dileep Rao",
                character: "Yusuf",
                image: "https://via.placeholder.com/200x300?text=Dileep+Rao"
            },
            {
                billing: 9,
                name: "Cillian Murphy",
                character: "Robert Fischer",
                image: "https://via.placeholder.com/200x300?text=Cillian+Murphy"
            },
            {
                billing: 8,
                name: "Ellen Page",
                character: "Ariadne",
                image: "https://via.placeholder.com/200x300?text=Ellen+Page"
            },
            {
                billing: 7,
                name: "Ken Watanabe",
                character: "Saito",
                image: "https://via.placeholder.com/200x300?text=Ken+Watanabe"
            },
            {
                billing: 6,
                name: "Tom Hardy",
                character: "Eames",
                image: "https://via.placeholder.com/200x300?text=Tom+Hardy"
            },
            {
                billing: 5,
                name: "Joseph Gordon-Levitt",
                character: "Arthur",
                image: "https://via.placeholder.com/200x300?text=Joseph+Gordon-Levitt"
            },
            {
                billing: 4,
                name: "Watanabe Ken",
                character: "Mal",
                image: "https://via.placeholder.com/200x300?text=Marion+Cotillard"
            },
            {
                billing: 3,
                name: "Marion Cotillard",
                character: "Mal",
                image: "https://via.placeholder.com/200x300?text=Marion+Cotillard"
            },
            {
                billing: 2,
                name: "Michael Caine",
                character: "Professor Miles",
                image: "https://via.placeholder.com/200x300?text=Michael+Caine"
            },
            {
                billing: 1,
                name: "Leonardo DiCaprio",
                character: "Cobb",
                image: "https://via.placeholder.com/200x300?text=Leonardo+DiCaprio"
            }
        ]
    },
    "2026-08-12": {
        id: "2026-08-12",
        title: "The Dark Knight",
        year: 2008,
        cast: [
            {
                billing: 10,
                name: "Michael Caine",
                character: "Alfred",
                image: "https://via.placeholder.com/200x300?text=Michael+Caine"
            },
            {
                billing: 9,
                name: "Maggie Gyllenhaal",
                character: "Rachel Dawes",
                image: "https://via.placeholder.com/200x300?text=Maggie+Gyllenhaal"
            },
            {
                billing: 8,
                name: "Gary Oldman",
                character: "Commissioner Gordon",
                image: "https://via.placeholder.com/200x300?text=Gary+Oldman"
            },
            {
                billing: 7,
                name: "Morgan Freeman",
                character: "Lucius Fox",
                image: "https://via.placeholder.com/200x300?text=Morgan+Freeman"
            },
            {
                billing: 6,
                name: "Eric Roberts",
                character: "Sal Maroni",
                image: "https://via.placeholder.com/200x300?text=Eric+Roberts"
            },
            {
                billing: 5,
                name: "Chin Han",
                character: "Lau",
                image: "https://via.placeholder.com/200x300?text=Chin+Han"
            },
            {
                billing: 4,
                name: "Aaron Eckhart",
                character: "Harvey Dent",
                image: "https://via.placeholder.com/200x300?text=Aaron+Eckhart"
            },
            {
                billing: 3,
                name: "Heath Ledger",
                character: "The Joker",
                image: "https://via.placeholder.com/200x300?text=Heath+Ledger"
            },
            {
                billing: 2,
                name: "Christian Bale",
                character: "Bruce Wayne",
                image: "https://via.placeholder.com/200x300?text=Christian+Bale"
            },
            {
                billing: 1,
                name: "Christian Bale",
                character: "Batman",
                image: "https://via.placeholder.com/200x300?text=Christian+Bale+Batman"
            }
        ]
    },
    "2026-08-11": {
        id: "2026-08-11",
        title: "Interstellar",
        year: 2014,
        cast: [
            {
                billing: 10,
                name: "Michael Caine",
                character: "Professor Brand",
                image: "https://via.placeholder.com/200x300?text=Michael+Caine"
            },
            {
                billing: 9,
                name: "David Oyelowo",
                character: "Deputy Police Chief Stafford",
                image: "https://via.placeholder.com/200x300?text=David+Oyelowo"
            },
            {
                billing: 8,
                name: "Jeff Daniels",
                character: "Principal",
                image: "https://via.placeholder.com/200x300?text=Jeff+Daniels"
            },
            {
                billing: 7,
                name: "Timothée Chalamet",
                character: "Tom",
                image: "https://via.placeholder.com/200x300?text=Timothee+Chalamet"
            },
            {
                billing: 6,
                name: "Ellen Page",
                character: "CASE",
                image: "https://via.placeholder.com/200x300?text=Ellen+Page"
            },
            {
                billing: 5,
                name: "Wes Bentley",
                character: "Doyle",
                image: "https://via.placeholder.com/200x300?text=Wes+Bentley"
            },
            {
                billing: 4,
                name: "Anne Hathaway",
                character: "Dr. Amelia Brand",
                image: "https://via.placeholder.com/200x300?text=Anne+Hathaway"
            },
            {
                billing: 3,
                name: "Matt Damon",
                character: "Dr. Mann",
                image: "https://via.placeholder.com/200x300?text=Matt+Damon"
            },
            {
                billing: 2,
                name: "Jessica Chastain",
                character: "Murph",
                image: "https://via.placeholder.com/200x300?text=Jessica+Chastain"
            },
            {
                billing: 1,
                name: "Matthew McConaughey",
                character: "Cooper",
                image: "https://via.placeholder.com/200x300?text=Matthew+McConaughey"
            }
        ]
    }
};

// Movie database for autocomplete - can be expanded
const MOVIE_DATABASE = [
    { title: "Inception", year: 2010 },
    { title: "The Dark Knight", year: 2008 },
    { title: "Interstellar", year: 2014 },
    { title: "The Matrix", year: 1999 },
    { title: "Gladiator", year: 2000 },
    { title: "Pulp Fiction", year: 1994 },
    { title: "Forrest Gump", year: 1994 },
    { title: "The Shawshank Redemption", year: 1994 },
    { title: "Goodfellas", year: 1990 },
    { title: "Dune", year: 2021 },
    { title: "Oppenheimer", year: 2023 },
    { title: "Avatar", year: 2009 },
    { title: "Titanic", year: 1997 },
    { title: "The Avengers", year: 2012 },
    { title: "Endgame", year: 2019 },
    { title: "Parasite", year: 2019 },
    { title: "Roma", year: 2018 },
    { title: "La La Land", year: 2016 },
    { title: "Moonlight", year: 2016 },
    { title: "Get Out", year: 2017 }
];

// Get today's puzzle
function getTodaysPuzzle() {
    const today = new Date().toISOString().split('T')[0]; // YYYY-MM-DD format
    return PUZZLE_DATA[today] || PUZZLE_DATA["2026-08-13"]; // Default to first puzzle
}

// Search for movies matching query
function searchMovies(query) {
    if (!query || query.length < 1) return [];
    const lowerQuery = query.toLowerCase();
    return MOVIE_DATABASE.filter(movie => 
        movie.title.toLowerCase().includes(lowerQuery)
    ).slice(0, 6); // Return top 6 matches
}
