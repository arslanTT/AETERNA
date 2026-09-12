import * as THREE from "three";

export const WATCH_SCALE = 0.115;
export const WATCH_CENTER_OFFSET = { y: 0.22, z: 0.25 };

export function getWatchCenter(scale = WATCH_SCALE): THREE.Vector3 {
  return new THREE.Vector3(
    0,
    WATCH_CENTER_OFFSET.y * scale,
    WATCH_CENTER_OFFSET.z * scale,
  );
}

/** Clone a GLTF scene so two canvases never share materials or transforms. */
export function cloneWatchScene(
  scene: THREE.Object3D,
  scale = WATCH_SCALE,
): THREE.Group {
  const clone = scene.clone(true) as THREE.Group;

  clone.traverse((child) => {
    const mesh = child as THREE.Mesh;
    if (!mesh.isMesh) return;

    if (Array.isArray(mesh.material)) {
      mesh.material = mesh.material.map((material) => material.clone());
    } else if (mesh.material) {
      mesh.material = mesh.material.clone();
    }
  });

  clone.scale.setScalar(scale);
  clone.position.copy(getWatchCenter(scale));
  return clone;
}
