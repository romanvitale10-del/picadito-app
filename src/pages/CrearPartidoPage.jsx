import Navbar from '../components/common/Navbar';
import CrearPartidoForm from '../components/partidos/CrearPartidoForm';

export default function CrearPartidoPage() {
  return (
    <>
      <Navbar />
      
      <main className="container-app py-6 pb-24 md:pb-6">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            ⚽ Crear Nuevo Partido
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Completa los datos y encuentra jugadores para tu partido
          </p>
        </div>

        <CrearPartidoForm />
      </main>
    </>
  );
}
