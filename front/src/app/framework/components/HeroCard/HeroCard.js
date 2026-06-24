"use client";

import Col from "../Layouts/Col";
import styles from "./HeroCard.module.css";

export default function HeroCard({ title, description, icon, children }) {
  return (
    <div className={styles.card}>
      <Col>
        {icon && (
          <div className={styles.iconWrapper}>
            {icon}
          </div>
        )}
        
        <h1 className={styles.title}>
          {title}
        </h1>
        
        <p className={styles.description}>
          {description}
        </p>

        {children}
      </Col>
    </div>
  );
}
