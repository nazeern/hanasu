"use client";

export function PopupWrapper({
  children,
  hideModal,
}: {
  children: React.ReactNode;
  hideModal: () => void;
}) {
  return (
    <div
      className="fixed inset-0 z-50"
      onClick={(e) => {
        e.stopPropagation();
        hideModal();
      }}
    >
      {children}
    </div>
  );
}
