"use client";

import { useState } from "react";
import Button from "../Button/Button";
import styles from "./MenuCard.module.css";

export default function MenuCard({ title, description, icon, onClick, buttonText = "Acessar" }) {
  const [hovered, setHovered] = useState(false);

  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      className={hovered ? styles.cardHovered : styles.card}
    >
      <div className={hovered ? styles.iconWrapperHovered : styles.iconWrapper}>
        {icon}
      </div>

      <h2 className={styles.title}>
        {title}
      </h2>

      <p className={styles.description}>
        {description}
      </p>

      <Button 
        onClick={onClick}
        style={{ width: "100%" }}
      >
        {buttonText}
      </Button>
    </div>
  );
}
