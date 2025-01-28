// client/src/components/PlayerCard.js
import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { removePlayer, updatePlayer } from "../features/playersSlice";

export default function PlayerCard({ player }) {
	const dispatch = useDispatch();

	// Life & Tax handlers (unchanged)
	const incrementLife = () => {
		dispatch(
			updatePlayer({ id: player.id, updates: { life: player.life + 1 } })
		);
	};
	const decrementLife = () => {
		dispatch(
			updatePlayer({ id: player.id, updates: { life: player.life - 1 } })
		);
	};
	const incrementTax = () => {
		dispatch(
			updatePlayer({
				id: player.id,
				updates: { commanderTax: player.commanderTax + 1 },
			})
		);
	};
	const decrementTax = () => {
		dispatch(
			updatePlayer({
				id: player.id,
				updates: { commanderTax: Math.max(0, player.commanderTax - 1) },
			})
		);
	};

	// Removing a player
	const handleRemove = () => {
		dispatch(removePlayer(player.id));
	};

	// =========================
	//  NEW! Scryfall Auto-Complete
	// =========================
	const [showSearch, setShowSearch] = useState(false); // Toggles the search bar
	const [searchTerm, setSearchTerm] = useState("");
	const [suggestions, setSuggestions] = useState([]);

	// Toggle the search bar
	const toggleSearch = () => {
		setShowSearch(!showSearch);
		setSuggestions([]); // Clear old suggestions if toggling off
		setSearchTerm("");
	};

	// Fetch suggestions from Scryfall's auto-complete API
	const fetchSuggestions = async (query) => {
		try {
			const res = await fetch(
				`https://api.scryfall.com/cards/autocomplete?q=${encodeURIComponent(
					query
				)}`
			);
			const data = await res.json();
			// 'data.data' is the array of matching card names
			if (data.data) {
				setSuggestions(data.data);
			}
		} catch (error) {
			console.error("Auto-complete error:", error);
		}
	};

	// Handle typing in the search field
	const handleSearchChange = (e) => {
		const value = e.target.value;
		setSearchTerm(value);

		if (value.length > 1) {
			// Only fetch suggestions if user typed at least 2 characters
			fetchSuggestions(value);
		} else {
			setSuggestions([]);
		}
	};

	// When user clicks on a suggestion
	const handleSuggestionClick = (cardName) => {
		setSearchTerm(cardName);
		setSuggestions([]); // Hide suggestions after clicking
	};

	// Fetch the chosen card from Scryfall's named endpoint
	const fetchCardImage = async () => {
		if (!searchTerm.trim()) return;
		try {
			const res = await fetch(
				`https://api.scryfall.com/cards/named?fuzzy=${encodeURIComponent(
					searchTerm
				)}`
			);
			const data = await res.json();
			if (data.object === "error") {
				alert(`Card not found: ${data.details}`);
				return;
			}

			// We found a card! data.image_uris contains the image links
			const cardImage = data.image_uris?.art_crop || "";
			dispatch(
				updatePlayer({
					id: player.id,
					updates: { backgroundUrl: cardImage },
				})
			);
		} catch (error) {
			console.error("Fetching card image failed:", error);
		}
	};

	// End of new Scryfall logic

	// =========================
	//   RENDERING THE CARD
	// =========================
	return (
		<div style={{
            width: '250px',
            aspectRatio: '5 / 4',
            position: 'relative',
            borderRadius: '8px',
            overflow: 'hidden',
            backgroundImage: `url(${player.backgroundUrl})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
          }}>
            {/* Dark overlay if desired */}
            <div style={{
              position: 'absolute',
              inset: 0,
              backgroundColor: 'rgba(0,0,0,0.5)'
            }} />

            {/* Scrollable content */}
            <div style={{
              position: 'absolute',
              inset: 0,
              overflowY: 'auto',
              padding: '1rem',
              color: '#fff',
            }}>
				<h2>{player.name}</h2>
				<p>Life: {player.life}</p>
				<p>Commander Tax: {player.commanderTax}</p>

				<div style={{ marginBottom: "0.5rem" }}>
					<button onClick={decrementLife}>- Life</button>
					<button onClick={incrementLife}>+ Life</button>
					<button onClick={decrementTax}>- Tax</button>
					<button onClick={incrementTax}>+ Tax</button>
				</div>

				{/* REMOVE Player button */}
				<button
					style={{
						marginTop: "1rem",
						backgroundColor: "red",
						display: "inline-block",
					}}
					onClick={handleRemove}>
					Remove Player
				</button>

				{/* ===================== */}
				{/* NEW: SEARCH FUNCTION */}
				{/* ===================== */}
				<div style={{ marginTop: "1rem" }}>
					{/* Toggle the search bar */}
					<button onClick={toggleSearch}>
						{showSearch ? "Close Search" : "Search For Card"}
					</button>
					{showSearch && (
						<div style={{ marginTop: "1rem" }}>
							{/* Input for card name */}
							<input
								type="text"
								placeholder="Type a card name..."
								value={searchTerm}
								onChange={handleSearchChange}
								style={{ width: "60%" }}
							/>
							{/* Suggestion List */}
							{suggestions.length > 0 && (
								<ul
									style={{
										backgroundColor: "#222",
										listStyle: "none",
										padding: "0.5rem",
										margin: 0,
										maxHeight: "150px",
										overflowY: "auto",
										border: "1px solid #444",
										borderRadius: "4px",
										position: "absolute",
										zIndex: 2,
									}}>
									{suggestions.map((suggestion) => (
										<li
											key={suggestion}
											onClick={() =>
												handleSuggestionClick(
													suggestion
												)
											}
											style={{
												padding: "0.25rem",
												cursor: "pointer",
												borderBottom: "1px solid #333",
											}}>
											{suggestion}
										</li>
									))}
								</ul>
							)}
							{/* Button to confirm fetch */}
							<button
								onClick={fetchCardImage}
								style={{ marginLeft: "0.5rem" }}>
								Set Card BG
							</button>
						</div>
					)}
				</div>
			</div>
		</div>
	);
}
