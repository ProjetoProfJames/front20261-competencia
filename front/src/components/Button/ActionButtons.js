export default function ActionButtons({ onEditar, onExcluir }) {
    return (
        <>
            <button onClick={onEditar} style={{ marginRight: '10px' }}>Editar</button>
            <button onClick={onExcluir}>Excluir</button>
        </>
    );
}
