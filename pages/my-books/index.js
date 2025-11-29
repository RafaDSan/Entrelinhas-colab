import { useState, useEffect } from "react";

export default function MyBooksPage() {
  const [fetchResults, setFetchResults] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSaveBook = async (book) => {
    try {
      const response = await fetch("/api/v1/favorites", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ book_id: book.id }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(
          errorData.message || "Falhou em salvar livro aos favoritos."
        );
      }

      alert(`"${book.title}" was added to your favorites!`);
    } catch (err) {
      setError(err.message);
      alert(`Error: ${err.message}`);
    }
  };

  useEffect(() => {
    const handleFetch = async () => {
      setIsLoading(true);
      setError(null);

      try {
        const response = await fetch("/api/v1/books");
        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.message || "Ocorreu um erro na busca.");
        }

        const bookList = await response.json();
        setFetchResults(bookList);
      } catch (err) {
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };

    handleFetch();
  }, []);

  if (isLoading) {
    return <div>Carregando livros...</div>;
  }

  if (error) {
    return <div>Erro: {error}</div>;
  }

  return (
    <div
      style={{
        fontFamily: "sans-serif",
        maxWidth: "800px",
        margin: "0 auto",
        padding: "20px",
      }}
    >
      <h1> Meus Livros </h1>
      <p> Lista de leitura</p>
      <div id="results" style={{ marginTop: "30px" }}>
        {fetchResults.map((book) => (
          <div
            key={book.key}
            style={{
              display: "flex",
              gap: "20px",
              marginBottom: "20px",
              borderBottom: "1px solid #ccc",
              paddingBottom: "20px",
            }}
          >
            <img
              src={
                book.cover_url || "https://placehold.co/128x192?text=Sem+Capa"
              }
              alt={`Capa do livro ${book.title}`}
              style={{ width: "128px", height: "192px", objectFit: "cover" }}
            />
            <div>
              <h2 style={{ marginTop: 0 }}>{book.title}</h2>
              <p>
                <strong>Autor:</strong> {book.author_name}
              </p>
              <p>
                <strong> Ano de Publicação:</strong> {book.first_publish_year}
              </p>
              <button onClick={() => handleSaveBook(book)}>
                Adicionar aos Favoritos
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
