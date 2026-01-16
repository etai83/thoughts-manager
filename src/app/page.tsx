import Canvas from "@/components/Canvas";
import Sidebar from "@/components/Sidebar";

export default function Home() {
  return (
    <main className="flex h-screen w-screen overflow-hidden bg-gray-50">
      <Sidebar />
      <div className="flex-1 relative h-full">
        <Canvas />
      </div>
    </main>
  );
}
