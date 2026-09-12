"use client";

import { useEffect, useRef } from "react";
import { useThree } from "@react-three/fiber";
import * as THREE from "three";

interface DragRotateProps {
  groupRef: React.RefObject<THREE.Group>;
  enabled: boolean;
}

export default function DragRotate({ groupRef, enabled }: DragRotateProps) {
  const { gl, camera } = useThree();
  const isDraggingRef = useRef(false);
  const lastPointerRef = useRef({ x: 0, y: 0 });
  const velocityRef = useRef({ x: 0, y: 0 });

  useEffect(() => {
    const domElement = gl.domElement;
    if (!domElement) return;

    const onPointerDown = (e: PointerEvent) => {
      if (!enabled) return;
      // Only left click / touch
      isDraggingRef.current = true;
      lastPointerRef.current = { x: e.clientX, y: e.clientY };
      velocityRef.current = { x: 0, y: 0 };
      domElement.style.cursor = "grabbing";
    };

    const onPointerMove = (e: PointerEvent) => {
      if (!isDraggingRef.current || !groupRef.current) return;

      const dx = e.clientX - lastPointerRef.current.x;
      const dy = e.clientY - lastPointerRef.current.y;

      const rotY = dx * 0.005;
      const rotX = dy * 0.005;

      groupRef.current.rotation.y += rotY;
      groupRef.current.rotation.x = THREE.MathUtils.clamp(
        groupRef.current.rotation.x + rotX,
        -Math.PI / 3,
        Math.PI / 3,
      );

      velocityRef.current.x = rotY;
      velocityRef.current.y = rotX;

      lastPointerRef.current = { x: e.clientX, y: e.clientY };
    };

    const onPointerUp = () => {
      isDraggingRef.current = false;
      domElement.style.cursor = "auto";
    };

    domElement.addEventListener("pointerdown", onPointerDown);
    window.addEventListener("pointermove", onPointerMove);
    window.addEventListener("pointerup", onPointerUp);

    return () => {
      domElement.removeEventListener("pointerdown", onPointerDown);
      window.removeEventListener("pointermove", onPointerMove);
      window.removeEventListener("pointerup", onPointerUp);
    };
  }, [gl, groupRef, enabled]);

  return null;
}
