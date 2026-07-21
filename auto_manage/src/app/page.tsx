import Grid from "@/app/components/Grid";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-zinc-950 p-24">
      <h1 className="text-xl font-semibold text-zinc-200 mb-6">Mi Panel de Actividad</h1>
      
      {/* Aquí se dibuja tu mosaico */}
      <Grid /> 
      
    </main>
  );
}
