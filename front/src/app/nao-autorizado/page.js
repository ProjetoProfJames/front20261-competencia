'use client'
import Button from "@/components/Button";

export default function NaoAutorizadoPage() {
    return (
        <div className="page-content">
            <section className="content-panel">
            <h1>Acesso nao autorizado</h1>
            <p>Seu perfil nao possui permissao para acessar esta pagina.</p>
            <Button type="button" onClick={() => location.href = '/home'}>Voltar</Button>
            </section>
        </div>
    )
}
