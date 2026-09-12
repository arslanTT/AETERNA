import HeroScene from "@/components/scenes/HeroScene";
import ExploreScene from "@/components/scenes/ExploreScene";
import MovementScene from "@/components/scenes/MovementScene";
import CustomizeScene from "@/components/scenes/CustomizeScene";
import OwnScene from "@/components/scenes/OwnScene";
import SceneNav from "@/components/ui/SceneNav";

export default function Home() {
  return (
    <main className="relative w-full bg-bg-base">
      <SceneNav />

      <div id="scene-hero">
        <HeroScene />
      </div>

      <div id="scene-explore">
        <ExploreScene />
      </div>

      <div id="scene-movement">
        <MovementScene />
      </div>

      <div id="scene-customize">
        <CustomizeScene />
      </div>

      <div id="scene-own">
        <OwnScene />
      </div>
    </main>
  );
}
