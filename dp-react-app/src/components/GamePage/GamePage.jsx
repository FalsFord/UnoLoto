import React from "react";
import { Unity, useUnityContext } from 'react-unity-webgl';

const GamePage = () => {
  const {
    unityProvider
  } = useUnityContext({
    loaderUrl: "./build/Build/Build.loader.js",
    dataUrl: "./build/Build/Build.data",
    frameworkUrl: "./build/Build/Build.framework.js",
    codeUrl: "./build/Build/Build.wasm",
    webglContextAttributes: {
      preserveDrawingBuffer: true,
    },
  });
  return (
    <Unity unityProvider={unityProvider} style={{ width: 940, height: 540 }} />
  );
}

export default GamePage;