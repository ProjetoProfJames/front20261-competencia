export function selectedValues(event) {
  return Array.from(event.target.selectedOptions).map((option) => option.value);
}

export function names(items, field = "nome") {
  if (!items?.length) {
    return "-";
  }

  return items.map((item) => item[field] || item.username || item.email).join(", ");
}

export function userName(user) {
  if (!user) {
    return "-";
  }

  return user.username ? `${user.username} (${user.email})` : user.email;
}
