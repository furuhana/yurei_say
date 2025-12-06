import React, { useEffect, useState } from 'react';
import Lottie from 'lottie-react';

type LoadingScreenProps = {
  onComplete?: () => void;
};

export const LoadingScreen: React.FC<LoadingScreenProps> = ({ onComplete }) => {
  const lottieRef = React.useRef<any>(null);
  const animationPath = "/loading/data.json";

  return (
    // 1. 外层容器：确保它是固定定位，占满全屏
    <div className="fixed inset-0 z-[9999] bg-[#F5F3EF] overflow-hidden">
      
      {/* 2. Lottie 组件：直接作为背景铺满 */}
      <Lottie
        lottieRef={lottieRef}
        path={animationPath}
        loop={false}
        autoplay={true}
        onComplete={() => {
          setTimeout(() => {
            if (onComplete) onComplete();
          }, 500);
        }}
        
        // --- 核心修改在这里 ---
        
        // A. 强制宽高为视口大小
        style={{ 
          width: '100vw', 
          height: '100vh',
          position: 'absolute',
          top: 0,
          left: 0
        }}
        
        // B. 关键设置：'xMidYMid slice' 相当于 CSS 的 object-fit: cover
        // 意思是：保持比例缩放，直到填满整个容器，多余的部分裁切掉。
        rendererSettings={{
          preserveAspectRatio: 'xMidYMid slice'
        }}
      />

      {/* 底部装饰文字：加 absolute 确保浮在动画上面 */}
      <div className="absolute bottom-12 left-0 w-full text-center pointer-events-none">
        <span className="text-[#00A651] font-mono text-xs tracking-[0.3em] animate-pulse bg-[#F5F3EF]/80 px-2 py-1">
          SYSTEM_INITIALIZING...
        </span>
      </div>
    </div>
  );
};