// Helper function to display genres
export function displayGenre(genre: string | string[]): string {
  return Array.isArray(genre) ? genre.join(', ') : genre;
}

// Helper function to check if a movie has a genre
export function hasGenre(movieGenre: string | string[], targetGenre: string): boolean {
  const genres = Array.isArray(movieGenre) ? movieGenre : [movieGenre];
  return genres.some(g => g.includes(targetGenre));
}

// Helper function to get all genres from a movie as an array
export function getGenresArray(genre: string | string[]): string[] {
  return Array.isArray(genre) ? genre : [genre];
}
