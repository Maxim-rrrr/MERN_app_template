import { useState, useRef, useEffect, useCallback } from "react";

/**
 * https://usehooks.com/useEventListener/
 * 
 * Если вы обнаружите, что добавляете много прослушивателей событий, 
 * useEffect вы можете подумать о переносе этой логики в настраиваемый обработчик. 
 * В приведенном ниже рецепте мы создаем useEventListener ловушку, 
 * которая обрабатывает проверку наличия addEventListener поддержки, 
 * добавление прослушивателя событий и удаление при очистке. 
 * Посмотрите его в действии в демонстрации CodeSandbox .
 */

// // Usage
// function App() {
//   // State for storing mouse coordinates
//   const [coords, setCoords] = useState({ x: 0, y: 0 });
//   // Event handler utilizing useCallback ...
//   // ... so that reference never changes.
//   const handler = useCallback(
//     ({ clientX, clientY }) => {
//       // Update coordinates
//       setCoords({ x: clientX, y: clientY });
//     },
//     [setCoords]
//   );
//   // Add event listener using our hook
//   useEventListener("mousemove", handler);
//   return (
//     <h1>
//       The mouse position is ({coords.x}, {coords.y})
//     </h1>
//   );
// }


// Hook
function useEventListener(eventName, handler, element = window) {
  // Create a ref that stores handler
  const savedHandler = useRef();
  // Update ref.current value if handler changes.
  // This allows our effect below to always get latest handler ...
  // ... without us needing to pass it in effect deps array ...
  // ... and potentially cause effect to re-run every render.
  useEffect(() => {
    savedHandler.current = handler;
  }, [handler]);

  useEffect(
    () => {
      // Make sure element supports addEventListener
      // On
      const isSupported = element && element.addEventListener;
      if (!isSupported) return;
      // Create event listener that calls handler function stored in ref
      const eventListener = (event) => savedHandler.current(event);
      // Add event listener
      element.addEventListener(eventName, eventListener);
      // Remove event listener on cleanup
      return () => {
        element.removeEventListener(eventName, eventListener);
      };
    },
    [eventName, element] // Re-run if eventName or element changes
  );
}

export default useEventListener