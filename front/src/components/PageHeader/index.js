export default function PageHeader({ titulo, labelBotao, onNovo }) {
    return (
        <>
            <h2>{titulo}</h2>
            <button onClick={onNovo} style={{ marginBottom: '20px', padding: '8px' }}>{labelBotao}</button>
        </>
    );
}
