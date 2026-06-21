export default function RecordActions({ canEdit, canDelete, onEdit, onDelete }) {
  return (
    <div>
      {canEdit ? <button type="button" onClick={onEdit}>Editar</button> : null}
      {" "}
      {canDelete ? <button type="button" onClick={onDelete}>Excluir</button> : null}
    </div>
  );
}
