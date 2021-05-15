import { useState, useEffect } from "react";

/**
 * https://usehooks.com/useKeyPress
 * 
 * Этот хук позволяет легко обнаружить, когда пользователь нажимает 
 * определенную клавишу на своей клавиатуре. Рецепт довольно прост, 
 * так как я хочу показать, как мало кода требуется, но я призываю 
 * всех читателей создать более продвинутую версию этой ловушки. 
 * Обнаружение одновременного нажатия нескольких клавиш было бы 
 * хорошим дополнением. Бонусные баллы: также необходимо, чтобы 
 * они удерживались в указанном порядке. Не стесняйтесь делиться всем, 
 * что вы создали по сути этого рецепта .
 */


// // Usage
// function App() {
//   // Call our hook for each key that we'd like to monitor
//   const happyPress = useKeyPress("h");
//   const sadPress = useKeyPress("s");
//   const robotPress = useKeyPress("r");
//   const foxPress = useKeyPress("f");
//   return (
//     <div>
//       <div>h, s, r, f</div>
//       <div>
//         {happyPress && "😊"}
//         {sadPress && "😢"}
//         {robotPress && "🤖"}
//         {foxPress && "🦊"}
//       </div>
//     </div>
//   );
// }

// Hook
function useKeyPress(targetKey) {
  // State for keeping track of whether key is pressed
  const [keyPressed, setKeyPressed] = useState<boolean>(false);
  // If pressed key is our target key then set to true
  function downHandler({ key }) {
    if (key === targetKey) {
      setKeyPressed(true);
    }
  }
  // If released key is our target key then set to false
  const upHandler = ({ key }) => {
    if (key === targetKey) {
      setKeyPressed(false);
    }
  };
  // Add event listeners
  useEffect(() => {
    window.addEventListener("keydown", downHandler);
    window.addEventListener("keyup", upHandler);
    // Remove event listeners on cleanup
    return () => {
      window.removeEventListener("keydown", downHandler);
      window.removeEventListener("keyup", upHandler);
    };
  }, []); // Empty array ensures that effect is only run on mount and unmount
  return keyPressed;
}

export default useKeyPress