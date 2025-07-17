import { Dialog, Transition } from "@headlessui/react";
import React, { Fragment } from "react";
import { BiX } from "react-icons/bi";
import { ModalProvider, useModal } from "@/lib/context/modal-context";
import styles from "./modal.module.css";

type ModalProps = {
  isOpen: boolean;
  close: () => void;
  size?: "small" | "medium" | "large";
  search?: boolean;
  children: React.ReactNode;
  "data-testid"?: string;
};

const Modal = ({
  isOpen,
  close,
  size = "medium",
  search = false,
  children,
  "data-testid": dataTestId,
}: ModalProps) => {
  return (
    <Transition appear show={isOpen} as={Fragment}>
      <Dialog as="div" className={styles.modalDialog} onClose={close}>
        <Transition.Child
          as={Fragment}
          enter={`${styles.transitionEaseOut}`}
          enterFrom={styles.opacity0}
          enterTo={styles.opacity100}
          leave={`${styles.transitionEaseIn}`}
          leaveFrom={styles.opacity100}
          leaveTo={styles.opacity0}
        >
          <div className={styles.modalOverlay} />
        </Transition.Child>

        <div className={styles.modalContainer}>
          <div
            className={`${styles.modalContent} ${
              search ? styles.modalContentTop : styles.modalContentCentered
            }`}
          >
            <Transition.Child
              as={Fragment}
              enter={`${styles.transitionEaseOut}`}
              enterFrom={`${styles.opacity0} ${styles.scale95}`}
              enterTo={`${styles.opacity100} ${styles.scale100}`}
              leave={`${styles.transitionEaseIn}`}
              leaveFrom={`${styles.opacity100} ${styles.scale100}`}
              leaveTo={`${styles.opacity0} ${styles.scale95}`}
            >
              <Dialog.Panel
                data-testid={dataTestId}
                className={`${styles.modalPanel} ${
                  size === "small"
                    ? styles.modalPanelSmall
                    : size === "large"
                    ? styles.modalPanelLarge
                    : styles.modalPanelMedium
                } ${
                  search ? styles.modalPanelSearch : styles.modalPanelDefault
                }`}
              >
                <ModalProvider close={close}>{children}</ModalProvider>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
};

const Title: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { close } = useModal();

  return (
    <Dialog.Title className={styles.title}>
      <div className="text-base-semi">{children}</div>
      <div className={styles.titleCloseButton}>
        <button onClick={close} data-testid="close-modal-button">
          <BiX size={20} />
        </button>
      </div>
    </Dialog.Title>
  );
};

const Description: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <Dialog.Description className={styles.description}>
      {children}
    </Dialog.Description>
  );
};

const Body: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return <div className={styles.body}>{children}</div>;
};

const Footer: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return <div className={styles.footer}>{children}</div>;
};

Modal.Title = Title;
Modal.Description = Description;
Modal.Body = Body;
Modal.Footer = Footer;

export default Modal;
