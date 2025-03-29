import React, { useState, useEffect } from "react";

const API_KEY = "live_nSUCe3BhTfOUN8wz3Hp1GtiwnS7dV2KD5c6NswU6O6qhyhvADgL5RWqtZ0Y6aNwz";
const API_URL = "https://api.thecatapi.com/v1/images/search?include_breeds=true";

const CatFetcher = () => {
  const [cat, setCat] = useState(null);
  const [seenCats, setSeenCats] = useState([]);
  const [bannedTemperaments, setBannedTemperaments] = useState([]);

  const fetchNewCat = async () => {
    try {
      const response = await fetch(API_URL, {
        headers: { "x-api-key": API_KEY },
      });
      const data = await response.json();
      const catData = data[0];

      if (!catData || !catData.breeds || catData.breeds.length === 0) {
        fetchNewCat();
        return;
      }

      const breed = catData.breeds[0];

      if (
        breed.temperament &&
        breed.temperament.split(", ").some((t) => bannedTemperaments.includes(t))
      ) {
        fetchNewCat();
        return;
      }

      setCat({
        id: catData.id,
        image: catData.url,
        name: breed.name,
        origin: breed.origin,
        temperament: breed.temperament.split(", "),
      });

      setSeenCats((prev) => [
        { id: catData.id, image: catData.url, name: breed.name },
        ...prev.slice(0, 5),
      ]);
    } catch (error) {
      console.error("Error fetching cat:", error);
    }
  };

  const toggleBan = (temperament) => {
    setBannedTemperaments((prev) =>
      prev.includes(temperament)
        ? prev.filter((t) => t !== temperament)
        : [...prev, temperament]
    );
  };

  useEffect(() => {
    fetchNewCat();
  }, []);

  return (
    <div className="container">
      <div className="history">
        <h2>Seen Cats</h2>
        {seenCats.map((c) => (
          <div key={c.id} className="history-item">
            <img src={c.image} alt={c.name} />
            <span>{c.name}</span>
          </div>
        ))}
      </div>

      <div className="cat-info">
        {cat ? (
          <>
            <h1>{cat.name}</h1>
            <img src={cat.image} alt={cat.name} className="cat-image" />
            <p><strong>Origin:</strong> {cat.origin}</p>

            <div className="temperament-title">Temperaments (click to ban)</div>
            <div className="temperament-container">
              {cat.temperament.map((t) => (
                <div
                  key={t}
                  className="temperament-box"
                  onClick={() => toggleBan(t)}
                  style={{
                    background: bannedTemperaments.includes(t) ? "#ff4d4d" : "",
                    color: bannedTemperaments.includes(t) ? "#fff" : "",
                  }}
                >
                  {t}
                </div>
              ))}
            </div>

            {bannedTemperaments.length > 0 && (
              <div className="ban-list">
                <h2>Banned Temperaments</h2>
                <ul>
                  {bannedTemperaments.map((t) => (
                    <li key={t} onClick={() => toggleBan(t)}>
                      {t}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            <button onClick={fetchNewCat} className="button">
              Discover a New Cat
            </button>
          </>
        ) : (
          <p>Loading...</p>
        )}
      </div>
    </div>
  );
};

export default CatFetcher;
