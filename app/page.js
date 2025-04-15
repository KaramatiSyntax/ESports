"use client";

import styles from "./page.module.css";
import Intro from "@/Components/Intro/page.js";
import Timer from "@/Components/Timer/timer.js";
import PaymentPopup from "@/Components/Payment/payment.js";
import Image from "next/image";
import { useState, useRef, useEffect } from "react";
import { CiEdit } from "react-icons/ci";
import { MdDelete } from "react-icons/md";

export default function Home() {
  const [statusMessage, setStatusMessage] = useState(null);
  const [loading, setLoading] = useState(false);
  const [showPopup, setShowPopup] = useState(false);
  const [src, setSrc] = useState("/fast-forward.png");
  const [error, setError] = useState("");
  const [players, setPlayers] = useState([]);
  const [placeholder, setPlaceholder] = useState("Player1");
  const [showSubOption, setShowSubOption] = useState(false);
  const [editIndex, setEditIndex] = useState(null);
  const [teamName, setTeamName] = useState("");
  const [captainName, setCaptainName] = useState("");
  const [addSub, setAddSub] = useState(false);
  const playerInput = useRef();
  const [isRegistered, setIsRegistered] = useState(false);

  useEffect(() => {
    if (error) {
      const timeout = setTimeout(() => setError(""), 3000);
      return () => clearTimeout(timeout);
    }
  }, [error]);

  useEffect(() => {
    const teamInfo = JSON.parse(localStorage.getItem("registeredTeam"));
    if (teamInfo) {
      setIsRegistered(true);
      if (teamInfo.payment === "pending") {
        setStatusMessage("You are registered!! Please complete the payment.");
      } else if (teamInfo.payment === "successful") {
        setStatusMessage(
          "You are registered and payment is complete. Wait for your turn on 20 April. You will be notified in the Telegram group."
        );
      }
    }
  }, []);

  useEffect(() => {
    if (playerInput.current) {
      playerInput.current.focus();
    }
  }, [players, editIndex]);

  function save(player) {
    const trimmed = player.trim();
    if (players.includes(trimmed)) return setError("Player already added!");
    if (trimmed.length < 7) return setError("Player ID must be at least 7 characters!");
    if (trimmed === "") return setError("Please fill a valid ID!!");

    if (editIndex !== null) {
      const updated = [...players];
      updated[editIndex] = trimmed;
      setPlayers(updated);
      setEditIndex(null);
      playerInput.current.value = "";
      return;
    }

    if (players.length < 4) {
      setPlayers([...players, trimmed]);
      playerInput.current.value = "";
      setPlaceholder(`Player${players.length + 2}`);
      if (players.length === 3) {
        setShowSubOption(true);
        setPlaceholder("Substitute Player");
      }
    } else if (players.length === 4 && addSub) {
      setPlayers([...players, trimmed]);
      playerInput.current.value = "";
      setAddSub(false);
    } else {
      setError("Maximum Players reached!!");
    }
  }

  function handleEdit(index) {
    setEditIndex(index);
    playerInput.current.value = players[index];
    playerInput.current.focus();
  }

  function handleDelete(index) {
    const updated = players.filter((_, i) => i !== index);
    setPlayers(updated);
    if (editIndex === index) {
      setEditIndex(null);
      playerInput.current.value = "";
    }
    if (updated.length <= 4) {
      setShowSubOption(true);
      setAddSub(false);
      setPlaceholder(updated.length === 4 ? "Substitute Player" : `Player${updated.length + 1}`);
    }
  }

  function handleRegister() {
  if (players.length < 4) return setError("Minimum 4 players required");
  if (!teamName || !captainName) return setError("Team Name and Captain Name are required");

  setLoading(true);

  const newTeam = {
    Name: teamName,
    CaptainName: captainName,
    Players: {
      Player1: players[0],
      Player2: players[1],
      Player3: players[2],
      Player4: players[3],
      ...(players[4] && { Player5: players[4] })
    },
    payment: "pending"
  };

  // Optional API Call (can fail silently)
  fetch("/api/register", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(newTeam)
  })
    .catch(() => {
      console.warn("API not connected. Skipping backend registration.");
    })
    .finally(() => {
      localStorage.setItem("registeredTeam", JSON.stringify(newTeam));
      setStatusMessage("You are registered!! Please complete the payment.");
      setIsRegistered(true);
      setShowPopup(true);

      // Reset form
      setTeamName("");
      setCaptainName("");
      setPlayers([]);
      setShowSubOption(false);
      setAddSub(false);
      setEditIndex(null);
      setPlaceholder("Player1");
      setLoading(false);
    });
}

  const showInput = editIndex !== null || players.length < 4 || (players.length === 4 && addSub);

  return (
    <>
      <Intro />
      <div className={styles.hero}>
        <div className={styles.imageWrapper}>
          <Image src="/bg.jpeg" alt="Turrani Esports" width={0} height={0} style={{ width: "100%", height: "auto" }} />
        </div>
        <div className={styles.heading}>
          <div>
            <Image src="/icon.png" width={75} height={75} alt="Turrani Esports" className={styles.imageStyle} style={{ marginRight: "20px", borderRight: "1px solid white", "--clr": "cyan" }} />
            <Image src="/trophy.gif" width={45} height={45} alt="Trophy" className={styles.imageStyle} style={{ marginBottom: "15px", "--clr": "yellow" }} />
          </div>
          <h1>
            <span>Ultimate</span> <img src="/ff.svg" /> Toornament
          </h1>
        </div>
      </div>

      <Timer />

      {statusMessage ? (
        <div style={{
          background: "#0f1117",
          padding: "10px 15px",
          color: "#fff",
          marginBottom: "15px",
          borderRadius: "8px",
          border: "1px solid cyan",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          flexDirection: "column"
        }}>
          {statusMessage}
          {statusMessage == "You are registered!! Please complete the payment." ? (<><button
            type="button"
            onClick={() => setShowPopup(true)}
            style={{
              padding: "10px 25px",
              background: "linear-gradient(to right, #85dadc, #48a6a8)",
              color: "white",
              fontWeight: "bold",
              border: "none",
              borderRadius: "10px",
              margin: "15px 0",
              cursor: "pointer"
            }}
          > Pay Now!!</button></>) : (<>
            <a
            type="button"
            target="_blank"
            href="https://t.me/Turrani_esports?fbclid=PAZXh0bgNhZW0CMTEAAae-n_JhuG7IBkrojVwXFKlWCdHzQJOFudqjcpOWRcoBtx_94tUPYge5u1n3LA_aem_csBRsQSrcV3zk_JqwN96rw"
            style={{
              padding: "10px 25px",
              background: "linear-gradient(to right, #85dadc, #48a6a8)",
              color: "white",
              fontWeight: "bold",
              textDecoration: "none",
              border: "none",
              borderRadius: "10px",
              margin: "15px 0",
              cursor: "pointer"
            }}
          >Join Telegram Group!!</a>
          <span>You will get your RoomID Password here on 20 April...</span>
          </>)}
        </div>
      ) : (
        <div className={styles.form}>
          <h3>REGISTRATION...</h3>
          <form>
            {/* Team Name */}
            <div className={styles.form__group}>
              <input type="text" className={styles.form__field} placeholder="Team Name" value={teamName} onChange={(e) => setTeamName(e.target.value)} required disabled={isRegistered} />
              <label className={styles.form__label}>Team Name</label>
            </div>

            {/* Captain Name */}
            <div className={styles.form__group}>
              <input type="text" className={styles.form__field} placeholder="Captain Name" value={captainName} onChange={(e) => setCaptainName(e.target.value)} required disabled={isRegistered} />
              <label className={styles.form__label}>Captain Name</label>
            </div>

            {/* Players List */}
            <div className={styles.playersList}>
              <div className={styles.playersIndicator}>
                {players.map((_, i) => (
                  <div key={i}></div>
                ))}
              </div>
              <ul>
                {players.map((p, i) => (
                  <li key={i}>
                    &#10003; Player{i + 1}{" "}
                    <span style={{ color: "grey" }}> - {p}</span>
                    {!isRegistered && (
                      <>
                        <button type="button" onClick={() => handleEdit(i)} className={styles.iconButton}><CiEdit color="white" /></button>
                        <button type="button" onClick={() => handleDelete(i)} className={styles.iconButton}><MdDelete color="white" /></button>
                      </>
                    )}
                  </li>
                ))}
              </ul>
            </div>

            {/* Player Input */}
            {showInput && !isRegistered && (
              <div className={styles.form__group}>
                <input type="text" className={styles.form__field} placeholder={placeholder} name="Player" id="Player" ref={playerInput} onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    save(e.target.value);
                  }
                }} required />
                <label htmlFor="Player" className={styles.form__label}>{placeholder}</label>
                <span>
                  <Image
                    src={src}
                    width={20}
                    height={20}
                    alt="Fast Forward"
                    onMouseOver={() => setSrc("/fast-forward.gif")}
                    onMouseOut={() => setSrc("/fast-forward.png")}
                    onClick={() => save(playerInput.current.value)}
                  />
                </span>
                <p className={styles.error}>{error}</p>
              </div>
            )}

            {/* Substitute Checkbox */}
            {showSubOption && players.length === 4 && !isRegistered && (
              <div style={{ marginTop: "10px" }}>
                <label>
                  <input type="checkbox" onChange={(e) => setAddSub(e.target.checked)} style={{ background: "transparent", marginTop: "10px" }} />
                  &nbsp; Add Substitute Player
                </label>
              </div>
            )}

            {/* Register Button */}
            {!isRegistered && (
              <div style={{ marginTop: "20px" }}>
                <button
                  type="button"
                  onClick={handleRegister}
                  disabled={loading}
                  style={{
                    padding: "10px 25px",
                    background: loading ? "#aaa" : "linear-gradient(to right, #85dadc, #48a6a8)",
                    color: "white",
                    fontWeight: "bold",
                    border: "none",
                    borderRadius: "10px",
                    display: "flex",
                    alignItems: "center",
                    gap: "10px",
                    cursor: loading ? "not-allowed" : "pointer"
                  }}
                >
                  {loading ? (
                    <>
                      <span className={styles.spinner} /> Loading...
                    </>
                  ) : (
                    "Register & Pay"
                  )}
                </button>
              </div>
            )}
          </form>
        </div>
      )}
      {showPopup && <PaymentPopup onClose={() => setShowPopup(false)} />}
    </>
  );
}