import { useState, useEffect, useRef } from "react";

/**
 * https://usehooks.com/useHover/
 * 
 * Определите, наводит ли мышь на элемент. 
 * Хук возвращает ссылку и логическое значение, 
 * указывающее, находится ли в данный момент 
 * элемент с этой ссылкой. Просто добавьте возвращенную 
 * ссылку к любому элементу, состояние наведения которого 
 * вы хотите отслеживать. Одна потенциальная ошибка с 
 * этим методом : если у вас есть логика, которая изменяет 
 * hoverRef добавляемый элемент, тогда ваши прослушиватели  
 * событий не обязательно будут применяться к новому элементу. 
 * Если вам нужна эта функция, используйте эту альтернативную версию, 
 * в которой используется обратный вызов ref.
 */

// // Usage
// function App() {
//     const [hoverRef, isHovered] = useHover();
//     return <div ref={hoverRef}>{isHovered ? "😁" : "☹️"}</div>;
// }


// Hook
function useHover() {
    const [value, setValue] = useState(false);
    const ref = useRef(null);
    const handleMouseOver = () => setValue(true);
    const handleMouseOut = () => setValue(false);
    useEffect(
        () => {
            const node = ref.current;
            if (node) {
                node.addEventListener("mouseover", handleMouseOver);
                node.addEventListener("mouseout", handleMouseOut);
                return () => {
                node.removeEventListener("mouseover", handleMouseOver);
                node.removeEventListener("mouseout", handleMouseOut);
                };
            }
        },
        [ref.current] // Recall only if ref changes
    );
    return [ref, value];
}

export default useHover