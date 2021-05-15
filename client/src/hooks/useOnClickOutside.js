import { useState, useEffect, useRef } from "react";

/**
 * https://usehooks.com/useOnClickOutside
 * 
 * Этот хук позволяет обнаруживать клики за пределами указанного элемента. 
 * В приведенном ниже примере мы используем его для закрытия модального 
 * окна при щелчке любого элемента вне модального окна. Преобразуя эту 
 * логику в ловушку, мы можем легко использовать ее во всех наших компонентах, 
 * которые нуждаются в такой функциональности (раскрывающиеся меню, всплывающие подсказки и т. Д.).
 */

// // Usage
// function App() {
//   // Create a ref that we add to the element for which we want to detect outside clicks
//   const ref = useRef();
//   // State for our modal
//   const [isModalOpen, setModalOpen] = useState(false);
//   // Call hook passing in the ref and a function to call on outside click
//   useOnClickOutside(ref, () => setModalOpen(false));
//   return (
//     <div>
//       {isModalOpen ? (
//         <div ref={ref}>
//           👋 Hey, I'm a modal. Click anywhere outside of me to close.
//         </div>
//       ) : (
//         <button onClick={() => setModalOpen(true)}>Open Modal</button>
//       )}
//     </div>
//   );
// }


// Hook
function useOnClickOutside(ref, handler) {
  useEffect(
    () => {
      const listener = (event) => {
        // Do nothing if clicking ref's element or descendent elements
        if (!ref.current || ref.current.contains(event.target)) {
          return;
        }
        handler(event);
      };
      document.addEventListener("mousedown", listener);
      document.addEventListener("touchstart", listener);
      return () => {
        document.removeEventListener("mousedown", listener);
        document.removeEventListener("touchstart", listener);
      };
    },
    // Add ref and handler to effect dependencies
    // It's worth noting that because passed in handler is a new ...
    // ... function on every render that will cause this effect ...
    // ... callback/cleanup to run every render. It's not a big deal ...
    // ... but to optimize you can wrap handler in useCallback before ...
    // ... passing it into this hook.
    [ref, handler]
  );
}

export default useOnClickOutside