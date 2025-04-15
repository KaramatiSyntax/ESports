"use client";

import styles from "./styles.module.css";
import Image from "next/image";
import { useState, useEffect } from "react";

export default function Intro() {
  const [isTimed, setIsTimed] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsTimed(true);
    }, 2000);

    return () => clearTimeout(timer); // Cleanup to prevent memory leaks
  }, []);

  if (isTimed) {
    return null;
  }

  return (
    <div className={styles.container}>
      <Image
        src="/icon.png"
        width={250}
        height={250}
        alt="Turrani Esports"
        className={styles.imageStyle}
      />
      <div className={styles.text}>
        Turrani <span>Esports</span>
      </div>
    </div>
  );
}