import { useState, useEffect } from "react";

const MOCK_USER_ID = "a7287bcb-c496-4389-ba20-b7d6943dffe3"; 

export default function MyBooksPage() {
  const [bookList, setBookList] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [currentFilter, setCurrentFilter] = useState("ALL");

  const STATUS_LABELS = {
    WANT_TO_READ: "Quero Ler",
    READING: "Lendo",
    READ: "Lido",
    DROPPED: "Abandonado",
  };

  const FILTER_OPTIONS = ["ALL", "WANT_TO_READ", "READING", "READ", "DROPPED"];

  const handleUpdateStatus = async (book, newStatus) => {
    const previousBooks = [...bookList];
    setBookList((prev) =>
      prev.map((b) => (b.id === book.id ? { ...b, status: newStatus } : b))
    );

    try {
      await fetch("/api/v1/statuses", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId: MOCK_USER_ID,
          bookId: book.id,
          status: newStatus,
        }),
      });
    } catch (err) {
      setBookList(previousBooks);
      alert("Erro ao atualizar status.");
    }
  };

  const handleToggleFavorite = async (book) => {
    const isNowFavorite = !book.is_favorite;
    setBookList((prev) =>
      prev.map((b) => (b.id === book.id ? { ...b, is_favorite: isNowFavorite } : b))
    );

    try {
      const response = await fetch("/api/v1/favorites", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
           userId: MOCK_USER_ID, 
           book_id: book.id 
        }), 
      });

      if (!response.ok) throw new Error("Falha ao favoritar");
      
    } catch (err) {
      setBookList((prev) =>
        prev.map((b) => (b.id === book.id ? { ...b, is_favorite: !isNowFavorite } : b))
      );
      alert("Erro ao favoritar o livro.");
    }
  };

  useEffect(() => {
    const handleFetch = async () => {
      setIsLoading(true);
      try {
        const response = await fetch(`/api/v1/statuses?userId=${MOCK_USER_ID}`);
        const data = await response.json();
        setBookList(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };
    handleFetch();
  }, []);

  const filteredBooks = bookList.filter((book) => {
    if (currentFilter === "ALL") return true;
    return book.status === currentFilter;
  });

  if (isLoading) return <div>Carregando biblioteca...</div>;

  return (
    <div style={{ maxWidth: "800px", margin: "0 auto", padding: "20px", fontFamily: "sans-serif" }}>
      <h1>Meus Livros</h1>

      <div style={{ display: "flex", gap: "10px", marginBottom: "30px", flexWrap: "wrap" }}>
        {FILTER_OPTIONS.map((statusKey) => (
          <button
            key={statusKey}
            onClick={() => setCurrentFilter(statusKey)}
            style={{
              padding: "8px 16px",
              cursor: "pointer",
              borderRadius: "20px",
              border: "none",
              backgroundColor: currentFilter === statusKey ? "#0070f3" : "#eee",
              color: currentFilter === statusKey ? "white" : "#333",
              fontWeight: "bold",
            }}
          >
            {statusKey === "ALL" ? "Todos" : STATUS_LABELS[statusKey]}
          </button>
        ))}
      </div>

      <div>
        {filteredBooks.map((book) => (
          <div key={book.id} style={{ display: "flex", gap: "20px", marginBottom: "20px", borderBottom: "1px solid #eee", paddingBottom: "20px" }}>
            <img
              src={book.cover_url || "https://placehold.co/128x192?text=Sem+Capa"}
              alt={book.title}
              style={{ width: "100px", height: "150px", objectFit: "cover", borderRadius: "4px" }}
            />
            <div style={{ flex: 1 }}>
              <div style={{display: "flex", justifyContent: "space-between", alignItems: "flex-start"}}>
                <h2 style={{ marginTop: 0, fontSize: "1.2rem" }}>{book.title}</h2>
                
                <button 
                  onClick={() => handleToggleFavorite(book)}
                  style={{
                    background: "none",
                    border: "none",
                    cursor: "pointer",
                    fontSize: "1.5rem",
                    color: book.is_favorite ? "red" : "#ccc"
                  }}
                  title={book.is_favorite ? "Remover dos favoritos" : "Adicionar aos favoritos"}
                >
                  {book.is_favorite ? "♥" : "♡"}
                </button>
              </div>

              <p style={{ margin: "5px 0", color: "#555" }}>{book.author_name || "Autor Desconhecido"}</p>

              <div style={{ marginTop: "15px" }}>
                <p style={{ fontSize: "0.8rem", color: "#888", marginBottom: "5px" }}>Status:</p>
                <div style={{ display: "flex", gap: "5px", flexWrap: "wrap" }}>
                  {Object.keys(STATUS_LABELS).map((statusKey) => (
                    <button
                      key={statusKey}
                      onClick={() => handleUpdateStatus(book, statusKey)}
                      style={{
                        padding: "4px 8px",
                        fontSize: "0.75rem",
                        cursor: "pointer",
                        border: "1px solid",
                        borderRadius: "4px",
                        backgroundColor: book.status === statusKey ? "#4CAF50" : "transparent",
                        color: book.status === statusKey ? "white" : "#555",
                        borderColor: book.status === statusKey ? "#4CAF50" : "#ccc",
                      }}
                    >
                      {STATUS_LABELS[statusKey]}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}