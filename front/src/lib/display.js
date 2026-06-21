export function joinNames(items = []) {
  return items
    .map((item) => item?.nome || item?.username || item?.email || "")
    .filter(Boolean)
    .join(", ");
}

export function getDisplayName(item) {
  return item?.nome || item?.username || item?.email || "";
}
