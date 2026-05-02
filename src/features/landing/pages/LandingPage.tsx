import { Link } from 'react-router-dom'
import { Button } from '@/components/ui/button'

export default function LandingPage() {
  return (
    <div className="flex min-h-screen flex-col bg-white">
      {/* Header */}
      <header className="fixed top-0 z-50 w-full border-b bg-white/80 backdrop-blur-md">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-2">
            <span className="text-2xl font-bold text-blue-600">IdeaFlow</span>
          </div>
          <nav className="hidden md:flex md:items-center md:space-x-8">
            <a href="#how-it-works" className="text-sm font-medium text-gray-700 hover:text-blue-600">Como Funciona</a>
            <a href="#" className="text-sm font-medium text-gray-700 hover:text-blue-600">Recursos</a>
            <Link to="/auth">
              <Button variant="ghost" className="text-blue-600">Entrar</Button>
            </Link>
            <Link to="/auth">
              <Button className="bg-blue-600 hover:bg-blue-700 text-white">Começar Grátis</Button>
            </Link>
          </nav>
        </div>
      </header>

      {/* Hero Section */}
      <main className="flex-grow pt-32">
        <section className="px-4 text-center sm:px-6 lg:px-8">
          <div className="mx-auto max-w-4xl">
            <h1 className="text-4xl font-extrabold tracking-tight text-gray-900 sm:text-6xl">
              Transforme suas <span className="text-blue-600">ideias</span> em projetos incríveis
            </h1>
            <p className="mx-auto mt-6 max-w-2xl text-xl text-gray-600">
              O CRM inteligente para quem quer organizar o caos criativo e transformar insights em realidade de forma profissional.
            </p>
            <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
              <Link to="/auth">
                <Button className="h-14 px-8 text-lg bg-blue-600 hover:bg-blue-700 text-white">
                  Criar minha conta grátis
                </Button>
              </Link>
              <a href="#how-it-works">
                <Button variant="outline" className="h-14 px-8 text-lg">
                  Ver como funciona
                </Button>
              </a>
            </div>
          </div>
        </section>

        {/* How it works */}
        <section id="how-it-works" className="bg-gray-50 py-24 mt-24">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="text-center">
              <h2 className="text-3xl font-bold text-gray-900">Simples, organizado e eficiente</h2>
              <p className="mt-4 text-gray-600">Três passos para o sucesso do seu projeto</p>
            </div>

            <div className="mt-16 grid grid-cols-1 gap-12 md:grid-cols-3">
              <div className="flex flex-col items-center text-center">
                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-blue-100 text-blue-600">
                  <span className="text-2xl font-bold">1</span>
                </div>
                <h3 className="mt-6 text-xl font-semibold">Capture a Ideia</h3>
                <p className="mt-2 text-gray-500">Registre insights rápidos antes que eles desapareçam.</p>
              </div>

              <div className="flex flex-col items-center text-center">
                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-blue-100 text-blue-600">
                  <span className="text-2xl font-bold">2</span>
                </div>
                <h3 className="mt-6 text-xl font-semibold">Estruture o Projeto</h3>
                <p className="mt-2 text-gray-500">Organize metas, prazos e recursos em um só lugar.</p>
              </div>

              <div className="flex flex-col items-center text-center">
                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-blue-100 text-blue-600">
                  <span className="text-2xl font-bold">3</span>
                </div>
                <h3 className="mt-6 text-xl font-semibold">Execute com IA</h3>
                <p className="mt-2 text-gray-500">Use nossa inteligência para acelerar o desenvolvimento.</p>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t py-12">
        <div className="mx-auto max-w-7xl px-4 text-center text-gray-500">
          <p>&copy; 2026 IdeaFlow. Todos os direitos reservados.</p>
        </div>
      </footer>
    </div>
  )
}
