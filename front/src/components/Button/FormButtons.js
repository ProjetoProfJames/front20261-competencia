export default function FormButtons({ onCancelar }) {
    return (
        <div>
            <button type="submit" style={{ marginRight: '10px', padding: '8px 15px' }}>Salvar</button>
            <button type="button" onClick={onCancelar} style={{ padding: '8px 15px' }}>Cancelar</button>
        </div>
    );
}
