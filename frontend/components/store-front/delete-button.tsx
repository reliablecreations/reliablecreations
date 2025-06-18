import { deleteLineItem } from "@/lib/data/cart";
import { Spinner, Trash } from "@medusajs/icons";
import { useState } from "react";
import styles from "@/styles/cart-delete-btn.module.css";

const DeleteButton = ({
  id,
  children,
  className = "",
}: {
  id: string;
  children?: React.ReactNode;
  className?: string;
}) => {
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = async (id: string) => {
    setIsDeleting(true);
    await deleteLineItem(id).catch(() => {
      setIsDeleting(false);
    });
  };

  return (
    <div className={`${styles.wrapper} ${className}`}>
      <button className={styles.button} onClick={() => handleDelete(id)}>
        {isDeleting ? <Spinner className={styles.spinner} /> : <Trash />}
        <span>{children}</span>
      </button>
    </div>
  );
};

export default DeleteButton;
