import { useEffect, useRef } from "react";

const useLoveClick = () => {

    const heartsRef = useRef<{ [key: number]: HTMLImageElement | null }>({});
    const heartIdCounter = useRef(0);
    const imgRef = useRef(1)

    useEffect(() => {
        const handleClick = (e: MouseEvent): void => {
            // 获取鼠标点击的位置
            const x = e.pageX;
            const y = e.pageY;

            // 创建爱心图片元素
            const heart: HTMLImageElement = document.createElement('img');
            const heartId = heartIdCounter.current++; // 分配唯一 ID
            heart.src = `/love-click${imgRef.current.toString()}.jpg`; // 设置图片路径
            heart.className = 'heart';
            heart.style.position = 'absolute';
            heart.style.left = `${x}px`;
            heart.style.top = `${y}px`;
            heart.id = `heart-${heartId}`; // 设置唯一 ID 属性
            if (imgRef.current >= 12) {
                imgRef.current = 1;
            } else {
                imgRef.current = imgRef.current + 1;
            }


            // 将爱心图片元素添加到页面中
            document.body.appendChild(heart);
            heartsRef.current[heartId] = heart; // 存储引用

            // 1 秒后移除爱心图片元素
            setTimeout(() => {
                if (heartsRef.current[heartId]) {
                    document.body.removeChild(heartsRef.current[heartId]);
                    delete heartsRef.current[heartId]; // 清理引用
                }
            }, 2000);
        };

        // 添加全局点击事件监听器
        window.addEventListener('click', handleClick);

        // 组件卸载时移除事件监听器
        return () => {
            window.removeEventListener('click', handleClick);
            Object.keys(heartsRef.current).forEach((id) => {
                const heart = heartsRef.current[parseInt(id)];
                if (heart) {
                    document.body.removeChild(heart);
                }
            });
            heartsRef.current = {};
        };
    }, []);

    return {
        heartsRef
    }
}

export default useLoveClick;