import { useState, useLayoutEffect } from "react";

/**
 * https://usehooks.com/useLockBodyScroll
 * 
 * Иногда вы хотите, чтобы ваши пользователи не могли прокручивать тело вашей страницы, 
 * в то время как определенный компонент абсолютно расположен над вашей страницей 
 * (подумайте о модальном или полноэкранном мобильном меню). Видеть прокрутку фонового 
 * содержимого под модальным окном может сбивать с толку, особенно если вы намеревались 
 * прокрутить область внутри модального окна. Что ж, этот крючок решает эту проблему! 
 * Просто вызовите ловушку useLockBodyScroll в любом компоненте, и прокрутка тела будет 
 * заблокирована до тех пор, пока этот компонент не будет отключен. 
 * Посмотрите его в действии в демонстрации CodeSandbox .
 */

// // Usage
// function App() {
//   // State for our modal
//   const [modalOpen, setModalOpen] = useState(false);
//   return (
//     <div>
//       <button onClick={() => setModalOpen(true)}>Show Modal</button>
//       <Content />
//       {modalOpen && (
//         <Modal
//           title="Try scrolling"
//           content="I bet you you can't! Muahahaha 😈"
//           onClose={() => setModalOpen(false)}
//         />
//       )}
//     </div>
//   );
// }
// function Modal({ title, content, onClose }) {
//   // Call hook to lock body scroll
//   useLockBodyScroll();
//   return (
//     <div className="modal-overlay" onClick={onClose}>
//       <div className="modal">
//         <h2>{title}</h2>
//         <p>{content}</p>
//       </div>
//     </div>
//   );
// }


// Hook
function useLockBodyScroll() {
  useLayoutEffect(() => {
    // Get original body overflow
    const originalStyle = window.getComputedStyle(document.body).overflow;
    // Prevent scrolling on mount
    document.body.style.overflow = "hidden";
    // Re-enable scrolling when component unmounts
    return () => (document.body.style.overflow = originalStyle);
  }, []); // Empty array ensures effect is only run on mount and unmount
}

export default useLockBodyScroll