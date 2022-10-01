const toggleDeleteAlert = () => {
  const deleteAlert = document.getElementById('delete-alert');
  deleteAlert.classList.toggle('invisible');
}

const deleteToggler = document.getElementById('delete-alert-toggler');
deleteToggler.addEventListener('click', toggleDeleteAlert);