import React, { useEffect, useState } from 'react';
import Lottie from 'lottie-react';

// 定义组件接收的参数：当动画播完时，通知父组件 (App)
type LoadingScreenProps = {
  onComplete?: () => void;
};

export const LoadingScreen: React.FC<LoadingScreenProps> = ({ onComplete }) => {
  // 定义 Lottie 播放器的引用
  const lottieRef = React.useRef<any>(null);

  // 这里的 path 指向的是 public 文件夹下的路径
  // 浏览器会去 http://你的域名/loading/data.json 找文件
  const animationPath = "/loading/data.json";

  return (
    // 全屏遮罩层，背景色设为你的主题色 #F5F3EF (米色)
    <div className="fixed inset-0 z-[9999] bg-[#F5F3EF] flex flex-col items-center justify-center">
      
      {/* 动画容器：控制宽度，避免动画太大或太小 */}
      <div className="w-full max-w-5xl px-4 relative">
        <Lottie
          lottieRef={lottieRef}
          path={animationPath} // 关键：使用 path 模式，这样它会自动去 loading/images 找图片
          loop={false}         // 设置为不循环，播完一次就停
          autoplay={true}      // 自动播放
          
          // 监听事件：当动画播放结束时
          onComplete={() => {
            // 延迟 500ms 再关闭，让用户看清最后一帧，体验更平滑
            setTimeout(() => {
              if (onComplete) onComplete();
            }, 500);
          }}
          
          style={{ width: '100%', height: 'auto' }}
        />
      </div>

      {/* 底部装饰文字：增加复古科幻感 */}
      <div className="absolute bottom-12 text-[#00A651] font-mono text-xs tracking-[0.3em] animate-pulse">
        SYSTEM_INITIALIZING...
      </div>
    </div>
  );
};