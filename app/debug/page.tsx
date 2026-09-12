"use client";

import { Canvas } from "@react-three/fiber";
import { useGLTF } from "@react-three/drei";
import { useEffect } from "react";
import * as THREE from "three";

function Inspector() {
  const { scene } = useGLTF("/models/watch.glb");

  useEffect(() => {
    console.log("========== WATCH GLB INSPECTION ==========");

    // Walk the whole tree
    const allNodes: THREE.Object3D[] = [];
    scene.traverse((child) => {
      allNodes.push(child);
    });

    console.log("\n--- ALL NODES ---");
    allNodes.forEach((node) => {
      console.log(
        `[${node.type}] "${node.name}"  children: ${node.children.length}`,
      );
    });

    // Now collect meshes and their materials
    console.log("\n--- MESHES & MATERIALS ---");
    const meshList: {
      path: string;
      meshName: string;
      materialNames: string[];
      materialColors: string[];
      materialTypes: string[];
      hasMap: boolean[];
    }[] = [];

    scene.traverse((child) => {
      if ((child as THREE.Mesh).isMesh) {
        const mesh = child as THREE.Mesh;

        // Build path from root
        const path: string[] = [];
        let current: THREE.Object3D | null = mesh;
        while (current && current !== scene) {
          if (current.name) path.unshift(current.name);
          current = current.parent;
        }
        const pathStr = path.join(" / ");

        const materials = Array.isArray(mesh.material)
          ? mesh.material
          : [mesh.material];

        const materialNames = materials.map((m) => m.name || "(unnamed)");
        const materialColors = materials.map((m) => {
          if (m instanceof THREE.MeshStandardMaterial) {
            return "#" + m.color.getHexString();
          }
          return "(non-standard)";
        });
        const materialTypes = materials.map((m) => m.type);
        const hasMap = materials.map((m) => {
          if (m instanceof THREE.MeshStandardMaterial) {
            return m.map !== null;
          }
          return false;
        });

        meshList.push({
          path: pathStr,
          meshName: mesh.name || "(unnamed)",
          materialNames,
          materialColors,
          materialTypes,
          hasMap,
        });

        console.log(`\nMesh: "${mesh.name}"`);
        console.log(`  Path: ${pathStr}`);
        console.log(`  Materials: ${materialNames.join(", ")}`);
        console.log(`  Colors: ${materialColors.join(", ")}`);
        console.log(`  Types: ${materialTypes.join(", ")}`);
        console.log(`  Has Texture Map: ${hasMap.join(", ")}`);

        if (
          materials.length > 0 &&
          materials[0] instanceof THREE.MeshStandardMaterial
        ) {
          const m = materials[0];
          console.log(`  Metalness: ${m.metalness}, Roughness: ${m.roughness}`);
        }
      }
    });

    // Now group meshes by top-level named parent
    console.log("\n\n--- GROUPED BY TOP-LEVEL PART ---");
    const topLevelParts = [
      "FinalStrap1",
      "FinalStrap2",
      "strapClip",
      "Watch",
      "Men",
      "watchGlass",
      "watchBottom",
      "WatchshellTop",
    ];

    topLevelParts.forEach((partName) => {
      const part = scene.getObjectByName(partName);
      if (!part) {
        console.log(`\n!!! PART NOT FOUND: "${partName}"`);
        return;
      }

      console.log(`\n=== Part: "${partName}" ===`);
      console.log(`  Type: ${part.type}, children: ${part.children.length}`);
      console.log(
        `  Position: (${part.position.x}, ${part.position.y}, ${part.position.z})`,
      );

      const partMaterialNames = new Set<string>();
      part.traverse((child) => {
        if ((child as THREE.Mesh).isMesh) {
          const mesh = child as THREE.Mesh;
          const materials = Array.isArray(mesh.material)
            ? mesh.material
            : [mesh.material];
          materials.forEach((m) => {
            partMaterialNames.add(m.name || "(unnamed)");
          });
          console.log(
            `    - Mesh: "${mesh.name}" | Materials: ${materials
              .map((m) => `"${m.name}"`)
              .join(", ")}`,
          );
        }
      });

      console.log(
        `  ALL Materials in this part: ${Array.from(partMaterialNames).join(", ")}`,
      );
    });

    // Global material list
    console.log("\n\n--- UNIQUE MATERIALS ---");
    const uniqueMaterials = new Map<string, THREE.Material>();
    scene.traverse((child) => {
      if ((child as THREE.Mesh).isMesh) {
        const mesh = child as THREE.Mesh;
        const materials = Array.isArray(mesh.material)
          ? mesh.material
          : [mesh.material];
        materials.forEach((m) => {
          const key = `${m.name}__${m.uuid}`;
          uniqueMaterials.set(key, m);
        });
      }
    });

    uniqueMaterials.forEach((m, key) => {
      const [name] = key.split("__");
      console.log(`Material "${name}" (${m.type})`);
      if (m instanceof THREE.MeshStandardMaterial) {
        console.log(`  Color: #${m.color.getHexString()}`);
        console.log(`  Metalness: ${m.metalness}, Roughness: ${m.roughness}`);
        console.log(`  Has Map: ${m.map !== null}`);
        console.log(`  Has Normal Map: ${m.normalMap !== null}`);
        console.log(`  Has Roughness Map: ${m.roughnessMap !== null}`);
        console.log(`  Has Metalness Map: ${m.metalnessMap !== null}`);
      }
    });

    console.log("\n========== END INSPECTION ==========");
  }, [scene]);

  return null;
}

export default function DebugPage() {
  return (
    <div style={{ width: "100vw", height: "100vh", background: "#111" }}>
      <Canvas>
        <Inspector />
      </Canvas>
    </div>
  );
}
